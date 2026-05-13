# EKG Logistics and transport — React Site

A classy, responsive React site scaffolded with Vite and Framer Motion animations.

Prerequisites

- Node 18+ recommended

Install

```bash
npm install
```

Run dev server

```bash
npm run dev
```

Frontend API connection

The frontend uses `/api/*` endpoints and in local dev Vite proxies them to `http://localhost:4000`.

To point the frontend to another backend URL, create `.env` from `.env.example` and set:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

Build

```bash
npm run build
```

Preview

```bash
npm run preview
```

What's included

- `src/components` — Navbar, Hero, Products, ProductCard, Footer
- `src/styles.css` — responsive styles
- Framer Motion for animations

Next steps

- Replace placeholder images with high-res car photography (or run `npm run download-images` to store local copies in `src/assets`).
- Add analytics and SEO metadata (basic meta tags and web manifest already added).
- Implement CMS or API-driven product data
- Configure Netlify or Vercel for deployment (Netlify config included)

Local server (optional)

For demo server-side order persistence and invoice generation, a small Express server is included in `/server`.

Run it separately from the frontend:

```bash
cd server
npm install
npm start
```

The server listens on port 4000 by default and exposes:
- `POST /api/orders` — persist an order and return it
- `GET /api/orders` — list persisted orders
- `GET /api/invoice/:id` — returns a PDF invoice for the given order id
 - `POST /api/invoice/:id/email` — send invoice PDF by email to the customer's email (requires SMTP credentials)
- `GET /api/models` — list car models used by site and admin
- `POST /api/models` — add a car model
- `PUT /api/models/:id` — update a car model
- `DELETE /api/models/:id` — remove a car model
- `POST /api/upload` — upload an image file (`multipart/form-data`, field name: `image`)

Admin dashboard (Next.js + Tailwind)

An admin app is available in `/admin-dashboard` and is linked from the main site at `/admin`.

Run admin + backend in separate terminals from project root:

```bash
npm run server
npm run admin
```

Open:
- Admin app: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/orders`

Set admin login credentials in `admin-dashboard/.env.local`:

```env
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASSWORD=change-this-password
```

Build admin app:

```bash
npm run admin:build
```

Email configuration

To enable emailing invoices set the following environment variables before starting the server:

```bash
export SMTP_HOST=smtp.example.com
export SMTP_PORT=587
export SMTP_USER=your-smtp-user
export SMTP_PASS=your-smtp-pass
export FROM_EMAIL="EKG Logistics and transport <no-reply@yourdomain.com>"
```

For development you can use Mailtrap (https://mailtrap.io) or another SMTP testing service. If the SMTP vars are not set the endpoint will return a 501 and the frontend will show "Email service unavailable" when attempting to email.

SMS configuration (Paystack gateway)

To send an SMS to the admin whenever a new order is created (`POST /api/orders`), set these environment variables before starting the server:

```bash
export PAYSTACK_SECRET_KEY=sk_test_xxx
export PAYSTACK_SMS_URL=https://your-paystack-sms-endpoint
export ADMIN_SMS_NUMBER=+233XXXXXXXXX
export PAYSTACK_SMS_SENDER="EKG Logistics"
```

Notes:
- `PAYSTACK_SMS_URL` should be the exact SMS endpoint provided by your Paystack integration.
- If SMS vars are missing, order creation still succeeds and the server logs that SMS was skipped.
- If the gateway responds with an error, order creation still succeeds and the server logs the SMS error.

Arkesel SMS provider

If you prefer Arkesel as the SMS provider set `SMS_PROVIDER=arkesel` and add these variables before starting the server:

```bash
export SMS_PROVIDER=arkesel
export ARKESEL_API_KEY=your_arkesel_api_key
export ARKESEL_SMS_URL=https://api.arkesel.com/api/sms/send  # optional, defaults to Arkesel public endpoint
export ARKESEL_SENDER="EKG"
export ADMIN_SMS_NUMBER=+233XXXXXXXXX
```

The server will attempt to POST a JSON payload to the Arkesel URL. If the SMS vars are not set the server will skip SMS sending and still persist orders.

The frontend will try to post orders to `/api/orders` when available; it still keeps a localStorage fallback for demos.

CI

- GitHub Actions workflow at `.github/workflows/nodejs.yml` will build on push to `main`.

Accessibility & Performance

- Skip link and focus-visible styles added.
- Images set to `loading`/`decoding` attributes; consider running `npm run download-images` and optimizing with `sharp` for production.
