'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import MapWrapper from './MapWrapper'
import UserAvatar from './UserAvatar'
import SearchBar from './SearchBar'
import type { Location, ActivityType } from '@/lib/types'

const RIPE_NOW = [
  { emoji: '🍓', name: 'Strawberries', note: 'Peak season' },
  { emoji: '🥬', name: 'Lettuce', note: 'Ready now' },
  { emoji: '🥕', name: 'Carrots', note: 'Fresh harvest' },
  { emoji: '🫛', name: 'Snap Peas', note: 'Just started' },
  { emoji: '🧅', name: 'Green Onions', note: 'Abundant' },
  { emoji: '🫐', name: 'Blueberries', note: 'Coming soon' },
]

export default function HomeClient() {
  const [locations, setLocations] = useState<Location[]>([])
  const [featured, setFeatured] = useState<Location[]>([])
  const [filters, setFilters] = useState<ActivityType[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    fetch('/api/locations?featured=true').then((r) => r.json()).then(setFeatured).catch(() => {})
  }, [])

  useEffect(() => {
    const url = filters.length
      ? `/api/locations?${filters.map((f) => `activity=${encodeURIComponent(f)}`).join('&')}`
      : '/api/locations'
    fetch(url).then((r) => r.json()).then(setLocations).catch(() => setLocations([]))
  }, [filters])

  return (
    <div className="farmday-root">
      {/* Desktop top nav */}
      <header className="desktop-nav">
        <nav className="desktop-nav-links">
          <a href="#">Explore</a>
          <a href="#">Saved</a>
          <a href="#">Trips</a>
          <a href="#">Inbox</a>
        </nav>
        <UserAvatar />
      </header>

      {/* Single search bar for all viewports */}
      <SearchBar onFilterChange={(f) => setFilters(f as ActivityType[])} />

      {/* Mobile header: avatar only (no hamburger) */}
      <header className="farmday-header mobile-only">
        <UserAvatar />
      </header>

      {/* Body */}
      <div className="farmday-body">
        {/* Card list */}
        <div className={`farmday-list${showMap ? ' mobile-hidden' : ''}`}>

          {/* Hero: Seasonal Picks — manual scroll */}
          {featured.length > 0 && (
            <div className="hero-section">
              <p className="hero-label">⭐ Seasonal Picks</p>
              <div className="hero-scroll">
                {featured.map((loc, i) => (
                  <motion.div
                    key={loc.id}
                    className="hero-slide"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Link href={`/locations/${loc.id}`} className="farm-card">
                      <div className="card-img-wrap">
                        {loc.image_url ? (
                          <Image src={loc.image_url} alt={loc.name} fill sizes="300px" className="card-img" unoptimized />
                        ) : (
                          <div className="card-img-placeholder" />
                        )}
                        <span className="hero-badge">Featured</span>
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
                  </motion.div>
                ))}

                {/* Ripe Now news tile */}
                <motion.div
                  className="hero-slide"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: featured.length * 0.1 }}
                >
                  <div className="ripe-now-card">
                    <p className="ripe-now-title">🌱 Ripe for Picking</p>
                    <ul className="ripe-now-list">
                      {RIPE_NOW.map((item) => (
                        <li key={item.name}>
                          <span>{item.emoji}</span>
                          <span className="ripe-name">{item.name}</span>
                          <span className="ripe-note">{item.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          <p className="farmday-count">{locations.length} farm{locations.length !== 1 ? 's' : ''} near Greenville, SC</p>
          <div className="card-grid">
            <AnimatePresence mode="popLayout">
              {locations.length === 0 ? (
                <motion.p key="empty" className="empty-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  No locations found.
                </motion.p>
              ) : (
                locations.map((loc, i) => (
                  <motion.div
                    key={loc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link
                      href={`/locations/${loc.id}`}
                      className="farm-card"
                      onMouseEnter={() => setHoveredId(loc.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="card-img-wrap">
                        {loc.image_url ? (
                          <Image src={loc.image_url} alt={loc.name} fill sizes="(max-width: 768px) 100vw, 300px" className="card-img" unoptimized />
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
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Map */}
        <div className={`farmday-map${showMap ? ' mobile-visible' : ''}`}>
          <MapWrapper locations={locations} hoveredId={hoveredId} visible={showMap} />
        </div>
      </div>

      {/* Floating View Map button */}
      <button className={`view-map-fab${showMap ? ' active' : ''}`} onClick={() => setShowMap((v) => !v)}>
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
