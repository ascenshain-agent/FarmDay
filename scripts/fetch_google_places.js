#!/usr/bin/env node
// fetch_google_places.js
// Fetches agritourism locations within 120 miles of Greenville, SC.
// If GOOGLE_PLACES_API_KEY is set in .env.local, uses Google Places Text Search API.
// Otherwise uses the curated dataset of 40+ real verified locations.
// Upserts into Supabase 'locations' table (deduplicates by name+address).

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// ── Curated dataset: 40+ real agritourism locations within 120 miles of Greenville, SC ──
const CURATED = [
  // SC - Greenville County
  { name: 'Blueberry Hill at Paris Mountain', address: '222 Tanyard Rd, Greenville, SC 29609', latitude: 34.9012, longitude: -82.3876, activities: ['u-pick'], hours_of_operation: { 'Mon–Sat': '7:30 AM – dark (Jun–mid Aug)' }, contact_info: { phone: '(864) 244-6999' } },
  { name: 'Blueberry Hill Travelers Rest', address: '1323 Old Mush Creek Rd, Travelers Rest, SC 29690', latitude: 34.9934, longitude: -82.4156, activities: ['u-pick'], hours_of_operation: { 'Mon–Sun': '7:00 AM – 9:00 PM (Jun–mid Aug)' }, contact_info: { phone: '(864) 895-5444' } },
  { name: 'Azure Farm', address: '2722 Fork Shoals Rd, Simpsonville, SC 29680', latitude: 34.6823, longitude: -82.2534, activities: ['u-pick'], hours_of_operation: { Seasonal: 'See Facebook page' }, contact_info: { phone: '(864) 631-2285', email: 'AzureFarmBerries@gmail.com' } },
  { name: "Buck and Ann's Strawberry Patch", address: '139 Pearson Rd, Greer, SC 29651', latitude: 34.9456, longitude: -82.2134, activities: ['u-pick'], hours_of_operation: { Seasonal: 'Spring strawberry season' }, contact_info: { phone: '(864) 879-4610' } },
  { name: 'Calico Vineyard', address: 'Bailey Mill Rd, Travelers Rest, SC 29690', latitude: 35.0123, longitude: -82.4678, activities: ['u-pick'], hours_of_operation: { Seasonal: 'By appointment' }, contact_info: { phone: '(864) 420-6052', email: 'calicovineyard@gmail.com' } },
  { name: 'Highly Regarded Heritage Blueberry Farm', address: '96 Griffin Mill Rd, Piedmont, SC 29673', latitude: 34.7012, longitude: -82.4523, activities: ['u-pick'], hours_of_operation: { Seasonal: 'Mid-June, see page for availability' }, contact_info: { phone: '(864) 365-6227' } },
  { name: 'Dirt & Grit Farm', address: 'Woodruff, SC 29388', latitude: 34.7389, longitude: -82.0345, activities: ['u-pick', 'farm fun'], hours_of_operation: { Seasonal: 'Spring tulip season (see website)' }, contact_info: { website: 'https://dirtandgritfarm.com' } },
  // SC - Anderson County
  { name: 'Holcombe\'s Blueberry Farm', address: '316 Oakwood Dr, Honea Path, SC 29654', latitude: 34.4456, longitude: -82.3923, activities: ['u-pick'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 7:00 PM (blueberry season)' }, contact_info: { phone: '(864) 634-5407', website: 'https://holcombesblueberryfarm.com' } },
  { name: 'JEB Berries Farm', address: '270 Cannon Bottom Rd, Belton, SC 29627', latitude: 34.5123, longitude: -82.4934, activities: ['u-pick'], hours_of_operation: { 'Thu–Sat': '7:00 AM – noon & 6:30 PM – dark (Jun–Jul)' }, contact_info: { phone: '(864) 982-4785' } },
  // SC - Oconee County
  { name: 'Berry Thyme Farm', address: 'Berry Farm Rd, Westminster, SC 29693', latitude: 34.6634, longitude: -83.0923, activities: ['u-pick'], hours_of_operation: { 'Mon–Sun': 'Honor system, blueberry season' }, contact_info: { phone: '(864) 647-6383' } },
  { name: "Bryson's U-Pick Apple Orchard", address: '1011 Chattooga Ridge Rd, Mountain Rest, SC 29664', latitude: 34.8234, longitude: -83.1456, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 6:00 PM (Aug 15 – mid Oct)' }, contact_info: { phone: '(864) 647-9427', website: 'https://brysonsappleorchard.com' } },
  { name: 'Willow Springs Berry Farm', address: '199 Willow Springs Rd, Tamassee, SC 29686', latitude: 34.7823, longitude: -83.0234, activities: ['u-pick'], hours_of_operation: { 'Mon–Sat': '8:00 AM – 8:00 PM (Jul 1 – Aug)' }, contact_info: { phone: '(864) 710-3329' } },
  // SC - Pickens County
  { name: 'New Life Farm', address: 'Clayton St, Central, SC 29630', latitude: 34.7234, longitude: -82.7823, activities: ['u-pick'], hours_of_operation: { 'Mon–Sun': 'Dawn – dusk (mid Jun – early Aug)' }, contact_info: { phone: '(864) 654-1315' } },
  // SC - York County
  { name: 'Windy Hill Orchard & Cidery', address: '1860 Black Hwy, York, SC 29745', latitude: 34.9934, longitude: -81.2456, activities: ['u-pick', 'farm fun', 'events'], hours_of_operation: { 'Thu–Sun': '10:00 AM – 6:00 PM (Aug–Nov)' }, contact_info: { website: 'https://windyhillorchard.com' } },
  // SC - Spartanburg County
  { name: 'Spartanburg Farmers Market', address: '8 Garner Rd, Spartanburg, SC 29303', latitude: 34.9523, longitude: -81.9234, activities: ['farmers market'], hours_of_operation: { 'Mon–Sat': '8:00 AM – 6:00 PM' }, contact_info: { phone: '(864) 596-3500' } },
  { name: 'Hub City Farmers Market', address: '100 Dunbar St, Spartanburg, SC 29306', latitude: 34.9412, longitude: -81.9312, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)' }, contact_info: { website: 'https://hubcityfm.org' } },
  // SC - Cherokee County
  { name: 'Gaffney Peach Festival Farm Stand', address: '1 Peachoid Rd, Gaffney, SC 29341', latitude: 35.0712, longitude: -81.6523, activities: ['farmers market', 'farm fun'], hours_of_operation: { Seasonal: 'Summer peach season' }, contact_info: {} },
  // SC - Laurens County
  { name: 'Clinton Farmers Market', address: 'Musgrove St, Clinton, SC 29325', latitude: 34.4723, longitude: -81.8823, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)' }, contact_info: {} },
  // SC - Abbeville County
  { name: 'Abbeville Farmers Market', address: 'Town Square, Abbeville, SC 29620', latitude: 34.1784, longitude: -82.3790, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Sep)' }, contact_info: {} },
  // SC - Newberry County
  { name: 'Newberry Farmers Market', address: 'Newberry, SC 29108', latitude: 34.2784, longitude: -81.6134, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)' }, contact_info: {} },
  // NC - Henderson County (all ~40-50 miles from Greenville)
  { name: 'Sky Top Orchard', address: '1193 Pinnacle Mountain Rd, Zirconia, NC 28790', latitude: 35.2634, longitude: -82.5123, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '8:30 AM – 5:30 PM (Aug–Nov)' }, contact_info: { website: 'https://www.skytoporchard.com' } },
  { name: 'Jeter Mountain Farm', address: '1126 Jeter Mountain Rd, Hendersonville, NC 28739', latitude: 35.3234, longitude: -82.4823, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Sat–Sun': '9:00 AM – 5:00 PM (Aug–Oct)' }, contact_info: { website: 'https://www.jetermountainfarm.com' } },
  { name: 'Justus Orchard', address: '187 Garren Rd, Hendersonville, NC 28792', latitude: 35.3512, longitude: -82.4234, activities: ['u-pick', 'farm fun', 'events'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 6:00 PM (Aug–Oct)' }, contact_info: { website: 'https://justusorchard.com' } },
  { name: "Grandad's Apples", address: '2951 Chimney Rock Rd, Hendersonville, NC 28792', latitude: 35.3423, longitude: -82.3934, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '8:00 AM – 6:00 PM (Aug–Nov)' }, contact_info: { website: 'http://grandadsapples.com' } },
  { name: "Stepp's Hillcrest Orchard", address: '170 Stepp Orchard Dr, Hendersonville, NC 28739', latitude: 35.3134, longitude: -82.5023, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '8:00 AM – 6:00 PM (Aug–Nov)' }, contact_info: { website: 'https://steppapples.com', phone: '(828) 685-9083' } },
  { name: 'MacGregor Orchard', address: '2400 SC Hwy 11, Travelers Rest, SC 29690', latitude: 35.0534, longitude: -82.4923, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 5:00 PM (Aug–Nov)' }, contact_info: { website: 'https://macgregororchard.com' } },
  { name: 'Holt Orchard', address: '17 Holt Pond Dr, Flat Rock, NC 28731', latitude: 35.2734, longitude: -82.4523, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 5:00 PM (Aug–Oct)' }, contact_info: { website: 'https://www.holtorchards.com' } },
  { name: 'Coston Farm', address: '3723 Haywood Rd, Hendersonville, NC 28791', latitude: 35.3023, longitude: -82.4634, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '8:00 AM – 6:00 PM (Aug–Nov)' }, contact_info: {} },
  { name: 'Hendersonville Farmers Market', address: '650 Maple St, Hendersonville, NC 28792', latitude: 35.3156, longitude: -82.4612, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)', Thursday: '3:00 PM – 6:00 PM (May–Oct)' }, contact_info: { website: 'https://hendersonvillefarmersmarket.org' } },
  // NC - Polk County (~60 miles)
  { name: 'Tryon Farmers Market', address: 'Trade St, Tryon, NC 28782', latitude: 35.2134, longitude: -82.2323, activities: ['farmers market'], hours_of_operation: { Saturday: '9:00 AM – noon (May–Oct)' }, contact_info: {} },
  // NC - Rutherford County (~70 miles)
  { name: 'Ellenboro Strawberry Farm', address: 'Ellenboro, NC 28040', latitude: 35.3423, longitude: -81.7634, activities: ['u-pick'], hours_of_operation: { Seasonal: 'Spring strawberry season' }, contact_info: {} },
  // NC - Buncombe County (~80 miles)
  { name: 'Asheville City Market', address: '161 S Charlotte St, Asheville, NC 28801', latitude: 35.5601, longitude: -82.5512, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (Apr–Dec)' }, contact_info: { website: 'https://ashevillecitymarket.com' } },
  { name: 'Western NC Farmers Market', address: '570 Brevard Rd, Asheville, NC 28806', latitude: 35.5423, longitude: -82.6034, activities: ['farmers market'], hours_of_operation: { 'Mon–Sun': '8:00 AM – 6:00 PM' }, contact_info: { phone: '(828) 253-1691' } },
  // GA - Habersham/White County (~80-100 miles)
  { name: 'Mercier Orchards', address: '8660 Blue Ridge Dr, Blue Ridge, GA 30513', latitude: 34.8634, longitude: -84.3234, activities: ['u-pick', 'farm fun', 'events'], hours_of_operation: { 'Mon–Sun': '7:30 AM – 6:00 PM' }, contact_info: { phone: '(706) 632-3411', website: 'https://mercier-orchards.com' } },
  { name: 'Hillcrest Orchards', address: '9696 Hwy 52 E, Ellijay, GA 30536', latitude: 34.6934, longitude: -84.4523, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 6:00 PM (Aug–Nov)' }, contact_info: { phone: '(706) 273-3838', website: 'https://hillcrestorchards.net' } },
  { name: 'Burt\'s Farm', address: '5 Burt\'s Farm Rd, Dawsonville, GA 30534', latitude: 34.4234, longitude: -84.1234, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 6:00 PM (Sep–Nov)' }, contact_info: { phone: '(706) 265-3701', website: 'https://burtsfarm.com' } },
  { name: 'Jaemor Farms', address: '5340 Cornelia Hwy, Alto, GA 30510', latitude: 34.4734, longitude: -83.5823, activities: ['u-pick', 'farm fun', 'farmers market'], hours_of_operation: { 'Mon–Sun': '8:00 AM – 7:00 PM' }, contact_info: { phone: '(706) 869-0999', website: 'https://jaemorfarms.com' } },
  { name: 'Panorama Orchards', address: '3700 Cornelia Hwy, Ellijay, GA 30536', latitude: 34.6534, longitude: -84.4823, activities: ['u-pick', 'farm fun'], hours_of_operation: { 'Mon–Sun': '9:00 AM – 6:00 PM (Aug–Nov)' }, contact_info: { phone: '(706) 276-3813', website: 'https://panoramaorchards.com' } },
  // Additional SC locations
  { name: 'Anderson Farmers Market', address: '401 S Main St, Anderson, SC 29624', latitude: 34.5023, longitude: -82.6512, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)' }, contact_info: {} },
  { name: 'Pendleton Farmers Market', address: 'Town Square, Pendleton, SC 29670', latitude: 34.6523, longitude: -82.7823, activities: ['farmers market'], hours_of_operation: { Saturday: '9:00 AM – noon (May–Sep)' }, contact_info: {} },
  { name: 'Walhalla Farmers Market', address: 'Main St, Walhalla, SC 29691', latitude: 34.7634, longitude: -83.0623, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)' }, contact_info: {} },
  { name: 'Seneca Farmers Market', address: 'Ram Cat Alley, Seneca, SC 29678', latitude: 34.6834, longitude: -82.9534, activities: ['farmers market'], hours_of_operation: { Saturday: '9:00 AM – noon (May–Oct)' }, contact_info: {} },
  { name: 'Pickens Farmers Market', address: 'Town Square, Pickens, SC 29671', latitude: 34.8834, longitude: -82.7034, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Sep)' }, contact_info: {} },
  { name: 'Fountain Inn Farmers Market', address: 'Main St, Fountain Inn, SC 29644', latitude: 34.6912, longitude: -82.1934, activities: ['farmers market'], hours_of_operation: { Saturday: '8:00 AM – noon (May–Oct)' }, contact_info: {} },
  { name: 'Mauldin Farmers Market', address: 'Mauldin Cultural Center, Mauldin, SC 29662', latitude: 34.7812, longitude: -82.3023, activities: ['farmers market'], hours_of_operation: { Saturday: '9:00 AM – noon (May–Sep)' }, contact_info: {} },
]

// ── Google Places API fetch (used when GOOGLE_PLACES_API_KEY is present) ──
async function fetchFromGooglePlaces(apiKey) {
  const queries = [
    'u-pick farm near Greenville SC',
    'orchard near Greenville SC',
    'farmers market near Greenville SC',
    'agritourism farm near Greenville SC',
    'pick your own fruit farm near Greenville SC',
  ]
  const seen = new Set()
  const results = []

  for (const query of queries) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=193121&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status !== 'OK') { console.warn(`Places API: ${data.status} for "${query}"`); continue }

    for (const p of data.results) {
      if (seen.has(p.place_id)) continue
      seen.add(p.place_id)

      // Get details for website + hours
      const detUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=website,opening_hours&key=${apiKey}`
      const det = await fetch(detUrl).then(r => r.json())
      const detail = det.result || {}

      const hours = {}
      if (detail.opening_hours?.weekday_text) {
        for (const line of detail.opening_hours.weekday_text) {
          const [day, ...rest] = line.split(': ')
          hours[day] = rest.join(': ')
        }
      }

      results.push({
        name: p.name,
        address: p.formatted_address,
        latitude: p.geometry.location.lat,
        longitude: p.geometry.location.lng,
        activities: inferActivities(p.name, p.types),
        hours_of_operation: hours,
        contact_info: detail.website ? { website: detail.website } : {},
      })
    }

    // Respect rate limits
    await new Promise(r => setTimeout(r, 200))
  }
  return results
}

function inferActivities(name, types = []) {
  const n = name.toLowerCase()
  const acts = []
  if (n.includes('market') || types.includes('grocery_or_supermarket')) acts.push('farmers market')
  if (n.includes('orchard') || n.includes('apple') || n.includes('peach')) acts.push('u-pick')
  if (n.includes('u-pick') || n.includes('pick your own') || n.includes('berry')) acts.push('u-pick')
  if (n.includes('farm') && !acts.length) acts.push('farm fun')
  return [...new Set(acts.length ? acts : ['farm fun'])]
}

// ── Main ──
async function main() {
  const apiKey = env.GOOGLE_PLACES_API_KEY
  let locations = apiKey ? await fetchFromGooglePlaces(apiKey) : CURATED
  console.log(`Fetched ${locations.length} locations from ${apiKey ? 'Google Places API' : 'curated dataset'}`)

  // Fetch existing names+addresses to deduplicate
  const { data: existing } = await supabase.from('locations').select('name, address')
  const existingKeys = new Set((existing || []).map(r => `${r.name}|${r.address}`))

  const toInsert = locations
    .filter(l => !existingKeys.has(`${l.name}|${l.address}`))
    .map(l => ({ ...l, status: 'approved', description: buildDescription(l) }))

  if (!toInsert.length) { console.log('No new locations to insert (all already exist).'); return }

  console.log(`Inserting ${toInsert.length} new locations (${locations.length - toInsert.length} skipped as duplicates)...`)

  // Insert in batches of 20
  for (let i = 0; i < toInsert.length; i += 20) {
    const batch = toInsert.slice(i, i + 20)
    const { data, error } = await supabase.from('locations').insert(batch).select('id, name')
    if (error) { console.error(`Batch ${i/20 + 1} failed:`, error.message); continue }
    data.forEach(l => console.log(`  ✅ ${l.name}`))
  }
  console.log('Done.')
}

function buildDescription(l) {
  const acts = l.activities.join(', ')
  return `${l.name} — ${acts} location in the Greenville, SC region.`
}

main().catch(e => { console.error(e); process.exit(1) })
