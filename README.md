# FinCalcPro - Advanced Financial Tools Platform

## 🌟 Project Overview & Vision
**FinCalcPro** is a premium, privacy-focused financial calculator platform designed to provide accurate, client-side financial tools (SIP, Loan, Tax, Retirement) wrapped in a beautiful, high-performance interface.

### The Vision
- **Privacy First**: All calculations happen on the user's device. No financial data is sent to the server.
- **Premium Experience**: A "Wall Street" aesthetic with dark modes, smooth animations, and zero clutter.
- **Sustainable Business**: A hybrid revenue model combining Google AdSense (display ads) and Affiliate Marketing (high-value financial product recommendations), managed via a powerful Admin Panel.

---

## 🚀 Getting Started

### Mandatory Prerequisites
1.  **Node.js**: Version 18+ required.
2.  **MongoDB**: A running MongoDB instance (local or Atlas) for saving user data and settings.
3.  **Environment Variables**: You MUST create a `.env` file in the `frontend` folder (if using Next.js API routes) or `backend` folder.

### Installation & Running
1.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
2.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```

### ⚠️ Common Errors & Mistakes to Avoid
1.  **PowerShell Script Error**:
    - *Error*: `File ... npm.ps1 cannot be loaded because running scripts is disabled on this system.`
    - *Fix*: This is a Windows security setting. Open PowerShell as Admin and run: `Set-ExecutionPolicy RemoteSigned`. Or run commands using `cmd` instead of PowerShell.
2.  **MongoDB Connection Failure**:
    - *Error*: App crashes or spins on loading.
    - *Fix*: Ensure your IP is whitelisted in MongoDB Atlas or your local DB service is running. Check `MONGODB_URI`.
3.  **Hydration Errors**:
    - *Cause*: Using random numbers or dates in React components without `useEffect`. This matches server HTML with client HTML.

---

## 📂 Project Structure: The "Brain" of the Operation

### 1. Frontend (`/frontend`)
The user-facing application built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

-   **`src/app`**: The routing system.
    -   **`page.tsx`**: The Homepage. Contains the Hero section, "Super Search", and the Tool Grid. It now integrates `useSettings` to hide tools that are disabled in the Admin Panel.
    -   **`layout.tsx`**: The Global Wrapper. Injects the Navbar, Footer, and **Google AdSense Scripts**.
    -   **`tools/[slug]/page.tsx`**: The Dynamic Tool Page. This generic page loads the specific calculator based on the URL (e.g., `/tools/sip-calculator`).
    -   **`admin/page.tsx`**: The Admin Dashboard. Protected by authentication.
-   **`src/components`**: Reusable UI blocks.
    -   **`ToolInterface.tsx`**: The **Core Engine**. It handles:
        -   Displaying input fields dynamically.
        -   Running calculation logic.
        -   Generating charts (Chart.js).
        -   Displaying Ads (Header, In-content).
        -   **Maintenance/Disabled Checks**: Blocks access if the tool is turned off.
    -   **`AdUnit.tsx`**: The intelligent ad component. It checks:
        -   Is user Premium? (If yes, return null).
        -   Is AdSense loaded? (If no, show Affiliate Fallback).
-   **`src/lib/calculators`**: The Math Logic.
    -   **`registry.ts`**: Maps tool IDs (e.g., `sip-calc`) to their configuration (inputs, formula, metadata).
-   **`src/config/ads.ts`**: The Ad Strategy Control Center. Defines slot names and fallback data.

### 2. Backend (`/backend`)
The data persistence layer built with **Express.js** and **Mongoose**.

-   **`src/routes`**: API Endpoints.
    -   **`adminRoutes.ts`**: Handles User CRUD and Global Settings.
-   **`src/models`**: Database Schemas.
    -   **`User.ts`**: Stores user profiles and Premium status.
    -   **`Settings.ts`**: Stores global configs (Maintenance Mode, Ad Toggles, Disabled Tools List).

---

## 🎮 Key Features & Page Breakdown

### 1. Homepage
-   **Super Search**: Real-time search/filter for tools.
-   **Tool Grid**: Displays all active tools. *Ad Placement*: In-feed ads appear every 6 items.
-   **Footer**: Contains legal links and the Global Footer Ad.

### 2. Tool Page (The Money Maker)
-   **Layout**: 2-Column Desktop Layout (Calculator + Sidebar).
-   **Ad Slots**:
    -   **Home Header**: High visibility.
    -   **Sidebar Skyscraper**: Sticky ad on the right (Desktop).
    -   **In-Content**: Between results and analytics.
-   **Functionality**: Users input data -> Real-time Chart updates -> Save functionality.

### 3. Admin Panel (`/admin`)
-   **Dashboard**: Real-time stats (Revenue, Users).
-   **Users Tab**:
    -   **Edit**: Toggle Free/Premium status manually.
    -   **Delete**: Remove spam users.
-   **Tools Management**: Switch any of the 50 tools ON/OFF instantly.
-   **Global Settings**:
    -   **Maintenance Mode**: "Kill Switch" for the frontend.
    -   **Ad Controls**: Update Publisher ID, toggle specific ad slots.

---

## 🔮 Future Scope & Roadmap

1.  **User Accounts & dashboard**:
    -   Allow users to save *calculation history* to the cloud (currently localAuth only).
2.  **PWA (Progressive Web App)**:
    -   Make the site installable on mobile phones as an app.
3.  **PDF Reports**:
    -   "Download Report" button for Loan/Tax calculations to generate professional PDFs.
4.  **Comparison Tools**:
    -   Compare two loans or two investment scenarios side-by-side.
5.  **Multi-Language Support**:
    -   Add Hindi/Regional language support for broader Indian reach.

---

## 🛠 Troubleshooting Current "Error"
If you see an error on the website:
1.  **Check the Console**: Press F12 in the browser. Red text usually explains the issue (e.g., "Failed to fetch settings").
2.  **Backend Status**: Ensure the backend server (`port 5000`) is running. If `useSettings` fails to fetch, the site might lag or show loading states.
3.  **AdBlockers**: If ads don't show, disable your AdBlocker. The `AdUnit` has a fallback, but aggressive blockers might hide the container entirely.
