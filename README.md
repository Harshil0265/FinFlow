# 💰 FinFlow - Personal Finance Management System

<div align="center">

![FinFlow Logo](https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=FinFlow)

**A comprehensive, secure personal finance management application built with Next.js, TypeScript, and MongoDB.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harshil0265/FinFlow)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://finflow-demo.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://finflow-demo.vercel.app) • [📖 Documentation](./INSTALLATION.md) • [🔒 Security](./SECURITY.md) • [🚀 Deploy](./DEPLOYMENT.md)

</div>

## ✨ Overview

FinFlow is a modern, intelligent financial management application that helps you master your money with real-time transaction tracking, smart budget management, interactive calendar views, comprehensive analytics, and seamless data exports. Built with enterprise-grade security and user experience in mind.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based auth with refresh tokens and secure cookies
- **Transaction Management**: Full CRUD operations with categories and payment methods
- **Budget Management**: Create, track, and monitor budgets with visual progress indicators
- **Calendar View**: Interactive calendar with transaction visualization using React Big Calendar
- **Advanced Analytics**: Comprehensive charts, trends, and financial health scoring
- **Export Capabilities**: PDF and CSV export with custom filters and professional formatting
- **Offline Support**: PWA with service worker, offline transaction storage, and background sync
- **User Settings**: Profile management, preferences, theme selection, and data export

### Advanced Features
- **Interactive Charts**: Spending trends, category breakdowns, and income vs expense analysis
- **Financial Health Score**: AI-powered insights into spending patterns and savings rate
- **Budget Alerts**: Visual indicators for budget status (good, warning, exceeded)
- **Responsive Calendar**: Month, week, and day views with transaction details
- **Progressive Web App**: Installable app with offline functionality
- **Theme System**: Light, dark, and system-aware theme switching

### Technical Features
- **Mobile-First Design**: Responsive UI with touch interactions and gestures
- **Real-time Updates**: Live data synchronization and instant UI updates
- **Security**: CSRF protection, XSS prevention, input validation, and secure authentication
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Performance**: Optimized with caching, lazy loading, and efficient data fetching
- **Offline-First**: Service worker with background sync and IndexedDB storage

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **Zustand** for state management
- **React Hook Form** with Zod validation

### Backend
- **Next.js API Routes** (serverless functions)
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcrypt** for password hashing
- **Puppeteer** for PDF generation

### DevOps & Testing
- **Jest** + React Testing Library
- **Docker** containerization
- **GitHub Actions** CI/CD
- **ESLint** + Prettier

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   **Demo Credentials:**
   - Email: `demo@example.com`
   - Password: `demo123456`
   
   The application will redirect you to the login page, and after successful authentication, you'll be taken to the full dashboard.

## 🐳 Docker Setup

### Development with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build production image
docker build -t expense-manager .

# Run container
docker run -p 3000:3000 --env-file .env.local expense-manager
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {...}
  },
  "accessToken": "jwt-token-here"
}
```

#### POST /api/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token cookie.

#### POST /api/auth/logout
Logout user and clear refresh token.

### Transaction Endpoints

#### GET /api/transactions
Get user's transactions with optional filters.

**Query Parameters:**
- `startDate`: Filter by start date
- `endDate`: Filter by end date  
- `category`: Filter by category
- `type`: Filter by income/expense
- `limit`: Number of results (default: 50)
- `page`: Page number for pagination

#### POST /api/transactions
Create a new transaction.

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 85.50,
  "type": "expense",
  "category": "Food & Dining", 
  "paymentMethod": "Credit Card",
  "date": "2024-01-15T10:30:00Z",
  "description": "Weekly groceries",
  "recurring": {
    "frequency": "weekly",
    "interval": 1,
    "endDate": "2024-12-31T23:59:59Z"
  }
}
```

#### PUT /api/transactions/[id]
Update existing transaction.

#### DELETE /api/transactions/[id]
Delete transaction.

### Budget Endpoints

#### GET /api/budgets
Get user's budgets.

#### POST /api/budgets
Create new budget.

#### PUT /api/budgets/[id]
Update budget.

#### DELETE /api/budgets/[id]
Delete budget.

### Export Endpoints

#### GET /api/export/pdf
Generate PDF export of transactions.

**Query Parameters:**
- `startDate`: Start date for export
- `endDate`: End date for export
- `category`: Category filter
- `type`: Transaction type filter

#### GET /api/export/csv
Generate CSV export of transactions.

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check
```

### Test Structure

```
tests/
├── __mocks__/          # Mock files
├── components/         # Component tests
├── pages/             # Page tests  
├── api/               # API endpoint tests
└── utils/             # Utility function tests
```

### Example Test

```typescript
// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔒 Security Best Practices

### Authentication Security
- JWT tokens with short expiration (15 minutes)
- Refresh tokens stored in httpOnly cookies
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention with Mongoose
- XSS protection with Content Security Policy
- CSRF protection with SameSite cookies

### API Security
- Request rate limiting
- Input sanitization
- Error message sanitization
- Secure headers configuration

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 📱 PWA Features

### Service Worker
- Offline transaction caching
- Background sync when online
- Push notifications (optional)
- App-like experience

### Installation
Users can install the app on mobile devices and desktop for native-like experience.

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981) 
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Typography
- **Font**: Inter (system fallback)
- **Headings**: Bold weights
- **Body**: Regular weight
- **Code**: Monospace

### Components
All components follow consistent design patterns with:
- Consistent spacing (4px grid)
- Rounded corners (8px default)
- Subtle shadows and borders
- Smooth animations

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | Yes |
| `NEXTAUTH_URL` | App URL for auth | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |
| `CLOUDINARY_*` | File upload config | No |
| `SMTP_*` | Email config | No |

### Database Indexes

The app creates these MongoDB indexes for performance:
- `{ userId: 1, date: -1 }` on transactions
- `{ userId: 1, category: 1 }` on transactions  
- `{ userId: 1, type: 1 }` on transactions
- `{ email: 1 }` unique on users

## 📈 Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Bundle analysis and tree shaking
- Lazy loading of components
- Memoization of expensive calculations

### Backend  
- Database query optimization
- Response caching
- Compression middleware
- Connection pooling

### Monitoring
- Error tracking with Sentry (optional)
- Performance monitoring
- Database query analysis
- User analytics (privacy-focused)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Follow conventional commits
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🗺 Roadmap

### Phase 1 (Completed ✅)
- ✅ Core transaction management
- ✅ Authentication system with JWT
- ✅ Advanced dashboard with analytics
- ✅ PDF/CSV export functionality
- ✅ Budget management system
- ✅ Interactive calendar view
- ✅ Advanced charts and analytics
- ✅ PWA with offline support
- ✅ User settings and preferences
- ✅ Mobile-responsive design
- ✅ Dark/light theme support

### Phase 2 (Future Enhancements)
- 📋 Multi-currency support
- 📋 Bank account integration
- 📋 Investment tracking
- 📋 Bill reminders and notifications
- 📋 Financial goal setting
- 📋 Team/family accounts
- 📋 Advanced reporting
- 📋 AI-powered insights

## 📊 Sample Data

The app includes seed data for testing:

### Sample User
- **Email**: demo@example.com
- **Password**: demo123456
- **Name**: Demo User

### Sample Transactions
- Various income and expense categories
- Different payment methods
- Recent and historical data
- Recurring transaction examples

### Sample Budgets
- Monthly category budgets
- Different budget periods
- Realistic spending limits

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**