import { getSupabase } from '@/lib/supabase'
import type { Location } from '@/lib/types'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activity = searchParams.get('activity')
  const supabase = getSupabase()

  let query = supabase.from('locations').select('*').eq('status', 'approved')
  if (activity) query = query.contains('activities', [activity])

  const { data, error } = await query
  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data ?? [])
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
