import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const getTechnicians = async () => {
  try {
    const q = query(collection(db, 'usuarios'), where('rol', '==', 'tecnico'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Error al obtener técnicos:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, { rol: newRole });
    return true;
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId, currentStatus) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, { activo: !currentStatus });
    return !currentStatus;
  } catch (error) {
    console.error('Error al cambiar estado de usuario:', error);
    throw error;
  }
};
