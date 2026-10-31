# Guion de Video Demostrativo (Máximo 5 Minutos)

**Título sugerido:** *HelpDesk Cloud: Arquitectura NoSQL, CI/CD y Estrategia de Respaldo en la Nube*  
**Duración objetivo:** Entre 4:00 y 4:55 minutos (nunca exceder 5:00)  
**Canales de publicación sugeridos:** YouTube (modo público o no listado con acceso abierto), LinkedIn, TikTok o Facebook.

---

## Estructura Minuto a Minuto

| Tiempo | Bloque | Lo que se Muestra en Pantalla | Lo que se Dice (Voz en Off / Presentador) |
|---|---|---|---|
| **00:00 - 00:35** | **1. Introducción y Problema** | - Diapositiva o portada con título del proyecto, nombres de los integrantes y logo de HelpDesk Cloud.<br>- Vista general del navegador en la pantalla de bienvenida. | *"¡Hola a todos! En este video presentamos **HelpDesk Cloud**, una solución para la gestión de incidencias de TI diseñada bajo una arquitectura moderna con base de datos NoSQL. Abordamos cómo construir una aplicación ágil, asegurar el control de acceso por roles y, fundamentalmente, cómo implementar una estrategia robusta de respaldo y recuperación ante desastres en bases de datos NoSQL."* |
| **00:35 - 01:15** | **2. Arquitectura y Modelo NoSQL** | - Diagrama de arquitectura (`docs/arquitectura.md`).<br>- Consola de Cloud Firestore mostrando las colecciones `usuarios`, `tickets` y la subcolección `historial`.<br>- Archivo `firestore.rules`. | *"Utilizamos **Cloud Firestore**, una base de datos documental en la nube pública de Google. A diferencia de las bases relacionales tradicionales, modelamos cada incidencia como un documento con subcolecciones de historial atómico. Además, las reglas de Firestore garantizan que un usuario común jamás pueda elevar sus privilegios o modificar tickets ajenos."* |
| **01:15 - 02:30** | **3. Demostración en Vivo de la App** | - Login en `https://helpdesk-cloud.onrender.com`.<br>- Creación de un ticket de hardware.<br>- Cambio de vista a Administrador asignando el ticket a un técnico.<br>- Vista de Técnico cambiando el estado a 'En Proceso' y documentando solución. | *"Aquí vemos la aplicación web responsive desplegada en producción en Render. Como usuario, registramos un nuevo ticket de falla de impresora. Al ingresar como Administrador, podemos asignarlo a un técnico especializado. El técnico accede a su panel, toma la incidencia en proceso y documenta la solución. Todo cambio genera una traza de auditoría inmutable en Firestore."* |
| **02:30 - 03:30** | **4. Automatización CI/CD con GitHub Actions** | - Repositorio público en GitHub (`https://github.com/Stevien04/HelpDesk-Cloud`).<br>- Pestaña 'Actions' mostrando la última ejecución verde del workflow `deploy.yml`.<br>- Pruebas unitarias pasando con Vitest. | *"Todo el ciclo de vida del software está automatizado. Nuestro repositorio público en GitHub cuenta con una canalización de CI/CD mediante **GitHub Actions**. Al hacer cualquier commit a la rama principal, el pipeline ejecuta las pruebas unitarias, compila el bundle con Vite y despliega automáticamente la nueva versión a Render sin intervención manual."* |
| **03:30 - 04:30** | **5. Estrategia de Respaldo NoSQL (Backup)** | - Pestaña de Reportes de la app mostrando el módulo de respaldo.<br>- Terminal ejecutando el comando de exportación `gcloud firestore export` hacia Cloud Storage.<br>- Explicación del Point-in-Time Recovery (PITR). | *"Un punto neurálgico del proyecto es la **Estrategia de Respaldo NoSQL**. En Firestore habilitamos dos niveles: primero, **PITR (Point-in-Time Recovery)**, que nos permite rebobinar la base de datos a cualquier segundo exacto en los últimos 7 días ante errores humanos; y segundo, **exportaciones programadas diarias a Google Cloud Storage**, logrando un RPO menor a 1 minuto y un RTO menor a 20 minutos."* |
| **04:30 - 05:00** | **6. Conclusiones y Enlaces Públicos** | - Pantalla final con los enlaces: Repositorio GitHub, URL de la app desplegada, artículo técnico publicado y video. | *"Con HelpDesk Cloud hemos demostrado la viabilidad, escalabilidad y seguridad de las bases de datos NoSQL en entornos corporativos. En la descripción del video y en nuestro artículo de Dev.to/Medium encontrarán todos los enlaces al repositorio y documentación completa. ¡Muchas gracias!"* |

---

## Consejos para la Grabación y Entrega
1. **Resolución:** Graba en 1080p (Full HD) a 30 o 60 fps con OBS Studio o la grabadora integrada de Windows (Win + Alt + R).
2. **Audio nítido:** Utiliza auriculares con micrófono y evita ruido ambiental.
3. **Visibilidad del enlace:** Verifica en una ventana de incógnito que el video sea accesible de forma pública sin requerir permisos privados de Google Drive o cuentas restringidas.
