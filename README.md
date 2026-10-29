# CUENTAPP

CUENTAPP es una plataforma web para gestionar facturas y tickets de gastos de pymes. Su propuesta de valor es el **semáforo del trimestre**: llegar al cierre con todo revisado y listo para la gestoría.

Este repositorio contiene el **prototipo del frontend**, hecho en HTML, CSS y JavaScript sin frameworks. Funciona con **datos de ejemplo** y está preparado para conectarse después a Supabase.

> Estado: prototipo académico. Los precios y los límites son provisionales. La lectura automática (OCR + LLM), el buzón de correo y Google Drive todavía no están conectados.

---

## Cómo abrirlo

No hace falta instalar nada.

- **Opción rápida:** haz doble clic en `index.html` y se abrirá en el navegador.
- **Opción recomendada (servidor local):** con Node instalado, ejecuta esto en la carpeta del proyecto:
  ```bash
  npx http-server . -p 5500 -c-1
  ```
  Después abre <http://localhost:5500>. En VS Code también sirve la extensión *Live Server*.

Para entrar a la zona privada vale **cualquier correo** y **una contraseña de 6 caracteres o más**. En el prototipo no se comprueba nada.

---

## Páginas

| Página | Archivo | Qué hace |
|---|---|---|
| Inicio | `index.html` | Landing: propuesta de valor, tres vías de subida, cómo funciona y semáforo |
| Precios | `precios.html` | Planes Prueba, CUENTAPP (20 €/mes + IVA) y Despacho (próximamente) |
| Acceso | `login.html` | Entrar, crear cuenta y recuperar contraseña |
| Panel | `panel.html` | Semáforo del trimestre, contadores, avisos con enlace a cada justificante, buzón y Drive |
| Documentos | `documentos.html` | Listado con búsqueda y filtros por trimestre y estado |
| Subir | `subir.html` | Foto desde el móvil, zona para arrastrar archivos y dirección del buzón de correo |
| Revisar | `revisar.html?id=…` | Original y datos lado a lado, campos dudosos resaltados, varios tipos de IVA, cuadre, duplicados y validación |
| Exportar | `exportar.html` | Vista previa y descarga del Excel del trimestre, con dos hojas: Facturas y Desglose IVA |

En el móvil, la barra lateral se sustituye por una barra de navegación inferior.

---

## Estructura

```
├── index.html, precios.html, login.html        ← web pública
├── panel.html, documentos.html, subir.html,
│   revisar.html, exportar.html                 ← zona privada
├── css/styles.css                              ← estilos y paleta (variables en :root)
├── js/config.js                                ← configuración (modo demo / Supabase, límites)
├── js/api.js                                   ← capa de datos: lo único que habrá que cambiar
├── js/ui.js                                    ← utilidades: menú, iconos, formatos, avisos
└── assets/
    ├── topo.svg                                ← fondo de líneas topográficas
    └── originales/                             ← tickets y facturas de ejemplo (SVG)
```

### Estética

Se basa en un diseño de referencia de Dribbble de estilo fintech:

- **Fondo:** blanco roto (`#F6F7F2`) con un brillo verde lima detrás de las secciones destacadas.
- **Texto y botones:** casi negro (`#17181D`), con botones en forma de píldora.
- **Acentos:** lima (`#D4F24A`) para etiquetas y estados activos, y un degradado violeta → lima en el logo.
- **Titulares:** degradado de negro a oliva.
- **Tarjetas:** blancas, con sombras suaves; en la portada «flotan» ligeramente giradas.
- **Tipografías:** Archivo expandida (títulos) y Manrope (texto).

Todos los colores están como variables en `css/styles.css`, así que un cambio de color se hace en un solo sitio.

---

## Cómo funciona la demo

Los datos viven en el `localStorage` del navegador, de modo que cada persona tiene su propia copia y los cambios se mantienen al recargar. La empresa de ejemplo es **Panadería Ejemplo S.L.** y trae documentos del 3T y del 4T de 2026, entre ellos los cuatro casos del banco de lectura:

| Caso | Documento de ejemplo | Qué se ve |
|---|---|---|
| PL-01 | Ticket arrugado de gasolinera | Un campo dudoso |
| PL-02 | Supermercado con IVA al 4 %, 10 % y 21 % | Desglose de IVA en varias líneas |
| PL-03 | Factura de Figma en inglés y en USD | Tipo de cambio y equivalente en EUR |
| PL-04 | Foto torcida y oscura de un bar | Falta el NIF del emisor |

Además hay un **duplicado** (el mismo PDF reenviado por correo) y un **ticket ilegible**. Por eso el 4T arranca en **rojo**.

**Recorrido para enseñarlo:**

1. Entra y mira el panel: el semáforo está en rojo.
2. En el aviso del duplicado, pulsa *Revisar → Descartar este*. El original no se borra.
3. En el ticket ilegible, pulsa *Introducir a mano*, rellena los datos y pulsa *Validar*. El semáforo pasa a ámbar.
4. Valida el resto de documentos pendientes. El semáforo pasa a verde.
5. Ve a *Exportar → Descargar Excel*.
6. En *Subir*, sube dos veces el mismo archivo: el segundo se marca como posible duplicado por su huella SHA-256. Un `.txt` se rechaza con un mensaje.

El botón **«Reiniciar datos de ejemplo»** (abajo, en la barra lateral) devuelve la demo a su estado inicial.

### Reglas que ya están implementadas

- **Semáforo** (prioridad rojo > ámbar > verde):
  - **Rojo:** hay duplicados sin resolver o documentos ilegibles.
  - **Ámbar:** hay documentos pendientes, campos dudosos o avisos.
  - **Verde:** todo está validado.
- **NIF:** un ticket simplificado sin NIF del receptor *no* es un error. La falta del NIF del emisor es un aviso ámbar.
- **Duplicados:** se detectan por la huella del archivo y por la coincidencia de NIF del emisor, número y total. Siempre decide una persona: *No es duplicado* o *Descartar*.
- **Cuadre:** la suma de bases y cuotas se compara con el total, con una tolerancia de 2 céntimos.
- **Datos sin inventar:** un documento nuevo llega con los campos vacíos. Nunca se inventan valores.
- **Original intacto:** corregir datos nunca modifica el original, y descartar un documento no lo borra.

---

## Conectar Supabase (siguiente paso)

Las páginas **no acceden a los datos directamente**: todo pasa por `CuentApp.api` en `js/api.js`. Para pasar a datos reales:

1. Crear el proyecto en Supabase con estas tablas:
   - `empresas`
   - `pertenencias`
   - `documentos`
   - `facturas`
   - `lineas_iva`
   - `incidencias`
   - `procesamientos`

   Activa **RLS por empresa** en todas las tablas y crea un bucket **privado** `originales`.
2. Rellenar `supabaseUrl` y `supabaseAnonKey` en `js/config.js` y cambiar `modo` a `"supabase"`. Usa solo la clave pública *anon*: la clave *service_role* nunca debe estar en el frontend.
3. Añadir el cliente de Supabase en cada página, antes de `config.js`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
   ```
4. Reimplementar las funciones de `js/api.js` con los mismos nombres y las mismas respuestas. Cada función lleva un comentario con la consulta equivalente:

| Función | Equivalente en Supabase |
|---|---|
| `iniciarSesion`, `registrarse`, `recuperarContrasena`, `cerrarSesion` | `supabase.auth.*` |
| `listarDocumentos`, `obtenerDocumento` | `from('documentos').select('*, facturas(*, lineas_iva(*)), incidencias(*)')` |
| `subirArchivo` | `storage.from('originales').upload(...)` + insert en `documentos` + llamada a la función de servidor de lectura |
| `urlOriginal` | `storage.createSignedUrl(ruta, 60)` |
| `guardarFactura`, `validarDocumento`, `resolverIncidencia` | `update` / `upsert` en `facturas`, `lineas_iva` e `incidencias` |

Las reglas de negocio (`semaforo`, `nivelDocumento`, `cuadre`, `filasExportacion`) son funciones puras y se pueden reutilizar tal cual.

> La lectura OCR + LLM, el buzón de correo entrante y Google Drive necesitan **código de servidor**, porque las claves no pueden estar en el navegador. Por ejemplo, se pueden hacer con Supabase Edge Functions.

---

## Requisitos y estado en el prototipo

| Requisito | Estado |
|---|---|
| RF-01 Acceso y recuperación | Interfaz lista. Falta conectar Supabase Auth y RLS |
| RF-02 Foto desde móvil | Funciona (`capture="environment"`) |
| RF-03 Arrastrar PDF/imagen | Funciona, con validación de formato y tamaño (10 MB) |
| RF-04 Reenvío por correo | Se muestra la dirección. Falta el servicio de correo entrante |
| RF-05 Extracción automática | Pantalla y modelo de datos listos. Falta el motor OCR + LLM |
| RF-06 Corrección visual | Funciona |
| RF-07 Duplicados | Funciona (huella + NIF/número/total) |
| RF-08 Original conservado | Funciona en local. Falta Supabase Storage privado |
| RF-09 Excel para gestoría | Funciona (XLSX con dos hojas) |
| FA-01 Semáforo, panel y avisos | Funciona |
| FA-02 Buzón empresarial | Solo interfaz |
| FA-03 Google Drive | Solo interfaz |

Librería externa: [SheetJS](https://sheetjs.com/) (`xlsx@0.18.5`, desde jsDelivr), que genera el Excel en el navegador.
