# Panhar Task — Financial Transactions Dashboard

A polished, responsive Persian-language dashboard for viewing and managing financial transactions. The project uses Vite for fast local development and optimized production builds, and deploys automatically to GitHub Pages.

## Live Demo

[View Panhar Task on GitHub Pages](https://meysamfaizi.github.io/Panhar-Task/)

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
git clone https://github.com/meysamfaizi/Panhar-Task.git
cd Panhar-Task
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
│   ├── js/index.js
│   └── styles/
├── index.html
├── vite.config.js
└── package.json
```

## Deployment

Every push to the `main` branch runs the GitHub Actions workflow, builds the app into `dist`, and publishes that artifact to GitHub Pages.

In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
