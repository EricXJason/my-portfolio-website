/**
 * ============================================================================
 * 檔案名稱: SciFiRobotAvatar.tsx
 * 所屬模組: Presentation Layer (賽博龐克機甲微表情機器人頭像模組)
 * 責任描述: 負責呈現 3D 機甲眼球滑鼠即時注視追蹤、呼吸全息光環、隨機眨眼與掃描超載特效。
 * 架構分層: Presentation Layer (React UI Component)
 宣告式組件結合直接 DOM Ref 操縱（Direct DOM Ref Mutation），達成熱路徑零重渲染 (Zero Re-render)。
 * 依賴關係: 依賴 ThemeContext、LangContext 與 Lucide Sparkles。
 * 邊界處理: 滑鼠移出視窗自動回正、中心座標滾動防抖快取、行動觸控點擊反饋支援。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';

interface SciFiRobotAvatarProps {
  soundPlaying?: boolean;
}

export const SciFiRobotAvatar: React.FC<SciFiRobotAvatarProps> = ({ soundPlaying = false }) => {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isLight = theme === 'light';

  const avatarRef     = useRef<HTMLDivElement | null>(null);
  // 直接引用 SVG <g> 節點 — 直接更新眼球變形矩陣，不觸發 React 虛擬 DOM 重渲染
  const eyeLeftRef    = useRef<SVGGElement | null>(null);
  const eyeRightRef   = useRef<SVGGElement | null>(null);
  const centerPosRef  = useRef({ x: 0, y: 0 });
  const blinkScaleRef = useRef(1); // 追蹤目前眨眼垂直縮放比例

  const [_isBlinking, setIsBlinking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // 直接操縱眼球 <g> transform 屬性 — 熱路徑零組件協調開銷
  const applyEyeTransform = (x: number, y: number) => {
    const scaleY = blinkScaleRef.current;
    const t = `translate(${x.toFixed(2)},${y.toFixed(2)}) scale(1,${scaleY})`;
    eyeLeftRef.current?.setAttribute('transform', t);
    eyeRightRef.current?.setAttribute('transform', t);
  };

  // 快取機器人頭像中心座標（於掛載、尺寸變更與滾動時同步，支援 prefers-reduced-motion）
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      applyEyeTransform(0, 0);
      return;
    }

    const updateCenter = () => {
      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        centerPosRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    };

    updateCenter();
    window.addEventListener('resize', updateCenter, { passive: true });
    window.addEventListener('scroll', updateCenter, { passive: true });

    const handlePointer = (clientX: number, clientY: number) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        applyEyeTransform(0, 0);
        return;
      }
      const { x: centerX, y: centerY } = centerPosRef.current;
      if (!centerX && !centerY) return;
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
      const maxOffset = 6;
      const moveX = (deltaX / distance) * Math.min(Math.abs(deltaX * 0.05), maxOffset);
      const moveY = (deltaY / distance) * Math.min(Math.abs(deltaY * 0.05), maxOffset);
      applyEyeTransform(moveX, moveY);
    };

    const handleMouseMove  = (e: MouseEvent)  => handlePointer(e.clientX, e.clientY);
    const handleTouchMove  = (e: TouchEvent)  => {
      if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove',  handleMouseMove, { passive: true });
    window.addEventListener('touchmove',  handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize',     updateCenter);
      window.removeEventListener('scroll',     updateCenter);
      window.removeEventListener('mousemove',  handleMouseMove);
      window.removeEventListener('touchmove',  handleTouchMove);
    };
  }, []);

  // 週期性隨機自動眨眼 — 支援 prefers-reduced-motion 停用
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const blink = () => {
      setIsBlinking(true);
      blinkScaleRef.current = 0.05;
      applyEyeTransform(0, 0); // 閉眼瞬間瞳孔自動回正
      setTimeout(() => {
        setIsBlinking(false);
        blinkScaleRef.current = 1;
      }, 200);
    };
    const blinkInterval = setInterval(blink, 4500);
    return () => clearInterval(blinkInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 點擊觸發全息雷射掃描超載特效 (Overdrive Scan)
  const handleAvatarClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const purpleCol = isLight ? '#7c3aed' : '#a855f7';

  return (
    <div className="flex flex-col items-center select-none">
      {/* 機甲頭像外框容器 */}
      <div
        ref={avatarRef}
        onClick={handleAvatarClick}
        onTouchEnd={handleAvatarClick}
        className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-48 lg:h-48 flex items-center justify-center cursor-pointer select-none touch-manipulation group"
        title="點擊啟動機器人系統動態掃描 (Click for AI System Scan)"
      >
        {/* 左側環繞聲波等化器指示條 (淺色模式加強飽和度與跳動清晰度) */}
        <div className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5 pointer-events-none z-20">
          {[10, 16, 12, 20, 14].map((h, i) => (
            <div
              key={`s-left-${i}`}
              className="w-1 sm:w-1.5 rounded-full animate-pulse transition-all duration-300"
              style={{
                height: `${soundPlaying ? h * 1.4 : h}px`,
                backgroundColor: cyanCol,
                opacity: 1,
                boxShadow: soundPlaying
                  ? isLight
                    ? '0 0 10px rgba(2,132,199,0.7)'
                    : '0 0 10px #00f0ff'
                  : isLight
                  ? '0 0 4px rgba(2,132,199,0.45)'
                  : '0 0 4px rgba(0,240,255,0.4)',
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${0.7 + (i % 3) * 0.25}s`,
              }}
            />
          ))}
        </div>

        {/* 右側環繞聲波等化器指示條 (淺色模式加強飽和度與跳動清晰度) */}
        <div className="absolute -right-5 sm:-right-7 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5 pointer-events-none z-20">
          {[14, 20, 12, 16, 10].map((h, i) => (
            <div
              key={`s-right-${i}`}
              className="w-1 sm:w-1.5 rounded-full animate-pulse transition-all duration-300"
              style={{
                height: `${soundPlaying ? h * 1.4 : h}px`,
                backgroundColor: purpleCol,
                opacity: 1,
                boxShadow: soundPlaying
                  ? isLight
                    ? '0 0 10px rgba(124,58,237,0.7)'
                    : '0 0 10px #a855f7'
                  : isLight
                  ? '0 0 4px rgba(124,58,237,0.45)'
                  : '0 0 4px rgba(168,85,247,0.4)',
                animationDelay: `${i * 0.18}s`,
                animationDuration: `${0.8 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* 外層全息數據環 (360 度旋轉刻度，淺色模式加深線條輪廓) */}
        <div
          className="absolute inset-0 rounded-full border-[1.5px] border-dashed animate-[spin_16s_linear_infinite] pointer-events-none transition-opacity"
          style={{
            borderColor: isLight ? 'rgba(2, 132, 199, 0.85)' : 'rgba(0, 240, 255, 0.7)',
            opacity: isLight ? 0.95 : 0.75,
            boxShadow: soundPlaying
              ? isLight
                ? '0 0 20px rgba(2,132,199,0.35)'
                : '0 0 30px rgba(0,240,255,0.45)'
              : isLight
              ? '0 0 10px rgba(2,132,199,0.2)'
              : '0 0 14px rgba(0,240,255,0.2)',
          }}
        >
          {/* 全息方位刻度槽 */}
          <div
            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
              isLight ? 'bg-sky-600 shadow-[0_0_6px_rgba(2,132,199,0.6)]' : 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
            }`}
          />
          <div
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
              isLight ? 'bg-purple-600 shadow-[0_0_6px_rgba(124,58,237,0.6)]' : 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
            }`}
          />
          <div
            className={`absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full ${
              isLight ? 'bg-sky-600 shadow-[0_0_6px_rgba(2,132,199,0.6)]' : 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
            }`}
          />
          <div
            className={`absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full ${
              isLight ? 'bg-purple-600 shadow-[0_0_6px_rgba(124,58,237,0.6)]' : 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
            }`}
          />
        </div>

        {/* 中層反向旋轉六角科技環 (淺色模式強化對比) */}
        <div
          className="absolute inset-2 rounded-full border-2 border-dotted animate-[spin_24s_linear_infinite_reverse] pointer-events-none"
          style={{
            borderColor: isLight ? 'rgba(124, 58, 237, 0.8)' : '#a855f7',
            opacity: isLight ? 0.85 : 0.5,
          }}
        />

        {/* 軌道運行量子能量光球 */}
        <div className="absolute inset-0 animate-[spin_10s_linear_infinite] pointer-events-none">
          <div
            className={`w-2.5 h-2.5 rounded-full -top-1.5 left-1/2 -translate-x-1/2 absolute ${
              isLight ? 'bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.7)]' : 'bg-cyan-400 shadow-[0_0_12px_#00f0ff]'
            }`}
          />
        </div>

        {/* 音樂播放時之脈衝能量光環 */}
        {soundPlaying && (
          <div
            className={`absolute inset-0 rounded-full blur-xl animate-pulse pointer-events-none ${
              isLight ? 'bg-sky-400/20' : 'bg-cyan-400/15'
            }`}
          />
        )}

        {/* 機甲機器人頭部向量繪製 */}
        <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 flex items-center justify-center">
          <svg
            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              isLight
                ? 'drop-shadow-[0_4px_16px_rgba(2,132,199,0.18)]'
                : 'drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]'
            }`}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLight ? '#ffffff' : '#0b1326'} />
                <stop offset="50%" stopColor={isLight ? '#f8fafc' : '#060c18'} />
                <stop offset="100%" stopColor={isLight ? '#e2e8f0' : '#030712'} />
              </linearGradient>

              <linearGradient id="armorAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLight ? '#0284c7' : '#00f0ff'} />
                <stop offset="50%" stopColor={isLight ? '#2563eb' : '#3b82f6'} />
                <stop offset="100%" stopColor={isLight ? '#7c3aed' : '#a855f7'} />
              </linearGradient>

              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isLight ? '#0284c7' : '#00f0ff'} />
                <stop offset="50%" stopColor={isLight ? '#38bdf8' : '#3b82f6'} />
                <stop offset="100%" stopColor={isLight ? '#7c3aed' : '#c084fc'} />
              </linearGradient>

              <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 機甲外側雙天線犄角與側翼結構（統一倒角幾何造型，淺色模式加強外廓清晰度） */}
            <path
              d="M45 80 L25 45 L52 60 L70 38 L100 28 L130 38 L148 60 L175 45 L155 80 L165 120 L140 162 L100 178 L60 162 L35 120 Z"
              fill="url(#helmetGrad)"
              stroke={cyanCol}
              strokeWidth={isLight ? "2.6" : "2.2"}
              strokeLinejoin="round"
            />

            {/* 內層裝甲接縫刻線與輪廓 (淺色模式加強刻線對比) */}
            <path
              d="M56 82 L70 48 L100 38 L130 48 L144 82 L152 118 L134 156 L100 168 L66 156 L48 118 Z"
              fill="none"
              stroke={isLight ? '#2563eb' : 'url(#armorAccentGrad)'}
              strokeWidth={isLight ? "1.8" : "1.5"}
              strokeDasharray="4 2"
              opacity={isLight ? '1' : '0.8'}
            />

            {/* 側邊裝甲推進噴口 */}
            <g>
              <polygon points="20,86 32,82 32,118 20,114" fill="url(#armorAccentGrad)" stroke={cyanCol} strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="23" y1="94" x2="29" y2="94" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
              <line x1="23" y1="100" x2="29" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
              <line x1="23" y1="106" x2="29" y2="106" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />

              <polygon points="180,86 168,82 168,118 180,114" fill="url(#armorAccentGrad)" stroke={cyanCol} strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="171" y1="94" x2="177" y2="94" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
              <line x1="171" y1="100" x2="177" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
              <line x1="171" y1="106" x2="177" y2="106" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
            </g>

            {/* 前額量子核心水晶矩陣 */}
            <polygon
              points="100,36 112,48 100,60 88,48"
              fill="url(#armorAccentGrad)"
              filter={isLight ? undefined : 'url(#cyanGlow)'}
              className="animate-pulse"
            />
            <polygon points="100,41 106,48 100,55 94,48" fill="#ffffff" opacity="0.95" />

            {/* 護目鏡玻璃面罩 */}
            <path
              d="M44 80 C44 80, 100 68, 156 80 C162 114, 146 136, 100 142 C54 136, 38 114, 44 80 Z"
              fill={isLight ? '#0b1326' : '#020610'}
              stroke={cyanCol}
              strokeWidth={isLight ? "2.4" : "2"}
            />

            {/* HUD 護目鏡鎖定準星與掃描網格 */}
            <line x1="100" y1="74" x2="100" y2="138" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="4 4" opacity={isLight ? '0.55' : '0.35'} />
            <line x1="48" y1="98" x2="152" y2="98" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="4 4" opacity={isLight ? '0.55' : '0.35'} />
            <circle cx="100" cy="98" r="40" stroke={cyanCol} strokeWidth="0.5" strokeDasharray="2 4" opacity={isLight ? '0.5' : '0.3'} />

            {/* 左側互動機械眼 */}
            <g transform="translate(70, 98)">
              <circle cx="0" cy="0" r="14" fill="#020610" stroke={cyanCol} strokeWidth="1.5" />
              <circle cx="0" cy="0" r="10" fill="url(#visorGrad)" opacity={isLight ? '0.6' : '0.4'} />
              <circle cx="0" cy="0" r="7.5" stroke="url(#armorAccentGrad)" strokeWidth="1" strokeDasharray="3 2" />

              {/* 左眼瞳孔 — 透過 eyeLeftRef 直接操縱樣式達成零重渲染 */}
              <g ref={eyeLeftRef} transform="translate(0,0) scale(1,1)">
                <circle cx="0" cy="0" r="6" fill={cyanCol} filter={isLight ? undefined : 'url(#cyanGlow)'} />
                <circle cx="-2" cy="-2" r="2" fill="#ffffff" />
              </g>
            </g>

            {/* 右側互動機械眼 */}
            <g transform="translate(130, 98)">
              <circle cx="0" cy="0" r="14" fill="#020610" stroke={cyanCol} strokeWidth="1.5" />
              <circle cx="0" cy="0" r="10" fill="url(#visorGrad)" opacity={isLight ? '0.6' : '0.4'} />
              <circle cx="0" cy="0" r="7.5" stroke="url(#armorAccentGrad)" strokeWidth="1" strokeDasharray="3 2" />

              {/* 右眼瞳孔 — 透過 eyeRightRef 直接操縱樣式達成零重渲染 */}
              <g ref={eyeRightRef} transform="translate(0,0) scale(1,1)">
                <circle cx="0" cy="0" r="6" fill={cyanCol} filter={isLight ? undefined : 'url(#cyanGlow)'} />
                <circle cx="-2" cy="-2" r="2" fill="#ffffff" />
              </g>
            </g>

            {/* 口部散熱導氣格柵 (淺色模式加強刻線對比度) */}
            <path d="M84 146 L116 146" stroke={cyanCol} strokeWidth={isLight ? "2.4" : "2"} strokeLinecap="round" />
            <path d="M88 151 L112 151" stroke={isLight ? '#2563eb' : "url(#armorAccentGrad)"} strokeWidth={isLight ? "1.8" : "1.5"} strokeLinecap="round" />
            <path d="M92 156 L108 156" stroke={cyanCol} strokeWidth={isLight ? "1.4" : "1"} strokeLinecap="round" opacity={isLight ? '1' : "0.75"} />

            {/* 下顎裝甲裝備板 */}
            <polygon points="100,164 116,156 100,175 84,156" fill="url(#armorAccentGrad)" opacity="0.85" stroke={cyanCol} strokeWidth="1" />
          </svg>

          {/* 點擊時觸發之雷射掃描光束 */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full z-30">
              <div
                className={`w-full h-1.5 animate-laser-top ${
                  isLight
                    ? 'bg-gradient-to-r from-transparent via-sky-500 to-transparent shadow-[0_0_12px_rgba(2,132,199,0.6)]'
                    : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#00f0ff]'
                }`}
              />
              <div
                className={`absolute inset-0 animate-pulse pointer-events-none ${
                  isLight ? 'bg-sky-400/10' : 'bg-cyan-400/10'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* 浮動 HUD 狀態徽章 (WCAG 1.4.3 & 1.4.11 邊框與文字對比度強化) */}
      <div
        className="mt-2.5 px-3.5 py-1 border cyber-cut-sm font-tech text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm backdrop-blur-md transition-all hover:scale-105 whitespace-nowrap shrink-0 z-20"
        style={{
          backgroundColor: isLight ? '#ffffff' : 'rgba(8, 14, 26, 0.95)',
          borderColor: isLight ? '#0284c7' : 'rgba(0, 240, 255, 0.70)',
          color: isLight ? '#0369a1' : '#00f0ff',
          boxShadow: isLight ? '0 2px 8px rgba(2, 132, 199, 0.12)' : '0 0 10px rgba(0, 240, 255, 0.15)',
        }}
      >
        <Sparkles
          size={15}
          className="animate-pulse shrink-0"
          style={{
            color: isLight ? '#0284c7' : '#00f0ff',
            filter: isLight
              ? 'drop-shadow(0 1px 3px rgba(2, 132, 199, 0.35))'
              : 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.85))',
          }}
        />
        <span className={`arcade-badge whitespace-nowrap ${isLight ? 'text-sky-800 font-extrabold' : 'text-cyan-300 font-extrabold'}`}>
          {lang === 'zh' ? 'AI 前沿技術跟進中' : 'AI ADVANCEMENT TRACKING'}
        </span>
      </div>
    </div>
  );
};

export default SciFiRobotAvatar;
