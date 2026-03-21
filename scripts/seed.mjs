// Seed script: real farms & farmers markets within 120 miles of Greenville, SC
// Run: node scripts/seed.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env.local manually (no dotenv dependency needed)
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const locations = [
  // ── Farmers Markets ──────────────────────────────────────────────────────────
  {
    name: 'TD Saturday Market',
    description: 'Downtown Greenville\'s flagship farmers market with 75+ vendors, fresh produce, specialty foods, live music, and cooking demos.',
    address: 'Main St at McBee Ave, Greenville, SC 29601',
    latitude: 34.8526,
    longitude: -82.3940,
    activities: ['farmers market'],
    hours_of_operation: { Saturday: '8:00 AM – 12:00 PM (May–Oct)' },
    contact_info: { website: 'https://saturdaymarketlive.com' },
    image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
  },
  {
    name: 'Travelers Rest Farmers Market',
    description: 'Vibrant community market at Trailblazer Park with fresh produce, local goods, storytime, petting zoo, and kids\' play area.',
    address: '235 Trailblazer Dr, Travelers Rest, SC 29690',
    latitude: 34.9693,
    longitude: -82.4432,
    activities: ['farmers market'],
    hours_of_operation: { Saturday: '8:30 AM – 12:00 PM (May–Sep)' },
    contact_info: { website: 'https://travelersrestfarmersmarket.com' },
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  },
  {
    name: 'Simpsonville Farmers Market',
    description: 'Family-friendly market at Simpsonville City Park with fresh produce, handmade crafts, baked goods, face painting, and balloon artists.',
    address: '405 E Curtis St, Simpsonville, SC 29681',
    latitude: 34.7376,
    longitude: -82.2543,
    activities: ['farmers market'],
    hours_of_operation: { Saturday: '8:00 AM – 12:00 PM (May–Sep)' },
    contact_info: {},
    image_url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80',
  },
  {
    name: 'Greer Farmers Market',
    description: 'Lively Tuesday evening market at Greer City Park with local produce, handmade goods, food trucks, live entertainment, and children\'s games.',
    address: '301 E Poinsett St, Greer, SC 29651',
    latitude: 34.9387,
    longitude: -82.2268,
    activities: ['farmers market'],
    hours_of_operation: { Tuesday: '4:30 PM – 7:30 PM (May–Aug)' },
    contact_info: { website: 'https://www.greerfarmersmarket.com' },
    image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80',
  },
  {
    name: 'Greenville State Farmers Market',
    description: 'Year-round indoor/outdoor market offering a wide array of fresh local produce, specialty goods, and farm products from Upstate SC growers.',
    address: '1354 Rutherford Rd, Greenville, SC 29609',
    latitude: 34.8712,
    longitude: -82.4198,
    activities: ['farmers market'],
    hours_of_operation: { 'Mon–Sat': '8:00 AM – 6:00 PM' },
    contact_info: { phone: '(864) 244-4129' },
    image_url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80',
  },
  // ── U-Pick Farms ─────────────────────────────────────────────────────────────
  {
    name: 'Fisher\'s Orchard',
    description: 'Pick-your-own peach farm in Greer with 20+ peach varieties ripening all summer. Fall activities include a corn maze and wagon rides.',
    address: '650 Fisher Rd, Greer, SC 29651',
    latitude: 34.9801,
    longitude: -82.2612,
    activities: ['u-pick', 'farm fun'],
    hours_of_operation: { 'Mon–Sun': '8:00 AM – 7:00 PM (Jun–Aug)' },
    contact_info: { phone: '(864) 895-4115', website: 'https://www.fishersorchard.com' },
    image_url: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&q=80',
  },
  {
    name: 'Sandy Flat Berry Patch',
    description: 'Multi-generation u-pick and pre-picked strawberry farm in the Sandy Flat community between Greer and Travelers Rest.',
    address: '4715 Locust Hill Rd, Taylors, SC 29687',
    latitude: 34.9912,
    longitude: -82.3156,
    activities: ['u-pick'],
    hours_of_operation: { 'Mon–Sat': '7:00 AM – 8:00 PM', Sunday: '1:00 PM – 6:00 PM (Apr–Jun)' },
    contact_info: { phone: '(864) 895-2019' },
    image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80',
  },
  {
    name: 'Arrowhead Acres',
    description: 'Family-owned organic blueberry farm in Travelers Rest foothills, operating since 1980. No pesticides used. U-pick and pre-picked available.',
    address: '37 Bates Bridge Rd, Travelers Rest, SC 29690',
    latitude: 35.0021,
    longitude: -82.4589,
    activities: ['u-pick'],
    hours_of_operation: { 'Mon–Sat': 'Dawn – 8:00 PM (Jun–Jul)' },
    contact_info: { phone: '(864) 836-8418' },
    image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80',
  },
  {
    name: 'Callaham Orchards',
    description: 'Orchard experience with strawberries, peaches, blueberries, blackberries, and more. Gem mine, wooden cow milking, and tractor wagon rides.',
    address: '559 Crawford Rd, Belton, SC 29627',
    latitude: 34.5234,
    longitude: -82.4812,
    activities: ['u-pick', 'farm fun'],
    hours_of_operation: { 'Mon–Sat': 'Late Apr – Oct (call for hours)' },
    contact_info: { phone: '(864) 338-0810' },
    image_url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
  },
  {
    name: 'The Happy Berry',
    description: 'U-pick blueberries, blackberries, figs, grapes, and muscadines on beautiful rolling hills in Six Mile, SC. Recipe folders provided.',
    address: '510 Gap Hill Rd, Six Mile, SC 29682',
    latitude: 34.8023,
    longitude: -82.8234,
    activities: ['u-pick'],
    hours_of_operation: { 'Mon–Fri': '8:00 AM – Dusk', Saturday: '8:00 AM – 6:00 PM (Jun–Sep)' },
    contact_info: { phone: '(864) 350-9345', website: 'https://www.thehappyberry.com' },
    image_url: 'https://images.unsplash.com/photo-1425934398893-310a009a77f9?w=800&q=80',
  },
  {
    name: 'Hunter Farms and Greenhouse',
    description: 'U-pick strawberry farm in Easley with two sweet varieties. Greenhouses open April 1st with bedding plants, herbs, and hanging baskets.',
    address: '607 Jameson Rd, Easley, SC 29640',
    latitude: 34.8298,
    longitude: -82.5912,
    activities: ['u-pick', 'farm fun'],
    hours_of_operation: { 'Mon–Fri': '8:00 AM – Dusk', Saturday: '8:00 AM – 6:00 PM (Mid-Apr – Jun)' },
    contact_info: { phone: '(864) 859-2978', website: 'https://www.hunterfarmsonline.com' },
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  },
  {
    name: 'Chattooga Belle Farm',
    description: 'Mountain farm with u-pick apples, peaches, blueberries, blackberries, muscadines, and more. On-site distillery, gift shop, and event venue.',
    address: '454 Damascus Church Rd, Long Creek, SC 29658',
    latitude: 34.7456,
    longitude: -83.1234,
    activities: ['u-pick', 'farm fun', 'events'],
    hours_of_operation: { 'Mon–Sat': '9:00 AM – 5:00 PM' },
    contact_info: { phone: '(864) 647-9768', website: 'https://www.chattoogabellefarm.com' },
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  },
  // ── Farm Fun ─────────────────────────────────────────────────────────────────
  {
    name: 'Beechwood Farms',
    description: 'Certified roadside market and u-pick farm in Marietta with strawberries, sweet corn, tomatoes, squash, and more. Open May through October.',
    address: '204 Bates Bridge Rd, Marietta, SC 29683',
    latitude: 35.0134,
    longitude: -82.4712,
    activities: ['u-pick', 'farm fun'],
    hours_of_operation: { 'Mon–Sat': '8:00 AM – 6:30 PM (May–Oct)' },
    contact_info: { phone: '(864) 836-6075', website: 'https://www.mybeechwoodfarms.com' },
    image_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
  },
  {
    name: 'Golden Acres',
    description: 'U-pick berry farm with strawberries, blueberries, blackberries, peaches, and pumpkins. Fall Fest with jumping pillow, farm animals, and birthday parties.',
    address: '7900 Hwy 81 S, Starr, SC 29684',
    latitude: 34.3912,
    longitude: -82.6823,
    activities: ['u-pick', 'farm fun', 'events'],
    hours_of_operation: { Friday: '8:00 AM – 2:00 PM', Saturday: '9:00 AM – 2:00 PM' },
    contact_info: { phone: '(864) 634-8023' },
    image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
  },
  {
    name: 'Dirt & Grit Farm',
    description: 'U-pick flower farm in Woodruff with 80,000+ tulip bulbs across 30+ varieties each spring. Family-run farm rooted in faith and hard work.',
    address: 'Woodruff, SC 29388',
    latitude: 34.7389,
    longitude: -82.0345,
    activities: ['u-pick', 'farm fun'],
    hours_of_operation: { 'Seasonal': 'Spring tulip season (see website)' },
    contact_info: { website: 'https://dirtandgritfarm.com' },
    image_url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=800&q=80',
  },
  {
    name: 'Pinebreeze Farm',
    description: 'Strawberry u-pick and farm stand in Pelzer with fresh vegetables grown on-site from May through September. Greenhouse plants available in March.',
    address: '10059 Augusta Rd, Pelzer, SC 29669',
    latitude: 34.6523,
    longitude: -82.4634,
    activities: ['u-pick', 'farm fun'],
    hours_of_operation: { 'Mon–Fri': '8:00 AM – 7:00 PM', Saturday: '8:00 AM – 5:00 PM' },
    contact_info: { phone: '(864) 915-8213' },
    image_url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80',
  },
]

async function seed() {
  // Strip image_url — column doesn't exist in DB; API route handles image fallback
  const rows = locations.map(({ image_url, ...rest }) => ({ ...rest, status: 'approved' }))

  console.log(`Inserting ${locations.length} locations...`)

  const { data, error } = await supabase
    .from('locations')
    .insert(rows)
    .select('id, name')

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`✅ Inserted ${data.length} locations:`)
  data.forEach(l => console.log(`  • ${l.name} (${l.id})`))
}

seed()
