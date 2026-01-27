
# Manual Deployment Script
Write-Host "Building project..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed"
    exit $LASTEXITCODE
}

Write-Host "Navigating to build directory..."
cd build

Write-Host "Initializing git..."
git init
git checkout -b gh-pages
git add .
git commit -m "Manual Deploy"

Write-Host "Pushing to GitHub Pages..."
git push -f https://github.com/thekadang/unina.git gh-pages

Write-Host "Comparison: Deployment Complete"
