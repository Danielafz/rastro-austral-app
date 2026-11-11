# 🧭 Rastro Austral

> **Atlas y Diario de Exploración Territorial de Tierra del Fuego, Antártida e Islas del Atlántico Sur**  
> *Patagonia Austral · Cartografía interactiva, toponimia originaria, pasaporte pedagógico y ciencia de datos cívica.*

---

## Hackatón Soberanía Tech 
**Equipo:** `#VolverAlSur`

**Integrantes:**
* **Daniela Fernández** *(Referente)*
* **Victoria Fernandez Ruiz**
* **Carla Rosario Echeverría González**

---

## 🏔️ Descripción

**Rastro Austral** es una aplicación web progresiva (PWA) diseñada para promover la exploración cultural, ambiental y geográfica consciente del territorio fueguino. Combina cartografía abierta, toponimia de los pueblos originarios (Selk'nam, Yagán, Haush), guías pedagógicas de conducta responsable, un pasaporte interactivo y un observatorio climático alimentado por modelos predictivos de datos reales.

---

## ✨ Características Principales

1. **🐧 Pantalla de Bienvenida Interactiva y Expedicionario:**
   - Presentación inmersiva con pingüino portador de la Antorcha Fueguina (llama viva animada y giro 3D continuo al ingresar).
   - Controles duales de accesibilidad integrados (selector de idioma ES / EN y alternador de Modo Claro / Oscuro) en la tarjeta inicial, sincronizados en tiempo real con la cabecera.
   - Persistencia local del perfil y visualización dinámica en la cabecera con opción de edición rápida.

2. **🌓 Modo Claro y Modo Oscuro (Light / Dark Mode) y Calibración WCAG AA:**
   - Conmutación fluida entre estética polar oscura y visualización diurna alpina de alto contraste mediante los botones `#btn-toggle-tema` y `#btn-tema-bienvenida`.
   - Calibración exhaustiva de contraste (WCAG AA) para textos secundarios, formularios, divisores y sellos de expedición.

3. **📍 Geolocalización en Tiempo Real:**
   - Botón interactivo `#btn-geolocalizacion` que ubica las coordenadas actuales del usuario en el territorio fueguino con animación de radar pulsante, vuelo dinámico de cámara y popup informativo.

4. **🗺️ Cartografía Abierta y Capas Base (Estándar y Relieve):**
   - Visualización fluida con Leaflet.js sobre OpenStreetMap estándar y OpenTopoMap, conmutables al instante.
   - Pines temáticos estilizados con silueta de pingüino patagónico y codificación por categoría (Patrimonio, Senderos, Economía Creativa).

5. **📊 Observatorio Climático Austral (Data Science Cívica):**
   - Módulo interactivo que proyecta el estrés hídrico en turbales y el retroceso de masa del Glaciar Vinciguerra hacia 2030.
   - **Pipeline de Datos Reales:** Modelado matemático en Python (`Pandas`, `Scikit-Learn`) aplicando Regresión Ridge Polinomial sobre series históricas de NASA POWER e IANIGLA.
   - **Diseño Pedagógico:** Gráficos adaptados para todas las edades con analogías cotidianas ("La gran esponja fueguina", "El tanque de agua natural") y medidores de alerta visuales.

6. **🖼️ Galería Visual y Tarjetas Fotográficas:**
   - Cada hito incorpora una tarjeta gráfica temática representativa de su entorno con acreditación institucional de fuentes fotográficas.

7. **🥾 Mi Rastro en el Mapa (Trazado con Huellas de Expedición):**
   - El recorrido entre los hitos visitados dibuja pisadas de zapatilla de trekking (`huella-calzado`) calculando el rumbo (*bearing*) y alternando pie izquierdo y derecho.

8. **🧭 Estimador de Travesía Acumulada y Tiempo de Marcha:**
   - Cálculo geodésico continuo (Haversine) de la distancia total acumulada entre los hitos visitados (`km`) y estimación inteligente del tiempo de expedición.

9. **🌱 Medidor de Huella Consciente y Mención "Guardián Austral":**
   - Contador en tiempo real de puntos de preservación por compromiso ambiental y cultural, con distinción honorífica animada.

10. **📖 Modal Completo de Pasaporte de Expedición:**
    - Vista ampliada tipo libreta de explorador exhibiendo todas las estampillas, sellos de estado, toponimia y las notas de campo guardadas.

11. **🔍 Filtros y Navegación Territorial Avanzada:**
    - Panel de búsqueda unificado y fijo con segmentación por categoría, progreso del explorador (Visitados / Pendientes) y fragilidad del ecosistema.
    - Actualización y recálculo instantáneo del trazado de huellas al aplicar filtros.

12. **🌐 Accesibilidad Bilingüe y Audio-guía (TTS):**
    - Conmutador directo de idioma (ES / EN) y traducción integral de la interfaz.
    - Integración nativa con la Web Speech API (`SpeechSynthesis`) para narración por voz sin consumo de datos.

13. **📱 PWA y Funcionamiento Offline (Ley 25.326):**
    - Manifiesto de aplicación web (`manifest.json`) y Service Worker (`sw.js`) con estrategia *Cache-First* para exploración sin conexión en rutas sin señal.
    - Almacenamiento exclusivo y soberano en `localStorage` (cero telemetría), permitiendo exportar la bitácora en `.txt`.

---

## 📁 Estructura del Proyecto

```text
rastro-austral/
├── assets/                  # Recursos gráficos y multimedia
├── css/
│   └── styles.css           # Estilos personalizados, tipografías y sombras
├── data/
│   ├── hitos.json           # Dataset territorial con toponimia y bilingüismo
│   ├── areas_protegidas...  # Geometrías GeoJSON
│   └── observatorio_real.json # Proyecciones climáticas a 2030 generadas por el modelo
├── js/
│   ├── app.js               # Lógica del mapa Leaflet, gráficos y UI reactiva
│   └── storage.js           # Gestor de persistencia local y exportación
├── scripts/
│   └── generar_datos_observatorio.py # Script en Python (Pandas/Sklearn) para ML y API NASA
├── icon.svg                 # Isologotipo e icono PWA
├── index.html               # Estructura principal accesible y responsive
├── manifest.json            # Manifiesto PWA para instalación nativa
└── sw.js                    # Service Worker con caché para modo Offline
```

