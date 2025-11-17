
## BUtique (Next.js App)

This repository uses the Next.js App Router (`app/` folder). The project is scaffolded with Create Next App and uses global styles from `app/globals.css` via `app/layout.tsx`.

## Getting started

Run the development server (PowerShell):

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Git Cheat Sheet

### Make a change
1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b Minsung/<task-name>`

### Open a PR
1. `git add .`
2. `git commit -m "commit message"`
3. `git push origin <branch-name>`
4. Create a PR on GitHub
5. Assign reviewers
6. Merge into `main`

> Always run `git status` to confirm what’s staged and what’s pending.

## Main page

The main page of the app is `app/page.tsx`. That file renders the home route `/`. Keep `app/page.tsx` focused on layout and composition — avoid hardcoding user-visible copy inside TSX files.

## Where to put UI text (do not hardcode in TSX)

To keep copy separate from view code, put page strings into per-page JSON files under `app/data/` and import them into the page component. This makes it easier to update copy, reuse text, and later add localization.

Example file layout:

- `app/page.tsx`              -> Main page component
- `app/post/page.tsx`         -> Post page component
- `app/data/mainText.json`    -> Main page strings
- `app/data/postText.json`    -> Post page strings

Example `app/data/mainText.json`:

```json
{
	"title": "Main Page",
	"postButton": "Post"
}
```

Example `app/page.tsx` using the JSON:

```tsx
import Link from 'next/link';
import mainText from './data/mainText.json';

export default function Home() {
	return (
		<h1>{mainText.title}</h1>
		// ...use mainText.postButton for button label
	);
}
```

Example `app/data/postText.json`:

```json
{
	"title": "Post page for Seller"
}
```

Example `app/post/page.tsx`:

```tsx
import postText from '../data/postText.json';

export default function PostPage() {
	return <h1>{postText.title}</h1>;
}
```

## How to add a new page

1. Create a new folder inside `app/` with the page name as the folder name (the URL path). Example: for `/login` create `app/login/`.
2. Add a `page.tsx` inside that folder: `app/login/page.tsx`. (Has to be page.tsx or else, it will crash)
3. Add a JSON file for copy: `app/data/loginText.json` and import it in `page.tsx`.

Example:

```
app/
	login/
		page.tsx
	data/
		loginText.json
```

## Notes
- `app/layout.tsx` is the root layout. It imports `globals.css` and sets global classes (fonts, body classes). Use it for site-wide layout and providers.
- Use `next/link` for client-side navigation (e.g., a Post button linking to `/post`).
- If TypeScript complains about importing JSON, ensure `resolveJsonModule` is enabled in `tsconfig.json` (Next.js usually enables it by default).
