/**
 * ============================================================================
 * 檔案名稱: CmsSiteSettingsEditor.tsx
 * 所屬模組: Portfolio CMS (網站全域設定管理模組)
 * 責任描述: 負責管理 HTML 網站標題、前臺導覽列雙層品牌標題、背景代碼流動畫速度與核心模組導覽名稱自訂。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、CmsDirtyContext 與 CmsConfirmDialog。
 * 邊界處理: 支援預覽模式唯讀鎖定、動畫速度 0.0x~3.0x 數值鉗位、未儲存二次確認彈窗防護。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  Globe,
  PanelTop,
  Type,
  AlignLeft,
  Gauge,
  Zap,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import defaultSiteSettings from '../../data/site-settings.json';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export interface NavNames {
  nav_home: string;
  nav_about: string;
  nav_skills: string;
  nav_projects: string;
  nav_awards: string;
  nav_experience: string;
  nav_gallery: string;
}

export interface SiteSettingsContent {
  htmlTitle: string;
  headerTop: string;
  headerBottom: string;
  navNames?: NavNames;
}

export interface SiteSettingsFullData {
  codeAnimationSpeed: number;
  zh: SiteSettingsContent;
  en: SiteSettingsContent;
}

// 程式碼串流動畫微型即時預覽組件（雙副本無縫循環架構，杜絕到底卡頓跳動）
const MiniCodeStreamPreview: React.FC<{ speed: number; isLight: boolean; isEn: boolean }> = ({
  speed,
  isLight,
  isEn,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockARef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const tick = () => {
      const container = containerRef.current;
      const blockA = blockARef.current;
      if (container && blockA) {
        const loopHeight = blockA.offsetHeight;
        if (loopHeight > 0) {
          offsetRef.current += speedRef.current * 0.25;
          if (offsetRef.current >= loopHeight) {
            offsetRef.current = offsetRef.current % loopHeight;
          }
          container.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const lines = [
    '<!-- [HTML-01/04] public/index.html — 核心入口 -->',
    '<!DOCTYPE html>',
    '<html lang="zh-Hant" class="dark">',
    '<title>許哲誠 (HSU, CHE-CHENG) | 作品集</title>',
    '<meta name="description" content="國立臺灣藝術大學多媒體動畫藝術學系碩士" />',
    '// [TS-01/04] src/components/FullStackCodeStreamBackground.tsx',
    'const leftSpeed = (0.28 * ' + speed.toFixed(1) + ').toFixed(2) + " px/frame";',
    'const rightSpeed = (0.22 * ' + speed.toFixed(1) + ').toFixed(2) + " px/frame";',
    'const left  = useSeamlessScroll(0.28 * ' + speed.toFixed(1) + ', 0);',
    'const right = useSeamlessScroll(0.22 * ' + speed.toFixed(1) + ', 320);',
    '// [TS-02/04] src/utils/bgmSynth.ts — 賽博氛圍合成器',
    'export const runMatrix = () => stream.start();',
    'window.requestAnimationFrame(seamlessLoop);',
    '<!-- [HTML-02/04] src/components/Navbar.tsx — 科技抬頭導覽列 -->',
    '<header id="tactical-hud-nav" class="fixed top-0">',
    '<nav class="max-w-7xl mx-auto px-6 h-16 flex">',
  ];

  return (
    <div className="relative h-28 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-inner)] p-3 font-mono text-xs select-none">
      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-[var(--card-bg)] border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] z-10 backdrop-blur-md shadow-xs">
        {speed === 0
          ? (isEn ? 'PAUSED' : '已靜止暫停')
          : `${speed.toFixed(1)}x ${isEn ? 'LIVE' : '即時模擬'}`}
      </div>
      <div ref={containerRef} style={{ willChange: 'transform' }}>
        {/* 區塊 A — 測量高度基準 */}
        <div ref={blockARef} className="space-y-1.5 opacity-80 pb-1.5">
          {lines.map((line, i) => (
            <div key={`a-${i}`} className="truncate" style={{ color: isLight ? '#0284c7' : '#00f0ff' }}>
              <span className="text-[var(--text-sub)]/50 mr-2">{String(i + 1).padStart(2, '0')}</span>
              {line}
            </div>
          ))}
        </div>
        {/* 區塊 B — 無縫循環副本，保證視覺連續性 */}
        <div aria-hidden="true" className="space-y-1.5 opacity-80 pb-1.5">
          {lines.map((line, i) => (
            <div key={`b-${i}`} className="truncate" style={{ color: isLight ? '#0284c7' : '#00f0ff' }}>
              <span className="text-[var(--text-sub)]/50 mr-2">{String(i + 1).padStart(2, '0')}</span>
              {line}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[var(--card-inner)] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[var(--card-inner)] to-transparent pointer-events-none" />
    </div>
  );
};

interface CmsSiteSettingsEditorProps {
  isPreview?: boolean;
}

export const CmsSiteSettingsEditor: React.FC<CmsSiteSettingsEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [formData, setFormData] = useState<SiteSettingsFullData>(() => {
    if (data.site_settings) {
      return data.site_settings as unknown as SiteSettingsFullData;
    }
    try {
      const saved = localStorage.getItem('portfolio_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          codeAnimationSpeed:
            typeof parsed.codeAnimationSpeed === 'number'
              ? parsed.codeAnimationSpeed
              : ((defaultSiteSettings as unknown as SiteSettingsFullData).codeAnimationSpeed ?? 1.0),
          zh: parsed.zh || defaultSiteSettings.zh,
          en: parsed.en || defaultSiteSettings.en,
        };
      }
    } catch {
      // 解析失敗回退至預設設定
    }
    return defaultSiteSettings as unknown as SiteSettingsFullData;
  });

  useEffect(() => {
    if (data.site_settings) {
      setFormData(data.site_settings as unknown as SiteSettingsFullData);
    }
  }, [data.site_settings]);

  // 聆聽廣播存檔事件
  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('site_settings', formData);
        } catch (e) {
          console.error('[CMS SiteSettings] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [formData, isPreview, updateDocument]);

  // 本地全域即時同步效應：開關或欄位變更時即時同步至本地 Context 與快照，前臺立即反應
  const isFirstSettingsSync = useRef(true);
  useEffect(() => {
    if (isFirstSettingsSync.current) {
      isFirstSettingsSync.current = false;
      return;
    }
    updateDocument('site_settings', formData, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_site_settings_data', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_site_settings_data_updated'));
    } catch {}
  }, [formData, updateDocument]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (field: keyof SiteSettingsContent, value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleSpeedChange = (speedVal: number) => {
    setIsDirty(true);
    const clamped = Math.max(0, Math.min(3.0, Math.round(speedVal * 10) / 10));
    setFormData((prev) => ({
      ...prev,
      codeAnimationSpeed: clamped,
    }));
  };

  const doSave = async () => {
    setIsDirty(false);
    try {
      localStorage.setItem('portfolio_site_settings', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_site_settings_updated'));
      await updateDocument('site_settings', formData);
      showToast(isEn ? '"Site Settings" module saved to cloud successfully!' : '「網站設定」模組資料已成功存檔至雲端！');
    } catch {
      showToast(isEn ? 'Failed to save to cloud' : '存檔至雲端失敗');
    }
  };

  const doReset = async () => {
    setIsDirty(false);
    const resetData = defaultSiteSettings as unknown as SiteSettingsFullData;
    try {
      localStorage.removeItem('portfolio_site_settings');
      window.dispatchEvent(new Event('portfolio_site_settings_updated'));
      setFormData(resetData);
      await updateDocument('site_settings', resetData);
      showToast(isEn ? '"Site Settings" module restored to defaults!' : '「網站設定」模組已還原為初始預設資料！');
    } catch {
      showToast(isEn ? 'Restored locally' : '已重設本地資料');
    }
  };

  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Are you sure you want to save the changes for the "Site Settings" module?'
        : '確定要儲存「網站設定」模組目前的修改內容嗎？',
      confirmText: isEn ? 'Save' : '確定存檔',
      onConfirm: doSave,
    });
  };

  const triggerResetDialog = () => {
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? 'Are you sure you want to reset the "Site Settings" module to default? This will only reset this module and will not affect others.'
        : '確定要將「網站設定」模組還原為初始預設值嗎？此操作僅會重置網站設定模組的內容，不會影響其他模組。',
      confirmText: isEn ? 'Reset This Module' : '確定還原此模組',
      onConfirm: doReset,
    });
  };

  const currentContent = formData[lang];
  const currentSpeed = formData.codeAnimationSpeed ?? 1.0;

  const speedPresets = [
    { value: 0, labelZh: '0x 靜止', labelEn: '0x Paused' },
    { value: 0.5, labelZh: '0.5x 慢速', labelEn: '0.5x Slow' },
    { value: 1.0, labelZh: '1.0x 標準（前臺預設）', labelEn: '1.0x Standard (Default)' },
    { value: 1.5, labelZh: '1.5x 快速', labelEn: '1.5x Fast' },
    { value: 2.0, labelZh: '2.0x 極速', labelEn: '2.0x Max' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 border cyber-cut-sm bg-emerald-500/10 border-emerald-500/40 text-emerald-400 text-xs font-['Noto_Sans_TC'] shadow-lg backdrop-blur-xl animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 二次確認對話框 */}
      <CmsConfirmDialog dialog={dialog} onClose={() => setDialog(EMPTY_DIALOG)} isEn={isEn} />

      {/* 頂部工具列：純淨標題與操作按鈕 */}
      <div className="flex items-center justify-between p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-md">
        <h1 className="text-xl sm:text-2xl font-black font-['Orbitron',sans-serif] tracking-wide text-[var(--text-main)]">
          {isEn ? 'Site Settings' : '網站設定'}
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={isPreview ? undefined : triggerResetDialog}
            disabled={isPreview}
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : (isEn ? 'Restore defaults for this module only' : '僅還原此模組預設值')}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Restore Defaults' : '還原預設'}</span>
          </button>

          <button
            type="button"
            onClick={isPreview ? undefined : triggerSaveDialog}
            disabled={isPreview}
            title={isPreview ? (isEn ? 'Preview mode — read only' : '預覽模式 — 唯讀') : undefined}
            className={`px-5 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-[var(--neon-cyan)] text-[var(--neon-cyan-fg)] flex items-center gap-1.5 transition-all ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--neon-cyan)]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? 'Save Changes' : '存檔'}</span>
          </button>
        </div>
      </div>

      {/* ── 第一分區：網頁標題設定 ── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <Globe className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
            {isEn ? 'Page Title Settings' : '網頁標題設定'}
          </h2>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
            {isEn ? 'Website Title' : '網站標題'}
          </label>
          <input
            type="text"
            value={currentContent.htmlTitle}
            onChange={(e) => handleFieldChange('htmlTitle', e.target.value)}
            placeholder=""
            className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-['Noto_Sans_TC']"
          />
        </div>
      </div>

      {/* ── 第二分區：導覽列標題設定 ── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <PanelTop className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
            {isEn ? 'Navbar Title Settings' : '導覽列標題設定'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 導覽列標題上方 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              {isEn ? 'Navbar Top Title' : '導覽列標題上方'}
            </label>
            <input
              type="text"
              value={currentContent.headerTop}
              onChange={(e) => handleFieldChange('headerTop', e.target.value)}
              placeholder=""
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-mono"
            />
          </div>

          {/* 導覽列標題下方 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
              {isEn ? 'Navbar Bottom Title' : '導覽列標題下方'}
            </label>
            <input
              type="text"
              value={currentContent.headerBottom}
              onChange={(e) => handleFieldChange('headerBottom', e.target.value)}
              placeholder=""
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-sm text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-['Noto_Sans_TC']"
            />
          </div>
        </div>
      </div>

      {/* ── 第三分區：背景動畫速度設定 ── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[var(--neon-cyan)]" />
            <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'Background Code Animation Settings' : '背景代碼動畫設定'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)]">
              {isEn ? 'Current Speed:' : '目前流速：'}
            </span>
            <span className="font-mono text-xs font-bold px-2.5 py-1 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              {currentSpeed.toFixed(1)}x
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* 動畫速度滑桿控制器 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {isEn ? 'Animation Speed Multiplier' : '背景代碼動畫速度'}
              </label>
              <span className="text-[11px] font-mono text-[var(--text-sub)]">
                0.0x ~ 3.0x
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.1"
                value={currentSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-[var(--card-inner)] appearance-none cursor-pointer accent-[var(--neon-cyan)] border border-[var(--border-color)] focus:outline-none"
              />
            </div>

            {/* 預設速度模式快速按鈕組 */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-['Noto_Sans_TC'] text-[var(--text-sub)] mr-1">
                {isEn ? 'Quick Presets:' : '快速檔位：'}
              </span>
              {speedPresets.map((preset) => {
                const isActive = Math.abs(currentSpeed - preset.value) < 0.05;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleSpeedChange(preset.value)}
                    className={`px-3 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--neon-cyan)]/15 border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]/70'
                    }`}
                  >
                    {isEn ? preset.labelEn : preset.labelZh}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 即時迷你動畫預覽視窗 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                {isEn ? 'Live Animation Speed Preview' : '即時流速預覽效果'}
              </label>
              <span className="text-[10px] font-['Noto_Sans_TC'] text-[var(--text-sub)]">
                {isEn ? 'Real-time simulated scroll speed' : '實時模擬前臺背景代碼滾動節奏'}
              </span>
            </div>
            <MiniCodeStreamPreview speed={currentSpeed} isLight={isLight} isEn={isEn} />
          </div>
        </div>
      </div>
    </div>
  );
};
