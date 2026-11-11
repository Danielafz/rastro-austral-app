# 🧭 Rastro Austral

> **Atlas y Diario de Exploración Territorial de Tierra del Fuego, Antártida e Islas del Atlántico Sur**  
> *Patagonia Austral · Cartografía interactiva, toponimia originaria, pasaporte pedagógico y ciencia de datos cívica.*

---

## 🏆 Hackatón Soberanía Tech 
**Equipo:** `#VolverAlSur`

**Integrantes:**
* **Daniela Fernández** *(Referente)*
* **Victoria Fernandez Ruiz**
* **Carla Rosario Echeverría González**

---

## 🚨 1. Problemática
La provincia de Tierra del Fuego enfrenta una triple amenaza sobre su soberanía y patrimonio:
1. **Emergencia Climática:** El acelerado retroceso del Glaciar Vinciguerra y el estrés hídrico de los turbales (nuestras principales reservas de agua y sumideros de carbono) por anomalías térmicas.
2. **Erosión Cultural:** La invisibilización de la toponimia y la historia de los pueblos originarios (Selk'nam, Yagán, Haush) en la cartografía tradicional.
3. **Desconexión Territorial:** La falta de herramientas de exploración que funcionen *offline* en zonas de reserva sin conectividad, dificultando la educación ambiental y la trazabilidad del impacto humano.

## 🎯 2. Eje Estratégico
El proyecto se enmarca en el **Eje 04**, abordando la intersección entre **Soberanía, Identidad y Preservación**. Utilizamos la tecnología cívica para transformar datos crudos institucionales en una herramienta pedagógica que reconecta al habitante y al visitante con el valor estratégico del territorio austral.

## 💡 3. La Solución
**Rastro Austral** es una Aplicación Web Progresiva (PWA) de funcionamiento 100% offline (Ley 25.326) que actúa como un **Pasaporte de Expedición** interactivo. Sus pilares son:
* **Cartografía Descolonizada:** Mapas con toponimia originaria, alertas de sensibilidad ambiental y trazado interactivo de huellas.
* **Observatorio Climático Austral:** Un módulo de Data Science que integra un modelo predictivo entrenado con datos de la NASA e IANIGLA para proyectar el estado de los turbales y glaciares hacia 2030, traduciendo datos complejos a gráficos comprensibles para la comunidad.
* **Economía y Patrimonio:** Visibilización de sitios de patrimonio, senderos protegidos y polos de economía creativa (Sello Identidad Fueguina).

## ⚙️ 4. Tecnologías (Stack Técnico)
El proyecto se construyó bajo principios de eficiencia, portabilidad y despliegue rápido:
* **Frontend & Interfaz:** HTML5, CSS3, JavaScript (Vanilla), TailwindCSS (vía CDN para estilización rápida), diseño de alto contraste (WCAG AA).
* **Cartografía & GIS:** Leaflet.js, OpenStreetMap, OpenTopoMap, y manipulación de geometrías espaciales GeoJSON.
* **Arquitectura PWA:** Service Worker (`sw.js`) con caché estático y `manifest.json` para instalación nativa y uso sin conexión.
* **Data Science (Machine Learning):** Script en Python (`Pandas`, `NumPy`, `Scikit-Learn`) aplicando Regresión Ridge Polinomial para ingestar datos de la API de NASA POWER y exportar predicciones al `observatorio_real.json`.
* **Almacenamiento Local:** Web Storage API (`localStorage`) para garantizar la soberanía de datos del usuario sin telemetría externa.

## 🚀 5. Guía de Uso y Despliegue

### Entorno de Desarrollo Local
Al requerir validación de Service Workers, la app debe servirse mediante HTTP:
```bash
# Servidor local rápido con Python
python -m http.server 8000
```
Luego abrí [http://localhost:8000](http://localhost:8000) en tu navegador. También podés iniciarlo con `npx serve .` o la extensión **Live Server**.

## 📚 6. Fuentes y Referencias
* **IDETDF:** Infraestructura de Datos Espaciales de Tierra del Fuego.
* **IGN:** Instituto Geográfico Nacional de la República Argentina.
* **CADIC-CONICET:** Centro Austral de Investigaciones Científicas.
* **IANIGLA-CONICET & WGMS:** Inventario Nacional de Glaciares (Glaciar Vinciguerra, ID 3514).
* **NASA POWER API:** Series meteorológicas históricas de la región austral (`-54.80, -68.30`).
* **Toponimia:** Recopilación lingüística histórica de los pueblos originarios Selk'nam, Yagán y Haush.

## 📄 Licencia
Distribuido bajo licencia MIT. Consultá el archivo [LICENSE](LICENSE) para más detalles.
