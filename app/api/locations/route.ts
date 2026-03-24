import { getSupabase } from '@/lib/supabase'
import type { Location } from '@/lib/types'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'

export const revalidate = 3600

// Farm-themed Unsplash photo IDs for unique fallbacks (no two farms share the same image)
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

function simpleHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function withImages(locations: Location[]): Location[] {
  const usedIndices = new Set<number>()
  return locations.map((loc) => {
    if (loc.image_url) return loc
    let idx = simpleHash(loc.id) % FARM_PHOTO_IDS.length
    while (usedIndices.has(idx)) idx = (idx + 1) % FARM_PHOTO_IDS.length
    usedIndices.add(idx)
    return { ...loc, image_url: `https://images.unsplash.com/photo-${FARM_PHOTO_IDS[idx]}?w=800&q=80` }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activities = searchParams.getAll('activity')
  const featured = searchParams.get('featured') === 'true'

  if (featured) {
    const getFeatured = unstable_cache(
      async () => {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from('locations').select('*').eq('status', 'approved').limit(4)
        if (error) return null
        return data ?? []
      },
      ['locations-featured'],
      { revalidate: 3600 }
    )
    const data = await getFeatured()
    if (!data) return NextResponse.json([], { status: 500 })
    return NextResponse.json(withImages(data))
  }

  const cacheKey = ['locations', ...activities.sort()]
  const getFiltered = unstable_cache(
    async () => {
      const supabase = getSupabase()
      let query = supabase.from('locations').select('*').eq('status', 'approved')
      for (const a of activities) {
        query = query.contains('activities', JSON.stringify([a]))
      }
      const { data, error } = await query
      if (error) return null
      return data ?? []
    },
    cacheKey,
    { revalidate: 3600 }
  )

  const data = await getFiltered()
  if (!data) return NextResponse.json([], { status: 500 })
  return NextResponse.json(withImages(data))
}

export async function POST(request: Request) {
  const body: Omit<Location, 'id' | 'status'> = await request.json()
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('locations')
    .insert({ ...body, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
