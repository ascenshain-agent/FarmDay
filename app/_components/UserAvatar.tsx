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
        <button className="sign-in-btn" onClick={() => setShowModal(true)}>Sign In</button>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="header-avatar"
        aria-label="User menu"
        onClick={() => setMenuOpen((v) => !v)}
        style={{ padding: 0, border: '2px solid #c4b89a', overflow: 'hidden', cursor: 'pointer', background: '#d1c9b8' }}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Profile" width={36} height={36} style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <span style={{ fontSize: '1.1rem', lineHeight: '36px', display: 'block', textAlign: 'center' }}>
            {user.email?.[0]?.toUpperCase() ?? '?'}
          </span>
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
