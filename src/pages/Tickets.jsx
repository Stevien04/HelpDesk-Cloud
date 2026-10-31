import React from 'react';
import { Link } from 'react-router-dom';
import useTickets from '../hooks/useTickets';
import TicketCard from '../components/tickets/TicketCard';
import TicketFilters from '../components/tickets/TicketFilters';
import Loading from '../components/common/Loading';
import { PlusCircle, Ticket as TicketIcon } from 'lucide-react';

export const Tickets = () => {
  const { tickets, loading, filters } = useTickets();

  if (loading) {
    return <Loading message="Cargando incidencias..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Incidencias</h1>
          <p className="text-sm text-slate-500">
            Mostrando {tickets.length} {tickets.length === 1 ? 'incidencia' : 'incidencias'} según los filtros aplicados
          </p>
        </div>

        <Link
          to="/tickets/nuevo"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm shadow-blue-500/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Incidencia</span>
        </Link>
      </div>

      {/* Barra de Filtros */}
      <TicketFilters filters={filters} />

      {/* Cuadrícula de Incidencias */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <TicketIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No se encontraron incidencias</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Prueba a ajustar los criterios de búsqueda o limpia los filtros para ver más resultados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tickets;
