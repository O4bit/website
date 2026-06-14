const Skills = [
    {
        name: 'Kotlin',
        icon: '/assets/images/skills/kotlin.png',
        link: 'https://kotlinlang.org',
    },
    {
        name: 'Rust',
        icon: '/assets/images/skills/rust.svg',
        link: 'https://www.rust-lang.org/',
    },
    {
        name: 'HTML',
        icon: '/assets/images/skills/html.svg',
        link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    },
    {
        name: 'CSS',
        icon: '/assets/images/skills/css.svg',
        link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    },
    {
        name: 'TypeScript',
        icon: '/assets/images/skills/ts.svg',
        link: 'https://www.typescriptlang.org/',
    },
    {
        name: 'SolidJS',
        icon: '/assets/images/skills/solidjs.svg',
        link: 'https://solidjs.com',
    },
    {
        name: 'Cf Workers',
        icon: '/assets/images/skills/Cloudflare-Dark.svg',
        link: 'https://cloudflare.com',
    },
    {
        name: 'Jetpack Compose',
        icon: '/assets/images/skills/jetpack-compose.png',
        link: 'https://developer.android.com/jetpack/compose',
    },

] as const satisfies Array<{
    name: string
    icon: string
    link: string
}>

export default Skills
