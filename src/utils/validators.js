/**
 * Validadores y reglas de negocio para HelpDesk Cloud
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

export const validateTicketForm = ({ titulo, descripcion, categoriaId, prioridad }) => {
  const errors = {};

  if (!titulo || titulo.trim().length < 5) {
    errors.titulo = 'El título debe tener al menos 5 caracteres';
  } else if (titulo.trim().length > 100) {
    errors.titulo = 'El título no puede exceder 100 caracteres';
  }

  if (!descripcion || descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
  }

  const validCategories = ['hardware', 'software', 'red', 'otros'];
  if (!categoriaId || !validCategories.includes(categoriaId)) {
    errors.categoriaId = 'Debe seleccionar una categoría válida';
  }

  const validPriorities = ['baja', 'media', 'alta', 'critica'];
  if (!prioridad || !validPriorities.includes(prioridad)) {
    errors.prioridad = 'Debe seleccionar una prioridad válida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const canTransitionStatus = (currentStatus, newStatus, role) => {
  if (currentStatus === newStatus) return true;
  if (role === 'admin') return true;

  const validFlows = {
    tecnico: {
      pendiente: ['en_proceso'],
      en_proceso: ['resuelto', 'pendiente'],
      resuelto: []
    },
    usuario: {
      resuelto: ['cerrado', 'en_proceso'],
      cerrado: []
    }
  };

  const allowed = validFlows[role]?.[currentStatus] || [];
  return allowed.includes(newStatus);
};

export const getStatusLabel = (status) => {
  const labels = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    resuelto: 'Resuelto',
    cerrado: 'Cerrado'
  };
  return labels[status] || status;
};

export const getPriorityLabel = (priority) => {
  const labels = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica'
  };
  return labels[priority] || priority;
};
