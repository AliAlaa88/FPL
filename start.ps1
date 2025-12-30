# PowerShell script to start backend and frontend

Write-Host "Starting FPL Development Environment..." -ForegroundColor Cyan

# Start server in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    Set-Location '$PSScriptRoot\server'
    Write-Host 'Installing npm dependencies...' -ForegroundColor Yellow
    npm install
    Write-Host 'Starting Express server...' -ForegroundColor Green
    npm run dev
"@

# Start client in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
    Set-Location '$PSScriptRoot\client'
    Write-Host 'Installing npm dependencies...' -ForegroundColor Yellow
    npm install
    Write-Host 'Starting Vite dev server...' -ForegroundColor Green
    npm run dev
"@

Write-Host "Both servers starting in separate terminals!" -ForegroundColor Green
