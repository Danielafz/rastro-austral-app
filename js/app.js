// ==========================================
// RASTRO AUSTRAL - CONTROLADOR DEL MAPA E INTERACCIÓN
// ==========================================

let mapa;
let capaMarcadores;
let capaHuellas;
let capaBaseEstandar;
let capaBaseRelieve;
let capaBaseActiva = "estandar";
let listaHitos = [];
let datosHitos = {};
let filtroActivo = "todos";
let filtroFragilidad = "todas";
let filtroEstadoVisita = "todos";
let busquedaActiva = "";
let hitoSeleccionadoId = null;
let marcadoresPorId = {};
let marcadorUsuario = null;
let idiomaActual = localStorage.getItem("rastro_austral_idioma") || "es";

// Anunciador para lectores de pantalla (NVDA, TalkBack, VoiceOver) vía aria-live
function anunciarAccesibilidad(mensaje) {
    const anunciador = document.getElementById("anunciador-accesible");
    if (!anunciador || !mensaje) return;
    anunciador.textContent = "";
    setTimeout(() => {
        anunciador.textContent = mensaje;
    }, 40);
}

// Colores según la categoría oficial
const COLORES_CATEGORIA = {
    patrimonio: "#f59e0b",       // Ámbar
    senderos: "#10b981",         // Esmeralda
    economia_creativa: "#8b5cf6" // Violeta
};

// Vistas territoriales predefinidas
const VISTAS_TERRITORIO = {
    provincia: { centro: [-54.35, -67.8], zoom: 8 },
    ushuaia: { centro: [-54.8019, -68.3030], zoom: 12 },
    tolhuin: { centro: [-54.5100, -67.1950], zoom: 12 },
    rio_grande: { centro: [-53.7877, -67.7003], zoom: 12 }
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
        tab_explorador: "Hitos",
        tab_pasaporte: "Bitácora",
        tab_observatorio: "Observatorio Climático",
        btn_volver_mapa: "Volver al Mapa",
        sitios_en_rastro: "Sitios en mi Rastro:",
        descargar_bitacora: "Descargar Bitácora",
        vista_provincia: "Toda la Provincia",
        capa_estandar: "Estándar",
        capa_relieve: "Relieve",
        capa_areas_protegidas: "Áreas Protegidas",
        capa_alertas_sar: "Alertas SAR",
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
        creditos_fuentes_desc: "Los datos geoespaciales y toponímicos provienen de la Infraestructura de Datos Espaciales de Tierra del Fuego (IDETDF), el Instituto Geográfico Nacional (IGN) y el Centro Austral de Investigaciones Científicas (CADIC-CONICET).",
        creditos_privacidad_titulo: "Privacidad Soberana (Ley 25.326)",
        creditos_privacidad_desc: "Esta aplicación no recopila telemetría, identificadores ni geolocalización en servidores remotos. Todas las visitas marcadas, huellas y notas de campo quedan almacenadas de manera 100% local en este navegador mediante localStorage.",
        creditos_licencia_titulo: "Licencias Abiertas",
        creditos_licencia_desc: "Código fuente distribuido bajo licencia permisiva MIT. Cartografía y datos de base bajo licencias OpenStreetMap (ODbL) y contenidos educativos Creative Commons CC BY-SA 4.0.",
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
        obs_intro: "Proyecciones territoriales basadas en series históricas regionales y monitoreo ecosistémico (CADIC-CONICET / IDETDF).",
        obs_en_simple: "En palabras simples:",
        obs_m1_titulo: "Los Turbales: La gran esponja fueguina",
        obs_m1_sub: "¿Cuántos días al año se queda sin agua el suelo?",
        obs_m1_badge: "+89% días secos",
        obs_m1_simple: "La turba es como una esponja gigante que guarda agua y atrapa carbono. Al secarse por el calor, se agrieta y deja de protegernos.",
        obs_m1_alerta_lbl: "Nivel de alerta:",
        obs_m1_alerta_val: "Moderado a Crítico",
        obs_m1_ver: "Ver turbal en mapa →",
        obs_m2_titulo: "Glaciar Vinciguerra: El tanque de agua natural",
        obs_m2_sub: "Hielo que nos queda para beber y abastecer a la ciudad",
        obs_m2_simple: "Por el aumento de temperatura, para el año 2030 el glaciar habrá perdido 1 de cada 4 partes de su masa congelada.",
        obs_m2_alerta_lbl: "Fuente:",
        obs_m2_alerta_val: "Agua potable de Ushuaia",
        obs_m2_ver: "Ver glaciar en mapa →"
    },
    en: {
        subtitulo: "Atlas & Territorial Exploration Journal",
        tab_explorador: "Sites",
        tab_pasaporte: "Logbook",
        tab_observatorio: "Climate Observatory",
        btn_volver_mapa: "Back to Map",
        sitios_en_rastro: "Sites in my Trail:",
        descargar_bitacora: "Download Journal",
        vista_provincia: "Whole Province",
        capa_estandar: "Standard",
        capa_relieve: "Topographic",
        capa_areas_protegidas: "Protected Areas",
        capa_alertas_sar: "SAR Alerts",
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
        creditos_fuentes_desc: "Geospatial and toponymic data originate from the Spatial Data Infrastructure of Tierra del Fuego (IDETDF), National Geographic Institute (IGN), and Austral Scientific Research Center (CADIC-CONICET).",
        creditos_privacidad_titulo: "Sovereign Privacy (Law 25.326)",
        creditos_privacidad_desc: "This app collects no telemetry, trackers, or geolocation on remote servers. All marked visits, footsteps, and field notes are stored 100% locally on this device via localStorage.",
        creditos_licencia_titulo: "Open Licenses",
        creditos_licencia_desc: "Source code released under the MIT License. Base map data under OpenStreetMap (ODbL) and educational contents under Creative Commons CC BY-SA 4.0.",
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
        obs_intro: "Territorial projections built on regional climate series and ecosystem monitoring (CADIC-CONICET / IDETDF).",
        obs_en_simple: "In simple words:",
        obs_m1_titulo: "Peatlands: Tierra del Fuego's giant sponge",
        obs_m1_sub: "How many days a year does the soil run dry?",
        obs_m1_badge: "+89% dry days",
        obs_m1_simple: "Peat acts like a giant sponge that stores freshwater and traps carbon. As heat dries it out, it cracks and stops protecting us.",
        obs_m1_alerta_lbl: "Alert level:",
        obs_m1_alerta_val: "Moderate to Critical",
        obs_m1_ver: "View peatland on map →",
        obs_m2_titulo: "Vinciguerra Glacier: Natural freshwater tank",
        obs_m2_sub: "Ice left to supply clean drinking water to the city",
        obs_m2_simple: "Because of rising temperatures, by 2030 the glacier will have lost 1 out of every 4 parts of its frozen mass.",
        obs_m2_alerta_lbl: "Source:",
        obs_m2_alerta_val: "Ushuaia drinking water",
        obs_m2_ver: "View glacier on map →"
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
    configurarConmutadorTema();
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
    actualizarTextosUI();
});

// 1. Inicializar Leaflet centrado en la Isla Grande de Tierra del Fuego
function inicializarMapa() {
    mapa = L.map("map", {
        zoomControl: false
    }).setView([-54.35, -67.8], 8);

    // Control de zoom
    L.control.zoom({ position: "bottomleft" }).addTo(mapa);

    // Cartografía base estándar abierta de OpenStreetMap
    capaBaseEstandar = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, IDETDF, IGN',
        maxZoom: 18,
        minZoom: 6
    });

    // Cartografía base de relieve / topográfica de OpenTopoMap
    capaBaseRelieve = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, SRTM | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
        maxZoom: 17,
        minZoom: 6
    });

    // Agregar capa base activa
    capaBaseEstandar.addTo(mapa);

    window.addEventListener("resize", () => {
        if (mapa) mapa.invalidateSize();
    });
    setTimeout(() => {
        if (mapa) mapa.invalidateSize();
    }, 200);

    // Capa de ruta ("Mi Rastro en el Mapa") compuesta exclusivamente por huellas debajo de los marcadores
    capaHuellas = L.layerGroup().addTo(mapa);
    capaMarcadores = L.layerGroup().addTo(mapa);

    // Ajustar densidad y escala de huellas al cambiar el nivel de zoom
    mapa.on("zoomend", actualizarTrazadoRuta);
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

    document.getElementById("contador-total").innerText = listaHitos.length;
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

// 4. Dibujar marcadores dinámicos según visitas, filtros y búsqueda activa
function renderizarMarcadores(anunciarResultados = false) {
    capaMarcadores.clearLayers();
    marcadoresPorId = {};
    const visitas = obtenerVisitas();
    const t = DICCIONARIO[idiomaActual];

    const q = busquedaActiva.toLowerCase().trim();
    const hitosFiltrados = listaHitos.filter(hito => {
        const cumpleCategoria = filtroActivo === "todos" || hito.categoria === filtroActivo;
        if (!cumpleCategoria) return false;

        const cumpleFragilidad = filtroFragilidad === "todas" || hito.fragilidad === filtroFragilidad;
        if (!cumpleFragilidad) return false;

        const visitado = visitas.includes(hito.id);
        if (filtroEstadoVisita === "visitados" && !visitado) return false;
        if (filtroEstadoVisita === "pendientes" && visitado) return false;

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

        const icono = L.divIcon({
            className: `marcador-hito cursor-pointer ${seleccionado ? 'marcador-seleccionado' : ''}`,
            html: `
        <div class="relative flex items-center justify-center transform hover:scale-125 transition-all duration-200 ${seleccionado ? 'scale-125' : ''}" style="width: 32px; height: 38px;">
          <!-- Pin del Mapa (Globo portador con fondo interior blanco) -->
          <svg class="absolute drop-shadow-md" width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 26.5 16 38 16 38C16 38 32 26.5 32 16C32 7.16 24.84 0 16 0Z" fill="${colorPin}" />
            <path d="M16 2.5C8.54 2.5 2.5 8.54 2.5 16C2.5 24.5 16 33.5 16 33.5C16 33.5 29.5 24.5 29.5 16C29.5 8.54 23.46 2.5 16 2.5Z" fill="#ffffff" />
          </svg>
          
          <!-- Ilustración del Pingüino -->
          <svg class="absolute z-10" width="18" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="top: 6px;">
            <!-- Cuerpo y Cabeza (Negro con trazo de contraste) -->
            <path d="M12 2C8 2 5 6 5 12C5 17 8 21 12 21C16 21 19 17 19 12C19 6 16 2 12 2Z" fill="#0f172a" stroke="#334155" stroke-width="0.5"/>
            <!-- Panza (Blanca) -->
            <path d="M12 7C9.5 7 7.5 9.5 7.5 13.5C7.5 16.5 9.5 19 12 19C14.5 19 16.5 16.5 16.5 13.5C16.5 9.5 14.5 7 12 7Z" fill="#ffffff"/>
            <!-- Ojos (Blanco y Negro) -->
            <circle cx="10" cy="6.5" r="1.5" fill="#ffffff"/>
            <circle cx="10" cy="6.5" r="0.75" fill="#000000"/>
            <circle cx="14" cy="6.5" r="1.5" fill="#ffffff"/>
            <circle cx="14" cy="6.5" r="0.75" fill="#000000"/>
            <!-- Pico (Naranja) -->
            <polygon points="12,7.5 10.5,9.5 13.5,9.5" fill="#f97316"/>
            <!-- Alitas laterales (Negro) -->
            <path d="M4.5 10C4 11.5 4 14.5 5 16C5.5 15 5.5 11.5 5 10" fill="#0f172a"/>
            <path d="M19.5 10C20 11.5 20 14.5 19 16C18.5 15 18.5 11.5 19 10" fill="#0f172a" stroke="#334155" stroke-width="0.4"/>
            <!-- Patitas (Naranja) -->
            <ellipse cx="9.5" cy="20.5" rx="1.8" ry="1" fill="#f97316"/>
            <ellipse cx="14.5" cy="20.5" rx="1.8" ry="1" fill="#f97316"/>
          </svg>

          <!-- Pequeño check vibrante si ya está visitado -->
          ${visitado ? `
            <div class="absolute z-20 -top-1 -right-1 bg-emerald-500 text-white rounded-full flex items-center justify-center border border-slate-900 animate-bounce" style="width: 12px; height: 12px; font-size: 8px; font-weight: bold;">
              ✓
            </div>
          ` : ''}
        </div>
      `,
            iconSize: [32, 38],
            iconAnchor: [16, 38]
        });

        const descripcionAlt = `${nombre}, ${hito.localidad}, ${visitado ? (idiomaActual === 'en' ? 'recorded' : 'registrado') : (idiomaActual === 'en' ? 'to explore' : 'por explorar')}`;
        const marcador = L.marker(hito.coordenadas, {
            icon: icono,
            title: nombre,
            alt: descripcionAlt,
            keyboard: true
        });

        // Popup rápido de Leaflet con alto contraste y jerarquía legible
        const rubroPopup = (idiomaActual === "en" && hito.rubroCreativo_en) ? hito.rubroCreativo_en : hito.rubroCreativo;
        marcador.bindPopup(`
          <div class="p-1 space-y-1.5">
            ${hito.selloIdentidad ? `
              <div class="popup-badge-sello">
                <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z"/>
                </svg>
                <span>${t.sello_identidad_fueguina}</span>
              </div>
            ` : ''}
            <h4 class="font-bold text-sm text-slate-900 leading-tight">${nombre}</h4>
            <p class="popup-toponimia font-mono">${t.toponimia} ${hito.toponimia}</p>
            ${rubroPopup ? `<p class="popup-rubro">${rubroPopup}</p>` : ''}
            <div class="popup-subtexto pt-1 border-t border-slate-200">
              ${hito.localidad} · <span class="capitalize">${hito.categoria.replace('_', ' ')}</span>
            </div>
            <button type="button" class="btn-popup-ver-detalle w-full mt-1.5 py-1 px-2 text-center bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer" data-id="${hito.id}">
              ${idiomaActual === "en" ? "View Full Site Info" : "Ver Ficha Completa"} →
            </button>
          </div>
        `, {
            offset: [0, -32],
            className: "popup-hito"
        });

        // Evento clic: centrado suave y apertura de ficha inmersiva
        marcador.on("click", () => {
            abrirDetalleHito(hito.id);
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

    // Renderizar lista compacta estilo Google Maps en el panel inferior
    renderizarListaHitosCompacta(hitosFiltrados);

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

// 5. Seleccionar un hito, centrar el mapa suavemente y desplegar su información
function seleccionarHito(hito, volar = true, abrirPopup = false, abrirPantallaCompleta = false) {
    hitoSeleccionadoId = hito.id;

    if (volar && mapa) {
        mapa.flyTo(hito.coordenadas, 12, {
            animate: true,
            duration: 1.2
        });
    }

    const marcador = marcadoresPorId[hito.id];
    if (marcador && abrirPopup) {
        marcador.openPopup();
    }

    mostrarDetalleHito(hito);
    renderizarInsignias();
    renderizarSellosSidebar();

    // Resaltar tarjeta seleccionada en la lista compacta
    document.querySelectorAll(".hito-card").forEach(card => {
        if (card.getAttribute("data-id") === hito.id) {
            card.classList.add("border-orange-500", "ring-1", "ring-orange-500");
        } else {
            card.classList.remove("border-orange-500", "ring-1", "ring-orange-500");
        }
    });

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

// Renderizar lista compacta de hitos (Estilo Google Maps)
function renderizarListaHitosCompacta(hitos) {
    const contenedor = document.getElementById("contenedor-hitos-lista");
    if (!contenedor) return;

    if (!hitos || hitos.length === 0) {
        contenedor.innerHTML = `
          <div class="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs">
            ${idiomaActual === "en" ? "No sites found with these filters." : "No se encontraron hitos con estos filtros."}
          </div>
        `;
        return;
    }

    const visitas = typeof obtenerVisitas === "function" ? obtenerVisitas() : [];
    const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;

    contenedor.innerHTML = hitos.map(hito => {
        const nombre = (idiomaActual === "en" && hito.nombre_en) ? hito.nombre_en : hito.nombre;
        const rubro = (idiomaActual === "en" && hito.rubroCreativo_en) ? hito.rubroCreativo_en : (hito.rubroCreativo || hito.categoria.replace('_', ' '));
        const visitado = visitas.includes(hito.id);
        const seleccionado = hitoSeleccionadoId === hito.id;

        return `
        <!-- Tarjeta de Hito Compacta (Lista) -->
        <div class="hito-card flex items-center p-3 mb-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border ${seleccionado ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-100 dark:border-slate-800'} cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors" data-id="${hito.id}">
          <!-- Miniatura cuadrada -->
          <img src="${hito.imagen || './icon.svg'}" alt="${nombre}" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-slate-800">
          
          <!-- Info rápida -->
          <div class="ml-3 flex-grow overflow-hidden">
            <div class="flex items-center gap-1.5">
              <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">${nombre}</h3>
              ${visitado ? '<span class="text-emerald-500 text-xs shrink-0 font-bold" title="Visitado">✓</span>' : ''}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">${t.toponimia || 'Toponimia:'} ${hito.toponimia}</p>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] px-2 py-0.5 rounded font-bold capitalize">${rubro}</span>
              <span class="text-[10px] text-slate-400 dark:text-slate-500">${hito.localidad}</span>
            </div>
          </div>
          
          <!-- Flecha indicadora -->
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </div>
        `;
    }).join("");

    contenedor.querySelectorAll(".hito-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            abrirDetalleHito(id);
        });
    });
}

// Función Maestra para abrir el detalle inmersivo (Ficha Completa)
function abrirDetalleHito(id) {
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

        const marcador = marcadoresPorId[data.id];
        if (marcador) {
            marcador.openPopup();
        }

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
        if (etiEl) etiEl.innerHTML = `<span class="bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs px-2 py-0.5 rounded font-bold uppercase">${categoriaTexto}</span>`;

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
    <div class="tarjeta-detalle-hito rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
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
            <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${nombre}</h3>
            <p class="text-xs text-amber-700 dark:text-amber-300/90 font-mono">${t.toponimia} ${hito.toponimia}</p>
          </div>

          <!-- Botones de acción (Narrar relato accesible y Compartir) -->
          <div class="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
            <button id="btn-copiar-ficha" type="button"
                    class="btn-accion-icono w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition shadow-sm"
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
                  class="btn-narracion-accesible flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="${idiomaActual === 'en' ? 'Listen to description and conservation recommendations for this site' : 'Escuchar descripción y recomendaciones de conservación de este hito'}">
            <svg class="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            <span id="texto-narrar-hito">${t.audio_escuchar}</span>
          </button>
          ${fonetica ? `
            <button id="btn-fonetica-hito" type="button"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
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
              <span class="font-bold text-amber-700 dark:text-amber-300">${t.fonetica_titulo} · ${fonetica.termino}</span>
              <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] font-bold">${fonetica.lengua}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300 leading-snug">
              <span class="font-mono text-amber-700 dark:text-amber-300">${fonetica.silabas}</span> — ${foneticaSignificado}
            </p>
          </div>
        ` : ''}

        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-2.5">
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
                  class="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2 ${esVisitado
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 active:scale-95 text-white'
            }">
            <span>${esVisitado ? t.btn_quitar : t.btn_marcar}</span>
          </button>
          <button id="btn-ir-al-mapa-desde-ficha" type="button"
                  class="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
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
           class="badge-stamp flex-shrink-0 flex flex-col items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
             seleccionado ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/20 shadow-md scale-105' : ''
           } ${desbloqueado
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 dark:text-amber-300 desbloqueado'
                : 'bg-slate-100 dark:bg-slate-800/90 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bloqueado'
            }" style="min-width: 78px;">
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
    const total = listaHitos.length || 1;
    const porcentaje = Math.round((visitas.length / total) * 100);

    const elVisitas = document.getElementById("contador-visitas");
    const elBarra = document.getElementById("barra-progreso");
    const elPorcentaje = document.getElementById("porcentaje-progreso");

    if (elVisitas) elVisitas.innerText = visitas.length;
    if (elBarra) elBarra.style.width = `${porcentaje}%`;
    if (elPorcentaje) elPorcentaje.innerText = `${porcentaje}%`;

    actualizarHuellaConsciente();
    actualizarMetricasDistancia();
    actualizarBadgeSellos();
}

// 9. Filtros por capas
function configurarFiltros() {
    const botones = document.querySelectorAll(".btn-filtro, .filtro-cat-btn");
    const claseActiva = "filtro-cat-btn btn-cat-activo shrink-0 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition shadow-sm";
    const claseInactiva = "filtro-cat-btn shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition";

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            botones.forEach(b => {
                b.className = claseInactiva;
            });
            btn.className = claseActiva;

            let cat = btn.getAttribute("data-cat");
            if (cat === "todas") cat = "todos";
            filtroActivo = cat;
            renderizarMarcadores(true);
            actualizarTrazadoRuta();
        });
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

// 11. Optimización responsive: Bottom Sheet deslizable para dispositivos móviles
function configurarPanelMobile() {
    const panel = document.getElementById("panel-lateral");
    const dragHandle = document.getElementById("bottom-sheet-drag-handle");
    const btnCerrar = document.getElementById("btn-cerrar-panel-mobile");

    if (!panel) return;

    function alternarBottomSheet() {
        if (panel.classList.contains("expandido")) {
            cerrarPanelMobile();
        } else {
            abrirPanelMobile();
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
                abrirPanelMobile();
            } else if (deltaY > 24) {
                cerrarPanelMobile();
            }
        }, { passive: true });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener("click", cerrarPanelMobile);
    }
}

function abrirPanelMobile() {
    const panel = document.getElementById("panel-lateral");
    if (!panel) return;
    panel.classList.add("expandido");
}

function cerrarPanelMobile() {
    const panel = document.getElementById("panel-lateral");
    if (!panel) return;
    panel.classList.remove("expandido");
}

// 12. Selector rápido de localidades y visión provincial
function configurarSelectorLocalidades() {
    const botones = document.querySelectorAll(".btn-vista");
    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            const vista = btn.getAttribute("data-vista");
            const configVista = VISTAS_TERRITORIO[vista];

            if (configVista && mapa) {
                mapa.flyTo(configVista.centro, configVista.zoom, {
                    animate: true,
                    duration: 1.2
                });
            }

            // Al seleccionar "Toda la Provincia", recalcular trazado de ruta
            if (vista === "provincia") {
                actualizarTrazadoRuta();
            }

            botones.forEach(b => {
                b.classList.remove("active", "bg-amber-600", "text-white", "font-semibold");
                b.classList.add("text-slate-300", "font-medium");
            });

            btn.classList.add("active", "bg-amber-600", "text-white", "font-semibold");
            btn.classList.remove("text-slate-300", "font-medium");
        });
    });
}

// 12.1. Selector de Capas Base Cartográficas (Estándar / Relieve)
function configurarSelectorCapasBase() {
    const btnEstandar = document.getElementById("btn-capa-estandar");
    const btnRelieve = document.getElementById("btn-capa-relieve");

    if (!btnEstandar || !btnRelieve) return;

    btnEstandar.addEventListener("click", () => {
        if (capaBaseActiva === "estandar") return;
        if (mapa.hasLayer(capaBaseRelieve)) mapa.removeLayer(capaBaseRelieve);
        if (!mapa.hasLayer(capaBaseEstandar)) mapa.addLayer(capaBaseEstandar);
        capaBaseEstandar.bringToBack();
        capaBaseActiva = "estandar";

        btnEstandar.className = "btn-capa-base active bg-amber-600 text-white font-semibold px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap";
        btnRelieve.className = "btn-capa-base text-slate-300 font-medium px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap";
    });

    btnRelieve.addEventListener("click", () => {
        if (capaBaseActiva === "relieve") return;
        if (mapa.hasLayer(capaBaseEstandar)) mapa.removeLayer(capaBaseEstandar);
        if (!mapa.hasLayer(capaBaseRelieve)) mapa.addLayer(capaBaseRelieve);
        capaBaseRelieve.bringToBack();
        capaBaseActiva = "relieve";

        btnRelieve.className = "btn-capa-base active bg-amber-600 text-white font-semibold px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap";
        btnEstandar.className = "btn-capa-base text-slate-300 font-medium px-3 py-1.5 transition flex items-center gap-1 whitespace-nowrap";
    });
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

                btn.className = "btn-capa-areas active px-3 py-1.5 transition bg-emerald-600 text-white font-semibold flex items-center gap-1 whitespace-nowrap";
            } else {
                mapa.removeLayer(capaAreasProtegidas);
                btn.className = "btn-capa-areas px-3 py-1.5 transition text-emerald-400 hover:bg-emerald-500/20 font-medium flex items-center gap-1 whitespace-nowrap";
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
                    <div class="text-xs font-semibold flex items-center gap-1.5 ${esCritico ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400'}">
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
                    btn.className = "btn-capa-alertas active bg-rose-600 text-white font-semibold px-3 py-1.5 transition flex items-center gap-1.5 whitespace-nowrap";
                } else {
                    mapa.removeLayer(capaAlertasSAR);
                    btn.className = "btn-capa-alertas text-rose-400 hover:bg-rose-500/20 font-medium px-3 py-1.5 transition flex items-center gap-1.5 whitespace-nowrap";
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

    anunciarAccesibilidad(nuevoIdioma === "en" ? "Language switched to English." : "Idioma cambiado a español.");
}

function actualizarTextosUI() {
    const t = DICCIONARIO[idiomaActual];
    if (!t) return;

    // Actualizar elementos con data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const clave = el.getAttribute("data-i18n");
        const texto = t[clave];
        if (!texto) return;

        // Mantener el título en negrita en los principios de Huella Consciente
        if (clave.startsWith("principio_") && texto.includes(":")) {
            const sepIdx = texto.indexOf(":");
            const strongEl = document.createElement("strong");
            strongEl.className = "text-slate-900 dark:text-slate-100";
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
            btnBienvenidaEn.className = "px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";
        } else {
            btnBienvenidaEs.className = "px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition";
            btnBienvenidaEn.className = "px-2 py-0.5 rounded-lg font-bold transition bg-amber-600 text-white";
        }
    }

    const btnTemaHeader = document.getElementById("btn-toggle-tema");
    const btnTemaBienvenida = document.getElementById("btn-tema-bienvenida");
    const esOscuro = document.documentElement.classList.contains("dark");
    const textoTema = esOscuro ? (t.tema_modo_claro || "Cambiar a Modo Claro") : (t.tema_modo_oscuro || "Cambiar a Modo Oscuro");
    if (btnTemaHeader) btnTemaHeader.setAttribute("title", textoTema);
    if (btnTemaBienvenida) btnTemaBienvenida.setAttribute("title", textoTema);

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

    select.addEventListener("change", (e) => {
        filtroFragilidad = e.target.value;
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
    const claseInactiva = "tab-btn tab-sidebar-btn flex items-center justify-center gap-1 py-2 px-1.5 text-[11px] font-semibold rounded-lg transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer";

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
            : "px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 leading-none";
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

    // Regresar a la vista de Hitos en #panel-lateral
    cambiarPestanaSidebar("explorar");
}
window.cerrarTodasLasVistas = cerrarTodasLasVistas;

let chartEstresTurbales = null;
let chartRetrocesoGlaciar = null;
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
        labels: ["2015", "2018", "2021", "2024", "2027 (Futuro)", "2030 (Futuro)"],
        turbales: {
            dias_estres: [5, 6, 8, 9, 8, 9],
            variacion_pct: "+80%"
        },
        glaciar: {
            masa_remanente_pct: [100.0, 96.8, 93.6, 90.4, 87.2, 84.0],
            variacion_pct: "-16%"
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

function renderizarGraficosObservatorio() {
    if (typeof window.Chart !== "function") return;

    const canvasTurbales = document.getElementById("chart-turbales");
    const canvasGlaciar = document.getElementById("chart-glaciar");
    if (!canvasTurbales || !canvasGlaciar) return;

    const esOscuro = document.documentElement.classList.contains("dark");
    const colorTexto = esOscuro ? "#cbd5e1" : "#334155";
    const colorGrilla = esOscuro ? "rgba(148, 163, 184, 0.14)" : "rgba(100, 116, 139, 0.15)";
    const esIngles = idiomaActual === "en";

    const dataReal = obtenerDatosObservatorioActivos();
    const anios = (dataReal.labels || []).map(lbl => {
        if (!esIngles) return lbl.replace("(Futuro)", "(est.)");
        return lbl.replace("(Futuro)", "(proj.)");
    });
    const diasEstres = dataReal.turbales.dias_estres;
    const masaGlaciar = dataReal.glaciar.masa_remanente_pct;
    const maxDias = Math.max(...diasEstres, 10);

    if (chartEstresTurbales) {
        chartEstresTurbales.destroy();
        chartEstresTurbales = null;
    }
    if (chartRetrocesoGlaciar) {
        chartRetrocesoGlaciar.destroy();
        chartRetrocesoGlaciar = null;
    }

    // Gráfico 1: Barras amigables de días secos por año en la gran esponja (datos reales IANIGLA / NASA POWER)
    chartEstresTurbales = new window.Chart(canvasTurbales.getContext("2d"), {
        type: "bar",
        data: {
            labels: anios,
            datasets: [{
                label: esIngles ? "Dry days per year" : "Días secos al año",
                data: diasEstres,
                backgroundColor: [
                    "rgba(251, 191, 36, 0.72)",
                    "rgba(251, 191, 36, 0.80)",
                    "rgba(245, 158, 11, 0.85)",
                    "rgba(245, 158, 11, 0.92)",
                    "rgba(234, 88, 12, 0.85)",
                    "rgba(220, 38, 38, 0.88)"
                ],
                borderColor: "#d97706",
                borderWidth: 1,
                borderRadius: 6,
                maxBarThickness: 32
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => esIngles
                            ? ` ${ctx.parsed.y} dry days without water`
                            : ` ${ctx.parsed.y} días sin agua al año`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: colorTexto, font: { size: 10, weight: "600" } },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: maxDias + 3,
                    ticks: {
                        color: colorTexto,
                        font: { size: 10 },
                        stepSize: 2,
                        callback: (v) => esIngles ? `${v} d` : `${v} días`
                    },
                    grid: { color: colorGrilla }
                }
            }
        }
    });

    // Gráfico 2: Tanque de agua natural (datos reales IANIGLA-CONICET / WGMS ID 3514)
    chartRetrocesoGlaciar = new window.Chart(canvasGlaciar.getContext("2d"), {
        type: "bar",
        data: {
            labels: anios,
            datasets: [{
                label: esIngles ? "Ice left (%)" : "Hielo que nos queda (%)",
                data: masaGlaciar,
                backgroundColor: [
                    "rgba(6, 182, 212, 0.90)",
                    "rgba(6, 182, 212, 0.84)",
                    "rgba(14, 165, 233, 0.78)",
                    "rgba(14, 165, 233, 0.72)",
                    "rgba(56, 189, 248, 0.65)",
                    "rgba(56, 189, 248, 0.55)"
                ],
                borderColor: "#0284c7",
                borderWidth: 1,
                borderRadius: 6,
                maxBarThickness: 32
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => esIngles
                            ? ` ${ctx.parsed.y}% of 2015 glacier tank left`
                            : ` Queda ${ctx.parsed.y}% del hielo de 2015`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: colorTexto, font: { size: 10, weight: "600" } },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    max: 105,
                    ticks: {
                        color: colorTexto,
                        font: { size: 10 },
                        callback: (v) => `${v}%`
                    },
                    grid: { color: colorGrilla }
                }
            }
        }
    });
}

// Helper global para centrar el mapa desde accesos directos del Observatorio
function centrarEnSitio(clave) {
    if (!Array.isArray(listaHitos) || listaHitos.length === 0) return;

    const aliasMap = {
        "laguna-esmeralda": ["ush-04", "tol-02", "laguna esmeralda"],
        "glaciar-vinciguerra": ["ush-02", "vinciguerra"]
    };
    const terminos = aliasMap[clave] || [String(clave || "").toLowerCase()];

    let hito = null;
    for (const term of terminos) {
        hito = listaHitos.find(h =>
            h.id.toLowerCase() === term ||
            (h.nombre && h.nombre.toLowerCase().includes(term))
        );
        if (hito) break;
    }

    if (hito) {
        seleccionarHito(hito, true, true);
    }
}
window.centrarEnSitio = centrarEnSitio;

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
                ? `Austral Climate Observatory with real IANIGLA and NASA POWER data. First: Peatlands are Tierra del Fuego's giant sponge. Dry days rose from ${dIni} in 2015 to ${dFin} days per year projected by 2030 (${dataReal.turbales.variacion_pct}). Second: Vinciguerra Glacier is Ushuaia's natural freshwater tank, projected to keep ${mFin} percent of its 2015 ice mass by 2030 (${varGlaciar}).`
                : `Observatorio Climático Austral con datos reales de IANIGLA y NASA POWER. Primero: Los turbales son la gran esponja fueguina; los días secos pasan de ${dIni} en 2015 a ${dFin} por año hacia 2030 (${dataReal.turbales.variacion_pct}). Segundo: El Glaciar Vinciguerra es el tanque de agua natural de Ushuaia y conservaría el ${mFin} por ciento de su masa congelada en 2030 (${varGlaciar} respecto a 2015).`;

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
}

function actualizarBadgeSellos() {
    const elBadge = document.getElementById("tab-badge-sellos");
    if (elBadge) {
        const visitas = obtenerVisitas();
        elBadge.innerText = `${visitas.length}/${listaHitos.length || 16}`;
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
                 class="badge-stamp p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[105px] ${
                    seleccionado ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/20' : ''
                 } ${desbloqueado
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300 desbloqueado shadow-sm'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700 bloqueado'
                 }">
                <div class="w-8 h-8 flex items-center justify-center my-0.5">${obtenerIconoSello(hito, desbloqueado)}</div>
                <div class="w-full">
                    <span class="text-[9px] font-bold uppercase tracking-wider block truncate" style="color: ${color};">
                        ${hito.localidad}
                    </span>
                    <h5 class="text-[11px] font-bold line-clamp-2 leading-tight text-slate-800 dark:text-slate-200 mt-0.5" title="${nombre}">
                        ${nombre}
                    </h5>
                </div>
                <span class="text-[9px] font-semibold mt-1 ${desbloqueado ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}">
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
                 class="tarjeta-pasaporte-item tarjeta-pasaporte flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer min-h-[96px] pb-3 ${
                     visitado ? 'border-amber-500/50 hover:border-amber-400' : 'border-slate-800 opacity-75'
                 } relative overflow-hidden group shadow-lg">
                
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
                        <h4 class="text-xs font-bold leading-snug line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-amber-500 dark:group-hover:text-amber-300 pb-1 mt-1 break-words transition-colors" title="${nombre}">
                            ${nombre}
                        </h4>
                        <p class="text-[11px] text-amber-500 dark:text-amber-300/80 font-mono">${t.toponimia} ${hito.toponimia}</p>
                    </div>

                    <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                        <span class="flex items-center gap-1.5">
                            ${obtenerIconoFragilidadHoja("w-3.5 h-3.5")}
                            <span>${t.fragilidad}</span>
                        </span>
                        <span class="font-semibold ${fragilidad === 'Muy Alta' || fragilidad === 'Alta' || fragilidad === 'Very High' || fragilidad === 'High' ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'}">
                            ${fragilidad}
                        </span>
                    </div>

                    <!-- Estado y Nota de campo -->
                    <div class="pt-1.5 text-[11px]">
                        ${visitado ? `
                            <span class="text-emerald-500 dark:text-emerald-400 font-bold block mb-1">${t.estado_visitado}</span>
                            <div class="bg-slate-100 dark:bg-slate-900/90 rounded-lg p-2 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 italic overflow-y-auto">
                                ${nota ? `"${nota}"` : `<span class="text-slate-400 dark:text-slate-500 not-italic">${t.sin_notas}</span>`}
                            </div>
                        ` : `
                            <span class="text-slate-400 dark:text-slate-500 font-medium block">${t.estado_por_explorar}</span>
                        `}
                    </div>
                </div>

                <div class="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-amber-500 dark:text-amber-400/80 font-medium">
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
            burbujaDialogo.textContent = `${prefijo}, ${texto}!`;
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

    // Verificar si ya existe un nombre de explorador registrado
    const nombreGuardado = typeof obtenerNombreExplorador === "function"
        ? obtenerNombreExplorador()
        : (localStorage.getItem("rastro_austral_explorador") || "");

    if (nombreGuardado && nombreGuardado.trim().length > 0) {
        inputNombre.value = nombreGuardado;
        if (nombreDisplay) nombreDisplay.innerText = nombreGuardado;
        if (badgeExplorador) badgeExplorador.classList.remove("hidden");
        // Ocultar pantalla de bienvenida inmediatamente si ya está registrado
        pantalla.classList.add("hidden");
    } else {
        inputNombre.value = "";
        pantalla.classList.remove("hidden");
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

    inputNombre.addEventListener("focus", () => {
        focoEnInputNombre = true;
        actualizarDialogoYMirada();
    });

    inputNombre.addEventListener("input", () => {
        focoEnInputNombre = true;
        actualizarDialogoYMirada();
    });

    inputNombre.addEventListener("blur", () => {
        focoEnInputNombre = false;
        if (inputNombre.value.trim().length === 0) {
            moverPupilas(0, 0);
        }
    });

    // Manejar envío del formulario de ingreso
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = inputNombre.value.trim();
        if (!nombre) return;

        if (typeof guardarNombreExplorador === "function") {
            guardarNombreExplorador(nombre);
        } else {
            localStorage.setItem("rastro_austral_explorador", nombre);
        }

        if (nombreDisplay) nombreDisplay.innerText = nombre;
        if (badgeExplorador) badgeExplorador.classList.remove("hidden");

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

    // Permitir editar el nombre abriendo nuevamente la pantalla sin pre-seleccionar el texto
    if (btnEditar) {
        btnEditar.addEventListener("click", () => {
            pantalla.classList.remove("hidden", "opacity-0", "pointer-events-none");
            actualizarDialogoYMirada();
            inputNombre.focus();
            const len = inputNombre.value.length;
            if (typeof inputNombre.setSelectionRange === "function") {
                inputNombre.setSelectionRange(len, len);
            }
        });
    }
}


// Configuración y alternancia del tema claro / oscuro (Light / Dark mode)
function configurarConmutadorTema() {
    const btnTemaHeader = document.getElementById("btn-toggle-tema");
    const btnTemaBienvenida = document.getElementById("btn-tema-bienvenida");
    const iconosTema = document.querySelectorAll(".icono-tema-dinamico, #icono-tema");
    const html = document.documentElement;

    const temaGuardado = typeof obtenerTema === "function"
        ? obtenerTema()
        : (localStorage.getItem("rastro_austral_tema") || "dark");

    function aplicarTema(tema) {
        const esOscuro = tema === "dark";
        const t = DICCIONARIO[idiomaActual] || DICCIONARIO.es;
        const textoTitulo = esOscuro
            ? (t.tema_modo_claro || "Cambiar a Modo Claro")
            : (t.tema_modo_oscuro || "Cambiar a Modo Oscuro");
        const iconoSvg = esOscuro
            ? `<svg viewBox="0 0 24 24" class="icono-bitacora"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
            : `<svg viewBox="0 0 24 24" class="icono-bitacora"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

        if (esOscuro) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }

        iconosTema.forEach(ic => {
            ic.innerHTML = iconoSvg;
        });

        if (btnTemaHeader) {
            btnTemaHeader.setAttribute("title", textoTitulo);
        }
        if (btnTemaBienvenida) {
            btnTemaBienvenida.setAttribute("title", textoTitulo);
        }
    }

    aplicarTema(temaGuardado);

    function alternarTema() {
        const esOscuro = html.classList.contains("dark");
        const nuevoTema = esOscuro ? "light" : "dark";
        aplicarTema(nuevoTema);
        if (typeof guardarTema === "function") {
            guardarTema(nuevoTema);
        } else {
            localStorage.setItem("rastro_austral_tema", nuevoTema);
        }
        const vistaObs = document.getElementById("vista-observatorio-full") || document.getElementById("vista-tab-observatorio");
        if (vistaObs && !vistaObs.classList.contains("hidden") && typeof renderizarGraficosObservatorio === "function") {
            renderizarGraficosObservatorio();
        }
        anunciarAccesibilidad(
            nuevoTema === "dark"
                ? (idiomaActual === "en" ? "Dark mode enabled." : "Modo oscuro activado.")
                : (idiomaActual === "en" ? "Light mode enabled." : "Modo claro activado.")
        );
    }

    if (btnTemaHeader) {
        btnTemaHeader.addEventListener("click", alternarTema);
    }
    if (btnTemaBienvenida) {
        btnTemaBienvenida.addEventListener("click", alternarTema);
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
