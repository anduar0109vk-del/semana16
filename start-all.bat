@echo off
title CoffeeCraft Suite
echo ========================================================
echo        BIENVENIDO A COFFEECRAFT SUITE 
echo ========================================================
echo [1/2] Iniciando Backend Spring Boot en :8080...
start "CoffeeCraft API [Spring Boot]" cmd /k "cd backend && mvn spring-boot:run"

echo [2/2] Iniciando Frontend Angular en :4200...
start "CoffeeCraft Web [Angular]" cmd /k "cd frontend && npm start"

echo.
echo Todo listo. Tus ventanas de terminal han sido abiertas.
echo Backend API:     http://localhost:8080/api/products
echo Base de Datos:   http://localhost:8080/h2-console
echo Frontend App:    http://localhost:4200
echo.
pause
