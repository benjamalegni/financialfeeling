'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselStep {
  id: number
  title: string
  description: string
  color: string
  icon: string
  examples: string[]
}

interface Carousel3DProps {
  steps: CarouselStep[]
  autoPlay?: boolean
  interval?: number
}

export default function Carousel3D({ steps, autoPlay = true, interval = 4000 }: Carousel3DProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
    }, interval)

    return () => clearInterval(timer)
  }, [isAutoPlaying, interval, steps.length])

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="relative w-full min-h-[500px] lg:min-h-[600px] overflow-hidden max-w-full">
      {/* Main Carousel Container */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ 
              opacity: 0,
              scale: 0.95,
              y: 10
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center p-2 lg:p-4"
          >
            <div className="relative w-full max-w-3xl mx-auto">
              {/* Card Container */}
              <motion.div
                className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-3 lg:p-6 xl:p-8 shadow-2xl border border-gray-700"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                animate={{
                  y: [0, -2, 0]
                }}
                transition={{
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${steps[currentStep].color}40 0%, transparent 50%)`
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <motion.div
                    className="relative mb-4 lg:mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="text-4xl lg:text-6xl xl:text-8xl font-black"
                        style={{ color: steps[currentStep].color }}
                        animate={{
                          scale: [1, 1.05, 1],
                          textShadow: [
                            `0 0 20px ${steps[currentStep].color}`,
                            `0 0 30px ${steps[currentStep].color}`,
                            `0 0 20px ${steps[currentStep].color}`
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {steps[currentStep].id}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-lg lg:text-2xl xl:text-3xl font-bold text-white mb-3 lg:mb-4"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {steps[currentStep].title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-gray-300 text-xs lg:text-base xl:text-lg mb-4 lg:mb-6 max-w-2xl mx-auto leading-relaxed"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    {steps[currentStep].description}
                  </motion.p>

                  {/* Examples */}
                  <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-4 lg:mb-6"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    {steps[currentStep].examples.map((example, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-sm text-gray-300"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: steps[currentStep].color + '20',
                          borderColor: steps[currentStep].color
                        }}
                      >
                        {example}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className="text-3xl lg:text-5xl xl:text-6xl mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                    {steps[currentStep].icon}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Previous Button */}
        <motion.button
          onClick={prevStep}
          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300 backdrop-blur-sm border border-gray-600"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        {/* Step Indicators */}
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep === index 
                  ? 'bg-white scale-125' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              whileHover={{ 
                scale: 1.2,
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={nextStep}
          className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300 backdrop-blur-sm border border-gray-600"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Auto-play Toggle */}
      <motion.button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
      </motion.button>
    </div>
  )
}