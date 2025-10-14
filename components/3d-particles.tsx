'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
}

interface Particles3DProps {
  color: string
  count?: number
}

export default function Particles3D({ color, count = 15 }: Particles3DProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          color: color,
          speed: Math.random() * 2 + 0.5
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [color, count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${particle.color}80, ${particle.color}40)`,
            transform: 'translateZ(0)',
            transformStyle: 'preserve-3d'
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotateZ: [0, 360]
          }}
          transition={{
            duration: particle.speed * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.1
          }}
        />
      ))}
    </div>
  )
} 