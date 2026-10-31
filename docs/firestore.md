# Modelo de Datos NoSQL y Seguridad en Cloud Firestore

## 1. Justificación de NoSQL para HelpDesk Cloud

A diferencia de los modelos relacionales basados en tablas normalizadas, las operaciones de soporte técnico y helpdesk presentan las siguientes características:
1. **Atributos polimórficos:** Las incidencias de hardware requieren metadatos distintos a las de software o telecomunicaciones.
2. **Escalabilidad horizontal automática:** El volumen de tickets y comentarios puede crecer exponencialmente durante contingencias.
3. **Estructura jerárquica natural:** Cada ticket contiene un historial cronológico de intervenciones técnicas que se modela óptimamente como subcolección.

## 2. Definición de Colecciones

### Colección: `usuarios`
- **Ruta:** `/usuarios/{uid}`
- **ID del documento:** UID asignado por Firebase Authentication.
- **Campos:**
  - `nombre` (string): Nombre y apellidos del colaborador.
  - `email` (string): Correo corporativo.
  - `rol` (string): 'usuario' | 'tecnico' | 'admin'.
  - `activo` (boolean): Flag de habilitación en el sistema.
  - `fechaCreacion` (timestamp): Fecha de registro (`serverTimestamp()`).

### Colección: `tickets`
- **Ruta:** `/tickets/{ticketId}`
- **ID del documento:** Hash autogenerado por Firestore.
- **Campos:**
  - `titulo` (string): Breve descripción de la falla.
  - `descripcion` (string): Explicación detallada y pasos de reproducción.
  - `categoriaId` (string): 'hardware' | 'software' | 'red' | 'otros'.
  - `prioridad` (string): 'baja' | 'media' | 'alta' | 'critica'.
  - `estado` (string): 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado'.
  - `creadoPor` (string): UID del usuario que reportó la incidencia.
  - `creadorNombre` (string): Nombre para visualización ágil (desnormalización de lectura).
  - `creadorEmail` (string): Correo para notificaciones.
  - `asignadoA` (string | null): UID del técnico responsable.
  - `asignadoNombre` (string | null): Nombre del técnico.
  - `fechaCreacion` (timestamp): Fecha y hora en servidor.
  - `fechaActualizacion` (timestamp): Última modificación.

### Subcolección: `historial`
- **Ruta:** `/tickets/{ticketId}/historial/{eventoId}`
- **ID del documento:** Autogenerado.
- **Campos:**
  - `tipo` (string): 'creacion' | 'asignacion' | 'cambio_estado' | 'comentario'.
  - `autorId` (string): UID de quien ejecutó la acción.
  - `autorNombre` (string): Nombre del autor.
  - `anterior` (string | null): Estado o valor previo.
  - `nuevo` (string | null): Nuevo estado o valor.
  - `comentario` (string): Justificación técnica o respuesta.
  - `fecha` (timestamp): Marca de tiempo del servidor.

## 3. Matriz de Control de Acceso (Reglas de Seguridad)

| Operación | Rol Usuario | Rol Técnico | Rol Admin | Regla de Validación |
|---|---|---|---|---|
| Crear Perfil | Sí (solo 'usuario') | No | Sí | `request.resource.data.rol == 'usuario'` |
| Cambiar Rol | Denegado | Denegado | Permitido | Solo el administrador puede elevar permisos |
| Crear Ticket | Permitido | Permitido | Permitido | `request.resource.data.creadoPor == request.auth.uid` |
| Ver Tickets | Solo propios | Solo asignados | Todos | Filtrado por consulta obligatoria |
| Asignar Técnico | Denegado | Denegado | Permitido | Solo admin modifica campo `asignadoA` |
| Transicionar Estado | Resuelto -> Cerrado | Pendiente -> En Proceso -> Resuelto | Todos | Valida flujo de estados |
| Modificar Historial | Denegado | Denegado | Denegado | El historial es inmutable (`allow update, delete: if false`) |
