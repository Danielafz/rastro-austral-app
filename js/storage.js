// ==========================================
// RASTRO AUSTRAL - GESTOR DE PERSISTENCIA LOCAL
// Cumplimiento Ley 25.326: Almacenamiento local exclusivo
// ==========================================

const CLAVE_VISITAS = "rastro_austral_visitas";
const CLAVE_NOTAS = "rastro_austral_notas";
const CLAVE_EXPLORADOR = "rastro_austral_explorador";
const CLAVE_TEMA = "rastro_austral_tema";
const CLAVE_CACHE_HITOS = "rastro_austral_cache_hitos";
const CLAVE_CACHE_AREAS = "rastro_austral_cache_areas";
const CLAVE_CACHE_OBSERVATORIO = "rastro_austral_cache_observatorio";
const CLAVE_CACHE_TIMESTAMP = "rastro_austral_cache_timestamp";

// Obtener tema preferido (dark o light)
function obtenerTema() {
    try {
        return localStorage.getItem(CLAVE_TEMA) || "dark";
    } catch (e) {
        return "dark";
    }
}

// Guardar tema preferido
function guardarTema(tema) {
    try {
        localStorage.setItem(CLAVE_TEMA, tema);
    } catch (e) {
        console.error("Error al guardar tema:", e);
    }
}

// Obtener nombre del explorador/a
function obtenerNombreExplorador() {
    try {
        return localStorage.getItem(CLAVE_EXPLORADOR) || "";
    } catch (e) {
        console.error("Error al leer nombre de explorador:", e);
        return "";
    }
}

// Guardar nombre del explorador/a
function guardarNombreExplorador(nombre) {
    try {
        if (nombre && nombre.trim().length > 0) {
            localStorage.setItem(CLAVE_EXPLORADOR, nombre.trim());
        } else {
            localStorage.removeItem(CLAVE_EXPLORADOR);
        }
    } catch (e) {
        console.error("Error al guardar nombre de explorador:", e);
    }
}

// Obtener lista de IDs de sitios visitados
function obtenerVisitas() {
    try {
        const datos = localStorage.getItem(CLAVE_VISITAS);
        return datos ? JSON.parse(datos) : [];
    } catch (e) {
        console.error("Error al leer visitas locales:", e);
        return [];
    }
}

// Alternar estado de visita (marcar / desmarcar)
function alternarVisita(idHito) {
    let visitas = obtenerVisitas();
    if (visitas.includes(idHito)) {
        visitas = visitas.filter(id => id !== idHito);
    } else {
        visitas.push(idHito);
    }
    try {
        localStorage.setItem(CLAVE_VISITAS, JSON.stringify(visitas));
    } catch (e) {
        console.error("Error al guardar visita local:", e);
    }
    return visitas;
}

// Obtener todas las notas personales
function obtenerTodasLasNotas() {
    try {
        const datos = localStorage.getItem(CLAVE_NOTAS);
        return datos ? JSON.parse(datos) : {};
    } catch (e) {
        console.error("Error al leer notas locales:", e);
        return {};
    }
}

// Obtener nota personal de un hito específico
function obtenerNota(idHito) {
    const notas = obtenerTodasLasNotas();
    return notas[idHito] || "";
}

// Guardar o actualizar la nota personal de un hito
function guardarNota(idHito, texto) {
    const notas = obtenerTodasLasNotas();
    if (texto && texto.trim().length > 0) {
        notas[idHito] = texto.trim();
    } else {
        delete notas[idHito];
    }
    try {
        localStorage.setItem(CLAVE_NOTAS, JSON.stringify(notas));
    } catch (e) {
        console.error("Error al guardar nota local:", e);
    }
    return notas;
}

// Exportar la bitácora personal en un archivo de texto descargable (Bilingüe)
function exportarBitacoraTexto(todosLosHitos, idioma = "es") {
    const visitas = obtenerVisitas();
    const hitosVisitados = todosLosHitos.filter(h => visitas.includes(h.id));
    const esIngles = idioma === "en";

    const fecha = new Date().toLocaleDateString(esIngles ? "en-US" : "es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let texto = "========================================================\n";
    texto += esIngles
        ? "           RASTRO AUSTRAL · MY FUEGIAN JOURNAL          \n"
        : "           RASTRO AUSTRAL · MI BITÁCORA FUEGUINA        \n";
    texto += esIngles
        ? "           Atlas & Territorial Exploration Journal      \n"
        : "           Atlas y Diario de Exploración Territorial    \n";
    texto += "========================================================\n\n";
    texto += esIngles ? `Export date: ${fecha}\n` : `Fecha de exportación: ${fecha}\n`;
    const nombreExplorador = obtenerNombreExplorador();
    if (nombreExplorador) {
        texto += esIngles
            ? `Explorer: ${nombreExplorador}\n`
            : `Expedicionario/a: ${nombreExplorador}\n`;
    }
    texto += esIngles
        ? `Sites recorded in my Trail: ${hitosVisitados.length} of ${todosLosHitos.length}\n`
        : `Sitios registrados en mi Rastro: ${hitosVisitados.length} de ${todosLosHitos.length}\n`;
    texto += esIngles
        ? `Official sources: IDETDF · IGN · CADIC-CONICET\n\n`
        : `Fuentes oficiales: IDETDF · IGN · CADIC-CONICET\n\n`;
    texto += "--------------------------------------------------------\n";
    texto += esIngles ? "COMPLETED SITES AND TRAILS:\n" : "HITOS Y RECORRIDOS COMPLETADOS:\n";
    texto += "--------------------------------------------------------\n\n";

    if (hitosVisitados.length === 0) {
        texto += esIngles
            ? "You have not recorded sites in your journal yet.\nExplore the map and mark points as you visit or discover them.\n"
            : "Aún no has registrado sitios en tu bitácora.\nExplorá el mapa y marcá los puntos que visites o descubras.\n";
    } else {
        hitosVisitados.forEach((h, index) => {
            const nota = obtenerNota(h.id);
            const nombre = (esIngles && h.nombre_en) ? h.nombre_en : h.nombre;
            const conducta = (esIngles && h.conducta_en) ? h.conducta_en : h.conducta;

            texto += `[${index + 1}] ${nombre.toUpperCase()}\n`;
            texto += esIngles ? `    Locality: ${h.localidad}\n` : `    Localidad: ${h.localidad}\n`;
            texto += esIngles ? `    Toponymy: ${h.toponimia}\n` : `    Toponimia: ${h.toponimia}\n`;
            texto += esIngles ? `    Category: ${h.categoria.replace('_', ' ')}\n` : `    Categoría: ${h.categoria.replace('_', ' ')}\n`;
            texto += esIngles ? `    Conservation rule: ${conducta}\n` : `    Pauta de conservación: ${conducta}\n`;
            texto += esIngles ? `    Source: ${h.fuente}\n` : `    Fuente: ${h.fuente}\n`;
            if (nota) {
                texto += esIngles ? `    Personal note: "${nota}"\n` : `    Nota personal: "${nota}"\n`;
            }
            texto += "\n";
        });
    }

    texto += "========================================================\n";
    texto += "Equipo VolverAlSur · Hackatón Soberanía Tech 2026\n";
    texto += "========================================================\n";

    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = esIngles ? "My_Rastro_Austral_Journal.txt" : "Mi_Rastro_Austral_Bitacora.txt";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(enlace.href);
}

function escaparHtmlPDF(texto) {
    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Exportar la bitácora personal como documento PDF editorial de Pasaporte Austral
async function exportarBitacoraPDF(todosLosHitos, idioma = "es") {
    if (typeof window.html2pdf !== "function") {
        exportarBitacoraTexto(todosLosHitos, idioma);
        return;
    }

    const visitas = obtenerVisitas();
    const hitosVisitados = todosLosHitos.filter(h => visitas.includes(h.id));
    const esIngles = idioma === "en";
    const nombreExplorador = obtenerNombreExplorador() || (esIngles ? "Austral Explorer" : "Explorador/a Austral");

    const fecha = new Date().toLocaleDateString(esIngles ? "en-US" : "es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const hitosFragiles = hitosVisitados.filter(h => h.fragilidad === "Alta" || h.fragilidad === "Muy Alta").length;
    const esGuardian = hitosFragiles >= 2;
    const porcentaje = todosLosHitos.length > 0
        ? Math.round((hitosVisitados.length / todosLosHitos.length) * 100)
        : 0;

    const tarjetasHtml = hitosVisitados.length === 0
        ? `
          <div style="border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 28px 20px; text-align: center; background: #f8fafc; margin: 16px 0;">
            <p style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 6px;">
              ${esIngles ? "No sites recorded in your passport yet" : "Aún no registraste sitios en tu pasaporte"}
            </p>
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              ${esIngles ? "Explore the map of Tierra del Fuego and stamp the sites you discover." : "Explorá el mapa de Tierra del Fuego y sellá los hitos que vayas descubriendo."}
            </p>
          </div>
        `
        : hitosVisitados.map((h, index) => {
            const nota = obtenerNota(h.id);
            const nombre = (esIngles && h.nombre_en) ? h.nombre_en : h.nombre;
            const fragilidad = (esIngles && h.fragilidad_en) ? h.fragilidad_en : h.fragilidad;
            const conducta = (esIngles && h.conducta_en) ? h.conducta_en : h.conducta;
            const categoria = String(h.categoria || "").replace("_", " ");
            const numeroSello = String(index + 1).padStart(2, "0");

            return `
              <div style="border: 1px solid #cbd5e1; border-left: 4px solid #d97706; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; background: #ffffff; page-break-inside: avoid; break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 6px;">
                  <div>
                    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #b45309;">
                      ${esIngles ? "STAMP" : "SELLO"} #${numeroSello} · ${escaparHtmlPDF(h.localidad)} · ${escaparHtmlPDF(categoria)}
                    </div>
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 2px 0 0;">
                      ${escaparHtmlPDF(nombre)}
                    </h3>
                  </div>
                  <div style="flex-shrink: 0; border: 1.5px solid #059669; color: #047857; background: #ecfdf5; border-radius: 999px; padding: 2px 9px; font-size: 10px; font-weight: 800; letter-spacing: 0.04em;">
                    ${esIngles ? "VISITED ✓" : "SELLADO ✓"}
                  </div>
                </div>

                <div style="font-size: 11px; color: #92400e; font-family: monospace; margin-bottom: 6px;">
                  ${esIngles ? "Toponymy" : "Toponimia"}: ${escaparHtmlPDF(h.toponimia)}
                </div>

                <div style="font-size: 11px; color: #334155; line-height: 1.45; margin-bottom: 6px;">
                  <strong style="color: #0f172a;">${esIngles ? "Fragility" : "Fragilidad"}:</strong> ${escaparHtmlPDF(fragilidad)}
                  &nbsp;·&nbsp;
                  <strong style="color: #0f172a;">${esIngles ? "Conduct" : "Conducta"}:</strong> ${escaparHtmlPDF(conducta)}
                </div>

                ${nota ? `
                  <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 7px 10px; margin-top: 6px; font-size: 11px; color: #78350f;">
                    <strong>${esIngles ? "Field note" : "Nota de campo"}:</strong> “${escaparHtmlPDF(nota)}”
                  </div>
                ` : ""}

                <div style="font-size: 9.5px; color: #64748b; margin-top: 6px;">
                  ${esIngles ? "Source" : "Fuente"}: ${escaparHtmlPDF(h.fuente)}
                </div>
              </div>
            `;
        }).join("");

    const contenedor = document.createElement("div");
    contenedor.style.cssText = "width: 730px; background: #ffffff; color: #0f172a; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; padding: 18px 22px; box-sizing: border-box;";

    contenedor.innerHTML = `
      <div style="border: 2px solid #0f172a; border-radius: 14px; padding: 18px; background: #ffffff;">
        <!-- Cabecera Editorial de Pasaporte -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg width="42" height="48" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1C24.5 1 31 7.5 31 16C31 27 16 37 16 37C16 37 1 27 1 16C1 7.5 7.5 1 16 1Z" fill="#0f172a" stroke="#d97706" stroke-width="2"/>
              <path d="M1 21C6 19 10 24 16 22C22 20 26 24 31 22V24C28 29 20 35 16 36.5C12 35 4 29 1 24V21Z" fill="#0284c7"/>
              <path d="M16 14C11 11 6 12 3 14C8 16 13 16 16 18C19 16 24 16 29 14C26 12 21 11 16 14Z" fill="#ffffff"/>
              <circle cx="16" cy="5" r="1" fill="#fde047"/>
              <circle cx="16" cy="9.5" r="1" fill="#fde047"/>
              <circle cx="13" cy="7" r="1" fill="#fde047"/>
              <circle cx="19" cy="6.5" r="1" fill="#fde047"/>
            </svg>
            <div>
              <div style="font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: #b45309; text-transform: uppercase;">
                ${esIngles ? "TIERRA DEL FUEGO · TERRITORIAL PASSPORT" : "TIERRA DEL FUEGO · PASAPORTE TERRITORIAL"}
              </div>
              <h1 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 2px 0;">
                ${esIngles ? "RASTRO AUSTRAL · EXPEDITION JOURNAL" : "RASTRO AUSTRAL · BITÁCORA DE EXPEDICIÓN"}
              </h1>
              <div style="font-size: 11px; color: #475569;">
                ${esIngles ? "Atlas & Conscious Exploration Logbook" : "Atlas y Diario de Exploración Territorial Consciente"}
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="display: inline-block; background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800;">
              ${esGuardian ? (esIngles ? "SOUTHERN GUARDIAN" : "GUARDIÁN AUSTRAL") : (esIngles ? "ACTIVE EXPLORER" : "EXPEDICIONARIO/A")}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 5px;">${escaparHtmlPDF(fecha)}</div>
          </div>
        </div>

        <!-- Ficha de Identidad y Progreso -->
        <div style="display: flex; justify-content: space-between; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; margin-bottom: 16px;">
          <div>
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">
              ${esIngles ? "Explorer" : "Expedicionario/a"}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${escaparHtmlPDF(nombreExplorador)}</div>
          </div>
          <div>
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">
              ${esIngles ? "Recorded Stamps" : "Sellos Registrados"}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #b45309;">${hitosVisitados.length} / ${todosLosHitos.length} (${porcentaje}%)</div>
          </div>
          <div>
            <div style="font-size: 9.5px; text-transform: uppercase; color: #64748b; font-weight: 700;">
              ${esIngles ? "Conservation Sites" : "Sitios de Alta Fragilidad"}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #047857;">${hitosFragiles}</div>
          </div>
        </div>

        <!-- Cuerpo de Sellos y Notas -->
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #334155; margin-bottom: 10px;">
          ${esIngles ? "Stamped Territorial Sites & Field Notes" : "Hitos Sellados y Notas de Campo"}
        </div>

        ${tarjetasHtml}

        <!-- Pie Legal e Institucional -->
        <div style="border-top: 1px solid #e2e8f0; margin-top: 14px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b;">
          <span>${esIngles ? "Sovereign Local Privacy (Law 25.326) · IDETDF · IGN · CADIC-CONICET" : "Privacidad Soberana (Ley 25.326) · IDETDF · IGN · CADIC-CONICET"}</span>
          <span>VolverAlSur · Rastro Austral</span>
        </div>
      </div>
    `;

    const nombreArchivo = esIngles
        ? "Rastro_Austral_Expedition_Passport.pdf"
        : "Rastro_Austral_Pasaporte_Bitacora.pdf";

    await window.html2pdf()
        .set({
            margin: [8, 8, 8, 8],
            filename: nombreArchivo,
            image: { type: "jpeg", quality: 0.96 },
            html2canvas: { scale: 2, backgroundColor: "#ffffff", logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] }
        })
        .from(contenedor)
        .save();
}

// ==========================================
// CACHÉ TERRITORIAL OFFLINE (EXPEDICIÓN SIN SEÑAL)
// ==========================================

function guardarPaqueteOffline(hitos, areasGeojson = null) {
    try {
        if (Array.isArray(hitos) && hitos.length > 0) {
            localStorage.setItem(CLAVE_CACHE_HITOS, JSON.stringify(hitos));
        }
        if (areasGeojson) {
            localStorage.setItem(CLAVE_CACHE_AREAS, JSON.stringify(areasGeojson));
        }
        const timestamp = new Date().toISOString();
        localStorage.setItem(CLAVE_CACHE_TIMESTAMP, timestamp);
        return timestamp;
    } catch (e) {
        console.error("Error al guardar paquete territorial offline:", e);
        return null;
    }
}

function obtenerHitosOffline() {
    try {
        const raw = localStorage.getItem(CLAVE_CACHE_HITOS);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function obtenerAreasOffline() {
    try {
        const raw = localStorage.getItem(CLAVE_CACHE_AREAS);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function obtenerTimestampOffline() {
    try {
        return localStorage.getItem(CLAVE_CACHE_TIMESTAMP) || null;
    } catch (e) {
        return null;
    }
}

function guardarObservatorioOffline(datos) {
    try {
        if (datos && typeof datos === "object") {
            localStorage.setItem(CLAVE_CACHE_OBSERVATORIO, JSON.stringify(datos));
        }
    } catch (e) {
        console.error("Error al guardar caché de observatorio:", e);
    }
}

function obtenerObservatorioOffline() {
    try {
        const raw = localStorage.getItem(CLAVE_CACHE_OBSERVATORIO);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}
