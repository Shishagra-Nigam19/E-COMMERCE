# Quick Deploy Script for Frontend

Write-Host "🚀 Deploying Frontend to Vercel..." -ForegroundColor Cyan

# Check if vercel is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

# Navigate to frontend
Set-Location frontend

Write-Host ""
Write-Host "⚠️  Before deploying, ensure you've updated .env with your backend URL:" -ForegroundColor Yellow
Write-Host "  REACT_APP_API_URL=https://your-backend-url.vercel.app" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Have you updated the .env file? (y/n)"

if ($continue -ne "y") {
    Write-Host "❌ Please update .env first, then run this script again" -ForegroundColor Red
    Set-Location ..
    exit 0
}

Write-Host "✅ Starting deployment..." -ForegroundColor Green
Write-Host ""
Write-Host "Please follow the prompts:" -ForegroundColor Yellow
Write-Host "  1. Set up and deploy? → Yes" -ForegroundColor White
Write-Host "  2. Which scope? → Select your account" -ForegroundColor White
Write-Host "  3. Link to existing project? → No (first time) or Yes (redeployment)" -ForegroundColor White
Write-Host "  4. Project name? → ecommerce-frontend" -ForegroundColor White
Write-Host "  5. Directory? → ./" -ForegroundColor White
Write-Host "  6. Override settings? → No" -ForegroundColor White
Write-Host ""

# Run vercel
vercel

Write-Host ""
Write-Host "⚠️  Don't forget to set environment variables!" -ForegroundColor Yellow
Write-Host "Run:" -ForegroundColor Yellow
Write-Host "  vercel env add REACT_APP_API_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then deploy to production:" -ForegroundColor Yellow
Write-Host "  vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Deployment complete! 🎉" -ForegroundColor Green

Set-Location ..
