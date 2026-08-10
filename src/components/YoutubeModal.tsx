import React, { useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Video } from 'lucide-react';

interface YoutubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

export const YoutubeModal: React.FC<YoutubeModalProps> = ({ isOpen, onClose, videoId, title }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    document.body.classList.remove('hide-custom-cursor');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.classList.remove('hide-custom-cursor');
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-xl outline-hidden select-none"
      style={{
        backgroundColor: isLight ? 'rgba(15,23,42,0.75)' : 'rgba(3,7,18,0.92)',
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || '專案展示影片'}
    >
      <div
        className="relative w-full max-w-4xl border cyber-cut-corner space-y-4 p-4 sm:p-6 shadow-2xl hud-corner-brackets"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#080e1a',
          borderColor: borderCol,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b pb-3"
          style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(0,240,255,0.2)' }}
        >
          <div className="flex items-center gap-2 pr-4 min-w-0">
            <Video size={18} className="text-rose-500 shrink-0" />
            <h3
              className="text-base sm:text-lg font-hud font-bold uppercase truncate"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {title || '專案展示影片'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 border cyber-cut-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
              borderColor: borderCol,
              color: isLight ? '#0f172a' : '#f8fafc',
            }}
            aria-label="關閉影片視窗"
            title="關閉"
          >
            <X size={18} />
          </button>
        </div>

        {/* 16:9 Iframe Container */}
        <div
          className="relative aspect-video w-full border cyber-cut-sm overflow-hidden bg-slate-950"
          style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)' }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title || '專案展示影片'}
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

export default YoutubeModal;
