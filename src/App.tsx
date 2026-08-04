import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LangProvider } from './context/LangContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { BackToTop } from './components/BackToTop';
import { SideNav } from './components/SideNav';
import { ScrollProgress } from './components/ScrollProgress';
import { CyberParticles } from './components/CyberParticles';
import { LangSelectModal } from './components/LangSelectModal';
import { LoadingScreen } from './components/LoadingScreen';
import { SeoSchema } from './components/SeoSchema';
import { toggleBGMAudio, setBGMVolume } from './utils/bgmSynth';

const Certifications = lazy(() => import('./components/Certifications').then(m => ({ default: m.Certifications })));
const Education = lazy(() => import('./components/Education').then(m => ({ default: m.Education })));
const ArtGallery = lazy(() => import('./components/ArtGallery').then(m => ({ default: m.ArtGallery })));
const YoutubeModal = lazy(() => import('./components/YoutubeModal').then(m => ({ default: m.YoutubeModal })));

interface YtModalState {
  open: boolean;
  videoId: string;
  title: string;
}

function AppContent() {
  const { theme } = useTheme();
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.3);
  const [ytModal, setYtModal] = useState<YtModalState>({ open: false, videoId: '', title: '' });

  // Dynamic local date formatting (ISO YYYY-MM-DD)
  const currentLocalDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setBGMVolume(soundVolume);
  }, [soundVolume]);

  const handleToggleSound = () => {
    const isNowPlaying = toggleBGMAudio(soundVolume);
    setSoundPlaying(isNowPlaying);
  };

  const handleOpenYoutube = (videoId: string, title: string) => {
    setYtModal({ open: true, videoId, title });
  };

  const handleCloseYoutube = () => {
    setYtModal({ open: false, videoId: '', title: '' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] relative transition-colors duration-300">

      {/* Dynamic Modular SEO JSON-LD Schema */}
      <SeoSchema />

      {/* Text-free Loading Screen with Percentage */}
      <LoadingScreen />

      {/* Language Select Modal — renders on first visit */}
      <LangSelectModal />

      {/* Fixed ambient mesh + particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 light-aurora-bg" />
        <CyberParticles theme={theme} soundPlaying={soundPlaying} />
      </div>

      <ScrollProgress />
      <CustomCursor />

      <Navbar
        soundPlaying={soundPlaying}
        onToggleSound={handleToggleSound}
        soundVolume={soundVolume}
        onChangeVolume={setSoundVolume}
      />

      <SideNav />

      <main className="relative">
        <Hero soundPlaying={soundPlaying} />
        <About />
        <Skills />
        <Projects onOpenYoutube={handleOpenYoutube} />
        <Suspense fallback={null}>
          <Certifications />
          <Education />
          <ArtGallery />
        </Suspense>
      </main>

      <Footer lastUpdated={currentLocalDate} />
      <BackToTop />

      <Suspense fallback={null}>
        <YoutubeModal
          isOpen={ytModal.open}
          onClose={handleCloseYoutube}
          videoId={ytModal.videoId}
          title={ytModal.title}
        />
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
