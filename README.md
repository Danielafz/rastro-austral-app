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
1. **Emergencia Climática:** El acelerado retroceso del Glaciar Vinciguerra y el estrés hídrico de los turbales (nuestras principales reservas de agua y sumideros de carbono) por anomalías térmicas.
2. **Erosión Cultural:** La invisibilización de la toponimia y la historia de los pueblos originarios (Selk'nam, Yagán, Haush) en la cartografía tradicional.
3. **Desconexión Territorial:** La falta de herramientas pedagógicas que funcionen *offline* en zonas de reserva sin conectividad, dificultando el turismo responsable y la educación ambiental in situ.

## 🎯 2. Eje 04: Memoria, Cultura e Innovación Comunitaria
**Desafío concreto elegido:** *Fomento del turismo responsable y la educación biocultural mediante tecnología cívica offline.*

Elegimos este desafío para unir la identidad provincial, la memoria histórica y la preservación ambiental en una sola herramienta digital. Transformamos datos crudos institucionales y científicos en una interfaz visual, accesible y portátil que reconecta al habitante y al visitante con el valor estratégico del territorio austral.

## 💡 3. La Solución (Los 3 Pilares)
**Rastro Austral** es una Aplicación Web Progresiva (PWA) de funcionamiento 100% offline (Ley 25.326) que actúa como un **Pasaporte de Expedición** interactivo. Se estructura en tres pilares:
* **1. Pilar Cultural (Cartografía Descolonizada):** Mapas con toponimia originaria, trazado interactivo de huellas y visibilización de creadores locales bajo el "Sello Identidad Fueguina". El turista colecciona "sellos" offline al visitar lugares seguros.
* **2. Pilar Científico (Monitoreo Ambiental Soberano):** Un módulo de Data Science que integra Google Earth Engine (GEE) y datos de radar Sentinel-1 para medir el estrés hídrico real de los turbales, fundamentado con datos estadísticos del IPIEC y modelos predictivos de la NASA e IANIGLA.
* **3. Pilar de Acción (Bloqueo Turístico Digital):** Sistema de alerta temprana. Si el monitoreo satelital SAR detecta anomalías o riesgo de incendio, la PWA intercepta la navegación del usuario in situ y despliega un modal de "Zona Restringida", educándolo y desviándolo hacia rutas seguras.

## ⚙️ 4. Stack Tecnológico
* **Frontend & Interfaz:** HTML5, CSS3, JavaScript (Vanilla), TailwindCSS (vía CDN), diseño de alto contraste (WCAG AA).
* **Cartografía & GIS:** Leaflet.js, OpenStreetMap, OpenTopoMap, manipulación de geometrías GeoJSON.
* **Arquitectura PWA:** Service Worker (`sw.js`) con estrategia Cache-First y `manifest.json` para instalación nativa sin consumo de datos.
* **Data Science & Teledetección:** Script en Python (`Pandas`, `Scikit-Learn`, `earthengine-api`) consumiendo imágenes de radar SAR de Copernicus/Sentinel-1 vía Google Earth Engine.
* **Privacidad Soberana:** Almacenamiento local mediante Web Storage API (`localStorage`), sin telemetría ni servidores intermedios.

## 🚀 5. Uso y Despliegue

### Entorno de Desarrollo Local
Al requerir validación de Service Workers, la app debe servirse mediante HTTP:
```bash
python -m http.server 8000
```

### Actualización de Alertas Satelitales (SAR)
Para consultar la humedad del suelo en tiempo real y regenerar el GeoJSON de bloqueos:
```bash
pip install pandas numpy scikit-learn requests earthengine-api
python scripts/generar_alertas_sar.py
```

### Despliegue en la Nube
Optimizado para CI/CD directo en **Vercel**, garantizando el entorno seguro (HTTPS) exigido para la instalación PWA.

## 📚 6. Fuentes y Referencias Oficiales
* **IPIEC:** Instituto Provincial de Análisis e Investigación, Estadística y Censos (Tierra del Fuego).
* **IDETDF:** Infraestructura de Datos Espaciales de Tierra del Fuego.
* **Google Earth Engine & ESA:** Programa Copernicus (Satélites Sentinel-1 SAR).
* **IGN:** Instituto Geográfico Nacional de la República Argentina.
* **CADIC-CONICET:** Centro Austral de Investigaciones Científicas.
* **IANIGLA:** Inventario Nacional de Glaciares.
* **NASA POWER:** Prediction Of Worldwide Energy Resources (API meteorológica).

## 📄 7. Licencias
Distribuido bajo Licencia **MIT**. Uso de cartografía según lineamientos de OpenStreetMap contributors. Fotografías de repositorios institucionales citados (Creative Commons CC BY-SA 4.0).
