import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook to fetch and manage team members
 * @param {string} teamId - The team ID
 * @returns {Object} - { members, loading, error, refetch, addMember, removeMember }
 */
export function useTeamMembers(teamId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMembers = async () => {
    if (!teamId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setMembers(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching team members:', err)
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (memberData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('team_members')
        .insert([{ ...memberData, team_id: teamId }])
        .select()
        .single()

      if (insertError) throw insertError
      await fetchMembers()
      return { data, error: null }
    } catch (err) {
      console.error('Error adding team member:', err)
      return { data: null, error: err.message }
    }
  }

  const removeMember = async (memberId) => {
    try {
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (deleteError) throw deleteError
      await fetchMembers()
      return { error: null }
    } catch (err) {
      console.error('Error removing team member:', err)
      return { error: err.message }
    }
  }

  const updateMember = async (memberId, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single()

      if (updateError) throw updateError
      await fetchMembers()
      return { data, error: null }
    } catch (err) {
      console.error('Error updating team member:', err)
      return { data: null, error: err.message }
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [teamId])

  return { 
    members, 
    loading, 
    error, 
    refetch: fetchMembers,
    addMember,
    removeMember,
    updateMember
  }
}

