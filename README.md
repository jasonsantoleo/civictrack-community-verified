
## The Problem

The fundamental problem is the breakdown of trust in the civic reporting process. Citizens feel their reports on issues like road damage or garbage overflow are shouts into a void. On the other side, municipal authorities are swamped with unreliable, unverified data. This creates a vicious cycle of apathy and inaction.

## Our Solution

CivicTrack is a mobile-first web application that transforms the standard "complaint box" into a verifiable ledger of real-world problems.

We achieve this through a smart, achievable, and powerful system of **Geofenced Community Consensus**. An issue is only marked as `VERIFIED` after a second community member, physically present at the location, confirms its existence. Every action creates an immutable, timestamped record, building a trusted dataset for both citizens and city officials.

## Key Features

- [x] **Secure User Authentication:** Polished sign-up and login flow.
- [x] **New Issue Reporting:** Submit issues with a title, description, photo, and GPS location (with a map-center fallback).
- [x] **Interactive Map View:** Displays all issues on a map of Chennai with custom, color-coded pins.
- [x] **Image Previews:** View reported images directly in the map popups.
- [x] **Geofenced Community Verification:** The "killer feature" prompts nearby users to validate new, unverified reports.
- [x] **Real-Time Updates:** The map updates instantly for all users using Supabase Broadcast when issues are reported or verified.
- [x] **Robust Security:** Full database and storage security implemented with Row Level Security (RLS) policies.

## Tech Stack

* **Frontend:** Vite ⚡, React ⚛️, TypeScript, Tailwind CSS, Leaflet.js 🗺️, Lucide React 🎨
* **Backend:** Supabase (PostgreSQL DB, Auth, Storage)
* **Deployment:** Vercel (Frontend)

## Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jasonsantoleo/civictrack-community-verified.git
   cd civictrack-community-verified
   ```

2. **Navigate to the client directory:**
   ```bash
   cd client
   ```

3. **Setup environment variables:**
   * Create a copy of the example environment file. You will need to populate this with your Supabase keys.
   ```bash
   cp .env.example .env
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.