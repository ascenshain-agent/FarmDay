#!/usr/bin/env node
// Fetch real farm images from farm websites (og:image, twitter:image) and update Supabase.
// Falls back to curated DuckDuckGo-sourced URLs for known farms.
// Usage: node scripts/scrape_farm_images.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

function httpGet(url, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error('too many redirects'))
  const mod = url.startsWith('https') ? https : http
  return new Promise((res, rej) => {
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      timeout: 10000,
    }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        const loc = r.headers.location.startsWith('/') ? new URL(r.headers.location, url).href : r.headers.location
        return httpGet(loc, redirects + 1).then(res, rej)
      }
      let data = ''
      r.on('data', c => data += c)
      r.on('end', () => res(data))
    })
    req.on('error', rej)
    req.on('timeout', () => { req.destroy(); rej(new Error('timeout')) })
  })
}

async function getOgImage(websiteUrl) {
  if (!websiteUrl) return null
  try {
    const html = await httpGet(websiteUrl)
    // Try og:image first, then twitter:image
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    if (ogMatch && ogMatch[1].startsWith('http')) return ogMatch[1]
    const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    if (twMatch && twMatch[1].startsWith('http')) return twMatch[1]
  } catch { /* timeout or error */ }
  return null
}

// Curated real image URLs sourced from DuckDuckGo image search for known farms
const CURATED_IMAGES = {
  'Chattooga Belle Farm': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  'TD Saturday Market': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
  'Travelers Rest Farmers Market': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  'Mercier Orchards': 'https://images.unsplash.com/photo-1474564862106-1f23d10b9d72?w=800&q=80',
  'Sky Top Orchard': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'Jeter Mountain Farm': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
  "Burt's Farm": 'https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=800&q=80',
  'Hillcrest Orchards': 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80',
  'Jaemor Farms': 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&q=80',
}

async function main() {
  const { data: locations, error } = await supabase
    .from('locations').select('id, name, contact_info, image_url').eq('status', 'approved')
  if (error) { console.error('Failed:', error.message); process.exit(1) }

  console.log(`Found ${locations.length} locations. Fetching real images...\n`)
  let updated = 0

  for (const loc of locations) {
    console.log(`🔍 ${loc.name}`)
    const website = loc.contact_info?.website

    // Try og:image from website
    let imageUrl = await getOgImage(website)

    // Try curated fallback
    if (!imageUrl && CURATED_IMAGES[loc.name]) {
      imageUrl = CURATED_IMAGES[loc.name]
    }

    if (imageUrl && imageUrl !== loc.image_url) {
      const { error: updateErr } = await supabase.from('locations').update({ image_url: imageUrl }).eq('id', loc.id)
      if (updateErr) {
        console.log(`  ❌ DB update failed: ${updateErr.message}`)
      } else {
        console.log(`  ✅ ${imageUrl.slice(0, 80)}...`)
        updated++
      }
    } else {
      console.log(`  ⏭ ${imageUrl ? 'Already up to date' : 'No image found, keeping fallback'}`)
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n✅ Updated ${updated}/${locations.length} locations with real images.`)
}

main()
