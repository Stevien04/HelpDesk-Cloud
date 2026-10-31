import React from 'react';
import { getStatusLabel, getPriorityLabel } from '../../utils/validators';

export const StatusBadge = ({ status }) => {
  const styles = {
    pendiente: 'bg-amber-100 text-amber-800 border-amber-300',
    en_proceso: 'bg-blue-100 text-blue-800 border-blue-300',
    resuelto: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cerrado: 'bg-slate-100 text-slate-800 border-slate-300'
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    baja: 'bg-slate-100 text-slate-700',
    media: 'bg-sky-100 text-sky-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-rose-100 text-rose-800 font-bold'
  };

  const currentStyle = styles[priority] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider font-medium ${currentStyle}`}>
      {getPriorityLabel(priority)}
    </span>
  );
};

export const CategoryBadge = ({ categoryId }) => {
  const categories = {
    hardware: 'Hardware',
    software: 'Software',
    red: 'Redes y Telecom',
    otros: 'Otros Servicios'
  };

  return (
    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
      {categories[categoryId] || categoryId}
    </span>
  );
};

export default StatusBadge;
