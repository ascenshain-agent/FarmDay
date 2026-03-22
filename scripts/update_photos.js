// Update image_url for all locations using Google Places Text Search API
// Run: node scripts/update_photos.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const PLACES_KEY = env.GOOGLE_PLACES_API_KEY

async function getPhotoUrl(name, address) {
  const query = encodeURIComponent(`${name} ${address}`)
  const searchRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${PLACES_KEY}`
  )
  const searchData = await searchRes.json()
  const place = searchData.results?.[0]
  if (!place) return null

  const photoRef = place.photos?.[0]?.photo_reference
  if (!photoRef) return null

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${PLACES_KEY}`
}

const { data: locations, error } = await supabase.from('locations').select('id, name, address')
if (error) throw error

console.log(`Updating ${locations.length} locations...`)

for (const loc of locations) {
  const imageUrl = await getPhotoUrl(loc.name, loc.address)
  if (!imageUrl) {
    console.log(`  ✗ No photo found: ${loc.name}`)
    continue
  }
  const { error: updateError } = await supabase
    .from('locations')
    .update({ image_url: imageUrl })
    .eq('id', loc.id)
  if (updateError) {
    console.log(`  ✗ Update failed: ${loc.name} — ${updateError.message}`)
  } else {
    console.log(`  ✓ Updated: ${loc.name}`)
  }
}

console.log('Done.')
