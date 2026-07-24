import React from 'react';
import { X } from 'lucide-react';

// YoutubeModal Component: Embedded Video Lightbox Overlay
export const YoutubeModal = ({ isOpen, onClose, videoId, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={title || "YouTube Video Player"}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-white truncate pr-4">
            {title || "Project Demo Video"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close Video Player"
          >
            <X size={20} />
          </button>
        </div>

        {/* 16:9 Video Iframe Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title || "YouTube Video Player"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
