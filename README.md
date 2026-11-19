# 🧭 Rastro Austral

> **Atlas y Diario de Exploración Territorial de Tierra del Fuego, Antártida e Islas del Atlántico Sur**  
> *Patagonia Austral · Cartografía oficial argentina, toponimia originaria, pasaporte pedagógico, museo 2D, seguridad en senderos y ciencia de datos cívica.*

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
La provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur enfrenta desafíos sobre su soberanía, seguridad ambiental y patrimonio que suelen abordarse de forma fragmentada:
1. **Emergencia Climática:** El acelerado retroceso del Glaciar Vinciguerra y el estrés hídrico de los turbales (nuestras principales reservas de agua dulce y sumideros de carbono) frente a variaciones térmicas.
2. **Erosión Cultural y Cartográfica:** La invisibilización de la toponimia ancestral de los pueblos originarios (Selk'nam, Yámana/Yagán, Haush y Kawésqar) y el uso de cartografía extranjera que omite la toponimia oficial argentina en las Islas Malvinas.
3. **Desconexión Territorial y Seguridad en Senderos:** La falta de herramientas pedagógicas, meteorológicas y de prevención de emergencias que funcionen *offline* en zonas de reserva y montaña sin señal celular.

## 🎯 2. Eje 04: Memoria, Cultura e Innovación Comunitaria
**Desafío concreto elegido:** *Fomento del turismo responsable y la educación biocultural mediante tecnología cívica offline.*

Elegimos este desafío para unir la identidad provincial, la soberanía territorial, la memoria histórica y la preservación ambiental en una sola herramienta digital. Transformamos datos institucionales, históricos, meteorológicos y científicos en una interfaz visual, accesible y portátil que reconecta al habitante y al visitante con el valor estratégico del territorio austral.

## 💡 3. La Solución (Los 3 Pilares + Museo Austral 2D + Seguridad y Clima)
**Rastro Austral** es una Aplicación Web Progresiva (PWA) de funcionamiento 100% offline (Ley 25.326) que actúa como un **Pasaporte de Expedición** interactivo con **26 hitos territoriales georreferenciados** (incluyendo Ushuaia, Tolhuin, Río Grande, Puerto Almanza, San Sebastián, Base Esperanza en Antártida Argentina y el Cementerio Militar Argentino de Darwin en Isla Soledad, Islas Malvinas):

* **1. Pilar Cultural (Cartografía Soberana y Descolonizada):**
  * **Cartografía Oficial Argentina:** Mapas base viales y topográficos del **Instituto Geográfico Nacional (IGN · Argenmap)** con vista satelital complementaria (**Esri World Imagery**), respetando plenamente la Ley 26.651 y la toponimia oficial en todo el territorio nacional e Islas Malvinas.
  * **Capa Visual de Toponimia Originaria y Soberanía:** Etiquetas geográficas dinámicas sobre el mapa que visibilizan las voces ancestrales (*Karukinká*, *Onashaga*, *Kami*, *Oushwaia*, *Lapataia*) junto con módulo de **Fonética Originaria** y síntesis de voz nativa.
  * **Sello Identidad Fueguina y Pasaporte Pedagógico:** Visibilización de talleres y cooperativas locales de comercio justo, trazado interactivo de huellas entre sitios visitados, fotografías reales de Wikimedia Commons con respaldo vectorial SVG offline y colección de sellos 3D con exportación a PDF.
* **2. Pilar Científico (Observatorio Climático Austral y Clima en Tiempo Real):**
  * **Observatorio Climático:** Módulo de Ciencia de Datos Cívica con gráficos vectoriales **SVG nativos 100% offline** (sin dependencias externas de librerías de gráficos) que modelan escenarios de días secos en turbales y pérdida estimada de masa en el Glaciar Vinciguerra (2015–2030) a partir de referencias de CADIC-CONICET, IANIGLA e IDETDF (`data/observatorio_real.json`).
  * **Clima Austral en Tiempo Real (`js/clima.js`):** Widget meteorológico integrado al selector de ciudades y GPS mediante la API abierta **Open-Meteo** (sin API Key, licencia CC BY 4.0), con temperatura, sensación térmica, viento y respaldo automático offline en `localStorage`.
* **3. Pilar de Acción (Bloqueo Turístico Digital, Alertas SAR y Guía de Emergencias):**
  * **Alertas Tempranas SAR (`data/alertas_turbales.geojson`):** Capas vectoriales basadas en monitoreo satelital Copernicus Sentinel-1 SAR. Si un turbal presenta estrés hídrico crítico, la PWA intercepta la navegación con un modal de *"Zona Restringida"* y redirige hacia senderos seguros.
  * **Guía de Caminata, Checklist y Líneas de Emergencia:** Modal preventivo accesible desde la barra superior con 8 recomendaciones de vestimenta, senderismo inclusivo y seguridad en montaña, checklist interactivo de mochila persistido en `localStorage` y directorio de teléfonos de emergencia por ciudad (`103` Defensa Civil, `101` Policía, `107` Salud, `100` Bomberos, `106` Prefectura Naval y Comisión de Auxilio) con llamada directa (`tel:`).
* **4. Museo Austral 2D (Galería Histórica y Natural):** Espacio pedagógico inmersivo que permite recorrer los pasillos de un museo elegante patagónico guiando al Pingüino Mascota para descubrir **29 obras históricas y bioculturales** curadas a lo largo de **9 salas temáticas** (6 de historia y memoria y 3 de patrimonio natural), con fichas bilingües, audioguía narrada y fotografías reales de Wikimedia Commons.

---

## 🏛️ 3.1. Museo Austral 2D: Patrimonio Vivo de Tierra del Fuego

El **Museo Austral 2D** es una experiencia interactiva accesible desde el botón `"Museo"` en el `<header>` (escritorio) y el 5.º botón de la barra `#mobile-bottom-nav` (móvil).

### Estética y Escenario Patagónico
Diseñado con una atmósfera de **Museo Elegante Patagónico**:
* **Muros:** Acabado superior en verde bosque profundo (`#172A27`) con sutiles franjas victorianas y zócalos en madera cálida de lenga patagónica (`#5A351C` / `#2B160A`) con molduras en bronce envejecido.
* **Piso:** Parquet entablonado de madera nativa con perspectiva y reflejos sutiles.
* **Iluminación Cenital:** Focos cenitales sobre cada marco que respiran suavemente (`@keyframes luzCenitalRespiracion`) con motas de polvo dorado suspendidas en el haz de luz.
* **Protagonista Animado:** El explorador guía a nuestra **Mascota Pingüino Rey de Rastro Austral** (plumaje azul marino oscuro, bufanda roja y amarilla, remera blanca oficial con el isotipo de la brújula en la espalda y antorcha encendida), con animación orgánica de paso balanceado (*waddle*).

### Las 9 Salas Temáticas (`SALAS_MUSEO`)
La colección contiene **29 obras patrimoniales** (6 salas de historia y memoria + 3 salas de biodiversidad y ecosistemas), curadas bilingüemente (`es` / `en`) con fotografías reales de Wikimedia Commons:

**Bloque Histórico y de Soberanía:**

1. **Sala 1: Origen del Nombre e Historia de Tierra del Fuego:** El cruce de Hernando de Magallanes en 1520, el avistamiento de las fogatas canoeras que bautizaron *"Tierra de los Fuegos"* y la primera cartografía antigua de la *Terra Australis Incognita*.
2. **Sala 2: Pueblos Originarios:** Culturas ancestrales Selk'nam, Yámana/Yagán, Haush y Kawésqar: caza en la estepa, navegación en canoas de corteza de guindo por el Canal Beagle y la ceremonia sagrada del Hain.
3. **Sala 3: Expediciones, Navegantes y Naufragios:** La expedición del HMS Beagle con Charles Darwin y Robert FitzRoy, el mítico Faro del Fin del Mundo (San Juan de Salvamento) en Isla de los Estados y los naufragios en el Cabo de Hornos y el estrecho de Le Maire (como el Desdémona).
4. **Sala 4: Pioneros, Estancias y Fiebre del Oro:** Los lavaderos auríferos de Julio Popper en El Páramo (1886), la fundación salesiana de La Candelaria en Río Grande por Monseñor Fagnano y la histórica Estancia Harberton por la familia Bridges.
5. **Sala 5: Ushuaia, el Presidio y la Puerta Antártica:** La colonia penal que levantó la capital fueguina, el Ferrocarril Austral Fueguino ("Tren de los Presos") y el rol geopolítico y logístico de Ushuaia como puerta de entrada a la Antártida Argentina.
6. **Sala 6: Islas Malvinas (Historia y Memoria - 5 obras):** Dedicada exclusivamente a la historia, soberanía y memoria permanente del archipiélago: la Cartografía Histórica del Atlántico Sur (1764–1820); la Comandancia Política y Militar de 1829 bajo Luis Vernet; la Resistencia de 1833 encabezada por el Gaucho Antonio Rivero; el Conflicto del Atlántico Sur de 1982 y el rol de Tierra del Fuego; y la Plaza Islas Malvinas y Monumento a los Caídos en Ushuaia con su cenotafio y llama eterna.

**Bloque de Patrimonio Natural y Biocultural:**

7. **Sala 7: Flora Fueguina y Bosques Subantárticos (3 obras):** Los bosques andino-patagónicos de lenga, guindo y ñire (el bosque caducifolio más austral del planeta); el fruto emblemático del calafate y sotobosque nativo; y las gigantescas praderas submarinas de algas cachiyuyo (*Macrocystis pyrifera*) en el Canal Beagle.
8. **Sala 8: Fauna Austral y Santuario Marino (3 obras):** Las colonias de pingüinos rey, magallánicos y de penacho amarillo (Isla Martillo); las tropas de guanacos silvestres adaptadas a la estepa y el bosque fueguino; y las colonias de lobos marinos, cormoranes imperiales y albatros del Canal Beagle.
9. **Sala 9: Ecosistemas: Turbales, Glaciares y Relieve (3 obras):** Los turbales milenarios de musgo *Sphagnum* (reservorios de agua dulce y sumideros de carbono); los glaciares de circo Martial y Vinciguerra coronando Ushuaia; y los singulares "ríos de piedra" (*stone runs*) y geoformas periglaciares del extremo sur y Malvinas.

### Controles Mobile-First y Accesibilidad
* **Móvil:** **Joystick circular táctil** (`84x84px`) en la esquina inferior izquierda con perilla arrastrable con físicas de resorte para caminar izquierda/derecha suavemente (`requestAnimationFrame`). Botón flotante **"Salas"** para saltar instantáneamente a cualquiera de las 9 salas.
* **Escritorio:** Teclas de cursor `←` / `→` o `A` / `D`, arrastre con ratón o rueda de desplazamiento (*mouse wheel*).
* **Interacción por Proximidad:** Al acercar la mascota a menos de 140px de una obra, el foco cenital se intensifica, el marco de lenga y bronce resplandece y emerge la píldora `"Tocá la foto"` / `"Tap photo"`.
* **Ficha de Obra (Bottom Sheet Pergamino):** Al tocar el cuadro iluminado, se despliega una tarjeta color marfil/pergamino (`#F4F1EA`) con miniatura enmarcada, título en serif editorial, año, lugar, descripción histórica completa, audioguía narrada, crédito del archivo y una etiqueta interactiva que vincula la pieza con su hito territorial en el mapa.

### Modo Offline y Resiliencia Visual
* **Caché Dinámico en Service Worker (`sw.js`):** Las fotografías históricas externas de `upload.wikimedia.org` y las teselas cartográficas del **IGN Argentina** se interceptan y almacenan automáticamente en caché (`cache-first`), asegurando que una vez vistas funcionen 100% offline.
* **Fallback SVG Elegante:** Si la aplicación se inicia sin conexión antes de haber cargado alguna imagen, `generarSvgFallbackObra()` (en el Museo) y los respaldos vectoriales locales en `assets/hitos/` (en el mapa) evitan recuadros rotos.

### ¿Cómo sumar nuevas obras o salas?
Para expandir el museo, editá `js/museo-data.js` agregando un objeto a `SALAS_MUSEO`:
```javascript
{
  id: "sala-10",
  numero: 10,
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

---

## ♿ 3.2. Accesibilidad Universal y Turismo Inclusivo (WCAG 2.1 AA · Ley 26.653)

Rastro Austral incorpora un sistema integral de accesibilidad digital y física para garantizar el derecho a la información territorial y el turismo inclusivo:
* **Panel Flotante de Accesibilidad Digital (`♿`):** Ubicado en la barra superior junto al selector de idiomas. Permite adaptar la experiencia en tiempo real con persistencia local (`localStorage`):
  - **Escala tipográfica variable:** Ajuste entre 100% (16px), 115% (18px) y 130% (20px) para facilitar la lectura sin distorsionar la grilla.
  - **Modo Alto Contraste:** Bordes reforzados, realce visual de botones y supresión de elementos de bajo contraste.
  - **Reducción de movimiento:** Desactiva transiciones y animaciones para personas con sensibilidad vestibular.
  - **Lector de voz integrado (Text-to-Speech):** Síntesis de voz nativa del navegador que lee en voz alta la ficha del hito seleccionado o el estado de la vista cartográfica.
* **Filtro y Marcadores de Accesibilidad Física en Territorio:**
  - Identificación de hitos territoriales adaptados para personas con movilidad reducida (rampas, pasarelas de madera, sanitarios accesibles y senderos adaptados) con insignia visible `♿ Accesible`.
  - Filtro booleano directo mediante botón píldora vectorial (`#btn-filtro-accesibles`) para visualizar únicamente sitios con infraestructura accesible.
* **Caminata Inclusiva y Senderismo Adaptado:** Recomendaciones específicas dentro del modal de Montaña y Emergencias sobre senderos accesibles y uso de sillas todoterreno tipo Joëlette en parques y reservas fueguinas en articulación con guardaparques y Defensa Civil (103).

---

## ⚙️ 4. Stack Tecnológico
* **Frontend & Interfaz:** HTML5 semántico, CSS3 modular (con variables, alto contraste y clases utilitarias de TailwindCSS), JavaScript Vanilla (ES6+ modular sin dependencias pesadas ni frameworks de empaquetado) y accesibilidad universal (WCAG 2.1 AA / Ley 26.653).
* **Cartografía Oficial Argentina & GIS Soberano:** Leaflet.js, mapas base oficiales del **Instituto Geográfico Nacional (IGN · Argenmap)** (viales y topográficos según Ley 26.651), vista satelital complementaria (**Esri World Imagery**), capa dinámica de toponimia originaria/soberanía y capas vectoriales GeoJSON nativas (`data/areas_protegidas.geojson`, `data/alertas_turbales.geojson`).
* **26 Hitos Territoriales & Media Abierta:** Cobertura de 26 sitios georreferenciados con resolución dinámica de fotografías reales en alta resolución (800px) mediante la API abierta de **Wikimedia Commons** con CORS (`origin=*`) y respaldo permanente offline en ilustraciones vectoriales SVG locales (`assets/hitos/`).
* **Meteorología Austral en Tiempo Real:** Integración con la API abierta de **Open-Meteo** (`js/clima.js`, sin API Key, licencia CC BY 4.0) con geolocalización GPS, selector de ciudades y caché local en `localStorage`.
* **Visualización Cívica:** Gráficos vectoriales **SVG nativos 100% offline** (sin dependencias externas de librerías de gráficos pesadas) para modelado de escenarios climáticos en turbales y glaciares.
* **Arquitectura PWA Offline-First:** Service Worker (`sw.js`) con estrategias Cache-First y Network-First dinámicas para teselas e imágenes, manifiesto web (`manifest.json`) e instalación autónoma en Android, iOS, Windows y Linux.
* **Datos & Modelado Cívico:** Series y delimitaciones pre-empaquetadas en formato JSON (`data/observatorio_real.json`, `data/hitos.json`) basadas en tendencias históricas documentadas y modelos científicos regionales.
* **Privacidad Soberana:** Almacenamiento local mediante Web Storage API (`localStorage`), sin rastreo, telemetría ni servidores intermedios de terceros (Ley 25.326).

---

## 🚀 5. Uso y Despliegue

### Entorno de Desarrollo Local
Al requerir validación de Service Workers y llamadas asíncronas con CORS, la app debe servirse mediante un servidor HTTP local:
```bash
python -m http.server 8000
```
Luego, abrir en el navegador: `http://localhost:8000`

### Disponibilidad Offline Garantizada
Todos los datos (26 hitos territoriales, polígonos de áreas naturales protegidas, alertas tempranas de turbales y series del observatorio climático) se encuentran pre-empaquetados localmente dentro de la carpeta `data/`. Esto asegura que la aplicación funcione de manera completamente autónoma desde el primer momento, incluso en zonas remotas de montaña o bosque sin señal celular.

### Despliegue en la Nube
Optimizado para despliegue estático continuo en **Vercel** u otras plataformas JAMstack, garantizando el protocolo seguro (HTTPS) exigido para la instalación PWA.

---

## 📚 6. Fuentes Oficiales y Bibliografía

### Fuentes Territoriales, Históricas y Comunitarias Específicas
* **[Municipio de Río Grande — Historia y Memoria Selk'nam](https://turismo.riogrande.gob.ar/historiaselknam/):** Respalda los antecedentes históricos, memoria viva del pueblo Selk'nam, el rol histórico de la Misión Salesiana (`rg-01`) y el reconocimiento del patrimonio originario en el norte de la Isla Grande (`rg-03`).
* **[Pueblos Originarios — Cosmovisión y Toponimia Selk'nam](https://pueblosoriginarios.com/sur/patagonia/selknam/selknam.html):** Respalda la toponimia ancestral de *Karukinka*, la división territorial en *haruwen*, el significado de *Tol-wen* («en el corazón») en `tol-01`, el lago *Khami* en `tol-02` y la cosmovisión de los antepasados míticos *Howenh*.
* **[Municipio de Tolhuin — Atención a la Comunidad](https://tolhuin.gob.ar/atencion-a-la-comunidad/):** Respalda la articulación institucional, servicios comunitarios y vinculación con las áreas de cultura y desarrollo local para los talleres y cooperativas de oficios fueguinos en Tolhuin (`tol-04`, `taller-hilado-tolhuin`).

### Repositorios Científicos y Cartográficos Institucionales
* **IGN (Instituto Geográfico Nacional de la República Argentina):** Cartografía base oficial, límites bicontinentales (Ley 26.651) y toponimia geográfica nacional en todo el territorio continental, Antártida e Islas Malvinas.
* **IDETDF (Infraestructura de Datos Espaciales de Tierra del Fuego):** Capas de delimitación territorial, áreas protegidas y referencias geográficas provinciales.
* **CADIC-CONICET (Centro Austral de Investigaciones Científicas):** Publicaciones y reportes ambientales de referencia sobre la dinámica hídrica de turbales fueguinos y retroceso de cuerpos glaciares.
* **Convención Ramsar:** Información sobre turbales y humedales de importancia internacional en Tierra del Fuego.
* **Copernicus Sentinel-1 SAR:** Referencias de reflectividad por microondas y humedad superficial en turberas fueguinas.
* **Open-Meteo:** Pronósticos meteorológicos abiertos de alta precisión para coordenadas australes (Licencia CC BY 4.0).
* **Wikimedia Commons:** Repositorio de medios de dominio público y licencias Creative Commons para la memoria histórica y patrimonio biocultural.

---

## Uso Transparente de Inteligencia Artificial

En **Rastro Austral**, la Inteligencia Artificial fue utilizada como herramienta de apoyo y aceleración durante el desarrollo, siempre bajo supervisión humana y validación contra fuentes oficiales argentinas:

* **Generación de Identidad Visual y Multimedia:** Creación de la ilustración oficial de bienvenida del Pingüino Explorador (`assets/pinguino-bienvenida.webp`) y apoyo en la conceptualización visual y narrativa del video de presentación.
* **Curaduría Territorial y Educativa:** Síntesis y estructuración de reseñas históricas, fichas ambientales de los 26 hitos y contenidos pedagógicos de las 9 salas del Museo Austral 2D.
* **Internacionalización y Toponimia Originaria:** Traducción integral Español/Inglés de la interfaz y organización de guías fonéticas de voces Selk'nam y Yámana.
* **Visualización de Datos Ambientales:** Estructuración de indicadores históricos y proyecciones al 2030 sobre turbales y glaciares para el Observatorio Climático.
* **Control de Calidad y Accesibilidad (QA):** Auditoría técnica de cumplimiento WCAG 2.1 AA, contraste cromático, lectores de pantalla e integridad del caché offline.

---

## 📄 7. Licencias
Distribuido bajo Licencia **MIT**. Uso de cartografía según lineamientos oficiales del Instituto Geográfico Nacional (IGN Argentina). Fotografías y datos de repositorios institucionales y Wikimedia Commons citados bajo licencias de Dominio Público y Creative Commons (CC BY-SA 4.0). Datos meteorológicos provistos por Open-Meteo bajo licencia CC BY 4.0.
