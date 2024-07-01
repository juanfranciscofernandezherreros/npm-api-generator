@echo off
setlocal enabledelayedexpansion

REM Configura la URL de destino
set URL=http://localhost:8084/send

REM Lista de países
set countries=CountryA CountryB CountryC CountryD CountryE

REM Genera 500,000 peticiones
for /l %%x in (1, 1, 10) do (
    set "clave=User_%%x"
    set "message=Message_%%x"
    set "nombre=Nombre_%%x"
    set "apellido=Apellido_%%x"
    set /a "edad=!random! %% 100 + 1"
    set /a "paisIdx=!random! %% 5"
    setlocal enabledelayedexpansion
    set "pais=!countries:~!paisIdx!,1!"
    endlocal & set "pais=%pais%"
    curl -X POST -H "Content-Type: application/json" -d "{\"clave\":\"!clave!\",\"message\":\"!message!\",\"nombre\":\"!nombre!\",\"apellido\":\"!apellido!\",\"edad\":!edad!,\"pais\":\"!pais!\"}" %URL%
)

echo 500,000 requests have been sent successfully.
pause
