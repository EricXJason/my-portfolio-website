import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LangProvider } from './context/LangContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangSelectModal } from './components/LangSelectModal';
import { InitialPreloader } from './components/InitialPreloader';
import { SeoSchema } from './components/SeoSchema';
import { CustomCursor } from './components/CustomCursor';
import { toggleBGMAudio, setBGMVolume } from './utils/bgmSynth';

// Dynamic lazy import for main site content to achieve 0ms initial blocking time & 100/100 Lighthouse
const MainSiteContent = lazy(() => import('./components/MainSiteContent'));

// Eager background preheating trigger
const preheatMainBundle = () => {
  import('./components/MainSiteContent');
};

function AppContent() {
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.3);

  // Smooth Step-by-Step Onboarding Flow: 0-100% Preloader -> Language Modal -> Official Site Reveal
  const [preloaderDone, setPreloaderDone] = useState<boolean>(false);
  const [siteEntered, setSiteEntered] = useState<boolean>(false);

  // Prewarm main bundle during initial idle / preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      preheatMainBundle();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Lock scrollbars completely before user officially enters site
  useEffect(() => {
    if (!siteEntered) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [siteEntered]);

  useEffect(() => {
    setBGMVolume(soundVolume);
  }, [soundVolume]);

  const handleToggleSound = () => {
    const isNowPlaying = toggleBGMAudio(soundVolume);
    setSoundPlaying(isNowPlaying);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] relative transition-colors duration-300">
      <SeoSchema />

      {/* Global Laser Custom Cursor — Always active for Loading, Language Modal, and Main Site */}
      <CustomCursor />

      {/* Step 1: Tactical HUD Preloader Animation (0% -> 100%) */}
      {!preloaderDone && (
        <InitialPreloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* Step 2: Language Selection Modal (Rendered on Frame 1 under Preloader for instant LCP) */}
      <LangSelectModal
        isOpen={!siteEntered}
        onSelectLanguage={() => setSiteEntered(true)}
      />

      {/* Step 3: Lazy Loaded Main Site Content */}
      <Suspense fallback={null}>
        {siteEntered && (
          <MainSiteContent
            siteEntered={siteEntered}
            soundPlaying={soundPlaying}
            soundVolume={soundVolume}
            onToggleSound={handleToggleSound}
            onChangeVolume={setSoundVolume}
          />
        )}
      </Suspense>
    </div>
  );
}

export function App() {
  return (
    <LangProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LangProvider>
  );
}

export default App;
