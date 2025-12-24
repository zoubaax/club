import { supabase } from '../lib/supabase'

/**
 * Upload a team logo to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} teamId - The team ID
 * @returns {Promise<{url: string, error: null}|{url: null, error: string}>}
 */
export async function uploadTeamLogo(file, teamId) {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'File must be an image' }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { url: null, error: 'Image size must be less than 5MB' }
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${teamId}-${Date.now()}.${fileExt}`
    const filePath = `team-logos/${fileName}`

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('team-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { url: null, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('team-logos')
      .getPublicUrl(filePath)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    console.error('Error uploading logo:', error)
    return { url: null, error: error.message || 'Failed to upload logo' }
  }
}

/**
 * Delete a team logo from Supabase Storage
 * @param {string} logoUrl - The URL of the logo to delete
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deleteTeamLogo(logoUrl) {
  try {
    if (!logoUrl) return { success: true, error: null }

    // Extract file path from URL
    const urlParts = logoUrl.split('/team-logos/')
    if (urlParts.length < 2) {
      return { success: true, error: null } // URL format not recognized, skip deletion
    }

    const fileName = urlParts[1].split('?')[0] // Remove query params
    const filePath = `team-logos/${fileName}`

    const { error } = await supabase.storage
      .from('team-logos')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting logo:', error)
    return { success: false, error: error.message || 'Failed to delete logo' }
  }
}

