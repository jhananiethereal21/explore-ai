# EXPLORE AI 🧭

> **Tagline:** “Discover. Connect. Experience.”  
> **Slogan:** “We don’t give ideas; we help you experience it.”

A complete, responsive hackathon MVP travel platform designed for exploring India's flagship destinations with intelligent day-by-day AI itineraries, realistic INR budget breakdowns, and authentic local street wisdom.

---

## 🌟 Overview & Features

### 1. 📍 Discover Places
- **6 Handpicked Indian Destinations:** Jaipur (Rajasthan), Varanasi (Uttar Pradesh), Alleppey (Kerala), Leh-Ladakh, South Goa, and Rishikesh (Uttarakhand).
- **Curated Cards:** High-quality imagery with resilient fallback error handlers, category badges, sample ratings, concise descriptions, and practical ground tips.
- **Interactive Deep-Dive Modal:** Clicking any card opens a modal detailing best visiting seasons, estimated daily INR costs, ideal duration, top 5 highlights, must-try regional food specialties, and cultural etiquette.
- **One-Click Trip Pre-population:** "Plan Trip" buttons directly populate the AI Trip Planner and smoothly scroll to it.

### 2. ⚡ AI Trip Planner
- **Validated Inputs:** Destination selector (plus custom destination option), Total Budget in INR (with quick presets ₹15k, ₹30k, ₹50k, ₹80k), Duration (1–14 days), and multi-select Travel Interest chips.
- **Multi-State Feedback:** 
  - Validates required inputs and realistic trip durations with friendly inline messages.
  - Loading animation with rotating travel advisory messages.
  - Success state with printable/saveable itinerary view and reset option.
- **Day-by-Day Itinerary:** Interactive accordion with Morning, Afternoon, and Evening activities paired with a practical ground tip for each day.
- **Visual INR Budget Breakdown:** Dynamic allocation across Accommodation (~38%), Food & Dining (~25%), Local Transit (~15%), Activities & Monuments (~12%), and Contingency Buffer (~10%) with colored percentage progress indicators.
- **Built-in Smart Fallback Engine:** Functions immediately out-of-the-box without requiring a Gemini API key. Clearly labeled as demo fallback simulation.
- **Future-Ready Gemini Integration:** Includes a secure server-side `/api/plan` endpoint ready for Google Gemini API key activation.

### 3. 💡 Local Recommendations
- **Ground Wisdom:** Curated insider advice on timing visits to beat crowds, avoiding overcharged services, discovering hidden lagoons, and enjoying authentic regional eateries.
- **Destination Filtering:** Filter by destination with responsive pill tabs.
- **Transparent Attribution:** Every seeded recommendation is honestly labeled **“Local contributor (demo)”**.
- **Interactive Session Upvotes:** Visitors can upvote helpful recommendations in their active session.

### 4. 💬 Ask Locals (Community Q&A)
- **Seeded Practical Q&A:** High-value inquiries covering boat rides in Varanasi, altitude acclimatization in Ladakh, and scooter safety in South Goa.
- **Honest Labeling:** All sample answers are clearly badged as **“Sample answer (demo content)”**.
- **In-Session User Submissions:** Visitors can select a destination and post questions or tips. Submissions immediately appear at the top of the session stack with a temporary session badge (no persistent database required).

### 5. 🛡️ Transparency & Safety Disclaimers
- Prominent banners and notices clarify that all ticket prices, schedules, and duration estimates are illustrative and should be verified with official state tourism and monument portals.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** Plain CSS3 (responsive grid & flexbox, CSS custom properties, zero heavy UI frameworks)
- **Language:** JavaScript (ES Modules)
- **Backend / Serverless:** Vercel Serverless Function (`/api/plan.js`) with optional Google Gemini integration
- **Storage:** Local JavaScript datasets with React session state

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or v20 LTS recommended)
- npm (v9 or v10)

### 1. Clone or Open Workspace
```bash
cd explore-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🔑 Environment Variables & Gemini Integration

The website **works 100% out-of-the-box without an API key** using its built-in intelligent fallback itinerary engine.

If you wish to enable live AI generation with Google Gemini:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. *Security Note:* `GEMINI_API_KEY` is read strictly server-side by `/api/plan.js` and is never exposed in client bundles.

---

## 🌐 Deployment to Vercel

The project is structured specifically for zero-configuration Vercel deployment:

### Option A: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B: Deploy via Vercel Web Dashboard
1. Push the code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset will auto-detect **Vite**.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. *(Optional)* Add `GEMINI_API_KEY` under **Environment Variables** in project settings.
6. Click **Deploy**.

---

## 📁 Project Structure

```
explore-ai/
├── api/
│   └── plan.js               # Vercel serverless function (Gemini API bridge + fallback)
├── public/                   # Static public assets
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Responsive navigation & mobile drawer
│   │   ├── Hero.jsx          # Hero banner with slogan & value highlights
│   │   ├── DestinationCard.jsx  # Destination card with image fallback
│   │   ├── DestinationModal.jsx # Comprehensive destination deep-dive modal
│   │   ├── TripPlanner.jsx   # Multi-state AI trip planner & budget breakdown
│   │   ├── LocalRecommendations.jsx # Filterable tips with upvoting
│   │   ├── AskLocals.jsx     # Community Q&A with in-session user submission
│   │   └── Footer.jsx        # Accessible footer with links and notices
│   ├── data/
│   │   ├── destinations.js   # 6 Indian flagship destinations data
│   │   ├── recommendations.js# Seeded local recommendations
│   │   ├── discussions.js    # Seeded community Q&A
│   │   └── itineraryGenerator.js # Built-in intelligent demo fallback engine
│   ├── App.jsx               # Main application component
│   ├── index.css             # Unified responsive stylesheet
│   └── main.jsx              # Application entrypoint
├── .env.example              # Environment variable template
├── .gitignore                # Excludes secrets, node_modules, and dist
├── index.html                # HTML template with Google Fonts
├── package.json              # Project dependencies & build scripts
├── vercel.json               # Vercel SPA rewrites & routing configuration
├── vite.config.js            # Vite build configuration
└── README.md                 # Complete project documentation
```

---

## ⚖️ Hackathon MVP Notice
This project is an MVP demonstration created for hackathon evaluation. Sample costs, schedules, and contributor opinions are illustrative and should be verified against official regional authorities.
