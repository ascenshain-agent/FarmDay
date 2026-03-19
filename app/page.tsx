import Link from 'next/link'
import MapWrapper from './_components/MapWrapper'
import type { Location } from '@/lib/types'

async function getLocations(): Promise<Location[]> {
  const res = await fetch('http://localhost:3000/api/locations', { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function HomePage() {
  const locations = await getLocations()

  return (
    <main className="flex flex-col h-screen">
      <header className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-green-700">Farm Day</h1>
        <p className="text-sm text-gray-500">Discover agri-tourism near Greenville, SC</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Map panel */}
        <div className="flex-1 relative">
          <MapWrapper locations={locations} />
        </div>

        {/* List panel — hidden on mobile, shown on md+ */}
        <aside className="hidden md:flex flex-col w-80 border-l overflow-y-auto bg-white">
          {locations.length === 0 ? (
            <p className="p-4 text-gray-400 text-sm">No locations yet.</p>
          ) : (
            locations.map((loc) => (
              <Link key={loc.id} href={`/locations/${loc.id}`} className="p-4 border-b hover:bg-gray-50 cursor-pointer block">
                  <p className="font-semibold">{loc.name}</p>
                  <p className="text-sm text-gray-500">{loc.address}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {loc.activities.map((a) => (
                      <span key={a} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </Link>
            ))
          )}
        </aside>
      </div>
    </main>
  )
}
