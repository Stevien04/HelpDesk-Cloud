import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { createTicket } from '../services/ticketService';
import TicketForm from '../components/tickets/TicketForm';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const NuevoTicket = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const user = {
        uid: currentUser.uid,
        email: currentUser.email,
        nombre: userProfile?.nombre || currentUser.email.split('@')[0]
      };

      const newTicket = await createTicket({
        ...formData,
        user
      });

      setSuccessMessage(true);
      setTimeout(() => {
        navigate(`/tickets/${newTicket.id || ''}`);
      }, 1200);
    } catch (error) {
      console.error('No se pudo guardar el ticket en Firestore:', error);
      setErrorMessage(`El ticket no se guardó en Firestore: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Volver a incidencias</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registrar Nueva Incidencia</h1>
          <p className="text-sm text-slate-500 mt-1">
            Completa la información técnica para que el equipo de soporte pueda evaluar y atender tu solicitud.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl text-sm flex items-start border bg-rose-50 text-rose-800 border-rose-200">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage ? (
          <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-900">¡Incidencia registrada con éxito!</h3>
            <p className="text-sm text-emerald-700 mt-1">
              Documento almacenado en la colección NoSQL de Cloud Firestore con historial de auditoría. Redirigiendo...
            </p>
          </div>
        ) : (
          <TicketForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    </div>
  );
};

export default NuevoTicket;
