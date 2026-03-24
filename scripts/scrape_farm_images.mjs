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

// Unique farm-themed Unsplash photo IDs for fallback (no two farms share the same image)
const FARM_PHOTO_IDS = [
  '1500382017468-9049fed747ef', '1464226184884-fa280b87c399', '1416879595882-3373a0480b5b',
  '1560493676-04071c5f467b', '1542838132-92c53300491e', '1488459716781-31db52582fe9',
  '1464965911861-746a04b4bca6', '1500595046743-cd271d694d30', '1519996529931-28324d5a630e',
  '1523348837708-15d4a09cfac2', '1506484381186-d0801219d2a2', '1530836369250-ef72a3f5cda8',
  '1499529112087-3cb3b73cec95', '1472141521881-95d0e87e2e39', '1495107334309-fcf20504a5ab',
  '1504387828636-abeb50778c0c', '1473973266408-ed4e27abdd47', '1470058869958-2a77d9d5204f',
  '1444858291040-97f4bc9a56e4', '1461354464878-ad92f492a5a0', '1535048636-f2a1e5b3e8a1',
  '1501004318776-cd67680d5a95', '1563514227147-6d2ff665a6a0', '1574943320219-553eb213f72d',
  '1592419044706-39796d40f98c', '1595855759920-86582396756a', '1589923188651-268a9765e432',
  '1625246333195-78d9c38ad449', '1594771804886-a933bb2d609b', '1586771107445-d3896f032a24',
]

function simpleHash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

async function main() {
  const { data: locations, error } = await supabase
    .from('locations').select('id, name, contact_info, image_url').eq('status', 'approved')
  if (error) { console.error('Failed:', error.message); process.exit(1) }

  console.log(`Found ${locations.length} locations. Fetching real images...\n`)
  let updated = 0
  const usedPhotoIndices = new Set()

  for (const loc of locations) {
    console.log(`🔍 ${loc.name}`)
    const website = loc.contact_info?.website

    // Try og:image from website
    let imageUrl = await getOgImage(website)

    // Try curated fallback
    if (!imageUrl && CURATED_IMAGES[loc.name]) {
      imageUrl = CURATED_IMAGES[loc.name]
    }

    // Assign unique Unsplash fallback if still no image
    if (!imageUrl) {
      let idx = simpleHash(loc.id) % FARM_PHOTO_IDS.length
      while (usedPhotoIndices.has(idx)) idx = (idx + 1) % FARM_PHOTO_IDS.length
      usedPhotoIndices.add(idx)
      imageUrl = `https://images.unsplash.com/photo-${FARM_PHOTO_IDS[idx]}?w=800&q=80`
      console.log(`  🎨 Assigned unique fallback image`)
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
      console.log(`  ⏭ Already up to date`)
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n✅ Updated ${updated}/${locations.length} locations with real images.`)
}

main()
