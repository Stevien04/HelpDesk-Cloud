import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const TicketFilters = ({ filters }) => {
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory
  } = filters;

  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('todos');
    setFilterPriority('todos');
    setFilterCategory('todos');
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por título, ID o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_proceso">En Proceso</option>
            <option value="resuelto">Resueltos</option>
            <option value="cerrado">Cerrados</option>
          </select>
        </div>

        {/* Filtro por prioridad */}
        <div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="todos">Todas las Prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>

        {/* Filtro por categoría y reset */}
        <div className="flex space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="todos">Todas las Categorías</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="red">Redes</option>
            <option value="otros">Otros</option>
          </select>

          <button
            onClick={handleReset}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-sm flex items-center justify-center shrink-0"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;
