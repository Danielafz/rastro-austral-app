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

## 🚨 1. Problemática
La provincia de Tierra del Fuego enfrenta una amenaza sobre su soberanía y patrimonio que suele abordarse de forma fragmentada:
1. **Emergencia Climática:** El acelerado retroceso del Glaciar Vinciguerra y el estrés hídrico de los turbales (nuestras principales reservas de agua y sumideros de carbono) por anomalías térmicas.
2. **Erosión Cultural:** La invisibilización de la toponimia y la historia de los pueblos originarios (Selk'nam, Yagán, Haush) en la cartografía tradicional.
3. **Desconexión Territorial:** La falta de herramientas pedagógicas que funcionen *offline* en zonas de reserva sin conectividad, dificultando el turismo responsable y la educación ambiental in situ.

## 🎯 2. Eje 04: Memoria, Cultura e Innovación Comunitaria
**Desafío concreto elegido:** *Fomento del turismo responsable y la educación biocultural mediante tecnología cívica offline.*

Elegimos este desafío para unir la identidad provincial, la memoria histórica y la preservación ambiental en una sola herramienta digital. Transformamos datos crudos institucionales y científicos en una interfaz visual, accesible y portátil que reconecta al habitante y al visitante con el valor estratégico del territorio austral.

## 💡 3. La Solución
**Rastro Austral** es una Aplicación Web Progresiva (PWA) de funcionamiento 100% offline (Ley 25.326) que actúa como un **Pasaporte de Expedición** interactivo. Sus pilares son:
* **Cartografía Descolonizada:** Mapas con toponimia originaria, alertas de sensibilidad ambiental y trazado interactivo de huellas.
* **Observatorio Climático Austral:** Un módulo de Data Science que integra un modelo predictivo entrenado con datos de la NASA e IANIGLA para proyectar el estado de los turbales y glaciares hacia 2030, democratizando la ciencia climática.
* **Economía y Patrimonio:** Visibilización de sitios históricos, senderos y creadores locales bajo el "Sello Identidad Fueguina".

## ⚙️ 4. Stack Tecnológico
* **Frontend & Interfaz:** HTML5, CSS3, JavaScript (Vanilla), TailwindCSS (vía CDN), diseño de alto contraste (WCAG AA).
* **Cartografía & GIS:** Leaflet.js, OpenStreetMap, OpenTopoMap, manipulación de geometrías GeoJSON.
* **Arquitectura PWA:** Service Worker (`sw.js`) con estrategia Cache-First y `manifest.json` para instalación nativa sin consumo de datos.
* **Data Science (Machine Learning):** Script en Python (`Pandas`, `NumPy`, `Scikit-Learn`) aplicando Regresión Ridge Polinomial para ingestar datos de la API de NASA POWER y exportar predicciones.
* **Privacidad Soberana:** Almacenamiento local mediante Web Storage API (`localStorage`), sin telemetría ni servidores intermedios.

## 🚀 5. Uso y Despliegue

### Entorno de Desarrollo Local
Al requerir validación de Service Workers, la app debe servirse mediante HTTP:
```bash
python -m http.server 8000
```

### Actualización del Modelo Climático
Para regenerar las predicciones con los últimos datos satelitales:
```bash
pip install pandas numpy scikit-learn requests
python scripts/generar_datos_observatorio.py
```

### Despliegue en la Nube
Optimizado para CI/CD directo en **Vercel** o **GitHub Pages**, garantizando el entorno seguro (HTTPS) exigido para la instalación PWA.

## 📚 6. Fuentes y Referencias Oficiales
* **IDETDF:** Infraestructura de Datos Espaciales de Tierra del Fuego.
* **IGN:** Instituto Geográfico Nacional de la República Argentina.
* **CADIC-CONICET:** Centro Austral de Investigaciones Científicas (estudios de turbales y ecosistemas).
* **IANIGLA:** Inventario Nacional de Glaciares.
* **NASA POWER:** Prediction Of Worldwide Energy Resources (API meteorológica).

## 📄 7. Licencias
Distribuido bajo Licencia **MIT**. Uso de cartografía según lineamientos de OpenStreetMap contributors. Fotografías de repositorios institucionales citados (Creative Commons CC BY-SA 4.0).
