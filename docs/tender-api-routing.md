# Tender API Routing

This frontend consumes two distinct backend route families for tender-related features.

## Public tender board endpoints

These routes are intended for the public site and must remain unauthenticated:

- `GET /v1/public/tenders`
- `GET /v1/public/tenders/{tenderId}`
- `POST /v1/public/tenders/{tenderId}/bookings`
- `POST /v1/public/tenders/{tenderId}/service-enquiries`
- `GET /v1/public/booking-event-types`
- `GET /v1/public/bookings/availability`
- `POST /v1/public/bookings`

Frontend callers:

- [src/lib/api/tenders.ts](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/lib/api/tenders.ts)
- [src/lib/api/bookings.ts](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/lib/api/bookings.ts)

## Authenticated tender management endpoints

The Laravel business-development workspace uses authenticated tender routes under the protected tender prefix. These are not the same as the public board routes and should not be used by the public site.

Examples from the backend contract context supplied during debugging:

- `/v1/tenders/...`
- Middleware: `auth:sanctum`
- Package gate: `package.access:business_development`

## Local development configuration

For local frontend development, `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL` must target the Laravel API origin, not the Next.js frontend origin.

Expected local value:

```env
NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL=http://localhost:8000
```

Incorrect local value that causes a Next.js 404:

```env
NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL=http://localhost:3000
```

Why this fails:

- the frontend then requests `http://localhost:3000/v1/public/tenders`
- Next.js has no matching `/v1/public/*` route or rewrite
- the request is answered by Next.js with `404 text/html`, never reaching Laravel

## Validation checklist

1. Confirm the frontend env points to the Laravel API host.
2. Confirm Laravel is running locally on that host/port.
3. Confirm `GET /v1/public/tenders` returns JSON `200 OK`.
4. Confirm the public site renders tenders without the client falling back to a 404 error state.
