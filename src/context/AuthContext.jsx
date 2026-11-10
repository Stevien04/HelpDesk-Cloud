import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword
} from '../services/authService';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../config/demoAccounts';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profileDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data());
          } else {
            setUserProfile({
              nombre: user.displayName || user.email.split('@')[0],
              email: user.email,
              rol: 'usuario',
              activo: true
            });
          }
        } catch (error) {
          console.warn('Advertencia al consultar perfil Firestore:', error);
          setUserProfile({
            nombre: user.email.split('@')[0],
            email: user.email,
            rol: 'usuario',
            activo: true
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    setCurrentUser(res.user);
    setUserProfile(res.profile);
    return res;
  };

  const register = async (email, password, nombre) => {
    const res = await registerUser(email, password, nombre);
    setCurrentUser(res.user);
    setUserProfile(res.profile);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Acceso rápido de demostración: inicia sesión real con la cuenta demo del rol pedido.
  // Si la cuenta todavía no existe, la registra (siempre con rol 'usuario'; el rol de
  // técnico o administrador se asigna una vez desde la consola de Firebase).
  const loginDemo = async (role) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) throw new Error(`Rol de demostración desconocido: ${role}`);

    try {
      return await login(account.email, DEMO_PASSWORD);
    } catch (error) {
      const cuentaInexistente =
        error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found';
      if (!cuentaInexistente) throw error;
      return await register(account.email, DEMO_PASSWORD, account.nombre);
    }
  };

  const value = {
    currentUser,
    userProfile,
    role: userProfile?.rol || 'usuario',
    loading,
    login,
    register,
    logout,
    resetPassword,
    loginDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
