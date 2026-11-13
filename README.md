# Piano Peque 🎹

Aplicación web interactiva para niños de 4+ años inspirada en *Guitar Hero* / *Synthesia*, diseñada específicamente para colocarse en el atril de un piano digital (como el **Casio Privia**) mediante conexión USB-MIDI.

## ✨ Características Principales

1. **Cascada de Notas tipo Guitar Hero (Canvas 60 FPS):**
   - Las notas caen hacia la línea de impacto con longitud proporcional a su duración.
   - Cada bloque muestra el nombre de la nota en solfeo tradicional (**Do, Re, Mi...**) y notación anglosajona (**C, D, E...**), coincidiendo con las pegatinas del teclado físico.

2. **Doble Etiquetado y Colores de Pegatinas:**
   - Teclado visual con pegatinas idénticas a las físicas de la Casio Privia.
   - Selector en Ajustes para ajustar el color exacto de cada nota (**Do, Re, Mi, Fa, Sol, La, Si**) si tus pegatinas tienen tonos distintos.

3. **Modo Espera (Wait Mode) para 4 años:**
   - La canción se detiene en la nota exacta hasta que el niño pulse la tecla correcta en su piano Casio Privia.
   - Sin estrés ni penalización por error. Al acertar: chispas, estrellas y avance fluido.
   - También cuenta con **Modo Ritmo Continuo** con selector de velocidad (0.25x a 1.25x).

4. **Conexión MIDI Directa (Web MIDI API):**
   - Conecta tu Casio Privia por USB al portátil y la app la detectará automáticamente en Chrome / Edge.
   - Indicador visual verde en la barra superior.
   - Incluye sintetizador interno polifónico en Web Audio API (opción de silenciar si prefieres oír los altavoces de la Casio).
   - También admite teclado QWERTY (A=Do, S=Re, D=Mi...) y clics en pantalla para probarlo sin piano.

5. **Pentagrama Sincronizado Opcional:**
   - Botón directo para activar/desactivar la partitura tradicional con Clave de Sol.
   - Las notas del pentagrama tienen las cabezas coloreadas exactamente igual que las pegatinas.

6. **Cancionero Infantil y Carga de Archivos:**
   - Incluye 8 canciones populares infantiles:
     - *Estrellita ¿Dónde Estás?*
     - *Los Pollitos Dicen*
     - *Cumpleaños Feliz*
     - *La Vaca Lola*
     - *Himno a la Alegría*
     - *Campanita (Frère Jacques)*
     - *Un Elefante se Balanceaba*
     - *Cucú Cantaba la Rana*
   - Importador de archivos `.mid` (arrastrar y soltar).
   - Creador de canciones con notación sencilla (`C4:1 D4:1 E4:2`).

7. **Ajustes para Padres:**
   - Selector de mano derecha (melodía), ambas manos o mano izquierda (bajos).
   - Rango de teclas ampliable (2 octavas grandes o 3 octavas).
   - Botón de pantalla completa para aprovechar toda la pantalla del portátil.

## 🚀 Cómo Iniciar la Aplicación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
Abre la aplicación en Google Chrome o Microsoft Edge para habilitar la Web MIDI API.
