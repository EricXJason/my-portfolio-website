/**
 * ============================================================================
 * 檔案名稱: FullStackCodeStreamBackground.tsx
 * 所屬模組: Presentation Layer (全端串流原始碼動態背景模組 - 高效能 Canvas 引擎)
 * 責任描述: 負責於全站底層以 HTML5 Canvas 呈現雙向滾動之全端程式碼串流（左側 HTML、右側 TypeScript），體現極致全端工程氛圍。
 * 架構分層: Presentation Layer (React UI Component with Hardware-Accelerated 2D Canvas)
 * 依賴關係: 依賴 ThemeContext 與 site-settings.json 之代碼滾動速度設定。
 * 邊界處理: 零 DOM 節點開銷、視窗切換自動暫停、無障礙隔離 (aria-hidden)、Retina 高解析度適配。
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import defaultSiteSettings from '../data/site-settings.json';

interface Token {
  text: string;
  type: 'num' | 'kw' | 'tag' | 'attr' | 'str' | 'fn' | 'type' | 'plain' | 'badge';
}

interface Line {
  tokens: Token[];
}

// ── 經典原始碼片段：左側 HTML/JSX 矩陣 ──
const LEFT_LINES: Line[] = [
  { tokens: [{ text: '/* [HTML-01/04] public/index.html — 核心入口 */', type: 'badge' }] },
  { tokens: [{ text: '01 ', type: 'num' }, { text: '<!DOCTYPE ', type: 'kw' }, { text: 'html', type: 'attr' }, { text: '>', type: 'kw' }] },
  { tokens: [{ text: '02 ', type: 'num' }, { text: '<html ', type: 'tag' }, { text: 'lang', type: 'attr' }, { text: '="zh-Hant" ', type: 'str' }, { text: 'class', type: 'attr' }, { text: '="dark"', type: 'str' }, { text: '>', type: 'tag' }] },
  { tokens: [{ text: '03 ', type: 'num' }, { text: '  <head>', type: 'tag' }] },
  { tokens: [{ text: '04 ', type: 'num' }, { text: '    <meta ', type: 'tag' }, { text: 'charset', type: 'attr' }, { text: '="UTF-8" />', type: 'str' }] },
  { tokens: [{ text: '05 ', type: 'num' }, { text: '    <meta ', type: 'tag' }, { text: 'name', type: 'attr' }, { text: '="viewport" ', type: 'str' }, { text: 'content', type: 'attr' }, { text: '="width=device-width" />', type: 'str' }] },
  { tokens: [{ text: '06 ', type: 'num' }, { text: '    <title>', type: 'tag' }, { text: '許哲誠 | 作品集', type: 'plain' }, { text: '</title>', type: 'tag' }] },
  { tokens: [{ text: '07 ', type: 'num' }, { text: '    <link ', type: 'tag' }, { text: 'rel', type: 'attr' }, { text: '="preconnect" ', type: 'str' }, { text: 'href', type: 'attr' }, { text: '="https://fonts.googleapis.com" />', type: 'str' }] },
  { tokens: [{ text: '08 ', type: 'num' }, { text: '  </head>', type: 'tag' }] },
  { tokens: [{ text: '09 ', type: 'num' }, { text: '  <body ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="bg-gray-950 text-slate-100"', type: 'str' }, { text: '>', type: 'tag' }] },
  { tokens: [{ text: '10 ', type: 'num' }, { text: '    <div ', type: 'tag' }, { text: 'id', type: 'attr' }, { text: '="root"></div>', type: 'str' }] },
  { tokens: [{ text: '11 ', type: 'num' }, { text: '    <script ', type: 'tag' }, { text: 'type', type: 'attr' }, { text: '="module" ', type: 'str' }, { text: 'src', type: 'attr' }, { text: '="/src/main.tsx"></script>', type: 'str' }] },
  { tokens: [{ text: '12 ', type: 'num' }, { text: '  </body>', type: 'tag' }] },
  { tokens: [{ text: '13 ', type: 'num' }, { text: '</html>', type: 'tag' }] },
  { tokens: [{ text: '', type: 'plain' }] },
  { tokens: [{ text: '/* [HTML-02/04] src/components/Navbar.tsx — 導覽列 */', type: 'badge' }] },
  { tokens: [{ text: '01 ', type: 'num' }, { text: '<header ', type: 'tag' }, { text: 'id', type: 'attr' }, { text: '="tactical-hud-nav" ', type: 'str' }, { text: 'class', type: 'attr' }, { text: '="fixed top-0 z-40">', type: 'str' }] },
  { tokens: [{ text: '02 ', type: 'num' }, { text: '  <nav ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="max-w-7xl mx-auto px-6 h-16 flex items-center">', type: 'str' }] },
  { tokens: [{ text: '03 ', type: 'num' }, { text: '    <div ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="flex items-center gap-3 font-hud">', type: 'str' }] },
  { tokens: [{ text: '04 ', type: 'num' }, { text: '      <span ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="text-cyan-400 font-black">', type: 'str' }, { text: 'JASON.DEV', type: 'plain' }, { text: '</span>', type: 'tag' }] },
  { tokens: [{ text: '05 ', type: 'num' }, { text: '    </div>', type: 'tag' }] },
  { tokens: [{ text: '06 ', type: 'num' }, { text: '    <ul ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="hidden md:flex gap-6 font-tech">', type: 'str' }] },
  { tokens: [{ text: '07 ', type: 'num' }, { text: '      <li><a ', type: 'tag' }, { text: 'href', type: 'attr' }, { text: '="#projects">', type: 'str' }, { text: 'PROJECTS', type: 'plain' }, { text: '</a></li>', type: 'tag' }] },
  { tokens: [{ text: '08 ', type: 'num' }, { text: '    </ul>', type: 'tag' }] },
  { tokens: [{ text: '09 ', type: 'num' }, { text: '  </nav>', type: 'tag' }] },
  { tokens: [{ text: '10 ', type: 'num' }, { text: '</header>', type: 'tag' }] },
  { tokens: [{ text: '', type: 'plain' }] },
  { tokens: [{ text: '/* [HTML-03/04] src/components/Hero.tsx — 主看板 */', type: 'badge' }] },
  { tokens: [{ text: '01 ', type: 'num' }, { text: '<section ', type: 'tag' }, { text: 'id', type: 'attr' }, { text: '="home" ', type: 'str' }, { text: 'class', type: 'attr' }, { text: '="min-h-screen flex items-center">', type: 'str' }] },
  { tokens: [{ text: '02 ', type: 'num' }, { text: '  <div ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="max-w-5xl mx-auto px-6 text-center">', type: 'str' }] },
  { tokens: [{ text: '03 ', type: 'num' }, { text: '    <h1 ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="text-5xl font-black font-hud">', type: 'str' }] },
  { tokens: [{ text: '04 ', type: 'num' }, { text: '      許哲誠 ', type: 'plain' }, { text: '<span ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="text-cyan-400">', type: 'str' }, { text: 'HSU, CHE-CHENG', type: 'plain' }, { text: '</span>', type: 'tag' }] },
  { tokens: [{ text: '05 ', type: 'num' }, { text: '    </h1>', type: 'tag' }] },
  { tokens: [{ text: '06 ', type: 'num' }, { text: '    <p ', type: 'tag' }, { text: 'class', type: 'attr' }, { text: '="text-xl font-tech text-cyan-400">', type: 'str' }, { text: 'Interactive VR & Full-Stack', type: 'plain' }, { text: '</p>', type: 'tag' }] },
  { tokens: [{ text: '07 ', type: 'num' }, { text: '  </div>', type: 'tag' }] },
  { tokens: [{ text: '08 ', type: 'num' }, { text: '</section>', type: 'tag' }] },
];

// ── 經典原始碼片段：右側 TypeScript 服務矩陣 ──
const RIGHT_LINES: Line[] = [
  { tokens: [{ text: '/* [TS-01/04] src/services/storageService.ts */', type: 'badge' }] },
  { tokens: [{ text: '01 ', type: 'num' }, { text: 'import ', type: 'kw' }, { text: '{ ref, uploadBytesResumable, getDownloadURL } ', type: 'plain' }, { text: 'from ', type: 'kw' }, { text: '"firebase/storage"', type: 'str' }, { text: ';', type: 'plain' }] },
  { tokens: [{ text: '02 ', type: 'num' }, { text: 'export async function ', type: 'kw' }, { text: 'uploadPortfolioImage', type: 'fn' }, { text: '(', type: 'plain' }, { text: 'file', type: 'attr' }, { text: ': ', type: 'plain' }, { text: 'File', type: 'type' }, { text: '): ', type: 'plain' }, { text: 'Promise<string> ', type: 'type' }, { text: '{', type: 'plain' }] },
  { tokens: [{ text: '03 ', type: 'num' }, { text: '  const ', type: 'kw' }, { text: 'ext = file.name.split(".").pop();', type: 'plain' }] },
  { tokens: [{ text: '04 ', type: 'num' }, { text: '  const ', type: 'kw' }, { text: 'storagePath = `portfolio/${Date.now()}.${ext}`;', type: 'str' }] },
  { tokens: [{ text: '05 ', type: 'num' }, { text: '  const ', type: 'kw' }, { text: 'storageRef = ref(storage, storagePath);', type: 'plain' }] },
  { tokens: [{ text: '06 ', type: 'num' }, { text: '  await ', type: 'kw' }, { text: 'uploadBytesResumable(storageRef, file);', type: 'fn' }] },
  { tokens: [{ text: '07 ', type: 'num' }, { text: '  return ', type: 'kw' }, { text: 'await ', type: 'kw' }, { text: 'getDownloadURL(storageRef);', type: 'fn' }] },
  { tokens: [{ text: '08 ', type: 'num' }, { text: '}', type: 'plain' }] },
  { tokens: [{ text: '', type: 'plain' }] },
  { tokens: [{ text: '/* [TS-02/04] src/utils/bgmSynth.ts — Web Audio 引擎 */', type: 'badge' }] },
  { tokens: [{ text: '01 ', type: 'num' }, { text: 'class ', type: 'kw' }, { text: 'CyberpunkSynthEngine ', type: 'type' }, { text: '{', type: 'plain' }] },
  { tokens: [{ text: '02 ', type: 'num' }, { text: '  private ', type: 'kw' }, { text: 'audioCtx: ', type: 'plain' }, { text: 'AudioContext ', type: 'type' }, { text: '| ', type: 'plain' }, { text: 'null ', type: 'kw' }, { text: '= null;', type: 'plain' }] },
  { tokens: [{ text: '03 ', type: 'num' }, { text: '  public ', type: 'kw' }, { text: 'init(): ', type: 'fn' }, { text: 'void ', type: 'type' }, { text: '{', type: 'plain' }] },
  { tokens: [{ text: '04 ', type: 'num' }, { text: '    if (!this.audioCtx) this.audioCtx = new AudioContext();', type: 'plain' }] },
  { tokens: [{ text: '05 ', type: 'num' }, { text: '  }', type: 'plain' }] },
  { tokens: [{ text: '06 ', type: 'num' }, { text: '  public ', type: 'kw' }, { text: 'startSynthLoop(): ', type: 'fn' }, { text: 'boolean ', type: 'type' }, { text: '{', type: 'plain' }] },
  { tokens: [{ text: '07 ', type: 'num' }, { text: '    this.init(); return true;', type: 'plain' }] },
  { tokens: [{ text: '08 ', type: 'num' }, { text: '  }', type: 'plain' }] },
  { tokens: [{ text: '09 ', type: 'num' }, { text: '}', type: 'plain' }] },
  { tokens: [{ text: '', type: 'plain' }] },
  { tokens: [{ text: '/* [TS-03/04] src/context/PortfolioDataContext.tsx */', type: 'badge' }] },
  { tokens: [{ text: '01 ', type: 'num' }, { text: 'export const ', type: 'kw' }, { text: 'PortfolioDataProvider', type: 'fn' }, { text: ' = ({ children }: Props) => {', type: 'plain' }] },
  { tokens: [{ text: '02 ', type: 'num' }, { text: '  const [data, setData] = useState(initialData);', type: 'plain' }] },
  { tokens: [{ text: '03 ', type: 'num' }, { text: '  useEffect(() => {', type: 'kw' }] },
  { tokens: [{ text: '04 ', type: 'num' }, { text: '    if (!isCmsRoute) { SWRFallback(); return; }', type: 'plain' }] },
  { tokens: [{ text: '05 ', type: 'num' }, { text: '    return subscribeToFirestore(setData);', type: 'fn' }] },
  { tokens: [{ text: '06 ', type: 'num' }, { text: '  }, [isCmsRoute]);', type: 'plain' }] },
  { tokens: [{ text: '07 ', type: 'num' }, { text: '  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;', type: 'plain' }] },
  { tokens: [{ text: '08 ', type: 'num' }, { text: '};', type: 'plain' }] },
];

export const FullStackCodeStreamBackground: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024;
  });

  const speedMultiplier = defaultSiteSettings.codeAnimationSpeed || 1.0;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let leftOffset = 0;
    let rightOffset = 240;

    const LINE_HEIGHT = 20;
    const leftTotalHeight = LEFT_LINES.length * LINE_HEIGHT;
    const rightTotalHeight = RIGHT_LINES.length * LINE_HEIGHT;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // 顏色對應字典 (Canvas 渲染專用)
    const colors = {
      num: '#64748b',
      kw: isLight ? '#7c3aed' : '#c084fc',
      tag: isLight ? '#0284c7' : '#00f0ff',
      attr: isLight ? '#2563eb' : '#38bdf8',
      str: isLight ? '#047857' : '#34d399',
      fn: isLight ? '#0284c7' : '#38bdf8',
      type: isLight ? '#d97706' : '#fbbf24',
      plain: isLight ? '#1e293b' : '#f8fafc',
      badge: isLight ? '#0284c7' : '#00f0ff',
    };

    const drawLine = (line: Line, startX: number, y: number) => {
      let curX = startX;
      for (const t of line.tokens) {
        ctx.fillStyle = colors[t.type];
        ctx.fillText(t.text, curX, y);
        curX += ctx.measureText(t.text).width;
      }
    };

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // 全域透明度
      ctx.globalAlpha = isLight ? 0.35 : 0.22;

      // ── 左側 HTML 串流 (流向向下) ──
      const leftX = Math.max(24, w * 0.03);
      leftOffset = (leftOffset + 0.35 * speedMultiplier) % leftTotalHeight;
      const startLeftIdx = -Math.ceil(h / leftTotalHeight) - 1;
      const endLeftIdx = Math.ceil(h / leftTotalHeight) + 1;

      for (let repeat = startLeftIdx; repeat <= endLeftIdx; repeat++) {
        const base = repeat * leftTotalHeight + leftOffset;
        LEFT_LINES.forEach((line, idx) => {
          const y = base + idx * LINE_HEIGHT;
          if (y >= -LINE_HEIGHT && y <= h + LINE_HEIGHT) {
            drawLine(line, leftX, y);
          }
        });
      }

      // ── 右側 TS 串流 (流向向下微偏置) ──
      const rightWidth = 420;
      const rightX = Math.max(w - rightWidth - 24, w * 0.7);
      rightOffset = (rightOffset + 0.28 * speedMultiplier) % rightTotalHeight;
      const startRightIdx = -Math.ceil(h / rightTotalHeight) - 1;
      const endRightIdx = Math.ceil(h / rightTotalHeight) + 1;

      for (let repeat = startRightIdx; repeat <= endRightIdx; repeat++) {
        const base = repeat * rightTotalHeight + rightOffset;
        RIGHT_LINES.forEach((line, idx) => {
          const y = base + idx * LINE_HEIGHT;
          if (y >= -LINE_HEIGHT && y <= h + LINE_HEIGHT) {
            drawLine(line, rightX, y);
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isDesktop, isLight, speedMultiplier]);

  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-0"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
});

FullStackCodeStreamBackground.displayName = 'FullStackCodeStreamBackground';

export default FullStackCodeStreamBackground;
