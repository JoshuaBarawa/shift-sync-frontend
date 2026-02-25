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

## API Integration

The app connects to a NestJS REST API at `http://localhost:3000/api`. Key endpoints:

### Authentication
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user info

### Shifts
- `GET /shifts` - List shifts
- `POST /shifts` - Create shift
- `PUT /shifts/:id` - Update shift
- `POST /shifts/:id/publish` - Publish shift
- `POST /shifts/:id/assign` - Assign staff
- `POST /shifts/:id/unassign` - Unassign staff

### Staff
- `GET /staff` - List all staff
- `GET /staff/:id` - Get staff details
- `POST /staff/:id/availability` - Set availability
- `GET /staff/:id/schedule` - Get staff schedule

### Swaps
- `POST /swaps` - Create swap request
- `POST /swaps/:id/approve` - Approve swap
- `POST /swaps/:id/reject` - Reject swap
- `POST /swaps/:id/cancel` - Cancel swap

### Notifications
- `GET /notifications` - List notifications
- `PUT /notifications/:id/read` - Mark as read

### Audit Log
- `GET /audit` - Get audit log entries

## Authentication Flow

1. User logs in with email/password on `/login`
2. API returns access token and user object
3. Token stored in localStorage
4. All subsequent requests include `Authorization: Bearer <token>` header
5. 401 responses redirect to login page
6. Role-based redirects: managers → `/dashboard`, staff → `/my-schedule`

## Key Features & Implementations

### Create Functionality
- **Create Shift**: Form validation, datetime handling, headcount limits
- **Create Swap Request**: Type selection (swap/drop), reason validation
- **Set Availability**: Grid-based UI with hour-by-hour selection

### Edit Functionality
- **Edit Availability**: Toggle availability grid, save changes
- **Edit Shift**: Update shift details (admin/manager only)

### Approve/Reject Functionality
- **Approve Shifts**: Publish shifts when all positions filled
- **Approve Swaps**: Manager approval with status tracking
- **Reject Swaps**: Optional rejection reason, staff notification
- **Cancel Shifts**: With staff notifications

### Accept/Claim Functionality
- Drop/Accept Shifts: Staff can drop assigned shifts
- Self-Select Swaps: Request swaps with specific colleagues

### Search & Filter
- Location-based shift filtering
- Date range filtering for audit logs
- Action-type filtering for audit logs
- Status-based swap filtering

## Styling & Design

- **Color Scheme**: 
  - Primary: #1e2a4a (Deep Navy)
  - Accent: #f59e0b (Warm Amber)
  - Background: #f8fafc (Light Grey)
- **Font**: Inter (via Google Fonts)
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Status Colors**: Draft (grey), Published (green), Cancelled (red), Premium (amber)

## Error Handling

- API error responses display toast notifications
- Validation errors highlighted in forms
- Network errors caught and displayed to user
- 401 responses trigger re-authentication

## Performance Optimizations

- React Query for automatic caching and synchronization
- Lazy loading of components via React Router
- Debounced search/filter operations
- Optimized re-renders with proper dependency arrays

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Testing

Currently no automated tests. For future implementation:
- Unit tests for services and utilities (Jest)
- Component tests (React Testing Library)
- Integration tests for key workflows

## Troubleshooting

### API Connection Issues
1. Verify backend is running on `http://localhost:3000`
2. Check CORS configuration in backend
3. Verify token is valid in localStorage

### 401 Unauthorized Errors
1. Clear localStorage and re-login
2. Check token expiration time
3. Verify backend auth implementation

### Build Issues
1. Clear `node_modules` and reinstall
2. Check Node.js version compatibility
3. Verify all dependencies installed

## Future Enhancements

- Real-time updates with WebSocket
- Advanced shift swapping with AI optimization
- Mobile app (React Native)
- Analytics dashboard
- Integration with calendar apps
- Email notifications
- Shift templates and recurring schedules
- Bulk operations (upload shifts, staff)

## Contributing

1. Create feature branch
2. Make changes with clear commits
3. Test functionality
4. Submit pull request

## License

Proprietary - Coastal Eats Inc.

## Support

For issues or questions, contact: support@coastaleats.com
