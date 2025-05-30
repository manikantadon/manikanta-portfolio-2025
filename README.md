# Secure Authentication System for Next.js with Mongoose

A complete authentication system built with Next.js 15 (App Router), Mongoose, and TypeScript featuring secure JWT tokens stored in HTTP-only cookies.

## Features

- ✅ **Secure Authentication**: JWT tokens stored in HTTP-only cookies
- ✅ **Password Hashing**: bcrypt with salt rounds for secure password storage
- ✅ **Route Protection**: Middleware-based route protection
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Mongoose Integration**: MongoDB with Mongoose ODM
- ✅ **Server Actions**: Modern Next.js server-side form handling
- ✅ **Responsive UI**: Tailwind CSS for styling

## Project Structure

```
project/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   └── forgot-password/page.tsx # Forgot password page
│   ├── home/page.tsx               # Protected home page
│   ├── dashboard/page.tsx          # Protected dashboard
│   ├── profile/page.tsx            # Protected profile page
│   ├── settings/page.tsx           # Protected settings page
│   ├── landing/page.tsx            # Public landing page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page (redirects)
├── components/
│   ├── AuthForm.tsx               # Reusable auth form component
│   ├── Navigation.tsx             # Navigation component
│   └── ProtectedRoute.tsx         # Client-side route protection
├── lib/
│   ├── actions.ts                 # Server actions for auth
│   ├── auth.ts                    # Authentication utilities
│   ├── db.ts                      # MongoDB connection
│   ├── models/User.ts             # User model with Mongoose
│   └── types.ts                   # TypeScript interfaces
├── middleware.ts                  # Route protection middleware
├── global.d.ts                    # Global type declarations
└── .env.local                     # Environment variables
```

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:

```bash
npm install
```

### 2. Environment Variables

Update the `.env.local` file with your MongoDB connection string and JWT secret:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/auth-setup

# JWT Secret Key (generate a secure random string for production)
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB Atlas, just ensure your connection string is correct
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Authentication Flow

1. **Registration**: Users create an account with email and password
2. **Password Hashing**: Passwords are hashed using bcrypt before storage
3. **JWT Generation**: Upon successful login, a JWT token is generated
4. **Cookie Storage**: JWT is stored in an HTTP-only cookie for security
5. **Route Protection**: Middleware checks authentication status for protected routes

### Security Features

- **HTTP-only Cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript
- **Secure Cookies**: HTTPS-only in production
- **SameSite Strict**: Prevents CSRF attacks
- **Password Hashing**: bcrypt with salt rounds
- **JWT Expiration**: Tokens expire after 1 week
- **Route Protection**: Both server-side and client-side protection

### Key Components

- **Middleware**: Protects routes and redirects unauthenticated users
- **Server Actions**: Handle form submissions securely on the server
- **Mongoose Models**: Define user schema with validation and methods
- **Type Safety**: Full TypeScript coverage for better development experience

## Usage

1. Visit the application at `http://localhost:3000`
2. **For non-authenticated users**: You'll see a beautiful landing page with options to login or register
3. **For authenticated users**: You'll be redirected to the home page with navigation
4. Click "Sign up" to create a new account or "Sign in" to login
5. After authentication, you'll have access to:
   - **Home**: Main dashboard with feature overview
   - **Dashboard**: Detailed account information
   - **Profile**: Personal information management
   - **Settings**: Application preferences and security settings
6. All protected routes are automatically secured by middleware

## Testing the Authentication

1. **Visit the landing page** at `/landing` (public access)
2. **Register a new user** at `/register`
3. **Login with existing credentials** at `/login`
4. **Use forgot password** at `/forgot-password`
5. **Access protected routes**:
   - `/home` - Main authenticated home page
   - `/dashboard` - Account dashboard
   - `/profile` - User profile management
   - `/settings` - Application settings
6. **Try accessing protected routes without authentication** - you'll be redirected to login
7. **Logout** using the logout button in the navigation

## Production Considerations

Before deploying to production:

1. **Generate a secure JWT secret**: Use a cryptographically secure random string
2. **Use a production MongoDB instance**: MongoDB Atlas or your own server
3. **Enable HTTPS**: Required for secure cookies
4. **Set proper CORS policies**: If using API routes
5. **Add rate limiting**: Prevent brute force attacks
6. **Add email verification**: For additional security
7. **Add password reset functionality**: For better user experience

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **Tailwind CSS**: Utility-first CSS framework
- **cookie**: Cookie parsing and serialization

This authentication system provides a solid foundation for any Next.js application requiring user authentication with modern security practices.
