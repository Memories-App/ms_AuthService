@echo off

REM Check if the image exists
docker inspect ms_authservice > nul 2>&1
if %errorlevel% equ 0 (
    REM Delete the existing image
    docker rmi ms_authservice
)

REM Build the image
docker build -t ms_authservice .

REM Check if the image was created
echo Current images:
docker images
