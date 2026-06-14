# Stripe Setup Note for Real Payments

To enable real payments and production-ready booking or checkout flows, please provide or confirm the following.

## Required from you

- Stripe publishable key
  - Only needed if the frontend later uses Stripe Elements or Payment Element.
  - Not needed for the current hosted Checkout redirect flow.
- Backend Stripe secret key
  - Backend only.
  - Never place this in the frontend repo or browser code.
- Stripe webhook signing secret
  - Backend only.
  - Required for `POST /api/stripe/webhook`.
- Stripe product IDs and price IDs
  - Needed if the backend validates frontend `productSlug` values against Stripe-hosted products and prices.
  - One live package is already mapped in frontend display data, but the backend should remain the source of truth.
- Business name and payment descriptor
  - Needed for checkout appearance, receipts and statement clarity.
- Currency
  - Current frontend catalogue is written in GBP.
- VAT or tax handling decision
  - Decide whether prices are VAT-inclusive, VAT-exclusive, outside scope, or handled in another way.
- Refund policy
  - Needed for payment terms, customer support handling and service agreement wording.
- Terms and conditions URL
  - Should be final production URL.
- Privacy policy URL
  - Should be final production URL.
- Success URL and cancel URL
  - The frontend already supports `/checkout/success` and `/checkout/cancelled`, but the final production domain must be confirmed and allow-listed in the backend.
- Backend API base URL
  - Used for `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL` if the frontend and backend are deployed separately.
- Payment model by service type
  - Confirm whether each service is paid upfront, deposit-based, recurring, milestone-based or quote-based.

## Stripe dashboard setup still needed

- Create or confirm live-mode products and prices for each purchasable service
- Confirm recurring prices for retainers and subscriptions
- Set webhook endpoint(s) for backend environments
- Configure customer emails, branding and business details
- Confirm statement descriptor and support contact details
- Decide whether Stripe Tax or manual VAT handling is required
- Configure refund, dispute and receipt preferences

## Backend-only reminder

- `STRIPE_SECRET_KEY` must only be stored and used in the backend.
- `STRIPE_WEBHOOK_SECRET` must only be stored and used in the backend.
- The frontend must never contain the Stripe secret key, webhook secret, or any trusted pricing authority.
