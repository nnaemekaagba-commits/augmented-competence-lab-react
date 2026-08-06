# Augmented Competence Lab - React front-end

The same site as before, rebuilt in React (Vite), talking to the backend API in `augmented-competence-lab-backend`. Tested end-to-end before delivery: built cleanly, served correctly, and a full login -> create -> edit -> delete cycle was run against a live copy of the backend.

## Structure

```text
src/
  api.js              - all fetch() calls to the backend, in one place
  App.jsx             - top-level state (data + which section is showing)
  styles.css          - the site's visual design (unchanged from the static version)
  components/
    Header.jsx        - nav bar + mobile menu
    Home.jsx          - hero, theme spotlight, "from the lab" feed, CTA
    Research.jsx      - publications list
    News.jsx          - news list
    Blogs.jsx         - blog list
    Team.jsx          - team grid, grouped by role
    About.jsx         - mission + pillars
    Admin.jsx         - login + full publish/edit/delete dashboard
    Icons.jsx         - the logo mark and reasoning-trace SVGs
```

All six public sections stay mounted at once and are shown/hidden with a CSS class. That means if you're signed into Admin and switch to another tab, you stay signed in when you come back, since the Admin component never unmounts.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Point it at wherever the backend is running.

## Run it locally

```bash
npm run dev
```

Opens at `http://localhost:5173` by default. Make sure the backend is also running (`npm start` in that project) and that its `ALLOWED_ORIGIN` in `.env` matches this dev URL, or the API will reject the browser's requests.

## Build for deployment

```bash
npm run build
```

This produces a `dist/` folder - plain static files (HTML/CSS/JS). Deploy that folder anywhere that serves static files: Netlify, Vercel, GitHub Pages, S3, or any basic web host. There's no server-side rendering here, so any static host works.

Before building for production, make sure `.env` has `VITE_API_BASE_URL` set to your real, deployed backend URL - Vite bakes that value into the build at build time, so changing `.env` after building has no effect; rebuild instead.

## GitHub Pages

This repo is configured to deploy automatically to GitHub Pages from the `main` branch via GitHub Actions.

- Expected site URL: `https://nnaemekaagba-commits.github.io/augmented-competence-lab-react/`
- Vite `base` is set to `/augmented-competence-lab-react/` for Pages
- Optional repository variable: `VITE_API_BASE_URL`

If `VITE_API_BASE_URL` is not set in the repository settings, the frontend will still deploy, but dynamic sections will not be able to reach a real backend until that variable points at your deployed API.

## What changed from the static HTML version

Functionally, nothing - same pages, same design, same features (including the edit capability the backend now supports). What's different is under the hood:

- Content is proper React state instead of DOM string-building
- Each admin panel (publications/news/blogs/team) now supports editing an existing entry in place, not just delete-and-recreate - the backend's new `PUT` endpoints made this possible
- Code is split into components instead of one large file

## Known limitation carried over

Editing a publication or team member updates the text fields only - to swap out the PDF or photo itself, delete the entry and re-add it. Editing binary file uploads in place is possible to add later if it becomes a real need.
