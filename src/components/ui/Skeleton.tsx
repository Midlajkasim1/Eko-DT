import type { CSSProperties } from 'react'

interface SkeletonProps {
  variant?: 'line' | 'block' | 'button' | 'dot' | 'circle'
  width?: number | string
  height?: number | string
  className?: string
  style?: CSSProperties
}

export function Skeleton({ variant = 'block', width, height, className, style }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer skeleton-${variant}${className ? ` ${className}` : ''}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  )
}
