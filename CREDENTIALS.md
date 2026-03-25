# 🔐 Login Credentials Guide

## Uniform Studio 81 - Order Management System

---

## 🎯 Authentication System

This application uses a **registration-based authentication system** with data stored locally in your browser.

---

## 📝 Creating Your First Account

### Step-by-Step Registration

1. **Open the application** in your browser (after running `npm run dev`)

2. **Click the "Register" tab** on the login screen

3. **Fill in the registration form:**

   | Field | Description | Example |
   |-------|-------------|---------|
   | **Name** | Your full name | John Smith |
   | **Organization** | Your company name | Uniform Studio 81 |
   | **Email** | Your work email address | john.smith@efzeefashion.com |
   | **Password** | Choose a secure password | YourSecurePassword123 |
   | **Role** | Select your department role | Admin / Sales / Production |

4. **Click "Create Account"**

5. **Switch to "Login" tab** and sign in with your new credentials

---

## 👥 Recommended Demo Accounts

Create these accounts for testing different roles:

### 🔧 Admin Account
```
Name:         System Admin
Organization: Uniform Studio 81
Email:        admin@efzeefashion.com
Password:     admin123
Role:         Admin
```
**Access:** Full system access, all features

---

### 💼 Sales Account
```
Name:         Sarah Johnson
Organization: Uniform Studio 81
Email:        sales@efzeefashion.com
Password:     sales123
Role:         Sales
```
**Access:** Create orders, manage clients, view production status

---

### 🏭 Production Account
```
Name:         Mike Chen
Organization: Uniform Studio 81
Email:        production@efzeefashion.com
Password:     prod123
Role:         Production
```
**Access:** Update production stages, upload images, track manufacturing

---

## 🔑 Important Notes

### Data Storage
- ✅ All user accounts are stored in **browser localStorage**
- ✅ Each browser/device maintains its own user database
- ⚠️ **Clearing browser data will delete all accounts and orders**

### Security Considerations
- 🔒 This is a **demo/development system** with basic authentication
- 🔒 Passwords are stored in **plain text** in localStorage
- 🔒 **NOT suitable for production use** without implementing proper backend authentication
- 🔒 For production, implement:
  - Backend API with secure password hashing (bcrypt)
  - JWT or session-based authentication
  - Database storage (PostgreSQL, MongoDB, etc.)
  - HTTPS encryption

### Multi-User Testing
To test multiple users simultaneously:
1. Use different browsers (Chrome, Firefox, Edge)
2. Use incognito/private windows
3. Each will have separate localStorage and user sessions

---

## 🚀 Quick Login Process

### For Returning Users

1. Open the application
2. Enter your **email** and **password**
3. Click **Login**
4. You'll be redirected to the Dashboard

### Auto-Save Feature

The login form includes auto-save functionality:
- ✅ Form data is automatically saved as you type
- ✅ Previous emails, names, and organizations appear in dropdown suggestions
- ✅ Drafts persist even if you close the browser

---

## 🔄 Password Reset

Since this is a localStorage-based system:

### Option 1: Re-register
1. Use a different email address
2. Create a new account

### Option 2: Manual Reset (Developer)
1. Open browser **Developer Tools** (F12)
2. Go to **Application** → **Local Storage**
3. Find `us81_users_db`
4. Edit the password for your user
5. Refresh the page

### Option 3: Clear All Data
1. Open browser **Developer Tools** (F12)
2. Go to **Application** → **Local Storage**
3. Delete all `us81_*` entries
4. Refresh and start fresh

---

## 📊 Role Permissions

| Feature | Admin | Sales | Production |
|---------|-------|-------|------------|
| View Dashboard | ✅ | ✅ | ✅ |
| Create Orders | ✅ | ✅ | ❌ |
| Edit Orders | ✅ | ✅ | ❌ |
| Update Production | ✅ | ✅ | ✅ |
| Quality Control | ✅ | ✅ | ✅ |
| View All Orders | ✅ | ✅ | ✅ |
| Edit Profile | ✅ | ✅ | ✅ |

> **Note:** Current implementation shows all features to all roles. Role-based restrictions can be added in future updates.

---

## 🛠️ Troubleshooting

### Can't Login?
- ✅ Verify email and password are correct
- ✅ Check if account was created (switch to Register tab to verify)
- ✅ Try clearing browser cache and re-registering

### Lost All Data?
- ⚠️ Browser data was likely cleared
- ⚠️ localStorage was reset
- ✅ Re-register your account
- ✅ Orders and data will need to be recreated

### Multiple Accounts?
- ✅ Each email can only have one account
- ✅ Use different email addresses for different test accounts
- ✅ Example: admin@efzeefashion.com, sales@efzeefashion.com, etc.

---

## 📱 First Login Checklist

After creating your account and logging in:

- [ ] ✅ Update your profile (click your avatar in sidebar)
- [ ] ✅ Explore the Dashboard view
- [ ] ✅ Create a test order in Sales view
- [ ] ✅ Update production status in Production view
- [ ] ✅ Test the search functionality
- [ ] ✅ Check notifications (bell icon in header)

---

## 💡 Tips

1. **Use realistic data** when creating test accounts for better demo experience
2. **Create multiple role accounts** to test different workflows
3. **Export localStorage data** periodically if you want to backup your test data
4. **Use Chrome DevTools** to inspect and manage localStorage data

---

## 🔗 Related Documentation

- [README.md](README.md) - Full application documentation
- [package.json](package.json) - Dependencies and scripts
- [types.ts](types.ts) - TypeScript type definitions

---

**Version:** 2.1 Build  
**Last Updated:** February 2026  
**System:** Uniform Studio 81 Order Management
