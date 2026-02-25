# API Endpoints Reference

This document lists all the endpoints that the frontend is currently calling. Please verify these match your NestJS backend routes, or provide the correct endpoints.

## Base URL
Current: `http://localhost:3000`

## Authentication Endpoints
- `POST /auth/login` - Login with email/password, returns `{ accessToken, user }`
- `GET /auth/me` - Get current authenticated user

## Shifts Endpoints
- `GET /shifts` - Get all shifts (with optional params: startDate, endDate, locationId)
- `GET /shifts/:id` - Get single shift details
- `POST /shifts` - Create new shift
- `PUT /shifts/:id` - Update shift
- `POST /shifts/:id/publish` - Publish shift
- `POST /shifts/:id/unpublish` - Unpublish shift
- `POST /shifts/:id/cancel` - Cancel shift
- `POST /shifts/:id/assign` - Assign staff to shift (body: { staffId })
- `POST /shifts/:id/unassign` - Unassign staff from shift (body: { staffId })
- `GET /shifts/:id/history` - Get shift history/audit
- `GET /shifts/:id/available-staff` - Get available staff for assignment

## Staff Endpoints
- `GET /staff` - Get all staff
- `GET /staff/:id` - Get single staff member
- `GET /staff/:id/details` - Get staff with detailed info
- `PUT /staff/:id` - Update staff
- `GET /staff/:id/availability` - Get staff availability
- `POST /staff/:id/availability` - Set staff availability
- `GET /staff/:id/schedule` - Get staff schedule
- `GET /staff/:id/hours` - Get staff hours (with param: weekStart)
- `GET /staff/qualified/:skillId` - Get qualified staff for skill
- `GET /staff/:staffId/swaps` - Get staff member's swap requests

## Swap Requests Endpoints
- `GET /swaps` - Get all swap requests
- `GET /swaps/:id` - Get swap request by ID
- `POST /swaps` - Create swap request
- `POST /swaps/:id/approve` - Approve swap request
- `POST /swaps/:id/reject` - Reject swap request (body: { reason })
- `POST /swaps/:id/cancel` - Cancel swap request
- `GET /swaps/pending` - Get pending swaps
- `GET /swaps/type/:type` - Get swaps by type

## Notifications Endpoints
- `GET /notifications` - Get all notifications
- `GET /notifications/unread` - Get unread notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `POST /notifications/mark-all-read` - Mark all notifications as read
- `DELETE /notifications/:id` - Delete notification
- `GET /notifications/unread/count` - Get unread count

## Audit Log Endpoints
- `GET /audit` - Get audit log (with optional params: startDate, endDate, action)
- `GET /audit/:id` - Get single audit entry
- `GET /audit/:resourceType/:resourceId` - Get audit for specific resource

## Instructions
1. Copy this list
2. Compare with your actual NestJS backend endpoints
3. If there are differences, provide the corrections in the format:
   - Current: `POST /shifts/:id/assign`
   - Your endpoint: `PATCH /shifts/:id/assign-staff` (or whatever it actually is)
4. I will update all services to match your backend
