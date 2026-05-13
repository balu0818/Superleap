# Custom CRM Lead Tracking Application

A modern full-stack CRM (Customer Relationship Management) and Lead Tracking Application built using React, TypeScript, Vite, Tailwind CSS, Node.js, and Express.

This application helps businesses and sales teams efficiently manage customer leads through different stages of a sales pipeline using both a high-performance virtualized data table and an interactive drag-and-drop Kanban board.

---

# Overview

The application is designed to simulate a real-world CRM system where businesses can:

- Store and manage customer leads
- Track lead progress visually
- Update lead statuses dynamically
- Handle large datasets efficiently
- Improve workflow organization for sales teams

The project demonstrates:
- Full-stack application development
- REST API design
- Modern React architecture
- Drag-and-drop functionality
- Virtualized rendering
- State synchronization
- Reusable UI systems

---

# Features

## Lead Management
- Create new leads
- Update lead information
- Delete leads
- Bulk selection and deletion
- Real-time UI updates

---

## Sales Pipeline Tracking

Lead statuses include:

| Status | Description |
|---|---|
| NEW | Newly added lead |
| CONTACTED | Lead has been contacted |
| QUALIFIED | Lead is interested and validated |
| CONVERTED | Lead successfully converted |
| LOST | Lead no longer interested |

---

## Kanban Board

Interactive Trello-style drag-and-drop board built using dnd-kit.

### Features
- Smooth drag-and-drop interactions
- Visual workflow management
- Status-based lead organization
- Business-rule validation

### Example Validation
- NEW → CONTACTED ✅
- NEW → CONVERTED ❌

This ensures realistic sales workflow handling.

---

## Virtualized Leads Table

A high-performance table built using TanStack Virtual.

### Advantages
- Handles thousands of leads efficiently
- Optimized rendering
- Smooth scrolling
- Reduced browser load

Instead of rendering all rows simultaneously, only visible rows are rendered dynamically.

---

## Real-Time State Synchronization

Powered by TanStack Query.

### Features
- API caching
- Automatic background synchronization
- Instant UI updates
- Loading state handling
- Error handling

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | Frontend library |
| TypeScript | Type safety |
| Vite | Fast development environment |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side routing |

---

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API server |

---

## Libraries Used

| Library | Purpose |
|---|---|
| TanStack Query | API state management |
| TanStack Virtual | Virtualized rendering |
| dnd-kit | Drag-and-drop system |
| Concurrently | Running frontend & backend together |

---

# Application Architecture

The project follows a modular and feature-based architecture for better scalability, maintainability, and code organization.

```bash
FI-6/
│
├── node_modules/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Checkbox.tsx
│   │       └── Modal.tsx
│   │
│   ├── features/
│   │   └── leads/
│   │       │
│   │       ├── api/
│   │       │   └── leads.api.ts
│   │       │
│   │       ├── components/
│   │       │   ├── LeadForm.tsx
│   │       │   └── LeadStatusBadge.tsx
│   │       │
│   │       ├── hooks/
│   │       │   └── useLeads.ts
│   │       │
│   │       ├── pages/
│   │       │   ├── BoardPage.tsx
│   │       │   └── LeadsPage.tsx
│   │       │
│   │       └── types/
│   │           └── lead.types.ts
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── routes/
│   │   └── index.tsx
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── seed.json
├── server.js
├── tsconfig.json
└── vite.config.ts
```

---

# Folder Explanation

## public/
Contains static assets such as the application favicon.

---

## src/components/ui/
Contains reusable UI components used throughout the application.

### Components
- Button
- Modal
- Checkbox
- Badge

These components improve:
- Code reusability
- UI consistency
- Maintainability

---

## src/features/leads/

Main feature module responsible for lead management functionality.

---

### api/

Contains API request functions responsible for communicating with the backend server.

Examples:
- Fetch leads
- Create lead
- Update lead
- Delete lead

---

### components/

Contains lead-specific reusable components.

Examples:
- LeadForm.tsx
- LeadStatusBadge.tsx

---

### hooks/

Contains custom React hooks.

#### useLeads.ts
Handles:
- Lead fetching
- API mutations
- Caching
- State synchronization

using TanStack Query.

---

### pages/

Contains major pages related to lead management.

#### LeadsPage.tsx
Features:
- Virtualized data table
- Bulk operations
- High-performance rendering

#### BoardPage.tsx
Features:
- Drag-and-drop Kanban board
- Visual sales pipeline tracking

---

### types/

Contains TypeScript interfaces and type definitions.

---

## src/layout/

Contains layout-related components.

### AppLayout.tsx
Defines the overall application structure.

### Sidebar.tsx
Handles navigation UI.

---

## src/lib/

Contains utility/helper functions shared across the application.

---

## src/routes/

Contains application routing configuration.

---

## App.tsx

Root React component of the application.

---

## main.tsx

Main application entry point where React mounts the application to the DOM.

---

## server.js

Custom Express backend server.

### Responsibilities
- Running REST APIs
- Managing lead data
- CRUD operations
- Loading seed data

---

## seed.json

Contains mock/sample lead data loaded during server startup.

---

## vite.config.ts

Contains Vite configuration:
- Development server setup
- API proxy configuration
- Build configuration

---

## package.json

Contains:
- Project metadata
- Dependencies
- Scripts
- Project configuration

---

# Backend Overview

The backend is built using Express.js and runs on Port 4000.

It simulates database functionality using an in-memory data store.

Sample lead data is automatically loaded from `seed.json`.

---

# REST API Endpoints

## Get All Leads

```http
GET /leads
```

Returns all lead records.

---

## Create Lead

```http
POST /leads
```

Creates a new lead.

---

## Update Lead

```http
PUT /leads/:id
```

Updates lead information.

---

## Update Lead Status

```http
PATCH /leads/:id/status
```

Updates only the lead status.

---

## Delete Lead

```http
DELETE /leads/:id
```

Deletes a lead.

---

# Frontend Overview

## Leads Table Page

File:
```bash
pages/LeadsPage.tsx
```

### Features
- Virtualized rendering
- Bulk actions
- Optimized performance
- Large dataset handling

---

## Kanban Board Page

File:
```bash
pages/BoardPage.tsx
```

### Features
- Drag-and-drop support
- Visual pipeline management
- Status validation logic

---

# Vite Proxy Configuration

The frontend uses a Vite proxy configuration.

API calls made to:

```bash
/api/leads
```

are automatically forwarded to:

```bash
http://localhost:4000/leads
```

This helps avoid CORS issues during development.

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/balu0818/Superleap
```

---

## Navigate Into Project

```bash
cd your-repository-name
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

This command starts:
- Frontend on Port 3000
- Backend on Port 4000

simultaneously using concurrently.

---

# Development Ports

| Service | Port |
|---|---|
| Frontend (Vite) | 3000 |
| Backend (Express) | 4000 |

---

# Performance Optimizations

The application includes several optimization techniques:

- Virtualized rendering
- Efficient API caching
- Optimized UI updates
- Reusable component system
- Modular architecture

---

# Current Limitations

- No permanent database integration
- Data stored in memory
- No authentication system
- No deployment configuration yet

---

# Future Improvements

- MongoDB/PostgreSQL integration
- Authentication & authorization
- Advanced filtering & search
- Dashboard analytics
- Cloud deployment
- Role-based access control
- Real-time notifications

---

# Learning Outcomes

This project helped in understanding:

- Full-stack development
- REST API creation
- React architecture
- Virtualized rendering
- Drag-and-drop systems
- State management
- Frontend-backend integration
- Scalable project structures

---

# Completed By

## Vithanala Balu

B.Tech – **Indian Institute of Technology Patna**

---
