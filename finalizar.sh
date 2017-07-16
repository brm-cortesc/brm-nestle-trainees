#!/bin/sh
echo 'Borramos los archivos en dev'
rm publication/*.html
rm publication/css/style.css
mv publication/js/libs/ publication/
rm publication/js/*.js
mv publication/libs publication/js

echo 'Generamos assets y corte final'
gulp libs
gulp css
gulp minicss
gulp js
gulp js:ugly
gulp views
rm publication/**/concat.**.**
rm publication/css/style.css
rm -R publication/maps
gulp limpiar
echo 'Terminamos'
