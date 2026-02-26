# ShiftSync - Staff Scheduling Management App

A modern, full-featured staff scheduling web application built with React, Vite, and JavaScript. Designed for restaurant groups like Coastal Eats to manage shifts, staff assignments, and swap requests across multiple locations.

## Features

### For Managers & Admins
- **Schedule Management**
  - Create, publish, and manage shifts
  - Weekly calendar view with drag-and-drop (optional)
  - Location-based filtering
  - Premium shift marking
  - Shift history and audit trail

- **Staff Management**
  - View all staff members with skills and availability
  - Track weekly hours and assignments
  - Monitor staff status and locations

- **Swap Requests**
  - Review and approve/reject swap requests
  - Drop request management
  - Rejection reason tracking
  - Status filtering (pending, approved, rejected)

- **Audit Logging** (Admin only)
  - Complete audit trail of all system changes
  - Date range filtering
  - Action-type filtering
  - Detailed change history with JSON diffs

- **Notifications**
  - Real-time notifications about schedule changes
  - Unread count badge
  - Mark as read functionality

### For Staff Members
- **My Schedule**
  - View assigned shifts
  - Quick swap and drop options
  - Shift details and location information

- **My Availability**
  - Set weekly availability grid
  - Hour-by-hour availability marking
  - Edit and save availability preferences

- **My Swaps**
  - Create swap requests with colleagues
  - Submit drop requests with reasons
  - Track request status
  - View approval/rejection reasons
  - Cancel pending requests

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Language**: JavaScript (ES6+)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Styling**: Tailwind CSS 3.4.0

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication pages
│   ├── layout/            # Main layout components (Header, Sidebar)
│   ├── common/            # Shared UI components (Toast, Modal, etc)
│   ├── manager-dashboard/ # Manager-specific views
│   └── staff-dashboard/   # Staff-specific views
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── utils/                 # Utility functions
├── App.jsx               # Main app component with routing
├── main.jsx              # React entry point
└── index.css             # Global styles
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shiftsync
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment:
Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
# or
pnpm dev
```

5. Build for production:
```bash
npm run build
# or
pnpm build
```