#!/bin/bash

# FinFlow - Deploy to GitHub Script
# This script will initialize git, add all files, and push to GitHub

echo "🚀 FinFlow - Deploying to GitHub Repository"
echo "============================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "📁 Git repository already initialized"
fi

# Add all files to staging
echo "📦 Adding all files to staging..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "feat: Complete FinFlow application with security features

- ✅ Transaction management with notes/memos
- ✅ Professional landing page with demo mode
- ✅ Enterprise-grade security implementation
- ✅ Rate limiting and audit logging
- ✅ Input validation and sanitization
- ✅ Security dashboard and monitoring
- ✅ Future date prevention
- ✅ Comprehensive documentation
- ✅ Vercel deployment ready
- ✅ Production-ready configuration

Features:
- Complete CRUD operations for transactions
- Notes and memos for detailed tracking
- Advanced search and filtering
- Security headers and OWASP compliance
- JWT authentication with refresh tokens
- MongoDB integration with proper indexing
- Responsive design for all devices
- PWA capabilities with offline support"
fi

# Set the main branch
echo "🌿 Setting main branch..."
git branch -M main

# Check if remote origin exists
if git remote get-url origin &> /dev/null; then
    echo "🔗 Remote origin already exists"
else
    echo "🔗 Adding remote origin..."
    git remote add origin https://github.com/Harshil0265/FinFlow.git
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin main; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 FinFlow has been deployed to GitHub!"
    echo "📍 Repository: https://github.com/Harshil0265/FinFlow"
    echo ""
    echo "Next steps:"
    echo "1. 🌐 Deploy to Vercel: https://vercel.com/new/clone?repository-url=https://github.com/Harshil0265/FinFlow"
    echo "2. 🔧 Set up environment variables in Vercel dashboard"
    echo "3. 🗄️  Create MongoDB Atlas database"
    echo "4. 🔑 Generate JWT secrets for production"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Failed to push to GitHub"
    echo "This might be because:"
    echo "1. The repository doesn't exist yet"
    echo "2. You don't have push permissions"
    echo "3. Authentication is required"
    echo ""
    echo "Please:"
    echo "1. Create the repository on GitHub: https://github.com/new"
    echo "2. Make sure you're authenticated with GitHub"
    echo "3. Try running this script again"
fi

echo ""
echo "🔒 Security Note:"
echo "Make sure to set up proper environment variables in production!"
echo "Never commit .env files with real secrets to GitHub."