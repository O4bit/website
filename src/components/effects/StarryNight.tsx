import { Component, onCleanup, onMount, useContext } from 'solid-js'
import { Portal } from 'solid-js/web'

import { ThemeContext } from '~/contexts'

const css = `
:root {
  --sn-star-color: #ffffff;
  --sn-star-trail-color: rgba(255,255,255,0.9);
  --sn-star-glow: rgba(255,255,255,0.1);
  --sn-meteor-color: #ffffff;
}

.static-star, .flickering-star {
  position: fixed;
  background: var(--sn-star-color, #fff);
  border-radius: 50%;
  pointer-events: none;
}
.static-star {
  opacity: 0.8;
  filter: brightness(1);
}
.flickering-star {
  opacity: 1;
  filter: brightness(1.7) drop-shadow(0 0 6px var(--sn-star-color, #fff));
  animation: white-to-gray-flicker 2s ease-in-out infinite;
}

@keyframes white-to-gray-flicker {
  0% { background: #ffffff; opacity: 1; box-shadow: 0 0 6px rgba(255,255,255,0.9); }
  50% { background: #888888; opacity: 0.4; box-shadow: 0 0 3px rgba(136,136,136,0.4); }
  100% { background: #ffffff; opacity: 1; box-shadow: 0 0 6px rgba(255,255,255,0.9); }
}

/* container positioning helper */
#starrynight-stars { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 3; }

/* Meteors (shooting stars) */
.starrynight-meteors { position: absolute; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 2; overflow: hidden; }
.starrynight-meteors span { position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; background: var(--sn-meteor-color, #fff); border-radius: 50%; box-shadow: 0 0 0 4px var(--sn-star-glow, rgba(255,255,255,0.1)),0 0 0 8px var(--sn-star-glow, rgba(255,255,255,0.1)),0 0 20px var(--sn-star-glow, rgba(255,255,255,0.1)); animation: animate 3s linear infinite; }
.starrynight-meteors span::before { content: ""; position: absolute; top: 50%; transform: translateY(-50%); width: 300px; height: 1px; background: linear-gradient(90deg,var(--sn-star-trail-color,#fff),transparent); }
@keyframes animate { 0% { transform: rotate(315deg) translateX(0); opacity: 1; } 70% { opacity: 1; } 100% { transform: rotate(315deg) translateX(-1000px); opacity: 0; } }
.starrynight-meteors span:nth-child(1) { top: 0; right: 0; left: initial; animation-delay: 0s; animation-duration: 1s; }
.starrynight-meteors span:nth-child(2) { top: 0; right: 80px; left: initial; animation-delay: 0.2s; animation-duration: 3s; }
.starrynight-meteors span:nth-child(3) { top: 80px; right: 0px; left: initial; animation-delay: 0.4s; animation-duration: 2s; }
.starrynight-meteors span:nth-child(4) { top: 0; right: 180px; left: initial; animation-delay: 0.6s; animation-duration: 1.5s; }
.starrynight-meteors span:nth-child(5) { top: 0; right: 260px; left: initial; animation-delay: 0.8s; animation-duration: 2.5s; }
.starrynight-meteors span:nth-child(6) { top: 0; right: 400px; left: initial; animation-delay: 1s; animation-duration: 3s; }
.starrynight-meteors span:nth-child(7) { top: 300px; right: 0px; left: initial; animation-delay: 1.2s; animation-duration: 1.75s; }
.starrynight-meteors span:nth-child(8) { top: 0px; right: 700px; left: initial; animation-delay: 1.4s; animation-duration: 1.25s; }
.starrynight-meteors span:nth-child(9) { top: 0px; right: 1000px; left: initial; animation-delay: 0.75s; animation-duration: 2.25s; }
.starrynight-meteors span:nth-child(10) { top: 0px; right: 450px; left: initial; animation-delay: 2.75s; animation-duration: 2.75s; }

`

const StarryNight: Component = () => {
    const theme = useContext(ThemeContext)

    let intervalHandle: number | undefined

    onMount(() => {
        // inject styles
        if (!document.getElementById('starrynight-css')) {
            const s = document.createElement('style')
            s.id = 'starrynight-css'
            s.innerHTML = css
            document.head.appendChild(s)
        }

        // set theme variables
        const applyThemeVars = () => {
            const isDark = theme.colorScheme === 'dark'
            const starColor = isDark ? '#ffffff' : '#b86b1a'
            const starTrail = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(184,107,26,0.95)'
            const starGlow = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(184,107,26,0.12)'
            const meteorColor = isDark ? '#ffffff' : '#b86b1a'
            document.documentElement.style.setProperty('--sn-star-color', starColor)
            document.documentElement.style.setProperty('--sn-star-trail-color', starTrail)
            document.documentElement.style.setProperty('--sn-star-glow', starGlow)
            document.documentElement.style.setProperty('--sn-meteor-color', meteorColor)
        }

        applyThemeVars()

        // container
        function createContainerIfMissing() {
            let container = document.getElementById('starrynight-stars') as HTMLDivElement | null
            if (!container) {
                container = document.createElement('div')
                container.id = 'starrynight-stars'
                container.style.position = 'fixed'
                container.style.top = '0'
                container.style.left = '0'
                container.style.width = '100%'
                container.style.height = '100%'
                container.style.pointerEvents = 'none'
                container.style.zIndex = '3'
                document.body.appendChild(container)
            }
            return container
        }

        function initStars() {
            const totalStars = 400
            const flickerCount = 80
            const container = createContainerIfMissing()
            if (container.dataset.ctInitialized === '1') return

            container.innerHTML = ''
            const stars: HTMLElement[] = []
            const starPositions: { top: number; left: number }[] = []

            function isFarEnough(top: number, left: number, minDist: number) {
                for (const pos of starPositions) {
                    const dx = left - pos.left
                    const dy = top - pos.top
                    if (Math.sqrt(dx * dx + dy * dy) < minDist) return false
                }
                return true
            }

            let attempts = 0
            for (let i = 0; i < totalStars; i++) {
                let top: number, left: number, size: number
                do {
                    top = 5 + Math.random() * 90
                    left = 5 + Math.random() * 90
                    size = 1 + Math.random() * 2
                    attempts++
                } while (!isFarEnough(top, left, 2.5) && attempts < 1000)

                starPositions.push({ top, left })
                const star = document.createElement('div')
                star.style.position = 'absolute'
                star.style.top = top + '%'
                star.style.left = left + '%'
                star.style.width = size + 'px'
                star.style.height = size + 'px'
                star.className = 'static-star'
                container.appendChild(star)
                stars.push(star)
            }

            function updateFlickeringStars() {
                if (!stars.length) return
                stars.forEach(star => {
                    star.classList.remove('flickering-star')
                    star.classList.add('static-star')
                })
                const flickerIndices = new Set<number>()
                while (flickerIndices.size < flickerCount) {
                    flickerIndices.add(Math.floor(Math.random() * totalStars))
                }
                flickerIndices.forEach(idx => {
                    const star = stars[idx]
                    if (!star) return
                    star.classList.remove('static-star')
                    star.classList.add('flickering-star')
                    star.style.animationDelay = (Math.random() * 2).toFixed(1) + 's'
                    star.style.animationDuration = (1.5 + Math.random() * 2).toFixed(1) + 's'
                })
            }

            updateFlickeringStars()
            intervalHandle = window.setInterval(updateFlickeringStars, 3000)
            container.dataset.ctInitialized = '1'
        }

        // initialize and observe theme changes
        initStars()

        // create meteors
        function createMeteorsIfMissing() {
            let m = document.querySelector('.starrynight-meteors') as HTMLElement | null
            if (!m) {
                m = document.createElement('section')
                m.className = 'starrynight-meteors'
                for (let i = 0; i < 10; i++) {
                    const s = document.createElement('span')
                    m.appendChild(s)
                }
                document.body.appendChild(m)
            }
            return m
        }

        const meteorContainer = createMeteorsIfMissing()

        const m = new MutationObserver(() => {
            applyThemeVars()
        })
        m.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })

        onCleanup(() => {
            if (intervalHandle) clearInterval(intervalHandle)
            m.disconnect()
            try {
                if (meteorContainer && meteorContainer.parentNode) meteorContainer.parentNode.removeChild(meteorContainer)
            } catch (e) {}
        })
    })

    return (
        <Portal>
            {/* empty markup: stars are injected directly into the document body */}
            <div aria-hidden="true" />
        </Portal>
    )
}

export default StarryNight
