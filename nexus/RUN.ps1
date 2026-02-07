# NEXUS - Ejecutar en PowerShell (Windows)
# Cópialo y pégalo en PowerShell, o ejecuta: .\RUN.ps1

Set-Location $PSScriptRoot

Write-Host "Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
npm run dev
