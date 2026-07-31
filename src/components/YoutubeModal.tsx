import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

interface YoutubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

export const YoutubeModal: React.FC<YoutubeModalProps> = ({ isOpen, onClose, videoId, title }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleClose = () => {
    document.body.classList.remove('hide-custom-cursor');
    onClose();
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('hide-custom-cursor');
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
      style={{
        backgroundColor: isLight ? 'rgba(15,23,42,0.65)' : 'rgba(3,7,18,0.85)',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'YouTube Video Player'}
    >
      <div
        className="relative w-full max-w-4xl border rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
          boxShadow: isLight
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}
        >
          <h3
            className="text-base sm:text-lg font-bold truncate pr-4"
            style={{ color: isLight ? '#0f172a' : '#ffffff' }}
          >
            {title || 'Project Demo Video'}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl border transition-colors cursor-pointer shrink-0"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
              borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
              color: isLight ? '#0f172a' : '#f8fafc',
            }}
            aria-label="Close Video Player"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* 16:9 Iframe */}
        <div
          className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950"
          onMouseEnter={() => document.body.classList.add('hide-custom-cursor')}
          onMouseLeave={() => document.body.classList.remove('hide-custom-cursor')}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title || 'YouTube Video Player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

