# ṢỌ́LÁ — The Ṣọ́lá System

An immersive, celestial-themed Electronic Press Kit (EPK) and interactive audio-visual playground built for the artist **ṢỌ́LÁ**. Traverse orbital soundscapes, explore a galaxy of music video archives representing celestial bodies, and configure space newsletter subscriptions.

---

## 🌌 Key Highlights

- **The Celestial EPK**: A stunning, custom-crafted digital press kit designed around the Ṣọ́lá universe. Download media packs, view artist bios, and explore tour mappings in high-contrast cosmic slate typography.
- **Orbital Video Archive**: Music releases styled as orbiting planetary systems (from Mercury to Pluto). Control playbacks, observe cosmic gravities, and interact with the planetary scroll mechanics.
- **Dynamic Gravity & Audio Controls**: Integrated custom sound engines providing ambient loops paired with visual celestial motion.
- **Google Forms Newsletter Integration**: Seamlessly syncs subscriber email entry submissions directly to a customizable Google Form via background iframe-POST methods, side-stepping CORS issues.
- **Subscriber Control Board**: Built-in control drawer allowing you to export locally saved subscriber databases as CSV, clear registries, and configure arbitrary target Google Forms links.

---

## 🚀 Technical Architecture

The application is engineered as a modern, single-page client application utilizing:

- **React 19 & TypeScript**: Component architectures ensuring fast rendering and absolute type safety.
- **Tailwind CSS**: Contemporary utility styling, fluid scaling, and modern typographic grids.
- **Motion**: High-performance, fluid layout transitions and physics-based orbital drag animations.
- **Vite**: Rapid asset compilation, fast dev server, and efficient production builds.

---

## 🛠️ Setting Up Locally

To set up and run the system on your local machine, follow these steps:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Install Dependencies

Clone your repository, navigate to the folder, and run:

```bash
npm install
```

### Step 2: Start the Development Server

Launch the local development environment:

```bash
npm run dev
```

Open your browser to the URL displayed in your terminal (typically `http://localhost:3000`).

### Step 3: Production Build

To generate the optimized static assets for hosting:

```bash
npm run build
```

The compiled assets will be built cleanly inside the `/dist` directory, ready to be deployed to any static host (Cloud Run, Vercel, Netlify, GitHub Pages, etc.).

---

## ✉️ Google Form Integration Guide

The Ṣọ́lá System supports streaming newsletter subscriptions directly to your Google Sheets using Google Forms. To configure your live form:

1. **Create/Open Your Google Form**:
   - Go to [Google Forms](https://docs.google.com/forms/) and create a simple form with one short-answer question for the "**Email**".

2. **Get the Form Link**:
   - Click **Send** in the upper-right corner of the Form editor.
   - Select the link tab, copy the URL (e.g., `https://docs.google.com/forms/d/.../viewform`), and paste it into the **Google Form Link** input in your app's Integration Settings panel.

3. **Get the Email Entry ID**:
   - Open the public, live link of your Google Form in your browser.
   - Right-click on the email input box and select **Inspect / Inspect Element**.
   - Search the surrounding HTML for a `name` attribute beginning with `entry.` (e.g., `name="entry.1044431221"`).
   - Copy this entire entry ID and paste it into the **Email Field Entry ID** input inside your app's Integration Settings.

4. **Test & Save**:
   - Hit **Save Integration** inside your Control Center, and submissions will immediately stream to your live Google Sheet!

---

*Crafted for the universe of Sola.*
