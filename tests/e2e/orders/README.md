# E2E Order Flow Tests

End-to-end tests for the full user order journey: product selection → cart → checkout → order placement → orders page.

## Prerequisites

- **Backend** running (e.g. `http://localhost:4000`)
- **Frontend** running (Playwright `baseURL`, default `http://localhost:3000`)
- **Verified test user** in the database

## Environment

Set in shell or `.env` (see repo root / backend):

- `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` – for order-flow setup (default: `test@example.com` / `password123`)
- `E2E_ORDER_EMAIL` / `E2E_ORDER_PASSWORD` – for full-order-flow.spec.js (default: `Amirkaargar@hotmail.com` / `SS321mFl`)

Ensure these users exist and are verified so login and order creation succeed.

## Scope

- **full-order-flow.spec.js** – Single E2E: login → product selection → cart (with quantity add/remove) → checkout → order confirmation → dashboard orders. Uses `E2E_ORDER_EMAIL` / `E2E_ORDER_PASSWORD` (defaults: Amirkaargar@hotmail.com / SS321mFl).
- **order-flow.spec.js** – Authenticated flow (uses setup storage state): add to cart, update/remove/clear cart, checkout, place order, verify orders page.
- **checkout-protected.spec.js** – Unauthenticated access to `/checkout` redirects to `/login`.
- **edge-cases.spec.js** – No pending checkout data, empty cart state, API failure shows error toast.

## Run

From repo root:

```bash
npm run e2e -- tests/e2e/orders/
```

Full order flow (login + cart + checkout + orders) with default credentials:

```bash
npm run e2e:full-order
```

Or a single file:

```bash
npm run e2e -- tests/e2e/orders/order-flow.spec.js
npm run e2e -- tests/e2e/orders/full-order-flow.spec.js
```

## Selectors

Tests use `data-testid` only (no fragile CSS). Main IDs: `cart-page`, `cart-empty`, `cart-item`, `cart-checkout-button`, `checkout-page`, `checkout-submit`, `orders-list`, `order-item`, etc.
