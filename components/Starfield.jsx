import React, { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Handle Window Resizing
    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initStars()
    }
    window.addEventListener('resize', handleResize)

    // Initialize Star Cluster Particles
    let stars = []
    const initStars = () => {
      stars = []
      const count = Math.floor((width * height) / 9000) // Density-based distribution
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.6,
          opacity: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
          isPleiadesCluster: Math.random() < 0.08, // Glowing blue major stars
          vx: Math.random() * 0.08 + 0.02,        // Slow drift horizontal speed
          vy: Math.random() * 0.04 - 0.02         // Very slow vertical drift
        })
      }
    }

    initStars()

    // Draw the Pleiades Cosmic Nebulosity
    const drawNebula = (ctx, x, y, r, color1, color2) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, color1)
      gradient.addColorStop(0.5, color2)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Animation Loop
    let time = 0
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      time += 0.5

      // Calculate drifting coordinates for nebulas to simulate real astronomy drift
      const neb1X = width * 0.25 + Math.sin(time * 0.0005) * 50
      const neb1Y = height * 0.35 + Math.cos(time * 0.0004) * 40
      
      const neb2X = width * 0.75 + Math.cos(time * 0.0003) * 60
      const neb2Y = height * 0.65 + Math.sin(time * 0.0005) * 50

      const neb3X = width * 0.5 + Math.sin(time * 0.0002) * 40
      const neb3Y = height * 0.15 + Math.cos(time * 0.0003) * 30

      // Draw 3 primary cosmic nebula clouds behind stars
      drawNebula(ctx, neb1X, neb1Y, 300, 'rgba(56, 189, 248, 0.08)', 'rgba(14, 165, 233, 0.03)')
      drawNebula(ctx, neb2X, neb2Y, 450, 'rgba(0, 229, 255, 0.06)', 'rgba(56, 189, 248, 0.02)')
      drawNebula(ctx, neb3X, neb3Y, 250, 'rgba(7, 89, 133, 0.09)', 'rgba(3, 105, 161, 0.03)')

      // Draw all stars
      stars.forEach((star) => {
        // Update horizontal & vertical coordinates by drift speeds
        star.x += star.vx
        star.y += star.vy

        // Wrap around boundaries
        if (star.x > width) star.x = 0
        if (star.x < 0) star.x = width
        if (star.y > height) star.y = 0
        if (star.y < 0) star.y = height

        // Update twinkling phase
        star.phase += star.speed
        const currentOpacity = star.opacity + Math.sin(star.phase) * 0.25
        const opacityClamped = Math.max(0.1, Math.min(1, currentOpacity))

        ctx.fillStyle = star.isPleiadesCluster
          ? `rgba(224, 242, 254, ${opacityClamped})`
          : `rgba(255, 255, 255, ${opacityClamped})`

        if (star.isPleiadesCluster) {
          // Major stars with bright glowing blue halos
          ctx.save()
          ctx.shadowBlur = 12
          ctx.shadowColor = 'rgba(0, 229, 255, 0.9)'
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size + 1.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()

          // Draw double sparkle rings (cross flare)
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacityClamped * 0.4})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(star.x - 6, star.y)
          ctx.lineTo(star.x + 6, star.y)
          ctx.moveTo(star.x, star.y - 6)
          ctx.lineTo(star.x, star.y + 6)
          ctx.stroke()
        } else {
          // Standard star
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0, // Behind all main content, overlaying body background
      }}
    />
  )
}
