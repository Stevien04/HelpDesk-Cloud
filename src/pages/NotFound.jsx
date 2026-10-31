import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-2">Página no encontrada</h2>
      <p className="text-slate-500 text-sm mt-1 max-w-sm">
        La ruta solicitada no existe o no se encuentra disponible en la aplicación HelpDesk Cloud.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
      >
        Regresar al Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
