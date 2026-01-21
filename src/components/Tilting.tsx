import { onMount, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { combineClassNames } from '~/utils'

import type { Component, ComponentProps, JSX } from 'solid-js'

import styles from './Tilting.module.css'

const Tilting = <E extends ElementType>(
    props: TiltingProps<E> & Omit<ComponentProps<E>, keyof TiltingProps<E>>,
) => {
    const [tiltProps, others] = splitProps(props, ['as', 'class', 'asProps', 'intensity'])

    const handleRef = (ref: HTMLElement) => {
        onMount(() => {
            const intensity = tiltProps.intensity ?? 15

            const handleMouseEnter = () => {
                ref.style.transition = 'transform 0.1s ease'
            }

            const handleMouseLeave = () => {
                ref.style.transition = 'transform 0.3s ease'
                ref.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
            }

            const handleMouseMove = (e: MouseEvent) => {
                const rect = ref.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const centerX = rect.width / 2
                const centerY = rect.height / 2

                const rotateX = ((y - centerY) / centerY) * -intensity
                const rotateY = ((x - centerX) / centerX) * intensity

                ref.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
            }

            ref.addEventListener('mouseenter', handleMouseEnter)
            ref.addEventListener('mouseleave', handleMouseLeave)
            ref.addEventListener('mousemove', handleMouseMove)

            return () => {
                ref.removeEventListener('mouseenter', handleMouseEnter)
                ref.removeEventListener('mouseleave', handleMouseLeave)
                ref.removeEventListener('mousemove', handleMouseMove)
            }
        })
    }

    return (
        <Dynamic
            component={tiltProps.as ?? 'div'}
            class={combineClassNames(styles.Container, tiltProps.class)}
            ref={handleRef}
            {...others}
            {...tiltProps.asProps}
        />
    )
}

// biome-ignore lint/suspicious/noExplicitAny: Typings
type ElementType = 'div' | 'img' | 'button' | 'a' | Component<any>
export type TiltingProps<E extends ElementType> = {
    as?: E
    children?: JSX.Element | JSX.Element[]
    class?: string
    asProps?: ComponentProps<E>
    intensity?: number
}

export default Tilting
