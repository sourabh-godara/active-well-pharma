'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  '🚚 Free shipping on orders above ₹499',
  '✨ Use code GLOW20 for 20% off',
  '🔬 Clinically Tested Formulas',
  '🌿 100% Plant-Based Ingredients',
  '🔒 100% Secure Payments',
] as const

export function AnnouncementBar(): React.JSX.Element {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const fadeIn = setTimeout(() => {
        setIndex(prev => (prev + 1) % MESSAGES.length)
        setVisible(true)
      }, 350)
      return () => clearTimeout(fadeIn)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="bg-primary text-primary-foreground text-center text-xs sm:text-sm py-2.5 font-medium tracking-wide overflow-hidden select-none"
      role="marquee"
      aria-live="polite"
      aria-label="Announcements"
    >
      <span
        style={{
          display: 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 350ms ease, transform 350ms ease',
        }}
      >
        {MESSAGES[index]}
      </span>
    </div>
  )
}
