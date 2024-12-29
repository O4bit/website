const Skills = [
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
        name: 'JavaScript',
        icon: '/assets/images/skills/js.svg',
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    },
    {
        name: 'TypeScript',
        icon: '/assets/images/skills/ts.svg',
        link: 'https://www.typescriptlang.org/',
    },
    {
        name: 'React',
        icon: '/assets/images/skills/react.svg',
        link: 'https://react.dev',
    },
    {
        name: 'SolidJS',
        icon: '/assets/images/skills/solidjs.svg',
        link: 'https://solidjs.com',
    },
    {
        name: 'Node.js',
        icon: '/assets/images/skills/nodejs.svg',
        link: 'https://nodejs.org',
    },
    {
        name: 'Bun',
        icon: '/assets/images/skills/bun.svg',
        link: 'https://bun.sh',
    },
    {
        name: 'Fastify',
        icon: '/assets/images/skills/fastify.svg',
        link: 'https://fastify.io',
    },
    {
        name: 'Figma',
        icon: '/assets/images/skills/figma.svg',
        link: 'https://figma.com',
    },
    {
        name: 'Linux (Basics)',
        icon: '/assets/images/skills/linux.webp',
        link: 'https://en.wikipedia.org/wiki/Linux',
    },
    {
        name: 'Git',
        icon: '/assets/images/skills/git.svg',
        link: 'https://git-scm.com',
    },
    {
        name: 'GitHub Actions',
        icon: '/assets/images/skills/gha.svg',
        link: 'https://github.com/features/actions',
    },
] as const satisfies Array<{
    name: string
    icon: string
    link: string
}>

export default Skills
