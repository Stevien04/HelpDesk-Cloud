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

  // Demo user simulation for evaluation when offline or using placeholder keys
  const [demoMode, setDemoMode] = useState(false);

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
        if (!demoMode) {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [demoMode]);

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
    if (demoMode) {
      setDemoMode(false);
      setCurrentUser(null);
      setUserProfile(null);
      return;
    }
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Método especial para pruebas de laboratorio / presentación académica (permite alternar roles sin alterar BD)
  const setDemoRole = (role) => {
    setDemoMode(true);
    const mockUser = {
      uid: `demo-${role}-123`,
      email: `${role}@helpdesk.cloud`,
      displayName: `Usuario Demo (${role.toUpperCase()})`
    };
    setCurrentUser(mockUser);
    setUserProfile({
      nombre: `Operador ${role.toUpperCase()}`,
      email: mockUser.email,
      rol: role,
      activo: true
    });
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
    setDemoRole,
    demoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
