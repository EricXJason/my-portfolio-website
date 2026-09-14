/**
 * ============================================================================
 * 檔案名稱: SectionTitleEditor.tsx
 * 所屬模組: Portfolio CMS (各模組雙語標題與引言編輯面板)
 * 責任描述: 負責提供各 CMS 模組統一之雙語區塊主標題與引言說明輸入面板，與前臺導覽列雙向對齊。
 * 架構分層: CMS Presentation Layer (UI Component)
 * 依賴關係: 依賴 LangContext 與 Lucide 向量圖示庫。
 * 邊界處理: 支援預覽模式唯讀鎖定、語言模式嚴格切換隔離、純淨專業標籤無括號贅字。
 * ============================================================================
 */

import React from 'react';
import { Type, AlignLeft } from 'lucide-react';
import { useLang } from '../../context/LangContext';

export interface SectionTitleEditorProps {
  /** 區塊識別標籤名稱（例如 'Skills'、'專業技能'） */
  sectionLabel: string;
  /** 當前繁體中文標題 */
  zhValue: string;
  /** 當前英文標題 */
  enValue: string;
  /** 繁體中文標題變更回呼函式 */
  onZhChange: (val: string) => void;
  /** 英文標題變更回呼函式 */
  onEnChange: (val: string) => void;
  /** 選填繁體中文副標題/引言 */
  zhSubtitleValue?: string;
  /** 選填英文副標題/引言 */
  enSubtitleValue?: string;
  /** 選填繁體中文副標題變更回呼函式 */
  onZhSubtitleChange?: (val: string) => void;
  /** 選填英文副標題變更回呼函式 */
  onEnSubtitleChange?: (val: string) => void;
  /** 於唯讀預覽模式下停用輸入編輯 */
  isPreview?: boolean;
}

/**
 * 可重複使用之雙語區塊標題編輯面板組件。
 * 渲染方正俐落的賽博科技卡片，提供繁中/英文標題與選填副標題輸入框。
 * 供 CMS 各個編輯模組自訂前臺作品集對應章節所呈現之主副標題。
 */
export const SectionTitleEditor: React.FC<SectionTitleEditorProps> = ({
  sectionLabel,
  zhValue,
  enValue,
  onZhChange,
  onEnChange,
  zhSubtitleValue,
  enSubtitleValue,
  onZhSubtitleChange,
  onEnSubtitleChange,
  isPreview = false,
}) => {
  const { lang } = useLang();
  const isEn = lang === 'en';

  const renderCharCountBadge = (currLen: number, maxLen: number) => {
    const isOver = currLen > maxLen;
    return (
      <span
        className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm font-bold shrink-0"
        style={{
          backgroundColor: isOver ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.08)',
          borderColor: isOver ? '#f87171' : 'var(--border-color)',
          color: isOver ? '#f87171' : 'var(--text-sub)',
        }}
      >
        {currLen} / {maxLen}
      </span>
    );
  };

  return (
    <div
      className="border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-bg)] p-5 sm:p-6 backdrop-blur-xl space-y-4 shadow-sm"
      style={{
        borderColor: 'rgba(0, 240, 255, 0.35)',
        background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(0, 240, 255, 0.03) 100%)',
      }}
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
        <Type className="w-4 h-4 text-[var(--neon-cyan)]" />
        <h2 className="text-sm font-bold font-['Noto_Sans_TC'] text-[var(--text-main)]">
          {isEn ? `Section Title Settings — ${sectionLabel}` : `區塊主標題設定 — ${sectionLabel}`}
        </h2>
        <span
          className="ml-auto text-[10px] font-['Share_Tech_Mono'] px-2 py-0.5 border cyber-cut-sm"
          style={{
            color: 'var(--neon-cyan)',
            borderColor: 'rgba(0, 240, 255, 0.35)',
            backgroundColor: 'rgba(0, 240, 255, 0.08)',
          }}
        >
          {isEn ? 'FRONT-END HEADING' : '前臺展現標題'}
        </span>
      </div>

      {/* 主標題輸入欄位 (依中英文語系物理隔離) */}
      <div className="space-y-4">
        {!isEn ? (
          /* Chinese Title Mode */
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-sub)] font-['Noto_Sans_TC'] flex items-center gap-1.5">
                <span>區塊主標題</span>
              </label>
              {renderCharCountBadge((zhValue || '').length, 50)}
            </div>
            <input
              type="text"
              value={zhValue}
              onChange={(e) => onZhChange(e.target.value)}
              disabled={isPreview}
              placeholder="請輸入區塊主標題..."
              className={`w-full px-3.5 py-2.5 text-xs border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] font-bold transition-colors ${
                isPreview ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        ) : (
          /* English Title Mode */
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-sub)] font-['Noto_Sans_TC'] flex items-center gap-1.5">
                <span>Section Main Title</span>
              </label>
              {renderCharCountBadge((enValue || '').length, 50)}
            </div>
            <input
              type="text"
              value={enValue}
              onChange={(e) => onEnChange(e.target.value)}
              disabled={isPreview}
              placeholder="Enter section main title..."
              className={`w-full px-3.5 py-2.5 text-xs border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] focus:border-purple-400 focus:outline-none font-['Share_Tech_Mono'] font-bold transition-colors ${
                isPreview ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        )}

        {/* 選填副標題/引言輸入欄位 (依語系隔離) */}
        {!isEn && onZhSubtitleChange && (
          <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[var(--text-sub)] font-['Noto_Sans_TC'] flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                <span>區塊引言 / 簡介說明</span>
              </label>
              {renderCharCountBadge((zhSubtitleValue || '').length, 150)}
            </div>
            <textarea
              rows={2}
              value={zhSubtitleValue || ''}
              onChange={(e) => onZhSubtitleChange(e.target.value)}
              disabled={isPreview}
              placeholder="請輸入區塊引言說明..."
              className="w-full px-3.5 py-2 text-xs border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] focus:border-[var(--neon-cyan)] focus:outline-none font-['Noto_Sans_TC'] resize-none leading-relaxed"
            />
          </div>
        )}

        {isEn && onEnSubtitleChange && (
          <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[var(--text-sub)] font-['Noto_Sans_TC'] flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
                <span>Section Intro / Subtitle</span>
              </label>
              {renderCharCountBadge((enSubtitleValue || '').length, 150)}
            </div>
            <textarea
              rows={2}
              value={enSubtitleValue || ''}
              onChange={(e) => onEnSubtitleChange(e.target.value)}
              disabled={isPreview}
              placeholder="Enter section intro description..."
              className="w-full px-3.5 py-2 text-xs border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-inner)] text-[var(--text-main)] focus:border-purple-400 focus:outline-none font-['Noto_Sans_TC'] resize-none leading-relaxed"
            />
          </div>
        )}
      </div>

      <p className="text-[10px] text-[var(--text-sub)]/60 font-['Share_Tech_Mono']">
        {isEn
          ? 'These bilingual titles directly reflect on your live portfolio navigation and section headers.'
          : '此處設定的雙語主標題與引言將即時反映在前臺作品集的錨點導覽與區塊頂端。'}
      </p>
    </div>
  );
};

export default SectionTitleEditor;
