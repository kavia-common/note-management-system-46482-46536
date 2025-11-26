# Ocean Notes (Nuxt 3)

Modern notes app UI with sidebar layout and editor, following the Ocean Professional theme.

## Quickstart

1. Install dependencies
```bash
npm install
```

2. Configure environment (optional)
Create a `.env` file at the project root and set:
```bash
NUXT_PUBLIC_API_BASE=http://localhost:4000
```
If `NUXT_PUBLIC_API_BASE` is not set, the app will use in-memory mock data so you can still preview the UI.

3. Run dev server
```bash
npm run dev
```
Open http://localhost:3000

## Environment Variables

See `.env.example` for the common variables:
- NUXT_PUBLIC_API_BASE: Base URL for backend API (e.g., http://localhost:4000)
- Other NUXT_PUBLIC_* variables are read and exposed via runtimeConfig for reference.

## Features

- Sidebar navigation with clean, modern styling
- Notes list with search, tag filtering, sort by update time
- Create, edit (title/content/tags), delete, favorite, archive
- Optimistic UI updates with rollback on API errors
- Toast notifications and confirm modal
- Loading skeletons and empty states
- Responsive design, subtle shadows, rounded corners, gradients

## API

The frontend expects the backend to expose REST endpoints:
- GET /notes
- POST /notes
- PUT /notes/:id
- PUT /notes/:id/favorite
- PUT /notes/:id/archive
- DELETE /notes/:id

When `NUXT_PUBLIC_API_BASE` is not set, an in-memory mock is used.

## Styling

The Ocean Professional palette is applied via CSS variables in `app.vue`:
- primary #2563EB
- success/secondary #F59E0B
- error #EF4444
- text #111827
- background #f9fafb
- surface #ffffff
- gradient from-blue-500/10 to-gray-50

You can integrate Tailwind CSS later if desired.
