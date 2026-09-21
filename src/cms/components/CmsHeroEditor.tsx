/**
 * ============================================================================
 * 檔案名稱: CmsHeroEditor.tsx
 * 所屬模組: Portfolio CMS (首頁看板管理模組)
 * 責任描述: 負責管理首頁 Hero 區塊次要標籤、主要職稱、核心自介引言、聯絡方式與外部社群連結。
 * 架構分層: CMS Presentation Layer (Editor Component)
 * 依賴關係: 依賴 LangContext、CmsDirtyContext、TechIcon 與 CmsConfirmDialog。
 * 邊界處理: 支援預覽模式唯讀鎖定、雙語資料即時切換與未儲存二次確認彈窗防護。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  User,
  Cpu,
  FileText,
  Link as LinkIcon,
  Eye,
  EyeOff,
  BookmarkCheck,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useCmsDirty } from '../context/CmsDirtyContext';
import defaultHeroData from '../../data/hero-section.json';
import { TechIcon } from '../../components/icons/TechIcon';
import { CmsUrlInput } from './CmsUrlInput';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import { usePortfolioData } from '../../context/PortfolioDataContext';

interface HeroBilingualContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

interface HeroContacts {
  phone: string;
  email: string;
  line: string;
}

interface HeroLinks {
  github: string;
  artstation: string;
}

export interface HeroSectionFullData {
  links: HeroLinks;
  contacts: HeroContacts;
  zh: HeroBilingualContent;
  en: HeroBilingualContent;
  showGithub?: boolean;
  showArtstation?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showLine?: boolean;
}

interface CmsHeroEditorProps {
  isPreview?: boolean;
}

export const CmsHeroEditor: React.FC<CmsHeroEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();
  const { data, updateDocument } = usePortfolioData();

  const [formData, setFormData] = useState<HeroSectionFullData>(
    (data.hero as HeroSectionFullData) || (defaultHeroData as HeroSectionFullData)
  );

  useEffect(() => {
    if (data.hero) {
      setFormData(data.hero as HeroSectionFullData);
    }
  }, [data.hero]);

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  // 聆聽廣播存檔事件（例如未儲存變更離開時）
  useEffect(() => {
    const handleTriggerSave = async () => {
      if (!isPreview) {
        try {
          await updateDocument('hero', formData);
        } catch (e) {
          console.error('[CMS Hero] Trigger save error:', e);
        }
      }
    };
    window.addEventListener('portfolio_cms_trigger_save', handleTriggerSave);
    return () => window.removeEventListener('portfolio_cms_trigger_save', handleTriggerSave);
  }, [formData, isPreview, updateDocument]);

  // 聆聽全域一鍵還原預設值事件
  useEffect(() => {
    const handleResetAll = () => {
      setFormData(defaultHeroData as unknown as HeroSectionFullData);
      setIsDirty(false);
    };
    window.addEventListener('portfolio_cms_reset_all', handleResetAll);
    return () => window.removeEventListener('portfolio_cms_reset_all', handleResetAll);
  }, [setIsDirty]);

  // 本地全域即時同步效應：開關或欄位變更時即時同步至本地 Context 與快照，前臺立即反應
  const isFirstHeroSync = useRef(true);
  useEffect(() => {
    if (isFirstHeroSync.current) {
      isFirstHeroSync.current = false;
      return;
    }
    updateDocument('hero', formData, true).catch(() => {});
    try {
      localStorage.setItem('portfolio_hero_data', JSON.stringify(formData));
      window.dispatchEvent(new Event('portfolio_hero_data_updated'));
    } catch {}
  }, [formData, updateDocument]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  };

  const handleFieldChange = (
    field: 'badge' | 'title' | 'subtitle' | 'description',
    value: string
  ) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: 'phone' | 'email' | 'line', value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [field]: value,
      },
    }));
  };

  const handleLinkChange = (field: 'github' | 'artstation', value: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        [field]: value,
      },
    }));
  };

  const handleToggleSwitch = (
    field: 'showGithub' | 'showArtstation' | 'showPhone' | 'showEmail' | 'showLine',
    checked: boolean
  ) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Are you sure you want to save the changes for the "Home" module to cloud and local cache?'
        : '確定要將「首頁」模組目前的修改內容儲存至雲端資料庫嗎？',
      confirmText: isEn ? 'Save' : '確定存檔',
      onConfirm: async () => {
        setIsDirty(false);
        try {
          await updateDocument('hero', formData);
          showToast(isEn ? '"Home" module saved to cloud successfully!' : '「首頁」模組資料已成功存檔至雲端！');
        } catch (err) {
          console.error(err);
          showToast(isEn ? 'Failed to save to cloud' : '存檔失敗，請檢查網路連線');
        }
      },
    });
  };

  /** handleSetDefault — 將當前首頁資料設為預設值基準 */
  const handleSetDefault = () => {
    try {
      localStorage.setItem('portfolio_hero_baseline', JSON.stringify(formData));
      showToast(isEn ? 'Current home data set as module default!' : '當前「首頁」內容已設為預設值！');
    } catch {
      showToast(isEn ? 'Failed to set default' : '設定預設值失敗');
    }
  };

  const triggerResetDialog = () => {
    const baselineRaw = localStorage.getItem('portfolio_hero_baseline');
    const isBaseline = !!baselineRaw;
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? (isBaseline ? 'Reset home module to the pinned default state?' : 'Are you sure you want to reset the "Home" module to default?')
        : (isBaseline ? '確定要將「首頁」還原至設定的預設值嗎？' : '確定要將「首頁」模組還原為初始預設值嗎？此操作僅會重置首頁模組的內容，不會影響其他模組。'),
      confirmText: isEn ? 'Restore Defaults' : '確定還原預設',
      onConfirm: async () => {
        setIsDirty(false);
        const resetData = baselineRaw ? (JSON.parse(baselineRaw) as HeroSectionFullData) : (defaultHeroData as HeroSectionFullData);
        setFormData(resetData);
        try {
          await updateDocument('hero', resetData);
          showToast(isEn ? (isBaseline ? 'Restored to module defaults!' : '"Home" restored to initial defaults!') : (isBaseline ? '已還原至設定的預設值！' : '「首頁」模組已還原為初始預設資料！'));
        } catch (err) {
          console.error(err);
          showToast(isEn ? 'Restored locally' : '已重設本地資料');
        }
      },
    });
  };

  const currentContent = formData[lang];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 浮動提示訊息通知 - 嚴格方形直角科技風格，避開右下角 BackToTop 浮動按鈕 */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-24 right-6 sm:right-8 z-[10000] flex items-center gap-2.5 px-4 py-2.5 border cyber-cut-sm rounded-none bg-[var(--card-bg)]/95 border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.35)] font-['Noto_Sans_TC'] text-xs sm:text-sm backdrop-blur-xl animate-fade-in pointer-events-none">
          <Check className="w-4 h-4 text-[var(--neon-cyan)] shrink-0" />
          <span className="tracking-wide font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 二次確認對話框 */}
      <CmsConfirmDialog dialog={dialog} onClose={() => setDialog(EMPTY_DIALOG)} isEn={isEn} />

      {/* 頂部工具列：純淨標題與操作按鈕 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-md">
        <h1 className="text-xl sm:text-2xl font-black font-['Orbitron',sans-serif] tracking-wide text-[var(--text-main)] whitespace-nowrap">
          {isEn ? 'Home' : '首頁'}
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            onClick={isPreview ? undefined : handleSetDefault}
            disabled={isPreview}
            title={isEn ? 'Pin current home data as module default' : '將當前首頁內容設為預設值'}
            className={`px-4 py-2 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold bg-[var(--card-inner)] text-[var(--text-sub)] border-[var(--border-color)] flex items-center gap-1.5 transition-colors ${
              isPreview ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 cursor-pointer'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Set as Default' : '設為預設值'}</span>
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

      {/* ── 第一表單分區：主要核心內容 ── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <FileText className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
            {isEn ? 'Main Content' : '主要內容'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 第一欄位：次要特色標籤 */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isEn ? 'Secondary Badge' : '次要標籤'}
            </label>
            <input
              type="text"
              value={currentContent.badge}
              onChange={(e) => handleFieldChange('badge', e.target.value)}
              placeholder=""
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-sm text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-['Noto_Sans_TC']"
            />
          </div>

          {/* 第二欄位：姓名與主要標題 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
              {isEn ? 'Name / Main Title' : '姓名 / 主標題'}
            </label>
            <input
              type="text"
              value={currentContent.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder=""
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-sm text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-['Noto_Sans_TC']"
            />
          </div>

          {/* 第三欄位：核心專業職稱標籤 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>{isEn ? 'Primary Role / Subtitle' : '主要標籤'}</span>
              </label>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                style={{
                  backgroundColor: (currentContent.subtitle || '').length > 60 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                  borderColor: (currentContent.subtitle || '').length > 60 ? '#f87171' : 'var(--border-color)',
                  color: (currentContent.subtitle || '').length > 60 ? '#f87171' : 'var(--text-sub)',
                }}
              >
                {(currentContent.subtitle || '').length} / 60
              </span>
            </div>
            <input
              type="text"
              value={currentContent.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              placeholder=""
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-sm text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-['Noto_Sans_TC']"
            />
          </div>

          {/* 第四欄位：首頁自我介紹敘述 */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEn ? 'Hero Description' : '首頁敘述'}</span>
              </label>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
                style={{
                  backgroundColor: (currentContent.description || '').length > 120 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
                  borderColor: (currentContent.description || '').length > 120 ? '#f87171' : 'var(--border-color)',
                  color: (currentContent.description || '').length > 120 ? '#f87171' : 'var(--text-sub)',
                }}
              >
                {(currentContent.description || '').length} / 120
              </span>
            </div>
            <textarea
              rows={3}
              value={currentContent.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder=""
              className="w-full px-4 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-sm text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none transition-all font-['Noto_Sans_TC'] leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── 第二表單分區：外部網站與社群連結 ── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-[var(--neon-cyan)]" />
            <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'External Links & Buttons' : '外部網站與社群按鈕'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* GitHub 個人主頁連結與開關 */}
          <div className="p-4 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TechIcon name="github" size={15} className="shrink-0 fill-current" />
                <span className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'GitHub Profile Button' : 'GitHub 專頁按鈕'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showGithub !== false}
                  onChange={(e) => handleToggleSwitch('showGithub', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--neon-cyan)]"></div>
              </label>
            </div>
            <CmsUrlInput
              value={formData.links.github}
              onChange={(val) => handleLinkChange('github', val)}
              placeholder="https://github.com/..."
              disabled={isPreview || formData.showGithub === false}
              isEn={isEn}
              icon={<TechIcon name="github" size={13} className="shrink-0 fill-current" />}
            />
          </div>

          {/* ArtStation 藝術作品集連結與開關 */}
          <div className="p-4 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TechIcon name="artstation" size={15} className="shrink-0 fill-current" />
                <span className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
                  {isEn ? 'ArtStation Portfolio Button' : 'ArtStation 作品集按鈕'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showArtstation !== false}
                  onChange={(e) => handleToggleSwitch('showArtstation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--neon-cyan)]"></div>
              </label>
            </div>
            <CmsUrlInput
              value={formData.links.artstation}
              onChange={(val) => handleLinkChange('artstation', val)}
              placeholder="https://www.artstation.com/..."
              disabled={isPreview || formData.showArtstation === false}
              isEn={isEn}
              icon={<TechIcon name="artstation" size={13} className="shrink-0 fill-current" />}
            />
          </div>
        </div>
      </div>

      {/* ── 第三表單分區：聯絡資訊（固定於最下方與前臺版面完全一致）── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--neon-cyan)]" />
            <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
              {isEn ? 'Contact Information Fields' : '聯絡資訊卡片欄位'}
            </h2>
          </div>
          <span className="text-[10px] text-[var(--text-sub)]">
            {isEn ? 'Each contact card can be toggled on/off' : '三組通訊欄位皆可自由開關顯示'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 聯絡電話與開關 */}
          <div className="p-3.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
                <Phone className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                {isEn ? 'Phone' : '聯絡電話'}
              </label>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showPhone !== false}
                  disabled={isPreview}
                  onChange={(e) => handleToggleSwitch('showPhone', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--neon-cyan)]"></div>
              </label>
            </div>
            <input
              type="text"
              value={formData.contacts.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder=""
              disabled={isPreview || formData.showPhone === false}
              className="w-full px-3 py-2 border cyber-cut-sm bg-slate-950/60 text-xs text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono'] disabled:opacity-40"
            />
          </div>

          {/* 聯絡電子郵件與開關 */}
          <div className="p-3.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                Email
              </label>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showEmail !== false}
                  disabled={isPreview}
                  onChange={(e) => handleToggleSwitch('showEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--neon-cyan)]"></div>
              </label>
            </div>
            <input
              type="email"
              value={formData.contacts.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              placeholder=""
              disabled={isPreview || formData.showEmail === false}
              className="w-full px-3 py-2 border cyber-cut-sm bg-slate-950/60 text-xs text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono'] disabled:opacity-40"
            />
          </div>

          {/* LINE 快速聯絡連結與開關 */}
          <div className="p-3.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                LINE ID
              </label>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.showLine !== false}
                  disabled={isPreview}
                  onChange={(e) => handleToggleSwitch('showLine', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[var(--neon-cyan)]"></div>
              </label>
            </div>
            <input
              type="text"
              value={formData.contacts.line}
              onChange={(e) => handleContactChange('line', e.target.value)}
              placeholder=""
              disabled={isPreview || formData.showLine === false}
              className="w-full px-3 py-2 border cyber-cut-sm bg-slate-950/60 text-xs text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono'] disabled:opacity-40"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
