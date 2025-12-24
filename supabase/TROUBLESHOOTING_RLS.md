# Troubleshooting RLS (Row Level Security) Errors

## Common Error: "new row violates row-level security policy"

This error occurs when trying to insert, update, or delete data but the RLS policies don't allow it.

## Quick Diagnosis Steps

### 1. Check if you're authenticated
```sql
-- Run in Supabase SQL Editor
SELECT auth.uid();
```
If this returns `NULL`, you're not authenticated. Make sure you're logged in through the app.

### 2. Check if you're an admin
```sql
-- Run in Supabase SQL Editor (while logged in)
SELECT is_admin(auth.uid());
```
Should return `true` if you're an admin.

### 3. Verify your user exists in admins table
```sql
-- Run in Supabase SQL Editor
SELECT * FROM admins WHERE id = auth.uid();
```
Should return your admin record.

### 4. Check if the is_admin function exists
```sql
-- Run in Supabase SQL Editor
SELECT is_admin('00000000-0000-0000-0000-000000000000'::uuid);
```
Should return `false` (not an error).

## Common Issues and Solutions

### Issue 1: User not in admins table

**Symptom**: `is_admin(auth.uid())` returns `false`

**Solution**: Add your user to the admins table:
```sql
-- First, get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert into admins (replace with your actual user ID)
INSERT INTO admins (id, email, name)
VALUES (
  'your-user-id-here',
  'your-email@example.com',
  'Your Name'
);
```

### Issue 2: RLS policies not applied

**Symptom**: Error persists even though you're an admin

**Solution**: Re-run the RLS policies migration:
```sql
-- Run the entire 002_rls_policies.sql file in SQL Editor
```

### Issue 3: Storage bucket policies missing

**Symptom**: Error when uploading logo images

**Solution**: 
1. Go to Storage → Policies in Supabase Dashboard
2. Select the `team-logos` bucket
3. Create the 4 policies as described in `STORAGE_SETUP.md`

### Issue 4: Function security issue

**Symptom**: `is_admin()` function returns error or wrong result

**Solution**: Recreate the function:
```sql
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Testing RLS Policies

### Test Teams Table Access

```sql
-- Should work (public read)
SELECT * FROM teams;

-- Should work if you're admin (authenticated)
INSERT INTO teams (name, description, logo_url)
VALUES ('Test Team', 'Test Description', 'https://example.com/logo.png');

-- Should work if you're admin
UPDATE teams SET name = 'Updated Name' WHERE id = 'some-team-id';

-- Should work if you're admin
DELETE FROM teams WHERE id = 'some-team-id';
```

### Test Storage Access

```javascript
// In your browser console or app code
const { data, error } = await supabase.storage
  .from('team-logos')
  .list()

console.log('Storage access:', error ? 'DENIED' : 'ALLOWED', error)
```

## Debugging Checklist

- [ ] User is authenticated (`auth.uid()` is not NULL)
- [ ] User exists in `admins` table
- [ ] `is_admin(auth.uid())` returns `true`
- [ ] RLS is enabled on the table (`ALTER TABLE teams ENABLE ROW LEVEL SECURITY;`)
- [ ] RLS policies exist (check in Dashboard → Authentication → Policies)
- [ ] Storage bucket exists and is public
- [ ] Storage policies are set up correctly
- [ ] Migration `006_add_logo_to_teams.sql` has been run

## Still Having Issues?

1. Check the Supabase Dashboard logs:
   - Go to Logs → Postgres Logs
   - Look for RLS policy violations

2. Check browser console:
   - Look for authentication errors
   - Check network tab for failed requests

3. Verify environment variables:
   - `VITE_SUPABASE_URL` is correct
   - `VITE_SUPABASE_ANON_KEY` is correct

4. Test with a simple query:
   ```javascript
   const { data, error } = await supabase
     .from('teams')
     .select('*')
     .limit(1)
   
   console.log('Query result:', { data, error })
   ```

