'use client'

import { useEffect, useRef, useState } from 'react'

interface AdSlotProps {
  slotId: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

export default function AdSlot({ slotId, format = 'auto', className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { rootMargin: '200px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [visible])

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  if (!clientId) return null

  return (
    <div ref={ref} className={className}>
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  )
}
