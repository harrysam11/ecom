# 🚀 Multi-Tenant SaaS E-commerce Platform

A modern, high-performance, and feature-rich SaaS platform designed for rapid deployment and scalability. Built with **Next.js 16**, **Prisma**, and **Supabase**, this project empowers entrepreneurs to launch multiple e-commerce stores with independent identities under a single architectural roof.

---

## ✨ Features

- **🌐 Multi-Tenancy Logic**: Robust subdomain-based routing. Each store gets its own unique subdomain and identity.
- **🛡️ Integrated Auth**: Secure authentication powered by **Supabase Auth** with dedicated login flows for merchants and customers.
- **📊 Admin Dashboard**: A centralized control center for merchants to manage products, categories, orders, and store settings.
- **🛍️ Dynamic Storefront**: Beautiful, animations-driven storefronts that adapt to the merchant's brand.
- **💳 Subscription Tiers**: Built-in logic for specialized merchant plans:
  - **Free**: 1% transaction fee, limited products.
  - **Pro**: 0.5% transaction fee, unlimited products.
  - **Premium**: 0% transaction fee, premium support.
- **💰 Commission Engine**: Automated platform revenue tracking through transaction fees.
- **⚡ Performance Optimized**: Server-side rendering, optimized images, and specialized caching strategies.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- A Supabase Project (Database & Auth)
- Git

### 2. Installation
```bash
git clone https://github.com/your-username/ecom-saas.git
cd ecom-saas
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Auth Config
AUTH_SECRET="your-secret"
AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
npx prisma db push
node prisma/migration.js  # Optional: Seed initial data
```

### 5. Running Locally
```bash
npm run dev
```

---

## 🌍 Multi-Tenancy Setup (Local)
To test subdomains locally (e.g., `store1.localhost:3000`), you need to modify your hosts file:

### Windows:
Add `127.0.0.1  store1.localhost` to `C:\Windows\System32\drivers\etc\hosts` (Run Notepad as Admin).

### Mac/Linux:
Add `127.0.0.1  store1.localhost` to `/etc/hosts`.

Then, visit `http://store1.localhost:3000`.

---

## 📂 Project Structure

- `app/(storefront)`: Client-facing store routes.
- `app/(admin)`: Merchant management dashboard routes.
- `components/shared`: Reusable UI components.
- `lib`: Database actions, utilities, and core logic.
- `prisma`: Database schema and migrations.
- `utils`: Helper functions and Supabase clients.

## 📂 Project Stack

| Layer     | Tool                                   |
| --------- | -------------------------------------- |
| Hosting   | **Hostinger + Vercel**                 |
| Frontend  | **Next.js**                            |
| Backend   | **Supabase (Auth + DB)**               |
| Payments  | **Lemon Squeezy + Stripe**             |
| Emails    | **SendEmail / SendGrid**               |
| Auth      | **Google Auth + Supabase Auth**        |
| Analytics | Built-in dashboards + optional BI tool |

---

## 📜 License
This project is licensed under the MIT License.
