@echo off
echo Starting University DataHub Backend and Frontend...

REM Start Backend
start "Backend" cmd /k "cd /d %~dp0University_DataHub_Backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
start "Frontend" cmd /k "cd /d %~dp0University_DataHub_Frontend && npm run dev"

echo Servers are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this script (servers will continue running).
pause >nul