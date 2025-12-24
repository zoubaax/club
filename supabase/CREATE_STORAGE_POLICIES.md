# Create Storage Policies - Step by Step

## Quick Copy-Paste Policy Definitions

### Policy 1: Public Read Access
```
Policy Name: Public read access
Operation: SELECT
Target Roles: public
Policy Definition:
```
```sql
(bucket_id = 'team-logos')
```

---

### Policy 2: Admin Upload Access
```
Policy Name: Admin upload access
Operation: INSERT
Target Roles: authenticated
Policy Definition:
```
```sql
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)
```

---

### Policy 3: Admin Update Access
```
Policy Name: Admin update access
Operation: UPDATE
Target Roles: authenticated
Policy Definition:
```
```sql
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)
```

---

### Policy 4: Admin Delete Access
```
Policy Name: Admin delete access
Operation: DELETE
Target Roles: authenticated
Policy Definition:
```
```sql
bucket_id = 'team-logos' AND EXISTS (
  SELECT 1 FROM admins WHERE admins.id = auth.uid()
)
```

---

## How to Create Policies in Dashboard

1. **Go to Supabase Dashboard** → **Storage** → **Policies**
2. **Select the `team-logos` bucket** (create it first if it doesn't exist)
3. **Click "New Policy"** or "Create Policy"
4. **For each policy above:**
   - Enter the Policy Name
   - Select the Operation (SELECT, INSERT, UPDATE, or DELETE)
   - Select Target Roles (public or authenticated)
   - Paste the Policy Definition SQL
   - Click "Save" or "Create"

## Complete Policy Setup Checklist

- [ ] Storage bucket `team-logos` exists and is set to **Public**
- [ ] Policy 1: Public read access (SELECT, public)
- [ ] Policy 2: Admin upload access (INSERT, authenticated)
- [ ] Policy 3: Admin update access (UPDATE, authenticated)
- [ ] Policy 4: Admin delete access (DELETE, authenticated)

## Testing

After creating all policies, test by:
1. Logging in as admin in your app
2. Creating/editing a team
3. Uploading a logo image
4. Verifying the logo displays correctly

