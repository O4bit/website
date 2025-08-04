import type { ProjectCardProps } from '~/components/ProjectCard'

const Projects = [
    {
        name: 'My Website',
        description: "You're on it right now. Thanks for checking in!",
        href: 'https://github.com/O4bit/website',
        image: '/assets/images/projects/website.svg',
        hint: 'View source',
        width: '130px',
        height: '131px',
    },
    {
        name: 'P.U.L.S.E.D',
        description: 'P.U.L.S.E.D is my software company i release some stuff under.',
        image: '/assets/images/projects/pulsedlogo.svg',
        href: 'https://pulsedinc.tech',
        hint: 'Visit website',
        width: '130px',
        height: '131px',
    },
    {
        name: 'StarustAPI',
        description: 'StarustAPI is a Discord Bot with various quirks and features.',
        href: 'https://github.com/O4bit/starustAPI',
        image: '/assets/images/projects/starust.png',
        hint: 'View repository',
        width: '130px',
        height: '131px',
    },
    {
        name: 'Other projects',
        description: 'My other projects and contributions are on GitHub.',
        href: 'https://github.com/O4bit',
        image: '/assets/images/projects/github.svg',
        hint: 'Explore more',
        width: '130px',
        height: '131px',    
    },
    {
        name: 'Uptime-serve',
        description: 'A uptime website for my projects and services.',
        href: 'https://exo-net.o4bit.space',
        image: '/assets/images/projects/uptime-serve.svg',
        hint: 'View website',
        width: '130px',
        height: '131px',    
    },
] as const satisfies ProjectCardProps[]

export default Projects
