import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Cloud, Lock, Mail, ArrowRight, ShieldCheck, Wrench, User } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login, resetPassword, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas o error de conexión con Firebase Authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico para restablecer la contraseña.');
      return;
    }
    try {
      await resetPassword(email);
      setMessage('Se ha enviado un correo para restablecer tu contraseña.');
      setError('');
    } catch (err) {
      setError('No se pudo enviar el correo de recuperación.');
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await loginDemo(role);
      if (res.profile?.rol !== role) {
        setError(
          `La cuenta de demostración ya existe, pero su rol todavía es "${res.profile?.rol}". ` +
            `Cambia el campo "rol" a "${role}" en la colección usuarios de Firestore y vuelve a entrar.`
        );
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('No se pudo iniciar sesión con la cuenta de demostración.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20 mb-4">
          <Cloud className="w-9 h-9" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          HelpDesk <span className="text-blue-600">Cloud</span>
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sistema de Gestión de Incidencias con Base de Datos NoSQL
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  ¿Olvidaste tu clave?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </form>

          {/* Accesos rápidos de evaluación para el docente / video demo */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Acceso Rápido de Demostración (Evaluación)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 mb-1 text-purple-600" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('tecnico')}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition cursor-pointer"
              >
                <Wrench className="w-4 h-4 mb-1 text-emerald-600" />
                <span>Técnico</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('usuario')}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition cursor-pointer"
              >
                <User className="w-4 h-4 mb-1 text-blue-600" />
                <span>Usuario</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            ¿No tienes una cuenta aún?{' '}
            <Link to="/registro" className="font-semibold text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
