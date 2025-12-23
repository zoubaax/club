import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isCurrentUserAdmin, getCurrentAdmin } from '../utils/admin'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    let sessionChecked = false

    // Check initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setUser(null)
          setAdmin(null)
          setIsAdmin(false)
          setLoading(false)
          sessionChecked = true
          return
        }

        if (session?.user) {
          setUser(session.user)
          // Don't await - let it run in background, loading will be set to false regardless
          checkAdminStatus(session.user.id).catch(err => {
            console.error('Background admin check failed:', err)
          })
        } else {
          setUser(null)
          setAdmin(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        if (mounted) {
          setUser(null)
          setAdmin(null)
          setIsAdmin(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          sessionChecked = true
        }
      }
    }

    initializeAuth()

    // Listen for auth changes (but only after initial check)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip the initial SIGNED_IN event if we already checked the session
      if (!sessionChecked && event === 'SIGNED_IN') {
        return
      }

      try {
        if (session?.user) {
          setUser(session.user)
          // Don't await - let it run in background
          checkAdminStatus(session.user.id).catch(err => {
            console.error('Background admin check failed:', err)
          })
        } else {
          setUser(null)
          setAdmin(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
        if (mounted) {
          setUser(null)
          setAdmin(null)
          setIsAdmin(false)
        }
      } finally {
        if (mounted && sessionChecked) {
          setLoading(false)
        }
      }
    })

    // Fallback timeout to ensure loading never gets stuck
    const timeout = setTimeout(() => {
      if (mounted && !sessionChecked) {
        console.warn('Auth initialization timeout, forcing loading to false')
        setLoading(false)
        sessionChecked = true
      }
    }, 5000)

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Error getting session:', sessionError)
        setUser(null)
        setAdmin(null)
        setIsAdmin(false)
        return
      }

      if (session?.user) {
        setUser(session.user)
        await checkAdminStatus(session.user.id)
      } else {
        setUser(null)
        setAdmin(null)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setUser(null)
      setAdmin(null)
      setIsAdmin(false)
    }
  }

  const checkAdminStatus = async (userId) => {
    try {
      const adminStatus = await isCurrentUserAdmin()
      setIsAdmin(adminStatus)

      if (adminStatus) {
        try {
          const adminData = await getCurrentAdmin()
          setAdmin(adminData)
        } catch (err) {
          console.error('Error fetching admin data:', err)
          setAdmin(null)
        }
      } else {
        setAdmin(null)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
      setAdmin(null)
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.user) {
        setUser(data.user)
        await checkAdminStatus(data.user.id)
        return { success: true, error: null }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setAdmin(null)
      setIsAdmin(false)
      return { success: true, error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    admin,
    isAdmin,
    loading,
    signIn,
    signOut,
    checkAdminStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

