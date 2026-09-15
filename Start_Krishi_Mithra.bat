@echo off
cd /d "%~dp0"
title Krishi Mithra - Master Launcher

echo ===================================================
echo   KRISHI MITHRA V2 - STARTING SYSTEM...
echo ===================================================
echo.

:: Kill any old hidden processes to free up ports
echo [STEP 1] Cleaning old processes...
taskkill /F /IM node.exe >nul 2>&1

:: Start Backend
echo [STEP 2] Launching Backend Engine...
start "Mithra-Backend" cmd /k "cd backend && npm run dev"

echo [Waiting 10 seconds for Database & Port 5000...]
timeout /t 10 /nobreak > nul

:: Start Frontend
echo [STEP 3] Launching Frontend UI...
:: We use 'localhost' specifically since your terminal shows that
start "Mithra-Frontend" cmd /k "npm run dev -- --port 5173"

echo [Waiting 10 seconds for UI Server...]
timeout /t 10 /nobreak > nul

:: Open Browser using localhost
echo [STEP 4] Opening Krishi Mithra...
start http://localhost:5173

echo.
echo ===================================================
echo   ✅ SUCCESS: System is running!
echo   If the site shows a cloud icon, wait 5 seconds
echo   and click REFRESH in your browser.
echo ===================================================
echo.
pause