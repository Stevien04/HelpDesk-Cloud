# Arquitectura de HelpDesk Cloud

## 1. Visión General del Sistema

HelpDesk Cloud es una solución web orientada a la gestión de incidencias técnicas en infraestructura y servicios de TI. La plataforma está concebida como una **Single Page Application (SPA)** serverless, desacoplada y construida bajo principios de alta disponibilidad, seguridad de acceso por roles y persistencia NoSQL nativa en la nube.

```text
+-------------------------------------------------------------------------------+
|                              CAPA DE PRESENTACIÓN                             |
|  Usuarios / Clientes           Técnicos de Soporte          Administradores   |
|         \                              |                              /       |
|          +-----------------------------+-----------------------------+        |
|                                        v                                      |
|                 React 19 + Vite + Tailwind CSS (SPA)                          |
|                     Render Static Site (CDN Global HTTPS & SSL)               |
+-------------------------------------------------------------------------------+
                                         |
                                         | Firebase Web SDK v13 (HTTPS/WSS)
                                         v
+-------------------------------------------------------------------------------+
|                             CAPA DE SERVICIOS CLOUD                           |
|  +----------------------------+             +-------------------------------+ |
|  |   Firebase Authentication  |             |     Cloud Firestore (NoSQL)   | |
|  | - Email / Password         |             | - Base de datos documental    | |
|  | - Sesiones y tokens JWT    |             | - Reglas de seguridad atómicas| |
|  +----------------------------+             | - Subcolecciones de auditoría | |
|                                             +-------------------------------+ |
+-------------------------------------------------------------------------------+
                                         ^
                                         | Automatización gcloud / Scheduled Cron
+-------------------------------------------------------------------------------+
|                       ESTRATEGIA DE RESPALDO Y RESILIENCIA                     |
|  +---------------------------+               +------------------------------+ |
|  | Point-in-Time Recovery    |               | Cloud Storage Backups Bucket | |
|  | - Ventana 7 días continua |               | - Exportaciones frías diarias| |
|  | - Recuperación al segundo |               | - Multi-region storage       | |
|  +---------------------------+               +------------------------------+ |
+-------------------------------------------------------------------------------+
```

## 2. Componentes Arquitectónicos

### Capa Frontend (Client-Side)
- **Framework:** React 19 empaquetado con Vite para compilación ultrarrápida (HMR y builds optimizados).
- **Enrutamiento:** React Router con protección de rutas condicional basada en roles (`ProtectedRoute`).
- **Diseño de Interfaz:** Tailwind CSS con componentes modulares, accesibles y responsivos para móvil y escritorio.
- **Gestión de Estado:** Context API (`AuthContext`) acoplado a listeners reactivos de Firebase (`onAuthStateChanged`).

### Capa de Persistencia NoSQL (Cloud Firestore)
- Estructura de documentos JSON flexibles sin esquemas rígidos (schemaless).
- Soporte para subcolecciones jerárquicas (`tickets/{ticketId}/historial`).
- Transacciones y escrituras por lotes (`writeBatch`) para consistencia atómica entre cambios de estado y registro de auditoría.

### Capa de Respaldo y Continuidad del Negocio
- **Point-in-Time Recovery (PITR):** Recuperación granular ante modificaciones erróneas con resolución de hasta un segundo en una ventana de retención de 7 días.
- **Managed Exports:** Exportaciones automáticas programadas mediante Cloud Scheduler hacia buckets de Cloud Storage con políticas de ciclo de vida.

### Capa de Entrega Continua (CI/CD)
- Repositorio público en GitHub.
- Flujo automatizado en GitHub Actions con pruebas unitarias (`vitest`), compilación y despliegue a producción en Render.
