import { type Component, onCleanup, onMount } from 'solid-js'

interface Star {
    x: number
    y: number
    size: number
    baseOpacity: number
    twinkleSpeed: number
    twinkleOffset: number
}

interface Meteor {
    x: number
    y: number
    vx: number
    vy: number
    trailLength: number
    opacity: number
    active: boolean
    elapsed: number
    delay: number
}

const StarryNight: Component = () => {
    onMount(() => {
        // ── Canvas setup ─────────────────────────────────────────────────
        const canvas = document.createElement('canvas')
        Object.assign(canvas.style, {
            position:      'fixed',
            top:           '0',
            left:          '0',
            width:         '100vw',
            height:        '100vh',
            pointerEvents: 'none',
            zIndex:        '2',
        })
        canvas.setAttribute('aria-hidden', 'true')
        document.body.prepend(canvas)           // prepend so it sits behind portal elements

        const ctx = canvas.getContext('2d')
        if (!ctx) { canvas.remove(); return }

        let stars:   Star[]   = []
        let meteors: Meteor[] = []
        let w = 0
        let h = 0
        let rafId = 0

        // ── Resize ───────────────────────────────────────────────────────
        const resize = () => {
            w = window.innerWidth
            h = window.innerHeight
            // Account for device pixel ratio for crisp stars on retina
            const dpr = window.devicePixelRatio || 1
            canvas.width  = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            buildStars()
        }

        // ── Stars ─────────────────────────────────────────────────────────
        const buildStars = () => {
            stars = []
            for (let i = 0; i < 160; i++) {
                stars.push({
                    x:            Math.random() * w,
                    y:            Math.random() * h,
                    size:         0.5 + Math.random() * 1.8,
                    baseOpacity:  0.45 + Math.random() * 0.55,
                    twinkleSpeed: 0.3 + Math.random() * 1.6,
                    twinkleOffset: Math.random() * Math.PI * 2,
                })
            }
        }

        // ── Meteors ───────────────────────────────────────────────────────
        const makeMeteor = (spreadDelay = false): Meteor => ({
            x:           w * 0.3 + Math.random() * w * 0.9,
            y:           -30,
            vx:          -(5 + Math.random() * 4),
            vy:          3 + Math.random() * 3,
            trailLength: 80 + Math.random() * 150,
            opacity:     0,
            active:      false,
            elapsed:     0,
            delay:       spreadDelay
                ? Math.random() * 8000
                : 2000 + Math.random() * 6000,
        })

        const buildMeteors = () => {
            meteors = []
            for (let i = 0; i < 8; i++) meteors.push(makeMeteor(true))
        }

        // ── Draw loop ─────────────────────────────────────────────────────
        let lastTs = 0
        const draw = (ts: number) => {
            try {
                const dt = Math.min(ts - lastTs, 50)
                lastTs = ts

                ctx.clearRect(0, 0, w, h)

                const t = ts * 0.001

                // Stars — white with slight purple hue like the reference
                for (const s of stars) {
                    const flicker = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset)
                    const a = s.baseOpacity * (0.4 + 0.6 * flicker)
                    ctx.beginPath()
                    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(220,200,255,${a.toFixed(3)})`
                    ctx.fill()
                }

                // Meteors
                const spd = dt / 16
                for (const m of meteors) {
                    m.elapsed += dt
                    if (!m.active) {
                        if (m.elapsed >= m.delay) { m.active = true; m.elapsed = 0 }
                        continue
                    }

                    m.x += m.vx * spd
                    m.y += m.vy * spd
                    m.opacity = Math.min(1, m.elapsed / 300)

                    const norm = Math.sqrt(m.vx * m.vx + m.vy * m.vy)
                    const tx = m.x - (m.vx / norm) * m.trailLength
                    const ty = m.y - (m.vy / norm) * m.trailLength

                    // Trail
                    const trailGrad = ctx.createLinearGradient(tx, ty, m.x, m.y)
                    trailGrad.addColorStop(0, `rgba(200,180,255,0)`)
                    trailGrad.addColorStop(1, `rgba(220,200,255,${(m.opacity * 0.9).toFixed(3)})`)
                    ctx.beginPath()
                    ctx.moveTo(tx, ty)
                    ctx.lineTo(m.x, m.y)
                    ctx.strokeStyle = trailGrad
                    ctx.lineWidth = 1.5
                    ctx.stroke()

                    // Head glow
                    const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 4)
                    hg.addColorStop(0, `rgba(255,255,255,${m.opacity.toFixed(3)})`)
                    hg.addColorStop(1, `rgba(200,180,255,0)`)
                    ctx.beginPath()
                    ctx.arc(m.x, m.y, 4, 0, Math.PI * 2)
                    ctx.fillStyle = hg
                    ctx.fill()

                    if (m.x < -300 || m.y > h + 200) Object.assign(m, makeMeteor())
                }
            } catch (_) {
                // Never let a draw error kill the animation loop
            }

            rafId = requestAnimationFrame(draw)
        }

        // ── Init ──────────────────────────────────────────────────────────
        resize()
        buildMeteors()
        window.addEventListener('resize', resize)
        rafId = requestAnimationFrame(draw)

        onCleanup(() => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', resize)
            canvas.remove()
        })
    })

    return <></>
}

export default StarryNight
