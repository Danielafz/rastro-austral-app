// ==========================================
// RASTRO AUSTRAL - CONTROLADOR DEL MAPA E INTERACCIÓN
// ==========================================

let mapa;
let capaMarcadores;
let capaHuellas;
let capaBaseEstandar;
let capaBaseRelieve;
let capaBaseSatelital;
let capaToponimiaYSoberania;
let capaBaseActiva = "estandar";
let listaHitos = [];
let datosHitos = {};
let filtroActivo = "todos";
let filtroFragilidad = "todas";
let filtroEstadoVisita = "todos";
let busquedaActiva = "";
let territorioActivo = "todos";
let hitoSeleccionadoId = null;
let marcadoresPorId = {};
let marcadorUsuario = null;
let idiomaActual = localStorage.getItem("rastro_austral_idioma") || "es";
window.idiomaActual = idiomaActual;

// Anunciador para lectores de pantalla (NVDA, TalkBack, VoiceOver) vía aria-live
function anunciarAccesibilidad(mensaje) {
    const anunciador = document.getElementById("anunciador-accesibilidad") || document.getElementById("anunciador-accesible");
    if (!anunciador || !mensaje) return;
    anunciador.textContent = "";
    setTimeout(() => {
        anunciador.textContent = mensaje;
    }, 40);
}

// Feedback háptico accesible (vibración para personas sordas o con disminución auditiva en móviles)
function vibrarDispositivo(patron = 40) {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        try {
            navigator.vibrate(patron);
        } catch (e) {}
    }
}

// Colores según la categoría oficial
const COLORES_CATEGORIA = {
    patrimonio: "#f59e0b",       // Ámbar
    senderos: "#10b981",         // Esmeralda
    economia_creativa: "#8b5cf6" // Violeta
};

// Vistas territoriales predefinidas
const VISTAS_TERRITORIO = {
    provincia: { centro: [-54.35, -67.75], zoom: 8 },
    todos: { centro: [-54.35, -67.75], zoom: 8 },
    ushuaia: { centro: [-54.8019, -68.3030], zoom: 12 },
    tolhuin: { centro: [-54.5100, -67.1950], zoom: 12 },
    rio_grande: { centro: [-53.7877, -67.7003], zoom: 12 },
    "rio-grande": { centro: [-53.7877, -67.7003], zoom: 12 },
    almanza: { centro: [-54.8719, -67.5786], zoom: 13 },
    "san-sebastian": { centro: [-53.2840, -68.4850], zoom: 11 },
    malvinas: { centro: [-51.75, -59.00], zoom: 8 },
    esperanza: { centro: [-63.3975, -56.9972], zoom: 8 }
};

// Ícono 3D de la hoja/brote de fragilidad ambiental
function obtenerIconoFragilidadHoja(clase = "w-4 h-4") {
  return `
    <span class="inline-flex items-center justify-center flex-shrink-0 ${clase}">
      <svg viewBox="0 0 40 40" class="w-full h-full drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g_hoja_base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
          <linearGradient id="g_hoja_brote" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#a3e635"/>
          </linearGradient>
          <linearGradient id="g_hoja_sombra" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="17" fill="url(#g_hoja_base)"/>
        <circle cx="20" cy="20" r="17" fill="url(#g_hoja_sombra)"/>
        <circle cx="20" cy="19.5" r="15.5" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1"/>
        <path d="M20 9C20 9 27 16 27 22C27 25.8 23.8 29 20 29C16.2 29 13 25.8 13 22C13 16 20 9 20 9Z" fill="#047857"/>
        <path d="M20 11C20 11 25.5 17 25.5 22C25.5 25 23 27.5 20 27.5C17 27.5 14.5 25 14.5 22C14.5 17 20 11 20 11Z" fill="url(#g_hoja_brote)"/>
        <path d="M20 13V26" stroke="#065f46" stroke-width="1.2" stroke-linecap="round"/>
        <ellipse cx="17.5" cy="15" rx="1.8" ry="3" transform="rotate(-25 17.5 15)" fill="#ffffff" fill-opacity="0.6"/>
      </svg>
    </span>
  `;
}

// Diccionario bilingüe (Español / Inglés)
const DICCIONARIO = {
    es: {
        subtitulo: "Atlas y Diario de Exploración Territorial",
        nav_mapa: "Mapa",
        nav_museo: "Museo",
        tab_explorador: "Hitos",
        tab_pasaporte: "Bitácora",
        tab_observatorio: "Observatorio Climático",
        btn_volver_mapa: "Volver al Mapa",
        sitios_en_rastro: "Sitios en mi Rastro:",
        descargar_bitacora: "Descargar Bitácora",
        vista_provincia: "📍 Toda la Provincia",
        capa_estandar: "Argenmap (IGN)",
        capa_estandar_corto: "IGN",
        capa_relieve: "Relieve (IGN)",
        capa_relieve_corto: "Relieve",
        capa_satelital: "Satelital",
        capa_areas_protegidas: "Áreas Protegidas",
        capa_areas_protegidas_corto: "Áreas",
        capa_alertas_sar: "Alertas SAR",
        capa_alertas_sar_corto: "SAR",
        modal_bloqueo_badge_sar: "Alerta Temprana SAR",
        modal_bloqueo_titulo: "🚫 Zona Restringida al Acceso",
        modal_bloqueo_subtitulo: "Tránsito pedestre suspendido por protocolo de preservación ambiental",
        modal_bloqueo_pregunta: "¿Por qué se activa este bloqueo?",
        modal_bloqueo_explicacion: "Los turbales son esponjas milenarias que retienen el agua de Ushuaia y capturan carbono vital. Durante períodos de sequía extrema detectados por radar satelital Sentinel-1 SAR, la pisada compacta el musgo Sphagnum destruyendo su estructura e incrementa drásticamente el riesgo de incendios subterráneos.",
        modal_bloqueo_alternativa_lbl: "Ruta Alternativa Segura Sugerida",
        modal_bloqueo_alternativa_desc: "Te sugerimos redirigir tu expedición hacia senderos con pasarelas habilitadas y monitoreo permanente:",
        modal_bloqueo_btn_alternativa: "🧭 Desviarse a Sendero Seguro Habilitado",
        modal_bloqueo_btn_entendido: "Entendido, respetar restricción",
        explorar_hitos: "Explorar Hitos",
        ver_mapa: "Ver Mapa",
        capas_oficiales: "Capas Oficiales (IDETDF / IGN)",
        filtros_busqueda: "Filtros de Búsqueda",
        buscar_placeholder: "Buscar por nombre, localidad o toponimia...",
        lbl_filtro_estado: "Estado de Visita",
        estado_todos: "Todos",
        estado_solo_visitados: "Visitados",
        estado_pendientes: "Por explorar",
        cat_todos: "Todos",
        cat_patrimonio: "Patrimonio",
        cat_senderos: "Senderos",
        cat_creativos: "Creativos",
        label_fragilidad: "Fragilidad:",
        fragilidad_todas: "Todas",
        fragilidad_baja: "Baja",
        fragilidad_media: "Media",
        fragilidad_alta: "Alta",
        fragilidad_muy_alta: "Muy Alta",
        sellos_expedicion: "Sellos de Expedición",
        ver_pasaporte: "Libreta Completa",
        imprimir_pasaporte: "Imprimir Pasaporte",
        modal_pasaporte_titulo: "Libreta y Pasaporte de Expedición",
        modal_pasaporte_subtitulo: "Registro de visitas territoriales, estampillas y notas de campo",
        modal_pasaporte_footer: "Haz clic en un sello para ubicarlo en el mapa",
        modal_creditos_titulo: "Créditos y Soberanía de Datos",
        modal_creditos_subtitulo: "Marco institucional, fuentes cartográficas y privacidad soberana",
        creditos_fuentes_titulo: "Fuentes Oficiales Cartográficas y Científicas",
        creditos_fuentes_desc: "Cartografía oficial vial y topográfica provista por el Instituto Geográfico Nacional de la República Argentina (IGN · Argenmap) y la Infraestructura de Datos Espaciales de Tierra del Fuego (IDETDF). Datos científicos y ambientales de referencia de CADIC-CONICET, alertas de estrés hídrico en turbales basadas en radar satelital Copernicus Sentinel-1 (ESA), meteorología en tiempo real vía Open-Meteo y acervo histórico-fotográfico del Museo Austral vía Wikimedia Commons.",
        creditos_privacidad_titulo: "Privacidad Soberana (Ley 25.326)",
        creditos_privacidad_desc: "Esta aplicación no recopila telemetría, identificadores ni geolocalización en servidores remotos. Todas las visitas marcadas, sellos, notas de campo, caché de obras y reportes meteorológicos quedan almacenados de manera 100% local en este dispositivo mediante localStorage y Service Worker offline (Ley 25.326 de Protección de los Datos Personales).",
        creditos_licencia_titulo: "Licencias Abiertas",
        creditos_licencia_desc: "Código fuente distribuido bajo licencia permisiva MIT. Cartografía oficial del Instituto Geográfico Nacional (IGN Argentina), imágenes satelitales complementarias de Esri, datos meteorológicos abiertos de Open-Meteo (CC BY 4.0) y contenidos educativos y patrimoniales bajo Creative Commons CC BY-SA 4.0.",
        cerrar: "Cerrar",
        compartir: "Compartir",
        copiado: "✔ Copiado",
        puntos_preservacion: "Puntos de Preservación",
        guardian_austral: "Guardián Austral",
        modal_huella_titulo: "Huella Consciente & Preservación",
        modal_huella_subtitulo: "Compromiso ecológico y honorífico en el territorio fueguino",
        rango_guardian_titulo: "Rango Honorífico: Guardián Austral",
        principios_huella_titulo: "Principios de Exploración Consciente (No Deje Rastro)",
        principio_turbales: "Turbales y Musgo Sphagnum: Caminá exclusivamente por pasarelas o sendas demarcadas. Los turbales retienen agua y fijan carbono vital para el planeta.",
        principio_arqueologia: "Concheros y Sitios Ancestrales: No remuevas piedras ni conchas en costas de ocupación Yagán/Selk'nam; son patrimonio arqueológico no renovable.",
        principio_fuego: "Fuego Cero en Zonas Agrestes: Solo en campings habilitados con agua a mano. Un foco puede destruir bosques milenarios de lenga y ñire.",
        principio_residuos: "Regresá tus Residuos: Todo lo que entra a la senda vuelve contigo, incluidos restos orgánicos que tardan años en degradarse en clima subpolar.",
        guardian_desbloqueado: "Logrado",
        guardian_bloqueado: "Pendiente",
        guardian_desc_activo: "¡Felicitaciones! Has registrado 2 o más hitos de alta o muy alta fragilidad respetando las pautas de conservación.",
        guardian_desc_pendiente: "Registrá al menos 2 hitos de fragilidad Alta o Muy Alta en tu pasaporte para obtener el blasón de Guardián Austral.",
        estado_visitado: "✓ Registrado",
        estado_por_explorar: "🔒 Por explorar",
        sin_notas: "Sin notas de campo registradas aún",
        detalle_vacio: "Seleccioná un punto en el mapa para consultar su historia, toponimia y registrarlo en tu Rastro.",
        footer_privacidad: "Tus recorridos se guardan únicamente en este equipo (Ley 25.326).",
        footer_fuentes: "Fuentes: IDETDF · IGN · CADIC-CONICET",
        toponimia: "Toponimia:",
        fragilidad: "Fragilidad del sitio:",
        conducta: "Conducta responsable sugerida:",
        fuente: "Fuente:",
        recorrido_total: "Travesía Acumulada",
        tiempo_estimado: "Tiempo Estimado",
        btn_marcar: "+ Marcar en mi Rastro",
        btn_quitar: "✓ Registrado en mi Rastro (Quitar)",
        tocar_explorar: "Tocar para explorar",
        audio_escuchar: "Escuchar relato",
        audio_detener: "Detener relato",
        nota_label: "Nota personal de bitácora:",
        nota_placeholder: "Escribí tus observaciones, recuerdos o notas de campo...",
        guardado: "Guardado",
        bienvenida_titulo: "Bienvenido a Rastro Austral",
        bienvenida_subtitulo: "Atlas y Diario de Exploración Territorial de Tierra del Fuego",
        lbl_nombre_explorador: "Nombre del Expedicionario / Exploradora",
        placeholder_nombre_explorador: "Tu nombre de explorador...",
        placeholderNombre: "Tu nombre de explorador...",
        saludoPinguino: "¡Hola",
        btn_ingresar: "Ingresar a la Expedición",
        tema_modo_claro: "Cambiar a Modo Claro",
        tema_modo_oscuro: "Cambiar a Modo Oscuro",
        geoloc_titulo: "Ubicar mi posición actual",
        geoloc_mi_posicion: "Tu posición actual en Tierra del Fuego",
        geoloc_no_soportada: "Tu navegador no soporta geolocalización.",
        geoloc_error: "No se pudo obtener la ubicación actual.",
        estado_red_sincronizado: "Atlas Sincronizado · Modo Offline Activo",
        estado_red_offline: "Sin Señal · Modo Expedición Offline Activo",
        estado_red_resguardado: "Expedición Lista Offline",
        guardar_fichas_offline: "Guardar Fichas para Expedición",
        fichas_resguardadas: "✓ Fichas Resguardadas",
        fonetica_titulo: "Fonética Originaria",
        fonetica_pronunciar: "Pronunciar",
        sello_identidad_fueguina: "Sello Identidad Fueguina",
        sello_identidad_sub: "Comercio Justo · 100% Origen Local",
        rubro_creativo: "Disciplina productiva:",
        punto_directo: "Punto territorial / contacto:",
        tab_observatorio: "Observatorio",
        obs_subtitulo: "Ciencia de Datos Cívica · 2015–2030",
        obs_titulo: "Observatorio Climático Austral",
        obs_escuchar: "Escuchar síntesis",
        obs_intro: "Escenarios ilustrativos de prototipo basados en tendencias ambientales regionales (extrapolación lineal 2015–2030).",
        obs_en_simple: "¿Qué significa?",
        obs_m1_titulo: "Los días secos podrían duplicarse hacia 2030",
        obs_m1_sub: "¿Cuántos días al año se queda sin agua el suelo?",
        obs_m1_badge: "+100% días secos",
        obs_m1_simple: "La turba es como una esponja gigante que guarda agua y atrapa carbono. Al secarse por el calor, se agrieta y deja de protegernos.",
        obs_m1_alerta_lbl: "Nivel de alerta:",
        obs_m1_alerta_val: "Moderado a Crítico",
        obs_m1_ver: "Ver turbal en mapa →",
        obs_m2_titulo: "El glaciar podría perder un 16% de su masa de 2015 para 2030",
        obs_m2_sub: "Hielo que nos queda para beber y abastecer a la ciudad",
        obs_m2_simple: "Por el aumento de temperatura, para el año 2030 el glaciar habrá perdido aproximadamente 1 de cada 6 partes de su masa de 2015.",
        obs_m2_alerta_lbl: "Contexto:",
        obs_m2_alerta_val: "Abastecimiento de agua de Ushuaia",
        obs_m2_ver: "Ver glaciar en mapa →",
        lbl_leyenda: "Leyenda",
        leyenda_patrimonio: "Patrimonio",
        leyenda_senderos: "Senderos",
        leyenda_creativos: "Creativos",
        leyenda_visitado: "Visitado en bitácora",
        aviso_modo_provincia: "🧭 Elegí una ciudad arriba para descubrir sus pingüinos, o marcá lugares visitados para verlos aquí"
    },
    en: {
        subtitulo: "Atlas & Territorial Exploration Journal",
        nav_mapa: "Map",
        nav_museo: "Museum",
        tab_explorador: "Sites",
        tab_pasaporte: "Logbook",
        tab_observatorio: "Climate Observatory",
        btn_volver_mapa: "Back to Map",
        sitios_en_rastro: "Sites in my Trail:",
        descargar_bitacora: "Download Journal",
        vista_provincia: "📍 Entire Province",
        capa_estandar: "Argenmap (IGN)",
        capa_estandar_corto: "IGN",
        capa_relieve: "Topographic (IGN)",
        capa_relieve_corto: "Relief",
        capa_satelital: "Satellite",
        capa_areas_protegidas: "Protected Areas",
        capa_areas_protegidas_corto: "Areas",
        capa_alertas_sar: "SAR Alerts",
        capa_alertas_sar_corto: "SAR",
        modal_bloqueo_badge_sar: "Early Warning SAR",
        modal_bloqueo_titulo: "🚫 Restricted Access Area",
        modal_bloqueo_subtitulo: "Pedestrian transit suspended due to environmental conservation protocol",
        modal_bloqueo_pregunta: "Why is this restriction active?",
        modal_bloqueo_explicacion: "Peatlands are millenary sponges that retain fresh water and sequester vital carbon. During severe drought conditions detected by Sentinel-1 SAR satellite radar, foot traffic compacts living Sphagnum moss, irreversibly damaging the bog and escalating subterranean wildfire risk.",
        modal_bloqueo_alternativa_lbl: "Suggested Safe Alternative Route",
        modal_bloqueo_alternativa_desc: "We recommend rerouting your expedition towards trails equipped with boardwalks and active ranger monitoring:",
        modal_bloqueo_btn_alternativa: "🧭 Divert to Authorized Safe Trail",
        modal_bloqueo_btn_entendido: "Understood, comply with restriction",
        explorar_hitos: "Explore Sites",
        ver_mapa: "View Map",
        capas_oficiales: "Official Layers (IDETDF / IGN)",
        filtros_busqueda: "Search Filters",
        buscar_placeholder: "Search by name, locality or toponymy...",
        lbl_filtro_estado: "Visit Status",
        estado_todos: "All",
        estado_solo_visitados: "Visited",
        estado_pendientes: "To explore",
        cat_todos: "All",
        cat_patrimonio: "Heritage",
        cat_senderos: "Trails",
        cat_creativos: "Creative",
        label_fragilidad: "Fragility:",
        fragilidad_todas: "All",
        fragilidad_baja: "Low",
        fragilidad_media: "Medium",
        fragilidad_alta: "High",
        fragilidad_muy_alta: "Very High",
        sellos_expedicion: "Expedition Stamps",
        ver_pasaporte: "Full Passport",
        imprimir_pasaporte: "Print Passport",
        modal_pasaporte_titulo: "Expedition Journal & Passport",
        modal_pasaporte_subtitulo: "Record of territorial visits, stamps and field notes",
        modal_pasaporte_footer: "Click a stamp to view it on the map",
        modal_creditos_titulo: "Credits & Data Sovereignty",
        modal_creditos_subtitulo: "Institutional framework, cartographic sources and sovereign privacy",
        creditos_fuentes_titulo: "Official Cartographic & Scientific Sources",
        creditos_fuentes_desc: "Official road and topographic cartography provided by the National Geographic Institute of Argentina (IGN · Argenmap) and the Spatial Data Infrastructure of Tierra del Fuego (IDETDF). Scientific and environmental reference data from CADIC-CONICET, peatland drought alerts modeled from Copernicus Sentinel-1 (ESA) radar, real-time weather via Open-Meteo, and Austral Museum historical photography via Wikimedia Commons.",
        creditos_privacidad_titulo: "Sovereign Privacy (Law 25.326)",
        creditos_privacidad_desc: "This application collects no telemetry, tracking identifiers, or geolocation on remote servers. All marked visits, passport stamps, field notes, cached museum artworks, and weather reports are stored 100% locally on this device via localStorage and offline Service Worker (Personal Data Protection Act 25.326).",
        creditos_licencia_titulo: "Open Licenses",
        creditos_licencia_desc: "Source code released under the MIT License. Official cartography by the National Geographic Institute (IGN Argentina), complementary satellite imagery by Esri, open weather data by Open-Meteo (CC BY 4.0), and educational and heritage contents under Creative Commons CC BY-SA 4.0.",
        cerrar: "Close",
        compartir: "Share",
        copiado: "✔ Copied",
        puntos_preservacion: "Conservation Points",
        guardian_austral: "Southern Guardian",
        modal_huella_titulo: "Conscious Footprint & Conservation",
        modal_huella_subtitulo: "Ecological and honorary commitment across Fuegian territory",
        rango_guardian_titulo: "Honorary Rank: Southern Guardian",
        principios_huella_titulo: "Conscious Exploration Principles (Leave No Trace)",
        principio_turbales: "Peat Bogs & Sphagnum Moss: Walk strictly on designated paths or boardwalks to protect subantarctic carbon sinks.",
        principio_arqueologia: "Shell Middens & Heritage Sites: Never remove archaeological remains from Yagan or Selk'nam cultural grounds.",
        principio_fuego: "Zero Wildfires: High winds and subpolar dry matter turn small flames into catastrophic forest fires.",
        principio_residuos: "Pack It In, Pack It Out: Everything brought to trails returns with you, including organic scraps.",
        guardian_desbloqueado: "Achieved",
        guardian_bloqueado: "Pending",
        guardian_desc_activo: "Congratulations! You have recorded 2 or more high or very high fragility sites following conservation guidelines.",
        guardian_desc_pendiente: "Record at least 2 sites of High or Very High fragility in your passport to earn the Southern Guardian coat of arms.",
        estado_visitado: "✓ Recorded",
        estado_por_explorar: "🔒 To be explored",
        sin_notas: "No field notes recorded yet",
        detalle_vacio: "Select a point on the map to discover its history, toponymy, and add it to your Trail.",
        footer_privacidad: "Your journeys are stored solely on this device (Law 25.326).",
        footer_fuentes: "Sources: IDETDF · IGN · CADIC-CONICET",
        toponimia: "Toponymy:",
        fragilidad: "Site fragility:",
        conducta: "Suggested responsible conduct:",
        fuente: "Source:",
        recorrido_total: "Total Journey",
        tiempo_estimado: "Estimated Time",
        btn_marcar: "+ Mark in my Trail",
        btn_quitar: "✓ Recorded in my Trail (Remove)",
        tocar_explorar: "Click to explore",
        audio_escuchar: "Listen story",
        audio_detener: "Stop audio",
        nota_label: "Personal Journal Note:",
        nota_placeholder: "Write observations, memories or field notes...",
        guardado: "Saved",
        bienvenida_titulo: "Welcome to Rastro Austral",
        bienvenida_subtitulo: "Atlas & Territorial Exploration Journal of Tierra del Fuego",
        lbl_nombre_explorador: "Explorer's Name",
        placeholder_nombre_explorador: "Your explorer name...",
        placeholderNombre: "Your explorer name...",
        saludoPinguino: "Hello",
        btn_ingresar: "Enter the Expedition",
        tema_modo_claro: "Switch to Light Mode",
        tema_modo_oscuro: "Switch to Dark Mode",
        geoloc_titulo: "Locate my current position",
        geoloc_mi_posicion: "Your current position in Tierra del Fuego",
        geoloc_no_soportada: "Your browser does not support geolocation.",
        geoloc_error: "Could not retrieve your current location.",
        estado_red_sincronizado: "Atlas Synced · Offline Mode Ready",
        estado_red_offline: "No Signal · Offline Expedition Mode Active",
        estado_red_resguardado: "Expedition Ready Offline",
        guardar_fichas_offline: "Save Cards for Expedition",
        fichas_resguardadas: "✓ Cards Saved Offline",
        fonetica_titulo: "Indigenous Phonetics",
        fonetica_pronunciar: "Pronounce",
        sello_identidad_fueguina: "Fuegian Identity Seal",
        sello_identidad_sub: "Fair Trade · 100% Local Origin",
        rubro_creativo: "Creative discipline:",
        punto_directo: "Local hub / contact:",
        tab_observatorio: "Observatory",
        obs_subtitulo: "Civic Data Science · 2015–2030",
        obs_titulo: "Austral Climate Observatory",
        obs_escuchar: "Listen summary",
        obs_intro: "Illustrative prototype scenarios based on regional environmental trends (simple linear extrapolation 2015–2030).",
        obs_en_simple: "What does it mean?",
        obs_m1_titulo: "Dry days could double by 2030",
        obs_m1_sub: "How many days a year does the soil run dry?",
        obs_m1_badge: "+100% dry days",
        obs_m1_simple: "Peat acts like a giant sponge that stores freshwater and traps carbon. As heat dries it out, it cracks and stops protecting us.",
        obs_m1_alerta_lbl: "Alert level:",
        obs_m1_alerta_val: "Moderate to Critical",
        obs_m1_ver: "View peatland on map →",
        obs_m2_titulo: "The glacier could lose 16% of its 2015 mass by 2030",
        obs_m2_sub: "Ice left to supply clean drinking water to the city",
        obs_m2_simple: "Because of rising temperatures, by 2030 the glacier will have lost approximately 1 out of every 6 parts of its 2015 mass.",
        obs_m2_alerta_lbl: "Context:",
        obs_m2_alerta_val: "Ushuaia water supply",
        obs_m2_ver: "View glacier on map →",
        lbl_leyenda: "Legend",
        leyenda_patrimonio: "Heritage",
        leyenda_senderos: "Trails",
        leyenda_creativos: "Creative",
        leyenda_visitado: "Visited in logbook",
        aviso_modo_provincia: "🧭 Choose a city above to discover its penguins, or mark visited places to see them here"
    }
};

// Diccionario fonético y de recuperación toponímica originaria (Selk'nam / Yagán)
const GUIA_FONETICA_ORIGINARIA = [
    {
        claves: ["oshovia", "ushuaia"],
        termino: "Oshovia",
        lengua: "Yagán",
        silabas: "[o-sho-ví-a]",
        tts: "Oh shoh ví ah",
        significado_es: "Bahía que penetra hacia el poniente",
        significado_en: "Bay penetrating westward"
    },
    {
        claves: ["onashaga", "beagle"],
        termino: "Onashaga",
        lengua: "Yagán",
        silabas: "[o-na-shá-ga]",
        tts: "Oh nah shá gah",
        significado_es: "Canal de los cazadores (pueblo Ona/Selk'nam)",
        significado_en: "Channel of the hunters (Ona/Selk'nam people)"
    },
    {
        claves: ["tol-wen", "tolhuin"],
        termino: "Tol-wen (Tolhuin)",
        lengua: "Selk'nam",
        silabas: "[tol-wén]",
        tts: "Tol uén",
        significado_es: "Corazón (centro geográfico de la isla)",
        significado_en: "Heart (geographic center of the island)"
    },
    {
        claves: ["kamuk"],
        termino: "Kamuk",
        lengua: "Selk'nam",
        silabas: "[ka-múk]",
        tts: "Ka múk",
        significado_es: "Voz territorial asociada al bosque andino central",
        significado_en: "Territorial term linked to the central Andean forest"
    },
    {
        claves: ["chepelmut"],
        termino: "Chepelmut",
        lengua: "Selk'nam",
        silabas: "[che-pel-mút]",
        tts: "Che pel mút",
        significado_es: "Paraje lacustre y boscoso del corazón fueguino",
        significado_en: "Lake and forest site in the Fuegian heartland"
    },
    {
        claves: ["chimehuin", "río grande"],
        termino: "Chimehuin / Kóosh",
        lengua: "Selk'nam",
        silabas: "[chi-me-wín]",
        tts: "Chi me uín",
        significado_es: "Toponimia fluvial originaria del norte estepario",
        significado_en: "Indigenous river toponymy of the northern steppe"
    },
    {
        claves: ["khami", "fagnano"],
        termino: "Khami",
        lengua: "Selk'nam",
        silabas: "[ka-mí]",
        tts: "Kah mee",
        significado_es: "Agua grande o alargada (Lago Fagnano)",
        significado_en: "Great or elongated water (Lake Fagnano)"
    },
    {
        claves: ["karukinka"],
        termino: "Karukinka",
        lengua: "Selk'nam",
        silabas: "[ka-ru-kín-ka]",
        tts: "Kah roo keen kah",
        significado_es: "Nuestra tierra / La última tierra (Isla Grande)",
        significado_en: "Our land / The last land (Great Island)"
    },
    {
        claves: ["lapataia"],
        termino: "Lapataia",
        lengua: "Yagán",
        silabas: "[la-pa-tái-a]",
        tts: "Lah pah tah ee ah",
        significado_es: "Bahía boscosa o bahía de la madera",
        significado_en: "Wooded bay or bay of wood"
    },
    {
        claves: ["yagán", "yagan", "yámana"],
        termino: "Yagán / Yámana",
        lengua: "Yagán",
        silabas: "[ya-gán]",
        tts: "Yah gahn",
        significado_es: "Pueblo originario canoero de los canales australes",
        significado_en: "Indigenous canoe people of the southern channels"
    },
    {
        claves: ["jeujepén", "jeujepen"],
        termino: "Jeujepén",
        lengua: "Selk'nam",
        silabas: "[jeu-je-pén]",
        tts: "Heu he pen",
        significado_es: "Cerro sagrado y vigía del corazón de la isla",
        significado_en: "Sacred lookout peak in the island's heartland"
    }
];

function obtenerFoneticaHito(hito) {
    if (!hito) return null;
    const textoBusqueda = `${hito.toponimia || ""} ${hito.nombre || ""}`.toLowerCase();
    for (const entrada of GUIA_FONETICA_ORIGINARIA) {
        if (entrada.claves.some(c => textoBusqueda.includes(c))) {
            return entrada;
        }
    }
    return null;
}

document.addEventListener("DOMContentLoaded", async () => {
    configurarPantallaBienvenida();
    inicializarMapa();
    await Promise.all([cargarDatos(), cargarDatosObservatorio()]);
    configurarFiltros();
    configurarFiltroEstadoVisita();
    configurarPestanasSidebar();
    configurarFiltroFragilidad();
    configurarBuscador();
    configurarInsigniasInteractivas();
    configurarModalPasaporte();
    configurarModalCreditos();
    configurarModalHuella();
    configurarModalBloqueo();
    configurarSelectorCapasBase();
    configurarCapaAreasProtegidas();
    configurarCapaAlertasSAR();
    configurarGeolocalizacion();
    configurarSelectorLocalidades();
    configurarPanelMobile();
    configurarConmutadorIdioma();
    configurarBotonExportar();
    configurarModoOffline();
    inicializarEstadoLeyendaMapa();
    actualizarTextosUI();
});

// Rótulos cartográficos de soberanía argentina y toponimia originaria
const ROTULOS_SOBERANIA_Y_ORIGINARIOS = [
    // Localidades y Soberanía Argentina
    {
        texto: "Ushuaia",
        subtexto: "Capital Fueguina",
        coords: [-54.8019, -68.3030],
        clase: "rotulo-ciudad-capital",
        zoomMin: 7
    },
    {
        texto: "Tolhuin",
        subtexto: "Corazón de la Isla",
        coords: [-54.5108, -67.1955],
        clase: "rotulo-localidad",
        zoomMin: 8
    },
    {
        texto: "Río Grande",
        subtexto: "Ciudad de la Estepa",
        coords: [-53.7877, -67.7095],
        clase: "rotulo-localidad",
        zoomMin: 8
    },
    {
        texto: "Puerto Almanza",
        subtexto: "Polo Pesquero Canal Onashaga",
        coords: [-54.8689, -67.5764],
        clase: "rotulo-paraje",
        zoomMin: 9
    },
    {
        texto: "San Sebastián",
        subtexto: "Bahía & Paso Fronterizo Norte",
        coords: [-53.1636, -68.4314],
        clase: "rotulo-paraje",
        zoomMin: 8
    },
    {
        texto: "Islas Malvinas",
        subtexto: "República Argentina · TDF, AIAS",
        coords: [-51.75, -59.10],
        clase: "rotulo-territorio-soberano",
        zoomMin: 6
    },
    {
        texto: "Isla Soledad",
        subtexto: "Islas Malvinas (Arg.)",
        coords: [-51.80, -58.70],
        clase: "rotulo-isla",
        zoomMin: 7
    },
    {
        texto: "Gran Malvina",
        subtexto: "Islas Malvinas (Arg.)",
        coords: [-51.70, -60.05],
        clase: "rotulo-isla",
        zoomMin: 7
    },
    {
        texto: "Puerto Argentino",
        subtexto: "Cabecera Malvinas (Arg.)",
        coords: [-51.692, -57.858],
        clase: "rotulo-puerto-argentino",
        zoomMin: 8
    },
    {
        texto: "Base Esperanza",
        subtexto: "Antártida Argentina",
        coords: [-63.3981, -56.9973],
        clase: "rotulo-territorio-soberano",
        zoomMin: 5
    },

    // Toponimia Ancestral Originaria (Selk'nam / Yámana)
    {
        texto: "Karukinká",
        subtexto: "Tierra del Fuego · Selk'nam",
        coords: [-54.12, -67.45],
        clase: "rotulo-originario-region",
        zoomMin: 7
    },
    {
        texto: "Onashaga",
        subtexto: "Canal Beagle · Yámana",
        coords: [-54.95, -67.90],
        clase: "rotulo-originario-canal",
        zoomMin: 8
    },
    {
        texto: "Kami",
        subtexto: "Lago Fagnano · Selk'nam",
        coords: [-54.55, -67.65],
        clase: "rotulo-originario-lago",
        zoomMin: 8
    },
    {
        texto: "Oushwaia",
        subtexto: "Bahía al Fondo · Yámana",
        coords: [-54.825, -68.32],
        clase: "rotulo-originario-bahia",
        zoomMin: 11
    },
    {
        texto: "Lapataia",
        subtexto: "Bahía Boscosa · Yámana",
        coords: [-54.86, -68.56],
        clase: "rotulo-originario-bahia",
        zoomMin: 11
    }
];

function actualizarRotulosCartograficos() {
    if (!capaToponimiaYSoberania || !mapa) return;
    capaToponimiaYSoberania.clearLayers();
    const currentZoom = typeof mapa.getZoom === "function" ? mapa.getZoom() : 8;

    ROTULOS_SOBERANIA_Y_ORIGINARIOS.forEach(r => {
        const minZoom = r.zoomMin !== undefined ? r.zoomMin : 7;
        const maxZoom = r.zoomMax !== undefined ? r.zoomMax : 18;
        if (currentZoom >= minZoom && currentZoom <= maxZoom) {
            const html = `
                <div class="contenedor-rotulo-mapa ${r.clase}">
                    <span class="rotulo-nombre-principal">${r.texto}</span>
                    ${r.subtexto ? `<span class="rotulo-subtexto">${r.subtexto}</span>` : ""}
                </div>
            `;
            const icon = L.divIcon({
                className: "marcador-rotulo-cartografico",
                html: html,
                iconSize: null
            });
            const marcador = L.marker(r.coords, {
                icon: icon,
                interactive: false,
                keyboard: false
            });
            capaToponimiaYSoberania.addLayer(marcador);
        }
    });
}

// 1. Inicializar Leaflet centrado en la Isla Grande de Tierra del Fuego
function inicializarMapa() {
    mapa = L.map("map", {
        zoomControl: false
    }).setView([-54.35, -67.75], 8);

    if (mapa.attributionControl) {
        mapa.attributionControl.setPrefix(false);
    }

    // Control de zoom
    L.control.zoom({ position: "bottomleft" }).addTo(mapa);
    window.map = mapa;
    window.mapa = mapa;

    // Cartografía base oficial de la República Argentina: Argenmap Vial y Urbano (IGN)
    // Cobertura completa con toponimia argentina oficial en Tierra del Fuego e Islas Malvinas
    capaBaseEstandar = L.tileLayer(
        "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png",
        {
            tms: true,
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="https://www.ign.gob.ar/" target="_blank" rel="noopener">Instituto Geográfico Nacional (IGN)</a> · IDETDF'
        }
    );

    // Cartografía base oficial topográfica / relieve de la República Argentina: Argenmap Topográfico (IGN)
    // Curvas de nivel, relieve montañoso andino y cuerpos lacustres oficiales IGN
    capaBaseRelieve = L.tileLayer(
        "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_topo@EPSG%3A3857@png/{z}/{x}/{-y}.png",
        {
            tms: true,
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="https://www.ign.gob.ar/" target="_blank" rel="noopener">Instituto Geográfico Nacional (IGN)</a> · IDETDF'
        }
    );

    // 3. Cartografía base Satelital (Fotografía Aérea de Alta Resolución de Esri World Imagery)
    // Vista satelital libre sin etiquetas extranjeras, compatible con los rótulos soberanos argentinos y toponimia originaria
    capaBaseSatelital = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; Esri Satelital · IGN Argentina · IDETDF'
        }
    );

    // Respaldo resiliente ante microcortes o caídas de red para ambas capas IGN
    const aplicarFallbackResilienteIGN = (capa) => {
        capa.on("tileerror", function (error) {
            if (!error || !error.tile || error.tile.dataset.fallbackApplied === "true") return;
            error.tile.dataset.fallbackApplied = "true";
            const coords = error.coords;
            if (coords) {
                const sub = ["a", "b", "c"][Math.abs(coords.x + coords.y) % 3];
                error.tile.src = `https://${sub}.tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`;
            }
        });
    };
    aplicarFallbackResilienteIGN(capaBaseEstandar);
    aplicarFallbackResilienteIGN(capaBaseRelieve);

    // Agregar capa base activa
    capaBaseEstandar.addTo(mapa);

    // Capa de rótulos cartográficos de soberanía argentina y toponimia originaria
    capaToponimiaYSoberania = L.layerGroup().addTo(mapa);
    actualizarRotulosCartograficos();

    window.addEventListener("resize", () => {
        if (mapa) mapa.invalidateSize();
    });
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            if (mapa) mapa.invalidateSize();
        }, 150);
    });
    setTimeout(() => {
        if (mapa) mapa.invalidateSize();
    }, 350);

    // Capa de ruta ("Mi Rastro en el Mapa") compuesta exclusivamente por huellas debajo de los marcadores
    capaHuellas = L.layerGroup().addTo(mapa);

    // Capa de marcadores directos en Leaflet (pingüinos individuales garantizados)
    capaMarcadores = L.layerGroup().addTo(mapa);

    // Ajustar densidad y escala de huellas, marcadores y rótulos cartográficos según nivel de zoom
    mapa.on("zoomend", () => {
        actualizarTrazadoRuta();
        renderizarMarcadores();
        actualizarRotulosCartograficos();
    });

    // Delegación de eventos para botones dentro de los Popups de Leaflet
    mapa.on("popupopen", (e) => {
        const popupNode = e.popup.getElement();
        if (!popupNode) return;
        const btn = popupNode.querySelector(".btn-ver-ficha, .btn-popup-ver-detalle");
        if (btn) {
            btn.onclick = (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                const id = btn.getAttribute("data-id");
                if (id) {
                    abrirDetalleHito(id);
                }
            };
        }
    });
}

// 2. Cargar el dataset oficial (con respaldo automático desde caché offline)
async function cargarDatos() {
    try {
        const respuesta = await fetch("./data/hitos.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo hitos.json");
        listaHitos = await respuesta.json();
        if (typeof guardarPaqueteOffline === "function") {
            guardarPaqueteOffline(listaHitos, null);
        }
    } catch (error) {
        console.warn("Cargando hitos desde almacenamiento local offline:", error);
        const respaldo = typeof obtenerHitosOffline === "function" ? obtenerHitosOffline() : null;
        if (Array.isArray(respaldo) && respaldo.length > 0) {
            listaHitos = respaldo;
        } else {
            console.error("Error al cargar hitos:", error);
            return;
        }
    }

    datosHitos = {};
    listaHitos.forEach((h, idx) => {
        datosHitos[h.id] = h;
        datosHitos[idx + 1] = h;
        datosHitos[String(idx + 1)] = h;
    });
    window.datosHitos = datosHitos;

    const totalHitos = (Array.isArray(listaHitos) && listaHitos.length > 0) ? listaHitos.length : 25;
    const elContadorTotal = document.getElementById("contador-total");
    if (elContadorTotal) elContadorTotal.innerText = totalHitos;
    const elBitacoraTotal = document.getElementById("bitacora-total");
    if (elBitacoraTotal) elBitacoraTotal.innerText = totalHitos;

    renderizarMarcadores();
    renderizarInsignias();
    actualizarMetricas();
    actualizarHuellaConsciente();
    actualizarTrazadoRuta();
}

function actualizarTrazadoRuta() {
  actualizarMetricasDistancia();
  if (!capaHuellas || !mapa || typeof mapa.latLngToLayerPoint !== "function") return;
  capaHuellas.clearLayers();

  const visitas = obtenerVisitas();
  if (visitas.length < 2) return;

  const hitosVisitados = visitas
    .map(id => listaHitos.find(h => h.id === id))
    .filter(Boolean)
    .filter(h => {
      const cumpleCat = filtroActivo === "todos" || h.categoria === filtroActivo;
      const cumpleFrag = filtroFragilidad === "todas" || h.fragilidad === filtroFragilidad;
      const cumpleEstado = filtroEstadoVisita !== "pendientes";
      return cumpleCat && cumpleFrag && cumpleEstado;
    });

  if (hitosVisitados.length < 2) return;

  const zoomActual = mapa.getZoom();
  const esZoomLejano = zoomActual < 12;
  const escalaIcono = esZoomLejano ? 0.65 : 1;

  for (let i = 0; i < hitosVisitados.length - 1; i++) {
    const p1 = hitosVisitados[i].coordenadas;
    const p2 = hitosVisitados[i + 1].coordenadas;

    const pt1 = mapa.latLngToLayerPoint(p1);
    const pt2 = mapa.latLngToLayerPoint(p2);
    const dx = pt2.x - pt1.x;
    const dy = pt2.y - pt1.y;
    const distPx = Math.hypot(dx, dy);

    // Evitar amontonamiento entre marcadores cuando la distancia en pantalla es mínima
    if (distPx < (esZoomLejano ? 48 : 34)) continue;

    const ux = dx / distPx;
    const uy = dy / distPx;
    const nx = -uy;
    const ny = ux;
    const angulo = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;

    // Ajuste proporcional según distancia y nivel de zoom
    const distKm = calcularDistanciaKm(p1, p2);
    const pasosBase = Math.min(28, Math.max(4, Math.round(distPx / 26 + Math.min(distKm, 25) * 0.1)));
    let huellaIndex = 0;

    for (let s = 1; s < pasosBase; s++) {
      // En zoom alejado (< 12), mostrar solo 1 de cada 4 huellas para evitar saturación
      if (esZoomLejano && ((s - 1) % 4 !== 0)) continue;

      const t = s / pasosBase;
      const esPieIzquierdo = (huellaIndex % 2 === 0);
      huellaIndex++;

      const offsetLateral = (esPieIzquierdo ? -3.5 : 3.5) * escalaIcono;
      const px = pt1.x + dx * t + nx * offsetLateral;
      const py = pt1.y + dy * t + ny * offsetLateral;
      const latLngPaso = mapa.layerPointToLatLng([px, py]);

      // Silueta de huella del rastro (escala reducida en zoom < 12, completa en zoom >= 12)
      const iconoHuella = L.divIcon({
        className: 'huella-calzado',
        html: `
          <div style="transform: rotate(${angulo.toFixed(1)}deg) scale(${escalaIcono}) ${esPieIzquierdo ? 'scaleX(-1)' : ''}; width: 14px; height: 22px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
            <svg width="12" height="20" viewBox="0 0 24 40" fill="#0f172a" style="filter: drop-shadow(0 0 1.5px rgba(255,255,255,0.85));">
              <!-- Planta delantera y estrías de agarre -->
              <path d="M12 2C7 2 4 6 4 13C4 18 7 21 10 22C11 22.3 12 22.3 13 22C16 21 19 18 19 13C19 6 16 2 12 2ZM7 8C7 7.5 7.5 7 8.5 7C9.5 7 10 7.5 10 8S9.5 9 8.5 9C7.5 9 7 8.5 7 8ZM14 8C14 7.5 14.5 7 15.5 7C16.5 7 17 7.5 17 8S16.5 9 15.5 9C14.5 9 14 8.5 14 8ZM6.5 13C6.5 12.5 7 12 8 12C9 12 9.5 12.5 9.5 13S9 14 8 14C7 14 6.5 13.5 6.5 13ZM13.5 13C13.5 12.5 14 12 15 12C16 12 16.5 12.5 16.5 13S16 14 15 14C14 14 13.5 13.5 13.5 13Z" />
              <!-- Talón separado -->
              <path d="M11.5 26C8 26 6 29 6 33C6 36.5 8.5 38 11.5 38C14.5 38 17 36.5 17 33C17 29 15 26 11.5 26Z" />
            </svg>
          </div>
        `,
        iconSize: [14, 22],
        iconAnchor: [7, 11]
      });

      const marcadorPaso = L.marker(latLngPaso, {
        icon: iconoHuella,
        interactive: false
      });
      capaHuellas.addLayer(marcadorPaso);
    }
  }
}

// Función auxiliar para contrastar la localidad de un hito con el selector de territorio
function coincideTerritorio(hitoLocalidad, valorTerritorio) {
    if (!valorTerritorio || valorTerritorio === "todos" || valorTerritorio === "provincia") return true;
    const loc = (hitoLocalidad || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (valorTerritorio === "ushuaia") return loc.includes("ushuaia");
    if (valorTerritorio === "tolhuin") return loc.includes("tolhuin");
    if (valorTerritorio === "rio-grande" || valorTerritorio === "rio_grande") return loc.includes("rio grande");
    if (valorTerritorio === "almanza") return loc.includes("almanza");
    if (valorTerritorio === "san-sebastian") return loc.includes("sebastian");
    if (valorTerritorio === "malvinas") return loc.includes("malvinas");
    if (valorTerritorio === "esperanza") return loc.includes("esperanza");
    return true;
}

// 4. Dibujar marcadores dinámicos según visitas, filtros y búsqueda activa
function renderizarMarcadores(anunciarResultados = false) {
    marcadoresPorId = {};
    const visitas = obtenerVisitas();
    const t = DICCIONARIO[idiomaActual];

    const valorTerritorio = territorioActivo || "todos";
    const q = busquedaActiva.toLowerCase().trim();
    const zoomActual = mapa ? mapa.getZoom() : 8;
    const esZoomLejano = zoomActual <= 10;

    // Mantener oculto el aviso de modo provincia ya que se muestran todos los hitos de la provincia
    const elAvisoTerritorio = document.getElementById("aviso-mapa-territorio");
    if (elAvisoTerritorio) {
        elAvisoTerritorio.classList.add("hidden");
    }

    // Limpiar marcadores existentes en la capa
    if (capaMarcadores) capaMarcadores.clearLayers();

    const hitosFiltrados = listaHitos.filter(hito => {
        const cumpleCategoria = filtroActivo === "todos" || hito.categoria === filtroActivo;
        if (!cumpleCategoria) return false;

        const cumpleFragilidad = filtroFragilidad === "todas" || hito.fragilidad === filtroFragilidad;
        if (!cumpleFragilidad) return false;

        const visitado = visitas.includes(hito.id);
        if (filtroEstadoVisita === "visitados" && !visitado) return false;
        if (filtroEstadoVisita === "pendientes" && visitado) return false;

        if (!coincideTerritorio(hito.localidad, valorTerritorio)) {
            return false;
        }

        if (!q) return true;
        return (
            hito.nombre.toLowerCase().includes(q) ||
            (hito.nombre_en && hito.nombre_en.toLowerCase().includes(q)) ||
            hito.localidad.toLowerCase().includes(q) ||
            hito.toponimia.toLowerCase().includes(q) ||
            hito.categoria.toLowerCase().includes(q) ||
            hito.categoria.replace('_', ' ').toLowerCase().includes(q) ||
            (hito.rubroCreativo && hito.rubroCreativo.toLowerCase().includes(q)) ||
            (hito.rubroCreativo_en && hito.rubroCreativo_en.toLowerCase().includes(q)) ||
            (hito.contacto && hito.contacto.toLowerCase().includes(q)) ||
            (hito.descripcion && hito.descripcion.toLowerCase().includes(q)) ||
            (hito.descripcion_en && hito.descripcion_en.toLowerCase().includes(q))
        );
    });

    hitosFiltrados.forEach(hito => {
        const visitado = visitas.includes(hito.id);
        const seleccionado = hitoSeleccionadoId === hito.id;
        const colorBase = COLORES_CATEGORIA[hito.categoria] || "#f59e0b";
        const colorPin = visitado ? '#10b981' : colorBase;
        const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;

        const anchoPin = esZoomLejano ? 22 : 32;
        const altoPin = esZoomLejano ? 28 : 40;
        const anchorX = esZoomLejano ? 11 : 16;
        const anchorY = esZoomLejano ? 28 : 40;
        const anchoPinguino = esZoomLejano ? 12 : 18;
        const altoPinguino = esZoomLejano ? 14 : 20;
        const topPinguino = esZoomLejano ? 3.5 : 5;

        // Halo animado detrás del pin cuando está seleccionado
        const haloSeleccionado = seleccionado
            ? `<div class="absolute ${esZoomLejano ? 'w-5 h-5' : 'w-8 h-8'} rounded-full animate-ping opacity-60" style="background-color: ${colorPin}; top: 0px; z-index: 0;"></div>`
            : "";

        // Badge verde con ✓ arriba a la derecha si está visitado
        const badgeCheck = visitado
            ? (esZoomLejano
                ? `<div class="absolute z-20 -top-1 -right-1 bg-emerald-500 text-white rounded-full flex items-center justify-center border border-white w-3.5 h-3.5 text-[8px] font-bold">✓</div>`
                : `<div class="absolute z-20 -top-1 -right-1 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white w-4 h-4 text-[9px] font-bold">✓</div>`)
            : "";

        const icono = L.divIcon({
            className: `marcador-hito cursor-pointer ${seleccionado ? 'marcador-seleccionado scale-110' : ''}`,
            html: `
        <div class="relative flex items-center justify-center transform hover:scale-110 transition-all duration-200" style="width: ${anchoPin}px; height: ${altoPin}px;">
          ${haloSeleccionado}
          <!-- Pin del Mapa (Globo portador con fondo interior blanco) -->
          <svg class="absolute drop-shadow-md" width="${anchoPin}" height="${altoPin}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 27.5 16 40 16 40C16 40 32 27.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="${colorPin}" />
            <circle cx="16" cy="15" r="10" fill="white" />
          </svg>
          
          <!-- Silueta e Ilustración del Pingüino Austral -->
          <svg class="absolute z-10" width="${anchoPinguino}" height="${altoPinguino}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="top: ${topPinguino}px;">
            <!-- Cuerpo y Cabeza -->
            <path d="M12 2C8 2 5 6 5 12C5 17 8 21 12 21C16 21 19 17 19 12C19 6 16 2 12 2Z" fill="#0f172a" stroke="#334155" stroke-width="0.5"/>
            <!-- Panza Blanca -->
            <path d="M12 7C9.5 7 7.5 9.5 7.5 13.5C7.5 16.5 9.5 19 12 19C14.5 19 16.5 16.5 16.5 13.5C16.5 9.5 14.5 7 12 7Z" fill="#ffffff"/>
            <!-- Ojos -->
            <circle cx="10" cy="6.5" r="1.5" fill="#ffffff"/>
            <circle cx="10" cy="6.5" r="0.75" fill="#000000"/>
            <circle cx="14" cy="6.5" r="1.5" fill="#ffffff"/>
            <circle cx="14" cy="6.5" r="0.75" fill="#000000"/>
            <!-- Pico -->
            <polygon points="12,7.5 10.5,9.5 13.5,9.5" fill="#f97316"/>
            <!-- Alitas laterales -->
            <path d="M4.5 10C4 11.5 4 14.5 5 16C5.5 15 5.5 11.5 5 10" fill="#0f172a"/>
            <path d="M19.5 10C20 11.5 20 14.5 19 16C18.5 15 18.5 11.5 19 10" fill="#0f172a" stroke="#334155" stroke-width="0.4"/>
            <!-- Patitas -->
            <ellipse cx="9.5" cy="20.5" rx="1.8" ry="1" fill="#f97316"/>
            <ellipse cx="14.5" cy="20.5" rx="1.8" ry="1" fill="#f97316"/>
          </svg>

          ${badgeCheck}
        </div>
      `,
            iconSize: [anchoPin, altoPin],
            iconAnchor: [anchorX, anchorY]
        });

        const descripcionAlt = `${nombre}, ${hito.localidad}, ${visitado ? (idiomaActual === 'en' ? 'recorded' : 'registrado') : (idiomaActual === 'en' ? 'to explore' : 'por explorar')}`;
        const marcador = L.marker(hito.coordenadas, {
            icon: icono,
            title: nombre,
            alt: descripcionAlt,
            keyboard: true
        });

        // Popup rápido de Leaflet de Alta Densidad (Ultra compacto)
        const rubroPopup = (idiomaActual === "en" && hito.rubroCreativo_en) ? hito.rubroCreativo_en : hito.rubroCreativo;
        marcador.bindPopup(`
          <div class="space-y-1 text-xs">
            ${hito.selloIdentidad ? `
              <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 text-[9px] font-bold">
                <svg class="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z"/>
                </svg>
                <span>${t.sello_identidad_fueguina}</span>
              </div>
            ` : ''}
            <h4 class="font-bold text-xs text-slate-900 leading-tight">${nombre}</h4>
            <p class="text-[10px] text-slate-500 font-mono truncate">${t.toponimia} ${hito.toponimia}</p>
            <div class="text-[10px] text-slate-400 pt-0.5 border-t border-slate-100 flex items-center justify-between">
              <span>${hito.localidad}</span>
              <span class="capitalize text-orange-600 font-medium">${hito.categoria.replace('_', ' ')}</span>
            </div>
            <button type="button" class="btn-ver-ficha btn-popup-ver-detalle w-full mt-1 py-1 px-1.5 text-center bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white rounded-md text-[10px] font-bold transition shadow-xs cursor-pointer" data-id="${hito.id}" onclick="abrirDetalleHito('${hito.id}')">
              ${idiomaActual === "en" ? "View Full Site Info" : "Ver Ficha Completa"} →
            </button>
          </div>
        `, {
            offset: [0, esZoomLejano ? -20 : -28],
            className: "popup-hito",
            autoPan: true,
            autoPanPadding: [12, 65]
        });

        // Evento clic: centrado suave con panTo y apertura del popup compacto (cerrando el panel en móvil si estuviera abierto)
        marcador.on("click", () => {
            if (window.innerWidth < 768 && typeof cerrarPanelMobile === "function") {
                cerrarPanelMobile();
            }
            seleccionarHito(hito, true, true, false);
            cambiarPestanaSidebar("explorar");
        });

        marcador.on("popupopen", () => {
            const btnPopup = document.querySelector(`.btn-popup-ver-detalle[data-id="${hito.id}"]`);
            if (btnPopup) {
                btnPopup.addEventListener("click", () => {
                    abrirDetalleHito(hito.id);
                });
            }
        });

        capaMarcadores.addLayer(marcador);
        marcadoresPorId[hito.id] = marcador;
    });

    // Guardar referencia a hitos filtrados para listas inteligentes
    window.hitosFiltradosActuales = hitosFiltrados;

    // Actualizar micro-interacciones de contadores dinámicos por categoría
    actualizarContadoresCategoria();

    // Renderizar panel de hito (muestra destacados/recomendados si no hay hito seleccionado)
    renderizarListaHitosCompacta(hitosFiltrados);

    // Actualizar barra de estado y contador de filtros
    actualizarContadorFiltros(hitosFiltrados.length, listaHitos.length);

    if (anunciarResultados) {
        const cant = hitosFiltrados.length;
        anunciarAccesibilidad(
            idiomaActual === "en"
                ? `Showing ${cant} ${cant === 1 ? 'site' : 'sites'} on the map.`
                : `Mostrando ${cant} ${cant === 1 ? 'hito' : 'hitos'} en el mapa.`
        );
    }
    return hitosFiltrados.length;
}

// 4.1. Actualizar contador de hitos visibles y visibilidad del botón "Limpiar filtros"
function actualizarContadorFiltros(totalFiltrados, totalTotal) {
    const contador = document.getElementById("contador-hitos");
    const btnLimpiar = document.getElementById("btn-limpiar-filtros");
    const totalSeguro = totalTotal || (Array.isArray(listaHitos) && listaHitos.length > 0 ? listaHitos.length : 25);
    if (contador) {
        contador.textContent = idiomaActual === "en"
            ? `Showing ${totalFiltrados} of ${totalSeguro} sites`
            : `Mostrando ${totalFiltrados} de ${totalSeguro} hitos`;
    }
    if (btnLimpiar) {
        const hayFiltroTerritorio = Boolean(territorioActivo && territorioActivo !== "todos" && territorioActivo !== "provincia");
        const hayFiltroBusqueda = Boolean(busquedaActiva && busquedaActiva.trim().length > 0);
        const hayFiltroCat = filtroActivo !== "todos" && filtroActivo !== "todas";
        const hayFiltroFrag = filtroFragilidad !== "todas" && filtroFragilidad !== "todos";
        const hayFiltroEstado = filtroEstadoVisita !== "todos";

        if (hayFiltroTerritorio || hayFiltroBusqueda || hayFiltroCat || hayFiltroFrag || hayFiltroEstado) {
            btnLimpiar.classList.remove("hidden");
        } else {
            btnLimpiar.classList.add("hidden");
        }
    }
}

// 4.2. Restablecer todos los filtros a sus valores predeterminados y recentrar el mapa
function limpiarTodosLosFiltros() {
    busquedaActiva = "";
    const inputBusqueda = document.getElementById("buscador-hitos");
    if (inputBusqueda) inputBusqueda.value = "";
    document.getElementById("btn-limpiar-busqueda")?.classList.add("hidden");

    filtroActivo = "todos";
    const botonesCat = document.querySelectorAll(".btn-filtro, .filtro-cat-btn");
    const claseActiva = "filtro-cat-btn btn-cat-activo shrink-0 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition shadow-sm flex items-center";
    const claseInactiva = "filtro-cat-btn shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition flex items-center";
    botonesCat.forEach(b => {
        const cat = b.getAttribute("data-cat");
        if (cat === "todos" || cat === "todas") {
            b.className = claseActiva;
        } else {
            b.className = claseInactiva;
        }
    });

    filtroFragilidad = "todas";
    const selFrag = document.getElementById("filtro-fragilidad");
    if (selFrag) selFrag.value = "todas";
    actualizarIndicadorFragilidad();

    filtroEstadoVisita = "todos";
    const selEstado = document.getElementById("filtro-estado-visita");
    if (selEstado) {
        if (selEstado.tagName === "SELECT") {
            selEstado.value = "todos";
        } else {
            const botones = selEstado.querySelectorAll(".btn-filtro-estado");
            botones.forEach(b => {
                const est = b.getAttribute("data-estado");
                if (est === "todos") {
                    b.classList.add("active", "bg-amber-500", "text-slate-950", "font-bold", "shadow-sm");
                    b.classList.remove("text-slate-400", "font-medium");
                } else {
                    b.classList.remove("active", "bg-amber-500", "text-slate-950", "font-bold", "shadow-sm");
                    b.classList.add("text-slate-400", "font-medium");
                }
            });
        }
    }

    actualizarContadoresCategoria();

    territorioActivo = "todos";
    actualizarDropdownTerritorioUI("todos", idiomaActual === "en" ? "📍 Entire Province" : "📍 Toda la Provincia");
    hitoSeleccionadoId = null;

    // Recentrar mapa en toda la provincia
    const configVista = VISTAS_TERRITORIO["provincia"] || VISTAS_TERRITORIO["todos"];
    if (configVista && mapa) {
        mapa.flyTo(configVista.centro, configVista.zoom, {
            animate: true,
            duration: 1.2
        });
    }

    renderizarMarcadores(true);
    actualizarTrazadoRuta();
}

// 5. Seleccionar un hito, centrar el mapa suavemente y desplegar su información
function seleccionarHito(hito, volar = true, abrirPopup = false, abrirPantallaCompleta = false) {
    hitoSeleccionadoId = hito.id;

    if (window.innerWidth < 768 && typeof cerrarPanelMobile === "function") {
        cerrarPanelMobile();
    }

    // Si el marcador no está renderizado (por ej. modo provincia solo visitados y el hito no estaba visitado), actualizar marcadores
    if (!marcadoresPorId || !marcadoresPorId[hito.id]) {
        renderizarMarcadores();
    }

    const marcador = marcadoresPorId && marcadoresPorId[hito.id];
    if (volar && mapa && hito.coordenadas) {
        const bounds = typeof mapa.getBounds === "function" ? mapa.getBounds() : null;
        const visibleEnPantalla = bounds ? bounds.contains(hito.coordenadas) : false;

        // Si el marcador ya está visible en pantalla, usamos panTo sin alterar zoom
        // Esto evita disparar el evento "zoomend" que ejecutaría renderizarMarcadores (clearLayers) y destruiría el popup
        if (visibleEnPantalla) {
            mapa.panTo(hito.coordenadas, { animate: true, duration: 0.5 });
        } else {
            mapa.flyTo(hito.coordenadas, 12, {
                animate: true,
                duration: 1.0
            });
        }
    }
    if (marcador && abrirPopup) {
        marcador.openPopup();
    }

    // Actualizar la tarjeta del hito seleccionado en el panel
    renderizarListaHitosCompacta();

    mostrarDetalleHito(hito);
    renderizarInsignias();
    renderizarSellosSidebar();

    if (abrirPantallaCompleta) {
        abrirDetalleHitoCompleto(hito);
    }

    const nombreHito = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
    anunciarAccesibilidad(
        idiomaActual === "en"
            ? `Site selected: ${nombreHito}, ${hito.localidad}. Toponymy: ${hito.toponimia}.`
            : `Hito seleccionado: ${nombreHito}, ${hito.localidad}. Toponimia: ${hito.toponimia}.`
    );
}

// Actualizar contadores dinámicos de cada categoría según el territorio y búsqueda activos
function actualizarContadoresCategoria() {
    if (!Array.isArray(listaHitos) || listaHitos.length === 0) return;
    const q = (busquedaActiva || "").toLowerCase().trim();
    const territorio = territorioActivo || "todos";

    const hitosBase = listaHitos.filter(hito => {
        if (!coincideTerritorio(hito.localidad, territorio)) return false;
        if (!q) return true;
        return (
            hito.nombre.toLowerCase().includes(q) ||
            (hito.nombre_en && hito.nombre_en.toLowerCase().includes(q)) ||
            hito.localidad.toLowerCase().includes(q) ||
            hito.toponimia.toLowerCase().includes(q) ||
            hito.categoria.toLowerCase().includes(q) ||
            hito.categoria.replace('_', ' ').toLowerCase().includes(q) ||
            (hito.rubroCreativo && hito.rubroCreativo.toLowerCase().includes(q)) ||
            (hito.rubroCreativo_en && hito.rubroCreativo_en.toLowerCase().includes(q)) ||
            (hito.contacto && hito.contacto.toLowerCase().includes(q)) ||
            (hito.descripcion && hito.descripcion.toLowerCase().includes(q)) ||
            (hito.descripcion_en && hito.descripcion_en.toLowerCase().includes(q))
        );
    });

    const conteos = {
        todas: hitosBase.length,
        todos: hitosBase.length,
        patrimonio: hitosBase.filter(h => h.categoria === "patrimonio").length,
        senderos: hitosBase.filter(h => h.categoria === "senderos").length,
        economia_creativa: hitosBase.filter(h => h.categoria === "economia_creativa").length
    };

    document.querySelectorAll(".filtro-cat-btn").forEach(btn => {
        const cat = btn.getAttribute("data-cat");
        const badge = btn.querySelector(".contador-cat");
        if (badge && conteos[cat] !== undefined) {
            badge.textContent = conteos[cat];
            const esActivo = (filtroActivo === cat) || (cat === "todas" && (filtroActivo === "todos" || filtroActivo === "todas"));
            if (esActivo) {
                badge.className = "contador-cat ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono";
            } else {
                badge.className = "contador-cat ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 text-slate-700 font-mono";
            }
        }
    });
}

// Sincronizar indicador de color dinámico de fragilidad
function actualizarIndicadorFragilidad() {
    const indicador = document.getElementById("indicador-color-fragilidad");
    const selFrag = document.getElementById("filtro-fragilidad");
    if (!indicador || !selFrag) return;

    const val = selFrag.value;
    const mapaColores = {
        todas: "bg-slate-400",
        todos: "bg-slate-400",
        Baja: "bg-emerald-500",
        Media: "bg-amber-500",
        Alta: "bg-orange-500",
        "Muy Alta": "bg-rose-500"
    };
    const claseColor = mapaColores[val] || "bg-slate-400";
    indicador.className = `w-2 h-2 rounded-full ${claseColor} inline-block transition-colors`;
}

// Generar badge de sensibilidad con punto de color
function obtenerBadgeFragilidad(fragilidad, idioma = "es") {
    let dotColor = "bg-slate-400";
    let bgBadge = "bg-slate-100 text-slate-700 border-slate-200/80";
    if (fragilidad === "Baja") {
        dotColor = "bg-emerald-500";
        bgBadge = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    } else if (fragilidad === "Media") {
        dotColor = "bg-amber-500";
        bgBadge = "bg-amber-50 text-amber-700 border-amber-200/60";
    } else if (fragilidad === "Alta") {
        dotColor = "bg-orange-500";
        bgBadge = "bg-orange-50 text-orange-700 border-orange-200/60";
    } else if (fragilidad === "Muy Alta") {
        dotColor = "bg-rose-500";
        bgBadge = "bg-rose-50 text-rose-700 border-rose-200/60";
    }
    const texto = idioma === "en" ? (fragilidad === "Muy Alta" ? "Very High" : fragilidad === "Alta" ? "High" : fragilidad === "Media" ? "Medium" : "Low") : (fragilidad || "Baja");
    return `
      <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bgBadge}">
        <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
        <span>${texto}</span>
      </span>
    `;
}

// Generar tarjeta HTML para el hito activo seleccionado
function generarTarjetaHitoActivoHTML(hito, visitado) {
    const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
    const rubro = (idiomaActual === "en" && hito.rubroCreativo_en) ? hito.rubroCreativo_en : (hito.rubroCreativo || (hito.categoria ? hito.categoria.replace('_', ' ') : ''));
    const badgeFrag = obtenerBadgeFragilidad(hito.fragilidad, idiomaActual);
    const textoVerFicha = idiomaActual === "en" ? "View card →" : "Ver ficha →";
    const textoActivo = idiomaActual === "en" ? "Selected site" : "Hito activo";

    return `
      <div class="tarjeta-hito-activa hito-card p-3 mb-2 bg-white/95 md:bg-orange-50/30 rounded-2xl border border-orange-500 ring-1 ring-orange-500 shadow-sm transition-all cursor-pointer group" data-id="${hito.id}">
        <div class="flex items-start gap-3">
          <img src="${hito.imagen || './icon.svg'}" alt="${nombre}" class="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100 border border-orange-200">
          <div class="flex-grow min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-1.5 py-0.5 rounded">${textoActivo}</span>
              ${visitado ? '<span class="text-emerald-600 text-xs font-bold flex items-center gap-0.5" title="Visitado">✓ Visitado</span>' : ''}
            </div>
            <h3 class="text-xs font-bold text-slate-800 truncate mt-1 group-hover:text-orange-600 transition-colors">${nombre}</h3>
            <p class="text-[11px] text-slate-500 truncate mt-0.5">${hito.localidad} • ${rubro}</p>
            <div class="flex items-center justify-between gap-2 mt-2">
              ${badgeFrag}
              <button type="button" class="btn-ver-ficha-directa text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-0.5 cursor-pointer">
                ${textoVerFicha}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
}

// Generar tarjeta compacta de hito recomendado / relacionado
function generarTarjetaHitoCompactaHTML(hito, visitado) {
    const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
    const rubro = (idiomaActual === "en" && hito.rubroCreativo_en) ? hito.rubroCreativo_en : (hito.rubroCreativo || (hito.categoria ? hito.categoria.replace('_', ' ') : ''));
    const colorBase = COLORES_CATEGORIA[hito.categoria] || "#f59e0b";
    const colorDot = visitado ? '#10b981' : colorBase;

    return `
      <div class="tarjeta-hito-compacta hito-card flex items-center gap-2.5 p-2 bg-white/95 hover:bg-slate-50/90 rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all cursor-pointer group" data-id="${hito.id}">
        <img src="${hito.imagen || './icon.svg'}" alt="${nombre}" class="w-11 h-11 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-100">
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${colorDot}"></span>
            <h4 class="text-xs font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">${nombre}</h4>
            ${visitado ? '<span class="text-emerald-500 text-xs shrink-0 font-bold" title="Visitado">✓</span>' : ''}
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
            <span class="font-medium text-slate-600">${hito.localidad}</span>
            <span>•</span>
            <span class="capitalize truncate">${rubro}</span>
          </div>
        </div>
        <div class="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 pr-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    `;
}

// Renderizar tarjeta del hito seleccionado y lista inteligente de sitios recomendados / filtrados en el panel lateral
function renderizarListaHitosCompacta(hitosFiltradosParam) {
    const contenedor = document.getElementById("contenedor-hitos-lista");
    if (!contenedor) return;

    if (Array.isArray(hitosFiltradosParam)) {
        window.hitosFiltradosActuales = hitosFiltradosParam;
    }

    const visitas = typeof obtenerVisitas === "function" ? obtenerVisitas() : [];
    const poolHitos = (Array.isArray(window.hitosFiltradosActuales) && window.hitosFiltradosActuales.length > 0)
        ? window.hitosFiltradosActuales
        : (Array.isArray(listaHitos) ? listaHitos : []);

    let html = "";

    if (hitoSeleccionadoId) {
        const data = (window.datosHitos && window.datosHitos[hitoSeleccionadoId]) ||
                     (datosHitos && datosHitos[hitoSeleccionadoId]) ||
                     (Array.isArray(listaHitos) ? listaHitos.find(h => h.id === hitoSeleccionadoId || String(h.id) === String(hitoSeleccionadoId)) : null);

        if (data) {
            const visitado = visitas.includes(data.id);
            html += generarTarjetaHitoActivoHTML(data, visitado);

            // Obtener hasta 3 hitos relacionados (misma localidad o misma categoría, excluyendo el activo)
            const relacionados = (Array.isArray(listaHitos) ? listaHitos : [])
                .filter(h => (h.id !== data.id && String(h.id) !== String(data.id)))
                .sort((a, b) => {
                    const scoreA = (a.localidad === data.localidad ? 2 : 0) + (a.categoria === data.categoria ? 1 : 0);
                    const scoreB = (b.localidad === data.localidad ? 2 : 0) + (b.categoria === data.categoria ? 1 : 0);
                    return scoreB - scoreA;
                })
                .slice(0, 3);

            if (relacionados.length > 0) {
                const tituloRelacionados = idiomaActual === "en" ? "Other sites in this area" : "Otros sitios en esta zona";
                html += `
                  <div class="mt-3 pt-2 border-t border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>${tituloRelacionados}</span>
                      <span class="text-[9px] text-slate-400 font-mono">${relacionados.length}</span>
                    </p>
                    <div class="flex flex-col gap-1.5">
                      ${relacionados.map(h => generarTarjetaHitoCompactaHTML(h, visitas.includes(h.id))).join("")}
                    </div>
                  </div>
                `;
            }
        }
    } else {
        // Cuando no hay hito seleccionado: mostrar hasta 4 tarjetas compactas de recomendados / filtrados
        const recomendados = poolHitos.slice(0, 4);
        const total = poolHitos.length;
        const tituloSugeridos = idiomaActual === "en" ? "Suggested sites to explore" : "Sugeridos para explorar";

        html += `
          <div class="mb-2">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>${tituloSugeridos}</span>
              <span class="text-[9px] text-slate-400 font-mono">${recomendados.length} / ${total}</span>
            </p>
            <div class="flex flex-col gap-1.5">
              ${recomendados.map(h => generarTarjetaHitoCompactaHTML(h, visitas.includes(h.id))).join("")}
            </div>
            <div class="pt-2 text-center">
              <button id="btn-explorar-aleatorio" type="button" class="w-full inline-flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs">
                🧭 ${idiomaActual === "en" ? "Discover a suggested landmark" : "Descubrir un hito sugerido"}
              </button>
            </div>
          </div>
        `;
    }

    contenedor.innerHTML = html;

    // Vincular eventos de tarjetas compactas
    contenedor.querySelectorAll(".tarjeta-hito-compacta").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            const hito = Array.isArray(listaHitos) ? listaHitos.find(h => h.id === id || String(h.id) === String(id)) : null;
            if (hito) {
                seleccionarHito(hito, true, true, false);
            }
        });
    });

    // Vincular eventos de tarjeta activa
    const cardActiva = contenedor.querySelector(".tarjeta-hito-activa");
    if (cardActiva) {
        const idActivo = cardActiva.getAttribute("data-id");
        cardActiva.addEventListener("click", () => {
            abrirDetalleHito(idActivo);
        });
        const btnVerFicha = cardActiva.querySelector(".btn-ver-ficha-directa");
        if (btnVerFicha) {
            btnVerFicha.addEventListener("click", (e) => {
                e.stopPropagation();
                abrirDetalleHito(idActivo);
            });
        }
    }
}

// Función Maestra para abrir el detalle inmersivo (Ficha Completa)
function abrirDetalleHito(id) {
    if (typeof cerrarPanelMobile === "function") {
        cerrarPanelMobile();
    }
    // datosHitos es tu base de datos o JSON con la info de los lugares
    const data = (window.datosHitos && window.datosHitos[id]) || datosHitos[id] || (Array.isArray(listaHitos) ? listaHitos.find(h => h.id === id || String(h.id) === String(id)) : null);

    if (data) {
        hitoSeleccionadoId = data.id;

        // Centrado suave en el mapa
        if (mapa && data.coordenadas) {
            mapa.flyTo(data.coordenadas, 12, {
                animate: true,
                duration: 1.2
            });
        }

        // Cerrar popup del mapa para que no quede flotando por detrás del modal
        if (mapa) {
            mapa.closePopup();
        }

        // Sincronizar panel lateral/inferior para mostrar únicamente la ficha seleccionada y ocultar el estado vacío
        renderizarListaHitosCompacta();

        // Inyectar datos en elementos estructurados
        const imgEl = document.getElementById('detalle-imagen');
        if (imgEl) imgEl.src = data.imagen || './icon.svg';

        const titulo = (idiomaActual === "en" && data.nombre_en) ? data.nombre_en : (data.titulo || data.nombre);
        const titEl = document.getElementById('detalle-titulo');
        if (titEl) titEl.textContent = titulo;

        const headerTitulo = document.getElementById('detalle-hito-header-titulo');
        if (headerTitulo) headerTitulo.textContent = titulo;

        const subEl = document.getElementById('detalle-subtitulo');
        if (subEl) subEl.textContent = data.subtitulo || ((idiomaActual === "en" ? "Toponymy: " : "Toponimia: ") + (data.toponimia || ''));

        const categoriaTexto = (idiomaActual === "en" && data.rubroCreativo_en)
            ? data.rubroCreativo_en
            : (data.rubroCreativo || (data.categoria ? data.categoria.replace('_', ' ') : ''));
        const etiEl = document.getElementById('detalle-etiquetas');
        if (etiEl) etiEl.innerHTML = `<span class="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-bold uppercase">${categoriaTexto}</span>`;

        const desEl = document.getElementById('detalle-descripcion');
        if (desEl) desEl.textContent = (idiomaActual === "en" && data.descripcion_en) ? data.descripcion_en : (data.descripcion || '');

        // Renderizado de ficha interactiva completa (audio-guía, notas de campo, sellos)
        mostrarDetalleHito(data);
        renderizarInsignias();
        renderizarSellosSidebar();

        // Resaltar tarjeta seleccionada en la lista compacta
        document.querySelectorAll(".hito-card").forEach(card => {
            if (card.getAttribute("data-id") === String(data.id)) {
                card.classList.add("border-orange-500", "ring-1", "ring-orange-500");
            } else {
                card.classList.remove("border-orange-500", "ring-1", "ring-orange-500");
            }
        });

        // Abrir modal
        const modal = document.getElementById('modal-detalle-hito') || document.getElementById('vista-detalle-hito-full');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.scrollTop = 0;
        }

        const nombreHito = (idiomaActual === "en" && data.nombre_en) ? data.nombre_en : data.nombre;
        anunciarAccesibilidad(
            idiomaActual === "en"
                ? `Site selected: ${nombreHito}, ${data.localidad}. Toponymy: ${data.toponimia}.`
                : `Hito seleccionado: ${nombreHito}, ${data.localidad}. Toponimia: ${data.toponimia}.`
        );
    } else {
        console.warn("No se encontró información para el hito con ID:", id);
    }
}
window.abrirDetalleHito = abrirDetalleHito;
window.abrirDetalleHitoCompleto = function(h) {
    if (!h) return;
    abrirDetalleHito(typeof h === 'object' ? h.id : h);
};

function cerrarDetalleHitoCompleto() {
    const modal = document.getElementById('modal-detalle-hito') || document.getElementById('vista-detalle-hito-full');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
window.cerrarDetalleHitoCompleto = cerrarDetalleHitoCompleto;

// Delegación global para botones "Ver Ficha Completa" en popups de Leaflet y tarjetas
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-ver-ficha, .btn-popup-ver-detalle");
    if (btn) {
        const id = btn.getAttribute("data-id");
        if (id) {
            e.preventDefault();
            e.stopPropagation();
            abrirDetalleHito(id);
        }
    }
});

// 6. Mostrar ficha de detalle e información pedagógica (con Audio-guía y Notas)
function mostrarDetalleHito(hito) {
    const panel = document.getElementById("panel-detalle-hito") || document.getElementById("panel-detalle");
    const panelVacio = document.getElementById("panel-detalle-vacio");
    if (panelVacio) panelVacio.classList.add("hidden");
    if (panel) panel.classList.remove("hidden");

    const visitas = obtenerVisitas();
    const esVisitado = visitas.includes(hito.id);
    const color = COLORES_CATEGORIA[hito.categoria] || "#f59e0b";
    const t = DICCIONARIO[idiomaActual];

    const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
    const descripcion = (idiomaActual === "en" && hito.descripcion_en) ? hito.descripcion_en : hito.descripcion;
    const fragilidad = (idiomaActual === "en" && hito.fragilidad_en) ? hito.fragilidad_en : hito.fragilidad;
    const conducta = (idiomaActual === "en" && hito.conducta_en) ? hito.conducta_en : hito.conducta;
    const rubroCreativo = (idiomaActual === "en" && hito.rubroCreativo_en) ? hito.rubroCreativo_en : hito.rubroCreativo;
    const fonetica = obtenerFoneticaHito(hito);
    const foneticaSignificado = fonetica
        ? (idiomaActual === "en" ? fonetica.significado_en : fonetica.significado_es)
        : "";
    const esZonaCriticaSAR = (hito.toponimia && hito.toponimia.toLowerCase().includes("tierra mayor")) ||
                             (hito.nombre && hito.nombre.toLowerCase().includes("esmeralda"));

    // Detener síntesis anterior si estaba activa
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }

    panel.innerHTML = `
    <div class="tarjeta-detalle-hito rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <!-- Tarjeta Fotográfica de Cabecera (respeta el border-radius superior) -->
      <div class="foto-hito h-36 w-full overflow-hidden relative bg-slate-950">
        <img src="${hito.imagen || './icon.svg'}" alt="${nombre}" class="w-full h-full object-cover">
        <div class="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700/60 shadow-sm flex items-center gap-1">
          <span>📷</span>
          <span class="truncate max-w-[170px]">${hito.credito_imagen || 'IDETDF'}</span>
        </div>
      </div>

      <div class="p-4 space-y-3.5">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1 space-y-1.5">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border truncate max-w-full"
                    style="color: ${color}; border-color: ${color}40; background-color: ${color}15;">
                ${hito.localidad} · ${hito.categoria.replace('_', ' ')}
              </span>
              ${hito.selloIdentidad ? `
                <span class="badge-identidad-fueguina" title="${t.sello_identidad_sub}">
                  <svg class="w-3.5 h-3.5 text-amber-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z"/>
                  </svg>
                  <span>${t.sello_identidad_fueguina}</span>
                </span>
              ` : ''}
            </div>
            <h3 class="text-base font-bold text-slate-900 leading-snug">${nombre}</h3>
            <p class="text-xs text-amber-700 font-mono">${t.toponimia} ${hito.toponimia}</p>
          </div>

          <!-- Botones de acción (Narrar relato accesible y Compartir) -->
          <div class="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <button id="btn-copiar-ficha" type="button"
                    class="btn-accion-icono w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 hover:text-slate-900 border border-slate-200 transition shadow-sm"
                    title="${idiomaActual === 'en' ? 'Copy site summary' : 'Compartir / Copiar resumen del sitio'}"
                    aria-label="${idiomaActual === 'en' ? 'Copy site summary to clipboard' : 'Copiar resumen de este hito al portapapeles'}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Botón accesible Text-to-Speech + Fonética Originaria -->
        <div class="flex flex-wrap items-center gap-2">
          <button id="btn-narrar-hito" type="button" aria-pressed="false"
                  class="btn-narracion-accesible flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold hover:bg-orange-100 transition-colors cursor-pointer"
                  aria-label="${idiomaActual === 'en' ? 'Listen to description and conservation recommendations for this site' : 'Escuchar descripción y recomendaciones de conservación de este hito'}">
            <svg class="w-4 h-4 text-orange-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            <span id="texto-narrar-hito">${t.audio_escuchar}</span>
          </button>
          ${fonetica ? `
            <button id="btn-fonetica-hito" type="button"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
                    aria-label="${idiomaActual === 'en' ? `Pronounce ${fonetica.lengua} term ${fonetica.termino}` : `Pronunciar término ${fonetica.lengua} ${fonetica.termino}`}">
              <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span>${t.fonetica_pronunciar} ${fonetica.silabas}</span>
            </button>
          ` : ''}
        </div>

        ${fonetica ? `
          <div class="modulo-fonetica-originaria p-2.5 rounded-xl bg-amber-950/25 border border-amber-500/25 text-[11px] space-y-1">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-amber-700">${t.fonetica_titulo} · ${fonetica.termino}</span>
              <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 text-[10px] font-bold">${fonetica.lengua}</span>
            </div>
            <p class="text-slate-600 leading-snug">
              <span class="font-mono text-amber-700">${fonetica.silabas}</span> — ${foneticaSignificado}
            </p>
          </div>
        ` : ''}

        <p class="text-xs text-slate-700 leading-relaxed border-t border-slate-200 pt-2.5">
          ${descripcion}
        </p>

        ${(hito.selloIdentidad || rubroCreativo || hito.contacto) ? `
          <div class="bloque-comercio-justo p-3 rounded-xl text-[11px] space-y-1">
            <div class="flex items-center justify-between gap-2">
              <span class="comercio-justo-titulo font-bold text-violet-300">${t.sello_identidad_sub}</span>
            </div>
            ${rubroCreativo ? `
              <div class="comercio-justo-texto text-slate-200">
                <strong class="font-semibold">${t.rubro_creativo}</strong> ${rubroCreativo}
              </div>
            ` : ''}
            ${hito.contacto ? `
              <div class="comercio-justo-texto text-slate-300 text-[10px]">
                <strong class="font-semibold">${t.punto_directo}</strong> ${hito.contacto}
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${esZonaCriticaSAR ? `
          <div class="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl space-y-1.5 text-xs">
            <div class="flex items-center justify-between text-rose-500 font-bold">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span>${idiomaActual === 'en' ? 'RESTRICTED AREA (SAR ALERT)' : 'ZONA RESTRINGIDA (ALERTA SAR)'}</span>
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">CRÍTICO</span>
            </div>
            <p class="text-slate-300 text-[11px] leading-relaxed">
              ${idiomaActual === 'en' ? 'Turbal Valle Tierra Mayor exhibits extreme drought under Copernicus Sentinel-1 SAR monitoring. Transit suspended.' : 'El turbal de Valle Tierra Mayor registra sequía severa según radar Copernicus Sentinel-1. Tránsito pedestre suspendido por preservación.'}
            </p>
            <button type="button" onclick="mostrarModalBloqueoPorNombre('Turbal Valle Tierra Mayor')" class="text-rose-400 hover:text-rose-300 font-bold underline text-[11px] cursor-pointer flex items-center gap-1">
              <span>${idiomaActual === 'en' ? 'View Restriction Protocol & Safe Route →' : 'Ver Protocolo de Bloqueo y Desvío Seguro →'}</span>
            </button>
          </div>
        ` : ''}

        <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
          <div class="flex justify-between items-center">
            <span class="text-slate-400 flex items-center gap-1.5">
              ${obtenerIconoFragilidadHoja("w-4 h-4")}
              <span>${t.fragilidad}</span>
            </span>
            <span class="font-semibold ${fragilidad === 'Muy Alta' || fragilidad === 'Alta' || fragilidad === 'Very High' || fragilidad === 'High' ? 'text-rose-400' : 'text-amber-400'}">
              ${fragilidad}
            </span>
          </div>
          <div>
            <span class="text-slate-400 block font-medium">${t.conducta}</span>
            <span class="text-slate-300 block text-[10px] mt-0.5 leading-tight">${conducta}</span>
          </div>
          <div class="pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
            ${t.fuente} <span class="text-slate-400">${hito.fuente}</span>
          </div>
        </div>

        <!-- Sección de Notas Personales (solo si el hito está registrado en la bitácora) -->
        ${esVisitado ? `
          <div class="space-y-1.5 border-t border-slate-800 pt-2.5">
            <div class="flex items-center justify-between">
              <label for="input-nota-hito" class="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span>📝</span>
                <span>${t.nota_label}</span>
              </label>
              <span id="status-guardado-nota" class="text-[10px] text-emerald-400 opacity-0 transition-opacity">✓ ${t.guardado}</span>
            </div>
            <textarea id="input-nota-hito" rows="2" 
                      placeholder="${t.nota_placeholder}"
                      class="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition resize-none"></textarea>
          </div>
        ` : ''}

        <div class="pt-1 flex flex-col sm:flex-row gap-2">
          <button id="btn-toggle-visita" 
                  class="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2 ${esVisitado ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 active:scale-95 text-white' }">
            <span>${esVisitado ? t.btn_quitar : t.btn_marcar}</span>
          </button>
          <button id="btn-ir-al-mapa-desde-ficha" type="button"
                  class="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
            <span>🗺️</span>
            <span>${idiomaActual === 'en' ? 'Locate on Map' : 'Ver en el Mapa'}</span>
          </button>
        </div>
      </div>
    </div>
  `;

    // Botón para volar al hito en el mapa y cerrar overlay
    const btnIrAlMapa = document.getElementById("btn-ir-al-mapa-desde-ficha");
    if (btnIrAlMapa) {
        btnIrAlMapa.addEventListener("click", () => {
            cerrarTodasLasVistas();
            if (mapa && hito.coordenadas) {
                mapa.flyTo(hito.coordenadas, 12, { animate: true, duration: 1.2 });
                const marcador = marcadoresPorId[hito.id];
                if (marcador) marcador.openPopup();
            }
        });
    }

    // 0. Configurar Botón Compartir / Copiar Resumen
    const btnCopiar = document.getElementById("btn-copiar-ficha");
    if (btnCopiar) {
        btnCopiar.addEventListener("click", async () => {
            const resumen = `🧭 Rastro Austral · Ficha Territorial
Sitio: ${nombre}
Toponimia: ${hito.toponimia}
Localidad: ${hito.localidad}
Categoría: ${hito.categoria.replace('_', ' ')}
Coordenadas: ${hito.coordenadas[0]}, ${hito.coordenadas[1]}
Fragilidad: ${fragilidad}
Conducta responsable sugerida: ${conducta}
Fuente: ${hito.fuente}
${descripcion}`;

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(resumen);
                } else {
                    const temp = document.createElement("textarea");
                    temp.value = resumen;
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand("copy");
                    document.body.removeChild(temp);
                }

                btnCopiar.classList.add("text-emerald-400", "border-emerald-500/60");
                anunciarAccesibilidad(idiomaActual === 'en' ? 'Site summary copied to clipboard.' : 'Resumen del sitio copiado al portapapeles.');

                setTimeout(() => {
                    btnCopiar.classList.remove("text-emerald-400", "border-emerald-500/60");
                }, 2000);
            } catch (err) {
                console.error("Error al copiar ficha:", err);
            }
        });
    }

    // 1. Configurar Narración accesible (Text-to-Speech nativo)
    const btnNarrar = document.getElementById("btn-narrar-hito");
    if (btnNarrar) {
        const actualizarEstadoNarracion = (hablando) => {
            const textoEl = document.getElementById("texto-narrar-hito");
            btnNarrar.setAttribute("aria-pressed", hablando ? "true" : "false");
            if (textoEl) {
                textoEl.innerText = hablando ? t.audio_detener : t.audio_escuchar;
            }
        };

        btnNarrar.addEventListener("click", () => {
            if (!('speechSynthesis' in window)) {
                anunciarAccesibilidad(idiomaActual === 'en' ? 'Speech synthesis is not supported in this browser.' : 'La lectura en voz alta no está disponible en este navegador.');
                return;
            }

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                actualizarEstadoNarracion(false);
                anunciarAccesibilidad(idiomaActual === 'en' ? 'Audio narration stopped.' : 'Narración detenida.');
            } else {
                speechSynthesis.cancel();
                const textoFonetico = fonetica
                    ? (idiomaActual === 'en'
                        ? `Indigenous ${fonetica.lengua} term ${fonetica.tts}, meaning ${foneticaSignificado}. `
                        : `Voz originaria ${fonetica.lengua} ${fonetica.tts}, que significa ${foneticaSignificado}. `)
                    : "";
                const textoSello = hito.selloIdentidad
                    ? (idiomaActual === 'en'
                        ? `${t.sello_identidad_fueguina}, ${t.sello_identidad_sub}. ${rubroCreativo ? `${t.rubro_creativo} ${rubroCreativo}. ` : ''}`
                        : `${t.sello_identidad_fueguina}, ${t.sello_identidad_sub}. ${rubroCreativo ? `${t.rubro_creativo} ${rubroCreativo}. ` : ''}`)
                    : "";
                const textoLocucion = `${nombre}. ${hito.localidad}. ${textoSello}${t.toponimia} ${hito.toponimia}. ${textoFonetico}${descripcion}. ${t.fragilidad} ${fragilidad}. ${t.conducta} ${conducta}.`;
                const locucion = new SpeechSynthesisUtterance(textoLocucion);
                locucion.lang = idiomaActual === 'en' ? 'en-US' : 'es-AR';
                locucion.rate = 0.95;

                locucion.onstart = () => actualizarEstadoNarracion(true);
                locucion.onend = locucion.onerror = () => actualizarEstadoNarracion(false);

                speechSynthesis.speak(locucion);
            }
        });
    }

    // 1.1. Configurar botón dedicado de Fonética Originaria
    const btnFonetica = document.getElementById("btn-fonetica-hito");
    if (btnFonetica && fonetica) {
        btnFonetica.addEventListener("click", () => {
            if (!('speechSynthesis' in window)) {
                anunciarAccesibilidad(`${fonetica.termino}, ${fonetica.silabas}: ${foneticaSignificado}`);
                return;
            }
            speechSynthesis.cancel();
            const frase = idiomaActual === 'en'
                ? `${fonetica.tts}. ${fonetica.lengua} language, meaning: ${foneticaSignificado}.`
                : `${fonetica.tts}. En lengua ${fonetica.lengua}: ${foneticaSignificado}.`;
            const voz = new SpeechSynthesisUtterance(frase);
            voz.lang = idiomaActual === 'en' ? 'en-US' : 'es-AR';
            voz.rate = 0.78;
            speechSynthesis.speak(voz);
            anunciarAccesibilidad(`${fonetica.termino} ${fonetica.silabas}`);
        });
    }

    // 2. Configurar persistencia de Notas Personales
    const textareaNota = document.getElementById("input-nota-hito");
    if (textareaNota) {
        textareaNota.value = obtenerNota(hito.id);

        let timeoutGuardado;
        const persistir = () => {
            guardarNota(hito.id, textareaNota.value);
            const status = document.getElementById("status-guardado-nota");
            if (status) {
                status.classList.remove("opacity-0");
                setTimeout(() => status?.classList.add("opacity-0"), 1200);
            }
        };

        textareaNota.addEventListener("blur", persistir);
        textareaNota.addEventListener("input", () => {
            clearTimeout(timeoutGuardado);
            timeoutGuardado = setTimeout(persistir, 750);
        });
    }

    // 3. Configurar botón de alternar visita y actualizar ruta
    document.getElementById("btn-toggle-visita").addEventListener("click", () => {
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        const ahoraVisitado = alternarVisita(hito.id);
        vibrarDispositivo(ahoraVisitado ? [50, 40, 60] : 30);
        renderizarMarcadores();
        renderizarInsignias();
        renderizarSellosSidebar();
        actualizarBadgeSellos();
        actualizarMetricas();
        actualizarTrazadoRuta();
        actualizarMetricasDistancia();
        mostrarDetalleHito(hito);
        anunciarAccesibilidad(
            ahoraVisitado
                ? (idiomaActual === 'en' ? `${nombre} added to your Trail.` : `${nombre} registrado en tu Rastro.`)
                : (idiomaActual === 'en' ? `${nombre} removed from your Trail.` : `${nombre} quitado de tu Rastro.`)
        );
    });
}


// Diseños de sellos 3D minimalistas con volumen e iluminación mate
const ICONOS_3D_SELLOS = {
  // 1. Costa y Canal Beagle (Ola marina esculpida)
  sello_costero: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_costa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#g_costa)"/>
      <path d="M10 23C13 17 18 17 21 21C24 25 28 22 30 20C29 26 23 28 17 28C13 28 11 25 10 23Z" fill="#ffffff" fill-opacity="0.9"/>
      <circle cx="16" cy="14" r="1.5" fill="#e0f2fe"/>
    </svg>`,

  // 2. Glaciares y Montañas Altoandinas (Pirámide de hielo facetada 3D)
  sello_glaciar: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_glaciar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#93c5fd"/>
          <stop offset="100%" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="#1e293b"/>
      <path d="M20 7L28 27H12L20 7Z" fill="url(#g_glaciar)"/>
      <path d="M20 7L28 27H20V7Z" fill="#1d4ed8" fill-opacity="0.5"/>
      <polygon points="20,7 23,16 20,18 17,16" fill="#f8fafc"/>
    </svg>`,

  // 3. Patrimonio Histórico / Presidio (Monolito arquitectónico 3D)
  sello_presidio: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <circle cx="20" cy="20" r="17" fill="#475569"/>
      <rect x="12" y="15" width="16" height="13" rx="2" fill="#94a3b8"/>
      <rect x="14" y="18" width="3" height="4" rx="1" fill="#1e293b"/>
      <rect x="23" y="18" width="3" height="4" rx="1" fill="#1e293b"/>
      <path d="M10 15L20 9L30 15H10Z" fill="#cbd5e1"/>
    </svg>`,

  // 4. Bosque Fueguino y Turbales (Conífera/Lenga minimalista 3D)
  sello_esmeralda: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_bosque" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34d399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="#064e3b"/>
      <path d="M20 9L26 17H22L27 24H13L18 17H14L20 9Z" fill="url(#g_bosque)"/>
      <rect x="18.5" y="24" width="3" height="5" rx="1" fill="#78350f"/>
    </svg>`,

  // 5. Oficios y Creatividad Austral (Prisma de pigmento / paleta facetada)
  sello_creativo: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_creat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#7e22ce"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#g_creat)"/>
      <circle cx="15" cy="17" r="2.5" fill="#fde047"/>
      <circle cx="25" cy="16" r="2.5" fill="#f43f5e"/>
      <circle cx="21" cy="23" r="2.5" fill="#38bdf8"/>
    </svg>`,

  // 6. Centolla del Beagle (Ficha esculpida con pinzas geométricas)
  sello_almanza: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <circle cx="20" cy="20" r="17" fill="#991b1b"/>
      <ellipse cx="20" cy="21" rx="6" ry="4.5" fill="#ef4444"/>
      <path d="M14 17C12 14 14 11 16 12C16.5 13.5 15 15.5 15 17" stroke="#fca5a5" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M26 17C28 14 26 11 24 12C23.5 13.5 25 15.5 25 17" stroke="#fca5a5" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="18" cy="19" r="0.8" fill="#ffffff"/>
      <circle cx="22" cy="19" r="0.8" fill="#ffffff"/>
    </svg>`,

  // 7. Naufragio y Faro de San Pablo (Ancla y Faro escultórico)
  sello_naufragio: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <circle cx="20" cy="20" r="17" fill="#0f172a"/>
      <circle cx="20" cy="13" r="3" stroke="#f59e0b" stroke-width="2" fill="none"/>
      <line x1="20" y1="16" x2="20" y2="28" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M13 22C15 27 25 27 27 22" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </svg>`,

  // 8. Fauna Nativa / Guanaco (Silueta geométrica en altorrelieve)
  sello_corazon: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <circle cx="20" cy="20" r="17" fill="#78350f"/>
      <path d="M15 27V19C15 16 17 13 19 10H22L21 16L24 18V27H21V22H18V27H15Z" fill="#fde68a"/>
    </svg>`,

  // 9. Paso Garibaldi y Mirador de Altura
  sello_garibaldi: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_garibaldi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#g_garibaldi)"/>
      <polygon points="12,26 20,13 28,26" fill="#0f172a" fill-opacity="0.8"/>
      <polygon points="17,17.5 20,13 23,17.5 20,19" fill="#f8fafc"/>
      <path d="M14 27C17 25 23 25 26 27" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

  // 10. Aserradero Kamuk y Tronco de Lenga
  sello_maderero: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_mad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#g_mad)"/>
      <circle cx="20" cy="20" r="12" fill="#d97706" stroke="#451a03" stroke-width="1"/>
      <circle cx="20" cy="20" r="7.5" fill="none" stroke="#78350f" stroke-width="1.2"/>
      <circle cx="20" cy="20" r="3.5" fill="#451a03"/>
    </svg>`,

  // 11. Laguna Negra y Turbal Ecosistémico
  sello_turbal: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_turba" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#g_turba)"/>
      <ellipse cx="20" cy="20" rx="11" ry="6.5" fill="#1e293b"/>
      <ellipse cx="19" cy="19.5" rx="7.5" ry="4" fill="#38bdf8" fill-opacity="0.8"/>
      <circle cx="26" cy="15" r="2.5" fill="#fbbf24"/>
    </svg>`,

  // 12. Alfarería y Tornería en Madera
  sello_madera: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_alfareria" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#9a3412"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="#431407"/>
      <path d="M15 13H25L26 18C26 23 23 27 20 27C17 27 14 23 14 18L15 13Z" fill="url(#g_alfareria)"/>
      <ellipse cx="20" cy="13" rx="5" ry="1.5" fill="#ffedd5"/>
    </svg>`,

  // 13. Misión Salesiana La Candelaria
  sello_norte: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <circle cx="20" cy="20" r="17" fill="#1e293b"/>
      <polygon points="20,8 24,14 16,14" fill="#f59e0b"/>
      <rect x="17" y="14" width="6" height="13" fill="#e2e8f0"/>
      <path d="M19 8V5H21V8" stroke="#f59e0b" stroke-width="1.5"/>
      <path d="M18 6.5H22" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="18.5" y="21" width="3" height="6" rx="1.5" fill="#0f172a"/>
    </svg>`,

  // 14. Tejido e Hilado Ovino Estepario
  sello_textil: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_lana" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#eab308"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="#713f12"/>
      <circle cx="20" cy="20" r="11" fill="url(#g_lana)"/>
      <path d="M13 16C15 22 25 18 27 24" stroke="#854d0e" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 24C20 16 24 23 27 15" stroke="#a16207" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

  // 15. Aves Migratorias y Costa Atlántica
  sello_aves: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <defs>
        <linearGradient id="g_aves" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#g_aves)"/>
      <path d="M10 20C15 17 18 19 22 17C26 15 28 12 30 11C28 17 24 21 20 22C16 23 13 22 10 20Z" fill="#fb923c"/>
      <path d="M16 19L23 12L21 19Z" fill="#ea580c"/>
    </svg>`,

  // 16. Frigorífico CAP Histórico
  sello_cap: `
    <svg viewBox="0 0 40 40" class="w-7 h-7 drop-shadow-md sello-3d-ficha">
      <circle cx="20" cy="20" r="17" fill="#334155"/>
      <rect x="13" y="19" width="14" height="9" rx="1" fill="#991b1b"/>
      <rect x="23" y="10" width="3.5" height="18" fill="#7f1d1d"/>
      <line x1="22.5" y1="10" x2="27" y2="10" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="15" y="22" width="2.5" height="3" fill="#fef08a"/>
      <rect x="19" y="22" width="2.5" height="3" fill="#fef08a"/>
    </svg>`
};

function obtenerIconoSello(hito, visitado) {
  if (!visitado) {
    return `
      <svg viewBox="0 0 40 40" class="w-6 h-6 opacity-40 sello-3d-ficha">
        <circle cx="20" cy="20" r="16" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-dasharray="2 2"/>
        <rect x="14" y="18" width="12" height="10" rx="2" fill="currentColor"/>
        <path d="M17 18V14C17 12.3 18.3 11 20 11C21.7 11 23 12.3 23 14V18" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    `;
  }
  return ICONOS_3D_SELLOS[hito.insignia] || ICONOS_3D_SELLOS.sello_costero;
}

// 7. Sellos del Pasaporte / Expedición con evento click interactivo
function renderizarInsignias() {
    const contenedor = document.getElementById("contenedor-insignias");
    if (!contenedor) return;
    const visitas = obtenerVisitas();
    const t = DICCIONARIO[idiomaActual];

    contenedor.innerHTML = listaHitos.map(hito => {
        const desbloqueado = visitas.includes(hito.id);
        const seleccionado = hitoSeleccionadoId === hito.id;
        const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
        return `
      <div data-id="${hito.id}" 
           title="${nombre} (${hito.localidad}) - ${t.tocar_explorar}"
           class="badge-stamp flex-shrink-0 flex flex-col items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${ seleccionado ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/20 shadow-md scale-105' : '' } ${desbloqueado ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 desbloqueado' : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600 bloqueado' }" style="min-width: 78px;">
        <div class="flex items-center justify-center w-7 h-7 my-0.5">${obtenerIconoSello(hito, desbloqueado)}</div>
        <span class="text-[10px] font-bold mt-1 truncate max-w-[70px] leading-tight">${hito.localidad}</span>
      </div>
    `;
    }).join("");
}

// Configuración del clic sobre sellos: flyTo, abrir detalle y desplegar en móvil
function configurarInsigniasInteractivas() {
    const contenedor = document.getElementById("contenedor-insignias");
    if (!contenedor) return;

    contenedor.addEventListener("click", (e) => {
        const tarjeta = e.target.closest(".badge-stamp");
        if (!tarjeta) return;
        const id = tarjeta.getAttribute("data-id");
        const hito = listaHitos.find(h => h.id === id);
        if (hito) {
            seleccionarHito(hito, true, true);
        }
    });
}

// 8. Actualizar métricas del encabezado y progreso visual
function actualizarMetricas() {
    const visitas = obtenerVisitas();
    const total = (Array.isArray(listaHitos) && listaHitos.length > 0) ? listaHitos.length : 25;
    const porcentaje = Math.round((visitas.length / total) * 100);

    const elVisitas = document.getElementById("contador-visitas");
    const elTotal = document.getElementById("contador-total");
    const elBarra = document.getElementById("barra-progreso");
    const elPorcentaje = document.getElementById("porcentaje-progreso");

    if (elVisitas) elVisitas.innerText = visitas.length;
    if (elTotal) elTotal.innerText = total;
    if (elBarra) elBarra.style.width = `${porcentaje}%`;
    if (elPorcentaje) elPorcentaje.innerText = `${porcentaje}%`;

    actualizarHuellaConsciente();
    actualizarMetricasDistancia();
    actualizarBadgeSellos();
}

// 9. Filtros por capas
function configurarFiltros() {
    const botones = document.querySelectorAll(".btn-filtro, .filtro-cat-btn");
    const claseActiva = "filtro-cat-btn btn-cat-activo shrink-0 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition shadow-sm flex items-center";
    const claseInactiva = "filtro-cat-btn shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition flex items-center";

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            botones.forEach(b => {
                b.className = claseInactiva;
            });
            btn.className = claseActiva;

            let cat = btn.getAttribute("data-cat");
            if (cat === "todas") cat = "todos";
            filtroActivo = cat;
            hitoSeleccionadoId = null; // Reiniciar selección para desplegar los hitos filtrados debajo de los filtros
            actualizarContadoresCategoria();
            renderizarMarcadores(true);
            actualizarTrazadoRuta();

            if (typeof window.actualizarClimaTerritorio === "function") {
                window.actualizarClimaTerritorio(territorioActivo);
            }
        });
    });

    const btnLimpiar = document.getElementById("btn-limpiar-filtros");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarTodosLosFiltros);
    }

    document.addEventListener("click", (e) => {
        const btnExplorar = e.target.closest("#btn-explorar-aleatorio");
        if (btnExplorar) {
            if (!Array.isArray(listaHitos) || listaHitos.length === 0) return;
            const indice = Math.floor(Math.random() * listaHitos.length);
            const hito = listaHitos[indice];
            if (hito) {
                seleccionarHito(hito, true, true, false);
                cambiarPestanaSidebar("explorar");
            }
        }
    });
}

// 10. Lógica de búsqueda en tiempo real
function configurarBuscador() {
    const input = document.getElementById("buscador-hitos");
    const btnLimpiar = document.getElementById("btn-limpiar-busqueda");
    if (!input) return;

    input.addEventListener("input", (e) => {
        busquedaActiva = e.target.value;
        if (busquedaActiva.trim().length > 0) {
            btnLimpiar?.classList.remove("hidden");
        } else {
            btnLimpiar?.classList.add("hidden");
        }
        renderizarMarcadores();
        actualizarTrazadoRuta();
    });

    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            input.value = "";
            busquedaActiva = "";
            btnLimpiar.classList.add("hidden");
            input.focus();
            renderizarMarcadores();
            actualizarTrazadoRuta();
        });
    }
}

// 11. Optimización responsive: Bottom Sheet deslizable y Bottom Nav para dispositivos móviles
function reducirPanelMobileSiExpandido() {
    const panel = document.getElementById("panel-lateral");
    if (!panel) return;
    if (panel.classList.contains("max-md:h-[78dvh]")) {
        panel.classList.remove("max-md:h-[78dvh]");
        panel.classList.add("max-md:h-[34dvh]");
        setTimeout(() => mapa && mapa.invalidateSize(), 250);
    }
}

function configurarPanelMobile() {
    const panel = document.getElementById("panel-lateral");
    const dragHandle = document.getElementById("bottom-sheet-drag-handle");
    const btnCerrar = document.getElementById("btn-cerrar-panel-mobile");
    const acordeonFiltros = document.getElementById("acordeon-filtros");

    if (acordeonFiltros && window.innerWidth >= 768) {
        acordeonFiltros.open = true;
    }

    if (!panel) return;

    function alternarBottomSheet() {
        if (!panel.classList.contains("translate-y-0")) {
            abrirPanelMobile(false);
        } else if (panel.classList.contains("max-md:h-[78dvh]")) {
            abrirPanelMobile(false);
        } else {
            abrirPanelMobile(true);
        }
    }

    if (dragHandle) {
        dragHandle.addEventListener("click", alternarBottomSheet);
        dragHandle.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                alternarBottomSheet();
            }
        });

        let inicioTouchY = null;
        dragHandle.addEventListener("touchstart", (e) => {
            if (e.touches && e.touches[0]) {
                inicioTouchY = e.touches[0].clientY;
            }
        }, { passive: true });

        dragHandle.addEventListener("touchend", (e) => {
            if (inicioTouchY === null || !e.changedTouches || !e.changedTouches[0]) return;
            const deltaY = e.changedTouches[0].clientY - inicioTouchY;
            inicioTouchY = null;
            if (deltaY < -24) {
                abrirPanelMobile(true);
            } else if (deltaY > 24) {
                if (panel.classList.contains("max-md:h-[78dvh]")) {
                    abrirPanelMobile(false);
                } else {
                    cerrarPanelMobile();
                }
            }
        }, { passive: true });
    }

    // Expandir a 78dvh al enfocar el buscador en móvil
    const buscador = document.getElementById("buscador-hitos");
    if (buscador) {
        buscador.addEventListener("focus", () => {
            if (window.innerWidth < 768) {
                abrirPanelMobile(true);
            }
        });
    }

    // Reducir suavemente a 34dvh al interactuar con filtros si estaba expandido
    document.addEventListener("click", (e) => {
        if (e.target.closest(".filtro-cat-btn, #filtro-fragilidad, #filtro-estado-visita, .btn-filtro-estado")) {
            reducirPanelMobileSiExpandido();
        }
    });
    document.addEventListener("change", (e) => {
        if (e.target.closest("#filtro-fragilidad, #filtro-estado-visita")) {
            reducirPanelMobileSiExpandido();
        }
    });

    if (btnCerrar) {
        btnCerrar.addEventListener("click", cerrarPanelMobile);
    }

    configurarMobileBottomNav();
}

function abrirPanelMobile(expandirCompleto = false) {
    const panel = document.getElementById("panel-lateral");
    if (!panel) return;
    panel.classList.remove("translate-y-[120%]", "translate-y-full");
    panel.classList.add("translate-y-0");
    if (expandirCompleto) {
        panel.classList.remove("max-md:h-[34dvh]");
        panel.classList.add("max-md:h-[78dvh]");
    } else {
        panel.classList.remove("max-md:h-[78dvh]");
        panel.classList.add("max-md:h-[34dvh]");
    }
    actualizarEstadoMobileNav("hitos");
    setTimeout(() => mapa && mapa.invalidateSize(), 250);
}

function cerrarPanelMobile() {
    const panel = document.getElementById("panel-lateral");
    if (!panel) return;
    panel.classList.add("translate-y-[120%]");
    panel.classList.remove("translate-y-0", "translate-y-full");
    panel.classList.remove("max-md:h-[78dvh]");
    panel.classList.add("max-md:h-[34dvh]");
    actualizarEstadoMobileNav("mapa");
    if (mapa) {
        mapa.invalidateSize();
        setTimeout(() => mapa.invalidateSize(), 150);
    }
}

function actualizarEstadoMobileNav(activa) {
    const botones = {
        mapa: document.getElementById("btn-mobile-nav-mapa"),
        hitos: document.getElementById("btn-mobile-nav-hitos"),
        bitacora: document.getElementById("btn-mobile-nav-bitacora"),
        observatorio: document.getElementById("btn-mobile-nav-observatorio"),
        museo: document.getElementById("nav-mobile-museo")
    };

    const claseActiva = "btn-mobile-nav flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all cursor-pointer text-orange-600 font-bold bg-orange-50/50";
    const claseInactiva = "btn-mobile-nav flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-500 font-medium hover:text-slate-800";

    Object.keys(botones).forEach(k => {
        const btn = botones[k];
        if (!btn) return;
        if (k === activa) {
            btn.className = claseActiva;
            btn.setAttribute("aria-current", "page");
        } else {
            btn.className = claseInactiva;
            btn.removeAttribute("aria-current");
        }
    });
}

function configurarMobileBottomNav() {
    const btnMapa = document.getElementById("btn-mobile-nav-mapa");
    const btnHitos = document.getElementById("btn-mobile-nav-hitos");
    const btnBitacora = document.getElementById("btn-mobile-nav-bitacora");
    const btnObservatorio = document.getElementById("btn-mobile-nav-observatorio");
    const panel = document.getElementById("panel-lateral");

    if (btnMapa) {
        btnMapa.addEventListener("click", () => {
            if (panel) {
                panel.classList.add("translate-y-[120%]");
                panel.classList.remove("translate-y-0", "translate-y-full");
            }
            cerrarTodasLasVistas();
            const modalPasaporte = document.getElementById("modal-pasaporte") || document.getElementById("modal-libreta");
            if (modalPasaporte && !modalPasaporte.classList.contains("hidden")) {
                if (typeof window.cerrarModalPasaporte === "function") window.cerrarModalPasaporte();
                else modalPasaporte.classList.add("hidden");
            }
            actualizarEstadoMobileNav("mapa");
            if (mapa) {
                mapa.invalidateSize();
            }
            setTimeout(() => mapa && mapa.invalidateSize(), 250);
        });
    }

    if (btnHitos) {
        btnHitos.addEventListener("click", () => {
            const vistaBitacoraFull = document.getElementById("vista-bitacora-full");
            const vistaObservatorioFull = document.getElementById("vista-observatorio-full");
            if (vistaBitacoraFull) {
                vistaBitacoraFull.classList.add("hidden");
                vistaBitacoraFull.classList.remove("flex");
            }
            if (vistaObservatorioFull) {
                vistaObservatorioFull.classList.add("hidden");
                vistaObservatorioFull.classList.remove("flex");
            }
            cambiarPestanaSidebar("explorar");
            abrirPanelMobile(false);
        });
    }

    if (btnBitacora) {
        btnBitacora.addEventListener("click", () => {
            if (panel) {
                panel.classList.add("translate-y-[120%]");
                panel.classList.remove("translate-y-0", "translate-y-full");
                panel.classList.remove("max-md:h-[78dvh]");
                panel.classList.add("max-md:h-[34dvh]");
            }
            cambiarPestanaSidebar("pasaporte");
            actualizarEstadoMobileNav("bitacora");
        });
    }

    if (btnObservatorio) {
        btnObservatorio.addEventListener("click", () => {
            if (panel) {
                panel.classList.add("translate-y-[120%]");
                panel.classList.remove("translate-y-0", "translate-y-full");
                panel.classList.remove("max-md:h-[78dvh]");
                panel.classList.add("max-md:h-[34dvh]");
            }
            cambiarPestanaSidebar("observatorio");
            actualizarEstadoMobileNav("observatorio");
        });
    }

    const btnMuseo = document.getElementById("nav-mobile-museo");
    if (btnMuseo) {
        btnMuseo.addEventListener("click", () => {
            if (panel) {
                panel.classList.add("translate-y-[120%]");
                panel.classList.remove("translate-y-0", "translate-y-full");
            }
            if (typeof window.abrirMuseoAustral === "function") {
                window.abrirMuseoAustral(0);
            }
            actualizarEstadoMobileNav("museo");
        });
    }
}

// 12. Actualizar visualmente el dropdown de territorios
function actualizarDropdownTerritorioUI(vista, textoOpcion) {
    const lbl = document.getElementById("lbl-territorio-activo");
    if (lbl) {
        if (textoOpcion) {
            lbl.innerText = textoOpcion;
        } else if (vista === "todos" || vista === "provincia") {
            lbl.innerText = (idiomaActual === "en") ? "📍 Entire Province" : "📍 Toda la Provincia";
        } else {
            const btnOpcion = document.querySelector(`.opcion-territorio[data-territorio="${vista}"]`);
            if (btnOpcion) lbl.innerText = btnOpcion.textContent.trim();
        }
    }

    const opciones = document.querySelectorAll(".opcion-territorio");
    opciones.forEach(opt => {
        const t = opt.getAttribute("data-territorio");
        const activo = (t === vista) || (t === "todos" && (vista === "todos" || vista === "provincia"));
        if (activo) {
            opt.className = "opcion-territorio w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-orange-700 font-bold text-orange-600 flex items-center gap-2 cursor-pointer transition";
        } else {
            opt.className = "opcion-territorio w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-orange-700 font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition";
        }
    });
}

// 12. Selector rápido de localidades y visión provincial (Dropdown HTML personalizado)
function configurarSelectorLocalidades() {
    const btnDropdown = document.getElementById("btn-dropdown-territorio");
    const menuDropdown = document.getElementById("menu-dropdown-territorio");

    if (btnDropdown && menuDropdown) {
        btnDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            const abierto = !menuDropdown.classList.contains("hidden");
            if (abierto) {
                menuDropdown.classList.add("hidden");
                btnDropdown.setAttribute("aria-expanded", "false");
            } else {
                menuDropdown.classList.remove("hidden");
                btnDropdown.setAttribute("aria-expanded", "true");
            }
        });

        const opciones = menuDropdown.querySelectorAll(".opcion-territorio");
        opciones.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const vista = btn.getAttribute("data-territorio") || "todos";
                const texto = btn.textContent.trim();
                territorioActivo = vista;

                actualizarDropdownTerritorioUI(vista, texto);
                menuDropdown.classList.add("hidden");
                btnDropdown.setAttribute("aria-expanded", "false");

                const configVista = VISTAS_TERRITORIO[vista] || VISTAS_TERRITORIO["todos"];
                if (configVista && mapa) {
                    mapa.flyTo(configVista.centro, configVista.zoom, {
                        animate: true,
                        duration: 1.2
                    });
                }

                renderizarMarcadores(true);
                actualizarTrazadoRuta();

                // Sincronizar clima en tiempo real del territorio seleccionado
                if (typeof window.actualizarClimaTerritorio === "function") {
                    window.actualizarClimaTerritorio(vista);
                }

                anunciarAccesibilidad(
                    idiomaActual === "en"
                        ? `Map view updated: ${texto}`
                        : `Vista de mapa actualizada: ${texto}`
                );
            });
        });

        // Cerrar el menú flotante al hacer clic en cualquier otra parte de la pantalla o del mapa
        document.addEventListener("click", (e) => {
            if (!menuDropdown.contains(e.target) && !btnDropdown.contains(e.target)) {
                menuDropdown.classList.add("hidden");
                btnDropdown.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Compatibilidad adicional con botones .btn-vista (si existen)
    const botones = document.querySelectorAll(".btn-vista");
    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            const vista = btn.getAttribute("data-vista");
            territorioActivo = vista === "rio_grande" ? "rio-grande" : (vista || "todos");
            actualizarDropdownTerritorioUI(territorioActivo);

            const configVista = VISTAS_TERRITORIO[vista] || VISTAS_TERRITORIO["todos"];
            if (configVista && mapa) {
                mapa.flyTo(configVista.centro, configVista.zoom, {
                    animate: true,
                    duration: 1.2
                });
            }

            renderizarMarcadores(true);
            actualizarTrazadoRuta();

            if (typeof window.actualizarClimaTerritorio === "function") {
                window.actualizarClimaTerritorio(territorioActivo);
            }

            botones.forEach(b => {
                b.className = "btn-vista flex-1 flex items-center justify-center py-1.5 px-1 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer";
            });

            btn.className = "btn-vista flex-1 flex items-center justify-center gap-1 bg-orange-500 text-white py-1.5 px-1 font-bold active cursor-pointer";
        });
    });
}

// 12.1. Selector de Capas Base Cartográficas (Argenmap IGN / Relieve IGN / Satelital)
function configurarSelectorCapasBase() {
    const btnEstandar = document.getElementById("btn-capa-estandar");
    const btnRelieve = document.getElementById("btn-capa-relieve");
    const btnSatelital = document.getElementById("btn-capa-satelital");

    if (!btnEstandar || !btnRelieve) return;

    const actualizarClasesBotonesBase = (activa) => {
        const claseActivo = "btn-capa-base shrink-0 whitespace-nowrap flex items-center justify-center bg-orange-500 text-white shadow-sm rounded-xl text-[11px] sm:text-xs font-bold py-1.5 px-2.5 sm:px-3 transition-all cursor-pointer active";
        const claseInactivo = "btn-capa-base shrink-0 whitespace-nowrap flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl text-[11px] sm:text-xs font-bold py-1.5 px-2.5 sm:px-3 transition-all cursor-pointer";

        if (btnEstandar) btnEstandar.className = activa === "estandar" ? claseActivo : claseInactivo;
        if (btnRelieve) btnRelieve.className = activa === "relieve" ? claseActivo : claseInactivo;
        if (btnSatelital) btnSatelital.className = activa === "satelital" ? claseActivo : claseInactivo;
    };

    const cambiarCapaBase = (tipo) => {
        if (capaBaseActiva === tipo) return;

        // Remover las capas base que no correspondan
        if (tipo !== "estandar" && mapa.hasLayer(capaBaseEstandar)) mapa.removeLayer(capaBaseEstandar);
        if (tipo !== "relieve" && mapa.hasLayer(capaBaseRelieve)) mapa.removeLayer(capaBaseRelieve);
        if (tipo !== "satelital" && capaBaseSatelital && mapa.hasLayer(capaBaseSatelital)) mapa.removeLayer(capaBaseSatelital);

        // Activar la seleccionada
        if (tipo === "estandar") {
            if (!mapa.hasLayer(capaBaseEstandar)) mapa.addLayer(capaBaseEstandar);
            capaBaseEstandar.bringToBack();
        } else if (tipo === "relieve") {
            if (!mapa.hasLayer(capaBaseRelieve)) mapa.addLayer(capaBaseRelieve);
            capaBaseRelieve.bringToBack();
        } else if (tipo === "satelital") {
            if (capaBaseSatelital && !mapa.hasLayer(capaBaseSatelital)) mapa.addLayer(capaBaseSatelital);
            if (capaBaseSatelital) capaBaseSatelital.bringToBack();
        }

        // Mantener rótulos soberanos y toponimia originaria siempre al frente
        if (capaToponimiaYSoberania && typeof capaToponimiaYSoberania.bringToFront === "function") {
            capaToponimiaYSoberania.bringToFront();
        }

        capaBaseActiva = tipo;
        actualizarClasesBotonesBase(tipo);
    };

    btnEstandar.addEventListener("click", () => cambiarCapaBase("estandar"));
    btnRelieve.addEventListener("click", () => cambiarCapaBase("relieve"));
    if (btnSatelital) {
        btnSatelital.addEventListener("click", () => cambiarCapaBase("satelital"));
    }
}

// 12.2. Capa Vectorial de Áreas Naturales Protegidas (GeoJSON)
let capaAreasProtegidas = null;
let areasProtegidasVisibles = false;

async function configurarCapaAreasProtegidas() {
    const btn = document.getElementById("btn-capa-areas-protegidas");
    if (!btn) return;

    try {
        let geojsonData = null;
        try {
            const respuesta = await fetch("./data/areas_protegidas.geojson");
            if (respuesta.ok) {
                geojsonData = await respuesta.json();
                if (typeof guardarPaqueteOffline === "function") {
                    guardarPaqueteOffline(null, geojsonData);
                }
            }
        } catch (errRed) {
            geojsonData = typeof obtenerAreasOffline === "function" ? obtenerAreasOffline() : null;
        }
        if (!geojsonData) {
            geojsonData = typeof obtenerAreasOffline === "function" ? obtenerAreasOffline() : null;
        }
        if (!geojsonData) return;

        capaAreasProtegidas = L.geoJSON(geojsonData, {
            style: (feature) => {
                const color = feature.properties.color || "#10b981";
                return {
                    color: color,
                    weight: 2,
                    opacity: 0.9,
                    dashArray: "5, 5",
                    fillColor: color,
                    fillOpacity: 0.18
                };
            },
            onEachFeature: (feature, layer) => {
                const props = feature.properties;
                const nombre = (idiomaActual === "en" && props.nombre_en) ? props.nombre_en : props.nombre;
                const categoria = (idiomaActual === "en" && props.categoria_anp_en) ? props.categoria_anp_en : props.categoria_anp;
                const desc = (idiomaActual === "en" && props.descripcion_en) ? props.descripcion_en : props.descripcion;
                const color = props.color || "#10b981";

                layer.on({
                    mouseover: (e) => {
                        const target = e.target;
                        target.setStyle({
                            weight: 3.5,
                            fillOpacity: 0.38,
                            dashArray: ""
                        });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            target.bringToFront();
                        }
                    },
                    mouseout: (e) => {
                        capaAreasProtegidas.resetStyle(e.target);
                    }
                });

                // Tooltip al pasar el cursor
                layer.bindTooltip(`
                    <div class="text-xs font-semibold flex items-center gap-1.5">
                        <span style="color: ${color};">🛡️</span>
                        <span>${nombre}</span>
                    </div>
                `, { sticky: true, className: 'tooltip-hito' });

                // Popup interactivo con datos institucionales (alto contraste sobre fondo claro)
                const popupContent = `
                    <div class="p-3 max-w-xs space-y-2 text-xs leading-relaxed text-slate-900">
                        <div class="flex items-center gap-1.5 border-b pb-1.5 border-slate-200">
                            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                  style="color: #065f46; background-color: ${color}20; border: 1px solid ${color}60;">
                                ${categoria}
                            </span>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-900 leading-tight">${nombre}</h4>
                            <p class="popup-toponimia font-mono mt-0.5">Toponimia: ${props.toponimia}</p>
                        </div>
                        <p class="text-slate-700 text-[11px]">${desc}</p>
                        <div class="popup-subtexto pt-1.5 border-t border-slate-200 space-y-0.5">
                            <div><strong class="text-slate-800">Marco Legal:</strong> ${props.marco_legal}</div>
                            <div><strong class="text-slate-800">Superficie:</strong> ${props.superficie_ha.toLocaleString()} ha</div>
                            <div><strong class="text-slate-800">Ecosistemas:</strong> ${props.ecosistemas}</div>
                        </div>
                    </div>
                `;
                layer.bindPopup(popupContent, { className: 'popup-hito' });
            }
        });

        // Toggle al hacer clic en el botón
        btn.addEventListener("click", () => {
            if (!capaAreasProtegidas) return;

            areasProtegidasVisibles = !areasProtegidasVisibles;

            if (areasProtegidasVisibles) {
                mapa.addLayer(capaAreasProtegidas);
                capaAreasProtegidas.bringToBack();
                if (mapa.hasLayer(capaBaseEstandar)) capaBaseEstandar.bringToBack();
                if (mapa.hasLayer(capaBaseRelieve)) capaBaseRelieve.bringToBack();
                if (capaBaseSatelital && mapa.hasLayer(capaBaseSatelital)) capaBaseSatelital.bringToBack();

                btn.className = "btn-capa-areas active shrink-0 whitespace-nowrap flex items-center justify-center bg-emerald-600 text-white shadow-sm rounded-xl text-[11px] sm:text-xs font-bold py-1.5 px-2.5 sm:px-3 transition-all cursor-pointer";
            } else {
                mapa.removeLayer(capaAreasProtegidas);
                btn.className = "btn-capa-areas shrink-0 whitespace-nowrap flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl text-[11px] sm:text-xs font-bold py-1.5 px-2.5 sm:px-3 transition-all cursor-pointer";
            }
        });
    } catch (error) {
        console.error("Error al cargar áreas protegidas:", error);
    }
}

// 12.3. Capa Vectorial de Alertas SAR y Estrés Hídrico en Turbales (Pilar de Acción)
let capaAlertasSAR = null;
let alertasSARVisibles = true;
let datosAlertasSAR = null;

async function configurarCapaAlertasSAR() {
    const btn = document.getElementById("btn-capa-alertas-sar");

    try {
        let geojsonData = null;
        try {
            const respuesta = await fetch("./data/alertas_turbales.geojson");
            if (respuesta.ok) {
                geojsonData = await respuesta.json();
                datosAlertasSAR = geojsonData;
                if (typeof guardarAlertasOffline === "function") {
                    guardarAlertasOffline(geojsonData);
                }
            }
        } catch (errRed) {
            geojsonData = typeof obtenerAlertasOffline === "function" ? obtenerAlertasOffline() : null;
        }
        if (!geojsonData) {
            geojsonData = typeof obtenerAlertasOffline === "function" ? obtenerAlertasOffline() : null;
        }
        if (!geojsonData) return;
        datosAlertasSAR = geojsonData;

        capaAlertasSAR = L.geoJSON(geojsonData, {
            style: (feature) => {
                const esCritico = feature.properties && feature.properties.estado === "CRITICO";
                if (esCritico) {
                    return {
                        color: "#ef4444",
                        weight: 3,
                        opacity: 0.95,
                        dashArray: "6, 6",
                        fillColor: "#ef4444",
                        fillOpacity: 0.35,
                        className: "poligono-alerta-critica"
                    };
                }
                return {
                    color: "#10b981",
                    weight: 2,
                    opacity: 0.85,
                    dashArray: "4, 4",
                    fillColor: "#10b981",
                    fillOpacity: 0.16
                };
            },
            onEachFeature: (feature, layer) => {
                const props = feature.properties || {};
                const esCritico = props.estado === "CRITICO";
                const nombre = (idiomaActual === "en" && props.nombre_en) ? props.nombre_en : (props.nombre || "Turbal");
                const motivo = (idiomaActual === "en" && props.motivo_en) ? props.motivo_en : (props.motivo || "");

                layer.on({
                    mouseover: (e) => {
                        const target = e.target;
                        target.setStyle({
                            weight: 4,
                            fillOpacity: esCritico ? 0.5 : 0.3
                        });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            target.bringToFront();
                        }
                    },
                    mouseout: (e) => {
                        capaAlertasSAR.resetStyle(e.target);
                    },
                    click: (e) => {
                        L.DomEvent.stopPropagation(e);
                        if (esCritico) {
                            mostrarModalBloqueo(props);
                        } else {
                            layer.openPopup();
                        }
                    }
                });

                // Tooltip
                const iconoBadge = esCritico ? "🚫" : "🌿";
                const textoEstado = esCritico
                    ? (idiomaActual === "en" ? "RESTRICTED ACCESS · SAR CRITICAL" : "ACCESO RESTRINGIDO · CRÍTICO SAR")
                    : (idiomaActual === "en" ? "NORMAL MOISTURE" : "HUMEDAD ESTABLE");

                layer.bindTooltip(`
                    <div class="text-xs font-semibold flex items-center gap-1.5 ${esCritico ? 'text-rose-600 font-bold' : 'text-emerald-600 '}">
                        <span>${iconoBadge}</span>
                        <span>${nombre} (${textoEstado})</span>
                    </div>
                `, { sticky: true, className: "tooltip-hito" });

                // Popup informativo
                const popupContent = `
                    <div class="p-3 max-w-xs space-y-2 text-xs leading-relaxed text-slate-900">
                        <div class="flex items-center gap-1.5 border-b pb-1.5 border-slate-200">
                            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${esCritico ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
                                ${esCritico ? '⚠️ ZONA CRÍTICA SAR' : '✓ CONDICIÓN NOMINAL'}
                            </span>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-slate-900 leading-tight">${nombre}</h4>
                            <p class="text-slate-600 text-[11px] mt-1">${motivo}</p>
                        </div>
                        ${esCritico ? `
                            <button type="button" class="mt-2 w-full py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] shadow-sm transition" onclick="mostrarModalBloqueoPorNombre('${escape(props.nombre || nombre)}')">
                                Ver Protocolo de Bloqueo →
                            </button>
                        ` : ''}
                    </div>
                `;
                layer.bindPopup(popupContent, { className: "popup-hito" });
            }
        });

        // Capa activa por defecto en el mapa
        if (alertasSARVisibles && mapa) {
            mapa.addLayer(capaAlertasSAR);
        }

        // Toggle del botón
        if (btn) {
            btn.addEventListener("click", () => {
                if (!capaAlertasSAR) return;
                alertasSARVisibles = !alertasSARVisibles;

                if (alertasSARVisibles) {
                    mapa.addLayer(capaAlertasSAR);
                    btn.className = "btn-capa-alertas active bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] sm:text-xs py-1.5 px-2.5 sm:px-3.5 rounded-2xl shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer";
                } else {
                    mapa.removeLayer(capaAlertasSAR);
                    btn.className = "btn-capa-alertas bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 font-bold text-[11px] sm:text-xs py-1.5 px-2.5 sm:px-3.5 rounded-2xl shadow-md flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer";
                }
            });
        }
    } catch (error) {
        console.error("Error al cargar capa de alertas SAR:", error);
    }
}

// 13. Conmutador de idioma (ES / EN)
function configurarConmutadorIdioma() {
    const btnEs = document.getElementById("btn-lang-es");
    const btnEn = document.getElementById("btn-lang-en");
    const btnBienvenidaEs = document.getElementById("btn-bienvenida-lang-es");
    const btnBienvenidaEn = document.getElementById("btn-bienvenida-lang-en");

    if (btnEs) {
        btnEs.addEventListener("click", () => cambiarIdioma("es"));
    }
    if (btnEn) {
        btnEn.addEventListener("click", () => cambiarIdioma("en"));
    }
    if (btnBienvenidaEs) {
        btnBienvenidaEs.addEventListener("click", () => cambiarIdioma("es"));
    }
    if (btnBienvenidaEn) {
        btnBienvenidaEn.addEventListener("click", () => cambiarIdioma("en"));
    }
}

function cambiarIdioma(nuevoIdioma) {
    if (nuevoIdioma !== "es" && nuevoIdioma !== "en") return;
    idiomaActual = nuevoIdioma;
    window.idiomaActual = nuevoIdioma;
    document.documentElement.lang = nuevoIdioma;
    try {
        localStorage.setItem("rastro_austral_idioma", idiomaActual);
    } catch (e) {
        console.error("Error al guardar idioma local:", e);
    }

    actualizarTextosUI();
    renderizarInsignias();
    renderizarSellosSidebar();
    actualizarBadgeSellos();
    renderizarMarcadores();

    const modal = document.getElementById("modal-pasaporte") || document.getElementById("modal-libreta");
    if (modal && !modal.classList.contains("hidden")) {
        renderizarModalPasaporte();
    }

    if (hitoSeleccionadoId) {
        const hito = listaHitos.find(h => h.id === hitoSeleccionadoId);
        if (hito) mostrarDetalleHito(hito);
    }

    if (typeof actualizarBannerModoOffline === "function") {
        actualizarBannerModoOffline();
    }

    const vistaObservatorio = document.getElementById("vista-observatorio-full") || document.getElementById("vista-tab-observatorio");
    if (vistaObservatorio && !vistaObservatorio.classList.contains("hidden") && typeof renderizarGraficosObservatorio === "function") {
        renderizarGraficosObservatorio();
    }

    if (typeof window.actualizarBotonesIdiomaMuseo === "function") {
        window.actualizarBotonesIdiomaMuseo();
    }

    if (typeof window.actualizarClimaTerritorio === "function") {
        window.actualizarClimaTerritorio();
    }

    anunciarAccesibilidad(nuevoIdioma === "en" ? "Language switched to English." : "Idioma cambiado a español.");
}
window.cambiarIdioma = cambiarIdioma;

function actualizarTextosUI() {
    document.title = "Rastro Austral";
    const t = DICCIONARIO[idiomaActual];
    if (!t) return;

    // Actualizar elementos con data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const clave = el.getAttribute("data-i18n");
        const texto = t[clave];
        if (!texto) return;

        // Mantener estilo de marca y jerarquía tipográfica en el título de bienvenida
        if (clave === "bienvenida_titulo") {
            const prefijo = idiomaActual === "en" ? "Welcome to" : "Bienvenido a";
            el.innerHTML = `
              <span class="text-base sm:text-lg md:text-xl font-medium text-neutral-300 tracking-wide">${prefijo}</span>
              <span class="text-3xl sm:text-4xl md:text-5xl font-black text-orange-500 tracking-tight mt-0.5 drop-shadow-[0_2px_12px_rgba(249,115,22,0.25)]">Rastro Austral</span>
            `;
        } else if (clave.startsWith("principio_") && texto.includes(":")) {
            const sepIdx = texto.indexOf(":");
            const strongEl = document.createElement("strong");
            strongEl.className = "text-slate-900";
            strongEl.textContent = texto.slice(0, sepIdx + 1);
            el.replaceChildren(strongEl, document.createTextNode(texto.slice(sepIdx + 1)));
        } else {
            el.innerText = texto;
        }
    });

    // Actualizar placeholder del buscador
    const buscador = document.getElementById("buscador-hitos");
    if (buscador) {
        buscador.placeholder = t.buscar_placeholder;
    }

    // Actualizar placeholder del input de nombre de explorador y saludo del pingüino
    const inputNombre = document.getElementById("input-nombre-explorador");
    if (inputNombre) {
        if (t.placeholderNombre || t.placeholder_nombre_explorador) {
            inputNombre.placeholder = t.placeholderNombre || t.placeholder_nombre_explorador;
        }
        actualizarBurbujaSaludoPinguino(inputNombre.value);
    }

    // Actualizar select de fragilidad si existe
    const selFragilidad = document.getElementById("filtro-fragilidad");
    if (selFragilidad) {
        Array.from(selFragilidad.options).forEach(opt => {
            const clave = opt.getAttribute("data-i18n");
            if (clave && t[clave]) opt.text = t[clave];
        });
    }

    // Actualizar select de estado de visita si existe
    const selEstado = document.getElementById("filtro-estado-visita");
    if (selEstado && selEstado.tagName === "SELECT") {
        Array.from(selEstado.options).forEach(opt => {
            const clave = opt.getAttribute("data-i18n");
            if (clave && t[clave]) opt.text = t[clave];
        });
    }

    // Actualizar botones de conmutador de idioma
    const btnEs = document.getElementById("btn-lang-es");
    const btnEn = document.getElementById("btn-lang-en");
    if (btnEs && btnEn) {
        if (idiomaActual === "es") {
            btnEs.className = "px-2.5 py-1 rounded-md transition bg-amber-600 text-white font-bold";
            btnEn.className = "px-2.5 py-1 rounded-md transition text-slate-400 hover:text-white";
        } else {
            btnEs.className = "px-2.5 py-1 rounded-md transition text-slate-400 hover:text-white";
            btnEn.className = "px-2.5 py-1 rounded-md transition bg-amber-600 text-white font-bold";
        }
    }

    // Actualizar botones de conmutador de idioma en pantalla de bienvenida
    const btnBienvenidaEs = document.getElementById("btn-bienvenida-lang-es");
    const btnBienvenidaEn = document.getElementById("btn-bienvenida-lang-en");
    if (btnBienvenidaEs && btnBienvenidaEn) {
        if (idiomaActual === "es") {
            btnBienvenidaEs.className = "px-2 py-0.5 rounded-lg font-bold transition bg-amber-600 text-white";
            btnBienvenidaEn.className = "px-2 py-0.5 rounded-lg text-neutral-400 hover:text-white transition";
        } else {
            btnBienvenidaEs.className = "px-2 py-0.5 rounded-lg text-neutral-400 hover:text-white transition";
            btnBienvenidaEn.className = "px-2 py-0.5 rounded-lg font-bold transition bg-amber-600 text-white";
        }
    }

    const btnGeoloc = document.getElementById("btn-geolocalizacion");
    if (btnGeoloc && t.geoloc_titulo) btnGeoloc.setAttribute("title", t.geoloc_titulo);

    actualizarHuellaConsciente();
    actualizarMetricasDistancia();
    if (typeof actualizarBadgesObservatorio === "function") {
        actualizarBadgesObservatorio();
    }
}

// 14. Botón exportar bitácora en PDF editorial de Pasaporte Austral
function configurarBotonExportar() {
    const btn = document.getElementById("btn-exportar");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        const label = btn.querySelector("[data-i18n='descargar_bitacora']");
        const textoOriginal = label ? label.innerText : "";
        btn.disabled = true;
        btn.classList.add("opacity-75", "cursor-wait");
        if (label) {
            label.innerText = idiomaActual === "en" ? "Generating PDF..." : "Generando PDF...";
        }

        try {
            await exportarBitacoraPDF(listaHitos, idiomaActual);
        } catch (err) {
            console.error("Error al generar PDF de bitácora, usando respaldo TXT:", err);
            exportarBitacoraTexto(listaHitos, idiomaActual);
        } finally {
            btn.disabled = false;
            btn.classList.remove("opacity-75", "cursor-wait");
            if (label && textoOriginal) {
                const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
                label.innerText = t.descargar_bitacora || textoOriginal;
            }
        }
    });
}

// 15. Medidor de Huella Consciente y Preservación
function actualizarHuellaConsciente() {
    const visitas = obtenerVisitas();
    const total = listaHitos.length || 1;
    const elHuella = document.getElementById("valor-huella");
    const elMencion = document.getElementById("mencion-guardian");
    const elTextoMencion = document.getElementById("texto-mencion-guardian");
    const t = DICCIONARIO[idiomaActual];

    if (elHuella) {
        elHuella.innerText = idiomaActual === 'en'
            ? `${visitas.length} / ${total} Conservation Points`
            : `${visitas.length} / ${total} Puntos de Preservación`;
    }

    // Mención honorífica ("Guardián Austral") al registrar visitas en sitios de fragilidad Alta/Muy Alta
    const sitiosFragilesVisitados = visitas.filter(id => {
        const h = listaHitos.find(item => item.id === id);
        return h && (h.fragilidad === "Alta" || h.fragilidad === "Muy Alta");
    });

    const esGuardian = sitiosFragilesVisitados.length >= 2;

    if (elMencion) {
        if (esGuardian) {
            elMencion.classList.remove("hidden");
            if (elTextoMencion) {
                elTextoMencion.innerText = t.guardian_austral;
            }
        } else {
            elMencion.classList.add("hidden");
        }
    }

    // Actualizar estado en el Modal de Huella Consciente si los elementos existen
    const badgeGuardian = document.getElementById("badge-rango-guardian") || document.getElementById("badge-estado-guardian");
    const descGuardian = document.getElementById("desc-estado-guardian");
    if (badgeGuardian && descGuardian) {
        if (esGuardian) {
            badgeGuardian.innerText = t.guardian_desbloqueado || "Logrado";
            badgeGuardian.className = "badge-status-logrado";
            descGuardian.innerText = t.guardian_desc_activo;
        } else {
            badgeGuardian.innerText = t.guardian_bloqueado || "Pendiente";
            badgeGuardian.className = "badge-status-pendiente";
            descGuardian.innerText = t.guardian_desc_pendiente;
        }
    }
}

// 15.1. Filtro por Estado de Visita (Todos / Visitados / Por explorar)
function configurarFiltroEstadoVisita() {
    const el = document.getElementById("filtro-estado-visita");
    if (!el) return;

    if (el.tagName === "SELECT") {
        el.addEventListener("change", (e) => {
            filtroEstadoVisita = e.target.value;
            renderizarMarcadores(true);
            actualizarTrazadoRuta();

            if (typeof window.actualizarClimaTerritorio === "function") {
                window.actualizarClimaTerritorio(territorioActivo);
            }
        });
    } else {
        const botones = el.querySelectorAll(".btn-filtro-estado");
        botones.forEach(btn => {
            btn.addEventListener("click", () => {
                botones.forEach(b => {
                    b.classList.remove("active", "bg-amber-500", "text-slate-950", "font-bold", "shadow-sm");
                    b.classList.add("text-slate-400", "font-medium");
                });

                btn.classList.add("active", "bg-amber-500", "text-slate-950", "font-bold", "shadow-sm");
                btn.classList.remove("text-slate-400", "font-medium");

                filtroEstadoVisita = btn.getAttribute("data-estado") || "todos";
                renderizarMarcadores();
                actualizarTrazadoRuta();
            });
        });
    }
}

// 16. Filtro por Fragilidad del Ecosistema
function configurarFiltroFragilidad() {
    const select = document.getElementById("filtro-fragilidad");
    if (!select) return;

    actualizarIndicadorFragilidad();

    select.addEventListener("change", (e) => {
        filtroFragilidad = e.target.value;
        actualizarIndicadorFragilidad();
        renderizarMarcadores(true);
        actualizarTrazadoRuta();
    });
}

// 16.1. Navegación por Vistas de Pantalla Completa ("Hitos", "Bitácora" y "Observatorio")
function configurarPestanasSidebar() {
    const btnExplorar = document.getElementById("tab-btn-explorar");
    const btnPasaporte = document.getElementById("tab-btn-pasaporte");
    const btnObservatorio = document.getElementById("tab-btn-observatorio");
    const btnSidePasaporte = document.getElementById("btn-imprimir-pasaporte-side");
    const iconoHojaFiltro = document.getElementById("icono-hoja-filtro");

    if (iconoHojaFiltro && typeof obtenerIconoFragilidadHoja === "function") {
        iconoHojaFiltro.innerHTML = obtenerIconoFragilidadHoja("w-4 h-4");
    }

    if (btnExplorar) {
        btnExplorar.addEventListener("click", () => {
            cambiarPestanaSidebar("explorar");
            if (window.innerWidth < 768) {
                abrirPanelMobile();
            }
        });
    }
    if (btnPasaporte) {
        btnPasaporte.addEventListener("click", () => {
            const vistaBitacoraFull = document.getElementById("vista-bitacora-full");
            if (vistaBitacoraFull && !vistaBitacoraFull.classList.contains("hidden")) {
                cerrarTodasLasVistas();
            } else {
                cambiarPestanaSidebar("pasaporte");
            }
        });
    }
    if (btnObservatorio) {
        btnObservatorio.addEventListener("click", () => {
            const vistaObservatorioFull = document.getElementById("vista-observatorio-full");
            if (vistaObservatorioFull && !vistaObservatorioFull.classList.contains("hidden")) {
                cerrarTodasLasVistas();
            } else {
                cambiarPestanaSidebar("observatorio");
            }
        });
    }

    // Botones para cerrar vistas de pantalla completa ("✕ Volver al Mapa")
    document.querySelectorAll(".btn-cerrar-vista").forEach(btn => {
        btn.addEventListener("click", () => {
            cerrarTodasLasVistas();
        });
    });

    // Botón específico para cerrar el modal de detalle
    const btnCerrarDetalle = document.getElementById("btn-cerrar-detalle");
    if (btnCerrarDetalle) {
        btnCerrarDetalle.addEventListener("click", () => {
            cerrarDetalleHitoCompleto();
        });
    }

    // Tecla Escape para cerrar vistas de pantalla completa
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const modalPasaporte = document.getElementById("modal-pasaporte") || document.getElementById("modal-libreta");
            if (modalPasaporte && !modalPasaporte.classList.contains("hidden")) {
                modalPasaporte.classList.add("hidden");
                modalPasaporte.classList.remove("flex");
                return;
            }
            cerrarTodasLasVistas();
        }
    });

    const abrirLibretaModal = () => {
        const modal = document.getElementById("modal-pasaporte") || document.getElementById("modal-libreta");
        if (modal) {
            renderizarModalPasaporte();
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }
    };

    if (btnSidePasaporte) {
        btnSidePasaporte.addEventListener("click", abrirLibretaModal);
    }
    document.querySelectorAll(".btn-ver-libreta").forEach(btn => {
        btn.addEventListener("click", abrirLibretaModal);
    });

    configurarObservatorio();
    actualizarBadgeSellos();
    renderizarSellosSidebar();
}

function cambiarPestanaSidebar(pestana) {
    const btnExplorar = document.getElementById("tab-btn-explorar");
    const btnPasaporte = document.getElementById("tab-btn-pasaporte");
    const btnObservatorio = document.getElementById("tab-btn-observatorio");
    const badgeSellos = document.getElementById("tab-badge-sellos");
    const vistaBitacoraFull = document.getElementById("vista-bitacora-full");
    const vistaObservatorioFull = document.getElementById("vista-observatorio-full");
    const vistaDetalleFull = document.getElementById("modal-detalle-hito") || document.getElementById("vista-detalle-hito-full");

    const claseActiva = "tab-btn tab-sidebar-btn tab-activa flex items-center justify-center gap-1 py-2 px-1.5 text-[11px] font-bold rounded-lg transition-all bg-orange-600 text-white shadow-sm cursor-pointer";
    const claseInactiva = "tab-btn tab-sidebar-btn flex items-center justify-center gap-1 py-2 px-1.5 text-[11px] font-semibold rounded-lg transition-all text-slate-600  hover:text-slate-900  cursor-pointer";

    // Gestionar Overlays a Pantalla Completa
    if (pestana === "explorar") {
        if (vistaBitacoraFull) {
            vistaBitacoraFull.classList.add("hidden");
            vistaBitacoraFull.classList.remove("flex");
        }
        if (vistaObservatorioFull) {
            vistaObservatorioFull.classList.add("hidden");
            vistaObservatorioFull.classList.remove("flex");
        }
        if (vistaDetalleFull) {
            vistaDetalleFull.classList.add("hidden");
            vistaDetalleFull.classList.remove("flex");
        }
    } else if (pestana === "pasaporte") {
        if (vistaObservatorioFull) {
            vistaObservatorioFull.classList.add("hidden");
            vistaObservatorioFull.classList.remove("flex");
        }
        if (vistaDetalleFull) {
            vistaDetalleFull.classList.add("hidden");
            vistaDetalleFull.classList.remove("flex");
        }
        if (vistaBitacoraFull) {
            vistaBitacoraFull.classList.remove("hidden");
            vistaBitacoraFull.classList.add("flex");
        }
    } else if (pestana === "observatorio") {
        if (vistaBitacoraFull) {
            vistaBitacoraFull.classList.add("hidden");
            vistaBitacoraFull.classList.remove("flex");
        }
        if (vistaDetalleFull) {
            vistaDetalleFull.classList.add("hidden");
            vistaDetalleFull.classList.remove("flex");
        }
        if (vistaObservatorioFull) {
            vistaObservatorioFull.classList.remove("hidden");
            vistaObservatorioFull.classList.add("flex");
        }
    }

    const pestanas = [
        { id: "explorar", btn: btnExplorar },
        { id: "pasaporte", btn: btnPasaporte },
        { id: "observatorio", btn: btnObservatorio }
    ];
    pestanas.forEach(({ id, btn }) => {
        if (!btn) return;
        const activa = id === pestana;
        btn.className = activa ? claseActiva : claseInactiva;
        btn.setAttribute("aria-selected", activa ? "true" : "false");
    });

    if (badgeSellos) {
        badgeSellos.className = pestana === "pasaporte"
            ? "px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-white/20 text-white leading-none"
            : "px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-700  leading-none";
    }

    if (pestana === "pasaporte") {
        renderizarSellosSidebar();
    } else if (pestana === "observatorio") {
        requestAnimationFrame(() => {
            renderizarGraficosObservatorio();
        });
    }
}

function cerrarTodasLasVistas() {
    const vistaBitacoraFull = document.getElementById("vista-bitacora-full");
    const vistaObservatorioFull = document.getElementById("vista-observatorio-full");
    const vistaDetalleFull = document.getElementById("modal-detalle-hito") || document.getElementById("vista-detalle-hito-full");
    const vistaMuseo = document.getElementById("vista-museo-austral");

    if (vistaBitacoraFull) {
        vistaBitacoraFull.classList.add("hidden");
        vistaBitacoraFull.classList.remove("flex");
    }
    if (vistaObservatorioFull) {
        vistaObservatorioFull.classList.add("hidden");
        vistaObservatorioFull.classList.remove("flex");
    }
    if (vistaDetalleFull) {
        vistaDetalleFull.classList.add("hidden");
        vistaDetalleFull.classList.remove("flex");
    }
    if (vistaMuseo && !vistaMuseo.classList.contains("hidden")) {
        if (typeof window.cerrarMuseoAustral === "function") {
            window.cerrarMuseoAustral();
        } else {
            vistaMuseo.classList.add("hidden");
            vistaMuseo.classList.remove("flex");
        }
    }

    // Regresar a la vista de Hitos en #panel-lateral
    cambiarPestanaSidebar("explorar");

    if (window.innerWidth < 768) {
        actualizarEstadoMobileNav("mapa");
        if (mapa) setTimeout(() => mapa.invalidateSize(), 200);
    }
}
window.cerrarTodasLasVistas = cerrarTodasLasVistas;

let datosObservatorio = null;

async function cargarDatosObservatorio() {
    try {
        const resp = await fetch("./data/observatorio_real.json");
        if (!resp.ok) throw new Error("No se pudo cargar data/observatorio_real.json");
        datosObservatorio = await resp.json();
        if (typeof guardarObservatorioOffline === "function") {
            guardarObservatorioOffline(datosObservatorio);
        }
    } catch (err) {
        console.warn("Cargando datos del observatorio desde respaldo local offline:", err);
        const respaldo = typeof obtenerObservatorioOffline === "function" ? obtenerObservatorioOffline() : null;
        if (respaldo) {
            datosObservatorio = respaldo;
        }
    }

    actualizarBadgesObservatorio();
    const vistaObs = document.getElementById("vista-observatorio-full") || document.getElementById("vista-tab-observatorio");
    if (vistaObs && !vistaObs.classList.contains("hidden")) {
        renderizarGraficosObservatorio();
    }
}

function obtenerDatosObservatorioActivos() {
    if (datosObservatorio && datosObservatorio.turbales && datosObservatorio.glaciar) {
        return datosObservatorio;
    }
    return {
        metadata: {
            fuente_glaciar: "CADIC-CONICET / IDETDF (tendencias regionales)",
            fuente_clima: "CADIC-CONICET / IDETDF (series ambientales)",
            modelo_predictivo: "Extrapolación lineal simple (2015–2024 → 2030)",
            fecha_generacion: "Noviembre 2026"
        },
        labels: ["2015", "2018", "2021", "2024", "2027 (Futuro)", "2030 (Futuro)"],
        turbales: {
            dias_estres: [5, 6, 7, 8, 9, 10],
            descripcion: "Días anuales sin humedad efectiva (P < 1mm & T > 10.5°C)",
            variacion_pct: "+100%",
            tipo_dato: "Datos ilustrativos · prototipo",
            fuente_referencia: "Contexto regional: CADIC-CONICET e IDETDF. Los valores numéricos son un escenario ilustrativo para este prototipo y no constituyen mediciones oficiales.",
            metodo_proyeccion: "Extrapolación lineal a partir de la serie 2015–2024",
            ultima_actualizacion: "17/11/2026"
        },
        glaciar: {
            masa_remanente_pct: [100.0, 96.8, 93.6, 90.4, 87.2, 84.0],
            descripcion: "Superficie de hielo remanente en porcentaje (Base 100% en 2015)",
            variacion_pct: "-16%",
            tipo_dato: "Datos ilustrativos · prototipo",
            fuente_referencia: "Contexto regional: IANIGLA (Inventario Nacional de Glaciares). Los valores numéricos son un escenario ilustrativo para este prototipo y no constituyen mediciones oficiales.",
            metodo_proyeccion: "Extrapolación lineal a partir de la serie 2015–2024",
            ultima_actualizacion: "17/11/2026"
        }
    };
}

function actualizarBadgesObservatorio() {
    const data = obtenerDatosObservatorioActivos();
    const esIngles = idiomaActual === "en";

    const badgeTurbales = document.getElementById("badge-turbales-pct");
    if (badgeTurbales && data.turbales?.variacion_pct) {
        badgeTurbales.innerText = `${data.turbales.variacion_pct} ${esIngles ? "dry days" : "días secos"}`;
    }

    const badgeGlaciar = document.getElementById("badge-glaciar-pct");
    if (badgeGlaciar && data.glaciar?.variacion_pct) {
        badgeGlaciar.innerText = `${data.glaciar.variacion_pct} ${esIngles ? "by 2030" : "a 2030"}`;
    }
}

// Generador de gráficos de línea en SVG puro (100% offline, calidad editorial)
function crearGraficoLineasSVG(config) {
    const {
        id = "chart",
        labels,
        data,
        yMin,
        yMax,
        color,
        unidad = "",
        unidadEjeY = "",
        tituloY = "",
        indiceCorteHistorico = 3, // índice 3 = año 2024
        valoresY = null,
        esIngles = false
    } = config;

    const chartId = id || "chart";
    const W = 400;
    const H = 200;
    const padL = 56;
    const padR = 24;
    const padT = 32;
    const padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Offset X inicial para dar aire entre el eje Y y el primer punto (evita colisión con etiquetas del eje Y)
    const offsetInicioX = 14;

    const n = labels.length;
    const puntos = data.map((val, i) => {
        const x = padL + offsetInicioX + (i / (n - 1)) * (plotW - offsetInicioX);
        const ratio = (val - yMin) / (yMax - yMin);
        const y = padT + (1 - Math.max(0, Math.min(1, ratio))) * plotH;
        return {
            x: Number(x.toFixed(2)),
            y: Number(y.toFixed(2)),
            val,
            label: labels[i],
            isProj: i > indiceCorteHistorico
        };
    });

    // Líneas guía horizontales del eje Y
    // Para Glaciar (yMin=80, yMax=105): forzar valores exactos 80, 85, 90, 95, 100, 105
    // Si el valor es 105, dibujamos la línea guía pero omitimos el <text> para dejar aire visual
    let ticksY = valoresY;
    if (!ticksY) {
        if (yMin === 80 && yMax === 105) {
            ticksY = [80, 85, 90, 95, 100, 105];
        } else {
            const pasosY = 4;
            ticksY = [];
            for (let s = 0; s <= pasosY; s++) {
                ticksY.push(yMin + (s / pasosY) * (yMax - yMin));
            }
        }
    }

    let lineasGuiaY = "";
    ticksY.forEach(valTick => {
        const ratio = (valTick - yMin) / (yMax - yMin);
        const yTick = padT + (1 - Math.max(0, Math.min(1, ratio))) * plotH;
        const textoTick = Number.isInteger(valTick)
            ? valTick.toLocaleString("es-AR")
            : valTick.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        
        // Si el valor es 105, dibujamos la línea guía pero omitimos el texto para dejar aire visual
        const incluirTexto = valTick !== 105;
        const textoSVG = incluirTexto
            ? `<text x="${padL - 8}" y="${(yTick + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#4b5563" font-family="sans-serif" font-weight="500">${textoTick}${unidadEjeY}</text>`
            : "";

        lineasGuiaY += `
            <line x1="${padL}" y1="${yTick.toFixed(1)}" x2="${W - padR}" y2="${yTick.toFixed(1)}" stroke="#e5e7eb" stroke-width="1" />
            ${textoSVG}
        `;
    });

    // Línea de corte vertical entre observado (2024) y proyección (2027)
    const x3 = puntos[indiceCorteHistorico].x;
    const x4 = puntos[indiceCorteHistorico + 1].x;
    const xMid = (x3 + x4) / 2;

    // Trazar path histórico (puntos 0 a 3)
    const ptsHist = puntos.slice(0, indiceCorteHistorico + 1);
    const dHist = ptsHist.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    // Trazar path proyección (puntos 3 a n-1 para dar continuidad)
    const ptsProj = puntos.slice(indiceCorteHistorico);
    const dProj = ptsProj.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    // Eje X: Años
    let etiquetasX = "";
    puntos.forEach((p) => {
        etiquetasX += `
            <text x="${p.x}" y="${H - 10}" text-anchor="middle" font-size="9" fill="#64748b" font-family="sans-serif" font-weight="${p.isProj ? 'normal' : 'bold'}">${p.label}</text>
        `;
    });

    // Puntos, valores fijos y capa final de tooltips
    let elementosPuntos = "";
    let elementosTooltips = "";
    let reglasCSSHover = "";

    puntos.forEach((p, i) => {
        const valFormateado = Number.isInteger(p.val)
            ? p.val.toLocaleString("es-AR")
            : p.val.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        const tipoDato = p.isProj
            ? (esIngles ? "Projection · Illustrative data" : "Proyección · Dato ilustrativo")
            : (esIngles ? "Baseline · Illustrative data" : "Serie base · Dato ilustrativo");

        // Tooltip posicionado restando 45px al cy (y = cy - 45) para flotar por encima y no tapar etiquetas
        const ttW = 132;
        const ttH = 34;
        let ttX = p.x - ttW / 2;
        if (ttX < 6) ttX = 6;
        if (ttX + ttW > W - 6) ttX = W - ttW - 6;
        let ttY = p.y - 45;
        if (ttY < 2) ttY = 2;

        // Puntos visuales y área interactiva (compartiendo exactamente p.x y p.y con la línea principal)
        elementosPuntos += `
            <g class="punto-grupo" data-chart="${chartId}" data-idx="${i}">
                <!-- Círculo visual principal -->
                <circle id="circ-${chartId}-${i}" class="punto-visual transition-transform duration-150" cx="${p.x}" cy="${p.y}" r="4.5" fill="${color}" stroke="#ffffff" stroke-width="2" />
                
                <!-- Valor numérico visible sobre el punto (ocultado al abrir tooltip) -->
                <text id="val-${chartId}-${i}" class="punto-valor-texto transition-opacity duration-150" x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="9" font-weight="bold" fill="#334155" font-family="sans-serif">${valFormateado}${unidad}</text>
                
                <!-- Hitbox / Zona interactiva: comparte exactamente cx="${p.x}" y cy="${p.y}" calculados para el path -->
                <circle class="punto-interactivo cursor-pointer" cx="${p.x}" cy="${p.y}" r="14" fill="transparent" tabindex="0" role="button" aria-label="${p.label}: ${valFormateado}${unidad} (${tipoDato})" data-chart="${chartId}" data-idx="${i}" onmouseenter="window.activarTooltipPunto(this)" onmouseleave="window.desactivarTooltipPunto(this)" onfocus="window.activarTooltipPunto(this)" onblur="window.desactivarTooltipPunto(this)" />
            </g>
        `;

        // Tooltip renderizado en la capa final para quedar por encima por orden natural del DOM
        elementosTooltips += `
            <g id="tt-${chartId}-${i}" class="svg-tooltip-item opacity-0 pointer-events-none transition-opacity duration-150" opacity="0">
                <rect x="${ttX.toFixed(1)}" y="${ttY.toFixed(1)}" width="${ttW}" height="${ttH}" rx="6" fill="#0f172a" fill-opacity="0.95" />
                <text x="${(ttX + ttW / 2).toFixed(1)}" y="${(ttY + 14).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="bold" fill="#ffffff" font-family="sans-serif">${p.label}: ${valFormateado}${unidad}</text>
                <text x="${(ttX + ttW / 2).toFixed(1)}" y="${(ttY + 26).toFixed(1)}" text-anchor="middle" font-size="7.5" fill="#94a3b8" font-family="sans-serif">${tipoDato}</text>
            </g>
        `;

        // Reglas CSS complementarias para soporte nativo :has()
        reglasCSSHover += `
            svg:has(.punto-interactivo[data-chart="${chartId}"][data-idx="${i}"]:hover) #tt-${chartId}-${i},
            svg:has(.punto-interactivo[data-chart="${chartId}"][data-idx="${i}"]:focus) #tt-${chartId}-${i} {
                opacity: 1 !important;
            }
            svg:has(.punto-interactivo[data-chart="${chartId}"][data-idx="${i}"]:hover) #val-${chartId}-${i},
            svg:has(.punto-interactivo[data-chart="${chartId}"][data-idx="${i}"]:focus) #val-${chartId}-${i} {
                opacity: 0 !important;
            }
            svg:has(.punto-interactivo[data-chart="${chartId}"][data-idx="${i}"]:hover) #circ-${chartId}-${i},
            svg:has(.punto-interactivo[data-chart="${chartId}"][data-idx="${i}"]:focus) #circ-${chartId}-${i} {
                transform: scale(1.25);
                transform-origin: ${p.x}px ${p.y}px;
            }
        `;
    });

    return `
        <svg viewBox="0 0 ${W} ${H}" class="w-full h-full overflow-visible select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    @media (prefers-reduced-motion: no-preference) {
                        .svg-anim-line {
                            stroke-dasharray: 600;
                            stroke-dashoffset: 600;
                            animation: animarTrazoLinea 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        }
                    }
                    @keyframes animarTrazoLinea {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                    .punto-interactivo:focus {
                        outline: none;
                    }
                    ${reglasCSSHover}
                </style>
            </defs>

            <!-- Título del Eje Y -->
            <text x="${padL}" y="16" font-size="10" font-weight="bold" fill="#64748b" font-family="sans-serif">${tituloY}</text>

            <!-- Líneas Guía Horizontales del Eje Y -->
            ${lineasGuiaY}

            <!-- Línea Divisoria de Corte: Serie base vs Proyección -->
            <line x1="${xMid.toFixed(1)}" y1="${padT}" x2="${xMid.toFixed(1)}" y2="${padT + plotH}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3" />
            <text x="${(xMid - 6).toFixed(1)}" y="${padT - 6}" text-anchor="end" font-size="8" font-weight="bold" fill="#64748b" font-family="sans-serif">${esIngles ? "Baseline" : "Serie base"}</text>
            <text x="${(xMid + 6).toFixed(1)}" y="${padT - 6}" text-anchor="left" font-size="8" font-weight="bold" fill="#64748b" font-family="sans-serif">${esIngles ? "Projection" : "Proyección"}</text>

            <!-- Línea Histórica (Continua, stroke-width="2.5") -->
            <path d="${dHist}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-anim-line" />

            <!-- Línea de Proyección (Punteada, stroke-width="2.5", opacidad reducida 0.7) -->
            <path d="${dProj}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="4,4" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Eje X: Años -->
            ${etiquetasX}

            <!-- Puntos, Círculos Visuales y Valores Numéricos -->
            ${elementosPuntos}

            <!-- Capa de Tooltips al FINAL del documento SVG para z-index superior nativo -->
            <g class="capa-tooltips pointer-events-none">
                ${elementosTooltips}
            </g>
        </svg>
    `;
}

// Handlers globales para interacción de tooltips (escritorio y móviles)
window.activarTooltipPunto = function(el) {
    if (!el) return;
    const chart = el.getAttribute("data-chart");
    const idx = el.getAttribute("data-idx");
    if (!chart || idx === null) return;
    if (typeof window.ocultarTodosLosTooltips === "function") {
        window.ocultarTodosLosTooltips();
    }
    const tt = document.getElementById(`tt-${chart}-${idx}`);
    const val = document.getElementById(`val-${chart}-${idx}`);
    if (tt) {
        tt.classList.remove("opacity-0");
        tt.classList.add("opacity-100");
        tt.setAttribute("opacity", "1");
    }
    if (val) {
        val.classList.add("opacity-0");
        val.setAttribute("opacity", "0");
    }
};

window.desactivarTooltipPunto = function(el) {
    if (!el) return;
    const chart = el.getAttribute("data-chart");
    const idx = el.getAttribute("data-idx");
    if (!chart || idx === null) return;
    const tt = document.getElementById(`tt-${chart}-${idx}`);
    const val = document.getElementById(`val-${chart}-${idx}`);
    if (tt) {
        tt.classList.add("opacity-0");
        tt.classList.remove("opacity-100");
        tt.setAttribute("opacity", "0");
    }
    if (val) {
        val.classList.remove("opacity-0");
        val.setAttribute("opacity", "1");
    }
};

window.ocultarTodosLosTooltips = function() {
    document.querySelectorAll(".svg-tooltip-item").forEach(tt => {
        tt.classList.add("opacity-0");
        tt.classList.remove("opacity-100");
        tt.setAttribute("opacity", "0");
    });
    document.querySelectorAll(".punto-valor-texto").forEach(val => {
        val.classList.remove("opacity-0");
        val.setAttribute("opacity", "1");
    });
};

function renderizarGraficosObservatorio() {
    const contenedorTurbales = document.getElementById("svg-container-turbales");
    const contenedorGlaciar = document.getElementById("svg-container-glaciar");
    if (!contenedorTurbales || !contenedorGlaciar) return;

    const esIngles = typeof idiomaActual !== "undefined" && idiomaActual === "en";
    const dataReal = obtenerDatosObservatorioActivos();
    const anios = (dataReal.labels || []).map(lbl => {
        if (!esIngles) return lbl.replace("(Futuro)", "(est.)");
        return lbl.replace("(Futuro)", "(proj.)");
    });
    const diasEstres = dataReal.turbales.dias_estres;
    const masaGlaciar = dataReal.glaciar.masa_remanente_pct;

    // Construcción de aria-label accesible completo para Turbales
    const partesAriaTurbales = anios.map((a, i) => `${a}: ${diasEstres[i].toLocaleString("es-AR")}`);
    const ariaTurbales = esIngles
        ? `Evolution of annual dry days: ${partesAriaTurbales.join(", ")}.`
        : `Evolución de días secos anuales: ${partesAriaTurbales.join(", ")}.`;
    contenedorTurbales.setAttribute("aria-label", ariaTurbales);

    // 1. Gráfico SVG para Turbales (Días Secos, escala Y: 0 a 12, color #d97706, sin letra "d" en eje Y)
    contenedorTurbales.innerHTML = crearGraficoLineasSVG({
        id: "turbales",
        labels: anios,
        data: diasEstres,
        yMin: 0,
        yMax: 12,
        valoresY: [0, 3, 6, 9, 12],
        color: "#d97706",
        unidad: "",
        unidadEjeY: "",
        tituloY: esIngles ? "Dry days / year" : "Días secos / año",
        indiceCorteHistorico: 3,
        esIngles
    });

    // Construcción de aria-label accesible completo para Glaciar (explícito: eje desde 80%)
    const partesAriaGlaciar = anios.map((a, i) => `${a}: ${masaGlaciar[i].toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`);
    const ariaGlaciar = esIngles
        ? `Evolution of glacier remaining ice mass (axis from 80%): ${partesAriaGlaciar.join(", ")}.`
        : `Evolución de masa remanente del glaciar (eje desde 80%): ${partesAriaGlaciar.join(", ")}.`;
    contenedorGlaciar.setAttribute("aria-label", ariaGlaciar);

    // 2. Gráfico SVG para Glaciar (Masa remanente %, escala Y: 80 a 105 para dar aire al 100%, color #0e7490)
    contenedorGlaciar.innerHTML = crearGraficoLineasSVG({
        id: "glaciar",
        labels: anios,
        data: masaGlaciar,
        yMin: 80,
        yMax: 105,
        valoresY: [80, 85, 90, 95, 100, 105],
        color: "#0e7490",
        unidad: "%",
        unidadEjeY: "%",
        tituloY: esIngles ? "% Remaining ice mass (axis from 80%)" : "% Masa remanente (eje desde 80%)",
        indiceCorteHistorico: 3,
        esIngles
    });
}

// 1. Cerrar la vista de pantalla completa del Observatorio y volver al mapa interactivo
function cerrarObservatorioYVolverAlMapa() {
    const vistaObsFull = document.getElementById("vista-observatorio-full");
    if (vistaObsFull) {
        vistaObsFull.classList.add("hidden");
        vistaObsFull.classList.remove("flex");
    }
    if (typeof cerrarTodasLasVistas === "function") {
        cerrarTodasLasVistas();
    }
    if (typeof cerrarDetalleHitoCompleto === "function") {
        cerrarDetalleHitoCompleto();
    }

    if (typeof cambiarPestanaSidebar === "function") {
        cambiarPestanaSidebar("explorar");
    }

    setTimeout(() => {
        const m = window.map || window.mapa || mapa;
        if (m) m.invalidateSize();
    }, 150);
}
window.cerrarObservatorioYVolverAlMapa = cerrarObservatorioYVolverAlMapa;

// 2. Navegar y activar alerta SAR de Turbal Valle Tierra Mayor
function navegarATurbalObservatorio() {
    cerrarObservatorioYVolverAlMapa();

    setTimeout(() => {
        const m = window.map || window.mapa || mapa;
        if (m) {
            m.invalidateSize();
            // Centrar exactamente en las coordenadas de Turbal Valle Tierra Mayor
            m.flyTo([-54.72, -67.965], 12, {
                animate: true,
                duration: 1.2
            });

            // Activar directamente la capa y alerta SAR
            if (capaAlertasSAR) {
                if (!m.hasLayer(capaAlertasSAR)) {
                    m.addLayer(capaAlertasSAR);
                }
                alertasSARVisibles = true;
                const btnSAR = document.getElementById("btn-capa-alertas-sar");
                if (btnSAR) {
                    btnSAR.className = "btn-capa-alertas active bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] sm:text-xs py-1.5 px-2.5 sm:px-3.5 rounded-2xl shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap transition-all cursor-pointer";
                }

                // Destacar polígono activo y rojo, y abrir popup/modal
                let popupAbierto = false;
                capaAlertasSAR.eachLayer(layer => {
                    const props = layer.feature && layer.feature.properties;
                    if (props && (props.id === "turbal_tierra_mayor" || props.nombre?.includes("Tierra Mayor"))) {
                        if (typeof layer.setStyle === "function") {
                            layer.setStyle({
                                color: "#ef4444",
                                weight: 4,
                                opacity: 1,
                                fillColor: "#ef4444",
                                fillOpacity: 0.55
                            });
                        }
                        if (typeof layer.bringToFront === "function") layer.bringToFront();
                        layer.openPopup();
                        popupAbierto = true;
                    }
                });

                if (typeof mostrarModalBloqueoPorNombre === "function") {
                    mostrarModalBloqueoPorNombre("Turbal Valle Tierra Mayor");
                }
            } else if (typeof mostrarModalBloqueoPorNombre === "function") {
                mostrarModalBloqueoPorNombre("Turbal Valle Tierra Mayor");
            }
        }
    }, 150);
}
window.navegarATurbalObservatorio = navegarATurbalObservatorio;

// 3. Navegar y abrir ficha territorial de Glaciar Vinciguerra ("ush-02")
function navegarAGlaciarObservatorio() {
    cerrarObservatorioYVolverAlMapa();

    setTimeout(() => {
        const m = window.map || window.mapa || mapa;
        if (m) {
            m.invalidateSize();
            m.flyTo([-54.765, -68.345], 13, {
                animate: true,
                duration: 1.2
            });

            // Abrir directamente la ficha territorial del hito del Glaciar Vinciguerra
            if (typeof abrirDetalleHito === "function") {
                abrirDetalleHito("ush-02");
            } else if (typeof seleccionarHito === "function") {
                const hito = Array.isArray(listaHitos) ? listaHitos.find(h => h.id === "ush-02") : null;
                if (hito) seleccionarHito(hito, false, true, true);
            }
            const marcador = marcadoresPorId && marcadoresPorId["ush-02"];
            if (marcador) {
                marcador.openPopup();
            }
        }
    }, 150);
}
window.navegarAGlaciarObservatorio = navegarAGlaciarObservatorio;

// Helper global para centrar el mapa desde accesos directos del Observatorio
function centrarEnSitio(clave) {
    if (clave === "laguna-esmeralda" || String(clave || "").includes("turbal")) {
        navegarATurbalObservatorio();
    } else if (clave === "glaciar-vinciguerra" || String(clave || "").includes("glaciar")) {
        navegarAGlaciarObservatorio();
    } else {
        cerrarObservatorioYVolverAlMapa();
        setTimeout(() => {
            const hito = Array.isArray(listaHitos) ? listaHitos.find(h => h.id === clave || h.nombre?.toLowerCase().includes(clave)) : null;
            if (hito && typeof seleccionarHito === "function") {
                seleccionarHito(hito, true, true, false);
            }
        }, 150);
    }
}
window.centrarEnSitio = centrarEnSitio;

// Helper global para alternar la ficha metodológica y de transparencia
window.toggleMetodoObservatorio = function(btn) {
    let btnEl = btn;
    if (typeof btn === "string") {
        btnEl = document.querySelector(`.btn-toggle-metodo[data-target="${btn}"]`) || document.getElementById(btn);
    }
    if (!btnEl && typeof event !== "undefined" && event && event.target) {
        btnEl = event.target.closest(".btn-toggle-metodo") || event.target;
    }
    if (!btnEl) return;

    // Buscar tarjeta contenedora (evitar que coincida con el contenedor del pie si tiene .bg-white)
    const tarjeta = btnEl.closest("[data-metrica], .tarjeta-observatorio") 
        || btnEl.closest("#vista-tab-observatorio > div")
        || btnEl.closest("article");
    if (!tarjeta) return;

    const panel = tarjeta.querySelector(".panel-metodo");
    if (panel) {
        const estaOculto = panel.classList.toggle("hidden");
        const esIngles = typeof idiomaActual !== "undefined" && idiomaActual === "en";
        const iconoInfo = `<svg class="w-3.5 h-3.5 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        const iconoOcultar = `<svg class="w-3.5 h-3.5 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
        if (estaOculto) {
            btnEl.innerHTML = `${iconoInfo}<span>${esIngles ? "View source & method" : "Ver fuente y método"}</span>`;
        } else {
            btnEl.innerHTML = `${iconoOcultar}<span>${esIngles ? "Hide source & method" : "Ocultar fuente y método"}</span>`;
        }
    }
};
window.togglePanelMetodo = window.toggleMetodoObservatorio;

// Helper global para alternar la leyenda cartográfica colapsable
window.toggleLeyendaMapa = function() {
    const cuerpo = document.getElementById("cuerpo-leyenda-mapa");
    const btn = document.getElementById("btn-toggle-leyenda");
    const flecha = document.getElementById("icono-flecha-leyenda");
    if (!cuerpo) return;

    cuerpo.classList.toggle("hidden");
    const visible = !cuerpo.classList.contains("hidden");
    if (btn) btn.setAttribute("aria-expanded", String(visible));
    if (flecha) flecha.classList.toggle("rotate-180", visible);
};

// Inicializar estado responsivo de la leyenda del mapa
function inicializarEstadoLeyendaMapa() {
    const cuerpo = document.getElementById("cuerpo-leyenda-mapa");
    const btn = document.getElementById("btn-toggle-leyenda");
    const flecha = document.getElementById("icono-flecha-leyenda");
    if (!cuerpo) return;

    if (window.innerWidth >= 768) {
        cuerpo.classList.remove("hidden");
        if (btn) btn.setAttribute("aria-expanded", "true");
        if (flecha) flecha.classList.add("rotate-180");
    } else {
        cuerpo.classList.add("hidden");
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (flecha) flecha.classList.remove("rotate-180");
    }
}

// Listener global para cerrar tooltips en celulares al tocar afuera
document.addEventListener("touchstart", (e) => {
    if (!e.target.closest(".punto-interactivo")) {
        if (typeof window.ocultarTodosLosTooltips === "function") {
            window.ocultarTodosLosTooltips();
        }
    }
}, { passive: true });

// Delegación de eventos global para el Observatorio y controles territoriales
document.addEventListener("click", (e) => {
    // 0. Ocultar tooltips de gráficos SVG al hacer clic fuera en computadoras y celulares
    if (!e.target.closest(".punto-interactivo")) {
        if (typeof window.ocultarTodosLosTooltips === "function") {
            window.ocultarTodosLosTooltips();
        }
        const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
        const bienvenidaVisible = pantallaBienvenida && !pantallaBienvenida.classList.contains("hidden");
        const esControlEntrada = e.target.closest("input, textarea, select, button, form, [contenteditable='true']");
        if (!bienvenidaVisible && !esControlEntrada) {
            if (document.activeElement && typeof document.activeElement.blur === "function" && document.activeElement !== document.body) {
                if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
                    document.activeElement.blur();
                }
            }
        }
    }

    // 1. Delegación para botón "ℹ️ Ver fuente y método" (solo si no tiene onclick propio)
    const btnToggle = e.target.closest(".btn-toggle-metodo");
    if (btnToggle) {
        if (!btnToggle.getAttribute("onclick")) {
            e.preventDefault();
            e.stopPropagation();
            window.toggleMetodoObservatorio(btnToggle);
        }
        return;
    }

    // 2. Delegación para botón "Ver turbal en mapa →" (solo si no tiene onclick propio)
    const btnTurbal = e.target.closest("#btn-obs-ir-turbal, .btn-ir-turbal");
    if (btnTurbal) {
        if (!btnTurbal.getAttribute("onclick")) {
            e.preventDefault();
            e.stopPropagation();
            navegarATurbalObservatorio();
        }
        return;
    }

    // 3. Delegación para botón "Ver glaciar en mapa →" (solo si no tiene onclick propio)
    const btnGlaciar = e.target.closest("#btn-obs-ir-vinciguerra, .btn-ir-glaciar");
    if (btnGlaciar) {
        if (!btnGlaciar.getAttribute("onclick")) {
            e.preventDefault();
            e.stopPropagation();
            navegarAGlaciarObservatorio();
        }
        return;
    }

    // 4. Delegación para botón de alternar leyenda del mapa
    const btnLeyenda = e.target.closest("#btn-toggle-leyenda");
    if (btnLeyenda) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleLeyendaMapa();
        return;
    }
});

function configurarObservatorio() {
    const btnNarrarObs = document.getElementById("btn-narrar-observatorio");

    if (btnNarrarObs) {
        btnNarrarObs.addEventListener("click", () => {
            const esIngles = idiomaActual === "en";
            const dataReal = obtenerDatosObservatorioActivos();
            const dIni = dataReal.turbales.dias_estres[0];
            const dFin = dataReal.turbales.dias_estres[dataReal.turbales.dias_estres.length - 1];
            const mFin = dataReal.glaciar.masa_remanente_pct[dataReal.glaciar.masa_remanente_pct.length - 1];
            const varGlaciar = dataReal.glaciar.variacion_pct;

            const sintesis = esIngles
                ? `Austral Climate Observatory. Illustrative prototype scenarios. First: Dry days in peatlands could double by 2030, going from ${dIni} days in the base series to a projected ${dFin} days per year. Second: The Vinciguerra Glacier could lose 16% of its 2015 mass by 2030, keeping approximately ${mFin} percent of its remaining mass.`
                : `Observatorio Climático Austral. Escenarios ilustrativos de prototipo. Primero: Los días secos en turbales podrían duplicarse hacia 2030, pasando de ${dIni} días en la serie base a ${dFin} días proyectados al año. Segundo: El glaciar Vinciguerra podría perder un 16% de su masa de 2015 para el año 2030, conservando aproximadamente el ${mFin} por ciento de su masa remanente.`;

            if (!("speechSynthesis" in window)) {
                anunciarAccesibilidad(sintesis);
                return;
            }
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                anunciarAccesibilidad(esIngles ? "Observatory summary stopped." : "Síntesis del observatorio detenida.");
            } else {
                speechSynthesis.cancel();
                const loc = new SpeechSynthesisUtterance(sintesis);
                loc.lang = esIngles ? "en-US" : "es-AR";
                loc.rate = 0.95;
                speechSynthesis.speak(loc);
                anunciarAccesibilidad(esIngles ? "Reading observatory climate projections." : "Reproduciendo síntesis del observatorio climático.");
            }
        });
    }

    // Los botones "Ver fuente y método" ya tienen onclick="window.toggleMetodoObservatorio(this)" y delegación global.
}

function actualizarBadgeSellos() {
    const elBadge = document.getElementById("tab-badge-sellos");
    const elTotal = document.getElementById("bitacora-total");
    const elVisitas = document.getElementById("bitacora-visitas");
    const elContadorTotal = document.getElementById("contador-total");
    const visitas = obtenerVisitas();
    const total = (Array.isArray(listaHitos) && listaHitos.length > 0) ? listaHitos.length : 25;

    if (elTotal) elTotal.innerText = total;
    if (elVisitas) elVisitas.innerText = visitas.length;
    if (elContadorTotal) elContadorTotal.innerText = total;

    if (elBadge) {
        elBadge.innerHTML = `<span id="bitacora-visitas">${visitas.length}</span>/<span id="bitacora-total">${total}</span>`;
    }

    const elMobileBadge = document.getElementById("mobile-nav-badge-sellos");
    if (elMobileBadge) {
        elMobileBadge.innerHTML = `<span id="mobile-bitacora-visitas">${visitas.length}</span>/<span id="mobile-bitacora-total">${total}</span>`;
    }
}

function renderizarSellosSidebar() {
    const rejilla = document.getElementById("rejilla-sellos-sidebar");
    if (!rejilla) return;
    const visitas = obtenerVisitas();
    const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;

    rejilla.innerHTML = listaHitos.map(hito => {
        const desbloqueado = visitas.includes(hito.id);
        const seleccionado = hitoSeleccionadoId === hito.id;
        const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
        const color = COLORES_CATEGORIA[hito.categoria] || "#f59e0b";

        return `
            <div data-id="${hito.id}"
                 class="badge-stamp p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[105px] ${ seleccionado ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/20' : '' } ${desbloqueado ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 desbloqueado shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 bloqueado' }">
                <div class="w-8 h-8 flex items-center justify-center my-0.5">${obtenerIconoSello(hito, desbloqueado)}</div>
                <div class="w-full">
                    <span class="text-[9px] font-bold uppercase tracking-wider block truncate" style="color: ${color};">
                        ${hito.localidad}
                    </span>
                    <h5 class="text-[11px] font-bold line-clamp-2 leading-tight text-slate-800 mt-0.5" title="${nombre}">
                        ${nombre}
                    </h5>
                </div>
                <span class="text-[9px] font-semibold mt-1 ${desbloqueado ? 'text-emerald-600 ' : 'text-slate-400 '}">
                    ${desbloqueado ? '✓ ' + (t.estado_visitado || 'Registrado') : (t.estado_por_explorar || 'Por explorar')}
                </span>
            </div>
        `;
    }).join("");

    rejilla.querySelectorAll(".badge-stamp").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            const hito = listaHitos.find(h => h.id === id);
            if (hito) {
                cerrarTodasLasVistas();
                seleccionarHito(hito, true, true);
            }
        });
    });
}

// 17. Modal Completo de Pasaporte de Sellos
function configurarModalPasaporte() {
    const modal = document.getElementById("modal-pasaporte") || document.getElementById("modal-libreta");
    const btnAbrir = document.getElementById("btn-abrir-pasaporte");
    const btnAbrirDock = document.getElementById("btn-abrir-pasaporte-dock");
    const tituloSellos = document.getElementById("titulo-sellos");
    const btnSidePasaporte = document.getElementById("btn-imprimir-pasaporte-side");
    const btnVerLibreta = document.getElementById("btn-ver-libreta");
    const btnCerrar = document.getElementById("btn-cerrar-modal-pasaporte");
    const btnCerrarSec = document.getElementById("btn-cerrar-modal-pasaporte-secundario");
    const btnImprimir = document.getElementById("btn-imprimir-pasaporte");

    if (!modal) return;

    const abrir = () => {
        renderizarModalPasaporte();
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    };

    const cerrar = () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    };

    if (btnAbrir) btnAbrir.addEventListener("click", abrir);
    if (btnAbrirDock) btnAbrirDock.addEventListener("click", abrir);
    if (tituloSellos) tituloSellos.addEventListener("click", abrir);
    if (btnSidePasaporte) btnSidePasaporte.addEventListener("click", abrir);
    if (btnVerLibreta) btnVerLibreta.addEventListener("click", abrir);
    document.querySelectorAll(".btn-ver-libreta").forEach(btn => btn.addEventListener("click", abrir));
    if (btnCerrar) btnCerrar.addEventListener("click", cerrar);
    if (btnCerrarSec) btnCerrarSec.addEventListener("click", cerrar);
    if (btnImprimir) {
        btnImprimir.addEventListener("click", () => {
            window.print();
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrar();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            cerrar();
        }
    });

    window.abrirModalPasaporte = abrir;
    window.abrirModalLibreta = abrir;
    window.cerrarModalPasaporte = cerrar;
    window.cerrarModalLibreta = cerrar;
}

// 17.1. Modal de Créditos Institucionales y Soberanía de Datos
function configurarModalCreditos() {
    const modal = document.getElementById("modal-creditos");
    const btnAbrir = document.getElementById("btn-abrir-creditos");
    const btnCerrar = document.getElementById("btn-cerrar-modal-creditos");
    const btnCerrarSec = document.getElementById("btn-cerrar-modal-creditos-secundario");

    if (!modal) return;

    const abrir = () => modal.classList.remove("hidden");
    const cerrar = () => modal.classList.add("hidden");

    if (btnAbrir) btnAbrir.addEventListener("click", abrir);
    if (btnCerrar) btnCerrar.addEventListener("click", cerrar);
    if (btnCerrarSec) btnCerrarSec.addEventListener("click", cerrar);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrar();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            cerrar();
        }
    });
}

// 17.2. Modal de Huella Consciente y Rango Guardián Austral
function configurarModalHuella() {
    const modal = document.getElementById("modal-huella");
    const btnAbrir = document.getElementById("btn-abrir-huella-modal");
    const btnCerrar = document.getElementById("btn-cerrar-modal-huella");
    const btnCerrarSec = document.getElementById("btn-entendido-huella") || document.getElementById("btn-cerrar-modal-huella-secundario");

    if (!modal || !btnAbrir) return;

    const abrir = () => {
        actualizarHuellaConsciente();
        modal.classList.remove("hidden");
    };
    const cerrar = () => modal.classList.add("hidden");

    btnAbrir.addEventListener("click", abrir);
    if (btnCerrar) btnCerrar.addEventListener("click", cerrar);
    if (btnCerrarSec) btnCerrarSec.addEventListener("click", cerrar);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrar();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            cerrar();
        }
    });
}

// 17.3. Modal de Bloqueo Turístico Digital (Pilar de Acción)
let alertaCriticaActual = null;

function configurarModalBloqueo() {
    const modal = document.getElementById("modal-bloqueo");
    const btnCerrarX = document.getElementById("btn-cerrar-modal-bloqueo-x");
    const btnCerrar = document.getElementById("btn-cerrar-modal-bloqueo");
    const btnAlternativa = document.getElementById("btn-bloqueo-ruta-alternativa");

    if (!modal) return;

    const cerrar = () => modal.classList.add("hidden");

    if (btnCerrarX) btnCerrarX.addEventListener("click", cerrar);
    if (btnCerrar) btnCerrar.addEventListener("click", cerrar);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrar();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            cerrar();
        }
    });

    if (btnAlternativa) {
        btnAlternativa.addEventListener("click", () => {
            cerrar();
            desviarASenderoSeguro();
        });
    }
}

function mostrarModalBloqueo(props = {}) {
    const modal = document.getElementById("modal-bloqueo");
    if (!modal) return;

    alertaCriticaActual = props;
    const nombreEl = document.getElementById("modal-bloqueo-nombre");
    const badgeEl = document.getElementById("modal-bloqueo-badge");
    const motivoEl = document.getElementById("modal-bloqueo-motivo");

    const nombre = (idiomaActual === "en" && props.nombre_en) ? props.nombre_en : (props.nombre || "Turbal Valle Tierra Mayor");
    const motivo = (idiomaActual === "en" && props.motivo_en) ? props.motivo_en : (props.motivo || (idiomaActual === "en" ? "Severe hydrological drought detected (SAR Anomaly). Fire risk." : "Estrés hídrico detectado (Anomalía SAR). Riesgo de incendio."));

    if (nombreEl) nombreEl.textContent = nombre;
    if (badgeEl) {
        badgeEl.textContent = idiomaActual === "en" ? "STATUS: CRITICAL" : "ESTADO: CRÍTICO";
    }
    if (motivoEl) motivoEl.textContent = motivo;

    modal.classList.remove("hidden");
    vibrarDispositivo([100, 40, 100]);

    anunciarAccesibilidad(
        idiomaActual === "en"
            ? `Restricted zone alert: Access to ${nombre} is suspended due to peatland drought.`
            : `Alerta de zona restringida: Acceso a ${nombre} suspendido por estrés hídrico de turbales.`
    );
}

window.mostrarModalBloqueoPorNombre = function(nombreEscapado) {
    const nombre = unescape(nombreEscapado);
    let props = { nombre: nombre, estado: "CRITICO" };
    if (datosAlertasSAR && Array.isArray(datosAlertasSAR.features)) {
        const feat = datosAlertasSAR.features.find(f => f.properties && f.properties.nombre === nombre);
        if (feat) props = feat.properties;
    }
    mostrarModalBloqueo(props);
};

function desviarASenderoSeguro() {
    // Buscar hito seguro alternativo (ej: Parque Nacional Lapataia o sendero habilitado)
    const hitoSeguro = listaHitos.find(h => h.id === "ush-01") || listaHitos.find(h => h.fragilidad === "Baja") || listaHitos[0];
    if (hitoSeguro) {
        seleccionarHito(hitoSeguro, true, true);
        anunciarAccesibilidad(
            idiomaActual === "en"
                ? `Route diverted to safe authorized trail: ${hitoSeguro.nombre_en || hitoSeguro.nombre}`
                : `Ruta desviada hacia sendero seguro autorizado: ${hitoSeguro.nombre}`
        );
    }
}

function renderizarModalPasaporte() {
    const rejilla = document.getElementById("rejilla-pasaporte");
    if (!rejilla) return;

    const visitas = obtenerVisitas();
    const t = DICCIONARIO[idiomaActual];

    rejilla.innerHTML = listaHitos.map(hito => {
        const visitado = visitas.includes(hito.id);
        const color = COLORES_CATEGORIA[hito.categoria] || "#f59e0b";
        const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
        const fragilidad = (idiomaActual === "en" && hito.fragilidad_en) ? hito.fragilidad_en : hito.fragilidad;
        const nota = visitado ? obtenerNota(hito.id) : "";

        return `
            <div data-id="${hito.id}"
                 class="tarjeta-pasaporte-item tarjeta-pasaporte flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer min-h-[96px] pb-3 ${ visitado ? 'border-amber-500/50 hover:border-amber-400' : 'border-slate-800 opacity-75' } relative overflow-hidden group shadow-lg">
                
                <!-- Borde de categoría -->
                <div class="absolute top-0 left-0 right-0 h-1" style="background-color: ${color};"></div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center justify-center w-8 h-8">${obtenerIconoSello(hito, visitado)}</div>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                              style="color: ${color}; border-color: ${color}40; background-color: ${color}15;">
                            ${hito.localidad}
                        </span>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold leading-snug line-clamp-2 text-slate-800 group-hover:text-amber-500 pb-1 mt-1 break-words transition-colors" title="${nombre}">
                            ${nombre}
                        </h4>
                        <p class="text-[11px] text-amber-500 font-mono">${t.toponimia} ${hito.toponimia}</p>
                    </div>

                    <div class="text-[10px] text-slate-500 flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200">
                        <span class="flex items-center gap-1.5">
                            ${obtenerIconoFragilidadHoja("w-3.5 h-3.5")}
                            <span>${t.fragilidad}</span>
                        </span>
                        <span class="font-semibold ${fragilidad === 'Muy Alta' || fragilidad === 'Alta' || fragilidad === 'Very High' || fragilidad === 'High' ? 'text-rose-500 ' : 'text-amber-500 '}">
                            ${fragilidad}
                        </span>
                    </div>

                    <!-- Estado y Nota de campo -->
                    <div class="pt-1.5 text-[11px]">
                        ${visitado ? `
                            <span class="text-emerald-500 font-bold block mb-1">${t.estado_visitado}</span>
                            <div class="bg-slate-100 rounded-lg p-2 border border-slate-200 text-[10px] text-slate-700 italic overflow-y-auto">
                                ${nota ? `"${nota}"` : `<span class="text-slate-400 not-italic">${t.sin_notas}</span>`}
                            </div>
                        ` : `
                            <span class="text-slate-400 font-medium block">${t.estado_por_explorar}</span>
                        `}
                    </div>
                </div>

                <div class="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-amber-500 font-medium">
                    <span>${visitado ? t.tocar_explorar : t.estado_por_explorar}</span>
                    <span>→</span>
                </div>
            </div>
        `;
    }).join("");

    // Evento de clic en cada tarjeta para cerrar modal y volar al hito en el mapa
    rejilla.querySelectorAll(".tarjeta-pasaporte, .tarjeta-pasaporte-item").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            const hito = listaHitos.find(h => h.id === id);
            if (hito) {
                const modal = document.getElementById("modal-pasaporte") || document.getElementById("modal-libreta");
                if (modal) {
                    modal.classList.add("hidden");
                    modal.classList.remove("flex");
                }
                cerrarTodasLasVistas();
                abrirDetalleHito(hito.id);
            }
        });
    });
}

// 18. Estimador de Distancia y Tiempo de Marcha / Traslado entre Hitos
function calcularDistanciaKm(coord1, coord2) {
    const R = 6371; // Radio medio de la Tierra en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function actualizarMetricasDistancia() {
    const cont = document.getElementById("metrica-distancia-ruta");
    if (!cont) return;

    const visitas = obtenerVisitas();
    if (visitas.length < 2) {
        cont.classList.add("hidden");
        return;
    }

    const hitosVisitados = visitas
        .map(id => listaHitos.find(h => h.id === id))
        .filter(Boolean);

    if (hitosVisitados.length < 2) {
        cont.classList.add("hidden");
        return;
    }

    let distanciaTotal = 0;
    let tiempoTotalHoras = 0;

    for (let i = 0; i < hitosVisitados.length - 1; i++) {
        const dist = calcularDistanciaKm(
            hitosVisitados[i].coordenadas,
            hitosVisitados[i + 1].coordenadas
        );
        distanciaTotal += dist;

        // Estimación de traslado: 4.5 km/h para tramos pedestres / senderos (< 15 km),
        // y 65 km/h para enlaces vehiculares por ruta en el territorio fueguino (RN 3)
        if (dist < 15) {
            tiempoTotalHoras += dist / 4.5;
        } else {
            tiempoTotalHoras += dist / 65;
        }
    }

    const horas = Math.floor(tiempoTotalHoras);
    const minutos = Math.round((tiempoTotalHoras - horas) * 60);

    let textoTiempo = "";
    if (horas > 0) {
        textoTiempo = `${horas}h ${minutos}m`;
    } else {
        textoTiempo = `${minutos}m`;
    }

    const elDist = document.getElementById("valor-distancia-total");
    const elTiempo = document.getElementById("valor-tiempo-estimado");

    if (elDist) elDist.innerText = `${distanciaTotal.toFixed(1)} km`;
    if (elTiempo) elTiempo.innerText = textoTiempo;

    cont.classList.remove("hidden");
}

// Capitaliza la primera letra del nombre del explorador
function capitalizarNombre(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

let timerSaludoPinguino = null;

// Impulso reactivo de saludo y avivada de antorcha de la mascota animada
function activarSaludoPinguino(duracionMs = 1600) {
    const contenedorPinguino = document.getElementById("svg-pinguino-bienvenida");
    const inputNombre = document.getElementById("input-nombre-explorador");

    if (timerSaludoPinguino) {
        clearTimeout(timerSaludoPinguino);
        timerSaludoPinguino = null;
    }

    if (contenedorPinguino) {
        contenedorPinguino.classList.add("pinguino-saludando-activo", "antorcha-avivada");
    }

    timerSaludoPinguino = setTimeout(() => {
        if (contenedorPinguino) {
            contenedorPinguino.classList.remove("pinguino-saludando-activo");
            const tieneTexto = inputNombre && inputNombre.value.trim().length > 0;
            if (!tieneTexto) {
                contenedorPinguino.classList.remove("antorcha-avivada");
            }
        }
        timerSaludoPinguino = null;
    }, duracionMs);
}
window.activarSaludoPinguino = activarSaludoPinguino;

// Actualiza el texto traducido, visibilidad del globito de diálogo y energía de la antorcha
function actualizarBurbujaSaludoPinguino(valorNombre) {
    const burbujaDialogo = document.getElementById("burbuja-dialogo");
    const svgPinguino = document.getElementById("svg-pinguino-bienvenida");
    const texto = (valorNombre || "").trim();
    const hayTexto = texto.length > 0;

    if (burbujaDialogo) {
        if (hayTexto) {
            const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
            const prefijo = t.saludoPinguino || (idiomaActual === "en" ? "Hello" : "¡Hola");
            const nombreCapitalizado = capitalizarNombre(texto);
            burbujaDialogo.textContent = `${prefijo}, ${nombreCapitalizado}!`;
            burbujaDialogo.classList.add("visible");
        } else {
            burbujaDialogo.textContent = "";
            burbujaDialogo.classList.remove("visible");
        }
    }

    if (svgPinguino && !svgPinguino.classList.contains("pinguino-transicion-activa")) {
        svgPinguino.classList.toggle("antorcha-avivada", hayTexto);
    }
}

// Configuración e interacción de la Pantalla de Bienvenida del Explorador
function configurarPantallaBienvenida() {
    const pantalla = document.getElementById("pantalla-bienvenida");
    const form = document.getElementById("form-bienvenida");
    const inputNombre = document.getElementById("input-nombre-explorador");
    const badgeExplorador = document.getElementById("badge-explorador");
    const nombreDisplay = document.getElementById("nombre-explorador-display");
    const btnEditar = document.getElementById("btn-editar-explorador");

    if (!pantalla || !form || !inputNombre) return;

    // Verificar si ya existe un nombre de explorador persistido
    const nombreGuardado = typeof obtenerNombreExplorador === "function" ? obtenerNombreExplorador() : "";

    if (nombreGuardado && nombreGuardado.trim().length > 0) {
        // Usuario recurrente: mostrar identidad en header y omitir pantalla de bienvenida
        inputNombre.value = nombreGuardado.trim();
        if (nombreDisplay) nombreDisplay.innerText = nombreGuardado.trim();
        if (badgeExplorador) badgeExplorador.classList.remove("hidden");
        pantalla.classList.add("hidden");
    } else {
        // Primera visita: mostrar pantalla de bienvenida y enfocar input inmediatamente
        inputNombre.value = "";
        if (nombreDisplay) nombreDisplay.innerText = "";
        if (badgeExplorador) badgeExplorador.classList.add("hidden");
        pantalla.classList.remove("hidden", "opacity-0", "pointer-events-none");
        setTimeout(() => {
            if (inputNombre) {
                inputNombre.focus();
                const len = inputNombre.value.length;
                if (typeof inputNombre.setSelectionRange === "function") {
                    inputNombre.setSelectionRange(len, len);
                }
            }
        }, 120);
    }

    // Interactividad ocular y globito de diálogo del Pingüino Rey
    const svgPinguinoBienvenida = document.getElementById("svg-pinguino-bienvenida");
    const pupilaIzq = document.getElementById("pupila-izq");
    const pupilaDer = document.getElementById("pupila-der");
    const brilloIzq = document.getElementById("brillo-izq");
    const brilloDer = document.getElementById("brillo-der");
    let focoEnInputNombre = false;

    function moverPupilas(offsetX, offsetY) {
        [pupilaIzq, pupilaDer, brilloIzq, brilloDer].forEach((circulo) => {
            if (!circulo) return;
            const baseCx = parseFloat(circulo.getAttribute("data-base-cx"));
            const baseCy = parseFloat(circulo.getAttribute("data-base-cy"));
            if (!Number.isNaN(baseCx) && !Number.isNaN(baseCy)) {
                circulo.setAttribute("cx", (baseCx + offsetX).toFixed(2));
                circulo.setAttribute("cy", (baseCy + offsetY).toFixed(2));
            }
        });
    }

    function actualizarDialogoYMirada() {
        actualizarBurbujaSaludoPinguino(inputNombre.value);
        if (focoEnInputNombre) {
            // Mirar suavemente hacia abajo en dirección al campo de nombre
            moverPupilas(0, 2.1);
        }
    }

    const coposNieve = document.querySelectorAll("#capa-nieve-austral .copo-nieve");

    document.addEventListener("mousemove", (e) => {
        if (pantalla.classList.contains("hidden")) return;

        // Paralaje sutil de partículas de escarcha austral según el cursor
        if (coposNieve.length > 0) {
            const relX = e.clientX - window.innerWidth / 2;
            const relY = e.clientY - window.innerHeight / 2;
            coposNieve.forEach((copo) => {
                const vel = parseFloat(copo.getAttribute("data-velocidad")) || 0.05;
                const moveX = (-relX * vel).toFixed(1);
                const moveY = (-relY * vel * 0.7).toFixed(1);
                copo.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        }

        if (focoEnInputNombre || !svgPinguinoBienvenida) return;
        const rect = svgPinguinoBienvenida.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        // Punto medio entre ambos ojos dentro del viewBox (86/180, 36/200)
        const centroOjosX = rect.left + rect.width * (86 / 180);
        const centroOjosY = rect.top + rect.height * (36 / 200);
        const dx = e.clientX - centroOjosX;
        const dy = e.clientY - centroOjosY;
        const angulo = Math.atan2(dy, dx);
        const radio = Math.min(1.9, Math.hypot(dx, dy) / 70);

        moverPupilas(Math.cos(angulo) * radio, Math.sin(angulo) * radio);
    });

    // Saludo al hacer clic / toque directamente sobre la mascota
    const wrapperPinguino3d = document.getElementById("wrapper-pinguino-3d");
    if (wrapperPinguino3d) {
        wrapperPinguino3d.addEventListener("click", () => {
            activarSaludoPinguino(1800);
        });
    } else if (svgPinguinoBienvenida) {
        svgPinguinoBienvenida.addEventListener("click", () => {
            activarSaludoPinguino(1800);
        });
    }

    inputNombre.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    inputNombre.addEventListener("focus", () => {
        focoEnInputNombre = true;
        actualizarDialogoYMirada();
    });

    inputNombre.addEventListener("input", () => {
        focoEnInputNombre = true;
        actualizarDialogoYMirada();
        activarSaludoPinguino(1800);
    });

    inputNombre.addEventListener("blur", () => {
        focoEnInputNombre = false;
        if (inputNombre.value.trim().length === 0) {
            moverPupilas(0, 0);
        }
    });

    // Ingreso automático con tecla Enter en PC y botón Ir/Enter en teclados móviles
    inputNombre.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const btnIngresar = document.getElementById("btn-ingresar-app") || document.getElementById("btn-ingresar");
            if (btnIngresar) {
                btnIngresar.click();
            } else if (form) {
                form.requestSubmit();
            }
        }
    });

    // Manejar envío del formulario de ingreso
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = inputNombre.value.trim();
        if (!nombre) return;

        if (typeof guardarNombreExplorador === "function") {
            guardarNombreExplorador(nombre);
        }

        if (nombreDisplay) nombreDisplay.innerText = nombre;
        if (badgeExplorador) badgeExplorador.classList.remove("hidden");

        activarSaludoPinguino(1800);

        const svgPinguino = document.getElementById("svg-pinguino-bienvenida");
        const resplandorFuego = document.getElementById("resplandor-antorcha-fuego");
        const btnIngresar = document.getElementById("btn-ingresar-app");
        const txtBtn = document.getElementById("txt-btn-ingresar");

        // 1. Detener el baile, adoptar postura erguida, alzar la antorcha y encender el resplandor
        if (svgPinguino) {
            svgPinguino.classList.remove("pinguino-transicion-activa", "pinguino-alzado-antorcha");
            void svgPinguino.getBoundingClientRect();
            svgPinguino.classList.add("pinguino-transicion-activa", "pinguino-alzado-antorcha");
        }
        if (resplandorFuego) {
            resplandorFuego.classList.remove("resplandor-activo");
            void resplandorFuego.offsetWidth;
            resplandorFuego.classList.add("resplandor-activo");
        }
        if (btnIngresar) {
            btnIngresar.disabled = true;
            btnIngresar.classList.add("opacity-80", "cursor-wait");
        }
        if (txtBtn) {
            const esIngles = idiomaActual === "en";
            txtBtn.innerText = esIngles ? "Preparing Expedition..." : "Preparando Expedición...";
        }

        // 2. Permitir que el halo cálido ilumine la pantalla antes de disolver la bienvenida
        setTimeout(() => {
            pantalla.classList.add("opacity-0", "pointer-events-none");
            setTimeout(() => {
                pantalla.classList.add("hidden");
                pantalla.classList.remove("opacity-0", "pointer-events-none");
                if (svgPinguino) {
                    svgPinguino.classList.remove("pinguino-transicion-activa", "pinguino-alzado-antorcha", "antorcha-avivada");
                }
                if (resplandorFuego) {
                    resplandorFuego.classList.remove("resplandor-activo");
                }
                if (btnIngresar) {
                    btnIngresar.disabled = false;
                    btnIngresar.classList.remove("opacity-80", "cursor-wait");
                }
                if (txtBtn) {
                    const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
                    txtBtn.innerText = t.btn_ingresar || (idiomaActual === "en" ? "Enter the Expedition" : "Ingresar a la Expedición");
                }
            }, 700);
        }, 880);
    });

    // Navegación directa a pantalla de bienvenida al hacer clic en la píldora/botón de identidad
    function abrirPantallaBienvenidaParaEdicion() {
        const nombreActual = (typeof obtenerNombreExplorador === "function" ? obtenerNombreExplorador() : "") || (inputNombre ? inputNombre.value : "");
        if (inputNombre) {
            inputNombre.value = (nombreActual || "").trim();
        }
        pantalla.classList.remove("hidden", "opacity-0", "pointer-events-none");
        pantalla.classList.add("z-[9999]");
        actualizarBurbujaSaludoPinguino(inputNombre ? inputNombre.value : "");
        actualizarDialogoYMirada();
        activarSaludoPinguino(1600);
        setTimeout(() => {
            if (inputNombre) {
                inputNombre.focus();
                const len = inputNombre.value.length;
                if (typeof inputNombre.setSelectionRange === "function") {
                    inputNombre.setSelectionRange(len, len);
                }
            }
        }, 80);
    }
    window.abrirPantallaBienvenidaParaEdicion = abrirPantallaBienvenidaParaEdicion;

    if (badgeExplorador) {
        badgeExplorador.addEventListener("click", (e) => {
            e.stopPropagation();
            abrirPantallaBienvenidaParaEdicion();
        });
    }

    if (btnEditar && btnEditar !== badgeExplorador) {
        btnEditar.addEventListener("click", (e) => {
            e.stopPropagation();
            abrirPantallaBienvenidaParaEdicion();
        });
    }
}

// Configuración de geolocalización del explorador en tiempo real
function configurarGeolocalizacion() {
    const btnGeoloc = document.getElementById("btn-geolocalizacion");
    const iconoGeoloc = document.getElementById("icono-geoloc");
    if (!btnGeoloc) return;

    const iconoGeoBase = `<svg viewBox="0 0 24 24" class="icono-bitacora"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>`;
    const iconoGeoCarga = `<svg viewBox="0 0 24 24" class="icono-bitacora animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

    btnGeoloc.addEventListener("click", () => {
        const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;

        if (!navigator.geolocation) {
            alert(t.geoloc_no_soportada || "Geolocalización no soportada.");
            return;
        }

        if (iconoGeoloc) iconoGeoloc.innerHTML = iconoGeoCarga;
        btnGeoloc.classList.add("animate-pulse");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (iconoGeoloc) iconoGeoloc.innerHTML = iconoGeoBase;
                btnGeoloc.classList.remove("animate-pulse");

                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                if (!marcadorUsuario) {
                    const iconoPulsante = L.divIcon({
                        className: "marcador-posicion-usuario",
                        html: `
                            <div class="onda-posicion"></div>
                            <div class="punto-posicion-centro"></div>
                        `,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });

                    marcadorUsuario = L.marker([lat, lon], {
                        icon: iconoPulsante,
                        zIndexOffset: 1500
                    }).addTo(mapa);

                    marcadorUsuario.bindPopup(`
                        <div class="text-xs font-semibold text-slate-900">
                            ${t.geoloc_mi_posicion || "Tu posición actual"}
                        </div>
                    `);
                } else {
                    marcadorUsuario.setLatLng([lat, lon]);
                }

                mapa.flyTo([lat, lon], 13, { duration: 1.5 });
                marcadorUsuario.openPopup();

                // Sincronizar clima en vivo con las coordenadas GPS del explorador
                if (typeof window.actualizarClimaTerritorio === "function") {
                    window.actualizarClimaTerritorio("gps", {
                        lat,
                        lon,
                        nombre: t.geoloc_mi_posicion || (idiomaActual === "en" ? "My GPS position" : "Mi ubicación")
                    });
                }
            },
            (err) => {
                if (iconoGeoloc) iconoGeoloc.innerHTML = iconoGeoBase;
                btnGeoloc.classList.remove("animate-pulse");
                console.warn("Error de geolocalización:", err);
                const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
                alert(t.geoloc_error || "No se pudo obtener la ubicación actual.");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
}

// Módulo de Resiliencia Territorial: Modo Expedición Offline (PWA + LocalStorage Cache)
function actualizarBannerModoOffline() {
    const banner = document.getElementById("banner-modo-offline");
    const indicador = document.getElementById("indicador-estado-red");
    const txtEstado = document.getElementById("txt-estado-red");
    const btnGuardar = document.getElementById("btn-guardar-offline");
    if (!banner || !txtEstado || !indicador) return;

    const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
    const enLinea = navigator.onLine !== false;
    const tsOffline = typeof obtenerTimestampOffline === "function" ? obtenerTimestampOffline() : null;

    const txtMobile = document.getElementById("txt-estado-red-mobile");

    if (!enLinea) {
        banner.classList.add("modo-sin-conexion");
        indicador.className = "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0";
        txtEstado.innerText = t.estado_red_offline || "Sin Señal · Modo Expedición Offline Activo";
        if (txtMobile) txtMobile.innerText = idiomaActual === "en" ? "Offline" : "Sin Señal";
    } else if (tsOffline && listaHitos.length > 0) {
        banner.classList.remove("modo-sin-conexion");
        indicador.className = "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 shrink-0";
        txtEstado.innerText = `${t.estado_red_resguardado || "Expedición Lista Offline"} · ${listaHitos.length} ${idiomaActual === "en" ? "cards cached" : "fichas resguardadas"}`;
        if (txtMobile) txtMobile.innerText = idiomaActual === "en" ? "Offline Ready" : "Listo Offline";
    } else {
        banner.classList.remove("modo-sin-conexion");
        indicador.className = "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0";
        txtEstado.innerText = t.estado_red_sincronizado || "Atlas Sincronizado · Modo Offline Activo";
        if (txtMobile) txtMobile.innerText = idiomaActual === "en" ? "Offline Mode" : "Modo Offline";
    }

    if (btnGuardar) {
        const spanDesktop = document.getElementById("lbl-guardar-desktop") || btnGuardar.querySelector(".hidden.sm\\:inline");
        const spanMobile = document.getElementById("lbl-guardar-mobile") || btnGuardar.querySelector(".inline.sm\\:hidden");
        if (!btnGuardar.dataset.recienGuardado) {
            if (spanDesktop) spanDesktop.innerText = t.guardar_fichas_offline || "Guardar Fichas para Expedición";
            if (spanMobile) spanMobile.innerText = idiomaActual === "en" ? "Save" : "Guardar";
        }
    }
}

function configurarModoOffline() {
    const btnGuardar = document.getElementById("btn-guardar-offline");
    actualizarBannerModoOffline();

    window.addEventListener("online", () => {
        actualizarBannerModoOffline();
        anunciarAccesibilidad(idiomaActual === "en" ? "Network connection restored." : "Conexión restablecida.");
    });

    window.addEventListener("offline", () => {
        actualizarBannerModoOffline();
        const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
        anunciarAccesibilidad(t.estado_red_offline || "Sin Señal · Modo Expedición Offline Activo");
    });

    if (!btnGuardar) return;

    btnGuardar.addEventListener("click", async () => {
        const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
        let hitosParaGuardar = listaHitos;
        let areasParaGuardar = typeof obtenerAreasOffline === "function" ? obtenerAreasOffline() : null;
        let alertasParaGuardar = typeof obtenerAlertasOffline === "function" ? obtenerAlertasOffline() : null;

        try {
            if (!Array.isArray(hitosParaGuardar) || hitosParaGuardar.length === 0) {
                const respHitos = await fetch("./data/hitos.json");
                if (respHitos.ok) hitosParaGuardar = await respHitos.json();
            }
            if (!areasParaGuardar) {
                const respAreas = await fetch("./data/areas_protegidas.geojson");
                if (respAreas.ok) areasParaGuardar = await respAreas.json();
            }
            if (!alertasParaGuardar) {
                const respAlertas = await fetch("./data/alertas_turbales.geojson");
                if (respAlertas.ok) alertasParaGuardar = await respAlertas.json();
            }
            if ("caches" in window) {
                const cache = await caches.open("rastro-austral-v10");
                await cache.addAll([
                    "./",
                    "./index.html",
                    "./css/styles.css",
                    "./js/app.js",
                    "./js/storage.js",
                    "./data/hitos.json",
                    "./data/observatorio_real.json",
                    "./data/areas_protegidas.geojson",
                    "./data/alertas_turbales.geojson",
                    "./assets/logo-rastro-austral.jpeg"
                ]).catch(() => {});
            }
        } catch (err) {
            console.warn("Algunas fuentes remotas no respondieron; guardando copia local disponible.", err);
        }

        if (typeof guardarPaqueteOffline === "function") {
            guardarPaqueteOffline(hitosParaGuardar, areasParaGuardar, alertasParaGuardar);
        }
        if (typeof guardarObservatorioOffline === "function" && datosObservatorio) {
            guardarObservatorioOffline(datosObservatorio);
        }

        const spanDesktop = document.getElementById("lbl-guardar-desktop") || btnGuardar.querySelector(".hidden.sm\\:inline");
        const spanMobile = document.getElementById("lbl-guardar-mobile") || btnGuardar.querySelector(".inline.sm\\:hidden");
        btnGuardar.dataset.recienGuardado = "1";
        if (spanDesktop) {
            spanDesktop.innerText = t.fichas_resguardadas || "✓ Fichas Resguardadas";
        }
        if (spanMobile) {
            spanMobile.innerText = "✓ Guardado";
        }
        btnGuardar.classList.add("!text-emerald-400", "!border-emerald-500/50");
        actualizarBannerModoOffline();

        anunciarAccesibilidad(
            idiomaActual === "en"
                ? `${hitosParaGuardar.length} territorial site cards saved for offline expedition.`
                : `${hitosParaGuardar.length} fichas territoriales guardadas para expedición sin conexión.`
        );

        setTimeout(() => {
            delete btnGuardar.dataset.recienGuardado;
            btnGuardar.classList.remove("!text-emerald-400", "!border-emerald-500/50");
            if (spanDesktop) {
                spanDesktop.innerText = (DICCIONARIO[idiomaActual] || DICCIONARIO.es).guardar_fichas_offline || "Guardar Fichas para Expedición";
            }
            if (spanMobile) {
                spanMobile.innerText = idiomaActual === "en" ? "Save" : "Guardar";
            }
        }, 2600);
    });
}
