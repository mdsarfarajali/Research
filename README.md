
# 🔬 Research Portal Management System

A comprehensive **Angular 22** web application for managing academic research papers, faculty profiles, and institutional analytics. Built with TypeScript, RxJS, Chart.js, and modern web standards.

![Angular](https://img.shields.io/badge/Angular-22-dd0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript)
![RxJS](https://img.shields.io/badge/RxJS-7.8-b7178c?style=for-the-badge&logo=reactivex)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-ff6384?style=for-the-badge&logo=chartdotjs)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Demo Credentials](#-demo-credentials)
- [Key Technical Highlights](#-key-technical-highlights)
- [Agile Kanban Board](#-agile-kanban-board)
- [Testing](#-testing)
- [JD Requirement Coverage](#-jd-requirement-coverage)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based login/register with token management
- Angular Route Guards (`AuthGuard`, `RoleGuard`)
- HTTP Interceptor for automatic Bearer token injection
- Role-based access control (Admin / Faculty / Student)
- Auto-logout on 401 responses

### 📊 Dashboard with Live Stats
- Real-time statistics cards with animated counters
- **Chart.js** integration with 3 chart types:
  - Monthly submissions line chart (with gradient fills)
  - Paper status doughnut chart
  - Category distribution bar chart
- Recent papers table and department rankings

### 📝 Paper Submission System
- Reactive forms with comprehensive validation
- Dynamic `FormArray` for authors and keywords
- Character counter and field-level error messages
- Category selection and optional publication info
- Success state with auto-redirect

### 👨‍🏫 Faculty Profile CRUD
- Full Create, Read, Update, Delete operations
- Profile cards with avatar, stats, and specializations
- Detailed profile view with contact info and external links
- Dynamic form arrays for specializations and research interests

### 🔍 Search & Filter (RxJS)
- Debounced search with `debounceTime(300)` + `distinctUntilChanged`
- Multi-criteria filtering (category, status, sort order)
- `switchMap` for cancelling stale requests

### 📄 Pagination + Infinite Scroll
- Traditional pagination with sliding window page numbers
- Toggle-able infinite scroll mode
- Load-more button for progressive loading

### 🏗️ Lazy-Loaded Modules
- `AuthModule` — Login/Register (public)
- `DashboardModule` — Analytics (authenticated)
- `PapersModule` — Paper management (authenticated)
- `FacultyModule` — Faculty profiles (Admin/Faculty only)

### 🧪 Unit Tests
- Jasmine/Karma test suite
- Service tests: AuthService, PaperService, FacultyService, DashboardService
- Component tests: LoginComponent, PaperSubmitComponent
- Pipe tests: TruncatePipe

### 📱 Responsive Design
- CSS Grid + Flexbox layout system
- Collapsible sidebar with mobile hamburger menu
- Mobile-first breakpoints at 640px, 768px, 1024px
- Glassmorphism UI with dark theme

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  AppModule                   │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐ │
│  │CoreModule│  │SharedModule│  │  Layout   │ │
│  │(Guards,  │  │(Components,│  │(Sidebar,  │ │
│  │Intercept,│  │ Pipes)     │  │ TopBar)   │ │
│  │Services) │  │            │  │           │ │
│  └──────────┘  └────────────┘  └──────────┘ │
├─────────────────────────────────────────────┤
│            Lazy-Loaded Modules               │
│  ┌──────┐ ┌──────────┐ ┌────────┐ ┌───────┐│
│  │ Auth │ │Dashboard │ │ Papers │ │Faculty││
│  │Module│ │  Module  │ │ Module │ │Module ││
│  └──────┘ └──────────┘ └────────┘ └───────┘│
└─────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 22+

### Installation

```bash
# Navigate to project directory
cd "juniour angular"

# Install dependencies (already done)
npm install

# Start development server
ng serve
# or
npm start

# Open browser
# http://localhost:4200
```

### Build for Production

```bash
ng build --configuration production
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services & guards
│   │   ├── guards/
│   │   │   ├── auth.guard.ts        # Authentication guard
│   │   │   └── role.guard.ts        # Role-based access guard
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts   # JWT token interceptor
│   │   ├── models/
│   │   │   ├── user.model.ts        # User & auth interfaces
│   │   │   ├── paper.model.ts       # Paper & review interfaces
│   │   │   ├── faculty.model.ts     # Faculty profile interfaces
│   │   │   ├── dashboard.model.ts   # Dashboard stats interfaces
│   │   │   └── api-response.model.ts# Generic API wrappers
│   │   ├── services/
│   │   │   ├── auth.service.ts      # JWT authentication
│   │   │   ├── paper.service.ts     # Paper CRUD & search
│   │   │   ├── faculty.service.ts   # Faculty CRUD & search
│   │   │   └── dashboard.service.ts # Dashboard statistics
│   │   └── core.module.ts
│   ├── shared/                  # Reusable components & pipes
│   │   ├── components/
│   │   │   ├── loading-spinner/     # Animated loading indicator
│   │   │   ├── status-badge/        # Color-coded status pills
│   │   │   ├── search-bar/          # Debounced search input
│   │   │   ├── pagination/          # Page navigation
│   │   │   └── confirm-dialog/      # Modal confirmation
│   │   ├── pipes/
│   │   │   ├── truncate.pipe.ts     # Text truncation
│   │   │   └── time-ago.pipe.ts     # Relative timestamps
│   │   └── shared.module.ts
│   ├── features/                # Lazy-loaded feature modules
│   │   ├── auth/                    # Login & Register
│   │   ├── dashboard/               # Analytics dashboard
│   │   ├── papers/                  # Paper list, detail, submit
│   │   └── faculty/                 # Faculty list, detail, form
│   ├── layout/                  # App shell (sidebar + content)
│   ├── app-routing.module.ts    # Root routing with lazy loading
│   └── app.module.ts
├── environments/                # Environment configurations
├── styles.scss                  # Global styles & design tokens
└── index.html                   # Entry HTML with SEO meta
```

---

## 🔑 Demo Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@research.edu     | admin123    |
| Faculty | faculty@research.edu   | faculty123  |
| Student | student@research.edu   | student123  |

---

## 🔧 Key Technical Highlights

| Feature | Implementation |
|---------|---------------|
| **JWT Auth** | `AuthService` with `BehaviorSubject`, token encode/decode, `JwtInterceptor` |
| **Reactive Forms** | `FormBuilder`, `FormArray`, custom validators, `markAllAsTouched()` |
| **RxJS Operators** | `debounceTime`, `distinctUntilChanged`, `switchMap`, `takeUntil`, `BehaviorSubject` |
| **Chart.js** | Line chart (gradients), Doughnut chart (cutout), Bar chart (rounded corners) |
| **Lazy Loading** | `loadChildren` with dynamic `import()` for all feature modules |
| **Guards** | `AuthGuard` (login check), `RoleGuard` (role-based with route data) |
| **Interceptors** | `JwtInterceptor` attaches Bearer token, handles 401 auto-logout |
| **Responsive** | CSS Grid + Flexbox, mobile sidebar overlay, 3 breakpoints |
| **Pagination** | Sliding window pagination + infinite scroll toggle |
| **TypeScript** | Strict mode, interfaces for all models, enums for statuses/categories |

---

## 📋 Agile Kanban Board

### Sprint 1 — Foundation (Week 1) ✅

| Status | Task | Priority | Assignee |
|--------|------|----------|----------|
| ✅ Done | Project setup with Angular CLI | High | Dev |
| ✅ Done | Environment configuration | Medium | Dev |
| ✅ Done | Core models/interfaces (User, Paper, Faculty, Dashboard) | High | Dev |
| ✅ Done | AuthService with JWT mock implementation | High | Dev |
| ✅ Done | CoreModule with JWT Interceptor | High | Dev |
| ✅ Done | AuthGuard and RoleGuard | High | Dev |
| ✅ Done | SharedModule (LoadingSpinner, StatusBadge, Pipes) | Medium | Dev |

### Sprint 2 — Authentication & Layout (Week 2) ✅

| Status | Task | Priority | Assignee |
|--------|------|----------|----------|
| ✅ Done | Login page with reactive form validation | High | Dev |
| ✅ Done | Register page with role selection | High | Dev |
| ✅ Done | Layout component with collapsible sidebar | High | Dev |
| ✅ Done | Top navigation bar with user info | Medium | Dev |
| ✅ Done | Mobile responsive sidebar with overlay | Medium | Dev |
| ✅ Done | Global styles & design system (Inter font, dark theme) | Medium | Dev |
| ✅ Done | Route configuration with lazy loading | High | Dev |

### Sprint 3 — Dashboard & Charts (Week 3) ✅

| Status | Task | Priority | Assignee |
|--------|------|----------|----------|
| ✅ Done | DashboardService with mock statistics | High | Dev |
| ✅ Done | Stats cards with animated hover effects | Medium | Dev |
| ✅ Done | Monthly submissions line chart (Chart.js) | High | Dev |
| ✅ Done | Paper status doughnut chart | High | Dev |
| ✅ Done | Category distribution bar chart | Medium | Dev |
| ✅ Done | Recent papers table with routing | Medium | Dev |
| ✅ Done | Top departments ranking with progress bars | Low | Dev |

### Sprint 4 — Paper Management (Week 4) ✅

| Status | Task | Priority | Assignee |
|--------|------|----------|----------|
| ✅ Done | PaperService with mock data & CRUD | High | Dev |
| ✅ Done | Paper list with card grid layout | High | Dev |
| ✅ Done | Search with debounceTime (RxJS) | High | Dev |
| ✅ Done | Multi-criteria filter (category, status, sort) | High | Dev |
| ✅ Done | Pagination component with sliding window | High | Dev |
| ✅ Done | Infinite scroll toggle mode | Medium | Dev |
| ✅ Done | Paper detail view with metrics sidebar | Medium | Dev |
| ✅ Done | Paper submission form with FormArrays | High | Dev |
| ✅ Done | Admin status update & delete actions | Medium | Dev |

### Sprint 5 — Faculty Profiles (Week 5) ✅

| Status | Task | Priority | Assignee |
|--------|------|----------|----------|
| ✅ Done | FacultyService with mock profiles | High | Dev |
| ✅ Done | Faculty list with profile cards | High | Dev |
| ✅ Done | Debounced faculty search (RxJS) | High | Dev |
| ✅ Done | Faculty detail view with stats & contact | Medium | Dev |
| ✅ Done | Faculty create/edit form (reusable) | High | Dev |
| ✅ Done | Delete confirmation dialog | Medium | Dev |
| ✅ Done | Role-based route protection (Admin/Faculty) | High | Dev |

### Sprint 6 — Testing & Polish (Week 6) ✅

| Status | Task | Priority | Assignee |
|--------|------|----------|----------|
| ✅ Done | AuthService unit tests (7 specs) | High | Dev |
| ✅ Done | PaperService unit tests (10 specs) | High | Dev |
| ✅ Done | FacultyService unit tests (7 specs) | High | Dev |
| ✅ Done | DashboardService unit tests (5 specs) | Medium | Dev |
| ✅ Done | LoginComponent unit tests (7 specs) | Medium | Dev |
| ✅ Done | PaperSubmitComponent unit tests (8 specs) | Medium | Dev |
| ✅ Done | TruncatePipe unit tests (3 specs) | Low | Dev |
| ✅ Done | SEO meta tags & accessibility | Medium | Dev |
| ✅ Done | Documentation (README with Kanban board) | Medium | Dev |

### Backlog (Future Sprints)

| Status | Task | Priority | Notes |
|--------|------|----------|-------|
| 📋 Backlog | Connect to real backend API | High | Replace mock services |
| 📋 Backlog | File upload for paper PDFs | Medium | Angular file input + progress |
| 📋 Backlog | Email notification system | Medium | Paper status change alerts |
| 📋 Backlog | Advanced analytics dashboard | Low | Citation graphs, h-index trends |
| 📋 Backlog | Student module with submissions | Medium | Student-specific views |
| 📋 Backlog | Peer review workflow | High | Reviewer assignment & feedback |
| 📋 Backlog | Export to PDF/CSV | Low | Report generation |
| 📋 Backlog | Dark/Light theme toggle | Low | CSS variables based theming |
| 📋 Backlog | PWA support | Low | Service workers, offline mode |
| 📋 Backlog | E2E tests with Cypress | Medium | Integration test coverage |

---

## 🧪 Testing

```bash
# Run all unit tests
ng test

# Run tests with code coverage
ng test --code-coverage

# Run tests once (CI mode)
ng test --no-watch --browsers=ChromeHeadless
```

### Test Coverage Summary

| Module | Tests | Description |
|--------|-------|-------------|
| `AuthService` | 7 specs | Login, logout, roles, tokens, observables |
| `PaperService` | 10 specs | CRUD, pagination, filters, search, sorting |
| `FacultyService` | 7 specs | CRUD, search by name/department |
| `DashboardService` | 5 specs | Stats, monthly data, departments, recent papers |
| `LoginComponent` | 7 specs | Form validation, toggle, submit guard |
| `PaperSubmitComponent` | 8 specs | FormArrays, validation, limits |
| `TruncatePipe` | 3 specs | Truncation logic, custom trail |
| **Total** | **47 specs** | |

---

## 📊 JD Requirement Coverage

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **Angular Framework** | Angular 22 with modules, components, services, directives | ✅ |
| **TypeScript** | Strict mode, interfaces, enums, generics, type safety | ✅ |
| **CSS / HTML** | SCSS with CSS Grid, Flexbox, animations, glassmorphism | ✅ |
| **RxJS / Frontend Dev** | debounceTime, switchMap, BehaviorSubject, takeUntil | ✅ |
| **Team Collaboration** | Agile Kanban board, modular architecture, documentation | ✅ |
| **Performance Optimization** | Lazy loading, OnDestroy cleanup, debounced search | ✅ |
| **Debugging / Testing** | 47 Jasmine/Karma specs across services & components | ✅ |
| **Documentation** | Comprehensive README, JSDoc comments, clear structure | ✅ |

---

## 📜 License

This project is built for educational and demonstration purposes.

---

<p align="center">Built with ❤️ using Angular, TypeScript, and RxJS</p>
