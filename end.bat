@echo off
:: Fermer tous les processus node.js
taskkill /f /im node.exe
taskkill /f /im npm.exe
taskkill /f /im cmd.exe
:: Fermer Google Chrome
taskkill /f /im chrome.exe
