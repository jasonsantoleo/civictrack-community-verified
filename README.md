# civictrack-community-verified

## The Problem

The fundamental problem is the breakdown of trust in the civic reporting process. Citizens feel their reports on issues like road damage or garbage overflow are shouts into a void. On the other side, municipal authorities are swamped with unreliable, unverified data. This creates a vicious cycle of apathy and inaction.

## Our Solution

CivicTrack is a mobile-first web application that transforms the standard "complaint box" into a verifiable ledger of real-world problems.

We achieve this through a smart, achievable, and powerful system of **Geofenced Community Consensus**. An issue is only marked as `VERIFIED` after a second community member, physically present at the location, confirms its existence. Every action creates an immutable, timestamped record, building a trusted dataset for both citizens and city officials.

## Core Features (MVP for Today's Sprint)

- [ ] **User Authentication:** Secure login and registration.
- [ ] **Report New Issue:** Submit an issue with a title, description, photo, and GPS coordinates.
- [ ] **Interactive Map View:** Display all reported issues as pins on a map of Chennai.
- [ ] **(Killer Feature) Geofenced Verification:** Prompt nearby users to validate new, unverified reports.
- [ ] **Real-time Status Updates:** Map pins change instantly as an issue's status is updated (e.g., from `UNVERIFIED` to `VERIFIED`).
- [ ] **Transparent Issue Ledger:** View the complete, timestamped history of any issue.

## Tech Stack

* **Frontend:** Vite ⚡, React ⚛️, TypeScript, Tailwind CSS, Leaflet.js 🗺️
* **Backend:** Supabase (PostgreSQL DB, Auth, Storage, Edge Functions)
* **Deployment:** Vercel (Frontend), Supabase CLI (Functions)

## Getting Started (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/civictrack-community-verified.git](https://github.com/YOUR_USERNAME/civictrack-community-verified.git)
    cd civictrack-community-verified
    ```

2.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

3.  **Setup environment variables:**
    * Create a copy of the example environment file. You will need to populate this with your Supabase keys.
    ```bash
    cp .env.example .env
    ```

4.  **Install dependencies:**
    ```bash
    npm install
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.