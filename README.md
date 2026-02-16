# 🏭 Uniform Studio 81 - Order Management System

<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 📋 Overview

**Uniform Studio 81** is a comprehensive order management system designed for uniform manufacturing operations. It streamlines the entire workflow from sales order creation to production tracking and quality delivery management.

### ✨ Key Features

- **🎯 Dashboard Analytics** - Real-time overview of orders, production status, and key metrics
- **💼 Sales Management** - Create and manage customer orders with detailed specifications
- **🏭 Production Tracking** - Monitor manufacturing progress through multiple stages
- **✅ Quality Control** - Post-delivery inspection and alteration management
- **🔔 Smart Notifications** - Real-time alerts for critical events and status changes
- **👥 Multi-Role Support** - Role-based access for Sales, Production, and Admin users
- **🔍 Advanced Search** - Quick order lookup by batch number, client, or product
- **💾 Auto-Save** - Persistent data storage using localStorage

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Edit the [.env.local](.env.local) file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 🔐 Login Credentials

The system uses a registration-based authentication. On first use, you'll need to create an account.

### Creating Your First Account

1. Click on the **Register** tab
2. Fill in the following details:
   - **Name:** Your full name
   - **Organization:** Your company name
   - **Email:** Your work email
   - **Password:** Choose a secure password
   - **Role:** Select from Sales, Production, or Admin

3. Click **Create Account**
4. Switch back to **Login** tab and sign in with your credentials

### Demo Account (Optional)

To create a demo account for testing, register with these details:
- **Name:** System Admin
- **Organization:** Uniform Studio 81
- **Email:** admin@studio81.com
- **Password:** admin123
- **Role:** Admin

> **Note:** All user data is stored locally in your browser's localStorage. Clearing browser data will reset all accounts and orders.

---

## 📱 Application Structure

### Views

1. **Dashboard** 📊
   - Overview of all orders
   - Status distribution charts
   - Quick navigation to different sections

2. **Sales** 💼
   - Create new orders with detailed specifications
   - Manage client information
   - Track order history
   - Define fabric, accessories, and customization details

3. **Production** 🏭
   - Track manufacturing stages:
     - Fabric Procurement
     - Cutting
     - Stitching
     - Embroidery/Printing
     - Packing
   - Upload progress images
   - Update status and notes

4. **Quality (Delivery)** ✅
   - Post-delivery inspection
   - Record client feedback
   - Manage alterations if needed
   - Final order completion

### Key Components

- **Order Management** - Full lifecycle tracking from creation to delivery
- **Image Upload** - Visual documentation of production progress
- **Notification System** - Real-time alerts for important events
- **Profile Management** - User profile editing and organization details
- **Search & Filter** - Quick access to specific orders

---

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library
- **LocalStorage** - Client-side data persistence

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🗂️ Project Structure

```
uniform-studio-81---order-management-system/
├── components/
│   ├── DashboardView.tsx    # Dashboard overview
│   ├── SalesView.tsx        # Sales order management
│   ├── ProductionView.tsx   # Production tracking
│   ├── DeliveryView.tsx     # Quality control & delivery
│   └── Login.tsx            # Authentication
├── App.tsx                  # Main application component
├── types.ts                 # TypeScript type definitions
├── index.tsx                # Application entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── README.md                # This file
```

---

## 💡 Usage Tips

### Creating an Order

1. Navigate to **Sales** view
2. Click **New Order** button
3. Fill in all required fields:
   - Client information
   - Product specifications
   - Fabric and accessories
   - Sizes and quantities
   - Delivery dates
4. Click **Create Order**

### Tracking Production

1. Go to **Production** view
2. Select an order from the list
3. Update the current stage status
4. Upload progress images
5. Add notes for each stage
6. Mark stages as complete

### Quality Inspection

1. Navigate to **Quality** view
2. Select a delivered order
3. Record inspection results
4. If alterations needed:
   - Mark as "Alteration Required"
   - Describe the issue and solution
   - System will create an alert notification

### Search Orders

- Use the search bar in the header
- Search by:
  - Order/Batch number
  - Client name
  - Product name
- Click on results to jump directly to production view

---

## 🔄 Data Persistence

All data is stored in browser localStorage:
- **us81_user** - Current logged-in user
- **us81_users_db** - All registered users
- **us81_orders** - All orders
- **us81_notifications** - System notifications
- **us81_form_history** - Form auto-complete history
- **us81_login_draft** - Login form draft

> **Important:** Clearing browser data will erase all information. For production use, consider implementing a backend database.

---

## 🎨 Customization

### Branding Colors

The app uses a distinctive color scheme:
- **Primary:** `#EAB308` (Yellow/Gold)
- **Dark:** `#1E293B` (Slate)
- **Background:** `#F8FAFC` (Light Slate)

To customize, search for these hex codes in the component files.

### Adding New Roles

Edit [types.ts](types.ts) and add new roles to the `UserRole` type:
```typescript
export type UserRole = 'Sales' | 'Production' | 'Admin' | 'YourNewRole';
```

---

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

---

## 📞 Support

For issues or questions:
- Check the [AI Studio App](https://ai.studio/apps/drive/1l0XHqmgFsd_VUhOXKNvi_jtNdahiqfG7)
- Review component code for implementation details
- Ensure all dependencies are installed correctly

---

## 📄 License

This project is part of the Uniform Studio 81 operations system.

---

## 🙏 Acknowledgments

Built with ❤️ for streamlining uniform manufacturing operations.

**Version:** 2.1 Build  
**Last Updated:** February 2026
