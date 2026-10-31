# Estrategia de Respaldo y Recuperación para Base de Datos NoSQL (Cloud Firestore)

## 1. Introducción y Desafíos del Respaldo en Bases de Datos NoSQL

A diferencia de las bases de datos relacionales tradicionales (donde un comando como `pg_dump` o `mysqldump` bloquea o extrae tablas de manera secuencial en un único host), las bases de datos **NoSQL distribuidas en la nube (Cloud Firestore)** presentan características y retos específicos:
- **Almacenamiento distribuido multirregional:** Los datos se encuentran particionados y replicados en múltiples nodos geográficos.
- **Consistencia y escrituras concurrentes:** Realizar copias sin degradar la latencia ni bloquear escrituras en producción.
- **Escalabilidad masiva y subcolecciones:** Un ticket contiene subdocumentos de auditoría que deben respaldarse preservando la jerarquía de caminos de documentos.

Para la aplicación **HelpDesk Cloud**, se diseñó una estrategia integral de respaldo de dos niveles: **Respaldo Continuo (PITR)** y **Respaldos Periódicos en Frío (Cloud Storage Managed Exports)**.

---

## 2. Arquitectura de la Solución de Respaldo

```text
+----------------------------------------------------------------------------+
|                          CLOUD FIRESTORE (PRODUCCIÓN)                      |
|                                                                            |
|  Colección: usuarios        Colección: tickets       Subcolección: historial|
+----------------------------------------------------------------------------+
         |                                                 |
         | (Nivel 1: Continuo)                             | (Nivel 2: Programado)
         v                                                 v
+-------------------------------+              +-----------------------------+
| Point-in-Time Recovery (PITR) |              | Cloud Scheduler (Cron 02:00)|
| - Protección activa de 7 días |              +-----------------------------+
| - Resolución al segundo exacto|                              |
| - Recuperación ante corrupción|                              v
|   o borrado accidental        |              +-----------------------------+
+-------------------------------+              | Cloud Function / API Export |
                                               +-----------------------------+
                                                               |
                                                               v
                                               +-----------------------------+
                                               | Google Cloud Storage (GCS)  |
                                               | Bucket: gs://helpdesk-bkp/  |
                                               | Lifecycle: 30d -> Coldline  |
                                               +-----------------------------+
```

---

## 3. Niveles de la Estrategia

### Nivel 1: Point-in-Time Recovery (PITR) — Alta Resolución
- **Objetivo:** Proteger contra eliminaciones accidentales provocadas por errores humanos o despliegues fallidos.
- **Ventana de retención:** 7 días continuos.
- **Granularidad:** Recuperación con marca de tiempo precisa al segundo (`timestamp`).
- **Comando de activación:**
  ```bash
  gcloud firestore databases update --database="(default)" --point-in-time-recovery=ENABLE
  ```
- **Proceso de restauración PITR:**
  Permite clonar la base de datos a un estado previo exacto hacia una nueva base de datos o restaurar documentos específicos:
  ```bash
  gcloud firestore databases clone \
    --source-database="(default)" \
    --destination-database="helpdesk-restored" \
    --point-in-time="2026-10-30T20:00:00Z"
  ```

---

### Nivel 2: Exportaciones Programadas a Google Cloud Storage
- **Objetivo:** Cumplimiento normativo, retención histórica a largo plazo y auditorías externas.
- **Frecuencia:** Diaria a las 02:00 AM UTC.
- **Destino:** Bucket multirregional con ciclo de vida automatizado:
  - Días 1 a 30: Clase Standard.
  - Días 31 a 90: Clase Nearline (menor costo).
  - Días 91 a 365: Clase Coldline / Archive.
- **Comando de exportación manual:**
  ```bash
  gcloud firestore export gs://helpdesk-cloud-backups/$(date +%Y%m%d_%H%M%S) \
    --collection-ids='tickets','usuarios','categorias'
  ```

---

## 4. Métricas Clave de Recuperación ante Desastres (DR)

| Métrica | Definición | Objetivo HelpDesk Cloud | Mecanismo |
|---|---|---|---|
| **RPO** (Recovery Point Objective) | Pérdida máxima de datos admisible en tiempo | **< 1 minuto** | Point-in-Time Recovery (PITR) |
| **RTO** (Recovery Time Objective) | Tiempo máximo admisible para restaurar el servicio | **< 20 minutos** | Importación CLI / Clone Database |
| **Durabilidad de Datos** | Probabilidad de preservación de objetos almacenados | **99.999999999% (11 9s)** | Cloud Storage Multi-region |

---

## 5. Simulación y Prueba de Restauración (Disaster Recovery Drill)

Para garantizar que los respaldos no sean meramente teóricos, se establece el siguiente protocolo de prueba trimestral:

### Paso 1: Verificación de metadatos del respaldo
```bash
gsutil ls -l gs://helpdesk-cloud-backups/20261030_020000/
```

### Paso 2: Importación controlada en base de datos secundaria de pruebas
```bash
gcloud firestore import gs://helpdesk-cloud-backups/20261030_020000/ \
  --database="helpdesk-dr-test"
```

### Paso 3: Validación de integridad
Se ejecuta una consulta analítica verificando:
1. El conteo total de documentos en `tickets` coincide con las métricas registradas en producción.
2. Las subcolecciones de `historial` mantienen la relación íntegra con sus documentos padres.
3. Las marcas de tiempo (`serverTimestamp`) preservan la secuencia lógica.

---

## 6. Seguridad y Cifrado de Respaldos
1. **Cifrado en reposo:** Todos los objetos exportados se cifran de forma predeterminada mediante AES-256 (o Customer-Managed Encryption Keys - CMEK en entornos de alta exigencia bancaria/médica).
2. **Cifrado en tránsito:** Toda transferencia entre Firestore y Cloud Storage se ejecuta a través de la red privada de Google mediante TLS 1.3.
3. **Principio de menor privilegio (IAM):** Solo el rol `roles/datastore.importExportAdmin` asignado a la cuenta de servicio de automatización tiene autorización para iniciar exportaciones.
