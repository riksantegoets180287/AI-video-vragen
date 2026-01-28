
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteType } from '../types';

interface Props {
  onSelect: (route: RouteType) => void;
}

const routes: { id: RouteType; label: string; color: string }[] = [
  { id: 'route1', label: 'VO-Route 1', color: 'bg-summaIndigo' },
  { id: 'route2', label: 'VO-Route 2', color: 'bg-summaBlue' },
  { id: 'route3', label: 'VO-Route 3', color: 'bg-summaRed' },
  { id: 'entree', label: 'MBO-Opleiding', color: 'bg-summaGreen' },
];

const RouteSelect: React.FC<Props> = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleChoice = (route: RouteType) => {
    onSelect(route);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-summaLightGray">
      <h1 className="font-serif text-3xl text-summaIndigo mb-4 text-center">Kies je route</h1>
      <p className="text-summaDark opacity-60 mb-10 text-center max-w-md">Selecteer het niveau dat bij jouw opleiding past om de vragen te starten.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => handleChoice(r.id)}
            className={`${r.color} text-white font-bold text-xl py-12 px-8 rounded-summa-card shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center text-center`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RouteSelect;
