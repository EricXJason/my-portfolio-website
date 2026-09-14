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

import React, { useState, useEffect } from 'react';
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
}

interface CmsHeroEditorProps {
  isPreview?: boolean;
}

export const CmsHeroEditor: React.FC<CmsHeroEditorProps> = ({ isPreview = false }) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { setIsDirty } = useCmsDirty();

  useEffect(() => {
    return () => setIsDirty(false);
  }, [setIsDirty]);

  const [formData, setFormData] = useState<HeroSectionFullData>(defaultHeroData as HeroSectionFullData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dialog, setDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

  /**
   * TODO: [後端端點對接] 儲存首頁英雄看板個人簡介與聯絡資訊
   * 1. HTTP Method: PUT
   * 2. 預期端點: /api/v1/hero
   * 3. 請求載荷 (Request Body):
   *    - Header: Authorization: Bearer <JWT_ACCESS_TOKEN>
   *    - Body: HeroSectionFullData
   * 4. 預期回應:
   *    - 200 OK: { success: true, message: "首頁英雄看板更新成功" }
   *    - 401 Unauthorized: 憑證無效
   * 5. 當前狀態: 暫時採用本地狀態模擬更新，待後端 API 上線後切換為 apiClient.put()。
   */
  const triggerSaveDialog = () => {
    setDialog({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Confirm Save' : '確認存檔',
      message: isEn
        ? 'Are you sure you want to save the changes for the "Home" module?'
        : '確定要儲存「首頁」模組目前的修改內容嗎？',
      confirmText: isEn ? 'Save' : '確定存檔',
      onConfirm: () => {
        setIsDirty(false);
        showToast(isEn ? '"Home" module saved successfully!' : '「首頁」模組資料已成功存檔！');
      },
    });
  };

  const triggerResetDialog = () => {
    setDialog({
      isOpen: true,
      type: 'reset',
      title: isEn ? 'Confirm Module Reset' : '確認還原此模組預設',
      message: isEn
        ? 'Are you sure you want to reset the "Home" module to default? This will only reset this module and will not affect others.'
        : '確定要將「首頁」模組還原為初始預設值嗎？此操作僅會重置首頁模組的內容，不會影響其他模組。',
      confirmText: isEn ? 'Reset This Module' : '確定還原此模組',
      onConfirm: () => {
        setIsDirty(false);
        setFormData(defaultHeroData as HeroSectionFullData);
        showToast(isEn ? '"Home" module restored to defaults!' : '「首頁」模組已還原為初始預設資料！');
      },
    });
  };

  const currentContent = formData[lang];

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
          {isEn ? 'Home' : '首頁'}
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
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <LinkIcon className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
            {isEn ? 'External Links' : '外部網站連結'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* GitHub 個人主頁連結 */}
          <CmsUrlInput
            label={isEn ? 'GitHub Link' : 'GitHub 連結'}
            value={formData.links.github}
            onChange={(val) => handleLinkChange('github', val)}
            placeholder="https://github.com/..."
            disabled={isPreview}
            isEn={isEn}
            icon={<TechIcon name="github" size={13} className="shrink-0 fill-current" />}
          />

          {/* ArtStation 藝術作品集連結 */}
          <CmsUrlInput
            label={isEn ? 'ArtStation Link' : 'ArtStation 連結'}
            value={formData.links.artstation}
            onChange={(val) => handleLinkChange('artstation', val)}
            placeholder="https://www.artstation.com/..."
            disabled={isPreview}
            isEn={isEn}
            icon={<TechIcon name="artstation" size={13} className="shrink-0 fill-current" />}
          />
        </div>
      </div>

      {/* ── 第三表單分區：聯絡資訊（固定於最下方與前臺版面完全一致）── */}
      <div className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 backdrop-blur-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <Phone className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h2 className="text-base font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
            {isEn ? 'Contact Information' : '聯絡資訊'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 聯絡電話 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-sub)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
              <Phone className="w-3 h-3 text-[var(--neon-cyan)]" />
              {isEn ? 'Phone Number' : '電話號碼'}
            </label>
            <input
              type="text"
              value={formData.contacts.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder=""
              className="w-full px-3.5 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-xs text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono']"
            />
          </div>

          {/* 聯絡電子郵件 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-sub)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
              <Mail className="w-3 h-3 text-purple-400" />
              Email
            </label>
            <input
              type="email"
              value={formData.contacts.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              placeholder=""
              className="w-full px-3.5 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-xs text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono']"
            />
          </div>

          {/* LINE 快速聯絡連結 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-sub)] flex items-center gap-1.5 font-['Noto_Sans_TC']">
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              LINE
            </label>
            <input
              type="text"
              value={formData.contacts.line}
              onChange={(e) => handleContactChange('line', e.target.value)}
              placeholder=""
              className="w-full px-3.5 py-2.5 border cyber-cut-sm bg-[var(--card-inner)] text-xs text-[var(--text-main)] border-[var(--border-color)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Share_Tech_Mono']"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
