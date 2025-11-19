## Frontend Guidelines

### File organization
- Keep routed files under `app/` (e.g., `app/page.tsx`, `app/login/page.tsx`, etc.) so Next.js routing continues to work.
- Shared logic that triggers GraphQL mutations/queries should live in `app/services/` (e.g., `app/services/createUser.ts`).

### `page.tsx` responsibilities
Each page component (like `app/page.tsx`, `app/login/page.tsx`) should:
1. Render UI only: layout, forms, inputs, buttons, etc.
2. Manage local UI state (input values, loading flags) via React hooks.
3. Call service-layer functions for any data operations (mutations/queries). Do not call `mutate`/`query` directly in the page; wrap those calls in `app/services/<service_name>.ts`.

### Services
- Place service helpers in `app/services/` (client components if they use `use client`).
- Each helper should encapsulate a single mutation or query, so pages can import and call them.
- Example: `app/services/createUser.ts` exports `createUser(name, email)` which wraps the GraphQL mutation. `app/page.tsx` imports this helper and only handles UI.
