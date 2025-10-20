# Vercel Deployment Guide for FinFlow

## Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/finflow`)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see Step 3)
5. Deploy

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 3: Environment Variables

Set these in your Vercel project settings:

### Required Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-different-refresh-secret-minimum-32-characters
NEXTAUTH_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters
NODE_ENV=production
```

### Optional Variables
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 4: Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# For JWT secrets (run twice for different secrets)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator: https://generate-secret.vercel.app/32
```

## Step 5: Domain Configuration

1. In Vercel dashboard, go to your project settings
2. Add your custom domain (optional)
3. Update NEXTAUTH_URL to match your domain

## Step 6: Verify Deployment

1. Visit your deployed URL
2. Test user registration and login
3. Create a test transaction
4. Check all features work correctly

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### Authentication Issues
- Verify JWT secrets are set and secure
- Check NEXTAUTH_URL matches your domain
- Ensure cookies are working (check browser dev tools)

## Performance Optimization

1. **Enable Vercel Analytics** (optional)
2. **Configure caching headers** (already set in vercel.json)
3. **Monitor function execution times**
4. **Use Vercel Edge Functions** for better performance

## Security Checklist

- ✅ Environment variables are secure and not exposed
- ✅ JWT secrets are random and at least 32 characters
- ✅ Database credentials are secure
- ✅ HTTPS is enforced (automatic with Vercel)
- ✅ Security headers are configured
- ✅ Rate limiting is implemented

## Monitoring

1. **Vercel Analytics**: Monitor page views and performance
2. **Function Logs**: Check API route execution
3. **Error Tracking**: Monitor build and runtime errors
4. **Database Monitoring**: Use MongoDB Atlas monitoring

## Backup Strategy

1. **Database Backups**: MongoDB Atlas provides automatic backups
2. **Code Backups**: GitHub repository serves as code backup
3. **Environment Variables**: Keep secure backup of production variables

## Updates and Maintenance

1. **Automatic Deployments**: Enabled via GitHub integration
2. **Dependency Updates**: Regular npm audit and updates
3. **Security Updates**: Monitor for security advisories
4. **Performance Monitoring**: Regular performance checks

Your FinFlow application is now production-ready on Vercel! 🚀