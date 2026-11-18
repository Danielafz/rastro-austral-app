# 🧭 Rastro Austral

> **Atlas y Diario de Exploración Territorial de Tierra del Fuego, Antártida e Islas del Atlántico Sur**  
> *Patagonia Austral · Cartografía interactiva, toponimia originaria, pasaporte pedagógico y ciencia de datos cívica.*

🔗 **App en vivo (PWA):** [rastro-austral.vercel.app](https://rastro-austral.vercel.app)

---

## Hackatón Soberanía Tech 
**Equipo:** `#VolverAlSur`

**Integrantes:**
* **Daniela Fernández** *(Referente)*
* **Victoria Fernandez Ruiz**
* **Carla Rosario Echeverría González**

---

## 🚨 1. Problemática
La provincia de Tierra del Fuego enfrenta una amenaza sobre su soberanía y patrimonio que suele abordarse de forma fragmentada:
1. **Emergencia Climática:** El acelerado retroceso del Glaciar Vinciguerra y el estrés hídrico de los turbales (nuestras principales reservas de agua dulce y sumideros de carbono) frente a variaciones térmicas.
2. **Erosión Cultural:** La invisibilización de la toponimia y la historia viva de los pueblos originarios (Selk'nam, Yagán, Haush) en la cartografía tradicional.
3. **Desconexión Territorial:** La falta de herramientas pedagógicas que funcionen *offline* en zonas de reserva sin conectividad, dificultando el turismo responsable y la educación ambiental in situ.

## 🎯 2. Eje 04: Memoria, Cultura e Innovación Comunitaria
**Desafío concreto elegido:** *Fomento del turismo responsable y la educación biocultural mediante tecnología cívica offline.*

Elegimos este desafío para unir la identidad provincial, la memoria histórica y la preservación ambiental en una sola herramienta digital. Transformamos datos institucionales, históricos y científicos en una interfaz visual, accesible y portátil que reconecta al habitante y al visitante con el valor estratégico del territorio austral.

## 💡 3. La Solución (Los 3 Pilares + Museo Austral 2D)
**Rastro Austral** es una Aplicación Web Progresiva (PWA) de funcionamiento 100% offline (Ley 25.326) que actúa como un **Pasaporte de Expedición** interactivo. Se estructura en tres pilares y una galería histórica interactiva:
* **1. Pilar Cultural (Cartografía Descolonizada):** Mapas con toponimia originaria, trazado interactivo de huellas y visibilización de creadores locales bajo el "Sello Identidad Fueguina". El explorador colecciona "sellos" offline al visitar y registrar hitos territoriales.
* **2. Pilar Científico (Observatorio Climático Austral):** Módulo de Ciencia de Datos Cívica que presenta escenarios ilustrativos de prototipo basados en tendencias ambientales regionales reportadas por CADIC-CONICET e IDETDF, modelados mediante extrapolación lineal simple (2015–2024 → 2030) y empaquetados en `data/observatorio_real.json`. Visualiza la evolución de días secos en turbales y la pérdida estimada de masa en el Glaciar Vinciguerra para concientización ciudadana.
* **3. Pilar de Acción (Bloqueo Turístico Digital y Alertas SAR):** Sistema de alerta temprana basado en capas vectoriales pre-empaquetadas en formato GeoJSON (`data/alertas_turbales.geojson`) para garantizar disponibilidad 100% offline en territorio sin requerir conectividad de red ni servidores intermedios. Si un área presenta alerta crítica de estrés hídrico o riesgo ambiental, la PWA intercepta la navegación del usuario in situ y despliega un modal pedagógico de "Zona Restringida", orientándolo hacia senderos seguros y preservando los ecosistemas frágiles.
* **4. Museo Austral 2D (Galería Histórica e Identitaria):** Espacio pedagógico inmersivo que permite recorrer los pasillos de un museo elegante patagónico guiando al Pingüino Mascota para descubrir 29 obras históricas y bioculturales curadas a lo largo de 9 salas temáticas (6 de historia y memoria y 3 de patrimonio natural), con fichas bilingües y fotografías históricas reales de dominio público.

---

## 🏛️ 3.1. Museo Austral 2D: Patrimonio Vivo de Tierra del Fuego

El **Museo Austral 2D** es una experiencia interactiva accesible desde el botón `"🏛️ Museo"` en el `<header>` (escritorio) y el 5.º botón de la barra `#mobile-bottom-nav` (móvil).

### Estética y Escenario Patagónico
Diseñado con una atmósfera de **Museo Elegante Patagónico**:
* **Muros:** Acabado superior en verde bosque profundo (`#172A27`) con sutiles franjas victorianas y zócalos en madera cálida de lenga patagónica (`#5A351C` / `#2B160A`) con molduras en bronce envejecido.
* **Piso:** Parquet entablonado de madera nativa con perspectiva y reflejos sutiles.
* **Iluminación Cenital:** Focos cenitales sobre cada marco que respiran suavemente (`@keyframes luzCenitalRespiracion`) con motas de polvo dorado suspendidas en el haz de luz.
* **Protagonista Animado:** El explorador guía a nuestra **Mascota Pingüino Rey de Rastro Austral** (plumaje azul marino oscuro, bufanda roja y amarilla, remera blanca oficial con el isotipo de la brújula en la espalda y patitas naranjas), con animación orgánica de paso balanceado (*waddle*).

### Las 9 Salas Temáticas (`SALAS_MUSEO`)
La colección contiene 29 obras patrimoniales (6 salas de historia y memoria + 3 salas de biodiversidad y ecosistemas), curadas bilingüemente (`es` / `en`) con fotografías reales de dominio público de Wikimedia Commons:

**Bloque Histórico y de Soberanía:**
1. **Sala 1: Origen del Nombre e Historia de Tierra del Fuego:** El cruce de Hernando de Magallanes en 1520, el avistamiento de las fogatas canoeras que bautizaron *"Tierra de los Fuegos"* y la primera cartografía antigua de la *Terra Australis Incognita*.
2. **Sala 2: Pueblos Originarios:** Culturas ancestrales Selk'nam, Yámana/Yagán, Haush y Kawésqar: caza en la estepa, navegación en canoas de corteza de guindo por el Canal Beagle y la ceremonia sagrada del Hain.
3. **Sala 3: Expediciones, Navegantes y Naufragios:** La expedición del HMS Beagle con Charles Darwin y Robert FitzRoy, el mítico Faro del Fin del Mundo (San Juan de Salvamento) en Isla de los Estados y los naufragios en el Cabo de Hornos y el estrecho de Le Maire (como el Desdémona).
4. **Sala 4: Pioneros, Estancias y Fiebre del Oro:** Los lavaderos auríferos de Julio Popper en El Páramo (1886), la fundación salesiana de La Candelaria en Río Grande por Monseñor Fagnano y el establecimiento de la histórica Estancia Harberton por la familia Bridges.
5. **Sala 5: Ushuaia, el Presidio y la Puerta Antártica:** La colonia penal que levantó la capital fueguina, el Ferrocarril Austral Fueguino ("Tren de los Presos") y el rol geopolítico y logístico de Ushuaia como puerta de entrada a la Antártida Argentina.
6. **Sala 6: Islas Malvinas (Historia y Memoria - 5 obras):** Dedicada exclusivamente a la historia, soberanía y memoria permanente del archipiélago: la Cartografía Histórica del Atlántico Sur (1764–1820); la Comandancia Política y Militar de 1829 bajo Luis Vernet; la Resistencia de 1833 encabezada por el Gaucho Antonio Rivero; el Conflicto del Atlántico Sur de 1982 y el rol de Tierra del Fuego; y la Plaza Islas Malvinas y Monumento a los Caídos en Ushuaia con su cenotafio y llama eterna.

**Bloque de Patrimonio Natural y Biocultural:**
7. **Sala 7: Flora Fueguina y Bosques Subantárticos (3 obras):** Los bosques andino-patagónicos de lenga, guindo y ñire (el bosque caducifolio más austral del planeta); el fruto emblemático del calafate y sotobosque nativo; y las gigantescas praderas submarinas de algas cachiyuyo (Macrocystis pyrifera) en el Canal Beagle.
8. **Sala 8: Fauna Austral y Santuario Marino (3 obras):** Las colonias de pingüinos rey, magallánicos y de penacho amarillo (Isla Martillo); las tropas de guanacos silvestres adaptadas a la estepa y el bosque fueguino; y las colonias de lobos marinos, cormoranes imperiales y albatros del Canal Beagle.
9. **Sala 9: Ecosistemas: Turbales, Glaciares y Relieve (3 obras):** Los turbales milenarios de musgo Sphagnum (reservorios de agua dulce y sumideros de carbono); los glaciares de circo Martial y Vinciguerra coronando Ushuaia; y los singulares "ríos de piedra" (*stone runs*) y geoformas periglaciares del extremo sur y Malvinas.

### Controles Mobile-First y Accesibilidad
* **Móvil:** **Joystick circular táctil** (`84x84px`) en la esquina inferior izquierda con perilla arrastrable con físicas de resorte para caminar izquierda/derecha suavemente (`requestAnimationFrame`). Botón flotante **"Salas"** para saltar instantáneamente a cualquiera de las 9 salas.
* **Escritorio:** Teclas de cursor `←` / `→` o `A` / `D`, arrastre con ratón o rueda de desplazamiento (*mouse wheel*).
* **Interacción por Proximidad:** Al acercar la mascota a menos de 140px de una obra, el foco cenital se intensifica, el marco de lenga y bronce resplandece y emerge la píldora `"Tocá la foto"` / `"Tap photo"`.
* **Ficha de Obra (Bottom Sheet Pergamino):** Al tocar el cuadro iluminado, se despliega una tarjeta color marfil/pergamino (`#F4F1EA`) con miniatura enmarcada, título en serif editorial, año, lugar, descripción histórica completa, crédito del archivo y una etiqueta interactiva que vincula la pieza con su hito territorial en el mapa (ej. `"📍 Corresponde al hito: Faro Les Éclaireurs"`).

### Modo Offline y Resiliencia Visual
* **Caché Dinámico en Service Worker (`sw.js`):** Las fotografías históricas externas de `upload.wikimedia.org` se interceptan y almacenan automáticamente en caché (`cache-first` con captura de respuestas opacas), asegurando que una vez vistas funcionen 100% offline.
* **Fallback SVG Elegante:** Si la aplicación se inicia sin conexión antes de haber cargado alguna imagen, la función `generarSvgFallbackObra()` inyecta dinámicamente un grabado vectorial en sepia y bronce con el título y año de la pieza, evitando recuadros rotos.

### ¿Cómo sumar nuevas obras o salas?
Para expandir el museo, editá `js/museo-data.js` agregando un objeto a `SALAS_MUSEO`:
```javascript
{
  id: "sala-7",
  numero: 7,
  titulo: { es: "Título en Español", en: "English Title" },
  subtitulo: { es: "Subtítulo descriptivo", en: "Descriptive subtitle" },
  descripcionCorta: { es: "Resumen breve", en: "Brief summary" },
  icono: "🏛️",
  obras: [
    {
      id: "obra-01",
      titulo: { es: "Nombre de la Obra", en: "Artwork Name" },
      anio: "Año histórico",
      lugar: { es: "Ubicación en TDF", en: "Location in TDF" },
      descripcion: { es: "Contexto histórico...", en: "Historical context..." },
      credito: "Archivo o Colección (Dominio Público)",
      imagenUrl: "https://upload.wikimedia.org/.../archivo.jpg",
      hitoRelacionado: { es: "Nombre de Hito en Mapa", en: "Map Landmark Name" }
    }
  ]
}
```

## ⚙️ 4. Stack Tecnológico
* **Frontend & Interfaz:** HTML5, CSS3, JavaScript (Vanilla), TailwindCSS (vía CDN), Chart.js (vía CDN), diseño de alto contraste y accesibilidad auditiva (WCAG 2.1 AA / Ley 26.653).
* **Cartografía & GIS:** Leaflet.js, OpenStreetMap, OpenTopoMap, capas vectoriales GeoJSON nativas (`data/areas_protegidas.geojson`, `data/alertas_turbales.geojson`).
* **Arquitectura PWA:** Service Worker (`sw.js`) con estrategia Cache-First y `manifest.json` para instalación y funcionamiento 100% autónomo sin consumo de datos móviles.
* **Datos & Modelado Cívico:** Series y delimitaciones pre-empaquetadas en formato JSON (`data/observatorio_real.json`, `data/hitos.json`) basadas en tendencias históricas documentadas y extrapolación lineal simple.
* **Privacidad Soberana:** Almacenamiento local mediante Web Storage API (`localStorage`), sin telemetría ni servidores intermedios (Ley 25.326).

## 🚀 5. Uso y Despliegue

### Entorno de Desarrollo Local
Al requerir validación de Service Workers, la app debe servirse mediante un servidor HTTP local:
```bash
python -m http.server 8000
```
Luego, abrir en el navegador: `http://localhost:8000`

### Disponibilidad Offline Garantizada
Todos los datos (hitos territoriales, polígonos de áreas naturales protegidas, alertas tempranas de turbales y series del observatorio climático) se encuentran pre-empaquetados localmente dentro de la carpeta `data/`. Esto asegura que la aplicación funcione de manera completamente autónoma desde el primer momento, incluso en zonas remotas de montaña o bosque sin señal celular.

### Despliegue en la Nube
Optimizado para despliegue estático continuo en **Vercel** u otras plataformas JAMstack, garantizando el protocolo seguro (HTTPS) exigido para la instalación PWA.

## 📚 6. Fuentes Oficiales y Bibliografía

### Fuentes Territoriales, Históricas y Comunitarias Específicas
* **[Municipio de Río Grande — Historia y Memoria Selk'nam](https://turismo.riogrande.gob.ar/historiaselknam/):** Respalda los antecedentes históricos, memoria viva del pueblo Selk'nam, el rol histórico de la Misión Salesiana (`rg-01`) y el reconocimiento del patrimonio originario en el norte de la Isla Grande (`rg-03`).
* **[Pueblos Originarios — Cosmovisión y Toponimia Selk'nam](https://pueblosoriginarios.com/sur/patagonia/selknam/selknam.html):** Respalda la toponimia ancestral de *Karukinka*, la división territorial en *haruwen*, el significado de *Tol-wen* («en el corazón») en `tol-01`, el lago *Khami* en `tol-02` y la cosmovisión de los antepasados míticos *Howenh*.
* **[Municipio de Tolhuin — Atención a la Comunidad](https://tolhuin.gob.ar/atencion-a-la-comunidad/):** Respalda la articulación institucional, servicios comunitarios y vinculación con las áreas de cultura y desarrollo local para los talleres y cooperativas de oficios fueguinos en Tolhuin (`tol-04`, `taller-hilado-tolhuin`).

### Repositorios Científicos y Cartográficos Institucionales
* **IDETDF (Infraestructura de Datos Espaciales de Tierra del Fuego):** Capas de delimitación territorial, áreas protegidas y referencias geográficas provinciales.
* **CADIC-CONICET (Centro Austral de Investigaciones Científicas):** Publicaciones y reportes ambientales de referencia sobre la dinámica hídrica de turbales fueguinos y retroceso de cuerpos glaciares.
* **Convención Ramsar:** Información sobre turbales y humedales de importancia internacional en Tierra del Fuego.
* **IGN (Instituto Geográfico Nacional de la República Argentina):** Cartografía base, límites oficiales y toponimia geográfica nacional.
* **OpenStreetMap & OpenTopoMap Contributors:** Teselas cartográficas base y curvas de nivel topográficas bajo licencia abierta ODbL.

## 📄 7. Licencias
Distribuido bajo Licencia **MIT**. Uso de cartografía según lineamientos de OpenStreetMap contributors. Fotografías y datos de repositorios institucionales citados (Creative Commons CC BY-SA 4.0).
