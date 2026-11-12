# FinSight

FinSight is a personal finance dashboard and portfolio-style application built to demonstrate a premium fintech UI, interactive financial tracking, and a complete route-based frontend experience. It is designed as a frontend-first prototype with a polished dashboard and management pages for transactions, budgets, wallets, goals, analytics, and AI-style insights.

## Project Preview

![Dashboard Preview](#)

![Transactions Preview](#)

![Analytics Preview](#)

![AI Insights Preview](#)

## Project Status

This repository currently contains a working frontend experience and the supporting backend/ML foundations:

- Frontend: implemented and running as a Vite + React + TypeScript application
- Backend: Spring Boot foundation exists for future API integration
- ML service: Python Flask scaffold exists for future forecasting/AI features
- Data layer: the current app uses mock data and local state for UI demonstration and testing

> The project is best viewed as a polished frontend prototype and financial dashboard concept, not yet as a fully integrated production finance platform.

## What is Included

### Frontend dashboard and navigation
- Premium dashboard landing page with KPI cards, charts, and recent activity
- Sidebar-based navigation with route pages for:
  - Dashboard
  - Transactions
  - Wallet
  - Budgets
  - Goals
  - Analytics
  - AI Insights
  - Settings
- Responsive, modern fintech-inspired styling and layout

### Transactions management
- Search and filtering by type, category, and date
- Transaction add, edit, and delete flows
- Summary cards for total income and total expenses
- Custom premium controls for better visual consistency

### Financial planning pages
- Wallet page with account summaries and editing flows
- Budgets page with spend tracking and progress visualization
- Goals page with savings targets and progress metrics
- Analytics page with chart-driven financial insights
- AI Insights page with forecast-style recommendations
- Settings page with preferences and profile controls

### UI polish
- Custom dropdown/select components to replace browser-native controls
- Premium date filter experience for transaction queries
- Improved contrast and elevated styling consistent with a fintech dashboard aesthetic

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Recharts
- Lucide React

### Backend
- Java 17
- Spring Boot 3.3.6
- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- MySQL driver

### ML / AI Service
- Python
- Flask

## Repository Structure

```text
FinSight/
├── backend/                 # Spring Boot backend foundation
│   ├── pom.xml
│   └── src/
├── frontend/                # Main React application
│   ├── package.json
│   ├── public/
│   └── src/
├── ml-service/              # Python Flask service foundation
│   ├── app.py
│   └── requirements.txt
├── docs/                    # Project documentation and notes
├── .gitignore
├── README.md                # This file
└── ...
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Then open the local Vite URL shown in the terminal.

### Backend

```bash
cd backend
mvn spring-boot:run
```

### ML service

```bash
cd ml-service
python app.py
```

## Notes on Current Implementation

- The frontend is the most complete and verified part of the repository.
- Transaction, budget, wallet, goals, analytics, and settings flows are built using mock data and local state.
- No full end-to-end backend integration is currently implemented.
- The AI/forecasting flow is a UI mockup and should be treated as a prototype rather than a production ML system.
- Authentication, persistence, and database integration are planned future work.

## Roadmap

Planned next steps for the project include:

1. Connect the frontend to real backend APIs
2. Implement authentication and user sessions
3. Replace mock financial data with persistent storage
4. Integrate the ML service for real forecasting and recommendations
5. Add production-grade validation, testing, and deployment setup

## Summary

FinSight is a polished personal finance dashboard concept built for a modern fintech experience, with a strong emphasis on usability, visual design, and route-based financial management flows. It demonstrates a complete frontend UI shell while leaving the backend and ML layers as a clear next step for real-world product development.

## Author

Nikhil Panwar
GitHub: NikhilTheAi
