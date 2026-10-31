import React, { useState } from 'react';
import { validateTicketForm } from '../../utils/validators';
import { AlertCircle, Send } from 'lucide-react';

export const TicketForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoriaId: 'hardware',
    prioridad: 'media'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateTicketForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Título de la Incidencia *
        </label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Ej: Impresora departamental no responde o da atasco de papel"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
            errors.titulo
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
          }`}
        />
        {errors.titulo && (
          <p className="mt-1 text-xs text-rose-600 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            {errors.titulo}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Categoría *
          </label>
          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="hardware">Hardware (Equipos, Pantallas, Teclados)</option>
            <option value="software">Software (Sistemas, Licencias, Correo)</option>
            <option value="red">Redes y Telecomunicaciones (WiFi, Cableado)</option>
            <option value="otros">Otros Servicios de TI</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Prioridad Inicial *
          </label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="baja">Baja - No detiene las labores</option>
            <option value="media">Media - Afecta tareas no críticas</option>
            <option value="alta">Alta - Afecta operación general</option>
            <option value="critica">Crítica - Pérdida de servicio total / Urgente</option>
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Descripción Detallada *
        </label>
        <textarea
          name="descripcion"
          rows={5}
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe la incidencia, pasos para reproducirla, ubicación del equipo y código de error si corresponde..."
          className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
            errors.descripcion
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
          }`}
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs text-rose-600 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            {errors.descripcion}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition disabled:opacity-50 cursor-pointer shadow-sm shadow-blue-500/20"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Guardando en Cloud Firestore...' : 'Registrar Incidencia'}</span>
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
