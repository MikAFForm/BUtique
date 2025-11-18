## Supabase GraphQL Quick Start

### Env setup
1. Copy `.env.local.example` to `.env.local`.
2. Fill in the values from Supabase → Settings → API:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
   ```
3. Restart both servers after any env change.

### Run the Python backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn app.main:app --reload --port 4000`

Use `http://localhost:4000/graphql` for the Strawberry Playground if you want to hit the API directly.

### Testing queries/mutations from Next.js
1. Run `npm install` (first time) then `npm run dev`.
2. Open `http://localhost:3000/dev/graphiql`.
3. Pick a template or type your own query/mutation, optionally add JSON variables, then hit **Run**. The page uses `NEXT_PUBLIC_GRAPHQL_ENDPOINT`, so it targets the Python server.

### Services and utils
- Put business logic in `backend/app/services/` and shared helpers in `backend/app/utils/`.
- GraphQL resolvers should import those layers rather than handling complex logic inline.

### Implementing business logic
1. Create a dedicated service folder (e.g., `backend/app/services/users/create_user/`) containing the implementation (`create_user.py`) and optional `test.py` for unit tests.
2. Add or update `backend/app/resolvers/<domain>/resolver.py` to call the new service function.
3. Update `backend/app/schema.py` to import the resolver and wire it into the Strawberry schema (queries/mutations).

Summary:
- **Schema**: defines GraphQL types and maps fields/mutations to resolver functions.
- **Resolvers**: thin functions that orchestrate service calls and format results for GraphQL.
- **Services**: contain Supabase/database operations plus business rules; tests live alongside them.

### Notes
- Schema/table changes stay in Supabase; ping me if you need a new table.
- The Python server is the canonical GraphQL API; the frontend no longer relies on the legacy Next.js route.
- If you get errors, double-check env vars and that the table exists in Supabase.
