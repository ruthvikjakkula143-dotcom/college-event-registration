@echo off
title College Event Registration Launcher
echo ====================================================
echo  Starting College Event Registration System...
echo ====================================================

REM Setup Java 17 and Maven paths if not already in system PATH
if exist "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot" (
    set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
    set "PATH=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot\bin;C:\Tools\apache-maven-3.9.9\bin;%PATH%"
)

echo [1/2] Launching Spring Boot Backend on http://localhost:8080 ...
start "College Events Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run "-Dspring-boot.run.profiles=h2""

echo [2/2] Launching Vite React Frontend on http://localhost:5173 ...
start "College Events Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for servers to start...
timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo ====================================================
echo  App running: http://localhost:5173
echo  Admin login: admin@college.edu / admin123
echo ====================================================
