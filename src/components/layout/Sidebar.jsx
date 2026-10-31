import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  BarChart3,
  Database,
  ExternalLink
} from 'lucide-react';

export const Sidebar = () => {
  const { role } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tickets', label: 'Incidencias', icon: Ticket },
    { to: '/tickets/nuevo', label: 'Crear Ticket', icon: PlusCircle },
    ...(role === 'admin'
      ? [{ to: '/tecnicos', label: 'Gestión Técnicos', icon: Users }]
      : []),
    { to: '/reportes', label: 'Reportes y Métricas', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60 mb-6">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Cloud Firestore</span>
          </div>
          <p className="text-xs text-slate-400">
            Base de datos NoSQL documental con respaldo y PITR configurado.
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="mb-2">
          <span className="font-semibold text-slate-200">Arquitectura NoSQL</span>
          <p className="text-[11px] text-slate-400">Cloud Firestore + Render + GitHub Actions</p>
        </div>
        <div className="pt-2 flex flex-col space-y-1">
          <a
            href="https://firebase.google.com/docs/firestore"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-blue-400 hover:underline"
          >
            <span>Docs Cloud Firestore</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
