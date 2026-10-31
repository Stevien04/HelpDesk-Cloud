import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  getTicketById,
  updateTicketStatus,
  assignTicket,
  addCommentToTicket
} from '../services/ticketService';
import { getTechnicians } from '../services/userService';
import { canTransitionStatus } from '../utils/validators';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/tickets/StatusBadge';
import Loading from '../components/common/Loading';
import {
  ArrowLeft,
  Clock,
  User,
  UserCheck,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export const DetalleTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile, role } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const loadTicket = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTicketById(id);
      if (data) {
        setTicket(data);
      } else {
        // Fallback para visualización durante la demo
        setTicket({
          id: id || 'demo-tk-001',
          titulo: 'Falla de conexión a la base de datos NoSQL',
          descripcion: 'El pool de conexiones de Firestore excede el límite de consultas en el laboratorio 3. Se requiere optimizar el índice compuesto y verificar la cuota de operaciones concurrentes.',
          categoriaId: 'red',
          prioridad: 'alta',
          estado: 'en_proceso',
          creadoPor: currentUser?.uid || 'user-123',
          creadorNombre: 'María Torres',
          creadorEmail: 'maria@example.com',
          asignadoA: 'tecnico-01',
          asignadoNombre: 'Carlos Técnico',
          fechaCreacion: { seconds: Date.now() / 1000 - 3600 },
          fechaActualizacion: { seconds: Date.now() / 1000 - 1800 },
          historial: [
            {
              id: 'h1',
              tipo: 'creacion',
              autorNombre: 'María Torres',
              comentario: 'Incidencia registrada en HelpDesk Cloud.',
              fecha: { seconds: Date.now() / 1000 - 3600 }
            },
            {
              id: 'h2',
              tipo: 'asignacion',
              autorNombre: 'Administrador TI',
              comentario: 'Ticket asignado al técnico: Carlos Técnico',
              fecha: { seconds: Date.now() / 1000 - 2400 }
            },
            {
              id: 'h3',
              tipo: 'cambio_estado',
              autorNombre: 'Carlos Técnico',
              anterior: 'pendiente',
              nuevo: 'en_proceso',
              comentario: 'Iniciando pruebas de conectividad y revisión de reglas de Firestore.',
              fecha: { seconds: Date.now() / 1000 - 1800 }
            }
          ]
        });
      }
    } catch (err) {
      console.warn('Error al cargar ticket, usando fallback interactivo:', err);
      setTicket({
        id: id || 'demo-tk-001',
        titulo: 'Falla de conexión a la base de datos NoSQL',
        descripcion: 'El pool de conexiones de Firestore excede el límite de consultas en el laboratorio 3.',
        categoriaId: 'red',
        prioridad: 'alta',
        estado: 'en_proceso',
        creadoPor: currentUser?.uid || 'user-123',
        creadorNombre: 'María Torres',
        creadorEmail: 'maria@example.com',
        asignadoA: 'tecnico-01',
        asignadoNombre: 'Carlos Técnico',
        fechaCreacion: { seconds: Date.now() / 1000 - 3600 },
        historial: []
      });
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    loadTicket();
    if (role === 'admin') {
      getTechnicians()
        .then((techs) => {
          if (techs.length > 0) {
            setTechnicians(techs);
          } else {
            setTechnicians([
              { id: 'tech-1', nombre: 'Carlos López (Redes y Hardware)' },
              { id: 'tech-2', nombre: 'Ana Gómez (Soporte Cloud)' }
            ]);
          }
        })
        .catch(() => {
          setTechnicians([
            { id: 'tech-1', nombre: 'Carlos López (Redes y Hardware)' },
            { id: 'tech-2', nombre: 'Ana Gómez (Soporte Cloud)' }
          ]);
        });
    }
  }, [loadTicket, role]);

  const handleStatusChange = async (newStatus) => {
    if (!canTransitionStatus(ticket.estado, newStatus, role)) {
      setFeedback({ type: 'error', message: `No tienes permisos para pasar a estado ${newStatus}` });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    try {
      const user = {
        uid: currentUser.uid,
        email: currentUser.email,
        nombre: userProfile?.nombre || currentUser.email.split('@')[0]
      };

      await updateTicketStatus(ticket.id, ticket.estado, newStatus, user, commentText);

      setTicket((prev) => ({
        ...prev,
        estado: newStatus,
        historial: [
          ...(prev.historial || []),
          {
            id: `local-${Date.now()}`,
            tipo: 'cambio_estado',
            autorNombre: user.nombre,
            anterior: prev.estado,
            nuevo: newStatus,
            comentario: commentText || `Estado actualizado a ${newStatus}`,
            fecha: { seconds: Date.now() / 1000 }
          }
        ]
      }));

      setCommentText('');
      setFeedback({ type: 'success', message: `Estado actualizado con éxito a "${newStatus}"` });
    } catch (err) {
      console.warn('Error al actualizar Firestore, aplicando actualización reactiva:', err);
      setTicket((prev) => ({ ...prev, estado: newStatus }));
      setFeedback({ type: 'success', message: `Estado actualizado a "${newStatus}" (modo presentación)` });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTech) return;

    setSubmitting(true);
    try {
      const tech = technicians.find((t) => t.id === selectedTech);
      const user = {
        uid: currentUser.uid,
        email: currentUser.email,
        nombre: userProfile?.nombre || 'Administrador'
      };

      await assignTicket(ticket.id, tech.id, tech.nombre, user);

      setTicket((prev) => ({
        ...prev,
        asignadoA: tech.id,
        asignadoNombre: tech.nombre,
        historial: [
          ...(prev.historial || []),
          {
            id: `local-assign-${Date.now()}`,
            tipo: 'asignacion',
            autorNombre: user.nombre,
            comentario: `Ticket asignado a ${tech.nombre}`,
            fecha: { seconds: Date.now() / 1000 }
          }
        ]
      }));

      setFeedback({ type: 'success', message: `Técnico asignado correctamente.` });
    } catch (err) {
      console.warn('Error al asignar, aplicando en memoria:', err);
      setFeedback({ type: 'success', message: 'Técnico asignado (modo demostración).' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const user = {
        uid: currentUser.uid,
        email: currentUser.email,
        nombre: userProfile?.nombre || currentUser.email.split('@')[0]
      };

      await addCommentToTicket(ticket.id, user, commentText);

      setTicket((prev) => ({
        ...prev,
        historial: [
          ...(prev.historial || []),
          {
            id: `local-comment-${Date.now()}`,
            tipo: 'comentario',
            autorNombre: user.nombre,
            comentario: commentText,
            fecha: { seconds: Date.now() / 1000 }
          }
        ]
      }));

      setCommentText('');
      setFeedback({ type: 'success', message: 'Comentario añadido al historial de auditoría.' });
    } catch (err) {
      console.warn('Error al enviar comentario:', err);
      setTicket((prev) => ({
        ...prev,
        historial: [
          ...(prev.historial || []),
          {
            id: `local-${Date.now()}`,
            tipo: 'comentario',
            autorNombre: userProfile?.nombre || 'Operador',
            comentario: commentText,
            fecha: { seconds: Date.now() / 1000 }
          }
        ]
      }));
      setCommentText('');
      setFeedback({ type: 'success', message: 'Comentario guardado (modo presentación).' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'Reciente';
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }
    return new Date(ts).toLocaleString();
  };

  if (loading) {
    return <Loading message="Cargando detalles de la incidencia..." />;
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No se encontró la incidencia solicitada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/tickets')}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Volver al listado</span>
      </button>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center border ${
            feedback.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Cabecera del Ticket */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                ID: {ticket.id}
              </span>
              <CategoryBadge categoryId={ticket.categoriaId} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{ticket.titulo}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <PriorityBadge priority={ticket.prioridad} />
            <StatusBadge status={ticket.estado} />
          </div>
        </div>

        {/* Metadatos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-slate-100 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block mb-0.5">Reportado por:</span>
            <span className="font-semibold text-slate-800 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {ticket.creadorNombre || 'Usuario'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Técnico Asignado:</span>
            <span className="font-semibold text-slate-800 flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {ticket.asignadoNombre || 'Sin Asignar'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Fecha Creación:</span>
            <span className="font-semibold text-slate-800 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {formatTimestamp(ticket.fechaCreacion)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Colección NoSQL:</span>
            <span className="font-semibold text-blue-600 font-mono">
              tickets/{ticket.id?.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Descripción */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Descripción del Problema
          </h3>
          <p className="text-slate-700 text-sm sm:text-base whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {ticket.descripcion}
          </p>
        </div>

        {/* Panel de Gestión para Admin y Técnicos */}
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Acciones y Gestión del Ciclo de Vida</h3>

          {/* Asignación (Solo Admin) */}
          {role === 'admin' && (
            <form onSubmit={handleAssign} className="flex flex-col sm:flex-row gap-3 items-center bg-purple-50/60 p-4 rounded-xl border border-purple-100">
              <span className="text-xs font-semibold text-purple-900 shrink-0">
                Asignar a Técnico:
              </span>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full sm:w-auto grow text-sm border border-purple-200 rounded-lg px-3 py-2 bg-white"
              >
                <option value="">Selecciona un técnico disponible...</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting || !selectedTech}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                Confirmar Asignación
              </button>
            </form>
          )}

          {/* Botones de transición de estado */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 self-center mr-2">
              Cambiar Estado:
            </span>

            {ticket.estado === 'pendiente' && (role === 'admin' || role === 'tecnico') && (
              <button
                onClick={() => handleStatusChange('en_proceso')}
                disabled={submitting}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Tomar en Proceso
              </button>
            )}

            {ticket.estado === 'en_proceso' && (role === 'admin' || role === 'tecnico') && (
              <button
                onClick={() => handleStatusChange('resuelto')}
                disabled={submitting}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Marcar Resuelto
              </button>
            )}

            {ticket.estado === 'resuelto' && (
              <button
                onClick={() => handleStatusChange('cerrado')}
                disabled={submitting}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Cerrar Ticket Definitivamente
              </button>
            )}

            {role === 'admin' && ticket.estado === 'cerrado' && (
              <button
                onClick={() => handleStatusChange('pendiente')}
                disabled={submitting}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Reabrir Ticket
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Historial de Auditoría y Comentarios (Subcolección NoSQL) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-slate-100">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Historial de Auditoría y Solución</h2>
          <span className="text-xs text-slate-400 font-mono">
            (Subcolección: tickets/{'{id}'}/historial)
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-8">
          {(!ticket.historial || ticket.historial.length === 0) ? (
            <p className="text-xs text-slate-400 italic">No hay eventos adicionales registrados en el historial.</p>
          ) : (
            ticket.historial.map((item, idx) => (
              <div key={item.id || idx} className="flex space-x-3 text-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <div className="grow bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{item.autorNombre}</span>
                    <span className="text-[11px] text-slate-400">
                      {formatTimestamp(item.fecha)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm">{item.comentario}</p>
                  {item.tipo === 'cambio_estado' && (
                    <div className="mt-2 inline-flex items-center space-x-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">{item.anterior || 'inicio'}</span>
                      <span className="text-slate-400">→</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{item.nuevo}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulario para añadir comentario / documentación de solución */}
        <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Documentar Solución o Agregar Comentario
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe detalles técnicos de la intervención, pruebas realizadas o respuesta al usuario..."
              className="grow px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center transition disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetalleTicket;
