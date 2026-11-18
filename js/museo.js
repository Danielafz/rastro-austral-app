/**
 * Rastro Austral - Museo Austral 2D
 * js/museo.js
 * 
 * Motor de exploración 2D "Museo Elegante Patagónico":
 * - Escenario con muros en verde bosque profundo (#172A27), paneles de lenga y bronce.
 * - Mascota Pingüino de Rastro Austral visto de espaldas con remera oficial y bufanda.
 * - Animación de paso balanceado (waddle) y control por Joystick táctil + teclado (←/→) + rueda de mouse.
 * - Focos cenitales con respiración suave e intensificación por proximidad.
 * - Ficha Bottom Sheet bilingüe en color marfil/pergamino (#F4F1EA).
 */

(function () {
    "use strict";

    // Estado interno del Museo
    const estadoMuseo = {
        activo: false,
        salaIndex: 0,
        posicionX: 420,       // Posición horizontal del pingüino (inicia frente a la primera obra)
        anchoPasillo: 2100,   // Ancho virtual del pasillo con separación amplia entre cuadros (px)
        velocidadX: 0,        // Input de movimiento (-1 a 1)
        mirandoDerecha: true,
        caminando: false,
        obraProxima: null,    // Obra frente a la cual se encuentra el pingüino
        obraAbierta: null,    // Obra abierta en el Bottom Sheet
        animFrameId: null,
        joystickActivo: false,
        joystickTouchId: null,
        joystickCentroX: 0,
        joystickCentroY: 0,
        joystickRadioMax: 32,
        teclasPulsadas: {
            izquierda: false,
            derecha: false
        }
    };

    // Referencias al DOM del Museo
    let dom = {};

    function initDom() {
        dom = {
            vista: document.getElementById("vista-museo-austral"),
            btnCerrar: document.getElementById("btn-cerrar-museo"),
            txtVolverMapa: document.getElementById("txt-volver-mapa-museo"),
            btnPrevSala: document.getElementById("btn-prev-sala-museo"),
            btnNextSala: document.getElementById("btn-next-sala-museo"),
            headerTituloWrapper: document.getElementById("museo-header-titulo-wrapper"),
            salaContador: document.getElementById("museo-sala-contador"),
            salaNombre: document.getElementById("museo-sala-nombre"),
            tituloSalaNav: document.getElementById("museo-titulo-sala-actual") || document.getElementById("titulo-sala-actual-museo"),
            barraProgreso: document.getElementById("barra-progreso-museo"),
            btnSalasDrawer: document.getElementById("btn-abrir-menu-salas"),
            lblBtnSalas: document.getElementById("lbl-btn-salas-museo"),
            drawerSalas: document.getElementById("drawer-selector-salas"),
            tituloModalSalas: document.getElementById("titulo-modal-salas"),
            listaSalasDrawer: document.getElementById("lista-salas-selector"),
            btnCerrarDrawerSalas: document.getElementById("btn-cerrar-drawer-salas"),
            pasilloMuro: document.getElementById("pasillo-muro-museo"),
            contenedorObras: document.getElementById("contenedor-obras-museo"),
            pinguinoMascota: document.getElementById("pinguino-mascota-museo"),
            pinguinoSprite: document.getElementById("pinguino-sprite-animado"),
            joystickBase: document.getElementById("museo-joystick-base") || document.getElementById("joystick-base-museo"),
            joystickPerilla: document.getElementById("museo-joystick-knob") || document.getElementById("joystick-perilla-museo"),
            lblJoystick: document.getElementById("lbl-joystick-museo"),
            indicadorTeclas: document.getElementById("indicador-teclas-museo"),
            sheetDetalle: document.getElementById("sheet-detalle-obra-museo"),
            lblColeccion: document.getElementById("lbl-coleccion-museo"),
            btnCerrarSheet: document.getElementById("btn-cerrar-sheet-obra"),
            btnSeguirRecorriendo: document.getElementById("btn-seguir-recorriendo-obra"),
            textoSeguirRecorriendo: document.getElementById("texto-seguir-recorriendo"),
            sheetImg: document.getElementById("sheet-obra-img"),
            sheetTitulo: document.getElementById("ficha-obra-titulo") || document.getElementById("sheet-obra-titulo"),
            sheetMeta: document.getElementById("sheet-obra-meta"),
            sheetDesc: document.getElementById("sheet-obra-desc"),
            sheetCredito: document.getElementById("sheet-obra-credito"),
            sheetHitoBadge: document.getElementById("sheet-obra-hito-badge"),
            btnAudioguia: document.getElementById("btn-audioguia-museo"),
            iconoAudioguia: document.getElementById("icono-audioguia"),
            textoAudioguia: document.getElementById("texto-audioguia"),
            btnObraAnterior: document.getElementById("btn-obra-anterior"),
            btnObraSiguiente: document.getElementById("btn-obra-siguiente"),
            indicadorContador: document.getElementById("indicador-obra-contador"),
            textoObraAnterior: document.getElementById("texto-obra-anterior"),
            textoObraSiguiente: document.getElementById("texto-obra-siguiente"),
            btnLangEs: document.getElementById("btn-museo-idioma-es") || document.getElementById("btn-museo-lang-es"),
            btnLangEn: document.getElementById("btn-museo-idioma-en") || document.getElementById("btn-museo-lang-en")
        };
    }

    // Obtener idioma activo actual (localStorage > window.idiomaActual > 'es')
    function getIdioma() {
        try {
            const guardado = localStorage.getItem("rastro_austral_idioma");
            if (guardado === "es" || guardado === "en") return guardado;
        } catch (_) {}
        if (typeof window.idiomaActual === "string" && (window.idiomaActual === "es" || window.idiomaActual === "en")) {
            return window.idiomaActual;
        }
        return "es";
    }

    // Traducir texto bilingüe
    function tBilingue(objetoTexto) {
        if (!objetoTexto) return "";
        if (typeof objetoTexto === "string") return objetoTexto;
        const idioma = getIdioma();
        return objetoTexto[idioma] || objetoTexto.es || "";
    }

    // Configuración responsiva del pasillo (móvil: 245px entre centros, escritorio: 600px)
    function obtenerConfigPasillo() {
        const esMovil = window.innerWidth < 768;
        if (esMovil) {
            return {
                esMovil: true,
                posicionesX: [240, 485, 730],
                anchoPasillo: 1040,
                columnasX: [80, 362, 607, 890]
            };
        }
        return {
            esMovil: false,
            posicionesX: [420, 1020, 1620],
            anchoPasillo: 2100,
            columnasX: [100, 720, 1320, 1940]
        };
    }

    // Actualizar barra de progreso del recorrido global (1 a 18)
    function actualizarBarraProgreso(indiceGlobal = 1) {
        if (!dom.barraProgreso) return;
        const total = 18;
        const paso = Math.max(1, Math.min(indiceGlobal, total));
        const pct = (paso / total) * 100;
        dom.barraProgreso.style.width = `${pct.toFixed(2)}%`;
        dom.barraProgreso.setAttribute("aria-valuenow", String(paso));
    }

    // Actualizar título de la sala en la barra superior (formato responsivo 2 líneas en móvil / 1 línea en escritorio)
    function actualizarTituloSala(indiceSala) {
        if (!dom.salaContador || !dom.salaNombre) {
            dom.headerTituloWrapper = document.getElementById("museo-header-titulo-wrapper");
            dom.salaContador = document.getElementById("museo-sala-contador");
            dom.salaNombre = document.getElementById("museo-sala-nombre");
            dom.tituloSalaNav = document.getElementById("museo-titulo-sala-actual") || document.getElementById("titulo-sala-actual-museo");
        }
        const salas = window.SALAS_MUSEO || [];
        const idx = (typeof indiceSala === "number") ? indiceSala : estadoMuseo.salaIndex;
        const sala = salas[idx];
        if (!sala) return;

        const idioma = getIdioma();
        const prefijo = idioma === "en" ? `Room ${sala.numero} of ${salas.length}` : `Sala ${sala.numero} de ${salas.length}`;
        const nombreLimpio = tBilingue(sala.titulo).replace(/^Sala \d+: |^Room \d+: /, "");

        if (dom.salaContador) {
            dom.salaContador.textContent = prefijo;
        }
        if (dom.salaNombre) {
            dom.salaNombre.textContent = nombreLimpio;
        }
        if (dom.tituloSalaNav && !dom.salaContador) {
            dom.tituloSalaNav.innerHTML = `<span class="text-amber-700 font-bold prefijo-sala" style="color: #B45309 !important;">${prefijo}</span> · <span class="text-stone-900 font-bold nombre-sala" style="color: #1C1917 !important;">${nombreLimpio}</span>`;
        }
    }

    // Estado y lógica de la Audioguía con Web Speech API offline
    let audioGuiaHablando = false;

    function detenerAudioguia() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        audioGuiaHablando = false;
        actualizarBotonAudioguia();
    }

    function alternarAudioguia() {
        if (!("speechSynthesis" in window)) {
            alert(getIdioma() === "en" ? "Speech synthesis is not supported in this browser." : "La síntesis de voz no está soportada en este navegador.");
            return;
        }

        if (audioGuiaHablando) {
            detenerAudioguia();
            return;
        }

        if (!estadoMuseo.obraAbierta) return;

        const obra = estadoMuseo.obraAbierta;
        const idioma = getIdioma();
        const titulo = tBilingue(obra.titulo);
        const anio = obra.anio ? (idioma === "en" ? `Year ${obra.anio}.` : `Año ${obra.anio}.`) : "";
        const lugar = tBilingue(obra.lugar);
        const desc = tBilingue(obra.descripcion);

        const textoCompleto = `${titulo}. ${anio} ${lugar}. ${desc}`;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textoCompleto);
        utterance.lang = idioma === "en" ? "en-US" : "es-AR";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        const voces = window.speechSynthesis.getVoices();
        if (voces && voces.length > 0) {
            if (idioma === "en") {
                const vozEn = voces.find(v => v.lang.startsWith("en-") || v.lang === "en");
                if (vozEn) utterance.voice = vozEn;
            } else {
                const vozEs = voces.find(v => v.lang === "es-AR") || voces.find(v => v.lang.startsWith("es-"));
                if (vozEs) utterance.voice = vozEs;
            }
        }

        utterance.onstart = () => {
            audioGuiaHablando = true;
            actualizarBotonAudioguia();
        };

        utterance.onend = () => {
            audioGuiaHablando = false;
            actualizarBotonAudioguia();
        };

        utterance.onerror = () => {
            audioGuiaHablando = false;
            actualizarBotonAudioguia();
        };

        window.speechSynthesis.speak(utterance);
    }

    function actualizarBotonAudioguia() {
        const btn = dom.btnAudioguia;
        const icono = dom.iconoAudioguia;
        const texto = dom.textoAudioguia;
        if (!btn) return;

        const idioma = getIdioma();
        if (audioGuiaHablando) {
            btn.classList.add("bg-amber-600", "text-white", "animate-pulse");
            btn.classList.remove("bg-amber-200/70", "text-amber-950");
            if (icono) icono.textContent = "⏹";
            if (texto) texto.textContent = idioma === "en" ? "Stop audio" : "Detener audio";
        } else {
            btn.classList.remove("bg-amber-600", "text-white", "animate-pulse");
            btn.classList.add("bg-amber-200/70", "text-amber-950");
            if (icono) icono.textContent = "🔊";
            if (texto) texto.textContent = idioma === "en" ? "Listen to audio guide" : "Escuchar audioguía";
        }
    }

    // Navegación secuencial de obras (1 a 18) desde la ficha
    function navegarObra(delta) {
        detenerAudioguia();
        const salas = window.SALAS_MUSEO || [];
        const todasLasObras = [];
        salas.forEach((s, sIdx) => {
            s.obras.forEach((o, oIdx) => {
                todasLasObras.push({ obra: o, salaIndex: sIdx, obraIndex: oIdx });
            });
        });
        if (!todasLasObras.length || !estadoMuseo.obraAbierta) return;
        const currIdx = todasLasObras.findIndex(item => item.obra.id === estadoMuseo.obraAbierta.id);
        if (currIdx === -1) return;

        let nextIdx = currIdx + delta;
        if (nextIdx < 0) nextIdx = todasLasObras.length - 1;
        if (nextIdx >= todasLasObras.length) nextIdx = 0;

        const target = todasLasObras[nextIdx];
        if (target.salaIndex !== estadoMuseo.salaIndex) {
            cargarSala(target.salaIndex);
        }
        const config = obtenerConfigPasillo();
        estadoMuseo.posicionX = config.posicionesX[target.obraIndex] || config.posicionesX[0];
        actualizarPosicionPinguino();
        verificarProximidadObras();
        abrirSheetObra(target.obra);
    }

    // Abrir el Museo Austral 2D
    function abrirMuseoAustral(salaIndice = 0) {
        if (!dom.vista) initDom();
        if (!dom.vista) return;

        const config = obtenerConfigPasillo();
        estadoMuseo.activo = true;
        estadoMuseo.salaIndex = Math.max(0, Math.min(salaIndice, (window.SALAS_MUSEO || []).length - 1));
        estadoMuseo.anchoPasillo = config.anchoPasillo;
        estadoMuseo.posicionX = config.posicionesX[0];
        estadoMuseo.velocidadX = 0;
        estadoMuseo.mirandoDerecha = true;
        estadoMuseo.caminando = false;
        estadoMuseo.obraProxima = null;
        estadoMuseo.obraAbierta = null;

        // Ocultar otras vistas principales si estuvieran abiertas
        if (typeof window.cerrarTodasLasVistas === "function") {
            window.cerrarTodasLasVistas();
        }

        // Mostrar pantalla del Museo
        dom.vista.classList.remove("hidden");
        dom.vista.classList.add("flex");

        // Sincronizar idioma
        actualizarBotonesIdiomaMuseo();

        // Inicializar joystick táctil blindado
        inicializarJoystickMuseo();

        // Cargar sala
        cargarSala(estadoMuseo.salaIndex);

        // Iniciar loop de animación y físicas
        cancelAnimationFrame(estadoMuseo.animFrameId);
        bucleAnimacion();

        // Notificar en consola
        console.log("🏛️ Museo Austral 2D iniciado en Sala", estadoMuseo.salaIndex + 1);
    }

    // Cerrar el Museo Austral y volver al mapa
    function cerrarMuseoAustral() {
        if (!dom.vista) return;
        estadoMuseo.activo = false;
        cancelAnimationFrame(estadoMuseo.animFrameId);

        detenerAudioguia();
        cerrarSheetObra();
        cerrarDrawerSalas();

        dom.vista.classList.add("hidden");
        dom.vista.classList.remove("flex");

        // Reactivar invalidación de mapa si existe
        if (window.mapa && typeof window.mapa.invalidateSize === "function") {
            setTimeout(() => window.mapa.invalidateSize(), 150);
        }
    }

    // Cargar sala temática
    function cargarSala(indice) {
        const salas = window.SALAS_MUSEO || [];
        if (!salas[indice]) return;

        detenerAudioguia();
        estadoMuseo.salaIndex = indice;
        const sala = salas[indice];

        // Configuración espacial responsiva
        const config = obtenerConfigPasillo();
        estadoMuseo.anchoPasillo = config.anchoPasillo;

        if (dom.pasilloMuro) {
            dom.pasilloMuro.style.width = `${config.anchoPasillo}px`;
            const cols = dom.pasilloMuro.querySelectorAll(".columna-madera-museo");
            cols.forEach((col, i) => {
                if (config.columnasX[i] !== undefined) {
                    col.style.left = `${config.columnasX[i]}px`;
                }
            });
        }

        // Actualizar título en la barra superior con texto oscuro de alto contraste (separado en contador y nombre)
        actualizarTituloSala(indice);

        // Progreso general en la barra del encabezado (al inicio de la sala)
        actualizarBarraProgreso(indice * 3 + 1);

        // Posiciones espaciales de los 3 cuadros en el pasillo (px)
        const posicionesX = config.posicionesX;

        // Renderizar cuadros de la sala
        if (dom.contenedorObras) {
            dom.contenedorObras.innerHTML = "";

            sala.obras.forEach((obra, idx) => {
                const posX = posicionesX[idx] || (posicionesX[0] + idx * 245);
                const cuadroEl = document.createElement("div");
                cuadroEl.className = "cuadro-obra-museo absolute select-none cursor-pointer flex flex-col items-center";
                cuadroEl.style.left = `${posX}px`;
                cuadroEl.dataset.obraId = obra.id;
                cuadroEl.dataset.posX = posX;

                const tituloObra = tBilingue(obra.titulo);
                const anioObra = obra.anio || "";
                const lugarObra = tBilingue(obra.lugar);

                const fallbackSvg = window.generarSvgFallbackObra ? window.generarSvgFallbackObra(tituloObra, anioObra) : "";

                cuadroEl.innerHTML = `
                    <!-- Haz de luz cenital sobre el cuadro -->
                    <div class="luz-cenital-spot pointer-events-none"></div>

                    <!-- Píldora interactiva flotante cuando el pingüino está cerca -->
                    <div class="pildora-toca-foto pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        <span class="animate-bounce text-sm">👆</span>
                        <span>${getIdioma() === "en" ? "Tap photo" : "Tocá la foto"}</span>
                    </div>

                    <!-- Marco de lenga patagónica y bronce envejecido -->
                    <div class="marco-cuadro-patagonico relative rounded-lg p-2 sm:p-2.5 shadow-2xl transition-all duration-300">
                        <div class="lienzo-cuadro-interior relative overflow-hidden rounded bg-stone-900 border border-amber-900/40">
                            <img 
                                src="${obra.imagenUrl}" 
                                alt="${tituloObra}" 
                                loading="lazy" 
                                class="foto-obra-lienzo w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                onerror="this.onerror=null; this.src='${fallbackSvg}';"
                            />
                            <div class="overlay-brillo-oleo pointer-events-none absolute inset-0"></div>
                        </div>

                        <!-- Plaqueta de bronce con título y año -->
                        <div class="plaqueta-bronce-cuadro mt-1.5 px-2 py-0.5 rounded text-center">
                            <p class="font-serif font-bold text-[11px] leading-tight text-amber-950 truncate max-w-[190px] sm:max-w-[240px]">${tituloObra}</p>
                            <p class="text-[9px] text-amber-900 font-mono tracking-wider">${anioObra}</p>
                        </div>
                    </div>
                `;

                // Clic en el cuadro para abrir la ficha
                cuadroEl.addEventListener("click", () => {
                    abrirSheetObra(obra);
                });

                dom.contenedorObras.appendChild(cuadroEl);
            });
        }

        // Posicionar el pingüino parado justo frente a la primera obra y centrar cámara
        estadoMuseo.posicionX = posicionesX[0];
        actualizarPosicionPinguino();
        verificarProximidadObras();
    }

    // Saltito de celebración al interactuar o abrir una obra
    function saltarCelebracionPinguino() {
        const spriteEl = dom.pinguinoSprite || (dom.pinguinoMascota ? dom.pinguinoMascota.querySelector(".pinguino-inner-wrapper") : null);
        if (!spriteEl) return;
        spriteEl.classList.remove("pinguino-salto-celebracion");
        void spriteEl.offsetWidth; // Forzar reflow
        spriteEl.classList.add("pinguino-salto-celebracion");
        setTimeout(() => {
            spriteEl.classList.remove("pinguino-salto-celebracion");
        }, 580);
    }

    // Abrir ficha de obra (Bottom Sheet estilo pergamino)
    function abrirSheetObra(obra) {
        if (!dom.sheetDetalle) return;
        detenerAudioguia();
        saltarCelebracionPinguino();
        estadoMuseo.obraAbierta = obra;

        const titulo = tBilingue(obra.titulo);
        const lugar = tBilingue(obra.lugar);
        const desc = tBilingue(obra.descripcion);
        const anio = obra.anio || "";
        const fallbackSvg = window.generarSvgFallbackObra ? window.generarSvgFallbackObra(titulo, anio) : "";

        if (dom.sheetTitulo) {
            dom.sheetTitulo.textContent = titulo;
            dom.sheetTitulo.style.setProperty("color", "#1C1917", "important");
        }
        if (dom.sheetMeta) dom.sheetMeta.textContent = `${anio} · ${lugar}`;
        if (dom.sheetDesc) dom.sheetDesc.textContent = desc;
        if (dom.sheetCredito) dom.sheetCredito.textContent = obra.credito ? `📷 ${obra.credito}` : "";

        if (dom.sheetImg) {
            dom.sheetImg.src = obra.imagenUrl;
            dom.sheetImg.alt = titulo;
            dom.sheetImg.onerror = function () {
                this.onerror = null;
                this.src = fallbackSvg;
            };
        }

        // Etiqueta de hito relacionado
        if (dom.sheetHitoBadge) {
            if (obra.hitoRelacionado) {
                const nombreHito = tBilingue(obra.hitoRelacionado);
                dom.sheetHitoBadge.innerHTML = `
                    <span class="text-amber-700">📍</span>
                    <span class="font-semibold text-amber-950">${getIdioma() === "en" ? "Corresponds to landmark:" : "Corresponde al hito:"}</span>
                    <span class="text-amber-900 font-bold">${nombreHito}</span>
                `;
                dom.sheetHitoBadge.classList.remove("hidden");
            } else {
                dom.sheetHitoBadge.classList.add("hidden");
            }
        }

        // Calcular progreso global de la obra (1 a 18)
        const salas = window.SALAS_MUSEO || [];
        let indiceGlobal = 1;
        let contador = 0;
        salas.forEach((s) => {
            s.obras.forEach((o) => {
                contador++;
                if (o.id === obra.id) {
                    indiceGlobal = contador;
                }
            });
        });

        if (dom.indicadorContador) {
            dom.indicadorContador.textContent = `${indiceGlobal} / 18`;
        }
        actualizarBarraProgreso(indiceGlobal);

        // Textos bilingües de navegación y audioguía
        const idioma = getIdioma();
        if (dom.textoObraAnterior) dom.textoObraAnterior.textContent = idioma === "en" ? "Previous" : "Anterior";
        if (dom.textoObraSiguiente) dom.textoObraSiguiente.textContent = idioma === "en" ? "Next" : "Siguiente";
        if (dom.textoSeguirRecorriendo) dom.textoSeguirRecorriendo.textContent = idioma === "en" ? "Keep exploring" : "Seguir recorriendo";
        actualizarBotonAudioguia();

        dom.sheetDetalle.classList.remove("translate-y-full", "pointer-events-none");
        dom.sheetDetalle.classList.add("translate-y-0", "pointer-events-auto");
    }

    // Cerrar Bottom Sheet de obra
    function cerrarSheetObra() {
        detenerAudioguia();
        if (!dom.sheetDetalle) return;
        estadoMuseo.obraAbierta = null;
        dom.sheetDetalle.classList.add("translate-y-full", "pointer-events-none");
        dom.sheetDetalle.classList.remove("translate-y-0", "pointer-events-auto");
    }

    // Abrir selector rápido de las 6 salas
    function abrirDrawerSalas() {
        if (!dom.drawerSalas || !dom.listaSalasDrawer) return;

        const salas = window.SALAS_MUSEO || [];
        dom.listaSalasDrawer.innerHTML = "";

        // Asegurar contraste de título principal del modal
        const tituloModal = dom.tituloModalSalas || document.getElementById("titulo-modal-salas");
        if (tituloModal) {
            tituloModal.style.setProperty("color", "#FAF6EE", "important");
            tituloModal.textContent = getIdioma() === "en" ? "Austral Museum Rooms" : "Salas del Museo Austral";
        }

        salas.forEach((sala, i) => {
            const btnSala = document.createElement("button");
            const esActiva = i === estadoMuseo.salaIndex;
            btnSala.type = "button";
            btnSala.className = `w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition cursor-pointer ${
                esActiva 
                    ? "bg-amber-950/80 border-amber-400 shadow-xl ring-1 ring-amber-400/40" 
                    : "bg-stone-900/90 border-stone-800 hover:bg-stone-800 hover:border-amber-500/50"
            }`;

            btnSala.innerHTML = `
                <div class="text-2xl shrink-0 p-2 rounded-lg bg-stone-950 border border-stone-700/80 text-amber-300">${sala.icono || "🏛️"}</div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                        <h4 class="font-bold text-sm sm:text-base tracking-wide truncate titulo-sala-card" style="color: #FAF6EE !important;">
                            <span class="font-mono text-xs mr-1 numero-sala-badge" style="color: #FBBF24 !important;">${getIdioma() === "en" ? "Room" : "Sala"} ${sala.numero}:</span>
                            ${tBilingue(sala.titulo).replace(/^Sala \d+: |^Room \d+: /, "")}
                        </h4>
                        ${esActiva ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">${getIdioma() === "en" ? "CURRENT" : "EN CURSO"}</span>` : ""}
                    </div>
                    <p class="text-xs font-semibold mt-0.5 leading-snug subtitulo-sala-card" style="color: #FEF3C7 !important;">${tBilingue(sala.subtitulo)}</p>
                    <p class="text-[11px] mt-1 line-clamp-2 leading-relaxed desc-sala-card" style="color: #D6D3D1 !important;">${tBilingue(sala.descripcionCorta)}</p>
                </div>
            `;

            btnSala.addEventListener("click", () => {
                cerrarDrawerSalas();
                cargarSala(i);
            });

            dom.listaSalasDrawer.appendChild(btnSala);
        });

        dom.drawerSalas.classList.remove("hidden");
    }

    function cerrarDrawerSalas() {
        if (dom.drawerSalas) dom.drawerSalas.classList.add("hidden");
    }

    // Bucle de físicas y animación (60 FPS)
    function bucleAnimacion() {
        if (!estadoMuseo.activo) return;

        // Calcular velocidad final: suma del joystick táctil y de las teclas presionadas
        let vx = estadoMuseo.velocidadX;
        if (estadoMuseo.teclasPulsadas.izquierda) vx = -1;
        if (estadoMuseo.teclasPulsadas.derecha) vx = 1;

        const velocidadPaso = 4.8; // px por frame
        const hayMovimiento = Math.abs(vx) > 0.08 && !estadoMuseo.obraAbierta;

        if (hayMovimiento) {
            estadoMuseo.posicionX += vx * velocidadPaso;
            // Limitar al pasillo con márgenes responsivos
            const config = obtenerConfigPasillo();
            const margenMin = config.esMovil ? 50 : 80;
            const margenMax = config.anchoPasillo - (config.esMovil ? 80 : 120);
            estadoMuseo.posicionX = Math.max(margenMin, Math.min(estadoMuseo.posicionX, margenMax));

            // Orientación de la mascota
            if (vx > 0.05) estadoMuseo.mirandoDerecha = true;
            else if (vx < -0.05) estadoMuseo.mirandoDerecha = false;

            estadoMuseo.caminando = true;
        } else {
            estadoMuseo.caminando = false;
        }

        actualizarPosicionPinguino();
        verificarProximidadObras();

        estadoMuseo.animFrameId = requestAnimationFrame(bucleAnimacion);
    }

    // Actualiza la posición del pingüino y el desplazamiento de cámara
    function actualizarPosicionPinguino() {
        if (!dom.pinguinoMascota) return;

        // Transformación del sprite del pingüino (desplazamiento y orientación de marcha)
        const escalaX = estadoMuseo.mirandoDerecha ? 1 : -1;
        dom.pinguinoMascota.style.transform = `translateX(${estadoMuseo.posicionX}px) scaleX(${escalaX})`;

        const spriteEl = dom.pinguinoSprite || (dom.pinguinoMascota ? dom.pinguinoMascota.querySelector(".pinguino-inner-wrapper") : null) || dom.pinguinoMascota;

        if (estadoMuseo.caminando) {
            spriteEl.classList.add("pinguino-caminando-museo");
            spriteEl.classList.remove("pinguino-idle-museo");
        } else {
            spriteEl.classList.remove("pinguino-caminando-museo");
            spriteEl.classList.add("pinguino-idle-museo");
        }

        // Movimiento de cámara suave (centrar el pingüino en la pantalla)
        if (dom.pasilloMuro) {
            const anchoViewport = dom.vista ? dom.vista.clientWidth : window.innerWidth;
            const scrollDeseado = estadoMuseo.posicionX - anchoViewport / 2;
            const scrollMax = estadoMuseo.anchoPasillo - anchoViewport;
            const scrollFinal = Math.max(0, Math.min(scrollDeseado, Math.max(0, scrollMax)));

            dom.pasilloMuro.style.transform = `translateX(${-scrollFinal}px)`;
        }
    }

    // Comprueba qué cuadro tiene cerca el pingüino para activar luz e interacción
    function verificarProximidadObras() {
        const cuadros = document.querySelectorAll(".cuadro-obra-museo");
        const radioProximidad = 140; // px
        let obraEnRango = null;

        cuadros.forEach(cuadro => {
            const posX = parseFloat(cuadro.dataset.posX);
            if (Number.isNaN(posX)) return;

            const distancia = Math.abs(estadoMuseo.posicionX - posX);
            if (distancia < radioProximidad) {
                cuadro.classList.add("cuadro-activo-proximidad");
                obraEnRango = cuadro.dataset.obraId;
            } else {
                cuadro.classList.remove("cuadro-activo-proximidad");
            }
        });

        estadoMuseo.obraProxima = obraEnRango;
    }

    // Manejo de controles táctiles: Joystick circular blindado
    function inicializarJoystickMuseo() {
        if (!dom.joystickBase) {
            dom.joystickBase = document.getElementById("museo-joystick-base") || document.getElementById("joystick-base-museo");
        }
        if (!dom.joystickPerilla) {
            dom.joystickPerilla = document.getElementById("museo-joystick-knob") || document.getElementById("joystick-perilla-museo");
        }
        if (!dom.joystickBase || !dom.joystickPerilla) return;

        // Evitar registrar listeners múltiples veces
        if (dom.joystickBase.dataset.inicializado === "true") return;
        dom.joystickBase.dataset.inicializado = "true";

        dom.joystickBase.style.touchAction = "none";
        dom.joystickBase.style.userSelect = "none";
        dom.joystickBase.style.webkitUserSelect = "none";
        dom.joystickBase.style.pointerEvents = "auto";

        dom.joystickPerilla.style.touchAction = "none";
        dom.joystickPerilla.style.userSelect = "none";
        dom.joystickPerilla.style.webkitUserSelect = "none";
        dom.joystickPerilla.style.pointerEvents = "none";

        const maxRadio = 28;

        function moverJoystick(clientX) {
            if (!estadoMuseo.joystickActivo) return;
            let dx = clientX - estadoMuseo.joystickCentroX;
            dx = Math.max(-maxRadio, Math.min(dx, maxRadio));

            dom.joystickPerilla.style.transform = `translate3d(${dx}px, 0px, 0)`;

            // Factor continuo normalizado entre -1 y 1
            const factorX = dx / maxRadio;
            estadoMuseo.velocidadX = factorX;
        }

        function soltarJoystick() {
            estadoMuseo.joystickActivo = false;
            estadoMuseo.joystickTouchId = null;
            estadoMuseo.velocidadX = 0;
            if (dom.joystickPerilla) {
                dom.joystickPerilla.style.transform = "translate3d(0px, 0px, 0)";
            }
        }

        // Eventos táctiles nativos puros (Touch Events) con captura en window
        dom.joystickBase.addEventListener("touchstart", (e) => {
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            const touch = e.changedTouches[0];
            if (!touch) return;

            estadoMuseo.joystickActivo = true;
            estadoMuseo.joystickTouchId = touch.identifier;
            const rect = dom.joystickBase.getBoundingClientRect();
            estadoMuseo.joystickCentroX = rect.left + rect.width / 2;
            moverJoystick(touch.clientX);
        }, { passive: false });

        window.addEventListener("touchmove", (e) => {
            if (!estadoMuseo.joystickActivo) return;
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                if (touch.identifier === estadoMuseo.joystickTouchId) {
                    if (e.cancelable) e.preventDefault();
                    e.stopPropagation();
                    moverJoystick(touch.clientX);
                    break;
                }
            }
        }, { passive: false });

        window.addEventListener("touchend", (e) => {
            if (!estadoMuseo.joystickActivo) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === estadoMuseo.joystickTouchId) {
                    e.stopPropagation();
                    soltarJoystick();
                    break;
                }
            }
        }, { passive: false });

        window.addEventListener("touchcancel", (e) => {
            if (estadoMuseo.joystickActivo) {
                e.stopPropagation();
                soltarJoystick();
            }
        }, { passive: false });

        // Fallback Mouse para pruebas en entorno de escritorio
        dom.joystickBase.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            estadoMuseo.joystickActivo = true;
            estadoMuseo.joystickTouchId = null;
            const rect = dom.joystickBase.getBoundingClientRect();
            estadoMuseo.joystickCentroX = rect.left + rect.width / 2;
            moverJoystick(e.clientX);
        });

        window.addEventListener("mousemove", (e) => {
            if (estadoMuseo.joystickActivo && estadoMuseo.joystickTouchId === null) {
                e.preventDefault();
                moverJoystick(e.clientX);
            }
        });

        window.addEventListener("mouseup", () => {
            if (estadoMuseo.joystickActivo && estadoMuseo.joystickTouchId === null) {
                soltarJoystick();
            }
        });
    }

    // Configuración de teclado y rueda de ratón para escritorio
    function setupTecladoYRueda() {
        window.addEventListener("keydown", (e) => {
            if (!estadoMuseo.activo) return;

            if (e.key === "ArrowLeft" || e.key === "KeyA" || e.code === "KeyA") {
                estadoMuseo.teclasPulsadas.izquierda = true;
            } else if (e.key === "ArrowRight" || e.key === "KeyD" || e.code === "KeyD") {
                estadoMuseo.teclasPulsadas.derecha = true;
            } else if (e.key === "Escape") {
                if (estadoMuseo.obraAbierta) {
                    cerrarSheetObra();
                } else {
                    cerrarMuseoAustral();
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            if (!estadoMuseo.activo) return;

            if (e.key === "ArrowLeft" || e.key === "KeyA" || e.code === "KeyA") {
                estadoMuseo.teclasPulsadas.izquierda = false;
            } else if (e.key === "ArrowRight" || e.key === "KeyD" || e.code === "KeyD") {
                estadoMuseo.teclasPulsadas.derecha = false;
            }
        });

        // Rueda de mouse para avanzar o retroceder suavemente
        window.addEventListener("wheel", (e) => {
            if (!estadoMuseo.activo || estadoMuseo.obraAbierta) return;
            const delta = Math.sign(e.deltaY || e.deltaX);
            estadoMuseo.posicionX += delta * 24;
            const config = obtenerConfigPasillo();
            const margenMin = config.esMovil ? 50 : 80;
            const margenMax = config.anchoPasillo - (config.esMovil ? 80 : 120);
            estadoMuseo.posicionX = Math.max(margenMin, Math.min(estadoMuseo.posicionX, margenMax));
            if (delta > 0) estadoMuseo.mirandoDerecha = true;
            else if (delta < 0) estadoMuseo.mirandoDerecha = false;
            actualizarPosicionPinguino();
            verificarProximidadObras();
        }, { passive: true });
    }

    // Traducir todos los textos de la interfaz del Museo
    function traducirInterfazMuseo() {
        const idm = getIdioma();
        const esEn = idm === "en";

        // Botón volver al mapa
        if (dom.txtVolverMapa) {
            dom.txtVolverMapa.textContent = esEn ? "Back to Map" : "Volver al Mapa";
        }

        // Joystick etiqueta
        if (dom.lblJoystick) {
            dom.lblJoystick.textContent = esEn ? "WALK" : "CAMINAR";
        }

        // Indicador de controles de escritorio
        if (dom.indicadorTeclas) {
            dom.indicadorTeclas.innerHTML = esEn
                ? "<span>⌨️ Use arrow keys <strong class='text-amber-400'>←</strong> / <strong class='text-amber-400'>→</strong> or mouse wheel to walk</span>"
                : "<span>⌨️ Usá las flechas <strong class='text-amber-400'>←</strong> / <strong class='text-amber-400'>→</strong> o la rueda del mouse para caminar</span>";
        }

        // Botón Salas flotante
        if (dom.lblBtnSalas) {
            dom.lblBtnSalas.textContent = esEn ? "Rooms" : "Salas";
        }

        // Modal Salas título
        if (dom.tituloModalSalas) {
            dom.tituloModalSalas.textContent = esEn ? "Austral Museum Rooms" : "Salas del Museo Austral";
        }

        // Ficha de Obra: encabezado colección
        if (dom.lblColeccion) {
            dom.lblColeccion.textContent = esEn ? "FUEGIAN HISTORICAL COLLECTION" : "COLECCIÓN HISTÓRICA FUEGUINA";
        }

        // Ficha de Obra: botones de navegación
        if (dom.textoObraAnterior) {
            dom.textoObraAnterior.textContent = esEn ? "Previous" : "Anterior";
        }
        if (dom.textoObraSiguiente) {
            dom.textoObraSiguiente.textContent = esEn ? "Next" : "Siguiente";
        }
        if (dom.textoSeguirRecorriendo) {
            dom.textoSeguirRecorriendo.textContent = esEn ? "Keep exploring" : "Seguir recorriendo";
        }

        // Audioguía botón
        actualizarBotonAudioguia();

        // Título de la sala en la barra superior (bilingüe y responsivo)
        actualizarTituloSala(estadoMuseo.salaIndex);
    }

    // Cambiar idioma del Museo y propagar a toda la aplicación
    function setIdiomaMuseo(nuevoIdioma) {
        if (nuevoIdioma !== "es" && nuevoIdioma !== "en") return;
        try {
            localStorage.setItem("rastro_austral_idioma", nuevoIdioma);
        } catch (_) {}
        window.idiomaActual = nuevoIdioma;

        if (typeof window.cambiarIdioma === "function") {
            window.cambiarIdioma(nuevoIdioma);
        }

        actualizarBotonesIdiomaMuseo();
    }

    // Sincronización de idiomas dentro del Museo
    function actualizarBotonesIdiomaMuseo() {
        const idm = getIdioma();
        if (dom.btnLangEs && dom.btnLangEn) {
            if (idm === "es") {
                dom.btnLangEs.className = "px-2.5 py-1 rounded-lg font-bold bg-amber-500 text-stone-950 transition cursor-pointer pointer-events-auto relative z-50 text-xs shadow-sm";
                dom.btnLangEn.className = "px-2.5 py-1 rounded-lg text-stone-300 hover:text-white transition cursor-pointer pointer-events-auto relative z-50 text-xs";
            } else {
                dom.btnLangEs.className = "px-2.5 py-1 rounded-lg text-stone-300 hover:text-white transition cursor-pointer pointer-events-auto relative z-50 text-xs";
                dom.btnLangEn.className = "px-2.5 py-1 rounded-lg font-bold bg-amber-500 text-stone-950 transition cursor-pointer pointer-events-auto relative z-50 text-xs shadow-sm";
            }
        }
        traducirInterfazMuseo();
        if (estadoMuseo.activo) {
            cargarSala(estadoMuseo.salaIndex);
            if (estadoMuseo.obraAbierta) {
                abrirSheetObra(estadoMuseo.obraAbierta);
            }
        }
    }

    // Conectar eventos globales y botones
    function setupEventos() {
        initDom();
        inicializarJoystickMuseo();
        setupTecladoYRueda();

        // Gesto táctil de deslizamiento (swipe horizontal) en el mural del pasillo
        if (dom.pasilloMuro) {
            let swipeStartX = 0;
            let swipeStartY = 0;
            let swiping = false;

            dom.pasilloMuro.addEventListener("touchstart", (e) => {
                if (estadoMuseo.obraAbierta || estadoMuseo.joystickActivo) return;
                const t = e.touches[0];
                if (!t) return;
                // Exclusión de la zona inferior izquierda reservada para el joystick
                if (t.clientX < 150 && t.clientY > window.innerHeight - 160) return;
                if (e.target.closest("#joystick-contenedor") || e.target.closest("#museo-joystick-base") || e.target.closest("#joystick-base-museo")) return;
                swipeStartX = t.clientX;
                swipeStartY = t.clientY;
                swiping = true;
            }, { passive: true });

            dom.pasilloMuro.addEventListener("touchmove", (e) => {
                if (!swiping || estadoMuseo.obraAbierta || estadoMuseo.joystickActivo) return;
                const t = e.touches[0];
                const dx = t.clientX - swipeStartX;
                const dy = t.clientY - swipeStartY;

                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
                    swipeStartX = t.clientX;
                    estadoMuseo.posicionX -= dx * 1.15;
                    const config = obtenerConfigPasillo();
                    const margenMin = config.esMovil ? 50 : 80;
                    const margenMax = config.anchoPasillo - (config.esMovil ? 80 : 120);
                    estadoMuseo.posicionX = Math.max(margenMin, Math.min(estadoMuseo.posicionX, margenMax));

                    if (dx < 0) estadoMuseo.mirandoDerecha = true;
                    else if (dx > 0) estadoMuseo.mirandoDerecha = false;

                    actualizarPosicionPinguino();
                    verificarProximidadObras();
                }
            }, { passive: true });

            dom.pasilloMuro.addEventListener("touchend", () => {
                swiping = false;
            }, { passive: true });
        }

        if (dom.btnCerrar) {
            dom.btnCerrar.addEventListener("click", cerrarMuseoAustral);
        }

        if (dom.btnPrevSala) {
            dom.btnPrevSala.addEventListener("click", () => {
                const total = (window.SALAS_MUSEO || []).length;
                const nuevoIdx = (estadoMuseo.salaIndex - 1 + total) % total;
                cargarSala(nuevoIdx);
            });
        }

        if (dom.btnNextSala) {
            dom.btnNextSala.addEventListener("click", () => {
                const total = (window.SALAS_MUSEO || []).length;
                const nuevoIdx = (estadoMuseo.salaIndex + 1) % total;
                cargarSala(nuevoIdx);
            });
        }

        if (dom.btnSalasDrawer) {
            dom.btnSalasDrawer.addEventListener("click", abrirDrawerSalas);
        }

        if (dom.btnCerrarDrawerSalas) {
            dom.btnCerrarDrawerSalas.addEventListener("click", cerrarDrawerSalas);
        }

        if (dom.btnCerrarSheet) {
            dom.btnCerrarSheet.addEventListener("click", cerrarSheetObra);
        }

        if (dom.btnSeguirRecorriendo) {
            dom.btnSeguirRecorriendo.addEventListener("click", cerrarSheetObra);
        }

        // Audioguía offline con síntesis de voz
        if (dom.btnAudioguia) {
            dom.btnAudioguia.addEventListener("click", alternarAudioguia);
        }

        // Navegación entre obras anterior / siguiente en la ficha
        if (dom.btnObraAnterior) {
            dom.btnObraAnterior.addEventListener("click", () => navegarObra(-1));
        }

        if (dom.btnObraSiguiente) {
            dom.btnObraSiguiente.addEventListener("click", () => navegarObra(1));
        }

        // Adaptación dinámica si el usuario rota la pantalla o redimensiona ventana
        window.addEventListener("resize", () => {
            if (!estadoMuseo.activo) return;
            const config = obtenerConfigPasillo();
            estadoMuseo.anchoPasillo = config.anchoPasillo;
            if (dom.pasilloMuro) dom.pasilloMuro.style.width = `${config.anchoPasillo}px`;
            const cols = dom.pasilloMuro ? dom.pasilloMuro.querySelectorAll(".columna-madera-museo") : [];
            cols.forEach((col, i) => {
                if (config.columnasX[i] !== undefined) col.style.left = `${config.columnasX[i]}px`;
            });
            const cuadros = dom.contenedorObras ? dom.contenedorObras.querySelectorAll(".cuadro-obra-museo") : [];
            cuadros.forEach((cuadro, idx) => {
                const posX = config.posicionesX[idx] || (config.posicionesX[0] + idx * 245);
                cuadro.style.left = `${posX}px`;
                cuadro.dataset.posX = posX;
            });
            actualizarPosicionPinguino();
        });

        // Conmutador de idioma en el Museo (soporta ambos esquemas de IDs)
        const btnEs = dom.btnLangEs || document.getElementById("btn-museo-idioma-es") || document.getElementById("btn-museo-lang-es");
        const btnEn = dom.btnLangEn || document.getElementById("btn-museo-idioma-en") || document.getElementById("btn-museo-lang-en");

        if (btnEs) {
            btnEs.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIdiomaMuseo("es");
            });
        }

        if (btnEn) {
            btnEn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIdiomaMuseo("en");
            });
        }

        // Botón en móvil dentro de #mobile-bottom-nav
        const btnNavMobile = document.getElementById("nav-mobile-museo");
        if (btnNavMobile) {
            btnNavMobile.addEventListener("click", () => {
                abrirMuseoAustral(0);
                if (typeof window.actualizarEstadoMobileNav === "function") {
                    window.actualizarEstadoMobileNav("museo");
                }
            });
        }

        // Botón píldora en escritorio dentro de <header>
        const btnHeaderDesktop = document.getElementById("btn-header-museo-desktop");
        if (btnHeaderDesktop) {
            btnHeaderDesktop.addEventListener("click", () => {
                abrirMuseoAustral(0);
            });
        }
    }

    // Inicializar al cargar el DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupEventos);
    } else {
        setupEventos();
    }

    // Exponer API pública en window
    window.abrirMuseoAustral = abrirMuseoAustral;
    window.cerrarMuseoAustral = cerrarMuseoAustral;
    window.actualizarBotonesIdiomaMuseo = actualizarBotonesIdiomaMuseo;
    window.inicializarJoystickMuseo = inicializarJoystickMuseo;
    window.actualizarTituloSala = actualizarTituloSala;

})();
