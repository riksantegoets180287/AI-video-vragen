
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onStart: (name: string, className: string) => void;
}

const Start: React.FC<Props> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && className) {
      onStart(name, className);
      // Corrected flow: after start, go to video selection
      navigate('/video-select');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-summaLightGray">
      <div className="w-full max-w-md bg-summaWhite rounded-summa-card summa-shadow p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-summaIndigo mb-2">Video Quiz</h1>
          <p className="text-summaDark opacity-70">Vul je gegevens in om te starten</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-summaIndigo mb-2">Naam</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-summa-inner border border-gray-200 focus:outline-none focus:ring-2 focus:ring-summaBlue transition-all"
              placeholder="Bijv. Jan de Vries"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-summaIndigo mb-2">Klas</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-summa-inner border border-gray-200 focus:outline-none focus:ring-2 focus:ring-summaBlue transition-all"
              placeholder="Bijv. TIC-1A"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-summaIndigo text-white font-bold py-4 rounded-summa-inner hover:bg-summaBlue transition-colors shadow-lg active:scale-[0.98]"
          >
            Kies jouw niveau
          </button>
        </form>
      </div>
    </div>
  );
};

export default Start;
