'use client'

import dynamic from 'next/dynamic'
import type { Location } from '@/lib/types'

const Map = dynamic(() => import('./Map'), { ssr: false })

export default function MapWrapper({ locations, hoveredId }: { locations: Location[]; hoveredId?: string | null }) {
  return <Map locations={locations} hoveredId={hoveredId} />
}
