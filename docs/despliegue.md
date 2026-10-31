# Guía de Despliegue en Render (Public Cloud / SaaS) con CI/CD

Esta guía documenta la publicación de **HelpDesk Cloud** en **Render** ([https://render.com](https://render.com)) como **Static Site** de alta disponibilidad con CDN global y certificados SSL automáticos.

---

## 1. Requisitos Previos

1. Cuenta creada en [Render.com](https://dashboard.render.com/).
2. Cuenta en [Firebase Console](https://console.firebase.google.com/) con el proyecto creado y Cloud Firestore activo.
3. Repositorio público en GitHub: [https://github.com/Stevien04/HelpDesk-Cloud](https://github.com/Stevien04/HelpDesk-Cloud).

---

## 2. Opción A: Despliegue Automático con Render Blueprint (`render.yaml`)

El repositorio incluye el archivo [`render.yaml`](../render.yaml) configurado para despliegue con infraestructura como código (IaC):

1. En el Dashboard de Render, haz clic en **New +** y selecciona **Blueprint**.
2. Conecta tu repositorio `Stevien04/HelpDesk-Cloud`.
3. Render detectará el archivo `render.yaml`, configurando automáticamente:
   - **Runtime:** `static`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `./dist`
   - **Regla Rewrite SPA:** `/*` hacia `/index.html` (imprescindible para React Router).
4. Completa las variables de entorno en el panel y haz clic en **Apply**.

---

## 3. Opción B: Despliegue Manual como "Static Site" en Render

Si prefieres configurarlo paso a paso desde el panel:

1. En Render Dashboard, haz clic en **New + > Static Site**.
2. Selecciona y conecta tu repositorio: `Stevien04/HelpDesk-Cloud`.
3. Completa los siguientes parámetros:
   - **Name:** `helpdesk-cloud` (o el nombre que elijas).
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. **Configurar Regla de Reescritura SPA (Redirects/Rewrites):**
   - Ve a la sección **Redirects/Rewrites** del servicio en Render.
   - Haz clic en **Add Rule**:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
   - *(Esto permite que rutas como `/dashboard`, `/tickets` o `/reportes` funcionen al recargar la página).*
5. **Variables de Entorno (Environment Variables):**
   Agrega las credenciales de tu proyecto Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Haz clic en **Create Static Site**. Render compilará tu aplicación y te entregará una URL pública HTTPS (ejemplo: `https://helpdesk-cloud.onrender.com`).

---

## 4. Automatización con GitHub Actions y Deploy Hook

Render despliega automáticamente cada nuevo `push` a la rama `main`. Además, si deseas que el despliegue se ejecute estrictamente después de pasar las pruebas unitarias de GitHub Actions:

1. En Render, ve a la configuración del servicio > **Deploy Hook** y copia la URL generada.
2. En GitHub, ve a **Settings > Secrets and variables > Actions > New repository secret**.
3. Crea el secreto `RENDER_DEPLOY_HOOK_URL` con el valor copiado.
4. Cada vez que hagas `git push origin main`, GitHub Actions:
   - Ejecutará `npm run test` (13 pruebas unitarias).
   - Compilará la aplicación con `npm run build`.
   - Notificará a Render mediante el Deploy Hook para actualizar la versión en vivo.

---

## 5. Verificación de Producción

Una vez finalizado el despliegue en Render:
- [x] Acceder a `https://helpdesk-cloud.onrender.com` con HTTPS válido.
- [x] Verificar que la navegación entre rutas (`/dashboard`, `/tickets`, `/reportes`) no arroje error 404 al recargar.
- [x] Crear un ticket y confirmar persistencia en Cloud Firestore.
- [x] Validar que el panel de Respaldo NoSQL muestre las métricas y comandos PITR.
