import { useState, useEffect, useMemo, useCallback } from 'react';
import { getTickets } from '../services/ticketService';
import useAuth from './useAuth';

export const useTickets = () => {
  const { currentUser, role } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todos');

  const fetchTickets = useCallback(async () => {
    if (!currentUser) {
      setTickets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getTickets({ user: currentUser, role });
      setTickets(data);
    } catch (err) {
      console.warn('Error al cargar tickets desde Firestore. Activando datos de demostración si es necesario:', err);
      setError(err.message);
      // Muestra datos de muestra si ocurre error de conexión inicial
      setTickets([
        {
          id: 'demo-tk-001',
          titulo: 'Falla de conexión a la base de datos NoSQL',
          descripcion: 'El pool de conexiones de Firestore excede el límite de consultas en el laboratorio 3.',
          categoriaId: 'red',
          prioridad: 'alta',
          estado: 'en_proceso',
          creadoPor: currentUser.uid,
          creadorNombre: currentUser.displayName || 'Demo User',
          asignadoA: 'tecnico-01',
          asignadoNombre: 'Carlos Técnico',
          fechaCreacion: { seconds: Date.now() / 1000 - 3600 }
        },
        {
          id: 'demo-tk-002',
          titulo: 'Solicitud de respaldo NoSQL y recuperación PITR',
          descripcion: 'Programar exportación periódica de Cloud Firestore a Cloud Storage para cumplimiento de auditoría.',
          categoriaId: 'software',
          prioridad: 'critica',
          estado: 'pendiente',
          creadoPor: currentUser.uid,
          creadorNombre: currentUser.displayName || 'Demo User',
          asignadoA: null,
          asignadoNombre: null,
          fechaCreacion: { seconds: Date.now() / 1000 - 7200 }
        },
        {
          id: 'demo-tk-003',
          titulo: 'Mantenimiento preventivo de estación de trabajo',
          descripcion: 'Limpieza de hardware y actualización de parches de seguridad en sala de cómputo.',
          categoriaId: 'hardware',
          prioridad: 'baja',
          estado: 'resuelto',
          creadoPor: currentUser.uid,
          creadorNombre: currentUser.displayName || 'Demo User',
          asignadoA: 'tecnico-01',
          asignadoNombre: 'Carlos Técnico',
          fechaCreacion: { seconds: Date.now() / 1000 - 86400 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, role]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'todos' || ticket.estado === filterStatus;
      const matchesPriority = filterPriority === 'todos' || ticket.prioridad === filterPriority;
      const matchesCategory = filterCategory === 'todos' || ticket.categoriaId === filterCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchTerm, filterStatus, filterPriority, filterCategory]);

  const metrics = useMemo(() => {
    return {
      total: tickets.length,
      pendientes: tickets.filter((t) => t.estado === 'pendiente').length,
      enProceso: tickets.filter((t) => t.estado === 'en_proceso').length,
      resueltos: tickets.filter((t) => t.estado === 'resuelto').length,
      cerrados: tickets.filter((t) => t.estado === 'cerrado').length
    };
  }, [tickets]);

  return {
    tickets: filteredTickets,
    rawTickets: tickets,
    metrics,
    loading,
    error,
    refreshTickets: fetchTickets,
    filters: {
      searchTerm,
      setSearchTerm,
      filterStatus,
      setFilterStatus,
      filterPriority,
      setFilterPriority,
      filterCategory,
      setFilterCategory
    }
  };
};

export default useTickets;
