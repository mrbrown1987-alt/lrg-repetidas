#!/bin/bash
# Doble clic para previsualizar la web en local (necesario para probar la exportación).
cd "$(dirname "$0")" || exit 1
echo "LRG Duplicates → http://localhost:8000"
echo "Pulsa Ctrl+C para detener el servidor."
python3 -m http.server 8000
