import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTickets from '../hooks/useTickets';
import TicketCard from '../components/tickets/TicketCard';
import Loading from '../components/common/Loading';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Database,
  ArrowRight,
  ShieldAlert,
  Server
} from 'lucide-react';

export const Dashboard = () => {
  const { userProfile, role } = useAuth();
  const { tickets, metrics, loading } = useTickets();

  if (loading) {
    return <Loading message="Cargando métricas y tickets del sistema..." />;
  }

  const recentTickets = tickets.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Banner de bienvenida y rol */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/10">
            <Database className="w-3.5 h-3.5" />
            <span>Cloud Firestore NoSQL & Public SaaS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            Bienvenido, {userProfile?.nombre || 'Operador'}
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-4">
            Panel de control para la gestión y seguimiento de incidencias de TI.
            Tu rol actual asignado es <span className="font-bold uppercase underline decoration-blue-400 decoration-2">{role}</span>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tickets/nuevo"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium text-sm transition shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Nueva Incidencia</span>
            </Link>
            <Link
              to="/reportes"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm backdrop-blur-xs border border-white/20 transition cursor-pointer"
            >
              <Server className="w-4 h-4" />
              <span>Ver Estrategia NoSQL & Respaldo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Incidencias</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</h3>
            <p className="text-xs text-slate-400 mt-1">Registradas en Firestore</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-amber-600 tracking-wider">Pendientes</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.pendientes}</h3>
            <p className="text-xs text-slate-400 mt-1">Requieren atención</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600 tracking-wider">En Proceso</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.enProceso}</h3>
            <p className="text-xs text-slate-400 mt-1">En manos de técnicos</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wider">Resueltos / Cerrados</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.resueltos + metrics.cerrados}</h3>
            <p className="text-xs text-slate-400 mt-1">Solución documentada</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Resumen NoSQL Backup & Resiliencia */}
      <div className="bg-slate-900 rounded-xl p-5 text-slate-200 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Estrategia de Respaldo NoSQL Activa</h4>
            <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
              La base de datos Cloud Firestore cuenta con Point-in-Time Recovery (PITR de 7 días), exportación programada diaria a Google Cloud Storage y script automatizado para recuperación ante desastres (RPO &lt; 1h, RTO &lt; 30min).
            </p>
          </div>
        </div>
        <Link
          to="/reportes"
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg border border-slate-700 shrink-0 transition"
        >
          Consultar Estrategia
        </Link>
      </div>

      {/* Lista de incidencias recientes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Incidencias Recientes</h2>
            <p className="text-xs text-slate-500">
              {role === 'admin'
                ? 'Todas las incidencias registradas en la organización'
                : role === 'tecnico'
                ? 'Incidencias que tienes asignadas actualmente'
                : 'Tus solicitudes de soporte reportadas'}
            </p>
          </div>
          <Link
            to="/tickets"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Ticket className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm">No hay incidencias registradas por el momento.</p>
            <Link
              to="/tickets/nuevo"
              className="inline-block mt-3 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crear la primera incidencia
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
