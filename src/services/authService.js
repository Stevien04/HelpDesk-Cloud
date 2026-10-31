import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export const registerUser = async (email, password, nombre) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile = {
      nombre,
      email: user.email,
      rol: 'usuario',
      activo: true,
      fechaCreacion: serverTimestamp()
    };

    await setDoc(doc(db, 'usuarios', user.uid), userProfile);
    return { user, profile: userProfile };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const profileSnap = await getDoc(doc(db, 'usuarios', user.uid));

    let profile = null;
    if (profileSnap.exists()) {
      profile = profileSnap.data();
    } else {
      // Perfil base si no existiese documento
      profile = {
        nombre: user.displayName || email.split('@')[0],
        email: user.email,
        rol: 'usuario',
        activo: true
      };
      await setDoc(doc(db, 'usuarios', user.uid), profile);
    }

    return { user, profile };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (uid) => {
  const profileSnap = await getDoc(doc(db, 'usuarios', uid));
  if (profileSnap.exists()) {
    return { id: profileSnap.id, ...profileSnap.data() };
  }
  return null;
};
