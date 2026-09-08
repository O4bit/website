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
        name: 'Vertronix-Systems',
        description: 'Vertronix Systems builds hardware and software. Every component is open-source — from schematics to firmware.',
        image: '/assets/images/projects/Vertronix Logo Compact.png',
        href: 'https://vertronix-systems.net',
        hint: 'View website',
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
        name: 'Project Asteria',
        description: 'Discover space right from your phone with astronomy pictures with the Project Asteria app.',
        href: 'https://f-droid.org/en/packages/space.o4bit.projectasteria.foss/',
        image: '/assets/images/projects/ic_launcher-playstore.png',
        hint: 'View on F-Droid',
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
    }

] as const satisfies ProjectCardProps[]

export default Projects
