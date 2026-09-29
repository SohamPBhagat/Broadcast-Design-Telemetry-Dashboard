# 🛰️ Broadcast Design Telemetry Dashboard

[![Live Demo](https://img.shields.io/badge/Live-Demo%20on%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://broadcast-design-telemetry-dashboard.vercel.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSohamPBhagat%2FBroadcast-Design-Telemetry-Dashboard)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

A high-tech, sci-fi inspired **Broadcast Telemetry & Regional Intelligence HUD Dashboard**. Built with **React 19**, **Three.js**, **Three-Globe**, **D3-Geo**, **Web Audio API**, and **Tailwind CSS v4**. 

Designed for broadcast graphics, real-time command centers, and planetary intelligence monitoring.

---

## ⚡ Live Preview & Deployment

* **Live Demo:** [broadcast-design-telemetry-dashboard.vercel.app](https://broadcast-design-telemetry-dashboard.vercel.app)
* **One-Click Deploy:** Click the **Deploy with Vercel** button above or import directly from GitHub to host your own version in under 60 seconds.

---

## 🌟 Key Features

### 🌐 1. Interactive 3D WebGL Globe
* **Planetary Visualization:** Powered by `three` and `three-globe` with smooth rotation, ambient atmosphere glow, and custom polygon country altitude.
* **Country Targeting:** Click any country directly on the 3D globe or select from the navigation bar to focus target telemetry coordinates.
* **Satellite & Orbital Paths:** Dynamic visual satellite nodes representing active constellations.

### 🎯 2. Regional Active Radar Map
* **D3-Geo Orthographic / Mercator Projection:** Live regional vector radar map that dynamically centers on selected country coordinates (lat/lng).
* **Target Lock Tracking:** HUD reticle, coordinates readout, and tactical radar sweep animations.

### 📊 3. Telemetry, Oscilloscope & Equalizers
* **Real-time Oscilloscope:** SVG animated sine-wave generator reacting to signal strength, frequency, and gain.
* **Interactive Audio Equalizer:** 32-band audio-reactive bar visualizer with randomized organic broadcast jitter.
* **Arc Gauges & Matrix Glyph Stream:** Custom SVG arc meters for telemetry metrics alongside animated binary/hex telemetry glyph feeds.
* **LED Status Matrix:** Tactical grid matrix highlighting security posture and status levels.

### 🤖 4. Multi-Provider AI Intelligence Gateway
* **Tactical AI Chat Console:** Ask questions regarding defense, economic news, satellite status, and country telemetry.
* **Configurable Inference Gateway:**
  * **Simulation Mode:** Zero-cost offline deterministic intelligence engine.
  * **OpenAI-Compatible:** Connect to OpenAI (`gpt-4o-mini`), Groq, Ollama, vLLM, or LMStudio.
  * **Anthropic-Compatible:** Direct support for Claude 3.5 Sonnet endpoints.
* **Auto-Fetch Intelligence:** Automatically queries breaking economic news and top market gainers/losers for any target country.

### 🔊 5. Web Audio API Tactical Sound Engine
* Native browser oscillator synthesis (`sine`, `triangle`, `sawtooth`) producing authentic sci-fi HUD clicks, target acquisition beeps, and alarm frequencies.
* Toggle sound on/off anytime from the top control toolbar.

### 📺 6. CRT Scanline & Retro Broadcast Aesthetics
* Procedural CRT scanlines overlay with toggle controls.
* High-contrast OLED dark palette (`#030406`) accented with neon red, emerald green, and cyan glow vectors.
* Typography styled with Google Fonts: *Orbitron*, *Rajdhani*, and *Share Tech Mono*.

---

## 🏗️ Architecture & Component Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          CONTROL TOOLBAR                               │
│  [Audio Synth] [Auto-Rotate] [CRT Scanlines] [Alert Sound] [AI Config] │
├────────────────────────────────────────────────────────────────────────┤
│                       TOP HEADER & TARGET BAR                          │
│               [UNITED STATES] [CHINA] [INDIA] [JAPAN] ...              │
├───────────────────┬───────────────────────────────┬────────────────────┤
│   LEFT COLUMN     │        CENTER COLUMN          │    RIGHT COLUMN    │
│                   │                               │                    │
│ ┌───────────────┐ │ ┌───────────────────────────┐ │ ┌────────────────┐ │
│ │ Regional      │ │ │   3D Real-Time WebGL      │ │ │ Telemetry Log  │ │
│ │ Radar Map     │ │ │   Interactive Globe       │ │ │ & Arc Gauges   │ │
│ └───────────────┘ │ │   (Three-Globe / ThreeJS) │ └────────────────┘ │
│ ┌───────────────┐ │ └───────────────────────────┘ │ ┌────────────────┐ │
│ │ Country News  │ │ ┌───────────────────────────┐ │ │ Oscilloscope   │ │
│ │ & Stocks HUD  │ │ │ Audio Equalizer Bar Graph │ │ │ Signal Waves   │ │
│ └───────────────┘ │ └───────────────────────────┘ │ └────────────────┘ │
│ ┌───────────────┐ │                               │ ┌────────────────┐ │
│ │ LED Matrix &  │ │                               │ │ AI Tactical    │ │
│ │ Mini Wireframe│ │                               │ │ Chat Console   │ │
│ └───────────────┘ │                               │ └────────────────┘ │
└───────────────────┴───────────────────────────────┴────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI composition & state management |
| **TypeScript 5.8** | End-to-end type safety |
| **Vite 6** | Ultra-fast bundling, HMR, and build optimization |
| **Three.js & Three-Globe** | 3D WebGL globe, geo-polygons, and coordinates |
| **D3-Geo & Topojson** | Regional radar map calculations and geo-projections |
| **Tailwind CSS v4** | High-performance styling and utility classes |
| **Lucide React** | Clean, lightweight SVG iconography |
| **Web Audio API** | Real-time procedural audio synthesis without external media |

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js** 18.0.0 or higher
* **npm**, **pnpm**, or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/SohamPBhagat/Broadcast-Design-Telemetry-Dashboard.git
cd Broadcast-Design-Telemetry-Dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
```
The compiled output will be generated inside the `dist/` folder.

### 5. Preview production build locally
```bash
npm run preview
```

---

## ⚙️ Environment Variables (Optional)

The application works 100% out of the box in **Simulation Mode** without needing any API keys. If you want to connect live AI inference providers via the dashboard UI, you can configure them via the **AI Settings Modal** (gear icon) or set:

```env
# Optional Gemini / AI API keys for server-side inference
GEMINI_API_KEY="your_api_key_here"
APP_URL="http://localhost:3000"
```

---

## 🚀 Deploying to Vercel

### Method 1: Vercel Dashboard (Fastest)
1. Fork or push this repository to your GitHub.
2. Go to [Vercel New Project](https://vercel.com/new).
3. Import `Broadcast-Design-Telemetry-Dashboard`.
4. The pre-configured [`vercel.json`](vercel.json) will automatically handle the build and routing.
5. Click **Deploy**!

### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📂 Project Structure

```text
Broadcast-Design-Telemetry-Dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # HUD and telemetry components
│   │   ├── ActiveRadarMapPanel.tsx    # Regional D3-Geo radar sweep
│   │   ├── AiChatConsolePanel.tsx     # AI intelligence chat terminal
│   │   ├── AiSettingsModal.tsx        # Multi-provider AI configuration
│   │   ├── ArcGauge.tsx               # SVG arc gauge visualizer
│   │   ├── AudioSynth.ts              # Web Audio API sound synthesizer
│   │   ├── ControlToolbar.tsx         # HUD controls and action switches
│   │   ├── CountryNewsStockPanel.tsx  # News feeds and ticker telemetry
│   │   ├── CountrySelectorBar.tsx     # Country selection ribbon
│   │   ├── EqualizerBar.tsx           # Multi-band animated audio bars
│   │   ├── HeaderBadge.tsx            # Editable broadcast design title
│   │   ├── HudDashboard.tsx           # Primary layout grid orchestrator
│   │   ├── LedGrid.tsx                # Tactical LED dot-matrix
│   │   ├── MatrixGlyphStream.tsx      # Sci-fi glyph stream stream
│   │   ├── MiniWireframeGlobe.tsx     # Lightweight canvas globe
│   │   ├── ThreeGlobe.tsx             # 3D WebGL Three.js Globe engine
│   │   └── UsaMapPanel.tsx            # Continental regional radar
│   ├── data/
│   │   ├── aiInferenceEngine.ts       # OpenAI & Anthropic API connector
│   │   ├── aiSettings.ts              # LocalStorage persistent AI settings
│   │   ├── countriesData.ts           # 190+ country coordinates & stats
│   │   ├── countryNewsAndStocks.ts    # Dynamic financial & news engine
│   │   └── worldGeo.ts                # World map geo boundaries
│   ├── App.tsx             # App entry root
│   ├── index.css           # Custom HUD scanlines & theme tokens
│   └── main.tsx            # React DOM mounting
├── package.json            # Project manifest
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment & SPA routing configuration
└── vite.config.ts          # Vite build and plugin configurations
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/SohamPBhagat/Broadcast-Design-Telemetry-Dashboard/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

**Soham Bhagat**
* GitHub: [@SohamPBhagat](https://github.com/SohamPBhagat)
* LinkedIn: [Soham Bhagat](https://www.linkedin.com/in/soham-bhagat-0132b33a0/)
* Email: soham.ai.research@gmail.com
