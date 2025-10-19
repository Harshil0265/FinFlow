# FinFlow Installation Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets (generate secure random strings)
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your FinFlow application!

## 📦 Dependencies Included

### Core Dependencies
- ✅ **Next.js 15** - React framework
- ✅ **React 18** - UI library
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Styling
- ✅ **Framer Motion** - Animations

### UI Components
- ✅ **Radix UI** - Accessible components
- ✅ **Lucide React** - Icons
- ✅ **Class Variance Authority** - Component variants

### Forms & Validation
- ✅ **React Hook Form** - Form handling
- ✅ **Zod** - Schema validation
- ✅ **Hookform Resolvers** - Form validation integration

### Database & Auth
- ✅ **MongoDB** - Database
- ✅ **Mongoose** - ODM
- ✅ **bcryptjs** - Password hashing
- ✅ **jsonwebtoken** - JWT tokens

### State Management
- ✅ **Zustand** - State management
- ✅ **React Query** - Server state

### Charts & Data
- ✅ **Chart.js** - Charts
- ✅ **React Chart.js 2** - React integration
- ✅ **Recharts** - Additional charts
- ✅ **date-fns** - Date utilities

### Security & Performance
- ✅ **Helmet** - Security headers
- ✅ **CORS** - Cross-origin requests
- ✅ **Express Rate Limit** - Rate limiting

## 🔧 Build Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Missing Dependencies
If you see module not found errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Database Connection
Ensure MongoDB is running and connection string is correct:
```bash
# Check MongoDB connection
mongosh "your_mongodb_connection_string"
```

#### 3. Environment Variables
Verify all required environment variables are set:
```bash
# Check if .env.local exists and has required variables
cat .env.local
```

#### 4. Port Already in Use
If port 3000 is busy:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Build Errors

#### TypeScript Errors
```bash
# Fix TypeScript issues
npm run type-check
```

#### Linting Errors
```bash
# Fix linting issues
npm run lint -- --fix
```

## 🌐 Production Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Environment Variables
Set production environment variables:
```bash
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
```

### 3. Start Production Server
```bash
npm start
```

## 📱 Features Included

### ✅ Complete Transaction Management
- Add, edit, delete transactions
- Transaction notes and memos
- Categories and payment methods
- Future date prevention
- Search and filtering

### ✅ Security Features
- JWT authentication
- Password hashing
- Rate limiting
- Input sanitization
- Security headers
- Audit logging

### ✅ User Experience
- Professional landing page
- Demo mode with sample data
- Responsive design
- Loading states
- Error handling
- Toast notifications

### ✅ Data Features
- MongoDB integration
- Data validation
- Export capabilities
- Backup-ready structure

## 🎯 Next Steps

1. **Customize Branding** - Update colors, logo, and styling
2. **Add Features** - Implement additional functionality
3. **Deploy** - Choose your hosting platform
4. **Monitor** - Set up logging and monitoring
5. **Scale** - Optimize for production load

## 📞 Support

If you encounter any issues:
1. Check this troubleshooting guide
2. Review the error messages carefully
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

---

**Happy coding with FinFlow!** 🚀