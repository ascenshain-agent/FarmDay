'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MapWrapper from './MapWrapper'
import type { Location, ActivityType } from '@/lib/types'

const ACTIVITIES: ActivityType[] = ['u-pick', 'farm fun', 'farmers market', 'events']

export default function HomeClient() {
  const [locations, setLocations] = useState<Location[]>([])
  const [filter, setFilter] = useState<ActivityType | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const url = filter ? `/api/locations?activity=${encodeURIComponent(filter)}` : '/api/locations'
    fetch(url).then((r) => r.json()).then(setLocations).catch(() => setLocations([]))
  }, [filter])

  return (
    <div className="farmday-root">
      {/* Header */}
      <header className="farmday-header">
        <div className="farmday-header-inner">
          <span className="farmday-logo">🌾 Farm Day</span>
          <div className="farmday-filters">
            <button
              onClick={() => setFilter(null)}
              className={`filter-pill${filter === null ? ' active' : ''}`}
            >
              All
            </button>
            {ACTIVITIES.map((a) => (
              <button
                key={a}
                onClick={() => setFilter(filter === a ? null : a)}
                className={`filter-pill${filter === a ? ' active' : ''}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="farmday-body">
        {/* Left: card list — hidden on mobile when map is shown */}
        <div className={`farmday-list${showMap ? ' mobile-hidden' : ''}`}>
          <p className="farmday-count">{locations.length} farm{locations.length !== 1 ? 's' : ''} near Greenville, SC</p>
          <div className="card-grid">
            {locations.length === 0 ? (
              <p className="empty-msg">No locations found.</p>
            ) : (
              locations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.id}`}
                  className="farm-card"
                  onMouseEnter={() => setHoveredId(loc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="card-img-wrap">
                    {loc.image_url ? (
                      <Image
                        src={loc.image_url}
                        alt={loc.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="card-img"
                        unoptimized
                      />
                    ) : (
                      <div className="card-img-placeholder" />
                    )}
                  </div>
                  <div className="card-body">
                    <div className="card-tags">
                      {loc.activities.map((a) => (
                        <span key={a} className="card-tag">{a}</span>
                      ))}
                    </div>
                    <p className="card-name">{loc.name}</p>
                    <p className="card-address">{loc.address}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right: sticky map — full screen on mobile when toggled */}
        <div className={`farmday-map${showMap ? ' mobile-visible' : ''}`}>
          <MapWrapper locations={locations} hoveredId={hoveredId} />
        </div>
      </div>

      {/* Mobile floating pill */}
      <button
        className="view-map-pill"
        onClick={() => setShowMap((v) => !v)}
      >
        {showMap ? '☰ View list' : '🗺 View map'}
      </button>
    </div>
  )
}
