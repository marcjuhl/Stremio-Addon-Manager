# 🎬 Stremio Addon Manager

> A lightweight, privacy-first, open-source web application to organize, reorder, and sync your Stremio add-ons in real time.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)](#privacy--architecture)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Vite-blue.svg)](#tech-stack)

---

## 🌟 Why This Exists

In **Stremio**, the order of your installed add-ons directly dictates:
1. **Catalog Priority** — Which rows appear first on your home screen and discover tabs (e.g., Cyberflix catalogs vs. Cinemeta vs. Anime Kitsu).
2. **Stream Provider Priority** — Which sources appear at the top when selecting a movie or episode (e.g., placing Torrentio / RealDebrid above slower or public scraping sources).

Previously, changing this order required manually uninstalling and reinstalling all your add-ons one by one. **Stremio Addon Manager** solves this problem by providing a smooth drag-and-drop web interface that communicates directly with Stremio's API to reorder and save your collection in seconds.

---

## ✨ Features

- 🔒 **100% Client-Side Execution**: All network requests connect directly from your browser to Stremio's official API (`https://api.strem.io`). Your authentication tokens never touch any intermediary proxy, third-party server, or analytics service.
- 🖐️ **Drag-and-Drop Reordering**: Smooth, responsive dragging powered by `@dnd-kit` with support for desktop mouse, touch screens (tablets/smartphones), and keyboard accessibility.
- ⚡ **One-Click Quick Actions**: Quick controls (`Move to Top`, `Move Up`, `Move Down`, `Move to Bottom`) for fast adjustments on mobile and touch devices.
- 💾 **Instant Cloud Sync**: Directly updates your Stremio account via `addonCollectionSet`, propagating new orders instantly to desktop apps, Web, Android TV, and mobile clients.
- 📦 **Backup & Restore (JSON Export / Import)**: Download your addon configurations as a `.json` backup file anytime and restore or duplicate configurations across accounts.
- 🔍 **Live Search & Filter**: Rapidly filter through large addon collections by title, addon ID, or description.
- 🎨 **Stremio Native Dark Aesthetics**: Custom Tailwind palette inspired by Stremio's obsidian, dark purple, and glowing violet UI.
- 🧪 **Interactive Demo Mode**: Explore and test all reordering, exporting, and search features in a realistic sandbox environment without needing to log in.

---

## 🔐 Privacy & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       User's Browser                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │            Stremio Addon Manager (SPA)              │   │
│   │  • React 18 + TypeScript + Vite + Tailwind CSS      │   │
│   │  • AuthKey stored only in memory / opt-in storage    │   │
│   └───────────────▲──────────────────────────┬──────────┘   │
└───────────────────┼──────────────────────────┼──────────────┘
                    │                          │
           Direct HTTPS POST          Direct HTTPS POST
          (No middleman proxy)       (No middleman proxy)
                    │                          │
                    ▼                          ▼
       ┌────────────────────────────────────────────────┐
       │             Official Stremio API               │
       │            (https://api.strem.io)              │
       │                                                │
       │  • POST /api/addonCollectionGet                │
       │  • POST /api/addonCollectionSet                │
       │  • POST /api/login (optional)                  │
       └────────────────────────────────────────────────┘
```

- **Zero Backend**: There is no Node.js backend, database, or server logging your keys.
- **Direct Cross-Origin Resource Sharing (CORS)**: Stremio's API servers respond with `Access-Control-Allow-Origin: *`, allowing the browser application to communicate directly with official endpoints without CORS proxies.

---

## 🔑 How to Get Your Stremio Auth Key

The safest and most reliable way to connect is using your Stremio session `authKey`:

1. Open [web.stremio.com](https://web.stremio.com) and log in to your account.
2. Open your browser's **Developer Tools** (Press <kbd>F12</kbd> or <kbd>Ctrl+Shift+I</kbd> / <kbd>Cmd+Option+I</kbd>).
3. Switch to the **Console** tab.
4. Paste the following snippet and press <kbd>Enter</kbd>:
   ```javascript
   JSON.parse(localStorage.getItem("profile")).auth.key
   ```
5. Copy the returned string (without quotes) and paste it into the application.

*Alternative*: You can also log in directly with your Stremio email and password on the **Stremio Login** tab.

---

## 🛠️ Stremio API Protocol Reference

This project interacts with Stremio's API via the following endpoints:

| Action | Endpoint | Request Payload | Description |
| :--- | :--- | :--- | :--- |
| **Authenticate** | `POST /api/login` | `{ type: "Login", email, password }` | Authenticates user and returns session `authKey`. |
| **Get Addons** | `POST /api/addonCollectionGet` | `{ type: "AddonCollectionGet", authKey }` | Retrieves the user's installed addon descriptors. |
| **Save Addons** | `POST /api/addonCollectionSet` | `{ type: "AddonCollectionSet", authKey, addons }` | Pushes the newly ordered addon array back to cloud. |

Each addon item follows the [Stremio Addon Protocol v3](https://github.com/Stremio/stremio-addon-sdk) descriptor schema:
```json
{
  "transportUrl": "https://v3-cinemeta.strem.io/manifest.json",
  "transportName": "http",
  "flags": { "official": true, "protected": true },
  "manifest": {
    "id": "com.linvo.cinemeta",
    "name": "Cinemeta",
    "version": "3.0.12",
    "types": ["movie", "series"],
    "resources": ["catalog", "meta"],
    "catalogs": [...]
  }
}
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/stremio-addon-manager.git
   cd stremio-addon-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production (Web)**:
   ```bash
   npm run build
   ```
   This compiles type checks and outputs optimized static assets to the `dist/` directory.

5. **Build Desktop Installers (Windows `.exe` & macOS `.dmg`)**:
   - **Windows (.exe setup file)**:
     ```bash
     npm run electron:build:win
     ```
     Outputs a standalone installer: `release/Stremio Addon Manager-Setup-1.0.0.exe`.
   - **macOS (.dmg disk image)**:
     ```bash
     npm run electron:build:mac
     ```
     Outputs an Apple disk image: `release/Stremio Addon Manager-1.0.0.dmg`.
   - **Automated GitHub Releases**:
     The repository includes [`.github/workflows/build-desktop.yml`](.github/workflows/build-desktop.yml). Whenever you create a Git release tag (e.g. `git tag v1.0.0 && git push --tags`) or trigger the workflow manually in GitHub Actions, GitHub automatically builds both the `.exe` and `.dmg` installers and attaches them to the release for direct download!

---

## 🌐 Web App vs. Desktop App

| Format | Compatibility | Installation | Updates |
| :--- | :--- | :--- | :--- |
| **Web App** (Recommended) | Windows, Mac, Linux, iOS, Android | None (runs in any modern browser) | Instant / Automatic |
| **Progressive Web App (PWA)** | Windows, Mac, ChromeOS, Mobile | 1-Click "Install" in Chrome/Edge/Safari | Instant / Automatic |
| **Windows `.exe`** | Windows 10 / 11 | Single-click setup installer | Downloadable update |
| **macOS `.dmg`** | macOS (Apple Silicon & Intel) | Drag to Applications folder | Downloadable update |

---

## 🌐 Deployment Guide

Because the application is 100% static client-side TypeScript, it can be deployed for free to any static hosting provider.

### Option 1: GitHub Pages (Automated via GitHub Actions)
A pre-configured CI/CD workflow is included at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
1. Push the repository to GitHub.
2. In your repository settings, go to **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, choose **GitHub Actions**.
4. Every push to `main` will automatically build and publish the latest version.

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Accept defaults (`Framework Preset: Vite`, `Output Directory: dist`).

### Option 3: Netlify
1. Connect your GitHub repository to Netlify.
2. Set Build command: `npm run build`
3. Set Publish directory: `dist`

### Option 4: Docker / Static Nginx
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📂 Project Structure

```
stremio-addon-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages automated CI/CD
├── src/
│   ├── components/
│   │   ├── ActionBar.tsx       # Search, save button, export/import JSON
│   │   ├── AddonCard.tsx       # Sortable item card, drag handle, quick move buttons
│   │   ├── AddonList.tsx       # DndContext & SortableContext list wrapper
│   │   ├── AuthCard.tsx        # AuthKey input, email/pass login, demo launcher
│   │   ├── Footer.tsx          # Open-source footer and privacy notices
│   │   ├── HowToFindKeyModal.tsx # Step-by-step authKey visual guide
│   │   ├── Navbar.tsx          # Top bar with status indicator & navigation
│   │   └── Toast.tsx           # Accessible notification toast system
│   ├── hooks/
│   │   └── useToast.ts         # Toast notification custom hook
│   ├── services/
│   │   ├── demoAddons.ts       # Sample addon data for Sandbox Mode
│   │   └── stremioApi.ts       # Pure client-side Stremio API calls & local storage
│   ├── types/
│   │   └── stremio.ts          # Complete Stremio protocol TypeScript types
│   ├── App.tsx                 # Core application controller
│   ├── index.css               # Tailwind CSS imports & custom scrollbar
│   └── main.tsx                # React entry point
├── index.html                  # HTML entry point with Stremio theme & Inter font
├── package.json                # Project dependencies & scripts
├── tailwind.config.js          # Stremio-inspired theme configuration
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration (relative base path)
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!
Feel free to open an issue or submit a pull request on GitHub.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License & Disclaimer

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

*Disclaimer: This is an unofficial, community-driven project and is not affiliated with, sponsored by, or endorsed by Stremio B.V. Stremio is a registered trademark of Stremio B.V.*
