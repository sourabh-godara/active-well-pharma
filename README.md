
# Pharma E-Commerce Application

A full-stack e-commerce application built with Next.js 14, Supabase, and Razorpay.

## Features

- **Storefront**: Browse products, view details, and add to cart.
- **Cart & Checkout**: Manage cart and securely checkout using Razorpay (Test Mode).
- **Authentication**: User accounts with Email/Password (Supabase Auth).
- **User Dashboard**: View order history with real-time status updates.
- **Admin Panel**: 
  - Dashboard with key metrics (Revenue, Orders, Products).
  - Product Management (Create, Delete, View).
  - Order Management (View, Update Status).
  - Inventory Logs (tracked automatically).
- **Inventory Management**: Auto-deduction of stock on order.
- **Real-time Updates**: Order status updates reflect instantly on user dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Razorpay
- **State Details**: React Context (Cart)

## Setup Instructions

1. **Clone the repository**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Copy `.env.local` example and fill in your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. **Database Setup**:
   - Run the SQL queries from `supabase/schema.sql` in your Supabase SQL Editor.
   - This will create tables, policies, and triggers.
   - **Important**: Create an admin user by signing up and then manually updating their role to 'admin' in the `profiles` table.
5. **Run the development server**:
   ```bash
   npm run dev
   ```

## Deployment

- Connect the repository to **Vercel**.
- Add the Environment Variables to Vercel Project Settings.
- Deploy!

## Admin Access

To access the admin panel:
1. Sign up a new user.
2. Go to Supabase Table Editor > `profiles`.
3. Change the `role` of your user from `user` to `admin`.
4. Log out and log back in (or just refresh) and visit `/admin`.

## Payment Testing

Use Razorpay Test Card credentials (e.g. any future expiry, random CVV, OTP 123456).
