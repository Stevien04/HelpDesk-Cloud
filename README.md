# HelpDesk Cloud — Sistema de Gestión de Incidencias con Base de Datos NoSQL

![CI/CD Workflow](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-blue?logo=github-actions)
![Database](https://img.shields.io/badge/NoSQL-Cloud_Firestore-orange?logo=firebase)
![Hosting](https://img.shields.io/badge/Hosting-Render_Static_Site-46E3B7?logo=render)
![Frontend](https://img.shields.io/badge/Frontend-React_19_+_Vite-61dafb?logo=react)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38b2ac?logo=tailwind-css)

> **HelpDesk Cloud** es una plataforma serverless moderna diseñada para la gestión integral de incidencias informáticas en infraestructuras y servicios de TI. Emplea **Cloud Firestore** como motor NoSQL documental, control de acceso basado en roles (RBAC) validado con reglas de seguridad estrictas, canalización de entrega continua automatizada mediante **GitHub Actions** y una **estrategia de respaldo NoSQL** de alta disponibilidad (PITR y exportaciones programadas a Cloud Storage).

---

## 🔗 Enlaces Públicos del Proyecto

| Recurso | Enlace |
|---|---|
| 💻 **Repositorio Público** | `https://github.com/Stevien04/HelpDesk-Cloud` |
| 🌐 **Aplicación en Producción (Render SaaS)** | `https://helpdesk-cloud.onrender.com` |
| 📝 **Artículo Técnico (Medium / Dev.to / Hashnode)** | [Ver Artículo Técnico en docs/articulo.md](docs/articulo.md) |
| 🎥 **Video Demostrativo (<= 5 minutos)** | [https://www.youtube.com/watch?v=ChbUKJrGsBg](https://www.youtube.com/watch?v=ChbUKJrGsBg) |

---

## 🚀 Características Principales

1. **Gestión de Incidencias por Roles:**
   - **Usuario:** Registro, creación y seguimiento exclusivo de sus propios tickets con comentarios.
   - **Técnico TI:** Gestión de tickets asignados, avance de estados del ciclo de vida y documentación de soluciones.
   - **Administrador:** Supervisión global, asignación de técnicos, reportes y gestión de permisos.
2. **Modelo NoSQL Documental y Subcolecciones:**
   - Colección `usuarios`: Perfiles y roles protegidos.
   - Colección `tickets`: Incidencias con metadatos optimizados para lecturas rápidas.
   - Subcolección `tickets/{id}/historial`: Trazabilidad inmutable de auditoría y comentarios cronológicos.
3. **Estrategia de Respaldo NoSQL (NoSQL Backup Strategy):**
   - **Point-in-Time Recovery (PITR):** Ventana continua de 7 días con recuperación al segundo exacto (RPO < 1 min).
   - **Managed Exports a Cloud Storage:** Copias frías diarias programadas para retención histórica y auditoría.
   - **Script de automatización:** Herramienta en `scripts/firestore-backup.js` para ejecución programada.
4. **CI/CD Automatizado:**
   - Pruebas unitarias automatizadas (`vitest`).
   - Compilación optimizada en Vite.
   - Despliegue automático a **Render** y verificación continua ante cada push en la rama `main`.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Propósito |
|---|---|---|
| **Frontend** | React 19 + Vite | SPA de alto rendimiento y reactividad |
| **Estilos** | Tailwind CSS | Interfaz moderna, accesible y responsiva |
| **Base de Datos NoSQL** | Google Cloud Firestore | Persistencia documental distribuida y consultas en tiempo real |
| **Autenticación** | Firebase Auth | Identidad basada en JWT (Email/Password) |
| **Hosting Público** | Render (Static Site) | CDN global con certificados TLS automáticos y alta disponibilidad |
| **Automatización CI/CD** | GitHub Actions | Integración y despliegue continuo |
| **Pruebas** | Vitest | Pruebas unitarias de validadores y transiciones de estado |

---

## 📂 Estructura del Repositorio

```text
HelpDeskCloud/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Canalización CI/CD para GitHub Actions
├── docs/
│   ├── arquitectura.md         # Diagrama y especificación arquitectónica
│   ├── firestore.md            # Modelo documental y reglas de seguridad NoSQL
│   ├── backup-strategy.md      # Estrategia de respaldo NoSQL, PITR y RPO/RTO
│   ├── despliegue.md           # Guía de publicación en nube pública y secretos
│   ├── articulo.md             # Artículo completo para Medium / Dev.to / Hashnode
│   └── guion-video.md          # Guion minuto a minuto para el video de 5 minutos
├── public/                     # Recursos estáticos
├── scripts/
│   └── firestore-backup.js     # Script de automatización de respaldo NoSQL
├── src/
│   ├── components/             # Componentes modulares (Navbar, Sidebar, TicketCard...)
│   ├── context/                # AuthContext con soporte para modo demo
│   ├── hooks/                  # Hooks personalizados (useAuth, useTickets)
│   ├── pages/                  # Vistas: Login, Registro, Dashboard, Tickets, etc.
│   ├── services/               # Clientes de Firebase, Auth, Tickets y Usuarios
│   └── utils/                  # Validaciones de formularios y transiciones de estado
├── tests/
│   └── validators.test.js      # Pruebas unitarias automatizadas
├── firestore.rules             # Reglas de seguridad atómicas de Cloud Firestore
├── firestore.indexes.json      # Índices compuestos de consulta NoSQL
├── firebase.json               # Configuración de hosting y emuladores
├── .env.example                # Plantilla de variables de entorno
└── package.json                # Dependencias y scripts del proyecto
```

---

## 💻 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Stevien04/HelpDesk-Cloud.git
cd HelpDesk-Cloud
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```
Edita `.env` con las credenciales de tu proyecto en [Firebase Console](https://console.firebase.google.com/).

### 4. Ejecutar entorno de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 5. Ejecutar pruebas unitarias
```bash
npm run test
```

### 6. Compilar para producción
```bash
npm run build
```

---

## 🛡️ Ejecución de Respaldo NoSQL

Para ejecutar el respaldo de colecciones NoSQL hacia Google Cloud Storage:
```bash
node scripts/firestore-backup.js --bucket=gs://tu-bucket-de-respaldos
```

Para consultar la documentación completa de Point-in-Time Recovery (PITR) y recuperación ante contingencias, revisa [docs/backup-strategy.md](docs/backup-strategy.md).

---

## 👥 Entregables Académicos

Cada integrante del equipo debe publicar su propio artículo en **Medium, Dev.to o Hashnode** utilizando la plantilla provista en [`docs/articulo.md`](docs/articulo.md), y grabar la demostración de video pública siguiendo [`docs/guion-video.md`](docs/guion-video.md).

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
