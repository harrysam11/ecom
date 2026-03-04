# 🚀 Multi-Tenant SaaS E-commerce Platform

A modern, high-performance, and feature-rich SaaS platform designed for rapid deployment and scalability. Built with **Next.js 16**, **Prisma**, **NextAuth.js**, and **Supabase**, this project empowers entrepreneurs to launch multiple e-commerce stores with independent identities under a single architectural roof.

---

## ✨ Features

- **🌐 Multi-Tenancy Logic**: Robust subdomain-based routing. Each store gets its own unique subdomain and identity.
- **🛡️ Secure Auth**: Multi-user authentication powered by **NextAuth.js** with **Google OAuth** and **Credentials** support.
- **🧩 Plugin & App System**: Modular architecture allowing store owners to enable/disable features like WhatsApp Chat, Enhanced Analytics, and AI Helpers.
- **🎨 Theme Customizer**: Visual editor with **AI Theme Builder** to customize brand colors, typography, and storefront content (hero banners, brand text).
- **📦 Advanced Inventory**: Support for complex product variants (size, color, material) with independent price and stock tracking.
- **👥 Staff Management**: Multi-user store access with granular roles (Owner, Editor, Staff).
- **💳 Platform Monetization**: Super Admin control over store subscription tiers (Free, Pro, Premium) via **Lemon Squeezy** & **Stripe**.
- **🤖 AI Integration**: Integrated AI helpers for generating product descriptions and brand themes (OpenAI/Google Gemini).
- **📊 Global Discovery**: A dedicated **Super Admin Panel (Port 3001)** for platform-wide analytics and store management.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js v5](https://authjs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Payments**: [Lemon Squeezy](https://www.lemonsqueezy.com/) & [Stripe](https://stripe.com/)
- **Media**: [Cloudinary](https://cloudinary.com/)
- **Monitoring**: [Sentry](https://sentry.io/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL Database
- Git

### 2. Installation
```bash
git clone https://github.com/your-username/ecom-saas.git
cd ecom-saas
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory ([.env.example](file:///c:/Users/User/Music/ecom/.env.example) provides a full template):
```env
# Database & Core
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"

# Authentication
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Integrations
LEMON_SQUEEZY_API_KEY="..."
STRIPE_SECRET_KEY="..."
CLOUDINARY_CLOUD_NAME="..."
RESEND_API_KEY="..."
OPENAI_API_KEY="..."
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 5. Running Locally
```bash
# Main App (Store & Store Admin)
npm run dev

# Super Admin Panel
cd admin-panel
npm run dev
```

---

## 🌍 Multi-Tenancy Setup (Local)
To test subdomains locally (e.g., `store1.localhost:3000`), modify your hosts file:

### Windows:
Add `127.0.0.1  store1.localhost` to `C:\Windows\System32\drivers\etc\hosts`.

### Mac/Linux:
Add `127.0.0.1  store1.localhost` to `/etc/hosts`.

---

## 📂 Project Structure

- `app/(storefront)`: Client-facing store routes.
- `app/(admin)`: Merchant management dashboard routes.
- `admin-panel/`: Specialized Super Admin dashboard for platform-wide control.
- `lib/admin-actions.ts`: Core server actions for store management and plugins.
- `prisma/`: Database schema shared across the ecosystem.

---

## 📜 License
This project is licensed under the MIT License.
