# Quick Deploy Script for Backend

Write-Host "🚀 Deploying Backend to Vercel..." -ForegroundColor Cyan

# Check if vercel is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

# Navigate to backend
Set-Location backend

Write-Host "✅ Starting deployment..." -ForegroundColor Green
Write-Host ""
Write-Host "Please follow the prompts:" -ForegroundColor Yellow
Write-Host "  1. Set up and deploy? → Yes" -ForegroundColor White
Write-Host "  2. Which scope? → Select your account" -ForegroundColor White
Write-Host "  3. Link to existing project? → No (first time) or Yes (redeployment)" -ForegroundColor White
Write-Host "  4. Project name? → ecommerce-backend" -ForegroundColor White
Write-Host "  5. Directory? → ./" -ForegroundColor White
Write-Host "  6. Override settings? → No" -ForegroundColor White
Write-Host ""

# Run vercel
vercel

Write-Host ""
Write-Host "⚠️  IMPORTANT: After deployment, set environment variables!" -ForegroundColor Yellow
Write-Host "Run the following commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  vercel env add MONGO_URI" -ForegroundColor Cyan
Write-Host "  vercel env add JWT_SECRET" -ForegroundColor Cyan
Write-Host "  vercel env add RAZORPAY_KEY_ID" -ForegroundColor Cyan
Write-Host "  vercel env add RAZORPAY_KEY_SECRET" -ForegroundColor Cyan
Write-Host "  vercel env add OPENAI_API_KEY" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then deploy to production:" -ForegroundColor Yellow
Write-Host "  vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Save your backend URL for frontend configuration!" -ForegroundColor Green

Set-Location ..
