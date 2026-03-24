import { getSupabase } from '@/lib/supabase'
import type { Location } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getLocation(id: string): Promise<Location | null> {
  const { data } = await getSupabase()
    .from('locations')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single()
  return data
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const loc = await getLocation(id)
  if (!loc) notFound()

  return (
    <main className="max-w-2xl mx-auto p-4">
      <Link href="/" className="text-sm hover:underline" style={{ color: '#367C2B' }}>← Back</Link>
      <h1 className="text-2xl font-bold mt-3 mb-1">{loc.name}</h1>
      <p className="text-gray-500 text-sm mb-4">{loc.address}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {loc.activities.map((a) => (
          <span key={a} className="text-xs px-2 py-1 rounded-full" style={{ background: '#FFF3C4', color: '#3B2507' }}>{a}</span>
        ))}
      </div>

      <p className="text-gray-700 mb-6">{loc.description}</p>

      <section className="space-y-2 text-sm text-gray-600">
        {loc.contact_info.phone && <p>📞 {loc.contact_info.phone}</p>}
        {loc.contact_info.email && <p>✉️ {loc.contact_info.email}</p>}
        {loc.contact_info.website && (
          <p>🌐 <a href={loc.contact_info.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#367C2B' }}>{loc.contact_info.website}</a></p>
        )}
      </section>

      {Object.keys(loc.hours_of_operation).length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold mb-2">Hours</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {Object.entries(loc.hours_of_operation).map(([day, hours]) => (
              <li key={day} className="flex justify-between">
                <span className="capitalize">{day}</span>
                <span>{hours}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
