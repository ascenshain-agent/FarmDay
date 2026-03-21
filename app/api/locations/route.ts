import { getSupabase } from '@/lib/supabase'
import type { Location } from '@/lib/types'
import { NextResponse } from 'next/server'

const FARM_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
]

function withImages(locations: Location[]): Location[] {
  return locations.map((loc, i) => ({
    ...loc,
    image_url: loc.image_url ?? FARM_IMAGES[i % FARM_IMAGES.length],
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activity = searchParams.get('activity')
  const supabase = getSupabase()

  let query = supabase.from('locations').select('*').eq('status', 'approved')
  if (activity) query = query.contains('activities', [activity])

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
