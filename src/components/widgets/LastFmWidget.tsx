import { type Component, Show, createSignal, onCleanup, onMount } from 'solid-js';
import styles from './LastFmWidget.module.scss';

interface TrackData {
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

const LastFmWidget: Component = () => {
    const [data, setData] = createSignal<TrackData | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [imgError, setImgError] = createSignal(false);

    const fetch_ = async () => {
        try {
            const res = await fetch('/api/lastfm');
            if (res.ok) {
                const json: TrackData = await res.json();
                if (json.status === 'success' && json.track) {
                    setImgError(false);
                    setData(json);
                }
            }
        } catch {
            // retain previous state on poll failure
        } finally {
            setLoading(false);
        }
    };

    onMount(() => {
        fetch_();
        const id = setInterval(fetch_, 20_000);
        onCleanup(() => clearInterval(id));
    });

    return (
        <div class={styles.Widget}>
            <Show when={!loading()} fallback={<Skeleton />}>
                <Show when={data()}>
                    {d => <Card data={d()} imgError={imgError()} onImgError={() => setImgError(true)} />}
                </Show>
            </Show>
        </div>
    );
};

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
const Skeleton: Component = () => (
    <div class={`${styles.Card} ${styles.Skeleton}`} aria-busy="true" aria-label="Loading music widget">
        <div class={styles.ArtworkBox} />
        <div class={styles.Info}>
            <div class={`${styles.SkeletonLine} ${styles.Short}`} />
            <div class={`${styles.SkeletonLine} ${styles.Long}`} />
            <div class={`${styles.SkeletonLine} ${styles.Mid}`} />
        </div>
    </div>
);

/* ─── Card ────────────────────────────────────────────────────────────────── */
interface CardProps {
    data: TrackData;
    imgError: boolean;
    onImgError: () => void;
}

const Card: Component<CardProps> = props => {
    const { data, imgError, onImgError } = props;

    return (
        <a
            href={data.trackUrl}
            target="_blank"
            rel="noreferrer"
            class={styles.Card}
            aria-label={`${data.nowPlaying ? 'Listening now:' : 'Recently played:'} ${data.track} by ${data.artist}`}
        >
            {/* Album art */}
            <div class={styles.ArtworkBox}>
                <Show
                    when={data.image && !imgError}
                    fallback={
                        <svg class={styles.FallbackNote} viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                        </svg>
                    }
                >
                    <img
                        class={styles.Artwork}
                        src={data.image!}
                        alt={`${data.track} album art`}
                        loading="lazy"
                        draggable={false}
                        onError={onImgError}
                    />
                </Show>
            </div>

            {/* Text info */}
            <div class={styles.Info}>
                {/* Status pill */}
                <span class={`${styles.StatusPill} ${data.nowPlaying ? styles.Live : ''}`}>
                    <Show when={data.nowPlaying}>
                        <span class={styles.Dot} aria-hidden="true" />
                    </Show>
                    {data.nowPlaying ? 'Listening now' : 'Recently played'}
                </span>

                <span class={styles.Track} title={data.track}>{data.track}</span>

                <span class={styles.Artist} title={`${data.artist}${data.album ? ` · ${data.album}` : ''}`}>
                    {data.artist}
                    <Show when={data.album}>
                        <span class={styles.Album}> · {data.album}</span>
                    </Show>
                </span>
            </div>

            {/* Equalizer bars — only when playing */}
            <Show when={data.nowPlaying}>
                <div class={styles.Eq} aria-hidden="true">
                    <span /><span /><span /><span />
                </div>
            </Show>

            {/* Last.fm logo */}
            <svg
                class={styles.LastfmLogo}
                viewBox="0 0 64 64"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M28.6 43.8l-2-5.5s-3.2 3.6-8 3.6c-4.3 0-7.3-3.7-7.3-9.7 0-7.6 3.8-10.4 7.6-10.4 5.4 0 7.2 3.5 8.6 8l2 6.1c2 5.9 5.7 10.7 16.5 10.7 7.7 0 12.9-2.4 12.9-8.6 0-5-2.8-7.6-8.1-8.8L48 28c-2.7-.6-3.5-1.7-3.5-3.5 0-2 1.5-3.2 4-3.2 2.7 0 4.2 1 4.4 3.5l5.7-.7c-.5-5.1-4-7.2-9.8-7.2-5.1 0-10 1.9-10 8 0 3.8 1.8 6.2 6.4 7.3l2.3.6c3.1.7 4.2 2 4.2 4.2 0 2.5-2.4 3.5-6.9 3.5-6.7 0-9.5-3.5-11.1-8.3l-2-6.1c-2.7-8-7.1-11-14.5-11C9.1 15.1 4 21.3 4 32.4c0 10.7 5.5 15.7 13.3 15.7 6.9 0 11.3-4.3 11.3-4.3z" />
            </svg>
        </a>
    );
};

export default LastFmWidget;
