# Game Account Manager (GAM)

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC) ![Dexie.js](https://img.shields.io/badge/Storage-IndexedDB-yellow)

> **A privacy-first, offline-capable dashboard for managing complex game account hierarchies and character assets.**

---

## 📖 Introduction & Background

### The Problem
For hardcore MMO players, guild leaders, or account boosters, managing digital assets is a chaotic experience. Players often juggle:
*   Multiple "Main" accounts (e.g., different email logins).
*   Numerous "Sub-accounts" (e.g., game regions or server IDs).
*   Dozens of characters across these accounts, each with specific levels, classes, and daily task requirements.

Most players resort to **Excel spreadsheets**, which are difficult to view on mobile, hard to filter, and lack visual hierarchy.

### The Solution (Product Thinking)
**GAM** solves this by providing a structured, hierarchical database specifically designed for gaming contexts.
*   **User Experience:** Replaces abstract rows/columns with a visual card-based interface.
*   **Privacy & Speed:** Adopts a "Local-First" strategy. Data is stored instantly in the browser. No login required, no server latency, and complete data privacy.
*   **Scalability:** Designed to handle complex nested relationships (Account -> Sub-Account -> Character) that simple note-taking apps cannot handle effectively.

---

## 🚀 Core Features

*   **Hierarchical Account Management:**
    *   **Main Accounts:** Track top-level login credentials.
    *   **Sub-Accounts:** Manage server-specific or region-specific instances linked to main accounts.
*   **Character Asset Tracking:**
    *   Detailed character profiles including Class, Level, Job Rank, and specific notes.
    *   Visual status tracking for daily/weekly tasks.
*   **Smart Tagging System:**
    *   Create custom color-coded tags to organize characters (e.g., "Raider", "Farmer", "Priority").
    *   Filter and search characters based on assigned tags.
*   **Offline Persistence:**
    *   Full functionality without an internet connection.
    *   Data is persisted reliably using **IndexedDB**, ensuring state is saved even if the browser is closed.

---

## 🛠 Tech Stack

This project leverages the latest standards in the React ecosystem to ensure high performance and maintainability.

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - Utilizing the latest React Server Components architecture.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) - For strict type safety across data models and components.
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/) - For a modern, responsive, and themable UI.
*   **State & Storage:** [Dexie.js](https://dexie.org/) - A wrapper for IndexedDB that allows for complex queries and transactional data integrity client-side.
*   **Icons:** [Lucide React](https://lucide.dev/) - Lightweight and consistent iconography.

---

## ⚡️ How to Run

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/gam.git
    cd gam
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Access the app**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Highlights & Technical Reflections

### 1. Architecture: Service Layer Pattern
Instead of embedding database logic directly into UI components, I implemented a strict **Service Layer architecture** (`services/` folder).
*   **Why?** This decouples the UI from the underlying storage mechanism. If I decide to switch from IndexedDB to a REST API or GraphQL in the future, I only need to update the services, not the React components.
*   **Result:** Clean, testable code conforming to SOLID principles.

### 2. Client-Side Persistence with Dexie.js
I chose **IndexedDB** over `localStorage` because:
*   **Capacity:** `localStorage` is limited to ~5MB, which is insufficient for a scalable application.
*   **Performance:** IndexedDB is asynchronous, preventing UI blocking during large read/write operations.
*   **Querying:** Dexie allows for complex queries (e.g., "Find all characters with Level > 50 in Account A"), which is impossible with simple key-value storage.

### 3. Modern CSS with Tailwind v4
Adopting Tailwind v4 (alpha/beta) allows for a zero-runtime CSS footprint and native support for modern CSS features like `@layer` and nested CSS, significantly reducing the bundle size compared to traditional CSS-in-JS solutions.

### 4. Future Roadmap
*   **Data Export/Import:** Allow users to backup their data to a `.json` file.
*   **Cloud Sync:** Optional integration with Firebase/Supabase for cross-device syncing.
*   **PWA Support:** Making the app installable on mobile devices for a native-like experience.

---

## 📝 License

This project is licensed under the MIT License.

---
*Created by Yong Xie*
