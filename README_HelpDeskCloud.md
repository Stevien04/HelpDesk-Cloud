# HelpDesk Cloud — Sistema de Gestión de Incidencias con NoSQL

> Proyecto académico: **Construct and Deploy an App with NoSQL Database**. Se utilizará **Cloud Firestore** (NoSQL), sin Redis, MongoDB, Neo4j ni Prometheus.

## 1. Objetivo
Construir una aplicación web responsive donde los usuarios reporten incidencias informáticas, los técnicos gestionen los tickets asignados y un administrador supervise el soporte. El código será público, la aplicación se desplegará en Firebase Hosting y el despliegue se automatizará con GitHub Actions.

## 2. Stack tecnológico

| Área | Tecnología |
|---|---|
| Frontend | React + Vite |
| Estilos | Tailwind CSS |
| Navegación | React Router |
| Base de datos NoSQL | Firebase Cloud Firestore |
| Autenticación | Firebase Authentication (email/contraseña) |
| Hosting público | Firebase Hosting |
| Automatización CI/CD | GitHub Actions |
| Repositorio | GitHub (público) |
| Artículo | Dev.to, Medium o Hashnode |
| Video | YouTube u otra red pública, máximo 5 minutos |

**Costo esperado:** prototipo dentro de las cuotas gratuitas de Firebase Spark y GitHub Actions para repositorios públicos. Verificar límites vigentes antes del despliegue. No habilitar servicios de pago sin autorización.

## 3. Roles y permisos

- **Usuario:** registrarse, iniciar sesión, crear tickets, consultar los propios y comentar en ellos. No puede modificar rol, prioridad administrativa, asignaciones ni tickets ajenos.
- **Técnico:** consultar tickets asignados, cambiar su estado permitido, agregar comentarios y documentar soluciones.
- **Administrador:** gestionar asignaciones, categorías, prioridades y usuarios; consultar todos los tickets y reportes. Solo el administrador puede conceder rol de técnico o administrador a otros usuarios mediante un mecanismo seguro.

**Importante:** no confiar en un campo `rol` enviado por el frontend. Las reglas de Firestore deben validar permisos usando datos protegidos del usuario o custom claims. El alta inicial del administrador debe ser un proceso seguro y documentado, nunca un formulario público.

## 4. Funcionalidades mínimas (MVP)

1. Registro, inicio/cierre de sesión y recuperación de contraseña.
2. Dashboard según rol: total de tickets, pendientes, en proceso y resueltos.
3. CRUD controlado de tickets: título, descripción, categoría, prioridad y estado.
4. Asignación de tickets a técnicos por administrador.
5. Historial de cambios y comentarios por ticket.
6. Búsqueda y filtros por estado, prioridad, categoría y fecha.
7. Reportes básicos con contadores y gráficos.
8. Diseño responsive, estados de carga, validaciones y mensajes de error.

### Reglas de negocio

- Estados: `pendiente`, `en_proceso`, `resuelto`, `cerrado`.
- Prioridades: `baja`, `media`, `alta`, `critica`.
- Un usuario únicamente puede ver y comentar sus tickets.
- Un técnico solo puede acceder a los tickets que le asignaron.
- La asignación y modificación de permisos es exclusiva de un administrador.
- Cada cambio relevante genera un evento en el historial (usuario, fecha, acción, valor anterior/nuevo).
- Usar marcas de tiempo del servidor (`serverTimestamp`) para auditoría.
- Operaciones que cambian ticket e historial deben ser atómicas mediante transacciones o batch writes cuando corresponda.

## 5. Arquitectura

```text
Usuarios / Técnicos / Administrador
               |
               v
      React + Vite (SPA)
      Firebase Hosting (HTTPS)
               |
        Firebase SDK Web
            /      \
           v        v
 Firebase Auth    Cloud Firestore
 (identidad)      (documentos NoSQL)

GitHub público --> GitHub Actions (test/build)
                            |
                            v
                   Firebase Hosting (deploy)
```

No hace falta un backend Express para el MVP. Firestore Security Rules son obligatorias para proteger lectura y escritura; si se necesitan tareas administrativas privilegiadas, utilizar un servicio confiable separado con Admin SDK, nunca incluir credenciales administrativas en React.

## 6. Estructura del repositorio

```text
HelpDeskCloud/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── tickets/
│   │   │   ├── TicketCard.jsx
│   │   │   ├── TicketForm.jsx
│   │   │   ├── TicketFilters.jsx
│   │   │   └── StatusBadge.jsx
│   │   └── common/
│   │       ├── Loading.jsx
│   │       └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tickets.jsx
│   │   ├── NuevoTicket.jsx
│   │   ├── DetalleTicket.jsx
│   │   ├── Tecnicos.jsx
│   │   ├── Reportes.jsx
│   │   └── NotFound.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useTickets.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── ticketService.js
│   │   └── userService.js
│   ├── utils/
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tests/
│   └── validators.test.js
├── docs/
│   ├── arquitectura.md
│   ├── firestore.md
│   ├── despliegue.md
│   ├── articulo.md
│   └── guion-video.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .env.example
├── .gitignore
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── .firebaserc.example
├── package.json
├── vite.config.js
└── README.md
```

## 7. Modelo de datos NoSQL (Cloud Firestore)

Firestore utiliza colecciones de documentos. Las colecciones propuestas son:

| Colección | Propósito | ID recomendado |
|---|---|---|
| `usuarios` | Perfil y rol autorizado del usuario | UID de Firebase Auth |
| `tickets` | Incidencias registradas | ID autogenerado |
| `categorias` | Hardware, software, red, otros | ID autogenerado |
| `tickets/{ticketId}/historial` | Auditoría y comentarios por ticket | ID autogenerado |

### Documento `usuarios/{uid}`

```json
{
  "nombre": "María Torres",
  "email": "maria@example.com",
  "rol": "usuario",
  "activo": true
}
```

### Documento `tickets/{ticketId}`

```json
{
  "titulo": "Computadora no enciende",
  "descripcion": "Equipo del laboratorio 2 no inicia",
  "categoriaId": "hardware",
  "prioridad": "alta",
  "estado": "pendiente",
  "creadoPor": "UID_USUARIO",
  "asignadoA": null,
  "fechaCreacion": "TIMESTAMP_FIRESTORE",
  "fechaActualizacion": "TIMESTAMP_FIRESTORE"
}
```

### Documento `tickets/{ticketId}/historial/{eventoId}`

```json
{
  "tipo": "cambio_estado",
  "autorId": "UID_TECNICO",
  "anterior": "pendiente",
  "nuevo": "en_proceso",
  "comentario": "Se inició el diagnóstico",
  "fecha": "TIMESTAMP_FIRESTORE"
}
```

**Nota:** los valores `TIMESTAMP_FIRESTORE` son marcadores ilustrativos; en el código usar el tipo Timestamp y `serverTimestamp()`, no cadenas de texto. Las reglas de seguridad deben controlar también las subcolecciones de historial.

## 8. Reglas de seguridad

Implementar y probar `firestore.rules` para garantizar al menos:

- Solo usuarios autenticados acceden a la aplicación privada.
- Los perfiles se pueden leer conforme a su necesidad; campos sensibles y roles no son editables por el propio usuario.
- Los usuarios crean tickets únicamente con su propio UID como `creadoPor`.
- No permitir que un usuario altere `asignadoA`, prioridad restringida, propietario o campos protegidos.
- Técnicos solo consultan tickets asignados; administradores pueden consultar y administrar todos.
- El historial no permite cambios retroactivos ni borrados por clientes no privilegiados.
- Las consultas de Firestore deben estar diseñadas para cumplir las reglas; las reglas no son filtros automáticos.

Probar con Firebase Emulator Suite casos permitidos y denegados antes de desplegar. Si una regla de negocio no se puede garantizar con seguridad desde clientes, mover esa operación a un backend confiable.

## 9. Instalación local

Requisitos: Node.js LTS, npm, cuenta Firebase y repositorio GitHub.

```bash
npm install
cp .env.example .env
npm run dev
```

En Windows PowerShell: `Copy-Item .env.example .env`.

Variables de ejemplo:

```dotenv
VITE_FIREBASE_API_KEY=valor_del_proyecto
VITE_FIREBASE_AUTH_DOMAIN=valor_del_proyecto
VITE_FIREBASE_PROJECT_ID=valor_del_proyecto
VITE_FIREBASE_STORAGE_BUCKET=valor_del_proyecto
VITE_FIREBASE_MESSAGING_SENDER_ID=valor_del_proyecto
VITE_FIREBASE_APP_ID=valor_del_proyecto
```

La configuración cliente de Firebase no reemplaza las reglas de seguridad. Nunca subir contraseñas, tokens de despliegue ni claves de cuentas de servicio al repositorio.

## 10. Comandos esperados

```bash
npm run dev       # Desarrollo local
npm run build     # Compilar para producción
npm run preview   # Previsualizar build
npm run test      # Pruebas automatizadas
npm run lint      # Análisis estático
```

## 11. CI/CD con GitHub Actions

Flujo de despliegue:

1. Desarrollar cambios en rama de trabajo.
2. Hacer pull request y ejecutar instalación, lint, test y build.
3. Integrar en `main` cuando las verificaciones pasen.
4. Ejecutar GitHub Actions y desplegar la carpeta `dist/` a Firebase Hosting mediante acción oficial o CLI.
5. Comprobar la URL HTTPS publicada.

Configurar en GitHub los secretos o credenciales necesarios para el despliegue con permisos mínimos. Utilizar una integración oficial de Firebase Hosting con GitHub cuando sea posible. Las credenciales nunca deben mostrarse en logs ni publicarse en Git.

**Criterio de aceptación CI/CD:** se debe ver en el historial de GitHub Actions una ejecución correcta y comprobar que un nuevo cambio aparece automáticamente en la URL pública.

## 12. Despliegue en Firebase

1. Crear un proyecto Firebase.
2. Activar Authentication con correo/contraseña.
3. Crear Cloud Firestore en una región elegida y configurar reglas restrictivas.
4. Crear Firebase Hosting para la aplicación React.
5. Configurar la compilación Vite (`dist`) y el fallback de SPA hacia `/index.html`.
6. Publicar reglas e índices de Firestore y después la aplicación.
7. Integrar GitHub Actions para despliegues automáticos.
8. Probar autenticación, permisos por rol y CRUD desde la URL pública.

**No afirmar que el proyecto está desplegado hasta tener y verificar la URL real.**

## 13. Pruebas de aceptación

- [ ] Se registra un usuario y puede iniciar sesión.
- [ ] Un usuario crea un ticket y lo ve en su lista.
- [ ] Otro usuario no puede leer ese ticket.
- [ ] Un técnico puede acceder solo a tickets asignados.
- [ ] Un usuario no puede elevar su propio rol a administrador.
- [ ] Un administrador asigna tickets a técnicos.
- [ ] Los cambios de estado generan historial.
- [ ] Los filtros y el dashboard muestran datos correctos.
- [ ] Las pruebas, lint y build pasan en GitHub Actions.
- [ ] Un push a `main` desencadena un despliegue verificable.
- [ ] La web funciona desde su URL pública en móvil y escritorio.

## 14. Entregables del curso

### Repositorio público

`https://github.com/USUARIO/helpdesk-cloud-nosql` (reemplazar por la URL real).

Debe contener código fuente, reglas de Firestore, workflow CI/CD, capturas y este README. No incluir archivos `.env`, credenciales, datos privados ni artefactos sensibles.

### Artículo (cada integrante publica el suyo)

Título sugerido: **Construcción y Despliegue Automatizado de HelpDesk Cloud con React, Cloud Firestore y GitHub Actions**.

Estructura:

1. Problema y objetivo.
2. Por qué Firestore es una base de datos NoSQL y por qué fue elegida.
3. Arquitectura y modelo de documentos.
4. Funcionalidades desarrolladas y capturas.
5. Repositorio público y organización del código.
6. Configuración del flujo CI/CD.
7. Publicación en Firebase Hosting y URL real.
8. Pruebas, dificultades y resultados.
9. Conclusiones y enlaces al repositorio, aplicación y video.

### Guion de video — máximo 5 minutos

| Tiempo | Contenido |
|---|---|
| 00:00–00:35 | Presentación del problema y objetivo |
| 00:35–01:15 | Tecnologías, arquitectura y colección de Firestore |
| 01:15–02:30 | Demo funcional: login, creación y atención de tickets |
| 02:30–03:30 | Repositorio GitHub y ejecución de GitHub Actions |
| 03:30–04:30 | Aplicación desplegada y datos reales de prueba en Firestore |
| 04:30–05:00 | Resultados y enlaces públicos |

Subir a YouTube, Facebook, TikTok u otra red social pública y comprobar que el enlace se puede abrir sin permisos especiales.

### Telegram y ZIP

Enviar al grupo de Telegram los enlaces del artículo y video, y agregar opcionalmente repositorio y URL de la aplicación. Entregar un ZIP con un archivo `links.txt` como este:

```text
Proyecto: HelpDesk Cloud
Integrante: NOMBRE_DEL_INTEGRANTE
Repositorio GitHub: URL_REAL
Aplicación desplegada: URL_REAL
Artículo publicado: URL_REAL
Video público (<= 5 min): URL_REAL
```

**Cada integrante del equipo debe publicar su propio artículo**, según las instrucciones del docente.

## 15. Instrucción para Antigravity

> Construye HelpDesk Cloud a partir de este README. Crea la estructura de carpetas indicada e implementa primero autenticación y reglas Firestore seguras, luego CRUD de tickets, asignación, historial, dashboard y filtros. Agrega pruebas y GitHub Actions para desplegar automáticamente a Firebase Hosting. Usa React, Vite, Tailwind y Cloud Firestore. No uses Redis, MongoDB, Neo4j ni Prometheus. No simules como terminadas integraciones que todavía no estén configuradas; documenta variables de entorno y pasos manuales. Mantén el MVP funcional, responsive y apto para una demostración académica de menos de cinco minutos.

## 16. Estado del proyecto

**Estado inicial:** especificación preparada. Pendientes: código, creación de Firebase, pruebas, despliegue, enlaces públicos, artículos individuales y video.
