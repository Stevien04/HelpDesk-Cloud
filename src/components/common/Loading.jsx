import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Cargando HelpDesk Cloud...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-slate-600">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
      <p className="text-sm font-medium tracking-wide text-slate-500">{message}</p>
    </div>
  );
};

export default Loading;
