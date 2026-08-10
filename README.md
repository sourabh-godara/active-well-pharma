# ActiveWell Pharma

> A modern, production-ready nutraceutical e-commerce platform built for ActiveWell Pharma Private Limited.

ActiveWell Pharma is a full-stack e-commerce application designed to provide customers with a fast, secure, and seamless way to discover and purchase nutraceutical and wellness products online.

The platform combines a modern Next.js storefront with Supabase-powered data, authentication and storage, Razorpay payments, and a dedicated administration system for managing products, inventory, orders, promotions, reviews, and customers.

---

## ✨ Features

### 🛍️ Storefront

- Modern responsive e-commerce storefront
- Product discovery and browsing
- Product detail pages
- Product galleries
- Product benefits and ingredients
- Featured products
- Best-selling products
- Product reviews and ratings
- Promotional banners and offers
- Responsive navigation
- Mobile-optimized experience

### 🛒 Shopping Cart

- Add products to cart
- Update product quantities
- Remove products
- Persistent cart using browser storage
- Stock-aware cart interactions
- Cart summary
- Seamless checkout flow

### 💳 Checkout & Payments

- Secure checkout experience
- Razorpay payment integration
- Razorpay order creation
- Payment verification
- Order creation after successful payment
- Support for discounted orders
- Coupon application
- ₹0 order handling without unnecessary payment processing

> **Important:** Product prices, stock, discounts, and order totals must be validated server-side before an order is finalized. Client-side cart data is never treated as authoritative.

### 👤 Authentication

- Supabase Authentication
- Email/password authentication
- Protected customer routes
- Persistent sessions
- User profiles
- Account management
- Address management
- Role-based access control

### 📦 Orders

Customers can:

- View order history
- View order details
- Track order status
- View purchased products
- Manage delivery addresses

Supported order statuses include:

- Pending
- Confirmed
- Shipped
- Delivered
- Cancelled

### 🧑‍💼 Admin Dashboard

The admin system provides management tools for:

- Products
- Product images
- Product benefits
- Orders
- Inventory
- Reviews
- Review replies
- Coupons
- Promotions
- Banners
- Customer accounts
- Addresses
- Store analytics

### 📊 Inventory

- Stock quantity management
- Automatic inventory deduction during orders
- Inventory logs
- Manual inventory adjustments
- Restocking support
- Product availability tracking

### ⭐ Reviews

- Customer product reviews
- 1–5 star ratings
- Review comments
- Admin replies
- Review management

### 🎟️ Coupons & Promotions

- Percentage discounts
- Fixed discounts
- Minimum order requirements
- Maximum discount limits
- Usage limits
- Per-user usage limits
- Start/end dates
- Promotional campaigns
- Homepage promotional content

### 🖼️ Product Media

Product images are stored using Supabase Storage.

The intended upload flow is:

```text
Admin Browser
      │
      ▼
Supabase Storage
      │
      ▼
Image URL
      │
      ▼
Product Database Record
```

Large image files should not be sent through Server Actions unnecessarily.

---

# 🏗️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework |
| React 19 | UI |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui | UI components |
| Supabase | Backend platform |
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | Product media |
| Razorpay | Payments |
| React Hook Form | Form management |
| Zod | Validation |
| Lucide React | Icons |
| Recharts | Admin analytics |
| Sonner | Notifications |
| Vercel | Deployment |

---

# 📁 Project Structure

```text
active-well-pharma/
│
├── app/
│   ├── (policies)/
│   ├── about/
│   ├── actions/
│   ├── admin/
│   ├── api/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── contact-us/
│   ├── context/
│   ├── orders/
│   ├── product/
│   ├── profile/
│   ├── shop/
│   ├── debug/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── admin/
│   ├── error-boundaries/
│   ├── product/
│   ├── reviews/
│   ├── ui/
│   │
│   ├── add-to-cart-button.tsx
│   ├── best-sellers.tsx
│   ├── product-card.tsx
│   ├── hero.tsx
│   ├── navbar.tsx
│   └── ...
│
├── hooks/
│
├── lib/
│   ├── actions/
│   ├── auth/
│   ├── data/
│   ├── errors/
│   ├── supabase/
│   ├── validations/
│   │
│   ├── env.ts
│   ├── logger.ts
│   ├── rate-limit.ts
│   ├── razorpay.ts
│   └── utils.ts
│
├── supabase/
│   └── ...
│
├── db/
│
├── types/
│
├── public/
│
├── middleware.ts
├── next.config.ts
├── tsconfig.json
├── components.json
├── eslint.config.mjs
└── package.json
```

The application uses the Next.js App Router and separates major application concerns across `app`, reusable components, hooks, libraries, database utilities, Supabase integration, and shared types.

---

# 🧱 Architecture

The application follows a server-first Next.js architecture.

The general data flow is:

```text
Next.js UI
    │
    ▼
Server Components / Server Actions / API Routes
    │
    ▼
Application Logic
    │
    ├── Validation
    ├── Authorization
    ├── Rate Limiting
    └── Error Handling
    │
    ▼
Supabase
    │
    ├── PostgreSQL
    ├── Auth
    └── Storage
```

Client Components are used only where browser-side interactivity is required, such as:

- Cart state
- Interactive forms
- Product interactions
- Checkout interactions
- UI state
- Admin controls requiring client-side behavior

---

# ⚡ Performance Strategy

The project is designed around Next.js server rendering and caching capabilities.

Public-facing pages should remain as static as possible.

### Prefer Static Rendering

Suitable pages include:

- Homepage
- Product pages
- About
- Contact
- Policies
- Public marketing sections

### Dynamic Rendering

User-specific pages should remain dynamic:

- Cart
- Checkout
- Orders
- Profile
- Admin dashboard

### Caching

Where appropriate, use:

- React `cache()`
- Next.js caching
- `unstable_cache()`
- Cache tags
- `revalidateTag()`
- `generateStaticParams()`

The objective is to minimize unnecessary Supabase requests while keeping product and promotional content fresh.

---

# 🔎 SEO

SEO is a first-class concern of the application.

Public pages should use:

- Semantic HTML
- Server rendering
- Static generation where appropriate
- `generateMetadata()`
- Canonical URLs
- Open Graph metadata
- Twitter metadata
- Product structured data
- Descriptive image alt text
- SEO-friendly URLs

Product pages should expose useful product information in server-rendered HTML wherever possible.

---

# 🔐 Security

Security is enforced across multiple layers.

### Authentication

Supabase Auth manages user authentication and sessions.

### Authorization

Administrative functionality requires appropriate user roles.

The `profiles` table contains role information such as:

```text
user
admin
```

### Database Security

Supabase Row Level Security should be enabled for sensitive tables.

### Storage Security

Product images may be publicly readable, but write operations should be restricted to authorized administrators.

Recommended model:

```text
SELECT  → Public
INSERT  → Admin
UPDATE  → Admin
DELETE  → Admin
```

### Server-Side Validation

Client-side validation is only a UX feature.

Sensitive operations must validate input and authorization on the server.

---

# 🗄️ Database

The application uses Supabase PostgreSQL.

Core entities include:

```text
profiles
products
orders
order_items
inventory_logs
cart_items
banners
promotions
user_promotions
reviews
review_replies
product_images
product_benefits
coupons
coupon_usages
addresses
```

### Product Lifecycle

Products should generally be **deactivated/archived** instead of physically deleted once they have participated in an order.

This preserves historical order data.

For example:

```text
products.is_active = false
```

rather than deleting the product record.

### Order History

Historical orders must remain intact.

`order_items` should therefore not cascade-delete historical order information when a product is removed from the active catalog.

---

# 🛒 Cart Architecture

The cart is currently managed client-side using React Context.

```text
Product
   │
   ▼
AddToCartButton
   │
   ▼
CartContext
   │
   ├── React State
   │
   └── localStorage
```

This avoids unnecessary database requests for every cart interaction.

However, client-side cart values must never be trusted for final checkout calculations.

At checkout/order creation, the server should verify:

- Product existence
- Product availability
- Current price
- Stock quantity
- Coupon validity
- Discount limits
- Final order amount

---

# 💰 Payment Architecture

Razorpay is used for payment processing.

General flow:

```text
Customer
   │
   ▼
Checkout
   │
   ▼
Server validates cart
   │
   ▼
Create Razorpay Order
   │
   ▼
Razorpay Checkout
   │
   ▼
Payment
   │
   ▼
Server verifies payment
   │
   ▼
Create/confirm application order
   │
   ▼
Update inventory
```

Never trust payment success information supplied only by the browser.

Payment verification must happen server-side.

---

# 🧑‍💼 Admin Architecture

The admin dashboard is protected through authentication and role-based authorization.

Admin functionality includes:

```text
Dashboard
├── Analytics
├── Products
├── Product Images
├── Product Benefits
├── Orders
├── Inventory
├── Reviews
├── Coupons
├── Promotions
├── Banners
└── Customers
```

Administrative mutations should:

1. Authenticate the user.
2. Verify the admin role.
3. Validate the input.
4. Perform the mutation.
5. Handle errors.
6. Revalidate affected cached data.

---

# 🖼️ Image Management

Product images are managed through Supabase Storage.

For large files, avoid sending image binaries through Server Actions.

Preferred approach:

```text
Browser
   │
   │ Image upload
   ▼
Supabase Storage
   │
   │ Public URL
   ▼
Server Action
   │
   ▼
PostgreSQL
```

This prevents large image payloads from unnecessarily passing through the application server.

---

# 🧪 Development

## Prerequisites

- Node.js 20+
- npm
- Supabase project
- Razorpay account

---

## Installation

Clone the repository:

```bash
git clone https://github.com/sourabh-godara/active-well-pharma.git

cd active-well-pharma
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Environment Variables

Create:

```text
.env.local
```

Required variables include:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Security

Never expose:

```env
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_KEY_SECRET
```

to the browser.

Never commit `.env.local` or production secrets to Git.

---

# 🗃️ Supabase Setup

1. Create a Supabase project.
2. Configure Supabase Authentication.
3. Create the PostgreSQL schema.
4. Configure Row Level Security policies.
5. Configure Storage buckets and policies.
6. Configure the `profiles` table and admin role.
7. Add the required environment variables.

---

# 👑 Creating an Admin

Create a user through the normal authentication flow.

Then assign the administrator role through the database.

Example:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'USER_UUID';
```

After changing the role, sign in again and access:

```text
/admin
```

Never expose service-role credentials to the client to perform admin operations.

---

# ▶️ Running Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

# 🚀 Deployment

The application is designed for deployment on Vercel.

Deployment flow:

```text
GitHub
   │
   ▼
Vercel
   │
   ├── Next.js
   └── Environment Variables
            │
            ▼
        Supabase
            │
            ├── PostgreSQL
            ├── Auth
            └── Storage

        Razorpay
```

Add all required environment variables through:

```text
Vercel
→ Project
→ Settings
→ Environment Variables
```

---

# 🧰 Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

---

# 🧭 Engineering Principles

This project follows these principles:

### Server First

Prefer Server Components and server-side operations whenever client-side JavaScript is unnecessary.

### Type Safety

Use strict TypeScript and validated inputs.

### Security First

Never trust client input for:

- prices
- stock
- discounts
- roles
- payments
- permissions

### Reusability

Prefer reusable components and shared business logic over duplicated implementations.

### Performance

Minimize:

- unnecessary client JavaScript
- database requests
- duplicate queries
- large payloads
- unnecessary re-renders

### Data Integrity

Historical order and payment data must remain consistent.

### Accessibility

Interactive elements should use appropriate semantic HTML, keyboard support, accessible labels, and meaningful states.

---

# 📈 Future Architecture Goals

The project is being evolved toward a highly optimized production architecture.

Planned/ongoing improvements include:

- Static generation for public pages
- ISR for product/catalog content
- Centralized cached data access
- Targeted cache invalidation
- Better repository/service separation
- Improved product SEO
- Structured product metadata
- Optimized image delivery
- Improved Core Web Vitals
- Stronger automated testing
- More comprehensive monitoring and logging
- Improved admin analytics
- Production Razorpay hardening
- Comprehensive security audit

---

# ⚠️ Important Development Notes

### Do not delete ordered products blindly

A product referenced by `order_items` should not be physically deleted.

Archive/deactivate it instead.

### Do not trust the client cart

The server must recalculate the final order.

### Do not expose secrets

Service-role keys and payment secrets must remain server-only.

### Do not duplicate cart logic

Use the shared cart functionality rather than creating separate cart implementations for different pages.

### Avoid unnecessary database calls

Public content should use appropriate caching/static rendering where possible.

---

# 🌐 Website

**ActiveWell Pharma**

https://www.activewellpharma.com

---

# 📄 License

This project is proprietary software developed for ActiveWell Pharma Private Limited.

Unauthorized reproduction, redistribution, or commercial use is not permitted without permission from the copyright holder.

---

## Built With

**Next.js · React · TypeScript · Supabase · PostgreSQL · Razorpay · Tailwind CSS · shadcn/ui**