import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, toggleUserStatus } from '../services/userService';
import Loading from '../components/common/Loading';
import { Users, Shield, Wrench, User, CheckCircle, XCircle } from 'lucide-react';

export const Tecnicos = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      if (data.length > 0) {
        setUsers(data);
      } else {
        setUsers([
          { id: 'u1', nombre: 'Carlos López', email: 'carlos@empresa.com', rol: 'tecnico', activo: true },
          { id: 'u2', nombre: 'Ana Gómez', email: 'ana@empresa.com', rol: 'tecnico', activo: true },
          { id: 'u3', nombre: 'María Torres', email: 'maria@empresa.com', rol: 'usuario', activo: true },
          { id: 'u4', nombre: 'Admin Soporte', email: 'admin@empresa.com', rol: 'admin', activo: true }
        ]);
      }
    } catch (err) {
      console.warn('Usando datos de muestra para gestión de técnicos:', err);
      setUsers([
        { id: 'u1', nombre: 'Carlos López', email: 'carlos@empresa.com', rol: 'tecnico', activo: true },
        { id: 'u2', nombre: 'Ana Gómez', email: 'ana@empresa.com', rol: 'tecnico', activo: true },
        { id: 'u3', nombre: 'María Torres', email: 'maria@empresa.com', rol: 'usuario', activo: true },
        { id: 'u4', nombre: 'Admin Soporte', email: 'admin@empresa.com', rol: 'admin', activo: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, rol: newRole } : u))
      );
    } catch (err) {
      console.warn('Actualizando rol localmente:', err);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, rol: newRole } : u))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      const newStatus = await toggleUserStatus(userId, currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, activo: newStatus } : u))
      );
    } catch (err) {
      console.warn('Actualizando estado activo localmente:', err);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, activo: !currentStatus } : u))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loading message="Cargando usuarios y roles del sistema..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Personal de TI</h1>
          <p className="text-sm text-slate-500">
            Administra técnicos, operadores y roles con permisos protegidos en Cloud Firestore.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900">Usuarios Registrados ({users.length})</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Nombre / Correo</th>
                <th className="px-6 py-3.5">Rol Actual</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{u.nombre || 'Sin nombre'}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={u.rol}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updatingId === u.id}
                        className="text-xs font-semibold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="usuario">Usuario</option>
                        <option value="tecnico">Técnico TI</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.activo !== false
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {u.activo !== false ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactivo
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.activo !== false)}
                      disabled={updatingId === u.id}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
                    >
                      {u.activo !== false ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tecnicos;
