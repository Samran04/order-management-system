# 🏭 Uniform Studio 81 - Next.js Order Management System

<div align="center">

**Professional Order Management System for Uniform Manufacturing**

Built with Next.js 14, TypeScript, PostgreSQL, and Prisma

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development Guide](#development-guide)

---

## 🎯 Overview

Uniform Studio 81 is a comprehensive order management system designed specifically for uniform manufacturing operations. It streamlines the entire workflow from sales order creation to production tracking and quality delivery management.

### What's Included

✅ **Complete Backend** - REST API with authentication and database  
✅ **Secure Authentication** - JWT tokens with bcrypt password hashing  
✅ **PostgreSQL Database** - Structured data with Prisma ORM  
✅ **TypeScript** - Full type safety across frontend and backend  
✅ **Modular Architecture** - Clean, organized, and well-commented code  
✅ **Production Ready** - Environment configuration and deployment guides  

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration and login
- JWT token-based authentication
- Bcrypt password hashing (never stores plain text!)
- Role-based access (Admin, Sales, Production)

### 📦 Order Management
- Create and track manufacturing orders
- Detailed product specifications
- Multi-stage production tracking
- Client and brand information
- Size and quantity management
- Image uploads for products

### 👥 User Management
- User profiles with organizations
- Role-based permissions
- Profile editing capabilities

### 🔔 Notifications
- System notifications
- Real-time alerts
- Read/unread status tracking

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Modern state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing
- **Zod** - Runtime validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database GUI

---

## 📁 Project Structure

```
uniform-studio-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Login endpoint
│   │   │   └── register/route.ts # Registration endpoint
│   │   └── orders/
│   │       ├── route.ts          # List/Create orders
│   │       └── [id]/route.ts     # Get/Update/Delete order
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # React Components
│   ├── DashboardView.tsx         # Dashboard overview
│   ├── SalesView.tsx             # Sales order management
│   ├── ProductionView.tsx        # Production tracking
│   ├── DeliveryView.tsx          # Quality control
│   └── Login.tsx                 # Authentication UI
│
├── lib/                          # Utility Functions
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # Authentication utilities
│   └── api.ts                    # API client for frontend
│
├── types/                        # TypeScript Definitions
│   └── index.ts                  # All type definitions
│
├── prisma/                       # Database
│   └── schema.prisma             # Database schema
│
├── .env.local                    # Environment variables (local)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** database (cloud or local)
- **npm** or **yarn** package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd uniform-studio-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your values:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-secret-key"
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

### Option 1: Neon (Recommended - Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project: "uniform-studio-81"
4. Copy the connection string
5. Paste into `.env.local` as `DATABASE_URL`

### Option 2: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)
5. Paste into `.env.local` as `DATABASE_URL`

### Option 3: Render ($7/month)

1. Go to [render.com](https://render.com)
2. New → PostgreSQL
3. Create database
4. Copy Internal Database URL
5. Paste into `.env.local` as `DATABASE_URL`

### Option 4: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database: `createdb uniform_studio`
3. Use connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/uniform_studio"
   ```

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "Sales",
  "organization": "Company Name"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Sales",
    "organization": "Company Name"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/login`
Authenticate user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

### Order Endpoints

#### GET `/api/orders`
Get all orders (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "orderNumber": "OS-2025290",
    "clientName": "ABC Company",
    "status": "Stitching",
    ...
  }
]
```

#### POST `/api/orders`
Create new order (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderNumber": "OS-2025290",
  "type": "Final Production",
  "clientName": "ABC Company",
  "productName": "Sports Jersey",
  ...
}
```

#### GET `/api/orders/[id]`
Get single order

#### PUT `/api/orders/[id]`
Update order

#### DELETE `/api/orders/[id]`
Delete order

---

## 🌐 Deployment

### Deploy to Render

1. **Create PostgreSQL Database:**
   - New → PostgreSQL
   - Copy Internal Database URL

2. **Deploy Web Service:**
   - New → Web Service
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables:
     ```
     DATABASE_URL=<your-database-url>
     JWT_SECRET=<your-secret>
     NODE_ENV=production
     ```

3. **Run Migrations:**
   - Go to Shell tab
   - Run: `npx prisma migrate deploy`

### Deploy to Vercel

1. **Push to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - New Project → Import from GitHub
   - Add environment variables

3. **Set up Database:**
   - Use Neon or Supabase for database
   - Add `DATABASE_URL` to Vercel environment variables

4. **Deploy:**
   - Vercel will auto-deploy on push

---

## 💻 Development Guide

### Running Prisma Studio

View and edit your database with a GUI:

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555)

### Database Migrations

After changing `schema.prisma`:

```bash
# Create and apply migration
npx prisma migrate dev --name description_of_changes

# Apply migrations in production
npx prisma migrate deploy
```

### Generate Prisma Client

After schema changes:

```bash
npx prisma generate
```

### Code Structure Guidelines

1. **All API routes** include comprehensive comments
2. **All utilities** have JSDoc documentation
3. **All types** are defined in `types/index.ts`
4. **Authentication** is handled in `lib/auth.ts`
5. **Database access** uses Prisma client from `lib/prisma.ts`

### Adding New Features

1. **Update database schema** in `prisma/schema.prisma`
2. **Run migration** to update database
3. **Update types** in `types/index.ts`
4. **Create API route** in `app/api/`
5. **Add frontend method** in `lib/api.ts`
6. **Create/update component** in `components/`

---

## 🔒 Security Best Practices

✅ **Passwords** are hashed with bcrypt (never plain text)  
✅ **JWT tokens** expire after 7 days (configurable)  
✅ **API routes** require authentication  
✅ **Environment variables** are not committed to git  
✅ **Input validation** with Zod schemas  
✅ **SQL injection** prevented by Prisma ORM  

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with `openssl rand -base64 32` |
| `JWT_EXPIRY` | Token expiration time | `7d`, `30d`, `1h` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000` |

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull
```

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
npx prisma generate
```

### Migration Errors

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or fix manually
npx prisma migrate resolve --applied <migration-name>
```

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 📄 License

This project is part of the Uniform Studio 81 operations system.

---

## 🙏 Acknowledgments

Built with ❤️ for streamlining uniform manufacturing operations.

**Version:** 3.0  
**Last Updated:** February 2026  
**Framework:** Next.js 14 + PostgreSQL
