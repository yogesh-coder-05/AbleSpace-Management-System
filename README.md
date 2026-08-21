# AbleSpace Task Management System

A full-stack Task & Project Management web application built with **Next.js 14 (App Router)**, **Tailwind CSS**, **NestJS**, and **MongoDB**. Designed with strict fidelity to Figma UI/UX specifications, multi-theme persistence, guest authentication, and responsive layout across desktop, tablet, and mobile devices.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript, Axios, Lucide React
- **Backend**: NestJS, MongoDB, Mongoose Schemas, DTO Validation, JWT Authentication
- **State & Theme Context**: React Context (`GuestContext`, `ThemeContext`, `ColorModeContext`), LocalStorage Persistence

---

## 🌟 Key Features & Design Fidelity

1. **Figma UI/UX Fidelity**:
   - 4 Kanban columns (`To Do`, `Doing`, `Completed`, `On Hold`) with drag handles, column option menus, and task cards.
   - Assignee avatars (`Admin`, `QA Team`, `Designer`, `Security`, `Dev Team`, `Product`, `Engineer`), pink due date badges (`29 Jul`, `30 Jul`, `31 Jul`, `01 Aug`), and tag pills.
   - Floating user avatar indicators scattered around the Kanban board.
   - Compact left sidebar (`~140-150px`) with workspace switcher and active links.

2. **Multi-Theme & Color Customization**:
   - Instant switching between **Light** and **Dark** themes.
   - **6 Accent Color Modes**: `Amber`, `Blue`, `Pink`, `Rose`, `Emerald`, and `Black` driven by CSS variables (`--accent-color`, `--accent-hover`).
   - Preference persistence across browser refreshes via `localStorage`.

3. **Responsive Layout & Navigation**:
   - Fully responsive across Desktop, Tablet, and Mobile viewports.
   - Working **Sidebar Toggle Button (`PanelLeft` `[|]`)** accessible on all screen sizes.
   - Mobile side drawer with backdrop overlay.

4. **Guest Authentication & Session Control**:
   - Guest login popup modal and JWT session authentication.
   - Profile settings page with protected route guards and guest logout handling.

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### 1. Backend Setup (NestJS)

```bash
cd backend

# Install dependencies
npm install

# Start NestJS server in development mode
npm run start:dev
```
*Backend API runs on `http://localhost:5000/api`*

---

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
*Frontend app runs on `http://localhost:3000`*

---

## 📝 Commit History Flow

### Day 1 (11 Aug 2026)
- `feat(init): initialize AbleSpace full-stack repository structure and configuration`
- `feat(backend): setup NestJS app module, User schema and MongoDB database connection`
- `feat(backend): implement guest login endpoint and JWT authentication flow`

### Day 2 (12 Aug 2026)
- `feat(backend): add project management module with CRUD services and schemas`
- `feat(backend): implement task management service with subtasks and comments`
- `feat(frontend): implement responsive Kanban board UI and task management modals`

### Day 3 (13 Aug 2026)
- `feat(frontend): refine sidebar workspace navigation, project selection and icon assets`
- `feat(frontend): enhance Kanban board layout, floating avatar indicators and task card design`
- `feat(frontend): implement projects dashboard view and detailed task detail page component`
- `feat(frontend): optimize top header toolbar controls, layout wrapper and fallback API data`

### Day 4 (14 Aug 2026)
- `feat(backend): implement logout session handler, project endpoints and task service queries`
- `feat(frontend): add guest logout context, profile settings page and guest login modal updates`
- `feat(frontend): refine project creation modal, task detail view and main dashboard layout`

### Day 5 (15 Aug 2026)
- `feat(backend): add project DTO validation, tasks controller endpoints and query service optimizations`
- `feat(frontend): implement global error boundaries, 404 page, modal components and API client polish`

### Day 6 (20 Aug 2026)
- `feat(backend): strongly type subtask, update and comment schemas in task module`
- `feat(frontend): add skeleton loading state components and color mode accent utilities`
- `feat(frontend): integrate skeleton loaders, project view state and fallback store sync`
- `feat(tasks): implement interactive due date picker and enhance task audit trail logging`
- `feat(ui): enable sidebar toggle button and profile popover across mobile, tablet and desktop viewports`

### Day 7 (21 Aug 2026)
- `feat(frontend): implement guest auth route guards, loading state spinners and header breadcrumb layout`
- `docs: add comprehensive root README covering Part 1 architecture and Part 2 product report`

---

## 📊 Part 2 – Key UI/UX & Functionality Improvements (AbleSpace Take Data Screen)

### 1. Header Hierarchy & Layout Structure
- **Issue**: Session time, student selector, and goal dropdowns are cramped horizontally in the top bar, creating visual clutter.
- **Improvement**: Adopt a guided step-by-step workflow (`Step 1: Student` -> `Step 2: Goal` -> `Step 3: Capture Data`) or move student context into a collapsible side drawer.

### 2. Primary Action Visibility (Fast Data Collection)
- **Issue**: Data input buttons blend in with background UI, slowing down quick entries during active therapy sessions.
- **Improvement**: Add a high-contrast Floating Action Button (FAB) or dedicated Keypad UI for one-tap data capture, plus keyboard shortcuts (e.g., `+` for success, `-` for prompt).

### 3. Analytics & Date Filtering Efficiency
- **Issue**: Custom date filtering requires multiple clicks and incurs slight loading latency on charts.
- **Improvement**: Add quick filter chips (`Last 7 Days`, `Last 30 Days`, `This Quarter`) and permanently overlay a dashed Target Goal Line on graphs to show progress gaps instantly.

### 4. Empty States & Onboarding Microcopy
- **Issue**: Blank sections (like notes or unrecorded goals) show empty space without guidance.
- **Improvement**: Replace blank cards with actionable microcopy (e.g., *"No notes added yet. Click + to add session feedback"*) or subtle onboarding tooltips.

### 5. Offline Data Synchronization
- **Issue**: Network drops during classroom sessions risk unrecorded trial data.
- **Improvement**: Implement PWA / Local Storage (IndexedDB) caching so therapists can record data offline and auto-sync when reconnected.
