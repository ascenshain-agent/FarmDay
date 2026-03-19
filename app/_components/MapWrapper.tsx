'use client'

import dynamic from 'next/dynamic'
import type { Location } from '@/lib/types'

const Map = dynamic(() => import('./Map'), { ssr: false })

export default function MapWrapper({ locations }: { locations: Location[] }) {
  return <Map locations={locations} />
}
