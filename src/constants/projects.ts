import type { ProjectCardProps } from '~/components/ProjectCard'

const Projects = [
    {
        name: 'My Website',
        description: "You're on it right now. Thanks for checking in!",
        href: 'https://github.com/O4bit/website',
        image: '/assets/images/projects/o4bit.gif',
        hint: 'View source',
    },
    {
        name: 'P.U.L.S.E.D',
        description: 'P.U.L.S.E.D is a software company that specialises in software development.',
        image: '/assets/images/projects/logo.svg',
        href: 'https://pulsedinc.tech',
        hint: 'Visit website',
    },
    {
        name: 'StarAPI',
        description: 'StarAPI a big server monitoring project (WIP) ', 
        href: 'https://github.com/O4bit/StarAPI',
        image: '/assets/images/projects/nextstar.svg',
        hint: 'View repository',
    },
    {
        name: 'Other projects',
        description: 'My other projects and contributions are on GitHub.',
        href: 'https://github.com/O4bit',
        image: '/assets/images/projects/github.svg',
        hint: 'Explore more',
    },
] as const satisfies ProjectCardProps[]

export default Projects
