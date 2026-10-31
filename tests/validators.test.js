import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  validateTicketForm,
  canTransitionStatus,
  getStatusLabel,
  getPriorityLabel
} from '../src/utils/validators';

describe('Validador de correo y contraseñas', () => {
  it('debe validar correos válidos e inválidos', () => {
    expect(isValidEmail('usuario@empresa.com')).toBe(true);
    expect(isValidEmail('correo.invalido@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  it('debe requerir contraseñas de al menos 6 caracteres', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('')).toBe(false);
  });
});

describe('Validación de formulario de tickets', () => {
  it('debe rechazar formulario con campos incompletos', () => {
    const result = validateTicketForm({
      titulo: 'PC',
      descripcion: 'corta',
      categoriaId: '',
      prioridad: ''
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.titulo).toBeDefined();
    expect(result.errors.descripcion).toBeDefined();
    expect(result.errors.categoriaId).toBeDefined();
    expect(result.errors.prioridad).toBeDefined();
  });

  it('debe aceptar ticket con datos válidos', () => {
    const result = validateTicketForm({
      titulo: 'Problema de conexión en impresora',
      descripcion: 'La impresora de red no responde a las solicitudes del piso 2',
      categoriaId: 'red',
      prioridad: 'alta'
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});

describe('Transiciones de estado por rol', () => {
  it('el técnico puede cambiar de pendiente a en_proceso y luego a resuelto', () => {
    expect(canTransitionStatus('pendiente', 'en_proceso', 'tecnico')).toBe(true);
    expect(canTransitionStatus('en_proceso', 'resuelto', 'tecnico')).toBe(true);
    expect(canTransitionStatus('en_proceso', 'cerrado', 'tecnico')).toBe(false);
  });

  it('el usuario puede cerrar un ticket resuelto', () => {
    expect(canTransitionStatus('resuelto', 'cerrado', 'usuario')).toBe(true);
    expect(canTransitionStatus('pendiente', 'cerrado', 'usuario')).toBe(false);
  });

  it('el administrador tiene permiso de realizar cualquier cambio', () => {
    expect(canTransitionStatus('pendiente', 'cerrado', 'admin')).toBe(true);
    expect(canTransitionStatus('cerrado', 'pendiente', 'admin')).toBe(true);
  });
});

describe('Etiquetas de estado y prioridad', () => {
  it('retorna las etiquetas legibles en español', () => {
    expect(getStatusLabel('en_proceso')).toBe('En Proceso');
    expect(getPriorityLabel('critica')).toBe('Crítica');
  });
});
