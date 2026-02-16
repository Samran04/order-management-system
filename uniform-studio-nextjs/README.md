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
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes (Backend)
│   │   ├── auth/                     # Authentication endpoints
│   │   │   ├── login/route.ts        # POST - User login
│   │   │   └── register/route.ts     # POST - User registration
│   │   ├── orders/                   # Order management endpoints
│   │   │   ├── route.ts              # GET - List all orders, POST - Create order
│   │   │   └── [id]/route.ts         # GET/PUT/DELETE - Single order operations
│   │   ├── notifications/            # Notification endpoints
│   │   │   ├── route.ts              # GET - List notifications, POST - Create notification
│   │   │   ├── [id]/read/route.ts    # PUT - Mark notification as read
│   │   │   └── read-all/route.ts     # PUT - Mark all notifications as read
│   │   └── users/                    # User management endpoints
│   │       ├── me/route.ts           # GET - Get current user profile
│   │       └── [id]/route.ts         # GET/PUT - Get/Update user by ID
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
│
├── components/                       # React Components (Frontend)
│   ├── DashboardView.tsx             # Dashboard overview
│   ├── SalesView.tsx                 # Sales order management
│   ├── ProductionView.tsx            # Production tracking
│   ├── DeliveryView.tsx              # Quality control
│   └── Login.tsx                     # Authentication UI
│
├── lib/                              # Utility Functions (Backend & Frontend)
│   ├── prisma.ts                     # Prisma client singleton (prevents multiple instances)
│   ├── auth.ts                       # Authentication utilities (JWT, bcrypt, token verification)
│   └── api.ts                        # API client for frontend (HTTP requests, token management)
│
├── types/                            # TypeScript Definitions
│   └── index.ts                      # All type definitions (User, Order, Notification, etc.)
│
├── prisma/                           # Database Configuration
│   └── schema.prisma                 # Database schema (4 models: User, Order, PostDelivery, Notification)
│
├── .env.local                        # Environment variables (local development)
├── .env.example                      # Environment template with instructions
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

### 🗂️ Backend Files Explained

#### **API Routes** (`app/api/`)
All backend endpoints are organized by feature:

- **Authentication** (`auth/`)
  - `login/route.ts` - Validates credentials, returns JWT token
  - `register/route.ts` - Creates new user with hashed password

- **Orders** (`orders/`)
  - `route.ts` - List all orders (GET), Create order (POST)
  - `[id]/route.ts` - Get/Update/Delete single order

- **Notifications** (`notifications/`)
  - `route.ts` - List user notifications (GET), Create notification (POST)
  - `[id]/read/route.ts` - Mark single notification as read
  - `read-all/route.ts` - Mark all notifications as read

- **Users** (`users/`)
  - `me/route.ts` - Get current authenticated user
  - `[id]/route.ts` - Get/Update user profile

#### **Utilities** (`lib/`)

- **`prisma.ts`** - Database client singleton
  - Prevents multiple Prisma instances in development
  - Configures logging for debugging
  
- **`auth.ts`** - Authentication functions
  - `hashPassword()` - Hash passwords with bcrypt
  - `verifyPassword()` - Verify password against hash
  - `generateToken()` - Create JWT tokens
  - `verifyToken()` - Validate JWT tokens
  - `authenticateRequest()` - Middleware helper
  
- **`api.ts`** - Frontend API client
  - Manages JWT tokens in localStorage
  - Provides methods for all API endpoints
  - Handles errors and token injection

#### **Database** (`prisma/`)

- **`schema.prisma`** - Database schema
  - **User** model - Authentication and profiles
  - **Order** model - Manufacturing orders
  - **PostDelivery** model - Quality control
  - **Notification** model - System alerts

#### **Types** (`types/`)

- **`index.ts`** - TypeScript definitions
  - 20+ interfaces for type safety
  - Shared between frontend and backend

---

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

---

### Order Endpoints

All order endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### GET `/api/orders`
Get all orders

**Response (200):**
```json
[
  {
    "id": "uuid",
    "orderNumber": "OS-2025290",
    "clientName": "ABC Company",
    "status": "Stitching",
    "salesPerson": "John Doe",
    ...
  }
]
```

#### POST `/api/orders`
Create new order

**Request Body:**
```json
{
  "orderNumber": "OS-2025290",
  "type": "Final Production",
  "date": "2026-02-17",
  "startDate": "2026-02-18",
  "deliveryDate": "2026-03-01",
  "clientName": "ABC Company",
  "brand": "SportWear",
  "productName": "Sports Jersey",
  "itemDescription": "Custom sports jersey",
  "fabric": ["Cotton", "Polyester"],
  "color": "Blue",
  "sleeve": "Short Sleeve",
  "fabricSupplier": ["Supplier A"],
  "accessories": ["Rib Collar", "2 Buttons"],
  "patternFollowed": "Pattern-001",
  "cmPrice": [50],
  "cmUnit": ["CRT"],
  "cmPartner": "Partner A",
  "embroideryPrint": ["Logo on chest"],
  "sizes": [
    { "size": "M", "quantity": 10 },
    { "size": "L", "quantity": 15 }
  ],
  "totalQuantity": 25,
  "images": ["url1", "url2"],
  "status": "Order Received",
  "notes": "Rush order"
}
```

#### GET `/api/orders/[id]`
Get single order by ID

**Response (200):**
```json
{
  "id": "uuid",
  "orderNumber": "OS-2025290",
  ...
}
```

#### PUT `/api/orders/[id]`
Update order

**Request Body:** (partial update supported)
```json
{
  "status": "Stitching",
  "notes": "Updated notes"
}
```

#### DELETE `/api/orders/[id]`
Delete order

**Response (200):**
```json
{
  "message": "Order deleted successfully"
}
```

---

### Notification Endpoints

#### GET `/api/notifications`
Get all notifications for current user

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "New Order",
    "message": "Order OS-2025290 created",
    "type": "info",
    "read": false,
    "timestamp": "2026-02-17T00:00:00Z"
  }
]
```

#### POST `/api/notifications`
Create notification

**Request Body:**
```json
{
  "userId": "uuid",  // Optional, defaults to current user
  "title": "Order Update",
  "message": "Order status changed",
  "type": "info"  // info, success, alert, message
}
```

#### PUT `/api/notifications/[id]/read`
Mark single notification as read

**Response (200):**
```json
{
  "id": "uuid",
  "read": true
}
```

#### PUT `/api/notifications/read-all`
Mark all notifications as read

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

---

### User Endpoints

#### GET `/api/users/me`
Get current user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Sales",
  "organization": "Company Name",
  "createdAt": "2026-02-17T00:00:00Z",
  "updatedAt": "2026-02-17T00:00:00Z"
}
```

#### GET `/api/users/[id]`
Get user by ID

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Sales",
  "organization": "Company Name"
}
```

#### PUT `/api/users/[id]`
Update user profile

**Request Body:**
```json
{
  "name": "Jane Doe",
  "organization": "New Company"
}
```

**Note:** Users can only update their own profile unless they are Admin.


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

### 🔧 Backend Commands

All available npm scripts for backend development:

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Database Management
npm run db:studio        # Open Prisma Studio GUI (http://localhost:5555)
npm run db:migrate       # Create and apply database migration
npm run db:push          # Push schema changes to database (no migration)
npm run db:seed          # Seed database with initial data

# Production
npm run build            # Build for production (includes Prisma generate)
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint

# Prisma Commands (Direct)
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create migration in development
npx prisma migrate deploy # Apply migrations in production
npx prisma studio        # Open database GUI
npx prisma db pull       # Pull schema from database
npx prisma db push       # Push schema to database
npx prisma migrate reset # Reset database (WARNING: deletes all data)
```

### 📊 Database Connection Steps

#### Step 1: Choose Database Provider

**Recommended: Neon (Free Tier)**
- ✅ 3GB storage free
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ No credit card required

**Alternative Options:**
- Supabase (500MB free)
- Render ($7/month)
- Local PostgreSQL

#### Step 2: Get Connection String

**For Neon:**
```bash
# 1. Go to https://neon.tech
# 2. Sign up with GitHub
# 3. Create new project: "uniform-studio-81"
# 4. Copy connection string from dashboard
# Example: postgresql://user:pass@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
```

**For Supabase:**
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Go to Settings → Database
# 4. Copy "Connection string" (Transaction mode)
# 5. Replace [YOUR-PASSWORD] with your actual password
```

**For Render:**
```bash
# 1. Go to https://render.com
# 2. New → PostgreSQL
# 3. Name: uniform-studio-db
# 4. Plan: Starter ($7/month)
# 5. Copy "Internal Database URL"
```

#### Step 3: Configure Environment

Edit `.env.local`:
```env
# Replace with your actual connection string
DATABASE_URL="postgresql://user:password@host:5432/database"

# Generate a secure secret (run: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Optional: Customize token expiry
JWT_EXPIRY="7d"

# API URL (use http://localhost:3000 for development)
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### Step 4: Initialize Database

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Create database tables (run migrations)
npx prisma migrate dev --name init

# 3. Verify database (optional)
npx prisma studio
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
✔ Created migration: 20260217000000_init
```

#### Step 5: Verify Connection

```bash
# Test database connection
npx prisma db pull

# If successful, you'll see:
# ✔ Introspected 4 models
```

### Running Prisma Studio

View and edit your database with a GUI:

```bash
npx prisma studio
# or
npm run db:studio
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
