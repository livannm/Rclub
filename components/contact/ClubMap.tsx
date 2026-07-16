'use client'

import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { useEffect, useRef, useState } from 'react'
import { CLUB_MAP_STYLES } from '@/lib/maps/club-map-styles'
import { resolveClubPlace } from '@/lib/maps/resolve-club-place'

type ClubMapProps = {
  apiKey?: string
  placeId: string
  searchQuery: string
  fallbackLat: number
  fallbackLng: number
  fallbackEmbedUrl: string
  title: string
  className?: string
}

export function ClubMap({
  apiKey,
  placeId,
  searchQuery,
  fallbackLat,
  fallbackLng,
  fallbackEmbedUrl,
  title,
  className = 'contact-map',
}: ClubMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [useEmbedFallback, setUseEmbedFallback] = useState(!apiKey)

  useEffect(() => {
    if (!apiKey || !containerRef.current) {
      setUseEmbedFallback(true)
      return
    }

    let cancelled = false

    async function initMap() {
      try {
        setOptions({ key: apiKey! })
        const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary

        const resolved = await resolveClubPlace({
          placeId,
          searchQuery,
          fallbackCoords: { lat: fallbackLat, lng: fallbackLng },
        })

        if (cancelled || !containerRef.current) return

        const map = new Map(containerRef.current, {
          center: resolved.coords,
          zoom: 18,
          styles: CLUB_MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          clickableIcons: false,
        })

        new google.maps.Marker({
          map,
          position: resolved.coords,
          title: resolved.displayName ?? 'Rclub Strasbourg',
        })
      } catch {
        if (!cancelled) setUseEmbedFallback(true)
      }
    }

    void initMap()

    return () => {
      cancelled = true
    }
  }, [apiKey, placeId, searchQuery, fallbackLat, fallbackLng])

  if (useEmbedFallback) {
    return (
      <iframe
        title={title}
        src={fallbackEmbedUrl}
        width="100%"
        height="380"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={title}
      className={className}
      style={{ minHeight: 380 }}
    />
  )
}
