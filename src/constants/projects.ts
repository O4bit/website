import type { ProjectCardProps } from '~/components/ProjectCard'

const Projects = [
    {
        name: 'My Website',
        description: "You're on it right now. Thanks for checking in!",
        href: 'https://github.com/PalmDevs/website',
        image: '/assets/images/projects/website.svg',
        hint: 'View source',
    },
    {
        name: 'ReVanced',
        description: 'Free and open-source patcher to modify Android applications.',
        image: '/assets/images/projects/revanced.svg',
        href: 'https://revanced.app',
        hint: 'Visit website',
    },
    {
        name: 'DataBackup',
        description: 'Free and open-source data backup solution for Android devices.',
        href: 'https://github.com/XayahSuSuSu/Android-DataBackup',
        image: '/assets/images/projects/data_backup.svg',
        hint: 'View repository',
    },
    {
        name: 'Other projects',
        description: 'My other projects and contributions are on GitHub.',
        href: 'https://github.com/PalmDevs',
        image: '/assets/images/projects/other.svg',
        hint: 'Explore more',
    },
] as const satisfies ProjectCardProps[]

export default Projects
