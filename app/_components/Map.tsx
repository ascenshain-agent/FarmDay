'use client'

import { useEffect, useRef } from 'react'
import type { Location } from '@/lib/types'

interface MapProps {
  locations: Location[]
  hoveredId?: string | null
  visible?: boolean
}

export default function Map({ locations, hoveredId, visible }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<globalThis.Map<string, import('leaflet').Marker>>(new globalThis.Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([34.8526, -82.394], 9)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Sync markers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    import('leaflet').then((L) => {
      // Remove old markers not in new set
      const newIds = new Set(locations.map((l) => l.id))
      markersRef.current.forEach((m, id) => {
        if (!newIds.has(id)) { m.remove(); markersRef.current.delete(id) }
      })
      // Add new markers
      locations.forEach((loc) => {
        if (!markersRef.current.has(loc.id)) {
          const m = L.marker([loc.latitude, loc.longitude])
            .addTo(map)
            .bindPopup(`<strong>${loc.name}</strong><br/>${loc.address}`)
          markersRef.current.set(loc.id, m)
        }
      })
    })
  }, [locations])

  // Highlight hovered marker
  useEffect(() => {
    import('leaflet').then((L) => {
      markersRef.current.forEach((marker, id) => {
        const el = marker.getElement()
        if (!el) return
        if (id === hoveredId) {
          el.style.filter = 'hue-rotate(120deg) brightness(1.3)'
          el.style.zIndex = '1000'
          marker.openPopup()
        } else {
          el.style.filter = ''
          el.style.zIndex = ''
          if (!hoveredId) marker.closePopup()
        }
      })
    })
  }, [hoveredId])

  // Invalidate size when container becomes visible (mobile toggle)
  useEffect(() => {
    if (visible && mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
    }
  }, [visible])

  return <div ref={mapRef} className="w-full h-full" />
}
