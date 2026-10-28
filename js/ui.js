// =========================================================
// CUENTAPP · Utilidades de interfaz compartidas
// =========================================================
(function () {
  const api = window.CuentApp.api;

  // ---------- Iconos (trazo, 24x24) ----------
  const I = {
    panel: '<path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 4v3h6V4z"/>',
    subir: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    docs: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    exportar: '<path d="M4 4h16v16H4z"/><path d="M4 10h16M10 4v16"/>',
    salir: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
    camara: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    correo: '<path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>',
    nube: '<path d="M7 18a5 5 0 0 1-.6-9.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
    alerta: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    descargar: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
    mas: '<path d="M12 5v14M5 12h14"/>',
    menos: '<path d="M5 12h14"/>',
    papelera: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    lupaMas: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5M11 8v6M8 11h6"/>',
    lupaMenos: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5M8 11h6"/>',
    girar: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/>',
    volver: '<path d="M15 6l-6 6 6 6"/>',
    // Flecha curva dibujada a mano, como la del diseño de referencia
    flecha: '<path d="M5 19c2-6 6-11 13-13" stroke-width="1.8"/><path d="M12 5.5 18.5 6l-1.5 6" stroke-width="1.8"/>'
  };
  function icono(nombre, clase = "") {
    return `<svg class="${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[nombre] || ""}</svg>`;
  }

  // ---------- Formato ----------
  const fmtEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
  function dinero(n, moneda = "EUR") {
    if (n == null || n === "") return "—";
    try { return new Intl.NumberFormat("es-ES", { style: "currency", currency: moneda }).format(n); }
    catch (e) { return fmtEUR.format(n); }
  }
  function fecha(iso) {
    if (!iso) return "—";
    const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  }
  function nombreTrimestre(t) {
    const [a, q] = t.split("-T");
    return q + "T " + a;
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const ESTADOS = {
    recibido: ["Recibido", "p-gris"],
    procesando: ["Procesando", "p-gris"],
    pendiente: ["Pendiente de revisión", "p-ambar"],
    validado: ["Validado", "p-verde"],
    incidencia: ["Incidencia", "p-rojo"],
    descartado: ["Descartado", "p-gris"]
  };
  function pildoraEstado(doc) {
    const nivel = api.nivelDocumento(doc);
    let [texto, clase] = ESTADOS[doc.estado] || [doc.estado, "p-gris"];
    // Un validado con avisos aceptados sigue verde; un pendiente con bloqueo pasa a rojo
    if (nivel === "rojo") clase = "p-rojo";
    return `<span class="pildora ${clase}">${texto}</span>`;
  }
  const ORIGEN = { foto: "Foto móvil", archivo: "Archivo", correo: "Correo" };

  const TEXTO_SEMAFORO = {
    verde: ["Listo para la gestoría", "Todos los documentos del trimestre están revisados y sin incidencias."],
    ambar: ["Hay documentos por revisar", "Revisa los justificantes señalados antes de cerrar el trimestre."],
    rojo: ["Hay incidencias bloqueantes", "Resuelve duplicados o documentos ilegibles antes de dar el trimestre por preparado."],
    vacio: ["Sin documentos", "Todavía no hay justificantes registrados en este trimestre."]
  };

  // ---------- Toast ----------
  let toastEl, toastT;
  function aviso(texto) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = texto;
    toastEl.classList.add("visible");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("visible"), 2800);
  }

  // ---------- Estructura de la zona privada ----------
  const NAV = [
    ["panel", "panel.html", "Panel"],
    ["documentos", "documentos.html", "Documentos"],
    ["subir", "subir.html", "Subir"],
    ["exportar", "exportar.html", "Exportar"]
  ];
  const ICONO_NAV = { panel: "panel", documentos: "docs", subir: "subir", exportar: "exportar" };

  async function montarApp(paginaActiva) {
    const sesion = api.sesionActual();
    if (!sesion) { location.href = "login.html"; return null; }
    const emp = await api.empresa();
    const diasPrueba = Math.max(0, Math.ceil((new Date(emp.prueba_fin) - new Date()) / 86400000));
    const pct = Math.min(100, Math.round(emp.usados / emp.limite * 100));

    const logo = '<a class="logo" href="panel.html"><b>CUENTAPP</b></a>';
    const items = NAV.map(([k, href, t]) =>
      `<a class="nav-item${k === paginaActiva ? " activo" : ""}" href="${href}">${icono(ICONO_NAV[k])}${t}</a>`).join("");
    const lateral = `
      <aside class="lateral">
        ${logo}
        ${items}
        <div class="lateral-pie">
          <b>${esc(emp.nombre)}</b>
          ${emp.plan === "prueba" ? `Prueba · quedan ${diasPrueba} días` : "Plan CUENTAPP"}
          <div class="uso-barra"><i style="width:${pct}%"></i></div>
          ${emp.usados} / ${emp.limite} documentos
          <button id="btn-reiniciar" class="btn btn-fantasma btn-sm" style="color:var(--arena);padding:8px 0;margin-top:8px">Reiniciar datos de ejemplo</button>
        </div>
      </aside>`;
    const iniciales = (sesion.nombre || "?").slice(0, 1).toUpperCase();
    const barra = `
      <header class="barra-sup">
        ${logo}
        <span class="etiqueta oculto-movil">${esc(emp.nombre)}</span>
        <div class="usuario">
          <span class="suave" style="display:none" data-escritorio>${esc(sesion.email)}</span>
          <div class="avatar" title="${esc(sesion.email)}">${esc(iniciales)}</div>
          <button class="btn btn-fantasma btn-sm" id="btn-salir" title="Cerrar sesión">${icono("salir")}<span>Salir</span></button>
        </div>
      </header>`;
    const movil = `<nav class="nav-movil" aria-label="Navegación">${NAV.map(([k, href, t]) =>
      `<a href="${href}" class="${k === paginaActiva ? "activo" : ""}">${icono(ICONO_NAV[k])}${t}</a>`).join("")}</nav>`;

    const contenido = document.getElementById("contenido");
    const app = document.createElement("div");
    app.className = "app";
    app.innerHTML = lateral + `<div class="principal">${barra}</div>`;
    contenido.parentNode.insertBefore(app, contenido);
    app.querySelector(".principal").appendChild(contenido);
    document.body.insertAdjacentHTML("beforeend", movil);
    if (window.matchMedia("(min-width: 720px)").matches) app.querySelector("[data-escritorio]").style.display = "";

    document.getElementById("btn-salir").addEventListener("click", async () => {
      await api.cerrarSesion();
      location.href = "login.html";
    });
    document.getElementById("btn-reiniciar").addEventListener("click", () => {
      if (!confirm("¿Volver a los datos de ejemplo? Se perderán los cambios hechos en esta demo.")) return;
      api.reiniciarDemo();
      location.href = "panel.html";
    });
    return { sesion, empresa: emp };
  }

  function parametro(nombre) { return new URLSearchParams(location.search).get(nombre); }

  window.CuentApp.ui = { icono, dinero, fecha, nombreTrimestre, esc, pildoraEstado, ORIGEN, TEXTO_SEMAFORO, aviso, montarApp, parametro };
})();
