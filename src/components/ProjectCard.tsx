import type { Component, JSX } from 'solid-js'

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
                    {props.imageComponent ? 
                        props.imageComponent({
                            src: props.image,
                            alt: props.name,
                            draggable: false,
                            loading: "lazy"
                        }) :
                        <img
                            draggable="false"
                            loading="lazy"
                            src={props.image}
                            alt={props.name}
                            style={{ 
                                width: props.width || '100%', 
                                height: props.height || 'auto' 
                            }}
                        />
                    }
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
    width?: string
    height?: string
    imageComponent?: (props: { src: string; alt: string; draggable: boolean; loading: string }) => JSX.Element
}

export default ProjectCard
