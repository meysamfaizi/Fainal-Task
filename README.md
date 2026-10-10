# Panhar Task — Financial Transactions Dashboard

A polished, responsive Persian-language dashboard for viewing and managing financial transactions. The project uses Vite for fast local development and optimized production builds, and deploys automatically to GitHub Pages.

## Live Demo

[View Panhar Task on GitHub Pages](https://meysamfaizi.github.io/T04-Meysam-Faizi/)

## Features

- Responsive, RTL interface designed for Persian content
- Transaction list with deposit and withdrawal styling
- Search by transaction reference number
- Sort transactions by amount or date in ascending and descending order
- Persian number, currency, and date formatting
- Accessible modal, table controls, loading states, and error feedback
- Local Vazirmatn fonts with no external font dependency
- Automated GitHub Pages deployment through GitHub Actions

## Tech Stack

- Vite
- HTML5
- CSS3
- Modern JavaScript
- GitHub Actions and GitHub Pages

## Installation

Requirements:

- Node.js 20 or newer
- npm

Clone the repository and install dependencies:

```bash
git clone https://github.com/meysamfaizi/T04-Meysam-Faizi.git
cd T04-Meysam-Faizi
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, then select **بارگذاری تراکنش‌ها** to view the transaction list.

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
.
├── .github/workflows/deploy.yml
├── assets/fonts/
├── public/data/db.json
├── src/
│   ├── index.html
│   ├── js/index.js
│   └── styles/
├── vite.config.js
└── package.json
```

## Deployment

Every push to the `main` branch runs the GitHub Actions workflow, builds the app into `dist`, and publishes that artifact to GitHub Pages.

In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

Publish the built `dist` artifact, not the source directory or source `index.html`.
The Vite base for this repository is `/T04-Meysam-Faizi/`. This project uses HTML and
JavaScript; it does not require the React plugin, `homepage`, or `gh-pages`.

For a clean local build and preview:

```powershell
npm ci
npm run build:clean
npm run preview
```

Open the preview under `/T04-Meysam-Faizi/`. `build:clean` empties `dist` before building.
In Chrome DevTools, open Network, enable Disable cache, then reload. Select a
failed CSS or JS request and inspect Headers → Request URL and the Initiator tab.
Production CSS and JS URLs should start with `/T04-Meysam-Faizi/assets/`. A request
for `/src/` means source HTML was published instead of the built artifact.

Keep CSS `url(...)` paths relative to their stylesheet so Vite can bundle them.
Import source images from JavaScript rather than using literal `/src/...` URLs.
For runtime URLs to files in `public`, use `import.meta.env.BASE_URL`, for example
`${import.meta.env.BASE_URL}data/db.json`.

For Live Server, open `src/index.html`. The source JavaScript falls back to
`public/data/db.json` when Vite's environment values are unavailable.
