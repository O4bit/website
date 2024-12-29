import IconDiscord from '~/assets/icons/discord.svg'
import IconGitHub from '~/assets/icons/github.svg'
import IconEmail from '~/assets/icons/mail.svg'

import type { IconType } from '~/components'

const Socials = {
    github: {
        name: 'GitHub',
        href: 'https://github.com/PalmDevs',
        icon: IconGitHub,
    },
    discord: {
        name: 'Discord',
        href: 'https://discord.com/users/629368283354628116',
        icon: IconDiscord,
    },
    mail: {
        name: 'Email',
        href: 'mailto:contact+web@palmdevs.me',
        icon: IconEmail,
    },
} as const satisfies Record<string, { name: string; href: string; icon: IconType }>

export default Socials
