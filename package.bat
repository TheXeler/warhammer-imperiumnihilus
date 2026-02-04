@echo off
setlocal enabledelayedexpansion

set ZIP_FILE=warhammer-imperiumnihilus.zip

set TEMP_DIR=%TEMP%\warhammer_temp
mkdir "%TEMP_DIR%"
xcopy /E /I . "%TEMP_DIR%"

for %%i in (.idea package.sh package.bat) do (
    if exist "%TEMP_DIR%\%%i" (
        rmdir /S /Q "%TEMP_DIR%\%%i" >nul 2>&1 || del /F /Q "%TEMP_DIR%\%%i" >nul 2>&1
    )
)

powershell -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force"

rmdir /S /Q "%TEMP_DIR%"

echo Done