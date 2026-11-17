@echo off
title Sojib's Mart - Electric Heater Store Server
echo Starting Sojib's Mart Web Application...
cd /d "%~dp0"
set "PATH=%~dp0..\tools\node;%PATH%"
echo Server running at http://localhost:5000
echo Store page: http://localhost:5000/
echo Admin panel: http://localhost:5000/admin (Password: sojib123)
node server.js
pause
