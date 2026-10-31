import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge, CategoryBadge } from './StatusBadge';
import { Clock, User, UserCheck, ArrowRight } from 'lucide-react';

export const TicketCard = ({ ticket }) => {
  const formatDate = (dateField) => {
    if (!dateField) return 'Reciente';
    if (dateField.seconds) {
      return new Date(dateField.seconds * 1000).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(dateField).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CategoryBadge categoryId={ticket.categoriaId} />
            <span className="text-xs text-slate-400 font-mono">
              #{ticket.id ? ticket.id.slice(0, 8) : 'TK-NEW'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <PriorityBadge priority={ticket.prioridad} />
            <StatusBadge status={ticket.estado} />
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-base mb-2 hover:text-blue-600 transition">
          <Link to={`/tickets/${ticket.id}`}>{ticket.titulo}</Link>
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {ticket.descripcion}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center" title={`Creado por: ${ticket.creadorNombre || 'Usuario'}`}>
            <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span className="max-w-[100px] truncate">{ticket.creadorNombre || 'Usuario'}</span>
          </span>

          <span className="flex items-center" title={`Asignado a: ${ticket.asignadoNombre || 'Sin asignar'}`}>
            <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span className="max-w-[100px] truncate">{ticket.asignadoNombre || 'Sin asignar'}</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {formatDate(ticket.fechaCreacion)}
          </span>

          <Link
            to={`/tickets/${ticket.id}`}
            className="p-1.5 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
            title="Ver detalle del ticket"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
