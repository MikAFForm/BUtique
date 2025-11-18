## Create Account Flow (End-to-End)

1. **`app/components/CreateAccountForm.tsx` (frontend)**
   - User types name and email, clicks **Create Account**.
   - Component validates inputs, sets loading state, and calls `mutate(CREATE_USER, { name, email })`.

2. **`lib/graphql/client.ts` (frontend)**
   - Sends the GraphQL mutation to `NEXT_PUBLIC_GRAPHQL_ENDPOINT` (FastAPI backend).
   - Payload is exactly the `CREATE_USER` mutation string.

3. **FastAPI/Strawberry (`backend/app/main.py` + `backend/app/schema.py`)**
   - Uvicorn receives the request at `http://localhost:4000/graphql`.
   - Strawberry schema maps `createUser` to `resolve_create_user` in `backend/app/resolvers/users/resolver.py`.

4. **Resolver layer (`backend/app/resolvers/users/resolver.py`)**
   - `resolve_create_user` delegates to the service: `create_user_execute(name, email)`.

5. **Service layer (`backend/app/services/users/create_user/create_user.py`)**
   - Handles validation/business rules (e.g., email checks).
   - Calls Supabase via `app/db.py` to insert the user.
   - Returns the inserted row as a dictionary.

6. **Supabase (database)**
   - Executes the `users` insert and returns the new record.

7. **Response path**
   - Service returns the row → resolver wraps it in the `User` type → schema serializes the GraphQL response → frontend receives JSON → CreateAccountForm updates the UI (success or error message).

So the order is: React form → GraphQL client → FastAPI/Strawberry schema → resolver → service → Supabase → back through the same path to the UI.