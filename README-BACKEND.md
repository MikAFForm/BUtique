## Supabase GraphQL Quick Start

### Env setup
1. Copy `.env.local.example` to `.env.local`.
2. Fill in the values from Supabase → Settings → API:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Restart `npm run dev` after any env change.

### Testing queries/mutations
1. Run `npm install` (first time) and `npm run dev`.
2. Open `http://localhost:3000/dev/graphiql` in your browser.
3. Pick a template or type your own query/mutation, optionally add JSON variables, then hit **Run**.
4. Everything hits `/api/graphql`, so changes go straight to Supabase—no local DB required.

### Notes
- Schema/table changes stay in Supabase; ping me if you need a new table.
- `/api/graphql` is the real endpoint apps and the playground call.
- If you get errors, double-check env vars and that the table exists in Supabase.
