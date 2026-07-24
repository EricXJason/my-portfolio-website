import React, { useState, useEffect } from 'react';
import { LangProvider } from './context/LangContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { ArtGallery } from './components/ArtGallery';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { BackToTop } from './components/BackToTop';
import { SideNav } from './components/SideNav';
import { ScrollProgress } from './components/ScrollProgress';
import { CyberParticles } from './components/CyberParticles';
import { YoutubeModal } from './components/YoutubeModal';
import { LangSelectModal } from './components/LangSelectModal';
import { toggleBGMAudio, setBGMVolume } from './utils/bgmSynth';

function AppContent() {
  const { theme } = useTheme();
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.3);
  const [ytModal, setYtModal] = useState({ open: false, videoId: '', title: '' });

  useEffect(() => {
    setBGMVolume(soundVolume);
  }, [soundVolume]);

  const handleToggleSound = () => {
    const isNowPlaying = toggleBGMAudio(soundVolume);
    setSoundPlaying(isNowPlaying);
  };

  const handleOpenYoutube = (videoId, title) => {
    setYtModal({ open: true, videoId, title });
  };

  const handleCloseYoutube = () => {
    setYtModal({ open: false, videoId: '', title: '' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] relative transition-colors duration-300">

      {/* Language Select Modal — renders on first visit */}
      <LangSelectModal />

      {/* Fixed ambient mesh + particles */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{ opacity: theme === 'light' ? 1 : 0.4 }}>
        <div className="absolute inset-0 light-aurora-bg" />
        <CyberParticles theme={theme} />
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
        <Certifications />
        <Education />
        <ArtGallery />
      </main>

      <Footer lastUpdated="2026-07-25" />
      <BackToTop />

      <YoutubeModal
        isOpen={ytModal.open}
        onClose={handleCloseYoutube}
        videoId={ytModal.videoId}
        title={ytModal.title}
      />
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
