// =========================================================
// CUENTAPP · Configuración
// Para conectar Supabase: rellenar URL y clave pública (anon)
// y cambiar `modo` a "supabase". Ver README.md.
// =========================================================
window.CUENTAPP_CONFIG = {
  // "demo": datos de ejemplo guardados en el navegador (localStorage)
  // "supabase": datos reales (pendiente de implementar en js/api.js)
  modo: "demo",

  supabaseUrl: "",       // p. ej. https://xxxx.supabase.co
  supabaseAnonKey: "",   // clave pública "anon" (nunca la service_role)
  bucketOriginales: "originales",

  // Validación de subida (RF-03)
  tamanoMaximoMB: 10,
  tiposPermitidos: {
    "application/pdf": "PDF",
    "image/jpeg": "JPG",
    "image/png": "PNG"
  },

  // Plan de prueba (apartado 5)
  limitePrueba: 30,
  limitePlan: 250,

  // Dominio del buzón de reenvío por empresa (FA-02)
  dominioBuzon: "buzon.cuentapp.es"
};
