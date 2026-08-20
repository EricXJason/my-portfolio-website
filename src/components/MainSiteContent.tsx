import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { Skills } from './Skills';
import { Projects } from './Projects';
import { Certifications } from './Certifications';
import { Education } from './Education';
import { ArtGallery } from './ArtGallery';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { SideNav } from './SideNav';
import { ScrollProgress } from './ScrollProgress';
import { CyberParticles } from './CyberParticles';
import { FullStackCodeStreamBackground } from './FullStackCodeStreamBackground';
import { GlobalAmbientNeon } from './GlobalAmbientNeon';
import { YoutubeModal } from './YoutubeModal';

interface MainSiteContentProps {
  siteEntered: boolean;
  soundPlaying: boolean;
  soundVolume: number;
  onToggleSound: () => void;
  onChangeVolume: (val: number) => void;
}

interface YtModalState {
  open: boolean;
  videoId: string;
  title: string;
}

export const MainSiteContent: React.FC<MainSiteContentProps> = ({
  siteEntered,
  soundPlaying,
  soundVolume,
  onToggleSound,
  onChangeVolume,
}) => {
  const { theme } = useTheme();
  const [ytModal, setYtModal] = useState<YtModalState>({ open: false, videoId: '', title: '' });

  const handleOpenYoutube = (videoId: string, title: string) => {
    setYtModal({ open: true, videoId, title });
  };

  const handleCloseYoutube = () => {
    setYtModal({ open: false, videoId: '', title: '' });
  };

  return (
    <>
      {/* Top Navigation & Indicators */}
      <ScrollProgress siteEntered={siteEntered} />
      <Navbar
        soundPlaying={soundPlaying}
        onToggleSound={onToggleSound}
        soundVolume={soundVolume}
        onChangeVolume={onChangeVolume}
        siteEntered={siteEntered}
      />
      <SideNav siteEntered={siteEntered} />

      {/* Main Site Container */}
      <div
        className={`min-h-screen relative transition-opacity duration-700 ease-out ${
          siteEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Ambient Layers */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <GlobalAmbientNeon />
          <div className="absolute inset-0 light-aurora-bg" />
          <div className="absolute inset-0 tactical-grid-bg opacity-40" />
          <div className="absolute inset-0 crt-scanlines opacity-25" />
          <FullStackCodeStreamBackground />
          <CyberParticles theme={theme} soundPlaying={soundPlaying} />
        </div>

        {/* Global Tactical Laser Scanner Beams */}
        <div className="fixed top-0 left-0 right-0 h-[1px] z-50 pointer-events-none overflow-hidden opacity-60">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent animate-laser-top shadow-[0_0_6px_var(--neon-cyan)]" />
        </div>
        <div className="fixed top-0 bottom-0 left-0 w-[1px] z-50 pointer-events-none overflow-hidden hidden md:block opacity-40">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-[var(--neon-cyan)] to-transparent animate-laser-vert shadow-[0_0_4px_var(--neon-cyan)]" />
        </div>
        <div className="fixed top-0 bottom-0 right-0 w-[1px] z-50 pointer-events-none overflow-hidden hidden md:block opacity-40">
          <div
            className="w-full h-48 bg-gradient-to-b from-transparent via-[var(--neon-cyan)] to-transparent animate-laser-vert shadow-[0_0_4px_var(--neon-cyan)]"
            style={{ animationDelay: '3s' }}
          />
        </div>

        <main className="relative">
          <Hero soundPlaying={soundPlaying} />
          <About />
          <Skills />
          <Projects onOpenYoutube={handleOpenYoutube} />
          <Certifications />
          <Education />
          <ArtGallery />
        </main>

        <Footer />
        <BackToTop />

        <YoutubeModal
          isOpen={ytModal.open}
          onClose={handleCloseYoutube}
          videoId={ytModal.videoId}
          title={ytModal.title}
        />
      </div>
    </>
  );
};

export default MainSiteContent;
