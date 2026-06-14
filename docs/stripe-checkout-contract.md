# Care Atlas Backend and Stripe Contract

This frontend is prepared for a backend-owned Stripe integration. The frontend never stores or uses the Stripe secret key or webhook signing secret.

## Frontend environment variables

- `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL`
  - Purpose: Optional backend base URL. If omitted, the frontend calls same-origin API routes such as `/api/checkout/create-session`.
  - Frontend access: Yes
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Purpose: Only needed if the frontend later moves from Stripe Checkout redirect flow to Stripe Elements or Payment Element.
  - Frontend access: Yes
  - Current status: Reserved for future use. The current hosted Checkout redirect flow does not need it.

Only `NEXT_PUBLIC_*` values may be exposed to the browser.

## Backend-only Stripe secrets

The backend repository or hosting environment must own:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Any trusted mapping between `productSlug`, Stripe Product IDs, Stripe Price IDs, recurring plans, invoice logic, refunds, fulfillment, and order status

Never place these values in the frontend repository, frontend environment variables, client components, browser code, or public runtime configuration.

## Product source of truth

The frontend product catalogue in `src/data/products.ts` is a display layer and route-selection layer. The backend must treat `productSlug` as the lookup key and validate:

- The product exists
- The product is still active and purchasable
- The trusted backend Stripe Price ID or backend-managed amount is correct
- The billing model is allowed for the requested flow
- Quote-based products are not charged until a confirmed proposal exists
- Recurring products use the correct recurring Stripe Price

Do not trust frontend price strings as payment authority.

## Required endpoint contract

The backend repository should expose the following endpoints.

### `POST /api/checkout/create-session`

- Purpose: Create a Stripe Checkout Session for one-off or recurring frontend-selected products.
- Request body:

```json
{
  "productSlug": "cqc-registration-support-package",
  "quantity": 1,
  "successUrl": "https://careatlas.co.uk/checkout/success?product=cqc-registration-support-package&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://careatlas.co.uk/checkout/cancelled?product=cqc-registration-support-package",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.co.uk",
    "phone": "07123456789",
    "organisation": "Example Care Ltd"
  }
}
```

- Response body:

```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_live_...",
  "sessionId": "cs_live_...",
  "orderId": "ord_123"
}
```

- Required authentication: Optional for public checkout. Recommended rate limiting, fraud checks, origin allow-listing and server-side validation.
- Needs Stripe secret key access: Yes
- Exposure: Frontend-facing
- Notes:
  - Allow only approved success and cancel origins.
  - Reject quote-based products, disabled products or mismatched pricing.
  - Create or update an order record before redirect or immediately after session creation.
  - Attach metadata such as `productSlug`, `serviceSlug`, `customerEmail`, `organisation`, and internal `orderId`.

### `POST /api/payments/create-payment-intent`

- Purpose: Reserved alternative to hosted Checkout for future card collection or deposit flows using Stripe Payment Intents.
- Request body:

```json
{
  "productSlug": "bank-staff-pool-setup",
  "amountType": "full",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.co.uk"
  },
  "metadata": {
    "serviceSlug": "bank-staff-agency-staffing"
  }
}
```

- Response body:

```json
{
  "paymentIntentId": "pi_123",
  "clientSecret": "pi_123_secret_abc",
  "orderId": "ord_124"
}
```

- Required authentication: Optional for public payment pages, but only after strict server-side validation.
- Needs Stripe secret key access: Yes
- Exposure: Frontend-facing
- Notes:
  - Not used by the current frontend implementation.
  - Useful if Care Atlas later supports deposits, custom split payments or Payment Element flows.

### `POST /api/orders`

- Purpose: Create or reserve an order record before payment, quote follow-up, fulfillment, or procurement review.
- Request body:

```json
{
  "productSlug": "cqc-registration-support-package",
  "serviceSlug": "cqc-ofsted-registration-support",
  "orderType": "checkout",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.co.uk",
    "phone": "07123456789",
    "organisation": "Example Care Ltd"
  },
  "notes": "New provider registration package for domiciliary care."
}
```

- Response body:

```json
{
  "orderId": "ord_123",
  "status": "pending_payment",
  "paymentStatus": "unpaid"
}
```

- Required authentication: Optional for public checkout-originated creation. Admin or dashboard creation should require authentication.
- Needs Stripe secret key access: No
- Exposure: Frontend-facing
- Notes:
  - Can be called directly or created internally by checkout/payment endpoints.
  - Must not trust frontend pricing without server-side product validation.

### `GET /api/orders/:id`

- Purpose: Return the current order and payment status for success pages, customer confirmation views or internal dashboards.
- Request body: None
- Response body:

```json
{
  "orderId": "ord_123",
  "status": "paid",
  "paymentStatus": "succeeded",
  "productSlug": "cqc-registration-support-package",
  "serviceSlug": "cqc-ofsted-registration-support",
  "amount": 225000,
  "currency": "gbp",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.co.uk"
  },
  "stripeSessionId": "cs_live_...",
  "createdAt": "2026-06-14T12:00:00.000Z"
}
```

- Required authentication: Recommended. If exposed to customers, use signed access or ownership checks.
- Needs Stripe secret key access: No, unless the endpoint live-verifies payment status with Stripe on read.
- Exposure: Frontend-facing
- Notes:
  - The current frontend success page is display-only. This endpoint is recommended for a future authenticated order summary.

### `POST /api/stripe/webhook`

- Purpose: Process Stripe webhook events and keep backend order/payment state authoritative.
- Request body: Raw Stripe webhook payload with Stripe signature header.
- Response body:

```json
{
  "received": true
}
```

- Required authentication: No user auth. Must validate Stripe signature using the webhook signing secret.
- Needs Stripe secret key access: Yes
- Exposure: Webhook-only
- Notes:
  - Handle `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, and `customer.subscription.deleted` if recurring services go live.
  - Update order status, send confirmations, trigger internal notifications and start fulfillment workflows.

### `POST /api/consultations/create-booking`

- Purpose: Create a consultation booking placeholder or confirmed appointment request for discovery calls and paid consultations.
- Request body:

```json
{
  "productSlug": "supported-living-housing-consultation",
  "serviceSlug": "supported-living-housing-benefit",
  "preferredDate": "2026-06-20",
  "preferredTimeWindow": "Morning",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.co.uk",
    "phone": "07123456789",
    "organisation": "Example Care Ltd"
  },
  "notes": "Need help with exempt accommodation and housing benefit preparation."
}
```

- Response body:

```json
{
  "bookingId": "bk_123",
  "status": "pending_confirmation",
  "message": "Consultation request received."
}
```

- Required authentication: Optional for public consultation booking forms.
- Needs Stripe secret key access: No, unless the booking route also verifies payment or invoice status.
- Exposure: Frontend-facing
- Notes:
  - Useful for free discovery calls or consultation scheduling after successful payment.

### `POST /api/quotes`

- Purpose: Capture quote requests for custom scopes, agency staffing, recruitment searches, training delivery, technology work or larger consultancy projects.
- Request body:

```json
{
  "productSlug": "permanent-care-staff-placement",
  "serviceSlug": "permanent-part-time-care-recruitment",
  "name": "Jane Smith",
  "email": "jane@example.co.uk",
  "phone": "07123456789",
  "organisation": "Example Care Ltd",
  "message": "We need two care coordinators and one registered manager candidate."
}
```

- Response body:

```json
{
  "ok": true,
  "quoteRequestId": "qr_123",
  "status": "received"
}
```

- Required authentication: Optional for public quote forms, with validation and rate limiting.
- Needs Stripe secret key access: No
- Exposure: Frontend-facing
- Notes:
  - The current service enquiry and careers forms are placeholder-ready. This endpoint is the clean future handoff point for CRM or backend workflows.

### `GET /api/products`

- Purpose: Return backend-trusted product data for frontend catalogue sync, admin tooling, checkout validation or future dynamic pricing.
- Request body: None
- Response body:

```json
{
  "items": [
    {
      "slug": "cqc-registration-support-package",
      "name": "CQC Registration Support Package",
      "serviceSlug": "cqc-ofsted-registration-support",
      "billingType": "one-off",
      "priceDisplay": "£2,250 + VAT",
      "isPurchasable": true
    }
  ]
}
```

- Required authentication: Optional for public catalogue reads. Admin-only fields should be hidden unless authenticated.
- Needs Stripe secret key access: No
- Exposure: Frontend-facing
- Notes:
  - Safe public responses should omit sensitive internal margin, commission or fulfillment fields.

### `GET /api/products/:slug`

- Purpose: Return trusted product detail for product pages, checkout preflight or internal sync.
- Request body: None
- Response body:

```json
{
  "slug": "cqc-registration-support-package",
  "name": "CQC Registration Support Package",
  "serviceSlug": "cqc-ofsted-registration-support",
  "billingType": "one-off",
  "priceDisplay": "£2,250 + VAT",
  "isPurchasable": true,
  "requiresConsultation": true,
  "features": ["Document support", "Governance planning", "Registered manager preparation"]
}
```

- Required authentication: Optional for public product detail.
- Needs Stripe secret key access: No
- Exposure: Frontend-facing

### `GET /api/services`

- Purpose: Return service directory data from the backend if the site later moves away from static frontend data.
- Request body: None
- Response body:

```json
{
  "items": [
    {
      "slug": "cqc-inspection-support",
      "title": "CQC Inspection Support for Care Providers",
      "category": "Regulatory and compliance",
      "href": "/services/cqc-inspection-support"
    }
  ]
}
```

- Required authentication: No
- Needs Stripe secret key access: No
- Exposure: Frontend-facing

### `GET /api/services/:slug`

- Purpose: Return service detail content from the backend for future CMS-backed pages or synced content.
- Request body: None
- Response body:

```json
{
  "slug": "cqc-inspection-support",
  "title": "CQC Inspection Support for Care Providers",
  "summary": "CQC inspection preparation, mock inspection support, evidence mapping and governance review.",
  "relatedProductSlugs": ["cqc-inspection-readiness-call", "cqc-mini-mock-inspection"]
}
```

- Required authentication: No
- Needs Stripe secret key access: No
- Exposure: Frontend-facing

## Current frontend usage

The current frontend directly calls:

- `POST /api/checkout/create-session`
- `POST /api/quotes`

The current frontend does not yet call:

- `POST /api/payments/create-payment-intent`
- `POST /api/orders`
- `GET /api/orders/:id`
- `POST /api/stripe/webhook`
- `POST /api/consultations/create-booking`
- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/services`
- `GET /api/services/:slug`

Those endpoints are still documented now because they are part of the required backend repository contract.

## Live Stripe mapping currently reflected in frontend data

The frontend now includes one live Stripe-hosted product mapping:

- Product name: `New Provider Registration Package - Domiciliary Care`
- Frontend product slug: `cqc-registration-support-package`
- Stripe product ID: `prod_Uhlyvv3MgpBOq1`
- Stripe price ID: `price_1TiMQuQUNGqCD6aRw9aqVPFy`

The integrated Stripe account also contains:

- Product name: `Free Discovery Call`
- Stripe product ID: `prod_UhkmrlC1KgNpCT`
- Stripe price ID: `price_1TiLHNQUNGqCD6aRdtFKMp4T`

The frontend does not yet route a free discovery call through hosted checkout. That can be added later through booking or zero-value scheduling logic if desired.

## Success, cancel and failed routes

Frontend routes already exist:

- `/checkout/success`
- `/checkout/cancelled`
- `/checkout/failed`

These pages are display-only. They should never be treated as proof of payment. The backend order record, Stripe API status and verified webhook events are the authority for payment confirmation and fulfillment.
