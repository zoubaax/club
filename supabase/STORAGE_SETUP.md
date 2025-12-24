# Supabase Storage Setup for Team Logos

This guide explains how to set up Supabase Storage to enable team logo uploads.

## Prerequisites

- A Supabase project with the database migrations already run
- Admin access to your Supabase project dashboard

## Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** or **"Create bucket"**
4. Configure the bucket:
   - **Name**: `team-logos`
   - **Public bucket**: ✅ **Enable** (check this box)
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or specific types like `image/jpeg,image/png,image/webp`)
5. Click **"Create bucket"**

### 2. Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

1. Go to **Storage** → **Policies** → Select the `team-logos` bucket
2. Click **"New Policy"**

#### Policy 1: Allow Public Read Access
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Policy definition**: 
  ```sql
  (bucket_id = 'team-logos')
  ```
- **Target roles**: `public`

#### Policy 2: Allow Authenticated Admins to Upload
- **Policy name**: `Admin upload access`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  bucket_id = 'team-logos' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
  ```
- **Target roles**: `authenticated`
- **Note**: Remove `auth.role() = 'authenticated'` as it's redundant when targeting authenticated role

#### Policy 3: Allow Authenticated Admins to Update
- **Policy name**: `Admin update access`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```sql
  bucket_id = 'team-logos' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
  ```
- **Target roles**: `authenticated`

#### Policy 4: Allow Authenticated Admins to Delete
- **Policy name**: `Admin delete access`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  bucket_id = 'team-logos' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  )
  ```
- **Target roles**: `authenticated`

### 3. Run Database Migration

Make sure you've run the database migration that adds the `logo_url` column:

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE teams ADD COLUMN IF NOT EXISTS logo_url TEXT;
```

Or run the migration file: `006_add_logo_to_teams.sql`

## Verification

1. Try uploading a logo through the admin interface
2. Check that the logo appears in the team cards
3. Verify that the logo URL is stored in the `teams.logo_url` column

## Troubleshooting

### "Bucket not found" error
- Make sure the bucket name is exactly `team-logos` (case-sensitive)
- Verify the bucket exists in your Supabase Storage dashboard

### "Permission denied" or "new row violates row-level security policy" error

This error can occur in two places:

#### If error occurs when uploading to Storage:
1. **Verify you're logged in as admin**: Check that your user ID exists in the `admins` table
   ```sql
   SELECT * FROM admins WHERE id = auth.uid();
   ```
2. **Check storage policies**: Go to Storage → Policies → team-logos bucket
   - Ensure all 4 policies are created
   - Verify the policy definitions match exactly (copy-paste from above)
3. **Verify bucket exists**: Make sure the bucket name is exactly `team-logos` (case-sensitive)
4. **Check bucket is public**: The bucket should be marked as "Public bucket" for read access

#### If error occurs when inserting/updating team in database:
1. **Verify admin authentication**: 
   ```sql
   -- Run this in SQL Editor to check if you're an admin
   SELECT is_admin(auth.uid());
   ```
   Should return `true`
2. **Check teams table RLS policies**: Run migration `002_rls_policies.sql` if not already done
3. **Verify user exists in admins table**:
   ```sql
   SELECT * FROM admins WHERE id = auth.uid();
   ```
4. **Test the is_admin function**:
   ```sql
   -- Replace 'your-user-id' with your actual user UUID
   SELECT is_admin('your-user-id');
   ```

### Images not displaying
- Check that the bucket is set to **public**
- Verify the `logo_url` in the database contains a valid URL
- Check browser console for CORS or image loading errors

## File Naming Convention

Team logos are stored with the following naming pattern:
```
team-logos/{teamId}-{timestamp}.{extension}
```

Example: `team-logos/abc123-1234567890.png`

This ensures unique filenames and prevents conflicts.

