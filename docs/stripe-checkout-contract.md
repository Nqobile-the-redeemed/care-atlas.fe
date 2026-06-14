# Care Atlas Stripe Checkout Contract

This frontend is prepared for Stripe Checkout Session redirect flow. It does not contain Stripe secret keys, webhook secrets, private Stripe logic, or trusted pricing logic.

## Frontend environment variables

- `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL`: optional backend base URL. If omitted, the frontend calls same-origin paths such as `/api/commerce/checkout-sessions`.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: reserved for a future Stripe Elements or Payment Element implementation. The current Checkout Session redirect flow does not require it.

Only `NEXT_PUBLIC_*` values may be exposed to the browser.

## Backend-only secrets

The backend repository or hosting environment must own:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- Any private product, order, customer, invoice or fulfillment logic

Never send these values to the frontend.

## Product source of truth

The frontend product catalogue in `src/data/products.ts` is a display and selection layer. It includes placeholder `stripePriceId` and `stripeProductId` values so the backend contract can be wired without changing UI components.

The backend must treat the incoming `productSlug` as a lookup key and validate:

- The product exists
- The product is currently purchasable
- The trusted Stripe Price ID or amount matches the backend catalogue
- The billing type is allowed for Checkout Session creation
- Quote-based products are not charged until a confirmed proposal exists

Do not trust frontend price strings as payment authority.

## Create Checkout Session

`POST /api/commerce/checkout-sessions`

Request body:

```json
{
  "productSlug": "cqc-mini-mock-inspection",
  "quantity": 1,
  "successUrl": "https://careatlas.co.uk/checkout/success?product=cqc-mini-mock-inspection&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://careatlas.co.uk/checkout/cancelled?product=cqc-mini-mock-inspection",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.co.uk",
    "phone": "07123456789",
    "organisation": "Example Care Ltd"
  }
}
```

Expected response:

```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

Backend responsibilities:

- Look up the product by `productSlug`
- Reject missing, disabled or quote-based products
- Use trusted backend Stripe Price IDs or backend-managed line item pricing
- Create or attach a Stripe Customer where appropriate
- Set success and cancel URLs from an allow-listed origin
- Add metadata such as `productSlug`, `serviceSlug`, `customerEmail`, `organisation`, and `careAtlasOrderId`
- Persist an order record before or after Stripe session creation

## Quote Request Endpoint

`POST /api/commerce/quote-requests`

Request body:

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

Expected response:

```json
{
  "ok": true,
  "quoteRequestId": "qr_123"
}
```

The current UI routes quote-based services to the service enquiry form. This endpoint is prepared for a later direct quote form or CRM handoff.

## Webhooks

The backend should handle Stripe webhooks for:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.payment_failed`
- Subscription events if recurring products become live

Webhook handlers should update order status, trigger confirmation emails, notify Care Atlas, and start fulfillment workflows.

## Success and Cancel Routes

Frontend routes already exist:

- `/checkout/success`
- `/checkout/cancelled`
- `/checkout/failed`

These pages are display-only. They should not be treated as payment proof. The backend webhook and Stripe API status are the authority for fulfillment.
