import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Cloud, LogOut, User, ShieldAlert, Cpu } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, userProfile, role, logout, setDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700 border-purple-300',
    tecnico: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    usuario: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  HelpDesk <span className="text-blue-600">Cloud</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  NoSQL Firestore & CI/CD
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Selector interactivo de rol para demo/evaluación académica */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium px-2 flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Demo Rol:
              </span>
              <button
                onClick={() => setDemoRole('usuario')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  role === 'usuario' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Probar vista de Usuario normal"
              >
                Usuario
              </button>
              <button
                onClick={() => setDemoRole('tecnico')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  role === 'tecnico' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Probar vista de Técnico de Soporte"
              >
                Técnico
              </button>
              <button
                onClick={() => setDemoRole('admin')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  role === 'admin' ? 'bg-white shadow-xs text-purple-600' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Probar vista de Administrador"
              >
                Admin
              </button>
            </div>

            {currentUser && (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-800 leading-tight">
                    {userProfile?.nombre || currentUser.email.split('@')[0]}
                  </span>
                  <div className="flex items-center justify-end space-x-1">
                    <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${roleColors[role] || 'bg-slate-100'}`}>
                      {role.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
