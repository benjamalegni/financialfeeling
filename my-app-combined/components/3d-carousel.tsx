import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
  color: string
}

interface Carousel3DProps {
  steps: Step[]
  interval?: number
}

export default function Carousel3D({ steps, interval = 4000 }: Carousel3DProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length)
    }, interval)
    return () => clearInterval(id)
  }, [interval, steps.length])

  const prev = () => setIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
  const next = () => setIndex((prev) => (prev + 1) % steps.length)

  return (
    <div className="relative w-full h-64">
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-300px) rotateY(${index * -90}deg)`,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotateY(${i * 90}deg) translateZ(300px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="text-center max-w-md">
                <div className="text-6xl font-season font-bold mb-4" style={{ color: step.color }}>
                  {i + 1}
                </div>
                <h3 className="text-2xl font-season font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === i ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
