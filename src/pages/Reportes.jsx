import React from 'react';
import useTickets from '../hooks/useTickets';
import Loading from '../components/common/Loading';
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  Database,
  Download,
  Terminal,
  RefreshCw,
  Server,
  CloudLightning
} from 'lucide-react';

export const Reportes = () => {
  const { rawTickets, metrics, loading } = useTickets();

  if (loading) {
    return <Loading message="Calculando métricas y reportes..." />;
  }

  // Desglose por categoría
  const categoryCounts = {
    hardware: rawTickets.filter((t) => t.categoriaId === 'hardware').length,
    software: rawTickets.filter((t) => t.categoriaId === 'software').length,
    red: rawTickets.filter((t) => t.categoriaId === 'red').length,
    otros: rawTickets.filter((t) => t.categoriaId === 'otros').length
  };

  // Desglose por prioridad
  const priorityCounts = {
    baja: rawTickets.filter((t) => t.prioridad === 'baja').length,
    media: rawTickets.filter((t) => t.prioridad === 'media').length,
    alta: rawTickets.filter((t) => t.prioridad === 'alta').length,
    critica: rawTickets.filter((t) => t.prioridad === 'critica').length
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reportes y Métricas NoSQL</h1>
        <p className="text-sm text-slate-500">
          Análisis del volumen de incidencias, distribución de carga y plan de contingencia NoSQL.
        </p>
      </div>

      {/* Gráficos de barra representativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución por Categoría */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900">Incidencias por Categoría</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const total = rawTickets.length || 1;
              const pct = Math.round((count / total) * 100);
              const names = {
                hardware: 'Hardware',
                software: 'Software',
                red: 'Redes y Telecom',
                otros: 'Otros Servicios'
              };

              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{names[cat] || cat}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribución por Prioridad */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900">Incidencias por Severidad / Prioridad</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(priorityCounts).map(([prio, count]) => {
              const total = rawTickets.length || 1;
              const pct = Math.round((count / total) * 100);
              const colors = {
                baja: 'bg-slate-400',
                media: 'bg-sky-500',
                alta: 'bg-amber-500',
                critica: 'bg-rose-600'
              };

              return (
                <div key={prio}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="capitalize">{prio}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${colors[prio]} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN ESPECIAL: ESTRATEGIA DE RESPALDO NoSQL (BACKUP STRATEGY) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Estrategia de Respaldo NoSQL (Cloud Firestore Backup)</h2>
            <p className="text-xs text-slate-400">
              Arquitectura de alta disponibilidad, retención y recuperación ante desastres en Google Cloud Platform
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center space-x-2 text-blue-400 mb-1 text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>PITR (Point-in-Time Recovery)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Protección continua contra errores humanos o corrupción de datos. Permite recuperar el estado exacto de la base de datos hasta el minuto en una ventana deslizante de <strong>7 días</strong>.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center space-x-2 text-emerald-400 mb-1 text-sm font-bold">
              <RefreshCw className="w-4 h-4" />
              <span>Exportación Diaria Programada</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trabajo cron gestionado con <strong>Cloud Scheduler + Cloud Functions</strong> que exporta las colecciones <code>tickets</code>, <code>usuarios</code> y <code>historial</code> hacia un bucket multirregional de <strong>Google Cloud Storage</strong>.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center space-x-2 text-amber-400 mb-1 text-sm font-bold">
              <CloudLightning className="w-4 h-4" />
              <span>Métricas RPO / RTO</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>RPO (Recovery Point Objective):</strong> &lt; 1 minuto mediante PITR y &lt; 24h para copias frías.<br />
              <strong>RTO (Recovery Time Objective):</strong> &lt; 20 minutos para restauración completa del clúster NoSQL.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between text-slate-500 mb-2 pb-2 border-b border-slate-800">
            <span className="flex items-center">
              <Terminal className="w-4 h-4 mr-1 text-slate-400" />
              Comandos de Operación CLI (gcloud firestore)
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Automatización</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <p className="text-emerald-400"># 1. Habilitar Point-in-Time Recovery (PITR) en Firestore:</p>
            <p>gcloud firestore databases update --database="(default)" --point-in-time-recovery=ENABLE</p>
            <p className="text-emerald-400 pt-2"># 2. Exportar colecciones activas a Cloud Storage:</p>
            <p>gcloud firestore export gs://helpdesk-cloud-backups/$(date +%Y%m%d_%H%M%S) --collection-ids='tickets','usuarios','categorias','historial'</p>
            <p className="text-emerald-400 pt-2"># 3. Restaurar snapshot ante contingencia:</p>
            <p>gcloud firestore import gs://helpdesk-cloud-backups/20261030_020000/</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
