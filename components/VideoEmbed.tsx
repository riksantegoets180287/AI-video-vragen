
import React from 'react';

interface Props {
  content: string;
}

const VideoEmbed: React.FC<Props> = ({ content }) => {
  const openPopup = () => {
    if (!content) return;

    let targetUrl = content.trim();

    // Als de beheerder een volledige iframe-code heeft geplakt, extraheren we de 'src'
    if (targetUrl.toLowerCase().includes('<iframe')) {
      const srcMatch = targetUrl.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        targetUrl = srcMatch[1];
      }
    }

    // Afmetingen voor het popup-venster
    const width = 800;
    const height = 600;
    
    // Bereken het midden van het scherm
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Open de popup
    window.open(
      targetUrl,
      'SummaVideoPlayer',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes,menubar=no,toolbar=no`
    );
  };

  if (!content) {
    return (
      <div className="w-full aspect-video rounded-summa-card border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 text-center p-8">
        <p className="font-medium">Geen video bron ingesteld voor deze quiz.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-summa-card summa-shadow border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      <div className="p-10 flex flex-col items-center text-center space-y-8">
        {/* Decoratieve Play Icon */}
        <div className="relative group cursor-pointer" onClick={openPopup}>
          <div className="absolute -inset-4 bg-summaBlue/20 rounded-full blur-xl group-hover:bg-summaBlue/30 transition-all"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-summaIndigo to-summaBlue rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-white ml-2" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="max-w-md">
          <h3 className="font-serif text-2xl text-summaIndigo mb-3">Klaar voor de video?</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Klik op de knop hieronder om de video-instructie te openen in een nieuw venster. Zo kun je de video kijken en tegelijkertijd de vragen beantwoorden.
          </p>
        </div>

        {/* De 'Mooie' Knop */}
        <button
          onClick={openPopup}
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-summaIndigo font-pj rounded-summa-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-summaIndigo hover:bg-summaBlue active:scale-95 shadow-xl"
        >
          <span className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            BEKIJK VIDEO
          </span>
        </button>

        <div className="pt-4 border-t border-gray-50 w-full">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Beveiligde verbinding naar originele bron
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoEmbed;
