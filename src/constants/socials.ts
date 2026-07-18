import IconBluesky from '~/assets/icons/bluesky.svg'
import IconDiscord from '~/assets/icons/discord.svg'
import IconGitHub from '~/assets/icons/github.svg'
import IconEmail from '~/assets/icons/mail.svg'
import IconLastfm from '~/assets/icons/lastfm.svg'

import type { IconType } from '~/components'

const Socials = {
    github: {
        name: 'GitHub',
        href: 'https://github.com/O4bit',
        icon: IconGitHub,
    },
    bluesky: {
        name: 'Bluesky',
        href: 'https://bsky.app/profile/o4bit.space',
        icon: IconBluesky,
    },
    discord: {
        name: 'Discord',
        href: 'https://discord.com/users/719923357046538243',
        icon: IconDiscord,
    },
    lastfm: {
        name: 'Last.fm',
        href: 'https://www.last.fm/user/o4bit',
        icon: IconLastfm,
    },
    mail: {
        name: 'Email',
        href: 'mailto:contact+o4bit@protonmail.com',
        icon: IconEmail,
    },
} as const satisfies Record<string, { name: string; href: string; icon: IconType }>

export default Socials
