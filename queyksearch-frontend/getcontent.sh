#!/bin/bash

# Define el directorio de origen y el archivo de salida
DIRECTORIO="src/"
SALIDA="archivos.txt"

# Vacía el archivo de salida si ya existe
> "$SALIDA"

# Encuentra todos los archivos dentro de src/ excluyendo node_modules/
find "$DIRECTORIO" -type f -not -path "*/node_modules/*" | while read -r archivo; do
    echo "===== $archivo =====" >> "$SALIDA"
    cat "$archivo" >> "$SALIDA"
    echo -e "\n" >> "$SALIDA"
done

echo "Se ha creado '$SALIDA' con las rutas y contenidos de los archivos."
