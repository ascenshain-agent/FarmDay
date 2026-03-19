'use client'

import { useEffect, useRef } from 'react'
import type { Location } from '@/lib/types'

interface MapProps {
  locations: Location[]
}

export default function Map({ locations }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Greenville, SC
      const map = L.map(mapRef.current!).setView([34.8526, -82.3940], 9)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      locations.forEach((loc) => {
        L.marker([loc.latitude, loc.longitude])
          .addTo(map)
          .bindPopup(`<strong>${loc.name}</strong><br/>${loc.address}`)
      })
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    import('leaflet').then((L) => {
      locations.forEach((loc) => {
        L.marker([loc.latitude, loc.longitude])
          .addTo(map)
          .bindPopup(`<strong>${loc.name}</strong><br/>${loc.address}`)
      })
    })
  }, [locations])

  return <div ref={mapRef} className="w-full h-full" />
}
