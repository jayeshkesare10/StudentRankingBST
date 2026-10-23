@echo off
echo ========================================================
echo  Student Ranking System Using BST - Fullstack Launcher
echo ========================================================
echo.

:: 1. Compile C++ backend if not already compiled
if not exist "backend\server.exe" (
    echo [1/3] Compiling C++ BST Backend with g++...
    g++ -O2 -std=c++14 backend\server.cpp -lws2_32 -o backend\server.exe
    if errorlevel 1 (
        echo [ERROR] Failed to compile C++ backend. Ensure g++ is on your PATH.
        pause
        exit /b 1
    )
    echo [OK] C++ backend compiled successfully.
) else (
    echo [1/3] C++ backend executable verified (backend\server.exe).
)

:: 2. Start C++ backend in a new window
echo [2/3] Launching C++ BST Backend Server on http://localhost:8080...
start "C++ BST Backend (Port 8080)" cmd /k "backend\server.exe"

:: 3. Start React Frontend
echo [3/3] Starting Vite React Frontend on http://localhost:5173...
echo.
echo ========================================================
echo  Open your browser at: http://localhost:5173/
echo ========================================================
echo.
npm run dev

pause
