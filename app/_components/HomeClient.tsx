'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MapWrapper from './MapWrapper'
import UserAvatar from './UserAvatar'
import type { Location, ActivityType } from '@/lib/types'

const ACTIVITIES: ActivityType[] = ['u-pick', 'farm fun', 'farmers market', 'events']
const LABELS: Record<ActivityType, string> = {
  'u-pick': 'U-Pick',
  'farm fun': 'Farm Fun',
  'farmers market': 'Farmers Markets',
  'events': 'Events',
}

export default function HomeClient() {
  const [locations, setLocations] = useState<Location[]>([])
  const [filters, setFilters] = useState<ActivityType[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const url = filters.length
      ? `/api/locations?${filters.map((f) => `activity=${encodeURIComponent(f)}`).join('&')}`
      : '/api/locations'
    fetch(url).then((r) => r.json()).then(setLocations).catch(() => setLocations([]))
  }, [filters])

  function toggleFilter(a: ActivityType) {
    setFilters((prev) => prev.includes(a) ? prev.filter((f) => f !== a) : [...prev, a])
  }

  return (
    <div className="farmday-root">
      {/* Desktop top nav */}
      <header className="desktop-nav">
        <div className="farmday-logo" style={{cursor:'pointer'}} onClick={() => { setFilters([]); window.location.href = '/' }}>
          <span className="logo-icon">🍎</span>
          <span>Farm Day</span>
        </div>
        <nav className="desktop-nav-links">
          <a href="#">Explore</a>
          <a href="#">Saved</a>
          <a href="#">Trips</a>
          <a href="#">Inbox</a>
        </nav>
        <UserAvatar />
      </header>

      {/* Mobile header */}
      <header className="farmday-header mobile-only">
        <button className="header-hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="farmday-logo" style={{cursor:'pointer'}} onClick={() => { setFilters([]); window.location.href = '/' }}>
          <span className="logo-icon">🍎</span>
          <span>Farm Day</span>
        </div>
        <UserAvatar />
      </header>

      {/* Filters */}
      <div className="farmday-filters-bar desktop-hidden">
        <button
          onClick={() => setFilters([])}
          className={`filter-pill${filters.length === 0 ? ' active' : ''}`}
        >
          All
        </button>
        {ACTIVITIES.map((a) => (
          <button
            key={a}
            onClick={() => toggleFilter(a)}
            className={`filter-pill${filters.includes(a) ? ' active' : ''}`}
          >
            {LABELS[a]}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="farmday-body">
        {/* Card list */}
        <div className={`farmday-list${showMap ? ' mobile-hidden' : ''}`}>
          {/* Filters inside list panel on desktop */}
          <div className="farmday-filters-bar mobile-hidden-filters">
            <button
              onClick={() => setFilters([])}
              className={`filter-pill${filters.length === 0 ? ' active' : ''}`}
            >
              All
            </button>
            {ACTIVITIES.map((a) => (
              <button
                key={a}
                onClick={() => toggleFilter(a)}
                className={`filter-pill${filters.includes(a) ? ' active' : ''}`}
              >
                {LABELS[a]}
              </button>
            ))}
          </div>
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
                    <button className="card-heart" aria-label="Save">♡</button>
                  </div>
                  <div className="card-body">
                    <div className="card-title-row">
                      <p className="card-name">{loc.name}</p>
                      <span className="card-rating">★ 4.92</span>
                    </div>
                    <p className="card-desc">{loc.activities.join(' · ')}</p>
                    <p className="card-distance">{loc.address}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className={`farmday-map${showMap ? ' mobile-visible' : ''}`}>
          <MapWrapper locations={locations} hoveredId={hoveredId} visible={showMap} />
        </div>
      </div>

      {/* Floating View Map button */}
      <button
        className={`view-map-fab${showMap ? ' active' : ''}`}
        onClick={() => setShowMap((v) => !v)}
      >
        <span className="fab-icon">🗺</span>
        {showMap ? 'View List' : 'View Map'}
      </button>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button aria-label="Search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button aria-label="Saved">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button aria-label="Today">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <button aria-label="Chat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      </nav>
    </div>
  )
}
