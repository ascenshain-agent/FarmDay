'use client'

import { useState } from 'react'

const LOCATIONS = ['Farm', "Farmer's Market", 'Fruit Stand']
const ACTIVITIES = ['u-pick', 'farm fun', 'farmers market', 'events', 'hay-day fun', "Farmer's Brew", 'Ciders', 'Wines']

export default function SearchBar({ onFilterChange }: { onFilterChange?: (f: string[]) => void }) {
  const [locOpen, setLocOpen] = useState(false)
  const [actOpen, setActOpen] = useState(false)
  const [location, setLocation] = useState('Farm')
  const [activity, setActivity] = useState('All activities')

  function handleSearch() {
    if (!onFilterChange) return
    if (location === "Farmer's Market") onFilterChange(['farmers market'])
    else if (activity !== 'All activities') onFilterChange([activity])
    else onFilterChange([])
  }

  const actDisabled = location === "Farmer's Market" || location === 'Fruit Stand'

  return (
    <div className="search-pill-container">
      <div className="search-pill">
        {/* Where to */}
        <div className="search-section" onClick={() => { setLocOpen(!locOpen); setActOpen(false) }}>
          <div className="search-label">Where to?</div>
          <div className="search-value">{location}</div>
          {locOpen && (
            <div className="search-dropdown">
              {LOCATIONS.map(opt => (
                <div key={opt} className="search-option" onClick={(e) => { e.stopPropagation(); setLocation(opt); setLocOpen(false); if (opt !== 'Farm') { setActivity('All activities') } }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-divider" />

        {/* Activities */}
        <div className={`search-section${actDisabled ? ' disabled' : ''}`} onClick={() => { if (actDisabled) return; setActOpen(!actOpen); setLocOpen(false) }}>
          <div className="search-label">Activities</div>
          <div className="search-value">{actDisabled ? '—' : activity}</div>
          {actOpen && (
            <div className="search-dropdown">
              <div className="search-option" onClick={(e) => { e.stopPropagation(); setActivity('All activities'); setActOpen(false) }}>All activities</div>
              {ACTIVITIES.map(opt => (
                <div key={opt} className="search-option" onClick={(e) => { e.stopPropagation(); setActivity(opt); setActOpen(false) }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search button */}
        <button className="search-submit" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>
  )
}
