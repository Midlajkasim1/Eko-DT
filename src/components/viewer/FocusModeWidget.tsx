import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function FocusModeWidget() {
  const isFullscreen = useAppStore(s => s.isFullscreen)
  const setIsFullscreen = useAppStore(s => s.setIsFullscreen)
  const isToolbarVisible = useAppStore(s => s.isToolbarVisible)
  const setIsToolbarVisible = useAppStore(s => s.setIsToolbarVisible)

  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 100, y: 20 })
  const [isMinimized, setIsMinimized] = useState(false)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const initialClick = useRef({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)
  
  // Track if a drag actually happened to distinguish from a click
  const hasDragged = useRef(false)

  useEffect(() => {
    // Dispatch event to window to sync toolbar visibility with dashboard.js
    window.dispatchEvent(new CustomEvent('toggle-toolbar', { detail: isToolbarVisible }))
  }, [isToolbarVisible])

  if (!isFullscreen) return null

  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicking a button, don't drag
    if ((e.target as HTMLElement).closest('button')) return;
    
    isDragging.current = true
    hasDragged.current = false
    initialClick.current = { x: e.clientX, y: e.clientY }
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    if (widgetRef.current) {
      widgetRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      // Add a small threshold (3px) to distinguish a click from a drag
      const dist = Math.hypot(e.clientX - initialClick.current.x, e.clientY - initialClick.current.y)
      if (dist > 3) {
        hasDragged.current = true
      }
      
      if (hasDragged.current) {
        // Keep it within screen bounds roughly
        const newX = Math.max(0, Math.min(window.innerWidth - 150, e.clientX - dragStart.current.x))
        const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragStart.current.y))
        setPosition({ x: newX, y: newY })
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    if (widgetRef.current) {
      widgetRef.current.releasePointerCapture(e.pointerId)
    }
    // If it was just a click on the drag handle area (no movement), toggle minimize
    if (!hasDragged.current && !(e.target as HTMLElement).closest('button')) {
      setIsMinimized(!isMinimized)
    }
  }

  if (isMinimized) {
    return (
      <div
        ref={widgetRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 99999,
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border, #dde0e6)',
          borderRadius: '20px',
          padding: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          userSelect: 'none',
          touchAction: 'none',
          opacity: 0.5,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
        title="Click to expand"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>
    )
  }

  return (
    <div
      ref={widgetRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 99999,
        background: 'var(--bg-surface, #ffffff)',
        border: '1px solid var(--border, #dde0e6)',
        borderRadius: 'var(--radius, 8px)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        userSelect: 'none',
        touchAction: 'none',
        color: 'var(--text-primary, #1a1d23)',
        fontFamily: 'var(--font-display, sans-serif)'
      }}
    >
      <div 
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', cursor: 'grab' }}
        title="Click to minimize"
      >
        <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 600 }}>Focus Mode</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); setIsToolbarVisible(!isToolbarVisible) }}
          style={{
            background: isToolbarVisible ? 'var(--accent, #186d4e)' : 'var(--bg-raised, #f0f1f4)',
            color: isToolbarVisible ? 'white' : 'var(--text-primary, #1a1d23)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm, 5px)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          {isToolbarVisible ? 'Hide Toolbar' : 'Show Toolbar'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(false);
            setIsToolbarVisible(true);
            window.dispatchEvent(new CustomEvent('toggle-fullscreen-exit'));
          }}
          style={{
            background: 'transparent',
            color: 'var(--red, #dc2626)',
            border: '1px solid var(--border, #dde0e6)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm, 5px)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Exit
        </button>
      </div>
    </div>
  )
}
