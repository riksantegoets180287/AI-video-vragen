import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  onStart: (name: string, className: string, videoId: number) => void;
}

const VideoStart: React.FC<Props> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId: string }>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numVideoId = parseInt(videoId || '1', 10);

    if (name && className && numVideoId >= 1 && numVideoId <= 5) {
      onStart(name, className, numVideoId);
      navigate('/route-select');
    }
  };

  const videoNumber = parseInt(videoId || '1', 10);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-summaLightGray">
      <div className="w-full max-w-md bg-summaWhite rounded-summa-card summa-shadow p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-summaIndigo text-white text-5xl font-bold rounded-summa-card px-6 py-4 mb-4">
            Video {videoNumber}
          </div>
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

export default VideoStart;
