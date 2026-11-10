# Guion del video — HelpDesk Cloud

Cada paso dice **qué mostrar** en pantalla y **qué decir** mientras se ve. El texto sigue el orden de lo que aparece en cada diapositiva, de izquierda a derecha y de arriba abajo.

Duración total: 4:50. Límite: 5:00.

---

## Antes de grabar

### 1. Deja solo tres pestañas, en este orden

| Pestaña | Qué abrir | Atajo |
|---|---|---|
| 1 | `video/slides.html` (doble clic sobre el archivo) | `Ctrl + 1` |
| 2 | `https://helpdesk-cloud.onrender.com` | `Ctrl + 2` |
| 3 | `https://github.com/Stevien04/HelpDesk-Cloud/actions` | `Ctrl + 3` |

Cierra todas las demás pestañas.

### 2. Pon el navegador en pantalla completa

Pulsa `F11`. Desaparecen las pestañas y la barra de direcciones, y la ventana ocupa toda la pantalla. Los atajos `Ctrl + 1`, `Ctrl + 2` y `Ctrl + 3` siguen funcionando.

### 3. Aprende a mover las diapositivas

Las diapositivas ya no se recorren con la rueda del ratón. Se ve una sola a la vez:

- `→` o `Espacio`: siguiente.
- `←`: anterior.
- Teclas `1` a `9`: salta directo a esa diapositiva.

### 4. Prepara la aplicación

Los accesos rápidos (Admin, Técnico, Usuario) inician sesión con tres cuentas de demostración reales, así que los tres roles ven los mismos tickets. Hay que prepararlas una sola vez:

1. En la pantalla de inicio, pulsa una vez cada acceso rápido: **Usuario**, **Técnico** y **Admin**. La primera vez, cada cuenta se crea sola con rol `usuario`; con Técnico y Admin verás un aviso de que falta asignar el rol.
2. En la consola de Firebase → Firestore → colección `usuarios`, abre el documento de `demo.tecnico@example.com` y cambia `rol` a `tecnico`; abre el de `demo.admin@example.com` y cambia `rol` a `admin`.
3. Haz una prueba completa antes de grabar: crea un ticket, asígnalo y atiéndelo.
4. Deja abierta la pantalla de inicio de sesión. Abre la aplicación un minuto antes de grabar: el servidor tarda en despertar la primera vez.

Para cambiar de rol durante la demo, usa el selector **Demo Rol** de la barra superior (Usuario, Técnico, Admin).

### 5. Corrige OBS

En la grabación anterior la aplicación salía cortada por la derecha.

1. Ajustes → Video → **Resolución base (lienzo)**: la misma que tu monitor.
2. Ajustes → Video → **Resolución de salida**: 1920×1080.
3. En la escena, clic derecho sobre la fuente de pantalla → Transformar → **Ajustar a la pantalla**.
4. Graba 10 segundos de prueba y comprueba que se ve la pantalla entera.

### 6. Habla cerca del micrófono

El audio anterior quedó bajo. Acerca el micrófono o sube su nivel en el mezclador de OBS hasta que la barra llegue a la zona amarilla cuando hablas.

---

## Guion paso a paso

### Paso 1 — Portada · 0:00 a 0:15

**MOSTRAR:** pestaña 1, diapositiva 1 (pulsa `1`). Título «HelpDesk Cloud».

**DECIR:**
> Hola a todos. Les presento HelpDesk Cloud, un sistema de gestión de incidencias de TI. Está construido con Cloud Firestore, React, GitHub Actions y Render.

---

### Paso 2 — Introducción · 0:15 a 0:35

**MOSTRAR:** pulsa `→`. Diapositiva 2, con tres tarjetas numeradas.

**DECIR:**
> El proyecto resuelve tres cosas. Primero, una aplicación ágil para registrar, asignar y seguir tickets. Segundo, el acceso por roles: usuario, técnico y administrador. Y tercero, el respaldo y la recuperación de los datos ante un desastre.

---

### Paso 3 — Arquitectura · 0:35 a 0:55

**MOSTRAR:** pulsa `→`. Diapositiva 3, con tres capas de arriba abajo.

**DECIR:**
> La arquitectura tiene tres capas. Arriba, la presentación: una aplicación en React publicada en Render. En el medio, los servicios en la nube: Firebase Authentication para el inicio de sesión y Cloud Firestore como base de datos NoSQL. Y abajo, la capa de respaldo.

---

### Paso 4 — Modelo NoSQL · 0:55 a 1:15

**MOSTRAR:** pulsa `→`. Diapositiva 4. A la izquierda, las colecciones; a la derecha, las reglas.

**DECIR:**
> A la izquierda está el modelo de datos. Hay una colección de usuarios y una de tickets, y cada ticket guarda su propio historial como subcolección. A la derecha, las reglas de seguridad: solo el administrador cambia roles y asigna técnicos, y el historial no se puede modificar ni borrar.

---

### Paso 5 — Entrada a la demo · 1:15 a 1:22

**MOSTRAR:** pulsa `→`. Diapositiva 5, «Un ticket, de principio a fin».

**DECIR:**
> Ahora veamos la aplicación funcionando, con un ticket de principio a fin.

---

### Paso 6 — Demo: el usuario crea un ticket · 1:22 a 1:45

**MOSTRAR:** pulsa `Ctrl + 2` para ir a la aplicación.

1. En la pantalla de inicio, haz clic en el acceso rápido **Usuario**.
2. En el menú de la izquierda, haz clic en **Crear Ticket**.
3. Escribe el título: `Impresora de ventas no imprime`.
4. Elige la categoría **Hardware** y una prioridad.
5. Escribe la descripción: `La impresora del área de ventas no responde desde esta mañana.`
6. Pulsa el botón azul para registrar. Espera el mensaje verde de confirmación.

**DECIR:**
> Esta es la aplicación publicada en Render. Entro como usuario y creo un ticket: una impresora que no imprime. Indico la categoría, la prioridad y la descripción, y lo registro.

---

### Paso 7 — Demo: el administrador asigna · 1:45 a 2:05

**MOSTRAR:**

1. En la barra superior, en **Demo Rol**, haz clic en **Admin**.
2. En el menú de la izquierda, haz clic en **Incidencias**.
3. Haz clic en el ticket de la impresora para abrirlo.
4. En «Asignar a Técnico», elige un técnico de la lista.
5. Pulsa **Confirmar Asignación**. Espera el mensaje verde.

**DECIR:**
> Ahora cambio al rol de administrador. El administrador ve todas las incidencias. Abro el ticket, elijo un técnico de la lista y confirmo la asignación.

---

### Paso 8 — Demo: el técnico atiende · 2:05 a 2:30

**MOSTRAR:**

1. En la barra superior, en **Demo Rol**, haz clic en **Técnico**.
2. En el menú, haz clic en **Incidencias** y abre el ticket de la impresora.
3. Pulsa **Tomar en Proceso**.
4. Baja hasta «Documentar Solución». Escribe: `Se reemplazó el cartucho y se reinstaló el controlador.` Pulsa el botón de enviar.
5. Baja hasta «Historial de Auditoría y Solución» y déjalo en pantalla dos segundos.

**DECIR:**
> Por último, el técnico. Abre el ticket que tiene asignado, documenta la solución y cambia el estado. Abajo se ve el historial: cada asignación, cada comentario y cada cambio de estado queda registrado, con su autor y su fecha.

---

### Paso 9 — CI/CD: el flujo · 2:30 a 2:50

**MOSTRAR:** pulsa `Ctrl + 1` para volver a las diapositivas y luego `6`. Diapositiva 6, con cinco cajas en fila.

**DECIR:**
> El despliegue está automatizado con GitHub Actions. Cada push a la rama main instala las dependencias, ejecuta las pruebas con Vitest, compila con Vite y despliega la nueva versión en Render.

---

### Paso 10 — CI/CD: la evidencia · 2:50 a 3:20

**MOSTRAR:** pulsa `Ctrl + 3` para ir a GitHub Actions.

1. Señala con el ratón la lista de ejecuciones y los vistos verdes.
2. Haz clic en la ejecución más reciente (la de arriba).
3. Haz clic en el trabajo **Pruebas y Compilación** para que se vean los pasos.

**DECIR:**
> Este es el repositorio público. En la pestaña Actions se ven las ejecuciones del pipeline, las últimas en verde. Si abro una, aparecen los pasos: instalar, probar, compilar y desplegar. Si una prueba falla, el flujo se detiene y no se publica nada.

---

### Paso 11 — Respaldo: dos niveles · 3:20 a 3:50

**MOSTRAR:** pulsa `Ctrl + 1` y luego `7`. Diapositiva 7, con dos tarjetas.

**DECIR:**
> La parte central del proyecto es la estrategia de respaldo, que tiene dos niveles. A la izquierda, el nivel continuo: Point-in-Time Recovery, que permite volver la base de datos a cualquier segundo de los últimos siete días. A la derecha, el nivel programado: una exportación diaria a Cloud Storage, para conservar copias a largo plazo.

---

### Paso 12 — Respaldo: objetivos · 3:50 a 4:10

**MOSTRAR:** pulsa `→`. Diapositiva 8, con tres cifras grandes.

**DECIR:**
> Con esta estrategia definimos tres objetivos. Un RPO menor a un minuto, es decir, casi no se pierden datos. Un RTO menor a veinte minutos para restaurar el servicio. Y una durabilidad de once nueves en Cloud Storage. Además, las copias van cifradas.

---

### Paso 13 — Respaldo en la aplicación · 4:10 a 4:25

**MOSTRAR:** pulsa `Ctrl + 2` para ir a la aplicación.

1. Sigue con la sesión que tengas abierta; no hace falta cambiar de cuenta.
2. En el menú, haz clic en **Reportes y Métricas**.
3. Baja hasta el panel «Estrategia de Respaldo NoSQL» y déjalo en pantalla.

**DECIR:**
> La propia aplicación documenta esta estrategia en el módulo de reportes, con los comandos para activar la recuperación, exportar y restaurar.

---

### Paso 14 — Conclusiones · 4:25 a 4:50

**MOSTRAR:** pulsa `Ctrl + 1` y luego `9`. Diapositiva 9, con los enlaces.

**DECIR:**
> En conclusión, HelpDesk Cloud demuestra que una base de datos NoSQL es viable, escalable y segura en un entorno corporativo. En pantalla están los enlaces al repositorio y a la aplicación, y en la descripción del video encontrarán el artículo. Muchas gracias.

---

## Resumen para tener a la vista

| Paso | Tiempo | Pestaña | Qué se ve |
|---|---|---|---|
| 1 | 0:00 | 1 | Diapositiva 1: portada |
| 2 | 0:15 | 1 | Diapositiva 2: introducción |
| 3 | 0:35 | 1 | Diapositiva 3: arquitectura |
| 4 | 0:55 | 1 | Diapositiva 4: modelo NoSQL |
| 5 | 1:15 | 1 | Diapositiva 5: entrada a la demo |
| 6 | 1:22 | 2 | App: el usuario crea un ticket |
| 7 | 1:45 | 2 | App: el administrador asigna |
| 8 | 2:05 | 2 | App: el técnico atiende; historial |
| 9 | 2:30 | 1 | Diapositiva 6: flujo de CI/CD |
| 10 | 2:50 | 3 | GitHub Actions: ejecuciones en verde |
| 11 | 3:20 | 1 | Diapositiva 7: dos niveles de respaldo |
| 12 | 3:50 | 1 | Diapositiva 8: objetivos |
| 13 | 4:10 | 2 | App: panel de respaldo en Reportes |
| 14 | 4:25 | 1 | Diapositiva 9: conclusiones |

## Nota sobre los accesos de demostración

Los botones **Admin**, **Técnico** y **Usuario** inician sesión con cuentas de demostración reales, definidas en `src/config/demoAccounts.js`. Su contraseña es pública a propósito, así que cualquiera que abra la aplicación puede entrar con esos roles: no guardes en la demo nada que no pueda verse o borrarse.
