import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LangProvider } from './context/LangContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LangSelectModal } from './components/LangSelectModal';
import { InitialPreloader } from './components/InitialPreloader';
import { SeoSchema } from './components/SeoSchema';
import { toggleBGMAudio, setBGMVolume } from './utils/bgmSynth';

const Navbar = lazy(() => import('./components/Navbar').then(m => ({ default: m.Navbar })));
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const CustomCursor = lazy(() => import('./components/CustomCursor').then(m => ({ default: m.CustomCursor })));
const BackToTop = lazy(() => import('./components/BackToTop').then(m => ({ default: m.BackToTop })));
const SideNav = lazy(() => import('./components/SideNav').then(m => ({ default: m.SideNav })));
const ScrollProgress = lazy(() => import('./components/ScrollProgress').then(m => ({ default: m.ScrollProgress })));
const CyberParticles = lazy(() => import('./components/CyberParticles').then(m => ({ default: m.CyberParticles })));
const FullStackCodeStreamBackground = lazy(() => import('./components/FullStackCodeStreamBackground').then(m => ({ default: m.FullStackCodeStreamBackground })));
const GlobalAmbientNeon = lazy(() => import('./components/GlobalAmbientNeon').then(m => ({ default: m.GlobalAmbientNeon })));

const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Skills = lazy(() => import('./components/Skills').then(m => ({ default: m.Skills })));
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
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

  // Smooth Step-by-Step Onboarding Flow: 0-100% Preloader -> Language Modal -> Official Site Reveal
  const [preloaderDone, setPreloaderDone] = useState<boolean>(false);
  const [siteEntered, setSiteEntered] = useState<boolean>(false);

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

  const handleOpenYoutube = (videoId: string, title: string) => {
    setYtModal({ open: true, videoId, title });
  };

  const handleCloseYoutube = () => {
    setYtModal({ open: false, videoId: '', title: '' });
  };

  // Prefetch main website chunks after initial paint so clicking language enters the site instantly with 0ms wait
  useEffect(() => {
    const prefetch = () => {
      import('./components/Hero');
      import('./components/Navbar');
      import('./components/About');
      import('./components/Skills');
      import('./components/Projects');
      import('./components/Certifications');
      import('./components/Education');
      import('./components/ArtGallery');
      import('./components/Footer');
      import('./components/SideNav');
      import('./components/ScrollProgress');
    };

    const timer = setTimeout(prefetch, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] relative transition-colors duration-300">

      <SeoSchema />

      {/* Global Laser Custom Cursor & Top Navigation — Mounted once site is entered */}
      {siteEntered && (
        <Suspense fallback={null}>
          <CustomCursor />
          <ScrollProgress siteEntered={siteEntered} />
          <Navbar
            soundPlaying={soundPlaying}
            onToggleSound={handleToggleSound}
            soundVolume={soundVolume}
            onChangeVolume={setSoundVolume}
            siteEntered={siteEntered}
          />
          <SideNav siteEntered={siteEntered} />
        </Suspense>
      )}

      {/* Step 1: Tactical HUD Preloader Animation (0% -> 100%) */}
      {!preloaderDone && (
        <InitialPreloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* Step 2: Language Selection Modal (Rendered on Frame 1 under Preloader for instant LCP) */}
      <LangSelectModal
        isOpen={!siteEntered}
        onSelectLanguage={() => setSiteEntered(true)}
      />

      {/* Step 3: Main Site Container */}
      <div
        className={`min-h-screen relative transition-opacity duration-700 ease-out ${
          siteEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Ambient Layers — Mounted only after site entered to eliminate initial main-thread blocking */}
        {siteEntered && (
          <div className="fixed inset-0 pointer-events-none z-0">
            <GlobalAmbientNeon />
            <div className="absolute inset-0 light-aurora-bg" />
            <div className="absolute inset-0 tactical-grid-bg opacity-40" />
            <div className="absolute inset-0 crt-scanlines opacity-25" />
            <FullStackCodeStreamBackground />
            <CyberParticles theme={theme} soundPlaying={soundPlaying} />
          </div>
        )}

        {/* Global Tactical Laser Scanner Beams */}
        <div className="fixed top-0 left-0 right-0 h-[1px] z-50 pointer-events-none overflow-hidden opacity-60">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent animate-laser-top shadow-[0_0_6px_var(--neon-cyan)]" />
        </div>
        <div className="fixed top-0 bottom-0 left-0 w-[1px] z-50 pointer-events-none overflow-hidden hidden md:block opacity-40">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-[var(--neon-cyan)] to-transparent animate-laser-vert shadow-[0_0_4px_var(--neon-cyan)]" />
        </div>
        <div className="fixed top-0 bottom-0 right-0 w-[1px] z-50 pointer-events-none overflow-hidden hidden md:block opacity-40">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-[var(--neon-cyan)] to-transparent animate-laser-vert shadow-[0_0_4px_var(--neon-cyan)]" style={{ animationDelay: '3s' }} />
        </div>

        {siteEntered && (
          <>
            <main className="relative">
              <Hero soundPlaying={soundPlaying} />
              <Suspense fallback={null}>
                <About />
                <Skills />
                <Projects onOpenYoutube={handleOpenYoutube} />
                <Certifications />
                <Education />
                <ArtGallery />
              </Suspense>
            </main>

            <Suspense fallback={null}>
              <Footer />
            </Suspense>
            <BackToTop />

            <Suspense fallback={null}>
              <YoutubeModal
                isOpen={ytModal.open}
                onClose={handleCloseYoutube}
                videoId={ytModal.videoId}
                title={ytModal.title}
              />
            </Suspense>
          </>
        )}
      </div>
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
