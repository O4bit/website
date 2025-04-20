import IconDiscord from '~/assets/icons/discord.svg'
import IconGitHub from '~/assets/icons/github.svg'
import IconEmail from '~/assets/icons/mail.svg'

import type { IconType } from '~/components'

const Socials = {
    github: {
        name: 'GitHub',
        href: 'https://github.com/O4bit',
        icon: IconGitHub,
    },
    discord: {
        name: 'Discord',
        href: 'https://discord.com/users/719923357046538243',
        icon: IconDiscord,
    },
    mail: {
        name: 'Email',
        href: 'mailto:contact+o4bit@protonmail.com',
        icon: IconEmail,
    },
} as const satisfies Record<string, { name: string; href: string; icon: IconType }>

export default Socials
