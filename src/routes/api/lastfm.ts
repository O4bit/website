import https from 'node:https';
import type { APIEvent } from '@solidjs/start/server';

export interface TrackData {
    status: 'success' | 'idle' | 'error';
    nowPlaying: boolean;
    track: string;
    artist: string;
    album: string | null;
    trackUrl: string;
    artistUrl: string;
    image: string | null;
    message?: string;
}

function fetchHtml(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = https.get(
            url,
            {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Cache-Control': 'no-cache',
                },
                timeout: 8000,
            },
            res => {
                // Follow redirects
                if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    fetchHtml(res.headers.location).then(resolve).catch(reject);
                    return;
                }
                let data = '';
                res.on('data', chunk => (data += chunk));
                res.on('end', () => resolve(data));
            },
        );
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
}

function attr(html: string, attrName: string): string | null {
    const re = new RegExp(`${attrName}="([^"]*)"`, 'i');
    const m = html.match(re);
    return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim() : null;
}

async function scrapeLastFm(username: string): Promise<TrackData> {
    const html = await fetchHtml(`https://www.last.fm/user/${username}`);

    // Find the first chartlist row (may be now-scrobbling)
    const rowMatch = html.match(/<tr[\s\S]*?class="[\s\S]*?chartlist-row[\s\S]*?"[\s\S]*?>([\s\S]*?)<\/tr>/);
    if (!rowMatch) {
        return {
            status: 'idle',
            nowPlaying: false,
            track: '',
            artist: '',
            album: null,
            trackUrl: `https://www.last.fm/user/${username}`,
            artistUrl: `https://www.last.fm/user/${username}`,
            image: null,
            message: 'No recent scrobbles found',
        };
    }

    const fullRow = rowMatch[0];
    const isNowPlaying = fullRow.includes('chartlist-row--now-scrobbling');

    // Use data-* attributes from the play button anchor — most reliable source
    const playLinkMatch = fullRow.match(/<a[\s\S]*?class="[\s\S]*?chartlist-play-button[\s\S]*?"([\s\S]*?)>/);
    const playLinkAttrs = playLinkMatch ? playLinkMatch[1] : fullRow;

    const trackName = attr(playLinkAttrs, 'data-track-name') ?? 'Unknown Track';
    const artistName = attr(playLinkAttrs, 'data-artist-name') ?? 'Unknown Artist';
    const trackPath = attr(playLinkAttrs, 'data-track-url');
    const artistPath = attr(playLinkAttrs, 'data-artist-url');

    const trackUrl = trackPath ? `https://www.last.fm${trackPath}` : `https://www.last.fm/user/${username}`;
    const artistUrl = artistPath ? `https://www.last.fm${artistPath}` : `https://www.last.fm/user/${username}`;

    // Extract album art from the chartlist-image cell
    const imgCellMatch = fullRow.match(/<td[^>]*chartlist-image[^>]*>([\s\S]*?)<\/td>/);
    let image: string | null = null;
    if (imgCellMatch) {
        const imgMatch = imgCellMatch[1].match(/<img[^>]*src="([^"]+)"/);
        if (imgMatch) {
            // Upgrade from 64s thumbnail to 300s for better quality
            image = imgMatch[1].replace(/\/\d+s\//, '/300s/');
        }
    }

    // Try to get album name from the chartlist-album cell
    const albumCellMatch = fullRow.match(/<td[^>]*chartlist-album[^>]*>([\s\S]*?)<\/td>/);
    let album: string | null = null;
    if (albumCellMatch) {
        const albumLinkMatch = albumCellMatch[1].match(/<a[^>]*>([^<]+)<\/a>/);
        if (albumLinkMatch) album = albumLinkMatch[1].trim().replace(/&amp;/g, '&');
    }

    return {
        status: 'success',
        nowPlaying: isNowPlaying,
        track: trackName,
        artist: artistName,
        album,
        trackUrl,
        artistUrl,
        image,
    };
}

async function fetchFromOfficialApi(username: string, apiKey: string): Promise<TrackData> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'O4bit-Website/1.0' } });
    if (!res.ok) throw new Error(`Last.fm API returned ${res.status}`);

    const json = await res.json();
    const tracks = json?.recenttracks?.track;
    const track = Array.isArray(tracks) ? tracks[0] : tracks;

    if (!track) {
        return {
            status: 'idle',
            nowPlaying: false,
            track: '',
            artist: '',
            album: null,
            trackUrl: `https://www.last.fm/user/${username}`,
            artistUrl: `https://www.last.fm/user/${username}`,
            image: null,
        };
    }

    const isNowPlaying = Boolean(track['@attr']?.nowplaying);
    const trackName = track.name || 'Unknown Track';
    const artistName =
        typeof track.artist === 'object' ? track.artist['#text'] : track.artist || 'Unknown Artist';
    const albumName =
        typeof track.album === 'object' ? track.album['#text'] || null : track.album || null;
    const trackUrl = track.url || `https://www.last.fm/user/${username}`;
    const artistUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;

    const images = track.image;
    let image: string | null = null;
    if (Array.isArray(images) && images.length > 0) {
        const preferred =
            images.find(img => img.size === 'extralarge') ||
            images.find(img => img.size === 'large') ||
            images[images.length - 1];
        image = preferred?.['#text'] || null;
        // Last.fm returns a generic placeholder image for tracks with no art — filter it out
        if (image?.includes('2a96cbd8b46e442fc41c2b86b821562f')) image = null;
    }

    return {
        status: 'success',
        nowPlaying: isNowPlaying,
        track: trackName,
        artist: artistName,
        album: albumName || null,
        trackUrl,
        artistUrl,
        image,
    };
}

export async function GET(event: APIEvent) {
    const url = new URL(event.request.url);
    const username = url.searchParams.get('user') || 'o4bit';
    const apiKey = process.env.LASTFM_API_KEY;

    try {
        let data: TrackData;
        if (apiKey) {
            try {
                data = await fetchFromOfficialApi(username, apiKey);
            } catch {
                data = await scrapeLastFm(username);
            }
        } else {
            data = await scrapeLastFm(username);
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                // Short cache so now-playing updates quickly
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({
                status: 'error',
                nowPlaying: false,
                track: '',
                artist: '',
                album: null,
                trackUrl: `https://www.last.fm/user/${username}`,
                artistUrl: `https://www.last.fm/user/${username}`,
                image: null,
                message: err instanceof Error ? err.message : 'Failed to fetch scrobbles',
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            },
        );
    }
}
