import type { Component } from 'solid-js'

import LinkCard from './LinkCard'
import { Column } from './Page'

import styles from './ProjectCard.module.scss'

const ProjectCard: Component<ProjectCardProps> = props => {
    return (
        <LinkCard
            class={styles.Card}
            {...props}
            preview={() => (
                <Column aria-hidden="true" centerHorizontal centerVertical class={styles.ImageContainer}>
                    <img draggable="false" loading="lazy" src={props.image} alt={props.name} />
                </Column>
            )}
        />
    )
}

export interface ProjectCardProps {
    name: string
    description: string
    image: string
    href: string
    hint?: string
}

export default ProjectCard
