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
            btnPrevSala: document.getElementById("btn-prev-sala-museo"),
            btnNextSala: document.getElementById("btn-next-sala-museo"),
            tituloSalaNav: document.getElementById("titulo-sala-actual-museo"),
            btnSalasDrawer: document.getElementById("btn-abrir-menu-salas"),
            drawerSalas: document.getElementById("drawer-selector-salas"),
            listaSalasDrawer: document.getElementById("lista-salas-selector"),
            btnCerrarDrawerSalas: document.getElementById("btn-cerrar-drawer-salas"),
            pasilloMuro: document.getElementById("pasillo-muro-museo"),
            contenedorObras: document.getElementById("contenedor-obras-museo"),
            pinguinoMascota: document.getElementById("pinguino-mascota-museo"),
            joystickBase: document.getElementById("joystick-base-museo"),
            joystickPerilla: document.getElementById("joystick-perilla-museo"),
            sheetDetalle: document.getElementById("sheet-detalle-obra-museo"),
            btnCerrarSheet: document.getElementById("btn-cerrar-sheet-obra"),
            btnSeguirRecorriendo: document.getElementById("btn-seguir-recorriendo-obra"),
            sheetImg: document.getElementById("sheet-obra-img"),
            sheetTitulo: document.getElementById("sheet-obra-titulo"),
            sheetMeta: document.getElementById("sheet-obra-meta"),
            sheetDesc: document.getElementById("sheet-obra-desc"),
            sheetCredito: document.getElementById("sheet-obra-credito"),
            sheetHitoBadge: document.getElementById("sheet-obra-hito-badge"),
            btnLangEs: document.getElementById("btn-museo-lang-es"),
            btnLangEn: document.getElementById("btn-museo-lang-en")
        };
    }

    // Obtener idioma activo actual
    function getIdioma() {
        if (typeof window.idiomaActual === "string") return window.idiomaActual;
        return "es";
    }

    // Traducir texto bilingüe
    function tBilingue(objetoTexto) {
        if (!objetoTexto) return "";
        if (typeof objetoTexto === "string") return objetoTexto;
        const idioma = getIdioma();
        return objetoTexto[idioma] || objetoTexto.es || "";
    }

    // Abrir el Museo Austral 2D
    function abrirMuseoAustral(salaIndice = 0) {
        if (!dom.vista) initDom();
        if (!dom.vista) return;

        estadoMuseo.activo = true;
        estadoMuseo.salaIndex = Math.max(0, Math.min(salaIndice, (window.SALAS_MUSEO || []).length - 1));
        estadoMuseo.posicionX = 420;
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

        estadoMuseo.salaIndex = indice;
        const sala = salas[indice];

        // Actualizar título en la barra superior
        if (dom.tituloSalaNav) {
            const idioma = getIdioma();
            const prefijo = idioma === "en" ? `Room ${sala.numero} of ${salas.length}` : `Sala ${sala.numero} de ${salas.length}`;
            dom.tituloSalaNav.innerHTML = `<span class="text-amber-400 font-bold">${prefijo}</span> · <span>${tBilingue(sala.titulo).replace(/^Sala \d+: |^Room \d+: /, "")}</span>`;
        }

        // Posiciones espaciales amplias de los 3 cuadros en el pasillo (px) con columnas intercaladas
        const posicionesX = [420, 1020, 1620];

        // Renderizar cuadros de la sala
        if (dom.contenedorObras) {
            dom.contenedorObras.innerHTML = "";

            sala.obras.forEach((obra, idx) => {
                const posX = posicionesX[idx] || (420 + idx * 600);
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

    // Abrir ficha de obra (Bottom Sheet estilo pergamino)
    function abrirSheetObra(obra) {
        if (!dom.sheetDetalle) return;
        estadoMuseo.obraAbierta = obra;

        const titulo = tBilingue(obra.titulo);
        const lugar = tBilingue(obra.lugar);
        const desc = tBilingue(obra.descripcion);
        const anio = obra.anio || "";
        const fallbackSvg = window.generarSvgFallbackObra ? window.generarSvgFallbackObra(titulo, anio) : "";

        if (dom.sheetTitulo) dom.sheetTitulo.textContent = titulo;
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
                    <span class="font-semibold text-amber-950">${getIdioma() === "en" ? "Related landmark:" : "Corresponde al hito:"}</span>
                    <span class="text-amber-900 font-bold">${nombreHito}</span>
                `;
                dom.sheetHitoBadge.classList.remove("hidden");
            } else {
                dom.sheetHitoBadge.classList.add("hidden");
            }
        }

        dom.sheetDetalle.classList.remove("translate-y-full", "pointer-events-none");
        dom.sheetDetalle.classList.add("translate-y-0", "pointer-events-auto");
    }

    // Cerrar Bottom Sheet de obra
    function cerrarSheetObra() {
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
                        <h4 class="font-bold text-sm sm:text-base text-white tracking-wide truncate">${tBilingue(sala.titulo)}</h4>
                        ${esActiva ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">${getIdioma() === "en" ? "Current" : "En curso"}</span>` : ""}
                    </div>
                    <p class="text-xs text-amber-100 font-semibold mt-0.5 leading-snug">${tBilingue(sala.subtitulo)}</p>
                    <p class="text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">${tBilingue(sala.descripcionCorta)}</p>
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
            // Limitar al pasillo
            const margenMin = 80;
            const margenMax = estadoMuseo.anchoPasillo - 120;
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

        // Transformación del sprite del pingüino
        const escalaX = estadoMuseo.mirandoDerecha ? 1 : -1;
        dom.pinguinoMascota.style.transform = `translateX(${estadoMuseo.posicionX}px) scaleX(${escalaX})`;

        if (estadoMuseo.caminando) {
            dom.pinguinoMascota.classList.add("pinguino-caminando-museo");
        } else {
            dom.pinguinoMascota.classList.remove("pinguino-caminando-museo");
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

    // Manejo de controles táctiles: Joystick
    function setupJoystick() {
        if (!dom.joystickBase || !dom.joystickPerilla) return;

        function iniciarArrastre(clientX, clientY, touchId = null) {
            estadoMuseo.joystickActivo = true;
            estadoMuseo.joystickTouchId = touchId;
            const rect = dom.joystickBase.getBoundingClientRect();
            estadoMuseo.joystickCentroX = rect.left + rect.width / 2;
            estadoMuseo.joystickCentroY = rect.top + rect.height / 2;
            moverPerilla(clientX, clientY);
        }

        function moverPerilla(clientX, clientY) {
            if (!estadoMuseo.joystickActivo) return;

            const dx = clientX - estadoMuseo.joystickCentroX;
            const dy = clientY - estadoMuseo.joystickCentroY;
            const distancia = Math.hypot(dx, dy);
            const radioMax = estadoMuseo.joystickRadioMax;

            let finalX = dx;
            let finalY = dy;

            if (distancia > radioMax) {
                const angulo = Math.atan2(dy, dx);
                finalX = Math.cos(angulo) * radioMax;
                finalY = Math.sin(angulo) * radioMax;
            }

            dom.joystickPerilla.style.transform = `translate(${finalX}px, ${finalY}px)`;

            // Normalizar velocidad horizontal entre -1 y 1
            const factorX = Math.max(-1, Math.min(1, finalX / radioMax));
            estadoMuseo.velocidadX = factorX;
        }

        function soltarPerilla() {
            estadoMuseo.joystickActivo = false;
            estadoMuseo.joystickTouchId = null;
            estadoMuseo.velocidadX = 0;
            if (dom.joystickPerilla) {
                dom.joystickPerilla.style.transform = "translate(0px, 0px)";
            }
        }

        // Eventos táctiles
        dom.joystickBase.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            iniciarArrastre(touch.clientX, touch.clientY, touch.identifier);
        }, { passive: false });

        window.addEventListener("touchmove", (e) => {
            if (!estadoMuseo.joystickActivo) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === estadoMuseo.joystickTouchId) {
                    moverPerilla(touch.clientX, touch.clientY);
                    break;
                }
            }
        }, { passive: false });

        window.addEventListener("touchend", (e) => {
            if (!estadoMuseo.joystickActivo) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === estadoMuseo.joystickTouchId) {
                    soltarPerilla();
                    break;
                }
            }
        });

        window.addEventListener("touchcancel", soltarPerilla);

        // Soporte mouse para arrastrar el joystick en escritorio
        dom.joystickBase.addEventListener("mousedown", (e) => {
            iniciarArrastre(e.clientX, e.clientY);
        });

        window.addEventListener("mousemove", (e) => {
            if (estadoMuseo.joystickActivo && estadoMuseo.joystickTouchId === null) {
                moverPerilla(e.clientX, e.clientY);
            }
        });

        window.addEventListener("mouseup", () => {
            if (estadoMuseo.joystickActivo && estadoMuseo.joystickTouchId === null) {
                soltarPerilla();
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
            const margenMin = 80;
            const margenMax = estadoMuseo.anchoPasillo - 120;
            estadoMuseo.posicionX = Math.max(margenMin, Math.min(estadoMuseo.posicionX, margenMax));
            if (delta > 0) estadoMuseo.mirandoDerecha = true;
            else if (delta < 0) estadoMuseo.mirandoDerecha = false;
            actualizarPosicionPinguino();
            verificarProximidadObras();
        }, { passive: true });
    }

    // Sincronización de idiomas dentro del Museo
    function actualizarBotonesIdiomaMuseo() {
        const idm = getIdioma();
        if (dom.btnLangEs && dom.btnLangEn) {
            if (idm === "es") {
                dom.btnLangEs.className = "px-2 py-0.5 rounded font-bold bg-amber-600 text-white transition";
                dom.btnLangEn.className = "px-2 py-0.5 rounded text-amber-200/60 hover:text-white transition";
            } else {
                dom.btnLangEs.className = "px-2 py-0.5 rounded text-amber-200/60 hover:text-white transition";
                dom.btnLangEn.className = "px-2 py-0.5 rounded font-bold bg-amber-600 text-white transition";
            }
        }
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
        setupJoystick();
        setupTecladoYRueda();

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

        // Conmutador de idioma en el Museo
        if (dom.btnLangEs) {
            dom.btnLangEs.addEventListener("click", () => {
                if (typeof window.cambiarIdioma === "function") {
                    window.cambiarIdioma("es");
                }
                actualizarBotonesIdiomaMuseo();
            });
        }

        if (dom.btnLangEn) {
            dom.btnLangEn.addEventListener("click", () => {
                if (typeof window.cambiarIdioma === "function") {
                    window.cambiarIdioma("en");
                }
                actualizarBotonesIdiomaMuseo();
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

})();
