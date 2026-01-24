$ErrorActionPreference = "Stop"

Write-Host "Building project..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Navigating to build directory..."
Set-Location build

Write-Host "Initializing temporary git repo..."
git init
git checkout -b gh-pages

Write-Host "Adding files..."
git add -A
git commit -m "deploy: manual deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "Pushing to remote..."
git push -f https://github.com/thekadang/unina.git gh-pages

Write-Host "Deployment complete!"
Set-Location ..
