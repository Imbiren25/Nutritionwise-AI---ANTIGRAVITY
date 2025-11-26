import { useEffect, useState } from 'react'

type Mode = 'mobile' | 'tablet' | 'desktop'

export const useDeviceMode = (): Mode => {
  const getMode = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024
    if (w < 768) return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
  }
  const [mode, setMode] = useState<Mode>(getMode())
  useEffect(() => {
    const onResize = () => setMode(getMode())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mode
}

