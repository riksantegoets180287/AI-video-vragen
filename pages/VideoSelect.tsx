
import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  onSelect: (videoId: number) => void;
}

const VideoSelect: React.FC<Props> = ({ onSelect }) => {
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId: string }>();
  const hasProcessedVideoId = useRef(false);

  useEffect(() => {
    if (videoId && !hasProcessedVideoId.current) {
      const id = parseInt(videoId, 10);
      if (id >= 1 && id <= 5) {
        hasProcessedVideoId.current = true;
        onSelect(id);
        navigate('/login', { replace: true });
      }
    }
  }, [videoId]);

  const handleSelect = (id: number) => {
    hasProcessedVideoId.current = false;
    onSelect(id);
    navigate(`/video/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-summaLightGray">
      <h1 className="font-serif text-3xl text-summaIndigo mb-10 text-center">Kies je Video</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 w-full max-w-5xl">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            className="bg-white group relative overflow-hidden text-summaIndigo font-bold text-4xl aspect-square rounded-summa-card shadow-lg hover:bg-summaIndigo hover:text-white active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-summaIndigo/10 hover:border-white/20"
          >
            <span className="text-xs uppercase tracking-widest opacity-50 mb-2">Video</span>
            {num}
            <div className="absolute inset-0 bg-summaBlue opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoSelect;
