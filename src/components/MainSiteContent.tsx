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

import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { SideNav } from './SideNav';
import { ScrollProgress } from './ScrollProgress';
import { CyberParticles } from './CyberParticles';
import { FullStackCodeStreamBackground } from './FullStackCodeStreamBackground';
import { GlobalAmbientNeon } from './GlobalAmbientNeon';
import { YoutubeModal } from './YoutubeModal';

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
   * TODO: [後端端點對接] 取得使用者模式主頁面區塊模組渲染順序
   * 1. HTTP Method: GET
   * 2. 預期端點: /api/v1/modules-order
   * 3. 請求參數: 無
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: string[] }
   * 5. 當前狀態: 使用者模式嚴格與 CMS 隔離，採用官方標準排列順序，待後端 API 完成後改由 apiClient.get() 取得。
   */
  const moduleOrder = ['home', 'about', 'skills', 'projects', 'awards', 'experience', 'gallery'];

  const handleOpenYoutube = (videoId: string, title: string) => {
    setYtModal({ open: true, videoId, title });
  };

  const handleCloseYoutube = () => {
    setYtModal({ open: false, videoId: '', title: '' });
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'home':
        return <Hero key="home" soundPlaying={soundPlaying} />;
      case 'about':
        return (
          <Suspense key="about" fallback={null}>
            <About />
          </Suspense>
        );
      case 'skills':
        return (
          <Suspense key="skills" fallback={null}>
            <Skills />
          </Suspense>
        );
      case 'projects':
        return (
          <Suspense key="projects" fallback={null}>
            <Projects onOpenYoutube={handleOpenYoutube} />
          </Suspense>
        );
      case 'awards':
        return (
          <Suspense key="awards" fallback={null}>
            <Certifications />
          </Suspense>
        );
      case 'experience':
        return (
          <Suspense key="experience" fallback={null}>
            <Education />
          </Suspense>
        );
      case 'gallery':
        return (
          <Suspense key="gallery" fallback={null}>
            <ArtGallery />
          </Suspense>
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
          <FullStackCodeStreamBackground />
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
