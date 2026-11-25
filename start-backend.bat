@echo off
title CoffeeCraft - Backend Spring Boot (Puerto 8080)
echo ===================================================
echo     Iniciando Servidor Backend CoffeeCraft API
echo     URL API:     http://localhost:8080/api/products
echo     H2 Console:  http://localhost:8080/h2-console
echo ===================================================
cd backend
mvn spring-boot:run
pause
