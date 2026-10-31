import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export const createTicket = async ({ titulo, descripcion, categoriaId, prioridad, user }) => {
  try {
    const batch = writeBatch(db);
    const ticketRef = doc(collection(db, 'tickets'));

    const ticketData = {
      titulo,
      descripcion,
      categoriaId,
      prioridad,
      estado: 'pendiente',
      creadoPor: user.uid,
      creadorNombre: user.nombre || user.email,
      creadorEmail: user.email,
      asignadoA: null,
      asignadoNombre: null,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };

    batch.set(ticketRef, ticketData);

    const historialRef = doc(collection(ticketRef, 'historial'));
    batch.set(historialRef, {
      tipo: 'creacion',
      autorId: user.uid,
      autorNombre: user.nombre || user.email,
      anterior: null,
      nuevo: 'pendiente',
      comentario: 'Ticket registrado en HelpDesk Cloud',
      fecha: serverTimestamp()
    });

    await batch.commit();
    return { id: ticketRef.id, ...ticketData };
  } catch (error) {
    console.error('Error al crear ticket:', error);
    throw error;
  }
};

export const getTickets = async ({ user, role }) => {
  try {
    let q;
    const ticketsCol = collection(db, 'tickets');

    if (role === 'admin') {
      q = query(ticketsCol, orderBy('fechaCreacion', 'desc'));
    } else if (role === 'tecnico') {
      q = query(ticketsCol, where('asignadoA', '==', user.uid));
    } else {
      q = query(ticketsCol, where('creadoPor', '==', user.uid));
    }

    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Ordenar en cliente si el índice compuesto aún no estuviera desplegado
    return tickets.sort((a, b) => {
      const timeA = a.fechaCreacion?.seconds || 0;
      const timeB = b.fechaCreacion?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
      return null;
    }

    const historialCol = collection(ticketRef, 'historial');
    const historialQuery = query(historialCol, orderBy('fecha', 'asc'));
    const historialSnap = await getDocs(historialQuery);

    const historial = historialSnap.docs.map((hDoc) => ({
      id: hDoc.id,
      ...hDoc.data()
    }));

    return {
      id: ticketSnap.id,
      ...ticketSnap.data(),
      historial
    };
  } catch (error) {
    console.error('Error al obtener detalle del ticket:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, currentStatus, newStatus, user, comentario = '') => {
  try {
    const batch = writeBatch(db);
    const ticketRef = doc(db, 'tickets', ticketId);

    batch.update(ticketRef, {
      estado: newStatus,
      fechaActualizacion: serverTimestamp()
    });

    const historialRef = doc(collection(ticketRef, 'historial'));
    batch.set(historialRef, {
      tipo: 'cambio_estado',
      autorId: user.uid,
      autorNombre: user.nombre || user.email,
      anterior: currentStatus,
      nuevo: newStatus,
      comentario: comentario || `Estado cambiado de ${currentStatus} a ${newStatus}`,
      fecha: serverTimestamp()
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error;
  }
};

export const assignTicket = async (ticketId, tecnicoId, tecnicoNombre, user) => {
  try {
    const batch = writeBatch(db);
    const ticketRef = doc(db, 'tickets', ticketId);

    batch.update(ticketRef, {
      asignadoA: tecnicoId,
      asignadoNombre: tecnicoNombre,
      fechaActualizacion: serverTimestamp()
    });

    const historialRef = doc(collection(ticketRef, 'historial'));
    batch.set(historialRef, {
      tipo: 'asignacion',
      autorId: user.uid,
      autorNombre: user.nombre || user.email,
      asignadoA: tecnicoId,
      asignadoNombre: tecnicoNombre,
      comentario: `Ticket asignado al técnico: ${tecnicoNombre}`,
      fecha: serverTimestamp()
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error al asignar ticket:', error);
    throw error;
  }
};

export const addCommentToTicket = async (ticketId, user, comentario) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const historialRef = doc(collection(ticketRef, 'historial'));

    await addDoc(collection(ticketRef, 'historial'), {
      tipo: 'comentario',
      autorId: user.uid,
      autorNombre: user.nombre || user.email,
      comentario,
      fecha: serverTimestamp()
    });

    await updateDoc(ticketRef, {
      fechaActualizacion: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    throw error;
  }
};
