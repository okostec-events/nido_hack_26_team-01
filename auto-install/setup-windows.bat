@echo off
setlocal

REM Move from auto-install\ up to the repo root
cd /d "%~dp0\.."
set "PROJECT_DIR=%CD%"

echo.
echo =====================================
echo  Nido Hack '26 -- Auto Install (Win)
echo =====================================
echo  Project folder: %PROJECT_DIR%
echo.

REM 1. Install VS Code (skip if 'code' command is already available)
where code >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo [OK] VS Code already installed, skipping
) else (
  echo ^> Installing VS Code...
  winget install -e --id Microsoft.VisualStudioCode --accept-package-agreements --accept-source-agreements --silent
)

REM 2. Install Node.js LTS (skip if 'node' is already available)
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo [OK] Node.js already installed, skipping
) else (
  echo ^> Installing Node.js LTS...
  winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
)

REM 3. Install Git (skip if 'git' is already available)
where git >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo [OK] Git already installed, skipping
) else (
  echo ^> Installing Git...
  winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements --silent
)

REM 4. Install GitHub Desktop (no simple CLI check - let winget handle duplicates)
if exist "%LOCALAPPDATA%\GitHubDesktop\GitHubDesktop.exe" (
  echo [OK] GitHub Desktop already installed, skipping
) else (
  echo ^> Installing GitHub Desktop...
  winget install -e --id GitHub.GitHubDesktop --accept-package-agreements --accept-source-agreements --silent
)

REM 5. Refresh PATH so newly installed 'code' and 'git' work in this session
set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Microsoft VS Code\bin;C:\Program Files\Git\cmd;C:\Program Files\nodejs"

REM 6. Verify 'code' command is now available
where code >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo.
  echo WARNING: 'code' command not found in PATH.
  echo Close this window, then double-click the script again.
  echo The PATH will be refreshed on the second run.
  pause
  exit /b 1
)

REM 7. Install Cline AI extension for VS Code (idempotent)
echo.
echo ^> Installing Cline AI extension...
code --install-extension saoudrizwan.claude-dev

REM 8. Open the project in VS Code
echo.
echo ^> Opening project in VS Code...
code "%PROJECT_DIR%"

echo.
echo [DONE] VS Code should now be open.
echo Next: in VS Code, double-click 'index.html' in the left sidebar
echo to start the Hackathon Clicker game.
echo.
pause
