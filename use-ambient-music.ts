'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AmbientRaga } from './ambient-raga'

export const MUSIC_TOGGLE_ATTR = 'data-music-toggle'

export function useAmbientMusic() {
  const engineRef = useRef<AmbientRaga | null>(null)
  const userMutedRef = useRef(false)
  const [playing, setPlaying] = useState(false)

  const getEngine = useCallback(() => {
    engineRef.current ??= new AmbientRaga()
    return engineRef.current
  }, [])

  const play = useCallback(() => {
    setPlaying(getEngine().start())
  }, [getEngine])

  const pause = useCallback(() => {
    engineRef.current?.stop()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (engineRef.current?.playing) {
      userMutedRef.current = true
      pause()
    } else {
      userMutedRef.current = false
      play()
    }
  }, [pause, play])

  useEffect(() => {
    // Browsers only allow audio after a user gesture, so the music begins on
    // the first interaction unless that interaction is the mute toggle itself.
    const onFirstGesture = (event: Event) => {
      const target = event.target as Element | null
      if (target?.closest?.(`[${MUSIC_TOGGLE_ATTR}]`)) return
      removeListeners()
      if (!userMutedRef.current && !engineRef.current?.playing) play()
    }
    const removeListeners = () => {
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture)
    window.addEventListener('keydown', onFirstGesture)
    return removeListeners
  }, [play])

  useEffect(() => () => engineRef.current?.dispose(), [])

  return { playing, toggle }
}
