'use client'

import { useState, useEffect } from 'react'

interface SimpleTypewriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
}

export default function SimpleTypewriter({ 
  text, 
  speed = 80, 
  delay = 0, 
  className = "" 
}: SimpleTypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previousText, setPreviousText] = useState('')

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsTyping(true)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(true)
    }
  }, [delay])

  useEffect(() => {
    if (!isTyping) return

    // If text changed, start deleting the previous text
    if (text !== previousText && previousText !== '') {
      setIsDeleting(true)
      setPreviousText(text)
      return
    }

    // If we're deleting
    if (isDeleting) {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1))
        }, speed / 2) // Faster deletion
        return () => clearTimeout(timer)
      } else {
        setIsDeleting(false)
        setCurrentIndex(0)
        return
      }
    }

    // If we're typing
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      // Finished typing
      setPreviousText(text)
    }
  }, [currentIndex, text, speed, isTyping, isDeleting, displayText, previousText])

  return (
    <span className={className}>
      {displayText}
      <span 
        className="inline-block w-0.5 bg-white ml-1 animate-blink" 
        style={{ 
          height: '1.2em',
          verticalAlign: 'text-top',
          marginTop: '-0.1em'
        }} 
      />
    </span>
  )
} 