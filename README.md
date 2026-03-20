# 🧠 PsicoJaime — Gestión de Consulta de Psicología Online

Aplicación web privada para la gestión integral de la consulta de psicología de Jaime.

## ✅ Funcionalidades

- 🔐 **Login seguro** con sesión de 8 horas
- 📊 **Dashboard** con métricas y alertas de documentación pendiente
- 👤 **Pacientes** — ficha completa, historia clínica, diagnósticos DSM-5/CIE-11
- 📅 **Agenda** — gestión de citas por fecha
- 📄 **Documentos legales** — Autorización RGPD + Consentimiento Informado (descargables para imprimir y firmar)
- 🧾 **Facturación** — facturas, cobros, métodos de pago
- 📈 **Finanzas** — gráficos, métricas, tasas de cobro
- 💬 **Recordatorios** — mensajes WhatsApp/Email listos para copiar (citas de mañana automáticas)
- 💾 **Datos persistentes** en localStorage (no se pierden al cerrar)

---

## 🚀 Despliegue en GitHub + Vercel (paso a paso)

### Paso 1 — Cambiar la contraseña (IMPORTANTE)

Abre el archivo `src/App.jsx` y busca estas dos líneas al principio:

```js
const VALID_USER = 'jaime'
const VALID_PASS = 'PsicoJaime2025!'
```

Cámbia `VALID_PASS` por tu contraseña segura antes de subir el código.

---

### Paso 2 — Subir a GitHub

1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes
2. Pulsa el botón verde **"New"** → ponle nombre `psicojaime` → **"Create repository"**
3. En la página del repositorio vacío, pulsa **"uploading an existing file"**
4. Arrastra y suelta **todos los archivos y carpetas** del proyecto:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `README.md`
   - carpeta `src/` completa (con todos los archivos dentro)
5. Pulsa **"Commit changes"**

---

### Paso 3 — Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Pulsa **"Sign up"** → **"Continue with GitHub"**
3. Pulsa **"Add New Project"**
4. Selecciona tu repositorio `psicojaime`
5. Vercel detecta automáticamente que es un proyecto Vite/React
6. Pulsa **"Deploy"**
7. En 1-2 minutos tendrás tu URL: `psicojaime.vercel.app`

---

### Paso 4 — Usar la app desde cualquier ordenador

- Accede a tu URL de Vercel desde cualquier navegador
- Introduce usuario: `jaime` y tu contraseña
- Los datos se guardan en el navegador (localStorage)

> ⚠️ **Importante**: Los datos se guardan en el navegador donde uses la app.
> Si abres la app en otro ordenador, no verás los mismos datos.
> Para tener datos compartidos entre dispositivos, necesitarías añadir una base de datos (próximo paso).

---

## 🔒 Seguridad y RGPD

- La app solo es accesible con usuario y contraseña
- La sesión expira automáticamente a las 8 horas
- Los documentos legales (RGPD + CI) son conformes a la normativa española
- Los datos clínicos se almacenan localmente en tu navegador (no se envían a ningún servidor externo)
- Se recomienda usar la app en un dispositivo personal y no compartido

---

## 🛠️ Desarrollo local (opcional)

Si tienes Node.js instalado:

```bash
npm install
npm run dev
```

La app se abrirá en `http://localhost:5173`

---

## 📞 Credenciales por defecto

| Campo | Valor |
|-------|-------|
| Usuario | `jaime` |
| Contraseña | `PsicoJaime2025!` |

**¡Cambia la contraseña antes de subir a GitHub!**
