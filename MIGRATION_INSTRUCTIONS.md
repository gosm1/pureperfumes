# IMPORTANT: Run This SQL Migration

Before testing the Pack Theme System, you **MUST** run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}'::jsonb;
```

## How to Run:
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the sidebar
3. Create a new query
4. Paste the SQL above
5. Click "Run"

## Verify It Worked:
After running, go to "Table Editor" → "products" and you should see a new column called `theme_config`.

## Then:
1. Go to `/admin` in your app
2. Edit a pack product
3. Configure the theme using the Theme Builder
4. Click "Save"
5. Visit `/pack/[YOUR_PACK_ID]` to see the themed landing page

If you haven't run this migration, your theme configurations **will not be saved** to the database.
