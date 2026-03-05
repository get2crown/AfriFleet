@echo off
REM Start both backend and frontend in separate command windows
cd /d %~dp0

REM backend: activate virtual environment then run uvicorn
start "Backend" cmd /k "cd /d %~dp0\backend && .\..\Scripts\activate.bat && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

REM frontend: install deps if missing then start React dev server
start "Frontend" cmd /k "cd /d %~dp0\frontend && npm install && npm start"

echo Launched backend and frontend. Close these windows to stop them.
pause