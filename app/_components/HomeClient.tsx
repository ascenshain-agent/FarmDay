'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MapWrapper from './MapWrapper'
import type { Location, ActivityType } from '@/lib/types'

const ACTIVITIES: ActivityType[] = ['u-pick', 'farm fun', 'market', 'events']

export default function HomeClient() {
  const [locations, setLocations] = useState<Location[]>([])
  const [filter, setFilter] = useState<ActivityType | null>(null)

  useEffect(() => {
    const url = filter ? `/api/locations?activity=${encodeURIComponent(filter)}` : '/api/locations'
    fetch(url).then((r) => r.json()).then(setLocations).catch(() => setLocations([]))
  }, [filter])

  return (
    <main className="flex flex-col h-screen">
      <header className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-green-700">Farm Day</h1>
        <p className="text-sm text-gray-500">Discover agri-tourism near Greenville, SC</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              filter === null
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
            }`}
          >
            All
          </button>
          {ACTIVITIES.map((a) => (
            <button
              key={a}
              onClick={() => setFilter(filter === a ? null : a)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                filter === a
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <MapWrapper locations={locations} />
        </div>

        <aside className="hidden md:flex flex-col w-80 border-l overflow-y-auto bg-white">
          {locations.length === 0 ? (
            <p className="p-4 text-gray-400 text-sm">No locations found.</p>
          ) : (
            locations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer block"
              >
                <p className="font-semibold">{loc.name}</p>
                <p className="text-sm text-gray-500">{loc.address}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {loc.activities.map((a) => (
                    <span key={a} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          )}
        </aside>
      </div>
    </main>
  )
}
