'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import AuthModal from './AuthModal'

export default function UserAvatar() {
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  if (!user) {
    return (
      <>
        <button className="header-avatar pig-avatar" onClick={() => setShowModal(true)} aria-label="Sign in">
          <span className="pig-emoji">🐖</span>
        </button>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button className="header-avatar" aria-label="User menu" onClick={() => setMenuOpen((v) => !v)}>
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Profile" width={36} height={36} style={{ objectFit: 'cover', borderRadius: '50%' }} unoptimized />
        ) : (
          <span className="pig-emoji">🐖</span>
        )}
      </button>
      {menuOpen && (
        <div className="avatar-menu">
          <p className="avatar-menu-email">{user.email}</p>
          <button onClick={() => { supabase.auth.signOut(); setMenuOpen(false) }}>Sign out</button>
        </div>
      )}
    </div>
  )
}
