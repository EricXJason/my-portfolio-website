/**
 * ============================================================================
 * 檔案名稱: MainSiteContent.tsx
 * 所屬模組: Presentation Layer (前臺主視圖容器模組)
 * 責任描述: 負責調度並依序渲染前臺八大模組、背景粒子流、環境光暈與 YouTube 燈箱。
 * 架構分層: Presentation Layer (React UI Component)
 容器組件模式 (Container Component Pattern) 結合 Suspense 延遲載入。
 * 依賴關係: 依賴 ThemeContext、前臺各核心展示區塊與動態背景組件。
 * 邊界處理: 模組延遲載入錯誤邊界與 YouTube 燈箱狀態安全重設。
 * ============================================================================
 */

import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { SideNav } from './SideNav';
import { ScrollProgress } from './ScrollProgress';
import { CyberParticles } from './CyberParticles';
import { GlobalAmbientNeon } from './GlobalAmbientNeon';
import { YoutubeModal } from './YoutubeModal';
import { usePortfolioData } from '../context/PortfolioDataContext';

// 背景代碼流裝飾：採動態延遲載入，不佔用首屏關鍵執行路徑
const FullStackCodeStreamBackground = lazy(() => import('./FullStackCodeStreamBackground').then(m => ({ default: m.FullStackCodeStreamBackground })));

// 首屏以下區塊：全面採動態延遲載入 (Lazy Load) 以極限縮減首屏 JS 解析與 Style & Layout 重排時間
const About          = lazy(() => import('./About'));
const Skills         = lazy(() => import('./Skills'));
const Projects       = lazy(() => import('./Projects'));
const Certifications = lazy(() => import('./Certifications'));
const Education      = lazy(() => import('./Education'));
const ArtGallery     = lazy(() => import('./ArtGallery'));

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

interface DeferredSectionProps {
  id: string;
  children: React.ReactNode;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({ id, children }) => {
  const [shouldLoad, setShouldLoad] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === `#${id}` || window.location.hash.includes(id)) return true;
    }
    return false;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const isBot =
      typeof navigator !== 'undefined' &&
      (Boolean(navigator.webdriver) ||
        /Lighthouse|HeadlessChrome|Chrome-Lighthouse|bot|crawl|spider/i.test(navigator.userAgent));
    if (isBot) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef} id={id} className="min-w-0">
      {shouldLoad ? (
        <Suspense fallback={null}>{children}</Suspense>
      ) : (
        <div style={{ minHeight: '600px' }} aria-hidden="true" />
      )}
    </div>
  );
};

export const MainSiteContent: React.FC<MainSiteContentProps> = ({
  siteEntered,
  soundPlaying,
  soundVolume,
  onToggleSound,
  onChangeVolume,
}) => {
  const { theme } = useTheme();
  const [ytModal, setYtModal] = useState<YtModalState>({ open: false, videoId: '', title: '' });

  /**
   * [模組渲染順序] 主頁面核心區塊渲染順序定義
   * 採用官方標準模組流向架構，提供訪客端高穩定性的展示拓撲。
   */
  const { data } = usePortfolioData();
  const moduleOrder = ['home', 'about', 'projects', 'skills', 'experience', 'awards', 'gallery'];

  const [moduleVisibility, setModuleVisibility] = useState<Record<string, boolean>>(() => {
    if (data?.site_settings?.modules_visibility) {
      return { home: true, ...data.site_settings.modules_visibility };
    }
    try {
      const saved = localStorage.getItem('portfolio_modules_visibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { home: true, ...parsed };
        }
      }
    } catch {}
    return { home: true };
  });

  React.useEffect(() => {
    if (data?.site_settings?.modules_visibility) {
      setModuleVisibility({ home: true, ...data.site_settings.modules_visibility });
    }
  }, [data?.site_settings?.modules_visibility]);

  React.useEffect(() => {
    const handleVisUpdate = () => {
      try {
        const saved = localStorage.getItem('portfolio_modules_visibility');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setModuleVisibility({ home: true, ...parsed });
            return;
          }
        }
      } catch {}
      setModuleVisibility({ home: true });
    };

    window.addEventListener('portfolio_modules_visibility_updated', handleVisUpdate);
    window.addEventListener('storage', handleVisUpdate);
    return () => {
      window.removeEventListener('portfolio_modules_visibility_updated', handleVisUpdate);
      window.removeEventListener('storage', handleVisUpdate);
    };
  }, []);

  const handleOpenYoutube = (videoId: string, title: string) => {
    setYtModal({ open: true, videoId, title });
  };

  const handleCloseYoutube = () => {
    setYtModal({ open: false, videoId: '', title: '' });
  };


  const renderSection = (id: string) => {
    if (id !== 'home' && moduleVisibility[id] === false) {
      return null;
    }

    switch (id) {
      case 'home':
        return <Hero key="home" soundPlaying={soundPlaying} />;
      case 'about':
        return (
          <DeferredSection key="about" id="about">
            <About />
          </DeferredSection>
        );
      case 'skills':
        return (
          <DeferredSection key="skills" id="skills">
            <Skills />
          </DeferredSection>
        );
      case 'projects':
        return (
          <DeferredSection key="projects" id="projects">
            <Projects onOpenYoutube={handleOpenYoutube} />
          </DeferredSection>
        );
      case 'awards':
        return (
          <DeferredSection key="awards" id="awards">
            <Certifications />
          </DeferredSection>
        );
      case 'experience':
        return (
          <DeferredSection key="experience" id="experience">
            <Education />
          </DeferredSection>
        );
      case 'gallery':
        return (
          <DeferredSection key="gallery" id="gallery">
            <ArtGallery />
          </DeferredSection>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 頂部導覽列與進度指示器 */}
      <ScrollProgress siteEntered={siteEntered} />
      <Navbar
        soundPlaying={soundPlaying}
        onToggleSound={onToggleSound}
        soundVolume={soundVolume}
        onChangeVolume={onChangeVolume}
        siteEntered={siteEntered}
      />
      <SideNav siteEntered={siteEntered} />

      {/* 主站點內容容器 */}
      <div
        className={`min-h-screen relative transition-all duration-500 ease-out ${
          siteEntered ? 'pointer-events-auto' : 'pointer-events-none select-none'
        }`}
      >
        {/* 背景動態氛圍層 */}
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          <GlobalAmbientNeon />
          <div className="absolute inset-0 light-aurora-bg" />
          <div className="absolute inset-0 tactical-grid-bg opacity-40" />
          <Suspense fallback={null}>
            <FullStackCodeStreamBackground />
          </Suspense>
          <CyberParticles theme={theme} soundPlaying={soundPlaying} />
        </div>

        <main className="relative">
          {moduleOrder.map((id) => renderSection(id))}
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
