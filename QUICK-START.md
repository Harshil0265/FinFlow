# 🚀 FinFlow Quick Start Guide

Get FinFlow running in 5 minutes!

## 🎯 Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harshil0265/FinFlow&env=MONGODB_URI,JWT_SECRET,JWT_REFRESH_SECRET,NEXTAUTH_URL)

1. **Click the deploy button above**
2. **Connect your GitHub account**
3. **Set environment variables** (see below)
4. **Deploy!** ✨

## 🛠️ Option 2: Local Development

### Prerequisites
- Node.js 18+
- Git
- MongoDB Atlas account (free)

### 1. Clone & Install
```bash
git clone https://github.com/Harshil0265/FinFlow.git
cd FinFlow
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow
JWT_SECRET=your_32_character_secret_here
JWT_REFRESH_SECRET=your_32_character_refresh_secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Generate Secrets
```bash
# Generate JWT secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🗄️ MongoDB Atlas Setup (2 minutes)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create free account**
3. **Create cluster** (M0 free tier)
4. **Create database user**
5. **Add IP address** `0.0.0.0/0` (for Vercel)
6. **Get connection string**

## 🔑 Environment Variables

### Required for Production

| Variable | Description | How to Get |
|----------|-------------|------------|
| `MONGODB_URI` | Database connection | MongoDB Atlas dashboard |
| `JWT_SECRET` | JWT signing key | Generate with crypto |
| `JWT_REFRESH_SECRET` | Refresh token key | Generate with crypto |
| `NEXTAUTH_URL` | Your app URL | Your Vercel URL |

### Generate Secrets
```bash
# In terminal/command prompt
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🌐 Vercel Deployment

### Method 1: GitHub Integration
1. **Push code to GitHub**
2. **Connect repository to Vercel**
3. **Set environment variables**
4. **Deploy automatically**

### Method 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

## ✅ Verification Checklist

After deployment, verify:
- [ ] Landing page loads
- [ ] Demo mode works
- [ ] User registration works
- [ ] Login/logout works
- [ ] Dashboard displays
- [ ] Transactions can be added
- [ ] Notes feature works

## 🎮 Demo Mode

Try FinFlow without registration:
1. **Visit your deployed app**
2. **Click "Try Interactive Demo"**
3. **Explore all features with sample data**

## 🔧 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has read/write permissions

### Environment Variables
- Ensure all required variables are set
- Check for typos in variable names
- Verify secrets are properly generated

### Vercel Deployment
- Check function logs in Vercel dashboard
- Verify environment variables in Vercel settings
- Ensure build completes successfully

## 📞 Need Help?

- 📖 **Full Documentation**: [INSTALLATION.md](./INSTALLATION.md)
- 🚀 **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🔒 **Security Info**: [SECURITY.md](./SECURITY.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Harshil0265/FinFlow/issues)

## 🎯 What's Included

✅ **Complete Transaction Management**
- Add, edit, delete transactions
- Notes and memos for detailed tracking
- Categories and payment methods
- Search and filtering

✅ **Security Features**
- JWT authentication
- Rate limiting
- Input validation
- Security dashboard

✅ **User Experience**
- Professional landing page
- Demo mode with sample data
- Responsive design
- Dark/light themes

✅ **Production Ready**
- Vercel deployment configuration
- MongoDB Atlas integration
- Environment variable management
- Security best practices

---

**🎉 You're ready to go! Start managing your finances with FinFlow.**