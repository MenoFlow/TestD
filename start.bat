@echo off

start "Lancement de VScode" cmd.exe /k "code ."
:: Ouvrir un terminal pour le backend avec un titre spécifique
start "Backend Terminal" cmd.exe /k "cd /d C:\Users\Men0_0\Desktop\AssoManage-back\back && node index.js"

:: Ouvrir un autre terminal pour le frontend avec un titre spécifique
start "Frontend Terminal" cmd.exe /k "cd /d C:\Users\Men0_0\Desktop\AssoManage-back\front && npm run dev"

:: Attendre 2 secondes
timeout /t 2 /nobreak >nul  

:: Ouvrir Google Chrome avec l'URL http://localhost:5173/
start chrome http://localhost:5173/
