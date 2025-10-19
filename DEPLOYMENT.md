# FinFlow Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

### Step 1: Prepare Repository

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: FinFlow application"
git branch -M main
git remote add origin https://github.com/Harshil0265/FinFlow.git
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (free tier M0)

2. **Configure Database:**
   - Create database user with read/write permissions
   - Add IP address `0.0.0.0/0` to network access (for Vercel)
   - Get connection string

3. **Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/finflow?retryWrites=true&w=majority
```

### Step 3: Deploy to Vercel

1. **Connect GitHub to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your FinFlow repository

2. **Configure Environment Variables:**
   In Vercel dashboard, add these environment variables:

   ```bash
   # Required Variables
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
   JWT_REFRESH_SECRET=your_refresh_token_secret_key_minimum_32_characters
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   ```

3. **Generate Secure Secrets:**
   ```bash
   # Generate JWT secrets (run in terminal)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-app-name.vercel.app`

### Step 4: Verify Deployment

1. **Check Application:**
   - Visit your Vercel URL
   - Test landing page loads
   - Try demo mode functionality
   - Test user registration/login

2. **Monitor Logs:**
   - Check Vercel function logs for any errors
   - Monitor MongoDB Atlas for database connections

## 🔧 Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `abc123...` |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | `def456...` |
| `NEXTAUTH_URL` | Your app's URL | `https://finflow.vercel.app` |
| `NODE_ENV` | Environment | `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXCHANGE_RATE_API_KEY` | Currency conversion API | Not required |
| `CLOUDINARY_URL` | Image upload service | Not required |

## 🛠️ Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Ensure all dependencies are in package.json
- Check TypeScript errors
- Verify environment variables are set
```

#### 2. Database Connection Issues
```bash
# Verify MongoDB Atlas setup:
- Check connection string format
- Ensure IP whitelist includes 0.0.0.0/0
- Verify database user permissions
- Test connection string locally first
```

#### 3. Authentication Issues
```bash
# Check JWT configuration:
- Ensure JWT_SECRET is set and secure (32+ characters)
- Verify NEXTAUTH_URL matches your domain
- Check that secrets are properly generated
```

#### 4. API Route Errors
```bash
# Common API issues:
- Check function timeout limits (30s max on Vercel)
- Verify environment variables in API routes
- Monitor Vercel function logs
```

### Performance Optimization

#### 1. Database Optimization
```javascript
// Add database indexes for better performance
// In MongoDB Atlas, create indexes on:
- { userId: 1, date: -1 } // For transaction queries
- { email: 1 } // For user lookups
- { userId: 1, category: 1 } // For category filtering
```

#### 2. Vercel Optimization
```json
// vercel.json optimizations already included:
- Function timeout: 30s
- Proper headers for security
- Regional deployment for better performance
```

## 📊 Monitoring & Maintenance

### 1. Set Up Monitoring
- **Vercel Analytics:** Enable in Vercel dashboard
- **MongoDB Monitoring:** Use Atlas monitoring tools
- **Error Tracking:** Monitor Vercel function logs

### 2. Regular Maintenance
- **Dependencies:** Update monthly with `npm update`
- **Security:** Monitor for security advisories
- **Backups:** Set up MongoDB Atlas automated backups
- **Performance:** Monitor response times and optimize

### 3. Scaling Considerations
- **Database:** Upgrade MongoDB Atlas tier as needed
- **Vercel:** Pro plan for higher limits
- **CDN:** Vercel includes global CDN
- **Caching:** Implement Redis for session storage (optional)

## 🔒 Security Checklist

### Pre-Deployment Security
- [ ] All environment variables are secure and not hardcoded
- [ ] JWT secrets are properly generated (32+ characters)
- [ ] Database connection uses authentication
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Security headers are configured
- [ ] Input validation is implemented
- [ ] Rate limiting is active

### Post-Deployment Security
- [ ] Test authentication flows
- [ ] Verify HTTPS certificate
- [ ] Check security headers with tools like securityheaders.com
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for failed login attempts
- [ ] Regular security updates

## 🎯 Success Metrics

After successful deployment, you should have:
- ✅ **Functional Application** at your Vercel URL
- ✅ **Working Authentication** with secure JWT tokens
- ✅ **Database Connectivity** to MongoDB Atlas
- ✅ **Demo Mode** functioning with sample data
- ✅ **Security Features** active and protecting users
- ✅ **Responsive Design** working on all devices
- ✅ **Professional Landing Page** with clear value proposition

## 📞 Support Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **FinFlow Issues:** Create issues in your GitHub repository

---

**Your FinFlow application is now ready for production! 🚀**