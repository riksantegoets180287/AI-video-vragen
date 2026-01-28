
import React from 'react';

interface Props {
  url: string;
}

const YouTubeEmbed: React.FC<Props> = ({ url }) => {
  const getEmbedId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getEmbedId(url);

  if (!videoId) {
    return (
      <div className="bg-gray-200 aspect-video flex items-center justify-center rounded-summa-card text-gray-500">
        Ongeldige YouTube URL
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-summa-card overflow-hidden summa-shadow bg-black">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
