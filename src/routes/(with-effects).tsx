import type { JSX } from 'solid-js'
import GlowingBackground from '~/components/effects/GlowingBackground'

export default (props: { children: JSX.Element }) => {
    return <GlowingBackground>{props.children}</GlowingBackground>
}
