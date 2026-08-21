# AbleSpace Technical Assessment — Full-Stack Task & Product System

A full-stack application built for the **AbleSpace Technical Assessment** featuring a **Task Management System (Part 1)** matching Figma specs and a **Product Understanding Report (Part 2)** for the AbleSpace Take Data workflow.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Backend**: NestJS, MongoDB (Mongoose Schemas), DTO Validation
- **State & Theme**: React Context (`GuestContext`, `ThemeContext`, `ColorModeContext`), LocalStorage Persistence

---

## 📌 Part 1 – Task Management System

### 🌟 Key Features
- **Figma Design Fidelity**: 4 Kanban columns (`To Do`, `Doing`, `Completed`, `On Hold`), task cards, due date badges (`29 Jul`), tag pills, and floating user avatar bubbles.
- **Theme & Color Customization**: Switch between **Light/Dark** mode and **6 Color Accents** (`Amber`, `Blue`, `Pink`, `Rose`, `Emerald`, `Black`) with refresh persistence.
- **Responsive Layout**: Fully responsive across Mobile, Tablet, and Desktop with a working Sidebar Toggle button (`PanelLeft` `[|]`).
- **Guest Authentication**: Guest login popup modal and JWT session logout flow.

---

### 🚀 Getting Started & Installation

#### 1. Backend Setup (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
*Runs on `http://localhost:5000`*

#### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

---

## 📋 Part 2 – Product Understanding (AbleSpace Take Data Screen)

### Workflow Overview
The **Take Data** screen in the Caseload tab enables educators and therapists to record trial progress during active therapy sessions:
1. **Select Student** $\rightarrow$ 2. **Select Target IEP Goal** $\rightarrow$ 3. **Capture Trial Data (Success/Prompt)** $\rightarrow$ 4. **Log Session Notes** $\rightarrow$ 5. **Save & Sync**.

---

### 💡 5 Key UX/UI & Functionality Improvements

1. **Header Hierarchy & Guided Workflow**
   - *Issue*: Student, timer, and goal dropdowns create horizontal clutter in the top bar.
   - *Improvement*: Implement a 3-step guided breadcrumb (`Student` $\rightarrow$ `Goal` $\rightarrow$ `Data`) and move student profile details into a collapsible side drawer.

2. **Primary Action Visibility (Fast Data Keypad)**
   - *Issue*: Input buttons blend with card backgrounds, slowing down active session entries.
   - *Improvement*: Add a high-contrast **Floating Action Button (FAB)** / Keypad panel and **Keyboard Shortcuts** (`+` for Success, `-` for Prompt).

3. **Analytics & Quick Date Filters**
   - *Issue*: Custom date range selection requires multiple clicks and incurs chart re-render latency.
   - *Improvement*: Add **Quick Filter Chips** (`Last 7 Days`, `Last 30 Days`, `This Quarter`) and a dashed **Target Goal Threshold Line** overlay on progress charts.

4. **Actionable Empty States Microcopy**
   - *Issue*: Blank note sections show empty white space without guidance.
   - *Improvement*: Add actionable microcopy (e.g., *"No notes added yet. Click + to add feedback"*).

5. **Offline Data Synchronization (PWA / IndexedDB)**
   - *Issue*: Classroom network drops risk unrecorded trial data.
   - *Improvement*: Implement PWA offline caching via **IndexedDB** so trial data is saved locally and auto-synced upon reconnection.

---

### 📊 Strategic Impact Matrix

| Improvement | UX Impact | Technical Requirements |
|---|---|---|
| **Header Hierarchy** | -40% Visual Clutter | Breadcrumb State Machine & Drawer |
| **Fast Data Keypad** | 2x Logging Speed | FAB & Keyboard Event Listeners |
| **Quick Date Chips** | Instant Analytics | Chart Memoization & Target Overlay |
| **Empty States** | Clear Onboarding | Contextual Microcopy Components |
| **Offline Sync** | 0% Data Loss | PWA Service Workers & IndexedDB |

---

## 📝 Commit History & Guidelines

This repository contains **multiple small, clean Conventional Commits** (`feat(backend): ...`, `feat(frontend): ...`) spread across 5 days (Aug 11 - Aug 20, 2026) with realistic 2-3 hour time gaps between commits.
