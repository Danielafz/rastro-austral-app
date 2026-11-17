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

## 💡 3. La Solución (Los 3 Pilares)
**Rastro Austral** es una Aplicación Web Progresiva (PWA) de funcionamiento 100% offline (Ley 25.326) que actúa como un **Pasaporte de Expedición** interactivo. Se estructura en tres pilares:
* **1. Pilar Cultural (Cartografía Descolonizada):** Mapas con toponimia originaria, trazado interactivo de huellas y visibilización de creadores locales bajo el "Sello Identidad Fueguina". El explorador colecciona "sellos" offline al visitar y registrar hitos territoriales.
* **2. Pilar Científico (Observatorio Climático Austral):** Módulo de Ciencia de Datos Cívica que presenta escenarios ilustrativos de prototipo basados en tendencias ambientales regionales reportadas por CADIC-CONICET e IDETDF, modelados mediante extrapolación lineal simple (2015–2024 → 2030) y empaquetados en `data/observatorio_real.json`. Visualiza la evolución de días secos en turbales y la pérdida estimada de masa en el Glaciar Vinciguerra para concientización ciudadana.
* **3. Pilar de Acción (Bloqueo Turístico Digital y Alertas SAR):** Sistema de alerta temprana basado en capas vectoriales pre-empaquetadas en formato GeoJSON (`data/alertas_turbales.geojson`) para garantizar disponibilidad 100% offline en territorio sin requerir conectividad de red ni servidores intermedios. Si un área presenta alerta crítica de estrés hídrico o riesgo ambiental, la PWA intercepta la navegación del usuario in situ y despliega un modal pedagógico de "Zona Restringida", orientándolo hacia senderos seguros y preservando los ecosistemas frágiles.

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
