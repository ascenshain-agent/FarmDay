import { getSupabase } from '@/lib/supabase'
import type { Location } from '@/lib/types'
import { NextResponse } from 'next/server'

const IMAGES_BY_ACTIVITY: Record<string, string> = {
  'farmers market': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
  'u-pick': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80',
  'farm fun': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
  'events': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80',
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
]

function withImages(locations: Location[]): Location[] {
  return locations.map((loc, i) => ({
    ...loc,
    image_url: loc.image_url
      ?? IMAGES_BY_ACTIVITY[loc.activities[0]]
      ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activities = searchParams.getAll('activity')
  const supabase = getSupabase()

  let query = supabase.from('locations').select('*').eq('status', 'approved')
  if (activities.length === 1) {
    query = query.contains('activities', JSON.stringify([activities[0]]))
  } else if (activities.length > 1) {
    query = query.or(activities.map((a) => `activities.cs.${JSON.stringify([a])}`).join(','))
  }

  const { data, error } = await query
  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(withImages(data ?? []))
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
