'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [styleOpen, setStyleOpen] = useState(false)
  const [barnOpen, setBarnOpen] = useState(false)

  const [style, setStyle] = useState('Farm')
  const [barn, setBarn] = useState('u-pick')

  return (
    <div className="search-pill-container">
      <div className="search-pill">
        
        {/* Section 1: Style */}
        <div className="search-section" onClick={() => { setStyleOpen(!styleOpen); setBarnOpen(false); }}>
          <div className="search-label">Style</div>
          <div className="search-value">{style}</div>
          {styleOpen && (
            <div className="search-dropdown">
              {['Farm', "Farmer's Market", 'Fruit Stand'].map(opt => (
                <div key={opt} className="search-option" onClick={(e) => { e.stopPropagation(); setStyle(opt); setStyleOpen(false); }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-divider" />

        {/* Section 2: What's in the barn */}
        <div className="search-section" onClick={() => { setBarnOpen(!barnOpen); setStyleOpen(false); }}>
          <div className="search-label">What's in the barn?</div>
          <div className="search-value">{barn}</div>
          {barnOpen && (
            <div className="search-dropdown">
              {['u-pick', 'hay-day fun', "Farmer's Brew", 'Ciders', 'Wines'].map(opt => (
                <div key={opt} className="search-option" onClick={(e) => { e.stopPropagation(); setBarn(opt); setBarnOpen(false); }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Search Button */}
        <button className="search-submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

      </div>
    </div>
  )
}
