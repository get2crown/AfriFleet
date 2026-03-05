# run_all.ps1 - launch backend and frontend in separate PowerShell windows
# run this from project root: powershell -ExecutionPolicy Bypass -File run_all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# backend window
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\backend'; . '$root\.venv\Scripts\Activate.ps1'; python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload`"" -WindowStyle Normal -Verb RunAs

# frontend window
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$root\frontend'; npm install; npm start`"" -WindowStyle Normal -Verb RunAs

Write-Host 'Started backend and frontend in new windows.'