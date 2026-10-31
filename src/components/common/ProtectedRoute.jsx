import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading message="Verificando credenciales y permisos..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-xl shadow-sm text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Acceso Restringido</h2>
        <p className="text-slate-600 mb-6">
          Tu rol actual (<strong>{role}</strong>) no cuenta con autorización para acceder a este módulo.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Volver al Dashboard
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
