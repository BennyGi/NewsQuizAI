@echo off
echo Setting up News Quiz Generator Scheduled Task
echo ============================================

set TASK_NAME=NewsQuizDailyGenerator
set SCRIPT_PATH=%~dp0
set BACKEND_PATH=%SCRIPT_PATH%backend
set EXEC_PATH=%BACKEND_PATH%\bin\Release\net7.0\NewsQuizGenerator.exe

echo Creating daily task to run at midnight...

REM Create the scheduled task
schtasks /create /tn %TASK_NAME% /tr "%EXEC_PATH%" /sc daily /st 00:00 /ru SYSTEM /f

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Task created successfully!
    echo The quiz will be generated automatically at midnight every day.
) else (
    echo.
    echo Failed to create scheduled task.
    echo You may need to run this script as administrator.
)

echo.
echo Press any key to exit.
pause > nul