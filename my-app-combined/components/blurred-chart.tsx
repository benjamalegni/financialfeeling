import React from 'react'

interface BlurredChartProps {
  className?: string
  variant?: 'blue' | 'green' | 'purple'
}

export default function BlurredChart({ className = '', variant = 'blue' }: BlurredChartProps) {
  const gradientByVariant: Record<typeof variant, { from: string; to: string; stroke: string }> = {
    blue: { from: '#0ea5e9', to: '#1d4ed8', stroke: 'rgba(59,130,246,0.9)' },
    green: { from: '#34d399', to: '#065f46', stroke: 'rgba(16,185,129,0.9)' },
    purple: { from: '#a78bfa', to: '#6d28d9', stroke: 'rgba(167,139,250,0.9)' },
  }

  const colors = gradientByVariant[variant]

  return (
    <div
      className={[
        'relative rounded-xl overflow-hidden border border-white/10 shadow-lg',
        'bg-gradient-to-br',
        variant === 'blue' ? 'from-sky-500/20 to-indigo-900/20' : '',
        variant === 'green' ? 'from-emerald-400/20 to-emerald-900/20' : '',
        variant === 'purple' ? 'from-violet-400/20 to-violet-900/20' : '',
        className,
      ].join(' ')}
    >
      {/* soft glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 50% 50%, ${colors.from}22, transparent 70%)`,
        }}
      />

      {/* blurred chart lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={colors.from} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.to} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="transparent" />
        <polyline
          points="0,150 30,140 60,120 90,135 120,110 150,130 180,90 210,120 240,85 270,95 300,70 330,80 360,60 400,75"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="5"
          filter="url(#blur)"
        />
        <polyline
          points="0,160 30,150 60,165 90,155 120,172 150,150 180,165 210,140 240,155 270,135 300,150 330,130 360,145 400,138"
          fill="none"
          stroke={colors.stroke}
          strokeOpacity="0.6"
          strokeWidth="3"
          filter="url(#blur)"
        />
      </svg>

      {/* subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px, 24px 24px',
        }}
      />

      {/* dark veil to emphasize blur */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
} 