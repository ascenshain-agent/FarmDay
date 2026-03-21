export type ActivityType = 'u-pick' | 'farm fun' | 'farmers market' | 'events'
export type LocationStatus = 'pending' | 'approved' | 'rejected'
export type UserRole = 'visitor' | 'admin'

export interface Location {
  id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  activities: ActivityType[]
  hours_of_operation: Record<string, string>
  contact_info: { phone?: string; email?: string; website?: string }
  created_by: string
  status: LocationStatus
  image_url?: string
}

export interface User {
  id: string
  email: string
  role: UserRole
}
