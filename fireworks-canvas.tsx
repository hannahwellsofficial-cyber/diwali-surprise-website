'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#f3d58a', '#e9bd5d', '#dc7a5b', '#fdf5e8', '#f6a96b']

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }
type Rocket = { x: number; y: number; vy: number; targetY: number; color: string }

export function FireworksCanvas({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const launchRef = useRef<(count: number) => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !parent || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    const particles: Particle[] = []
    const rockets: Rocket[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(parent)

    const explode = (x: number, y: number, color: string) => {
      const count = reduced ? 24 : 60
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 3.2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: Math.random() < 0.7 ? color : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1 + Math.random() * 1.8,
        })
      }
    }

    const launch = (count: number) => {
      for (let i = 0; i < count; i++) {
        rockets.push({
          x: width * (0.15 + Math.random() * 0.7),
          y: height + 10,
          vy: -(6 + Math.random() * 3),
          targetY: height * (0.12 + Math.random() * 0.35),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }
    launchRef.current = launch

    let frame = 0
    let lastAuto = 0
    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      if (time - lastAuto > (reduced ? 4000 : 1400)) {
        launch(1)
        lastAuto = time
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.y += r.vy
        r.vy *= 0.985
        ctx.fillStyle = r.color
        ctx.globalAlpha = 0.9
        ctx.fillRect(r.x - 1, r.y, 2, 10)
        if (r.y <= r.targetY || r.vy > -1.5) {
          explode(r.x, r.y, r.color)
          rockets.splice(i, 1)
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy = p.vy * 0.98 + 0.035
        p.life -= 0.011
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (trigger > 0) launchRef.current(5)
  }, [trigger])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
