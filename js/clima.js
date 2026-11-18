/**
 * Rastro Austral - Módulo de Clima Austral en Tiempo Real
 * js/clima.js
 * 
 * Consume la API abierta de Open-Meteo (sin clave requerida)
 * Provee datos meteorológicos, códigos WMO bilingües, alertas de viento
 * y recomendaciones para expedición con respaldo offline y caché de 20 min.
 */

(function () {
    "use strict";

    // Coordenadas geográficas de los territorios de Tierra del Fuego y Antártida
    const COORDENADAS_TERRITORIOS = {
        "todos": {
            lat: -54.8019,
            lon: -68.3030,
            nombre: { es: "Tierra del Fuego (Ushuaia)", en: "Tierra del Fuego (Ushuaia)" }
        },
        "ushuaia": {
            lat: -54.8019,
            lon: -68.3030,
            nombre: { es: "Ushuaia", en: "Ushuaia" }
        },
        "tolhuin": {
            lat: -54.5108,
            lon: -67.1955,
            nombre: { es: "Tolhuin", en: "Tolhuin" }
        },
        "rio-grande": {
            lat: -53.7877,
            lon: -67.7095,
            nombre: { es: "Río Grande", en: "Río Grande" }
        },
        "almanza": {
            lat: -54.8689,
            lon: -67.5764,
            nombre: { es: "Puerto Almanza", en: "Puerto Almanza" }
        },
        "san-sebastian": {
            lat: -53.1636,
            lon: -68.4314,
            nombre: { es: "San Sebastián", en: "San Sebastián" }
        },
        "esperanza": {
            lat: -63.3981,
            lon: -56.9973,
            nombre: { es: "Base Esperanza (Antártida)", en: "Esperanza Base (Antarctica)" }
        }
    };

    // Mapeo exhaustivo de códigos meteorológicos WMO a ícono y descripción bilingüe
    const WMO_CLIMA = {
        0: { icon: "☀️", es: "Cielo despejado", en: "Clear sky" },
        1: { icon: "🌤️", es: "Mayormente despejado", en: "Mainly clear" },
        2: { icon: "⛅", es: "Parcialmente nublado", en: "Partly cloudy" },
        3: { icon: "☁️", es: "Nublado", en: "Overcast" },
        45: { icon: "🌫️", es: "Niebla", en: "Fog" },
        48: { icon: "🌫️", es: "Neblina con escarcha", en: "Depositing rime fog" },
        51: { icon: "🌦️", es: "Llovizna ligera", en: "Light drizzle" },
        53: { icon: "🌦️", es: "Llovizna moderada", en: "Moderate drizzle" },
        55: { icon: "🌧️", es: "Llovizna densa", en: "Dense drizzle" },
        56: { icon: "🌧️", es: "Llovizna helada leve", en: "Slight freezing drizzle" },
        57: { icon: "🌧️", es: "Llovizna helada densa", en: "Dense freezing drizzle" },
        61: { icon: "🌧️", es: "Lluvia ligera", en: "Slight rain" },
        63: { icon: "🌧️", es: "Lluvia moderada", en: "Moderate rain" },
        65: { icon: "🌧️", es: "Lluvia torrencial", en: "Heavy rain" },
        66: { icon: "🌨️", es: "Lluvia helada ligera", en: "Light freezing rain" },
        67: { icon: "🌨️", es: "Lluvia helada intensa", en: "Heavy freezing rain" },
        71: { icon: "🌨️", es: "Nevasca ligera", en: "Slight snowfall" },
        73: { icon: "❄️", es: "Nieve moderada", en: "Moderate snowfall" },
        75: { icon: "❄️", es: "Nieve intensa", en: "Heavy snowfall" },
        77: { icon: "🌨️", es: "Granizo menudo", en: "Snow grains" },
        80: { icon: "🌦️", es: "Chaparrones leves", en: "Slight rain showers" },
        81: { icon: "🌦️", es: "Chaparrones moderados", en: "Moderate rain showers" },
        82: { icon: "🌧️", es: "Chaparrones violentos", en: "Violent rain showers" },
        85: { icon: "🌨️", es: "Chubascos de nieve", en: "Snow showers" },
        86: { icon: "❄️", es: "Chubascos de nieve intensos", en: "Heavy snow showers" },
        95: { icon: "⛈️", es: "Tormenta eléctrica", en: "Thunderstorm" },
        96: { icon: "⛈️", es: "Tormenta con granizo leve", en: "Thunderstorm with slight hail" },
        99: { icon: "⛈️", es: "Tormenta con granizo fuerte", en: "Thunderstorm with heavy hail" }
    };

    // Textos de interfaz bilingües del popover
    const I18N_CLIMA = {
        es: {
            sensacion: "Sensación",
            rafagas: "Ráfagas máx.",
            humedad: "Humedad",
            viento: "Viento 10m",
            actualizado: "Actualizado",
            offline: "Offline",
            consultando: "Consultando condiciones...",
            errorConexion: "Sin conexión a Open-Meteo",
            miUbicacion: "Mi ubicación GPS"
        },
        en: {
            sensacion: "Feels like",
            rafagas: "Max gusts",
            humedad: "Humidity",
            viento: "Wind 10m",
            actualizado: "Updated",
            offline: "Offline",
            consultando: "Checking conditions...",
            errorConexion: "Offline from Open-Meteo",
            miUbicacion: "My GPS location"
        }
    };

    // Estado interno del módulo de clima
    const estadoClima = {
        territorioActual: "todos",
        coordenadasGps: null,
        datosUltimos: null,
        cargando: false
    };

    // Obtener idioma activo actual ('es' o 'en')
    function getIdiomaClima() {
        try {
            const guardado = localStorage.getItem("rastro_austral_idioma");
            if (guardado === "es" || guardado === "en") return guardado;
        } catch (_) {}
        if (typeof window.idiomaActual === "string" && (window.idiomaActual === "es" || window.idiomaActual === "en")) {
            return window.idiomaActual;
        }
        return "es";
    }

    // Calcula el consejo de expedición y alerta de ráfagas según métricas
    function generarConsejoExpedicion(current, idioma) {
        const rafagas = typeof current.wind_gusts_10m === "number" ? current.wind_gusts_10m : 0;
        const viento = typeof current.wind_speed_10m === "number" ? current.wind_speed_10m : 0;
        const sensacion = typeof current.apparent_temperature === "number" ? current.apparent_temperature : 10;
        const code = typeof current.weather_code === "number" ? current.weather_code : 0;

        const esEn = idioma === "en";

        // 1. Alerta crítica de viento/ráfagas severas (> 55 km/h)
        if (rafagas >= 55 || viento >= 45) {
            return {
                esAlerta: true,
                texto: esEn
                    ? `⚠️ Severe gusts (${Math.round(rafagas)} km/h): high risk on ridges, exposed passes, and coastlines. Secure windbreakers.`
                    : `⚠️ Ráfagas intensas (${Math.round(rafagas)} km/h): extremo cuidado en filos, pasos de montaña y costas. Asegurar rompevientos.`
            };
        }

        // 2. Ambiente bajo cero o nieve
        if (sensacion <= 0 || (code >= 71 && code <= 86)) {
            return {
                esAlerta: false,
                texto: esEn
                    ? `❄️ Sub-zero conditions (feels ${Math.round(sensacion)}°C) and frost: thermal waterproof boots and windproof layers required.`
                    : `❄️ Ambiente bajo cero (ST ${Math.round(sensacion)}°C) y posible hielo: calzado térmico impermeable y capas cortaviento.`
            };
        }

        // 3. Precipitaciones activas o turba anegada
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
            return {
                esAlerta: false,
                texto: esEn
                    ? `🌧️ Slippery terrain and wet peat: wear waterproof mid/high hiking boots and rain shell jacket.`
                    : `🌧️ Suelo resbaladizo y turba húmeda: usar calzado de caña media/alta y campera impermeable.`
            };
        }

        // 4. Viento moderado fueguino
        if (viento >= 30) {
            return {
                esAlerta: false,
                texto: esEn
                    ? `💨 Typical Patagonian wind (${Math.round(viento)} km/h): wear a windproof jacket and protect extremities.`
                    : `💨 Viento fueguino constante (${Math.round(viento)} km/h): usar campera cortaviento y proteger extremidades.`
            };
        }

        // 5. Buenas condiciones generales
        return {
            esAlerta: false,
            texto: esEn
                ? `🌲 Favorable trail conditions: carry drinking water, sunscreen, and warm layers for sudden weather changes.`
                : `🌲 Buenas condiciones de marcha: llevar hidratación, protección solar y abrigo para cambios súbitos.`
        };
    }

    // Formatear hora local de lectura (HH:mm)
    function formatearHora(isoString) {
        if (!isoString) return "";
        try {
            const d = new Date(isoString);
            if (Number.isNaN(d.getTime())) return "";
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch (_) {
            return "";
        }
    }

    // Actualiza la interfaz del botón y el popover con los datos meteorológicos
    function renderizarClimaUI(datos, nombreLugar, esDeCache = false, fechaCache = null) {
        const idioma = getIdiomaClima();
        const t = I18N_CLIMA[idioma] || I18N_CLIMA.es;

        const widgetPildora = document.getElementById("widget-clima-austral");
        const elIcono = document.getElementById("clima-icono");
        const elTemp = document.getElementById("clima-temp");
        const elViento = document.getElementById("clima-viento");
        const elAlertaBadge = document.getElementById("clima-alerta-badge");

        // Popover elements
        const popIcono = document.getElementById("popover-clima-icono");
        const popLugar = document.getElementById("popover-clima-lugar");
        const popCondicion = document.getElementById("popover-clima-condicion");
        const popTemp = document.getElementById("popover-clima-temp");
        const popSensacion = document.getElementById("popover-clima-sensacion");
        const popRafagas = document.getElementById("popover-clima-rafagas");
        const popHumedad = document.getElementById("popover-clima-humedad");
        const popViento = document.getElementById("popover-clima-viento");
        const popConsejo = document.getElementById("popover-clima-consejo");
        const popAlertaBox = document.getElementById("popover-clima-alerta-box");
        const popActualizado = document.getElementById("popover-clima-actualizado");

        // Labels
        const lblSens = document.getElementById("lbl-sensacion-termica");
        const lblRaf = document.getElementById("lbl-rafagas-max");
        const lblHum = document.getElementById("lbl-humedad-relativa");
        const lblViento = document.getElementById("lbl-viento-actual");
        if (lblSens) lblSens.textContent = t.sensacion;
        if (lblRaf) lblRaf.textContent = t.rafagas;
        if (lblHum) lblHum.textContent = t.humedad;
        if (lblViento) lblViento.textContent = t.viento;

        if (!datos || !datos.current) {
            if (elTemp) elTemp.textContent = "--°C";
            if (elViento) elViento.textContent = "-- km/h";
            if (popConsejo) popConsejo.textContent = t.errorConexion;
            return;
        }

        const curr = datos.current;
        const wmoInfo = WMO_CLIMA[curr.weather_code] || { icon: "🌡️", es: "Condiciones variables", en: "Variable conditions" };
        const consejoObj = generarConsejoExpedicion(curr, idioma);

        const tempRound = Math.round(curr.temperature_2m);
        const sensRound = Math.round(curr.apparent_temperature);
        const vientoRound = Math.round(curr.wind_speed_10m);
        const rafagasRound = Math.round(curr.wind_gusts_10m);
        const humedadRound = Math.round(curr.relative_humidity_2m);

        // Píldora exterior
        if (elIcono) elIcono.textContent = wmoInfo.icon;
        if (elTemp) elTemp.textContent = `${tempRound}°C`;
        if (elViento) elViento.textContent = `${vientoRound} km/h`;

        if (elAlertaBadge) {
            if (consejoObj.esAlerta) {
                elAlertaBadge.classList.remove("hidden");
            } else {
                elAlertaBadge.classList.add("hidden");
            }
        }

        if (widgetPildora) {
            const descClima = idioma === "en" ? wmoInfo.en : wmoInfo.es;
            widgetPildora.setAttribute("title", `${nombreLugar}: ${descClima}, ${tempRound}°C, ${t.viento}: ${vientoRound} km/h`);
        }

        // Popover interior
        if (popIcono) popIcono.textContent = wmoInfo.icon;
        if (popLugar) popLugar.textContent = nombreLugar;
        if (popCondicion) popCondicion.textContent = idioma === "en" ? wmoInfo.en : wmoInfo.es;
        if (popTemp) popTemp.textContent = `${tempRound}°C`;
        if (popSensacion) popSensacion.textContent = `${sensRound}°C`;
        if (popRafagas) popRafagas.textContent = `${rafagasRound} km/h`;
        if (popHumedad) popHumedad.textContent = `${humedadRound}%`;
        if (popViento) popViento.textContent = `${vientoRound} km/h`;

        if (popConsejo) {
            popConsejo.textContent = consejoObj.texto;
        }

        if (popAlertaBox) {
            if (consejoObj.esAlerta) {
                popAlertaBox.className = "mt-2.5 p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-950 dark:text-amber-200 text-[10.5px] leading-tight flex items-start gap-1.5 shadow-sm";
            } else {
                popAlertaBox.className = "mt-2.5 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10.5px] leading-tight flex items-start gap-1.5";
            }
        }

        if (popActualizado) {
            const horaStr = formatearHora(curr.time) || (fechaCache ? formatearHora(fechaCache) : "");
            const sufijoOffline = esDeCache ? ` (${t.offline})` : "";
            popActualizado.textContent = `${t.actualizado}: ${horaStr || "--:--"}${sufijoOffline}`;
        }
    }

    // Consulta la API de Open-Meteo o rescata de la caché
    async function actualizarClimaTerritorio(territorioKey = null, coordsOpcionales = null) {
        if (territorioKey) {
            estadoClima.territorioActual = territorioKey;
        }
        if (coordsOpcionales && coordsOpcionales.lat && coordsOpcionales.lon) {
            estadoClima.coordenadasGps = coordsOpcionales;
        }

        const clave = estadoClima.territorioActual || "todos";
        const idioma = getIdiomaClima();
        const t = I18N_CLIMA[idioma] || I18N_CLIMA.es;

        // Determinar coordenadas y nombre del lugar
        let lat = -54.8019;
        let lon = -68.3030;
        let nombreLugar = "Ushuaia";

        if (clave === "gps" && estadoClima.coordenadasGps) {
            lat = estadoClima.coordenadasGps.lat;
            lon = estadoClima.coordenadasGps.lon;
            nombreLugar = estadoClima.coordenadasGps.nombre || t.miUbicacion;
        } else {
            const config = COORDENADAS_TERRITORIOS[clave] || COORDENADAS_TERRITORIOS["todos"];
            lat = config.lat;
            lon = config.lon;
            nombreLugar = config.nombre[idioma] || config.nombre.es;
        }

        const cacheKey = `rastro_clima_cache_${clave}`;
        const tiempoValidez = 20 * 60 * 1000; // 20 minutos
        let cacheValida = null;
        let cacheStale = null;

        try {
            const guardado = localStorage.getItem(cacheKey);
            if (guardado) {
                const parseado = JSON.parse(guardado);
                const ahora = Date.now();
                if (ahora - parseado.timestamp < tiempoValidez && parseado.data) {
                    cacheValida = parseado;
                } else if (parseado.data) {
                    cacheStale = parseado;
                }
            }
        } catch (_) {}

        // Si tenemos datos en caché válidos, renderizamos de inmediato
        if (cacheValida) {
            estadoClima.datosUltimos = cacheValida.data;
            renderizarClimaUI(cacheValida.data, nombreLugar, false, cacheValida.data.current?.time);
            return;
        }

        // Si tenemos caché vencida, la mostramos preliminarmente mientras actualizamos en background
        if (cacheStale) {
            renderizarClimaUI(cacheStale.data, nombreLugar, true, cacheStale.data.current?.time);
        }

        // Consulta a la API abierta de Open-Meteo
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m&timezone=America%2FArgentina%2FUshuaia`;

        try {
            estadoClima.cargando = true;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7500);

            const respuesta = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!respuesta.ok) {
                throw new Error(`Open-Meteo HTTP ${respuesta.status}`);
            }

            const data = await respuesta.json();
            if (data && data.current) {
                estadoClima.datosUltimos = data;

                // Persistir en caché
                try {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        timestamp: Date.now(),
                        data: data,
                        territorio: clave,
                        nombre: nombreLugar
                    }));
                } catch (_) {}

                renderizarClimaUI(data, nombreLugar, false, data.current.time);
            }
        } catch (error) {
            console.warn(`[Clima] No se pudo obtener datos en vivo de Open-Meteo (${clave}):`, error.message);
            // Respaldo offline infinito con datos en caché anteriores
            if (cacheStale) {
                renderizarClimaUI(cacheStale.data, nombreLugar, true, cacheStale.data.current?.time);
            } else if (!cacheValida) {
                renderizarClimaUI(null, nombreLugar, true, null);
            }
        } finally {
            estadoClima.cargando = false;
        }
    }

    // Inicializar listeners del widget de clima y el popover interactivo
    function inicializarWidgetClima() {
        const widget = document.getElementById("widget-clima-austral");
        const popover = document.getElementById("popover-clima-detalle");

        if (widget && popover) {
            if (widget.dataset.inicializado === "true") return;
            widget.dataset.inicializado = "true";

            // Alternar popover al hacer clic
            widget.addEventListener("click", (e) => {
                e.stopPropagation();
                const estaAbierto = !popover.classList.contains("hidden");
                if (estaAbierto) {
                    popover.classList.add("hidden");
                    widget.setAttribute("aria-expanded", "false");
                } else {
                    popover.classList.remove("hidden");
                    widget.setAttribute("aria-expanded", "true");
                }
            });

            // Evitar cerrar al hacer clic dentro del popover
            popover.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            // Cerrar popover al hacer clic fuera o presionar Escape
            document.addEventListener("click", (e) => {
                if (!widget.contains(e.target) && !popover.contains(e.target)) {
                    popover.classList.add("hidden");
                    widget.setAttribute("aria-expanded", "false");
                }
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && !popover.classList.contains("hidden")) {
                    popover.classList.add("hidden");
                    widget.setAttribute("aria-expanded", "false");
                }
            });
        }

        // Carga inicial para la vista provincial / Ushuaia
        actualizarClimaTerritorio(estadoClima.territorioActual || "todos");
    }

    // Inicialización al cargar el DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializarWidgetClima);
    } else {
        inicializarWidgetClima();
    }

    // Exponer API pública en window
    window.actualizarClimaTerritorio = actualizarClimaTerritorio;
    window.inicializarWidgetClima = inicializarWidgetClima;

})();
