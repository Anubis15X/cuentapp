// =========================================================
// CUENTAPP · Capa de datos
//
// Todas las páginas leen y escriben datos SOLO a través de
// `CuentApp.api`. En modo "demo" se usan datos de ejemplo
// guardados en localStorage. Para conectar Supabase basta con
// reimplementar estas funciones (mismos nombres y mismas
// respuestas); cada una indica la consulta equivalente.
// =========================================================
(function () {
  const CFG = window.CUENTAPP_CONFIG;
  const CLAVE_DATOS = "cuentapp_demo_v1";
  const CLAVE_SESION = "cuentapp_sesion";
  const CLAVE_ORIGINAL = "cuentapp_original_";

  // ---------- Datos de ejemplo ----------
  // Empresa ficticia. Fechas en formato ISO (AAAA-MM-DD).
  const EMPRESA_DEMO = {
    id: "emp_demo",
    nombre: "Panadería Ejemplo S.L.",
    nif: "B12345678",
    plan: "prueba",
    prueba_inicio: "2026-10-20",
    prueba_fin: "2026-11-03",
    buzon: "facturas-k7m2q9xr@" + CFG.dominioBuzon,
    drive_conectado: false
  };

  const iva = (base, tipo, cuota) => ({ base, tipo, cuota });

  function facturaVacia() {
    return {
      fecha: null, emisor: null, nif_emisor: null, nif_receptor: null, numero: null,
      tipo: null, categoria: null, moneda: "EUR", iva: [], total: null,
      tipo_cambio: null, fecha_cambio: null, fuente_cambio: null, total_eur: null
    };
  }

  const DOCS_DEMO = [
    {
      id: "doc_001", archivo: "ticket_gasolinera.jpg", formato: "JPG", origen: "foto",
      huella: "a1f3c9e0b7d24c118e5f6a90b3d7e2c41f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c",
      recibido_en: "2026-10-12T09:02:00", estado: "pendiente",
      original: "assets/originales/gasolinera-arrugado.svg",
      factura: { fecha: "2026-10-12", emisor: "Estación de Servicio Los Pinos", nif_emisor: "B47123456", nif_receptor: null,
        numero: "T-004512", tipo: "simplificada", categoria: "Combustible", moneda: "EUR",
        iva: [iva(45.45, 21, 9.55)], total: 55.00, total_eur: 55.00 },
      dudosos: ["numero"], incidencias: [],
      historial: [{ fecha: "2026-10-12T09:02:00", texto: "Recibido por foto desde el móvil" }, { fecha: "2026-10-12T09:02:20", texto: "Lectura automática completada (1 campo dudoso)" }]
    },
    {
      id: "doc_002", archivo: "super_ribera_15oct.pdf", formato: "PDF", origen: "archivo",
      huella: "5e8d2b7a9c0f41e3b6d8a2c4e6f80b1d3f5a7c9e1b3d5f7a9c0e2b4d6f8a0c2e",
      recibido_en: "2026-10-15T19:10:00", estado: "validado",
      original: "assets/originales/super-varios-iva.svg",
      factura: { fecha: "2026-10-15", emisor: "Supermercados Ribera S.A.", nif_emisor: "A28456789", nif_receptor: null,
        numero: "2026/118734", tipo: "simplificada", categoria: "Suministros y compras", moneda: "EUR",
        iva: [iva(12.50, 4, 0.50), iva(20.00, 10, 2.00), iva(8.26, 21, 1.74)], total: 45.00, total_eur: 45.00 },
      dudosos: [], incidencias: [],
      historial: [{ fecha: "2026-10-15T19:10:00", texto: "Subido arrastrando archivo" }, { fecha: "2026-10-16T10:00:00", texto: "Validado por Ana" }]
    },
    {
      id: "doc_003", archivo: "Figma_invoice_INV-2026-10-88412.pdf", formato: "PDF", origen: "correo",
      huella: "c7b9e1d3f5a7092b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b",
      recibido_en: "2026-10-03T07:30:00", estado: "pendiente",
      original: "assets/originales/figma-invoice.svg",
      factura: { fecha: "2026-10-03", emisor: "Figma, Inc.", nif_emisor: "US 77-0582346", nif_receptor: "B12345678",
        numero: "INV-2026-10-88412", tipo: "completa", categoria: null, moneda: "USD",
        iva: [iva(15.00, 0, 0)], total: 15.00, tipo_cambio: 1.0850, fecha_cambio: "2026-10-02", fuente_cambio: "BCE (referencia)", total_eur: 13.82 },
      dudosos: ["categoria"], incidencias: [{ tipo: "categoria", gravedad: "aviso", mensaje: "Sin categoría asignada", resuelta: false }],
      historial: [{ fecha: "2026-10-03T07:30:00", texto: "Recibido en el buzón de la empresa" }, { fecha: "2026-10-03T07:30:25", texto: "Moneda USD convertida a EUR con tipo de referencia" }]
    },
    {
      id: "doc_004", archivo: "IMG_2041.jpg", formato: "JPG", origen: "foto",
      huella: "0f2e4d6c8b0a1f3e5d7c9b1a3f5e7d9c1b3a5f7e9d1c3b5a7f9e1d3c5b7a9f1e",
      recibido_en: "2026-10-21T15:05:00", estado: "pendiente",
      original: "assets/originales/bar-torcida.svg",
      factura: { fecha: "2026-10-21", emisor: "Bar La Esquina", nif_emisor: null, nif_receptor: null,
        numero: "000873", tipo: "simplificada", categoria: "Restauración", moneda: "EUR",
        iva: [iva(30.00, 10, 3.00)], total: 33.00, total_eur: 33.00 },
      dudosos: ["nif_emisor", "fecha"], incidencias: [{ tipo: "nif", gravedad: "aviso", mensaje: "No se ha podido leer el NIF del emisor", resuelta: false }],
      historial: [{ fecha: "2026-10-21T15:05:00", texto: "Recibido por foto desde el móvil" }, { fecha: "2026-10-21T15:05:30", texto: "Foto torcida y con poca luz: 2 campos dudosos" }]
    },
    {
      id: "doc_005", archivo: "Fwd_ticket_super.pdf", formato: "PDF", origen: "correo",
      huella: "5e8d2b7a9c0f41e3b6d8a2c4e6f80b1d3f5a7c9e1b3d5f7a9c0e2b4d6f8a0c2e",
      recibido_en: "2026-10-17T11:44:00", estado: "incidencia",
      original: "assets/originales/super-varios-iva.svg",
      factura: { fecha: "2026-10-15", emisor: "Supermercados Ribera S.A.", nif_emisor: "A28456789", nif_receptor: null,
        numero: "2026/118734", tipo: "simplificada", categoria: "Suministros y compras", moneda: "EUR",
        iva: [iva(12.50, 4, 0.50), iva(20.00, 10, 2.00), iva(8.26, 21, 1.74)], total: 45.00, total_eur: 45.00 },
      dudosos: [], incidencias: [{ tipo: "duplicado", gravedad: "bloqueante", mensaje: "Mismo archivo que «super_ribera_15oct.pdf»", relacionado: "doc_002", resuelta: false }],
      historial: [{ fecha: "2026-10-17T11:44:00", texto: "Recibido en el buzón de la empresa" }, { fecha: "2026-10-17T11:44:05", texto: "Huella idéntica a otro documento: posible duplicado" }]
    },
    {
      id: "doc_006", archivo: "ticket_ferreteria.jpg", formato: "JPG", origen: "foto",
      huella: "9a7b5c3d1e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b",
      recibido_en: "2026-10-24T12:15:00", estado: "incidencia",
      original: "assets/originales/ticket-borroso.svg",
      factura: facturaVacia(),
      dudosos: [], incidencias: [{ tipo: "ilegible", gravedad: "bloqueante", mensaje: "Documento ilegible: no se han podido extraer los datos", resuelta: false }],
      historial: [{ fecha: "2026-10-24T12:15:00", texto: "Recibido por foto desde el móvil" }, { fecha: "2026-10-24T12:15:40", texto: "Lectura fallida: imagen desenfocada" }]
    },
    {
      id: "doc_007", archivo: "Factura_GN-2026-0412.pdf", formato: "PDF", origen: "correo",
      huella: "2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d",
      recibido_en: "2026-10-01T16:20:00", estado: "validado",
      original: "assets/originales/imprenta-factura.svg",
      factura: { fecha: "2026-10-01", emisor: "Imprenta Gráfica Norte S.L.", nif_emisor: "B09876543", nif_receptor: "B12345678",
        numero: "GN-2026/0412", tipo: "completa", categoria: "Material y envases", moneda: "EUR",
        iva: [iva(250.00, 21, 52.50)], total: 302.50, total_eur: 302.50 },
      dudosos: [], incidencias: [],
      historial: [{ fecha: "2026-10-01T16:20:00", texto: "Recibido en el buzón de la empresa" }, { fecha: "2026-10-02T09:12:00", texto: "Validado por Ana" }]
    },
    {
      id: "doc_008", archivo: "factura_telefonia_oct.pdf", formato: "PDF", origen: "archivo",
      huella: "6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f",
      recibido_en: "2026-10-06T08:00:00", estado: "validado",
      original: "assets/originales/telefono-factura.svg",
      factura: { fecha: "2026-10-05", emisor: "Telefonía Meseta S.A.U.", nif_emisor: "A82018474", nif_receptor: "B12345678",
        numero: "TM-26-5510392", tipo: "completa", categoria: "Telefonía e internet", moneda: "EUR",
        iva: [iva(49.50, 21, 10.40)], total: 59.90, total_eur: 59.90 },
      dudosos: [], incidencias: [],
      historial: [{ fecha: "2026-10-06T08:00:00", texto: "Subido arrastrando archivo" }, { fecha: "2026-10-06T08:05:00", texto: "Validado por Ana" }]
    },
    {
      id: "doc_009", archivo: "alquiler_julio.pdf", formato: "PDF", origen: "correo",
      huella: "8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a",
      recibido_en: "2026-07-01T10:00:00", estado: "validado",
      original: "assets/originales/alquiler-julio.svg",
      factura: { fecha: "2026-07-01", emisor: "Inmuebles Duero S.L.", nif_emisor: "B47555111", nif_receptor: "B12345678",
        numero: "ALQ-2026-07", tipo: "completa", categoria: "Alquiler", moneda: "EUR",
        iva: [iva(600.00, 21, 126.00)], total: 726.00, total_eur: 726.00 },
      dudosos: [], incidencias: [], historial: [{ fecha: "2026-07-01T10:00:00", texto: "Recibido y validado" }]
    },
    {
      id: "doc_010", archivo: "gasolina_agosto.jpg", formato: "JPG", origen: "foto",
      huella: "1c3e5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f",
      recibido_en: "2026-08-18T17:40:00", estado: "validado",
      original: "assets/originales/gasolina-agosto.svg",
      factura: { fecha: "2026-08-18", emisor: "Repsol Área Burgos", nif_emisor: "B09333222", nif_receptor: null,
        numero: "R-88123", tipo: "simplificada", categoria: "Combustible", moneda: "EUR",
        iva: [iva(49.59, 21, 10.41)], total: 60.00, total_eur: 60.00 },
      dudosos: [], incidencias: [], historial: [{ fecha: "2026-08-18T17:40:00", texto: "Recibido y validado" }]
    },
    {
      id: "doc_011", archivo: "papeleria_sept.png", formato: "PNG", origen: "archivo",
      huella: "3e5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a",
      recibido_en: "2026-09-09T13:00:00", estado: "validado",
      original: "assets/originales/papeleria-sept.svg",
      factura: { fecha: "2026-09-09", emisor: "Papelería El Lápiz", nif_emisor: "12345678Z", nif_receptor: "B12345678",
        numero: "F-2026-0931", tipo: "completa", categoria: "Material de oficina", moneda: "EUR",
        iva: [iva(100.00, 21, 21.00)], total: 121.00, total_eur: 121.00 },
      dudosos: [], incidencias: [], historial: [{ fecha: "2026-09-09T13:00:00", texto: "Recibido y validado" }]
    }
  ];

  const CATEGORIAS = [
    "Combustible", "Restauración", "Suministros y compras", "Material y envases", "Material de oficina",
    "Telefonía e internet", "Software y suscripciones", "Alquiler", "Transporte", "Servicios profesionales", "Otros"
  ];

  // ---------- Almacenamiento local (solo demo) ----------
  function leer(clave) {
    try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function escribir(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
  }
  let memoria = null; // copia en memoria por si localStorage no está disponible
  function datos() {
    if (memoria) return memoria;
    memoria = leer(CLAVE_DATOS) || { empresa: structuredClone(EMPRESA_DEMO), documentos: structuredClone(DOCS_DEMO) };
    return memoria;
  }
  function guardar() { escribir(CLAVE_DATOS, memoria); }
  const espera = (ms = 120) => new Promise(r => setTimeout(r, ms));
  const ahora = () => new Date().toISOString().slice(0, 19);

  // ---------- Reglas de negocio ----------
  function redondear(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }

  function trimestreDe(doc) {
    const f = (doc.factura && doc.factura.fecha) || doc.recibido_en;
    const d = new Date(f);
    return d.getFullYear() + "-T" + (Math.floor(d.getMonth() / 3) + 1);
  }

  // Semáforo de un documento: rojo > ámbar > verde (apartado 2.4)
  function nivelDocumento(doc) {
    if (doc.estado === "descartado") return null;
    const abiertas = (doc.incidencias || []).filter(i => !i.resuelta);
    if (doc.estado === "incidencia" || abiertas.some(i => i.gravedad === "bloqueante")) return "rojo";
    if (doc.estado !== "validado" || abiertas.length) return "ambar";
    return "verde";
  }

  function semaforo(docs) {
    const activos = docs.filter(d => d.estado !== "descartado");
    const niveles = activos.map(nivelDocumento);
    const r = {
      total: activos.length,
      validados: niveles.filter(n => n === "verde").length,
      pendientes: niveles.filter(n => n === "ambar").length,
      bloqueantes: niveles.filter(n => n === "rojo").length
    };
    r.estado = r.bloqueantes ? "rojo" : r.pendientes ? "ambar" : "verde";
    if (!r.total) r.estado = "vacio";
    return r;
  }

  // Comprueba que bases + cuotas coinciden con el total
  function cuadre(f) {
    if (!f || f.total == null || !f.iva || !f.iva.length) return null;
    const suma = redondear(f.iva.reduce((s, l) => s + Number(l.base || 0) + Number(l.cuota || 0), 0));
    return { suma, diferencia: redondear(Number(f.total) - suma), ok: Math.abs(Number(f.total) - suma) <= 0.02 };
  }

  // Duplicados por datos: mismo NIF emisor + número + total (RF-07)
  function buscarDuplicadoPorDatos(doc, todos) {
    const f = doc.factura;
    if (!f || !f.nif_emisor || !f.numero || f.total == null) return null;
    const norm = s => String(s).replace(/[\s.\-]/g, "").toUpperCase();
    return todos.find(o => o.id !== doc.id && o.estado !== "descartado" && o.factura &&
      o.factura.nif_emisor && o.factura.numero &&
      norm(o.factura.nif_emisor) === norm(f.nif_emisor) &&
      norm(o.factura.numero) === norm(f.numero) &&
      Number(o.factura.total) === Number(f.total)) || null;
  }

  async function huellaArchivo(file) {
    try {
      const buf = await file.arrayBuffer();
      const hash = await crypto.subtle.digest("SHA-256", buf);
      return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      return "sinhuella-" + file.name + "-" + file.size;
    }
  }

  function leerComoDataURL(file) {
    return new Promise((ok, mal) => {
      const r = new FileReader();
      r.onload = () => ok(r.result);
      r.onerror = mal;
      r.readAsDataURL(file);
    });
  }

  // =========================================================
  // API pública
  // =========================================================
  const api = {
    CATEGORIAS,
    trimestreDe, nivelDocumento, semaforo, cuadre, redondear,

    // ---------- Acceso (RF-01) ----------
    // Supabase: supabase.auth.signInWithPassword({ email, password })
    async iniciarSesion(email, password) {
      await espera(400);
      if (!email || !password || password.length < 6) throw new Error("Correo o contraseña incorrectos.");
      const d = datos();
      const sesion = { email, nombre: email.split("@")[0], empresa_id: d.empresa.id };
      escribir(CLAVE_SESION, sesion);
      return sesion;
    },
    // Supabase: supabase.auth.signUp(...) + insertar en `empresas` y `pertenencias`
    async registrarse({ email, password, empresa, nif }) {
      await espera(500);
      if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
      const d = datos();
      d.empresa.nombre = empresa;
      d.empresa.nif = nif.toUpperCase();
      guardar();
      return api.iniciarSesion(email, password);
    },
    // Supabase: supabase.auth.resetPasswordForEmail(email, { redirectTo })
    async recuperarContrasena(email) {
      await espera(500);
      if (!email) throw new Error("Escribe tu correo.");
      return true;
    },
    // Supabase: supabase.auth.signOut()
    async cerrarSesion() {
      try { localStorage.removeItem(CLAVE_SESION); } catch (e) { /* sin almacenamiento */ }
    },
    // Supabase: supabase.auth.getSession()
    sesionActual() { return leer(CLAVE_SESION); },

    // ---------- Empresa ----------
    // Supabase: from('empresas').select('*').single()  (RLS limita a la propia)
    async empresa() {
      const d = datos();
      const usados = d.documentos.length;
      return { ...d.empresa, usados, limite: d.empresa.plan === "prueba" ? CFG.limitePrueba : CFG.limitePlan };
    },

    // ---------- Documentos ----------
    // Supabase: from('documentos').select('*, facturas(*, lineas_iva(*)), incidencias(*)')
    async listarDocumentos({ trimestre } = {}) {
      await espera();
      let docs = datos().documentos.slice();
      if (trimestre) docs = docs.filter(d => trimestreDe(d) === trimestre);
      return docs.sort((a, b) => (b.recibido_en || "").localeCompare(a.recibido_en || ""));
    },

    async trimestresDisponibles() {
      const set = new Set(datos().documentos.map(trimestreDe));
      set.add(api.trimestreActual());
      return [...set].sort().reverse();
    },

    trimestreActual() { return trimestreDe({ recibido_en: new Date().toISOString() }); },

    async obtenerDocumento(id) {
      await espera(60);
      const doc = datos().documentos.find(d => d.id === id);
      if (!doc) throw new Error("Documento no encontrado o sin permiso.");
      return structuredClone(doc);
    },

    // URL para ver/descargar el original (RF-08)
    // Supabase: storage.from(bucket).createSignedUrl(ruta, 60)
    async urlOriginal(doc) {
      if (doc.original) return doc.original;
      try { return localStorage.getItem(CLAVE_ORIGINAL + doc.id); } catch (e) { return null; }
    },

    // Guarda los datos corregidos sin tocar el original (RF-06, RNF-04)
    // Supabase: update en `facturas` + upsert de `lineas_iva`
    async guardarFactura(id, factura, { campos = [] } = {}) {
      await espera(250);
      const d = datos();
      const doc = d.documentos.find(x => x.id === id);
      if (!doc) throw new Error("Documento no encontrado.");
      doc.factura = factura;
      doc.dudosos = (doc.dudosos || []).filter(c => !campos.includes(c));
      // El NIF del emisor resuelve el aviso correspondiente
      if (factura.nif_emisor) doc.incidencias.forEach(i => { if (i.tipo === "nif") i.resuelta = true; });
      if (factura.categoria) doc.incidencias.forEach(i => { if (i.tipo === "categoria") i.resuelta = true; });
      if (doc.estado === "validado") doc.estado = "pendiente";
      doc.historial.push({ fecha: ahora(), texto: "Datos corregidos" + (campos.length ? ": " + campos.join(", ") : "") });

      // Comprobar posibles duplicados con los datos nuevos
      const dup = buscarDuplicadoPorDatos(doc, d.documentos);
      const yaMarcado = doc.incidencias.some(i => i.tipo === "duplicado" && i.relacionado === (dup && dup.id));
      if (dup && !yaMarcado && !(doc.no_duplicado_de || []).includes(dup.id)) {
        doc.incidencias.push({ tipo: "duplicado", gravedad: "bloqueante", mensaje: "Mismo emisor, número y total que «" + dup.archivo + "»", relacionado: dup.id, resuelta: false });
        doc.estado = "incidencia";
      }
      guardar();
      return structuredClone(doc);
    },

    async validarDocumento(id) {
      await espera(200);
      const doc = datos().documentos.find(x => x.id === id);
      if (nivelDocumento(doc) === "rojo") throw new Error("Resuelve antes las incidencias bloqueantes.");
      doc.estado = "validado";
      doc.dudosos = [];
      doc.incidencias.forEach(i => { if (!i.resuelta) { i.resuelta = true; i.aceptada = true; } });
      doc.historial.push({ fecha: ahora(), texto: "Validado" });
      guardar();
      return structuredClone(doc);
    },

    // accion: "no_duplicado" | "descartar" | "manual"
    async resolverIncidencia(id, indice, accion) {
      await espera(200);
      const doc = datos().documentos.find(x => x.id === id);
      const inc = doc.incidencias[indice];
      if (!inc) throw new Error("Incidencia no encontrada.");
      if (accion === "descartar") {
        // El original NO se borra: solo se excluye del periodo y del Excel
        doc.estado = "descartado";
        inc.resuelta = true;
        doc.historial.push({ fecha: ahora(), texto: "Descartado (" + inc.tipo + "). El original se conserva." });
      } else {
        inc.resuelta = true;
        if (accion === "no_duplicado" && inc.relacionado) (doc.no_duplicado_de = doc.no_duplicado_de || []).push(inc.relacionado);
        if (!doc.incidencias.some(i => !i.resuelta && i.gravedad === "bloqueante")) doc.estado = "pendiente";
        doc.historial.push({ fecha: ahora(), texto: accion === "manual" ? "Se introducirán los datos a mano" : "Marcado como «no es duplicado»" });
      }
      guardar();
      return structuredClone(doc);
    },

    async restaurarDocumento(id) {
      const doc = datos().documentos.find(x => x.id === id);
      doc.estado = "pendiente";
      doc.historial.push({ fecha: ahora(), texto: "Recuperado tras descartarlo" });
      guardar();
      return structuredClone(doc);
    },

    // ---------- Subida (RF-02, RF-03) ----------
    validarArchivo(file) {
      const tipo = CFG.tiposPermitidos[file.type];
      if (!tipo) return "Formato no admitido (" + (file.name.split(".").pop() || "desconocido").toUpperCase() + "). Usa PDF, JPG o PNG.";
      if (file.size > CFG.tamanoMaximoMB * 1024 * 1024) return "El archivo supera " + CFG.tamanoMaximoMB + " MB.";
      if (file.size === 0) return "El archivo está vacío.";
      return null;
    },

    // Supabase: storage.upload(ruta privada) + insert en `documentos`
    //           + llamada a la función de servidor que hace OCR/LLM
    async subirArchivo(file, origen, alProgresar = () => {}) {
      const error = api.validarArchivo(file);
      if (error) throw new Error(error);
      const d = datos();
      const emp = await api.empresa();
      if (emp.usados >= emp.limite) throw new Error("Has alcanzado el límite de documentos de tu plan. Puedes seguir consultando los existentes.");

      alProgresar("Recibido", 15);
      const huella = await huellaArchivo(file);
      await espera(300);
      alProgresar("Huella calculada", 35);

      const id = "doc_" + Date.now().toString(36);
      let guardado = false;
      try {
        const url = await leerComoDataURL(file);
        localStorage.setItem(CLAVE_ORIGINAL + id, url);
        guardado = true;
      } catch (e) { /* demo: el navegador no admite archivos tan grandes en localStorage */ }
      await espera(300);
      alProgresar("Original guardado", 60);

      const doc = {
        id, archivo: file.name, formato: CFG.tiposPermitidos[file.type], origen, huella,
        recibido_en: ahora(), estado: "pendiente", original: null,
        factura: facturaVacia(),
        dudosos: ["fecha", "emisor", "nif_emisor", "numero", "total"],
        incidencias: [],
        historial: [{ fecha: ahora(), texto: origen === "foto" ? "Recibido por foto desde el móvil" : "Subido arrastrando archivo" }]
      };
      if (!guardado) doc.historial.push({ fecha: ahora(), texto: "Demo: el original es demasiado grande para guardarlo en el navegador" });

      await espera(500);
      alProgresar("Leyendo datos", 85);
      // La lectura automática (OCR + LLM) se conectará en servidor.
      // En la demo los campos quedan vacíos: nunca se inventan valores.
      doc.historial.push({ fecha: ahora(), texto: "Demo: lectura automática no conectada. Introduce los datos." });

      const dup = d.documentos.find(o => o.huella === huella && o.estado !== "descartado");
      if (dup) {
        doc.estado = "incidencia";
        doc.incidencias.push({ tipo: "duplicado", gravedad: "bloqueante", mensaje: "Mismo archivo que «" + dup.archivo + "»", relacionado: dup.id, resuelta: false });
      }
      d.documentos.push(doc);
      guardar();
      await espera(200);
      alProgresar(dup ? "Posible duplicado" : "Pendiente de revisión", 100);
      return structuredClone(doc);
    },

    // ---------- Exportación (RF-09) ----------
    filasExportacion(docs) {
      // Orden cronológico, que es como lo espera la gestoría
      const activos = docs.filter(d => d.estado !== "descartado")
        .sort((a, b) => ((a.factura && a.factura.fecha) || "9999").localeCompare((b.factura && b.factura.fecha) || "9999"));
      const nombreT = d => { const [a, q] = trimestreDe(d).split("-T"); return q + "T " + a; };
      const estadoTexto = { validado: "Validado", pendiente: "Pendiente de revisión", incidencia: "Incidencia", recibido: "Recibido", procesando: "Procesando" };
      const facturas = activos.map(d => {
        const f = d.factura || {};
        const lineas = f.iva || [];
        const cambio = f.moneda && f.moneda !== "EUR" && f.tipo_cambio ? f.tipo_cambio : 1;
        return {
          "Fecha": f.fecha || "",
          "Trimestre": nombreT(d),
          "Nº factura": f.numero || "",
          "Tipo": f.tipo === "completa" ? "Completa" : f.tipo === "simplificada" ? "Simplificada" : "",
          "Emisor": f.emisor || "",
          "NIF emisor": f.nif_emisor || "",
          "NIF receptor": f.nif_receptor || "",
          "Categoría": f.categoria || "",
          "Moneda": f.moneda || "EUR",
          "Total (moneda original)": f.total ?? "",
          "Tipo de cambio (1 EUR =)": f.moneda && f.moneda !== "EUR" ? (f.tipo_cambio ?? "") : "",
          "Fecha tipo de cambio": f.fecha_cambio || "",
          "Base imponible EUR": redondear(lineas.reduce((s, l) => s + Number(l.base || 0), 0) / cambio),
          "Cuota IVA EUR": redondear(lineas.reduce((s, l) => s + Number(l.cuota || 0), 0) / cambio),
          "Total EUR": f.total_eur ?? (f.total != null ? redondear(f.total / cambio) : ""),
          "Estado revisión": estadoTexto[d.estado] || d.estado,
          "Incidencias abiertas": d.incidencias.filter(i => !i.resuelta).map(i => i.mensaje).join("; "),
          "Archivo original": d.archivo,
          "ID documento": d.id
        };
      });
      const desglose = [];
      activos.forEach(d => {
        const f = d.factura || {};
        const cambio = f.moneda && f.moneda !== "EUR" && f.tipo_cambio ? f.tipo_cambio : 1;
        (f.iva || []).forEach(l => desglose.push({
          "ID documento": d.id,
          "Fecha": f.fecha || "",
          "Nº factura": f.numero || "",
          "Emisor": f.emisor || "",
          "Tipo IVA %": Number(l.tipo),
          "Base": Number(l.base),
          "Cuota": Number(l.cuota),
          "Moneda": f.moneda || "EUR",
          "Base EUR": redondear(l.base / cambio),
          "Cuota EUR": redondear(l.cuota / cambio)
        }));
      });
      return { facturas, desglose };
    },

    // Solo demo: vuelve a los datos de ejemplo
    reiniciarDemo() {
      try {
        Object.keys(localStorage).filter(k => k.startsWith("cuentapp_") && k !== CLAVE_SESION).forEach(k => localStorage.removeItem(k));
      } catch (e) { /* sin almacenamiento */ }
      memoria = null;
    }
  };

  window.CuentApp = window.CuentApp || {};
  window.CuentApp.api = api;
})();
