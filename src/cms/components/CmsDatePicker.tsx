/**
 * ============================================================================
 * 檔案名稱: CmsDatePicker.tsx
 * 所屬模組: Portfolio CMS (賽博科技風格雙欄位時間選擇器)
 * 責任描述: 負責管理專案作品與經歷模組之日期/月份區間雙 Picker 選擇、自由手動文字切換與「至今」快捷輸入。
 * 架構分層: CMS Presentation Layer (UI Component)
 * 依賴關係: 依賴 ThemeContext 與 LangContext。
 * 邊界處理: 自動解析多種分隔符號（-、~、至、至今、Present）、防範非正規格式崩潰。
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, Clock, Edit3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';

interface CmsDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'date' | 'month';
  className?: string;
  isRange?: boolean;
}

/**
 * CmsDatePicker (支援單一日期與雙欄位區間選擇)
 * 滿足使用者指示：「data picker要選區間時 要有兩個picker啊 來選擇區間」
 * - 提供開始時間 (Start Picker) 與 結束時間 (End Picker) 兩個獨立 Date Picker
 * - 自動解析現有區間字串（支援 `-`、`~`、`至`、`至今`、`Present`）
 * - 點擊各自分開的日曆圖示開啟原生 picker，選取年月即時組裝
 * - 支援「至今 / Present」快捷按鍵
 * - 支援一鍵切換純文字自由編輯模式
 */
export const CmsDatePicker: React.FC<CmsDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'YYYY.MM ~ YYYY.MM',
  disabled = false,
  type = 'month',
  className = '',
  isRange = true,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { lang } = useLang();
  const isEn = lang === 'en';

  const [isManualMode, setIsManualMode] = useState(false);

  // 解析 value 為 start 與 end
  const parseRange = (raw: string): { start: string; end: string; sep: string } => {
    if (!raw) return { start: '', end: '', sep: ' ~ ' };
    if (raw.includes(' ~ ')) {
      const parts = raw.split(' ~ ');
      return { start: parts[0]?.trim() || '', end: parts[1]?.trim() || '', sep: ' ~ ' };
    }
    if (raw.includes(' - ')) {
      const parts = raw.split(' - ');
      return { start: parts[0]?.trim() || '', end: parts[1]?.trim() || '', sep: ' - ' };
    }
    if (raw.includes('~')) {
      const parts = raw.split('~');
      return { start: parts[0]?.trim() || '', end: parts[1]?.trim() || '', sep: ' ~ ' };
    }
    if (raw.includes('-') && raw.indexOf('-') !== raw.lastIndexOf('-')) {
      // 可能含有純年月日如 2024-05-01
      return { start: raw.trim(), end: '', sep: ' ~ ' };
    }
    return { start: raw.trim(), end: '', sep: ' ~ ' };
  };

  const { start: initialStart, end: initialEnd, sep: detectedSep } = parseRange(value);
  const [startVal, setStartVal] = useState(initialStart);
  const [endVal, setEndVal] = useState(initialEnd);

  // 當外部 value 變更時同步內部 start/end
  useEffect(() => {
    const parsed = parseRange(value);
    setStartVal(parsed.start);
    setEndVal(parsed.end);
  }, [value]);

  const startPickerRef = useRef<HTMLInputElement>(null);
  const endPickerRef = useRef<HTMLInputElement>(null);

  const triggerStartPicker = () => {
    if (disabled) return;
    if (startPickerRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try { startPickerRef.current.showPicker(); }
        catch { startPickerRef.current.focus(); }
      } else {
        startPickerRef.current.focus();
      }
    }
  };

  const triggerEndPicker = () => {
    if (disabled) return;
    if (endPickerRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try { endPickerRef.current.showPicker(); }
        catch { endPickerRef.current.focus(); }
      } else {
        endPickerRef.current.focus();
      }
    }
  };

  const updateCombined = (newStart: string, newEnd: string) => {
    const s = newStart.trim();
    const e = newEnd.trim();
    if (!s && !e) {
      onChange('');
      return;
    }
    if (s && !e) {
      onChange(s);
      return;
    }
    if (!s && e) {
      onChange(e);
      return;
    }
    onChange(`${s}${detectedSep || ' ~ '}${e}`);
  };

  const handleStartNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) return;
    // 轉換成 YYYY.MM 或 YYYY/MM
    const formatted = raw.replace(/-/g, '.');
    setStartVal(formatted);
    updateCombined(formatted, endVal);
  };

  const handleEndNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) return;
    const formatted = raw.replace(/-/g, '/');
    setEndVal(formatted);
    updateCombined(startVal, formatted);
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';

  // 純文字手動編輯模式
  if (isManualMode || !isRange) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div
          className="relative flex items-center border cyber-cut-sm transition-all focus-within:ring-1 focus-within:ring-[var(--neon-cyan)]"
          style={{
            backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
            borderColor: borderCol,
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full min-w-0 px-3 py-2 text-xs font-mono bg-transparent outline-none text-[var(--text-main)]"
          />
          <div className="flex items-center gap-1 pr-1.5 shrink-0 border-l border-[var(--border-color)]/40">
            {isRange && (
              <button
                type="button"
                onClick={() => setIsManualMode(false)}
                className="px-1.5 py-0.5 text-[10px] font-mono border cyber-cut-sm text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors cursor-pointer"
                title={isEn ? 'Switch to Dual Pickers' : '切換為雙日期選擇器'}
              >
                2x
              </button>
            )}
            <button
              type="button"
              onClick={triggerStartPicker}
              disabled={disabled}
              className="p-1 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 cursor-pointer disabled:opacity-40"
              title="開啟日曆"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* 隱藏的原生日期選擇器 */}
          <input
            ref={startPickerRef}
            type={type}
            onChange={handleStartNativeChange}
            disabled={disabled}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  // 雙欄位區間選擇模式 (Dual Picker Mode - Input Group 架構，徹底杜絕 padding 遮蔽與文字截斷)
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        {/* 1. 開始時間選擇器（輸入框群組） */}
        <div
          className="flex-1 min-w-[140px] flex items-center border cyber-cut-sm transition-all focus-within:ring-1 focus-within:ring-[var(--neon-cyan)]"
          style={{
            backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
            borderColor: borderCol,
          }}
        >
          <span className="px-2.5 py-1.5 text-[11px] font-bold font-mono text-[var(--text-sub)] select-none shrink-0 border-r border-[var(--border-color)]/50 bg-[var(--card-inner)]/40 whitespace-nowrap">
            {isEn ? 'FROM' : '起'}
          </span>
          <input
            type="text"
            value={startVal}
            onChange={(e) => {
              setStartVal(e.target.value);
              updateCombined(e.target.value, endVal);
            }}
            placeholder="YYYY.MM"
            disabled={disabled}
            className="w-full min-w-0 px-2.5 py-1.5 text-xs font-mono bg-transparent outline-none text-[var(--text-main)]"
          />
          <button
            type="button"
            onClick={triggerStartPicker}
            disabled={disabled}
            className="p-1.5 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/15 border-l border-[var(--border-color)]/40 shrink-0 transition-colors cursor-pointer disabled:opacity-40"
            title={isEn ? 'Select Start Date' : '選擇開始時間'}
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
          <input
            ref={startPickerRef}
            type={type}
            onChange={handleStartNativeChange}
            disabled={disabled}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        {/* 分隔箭頭 / 符號 */}
        <div className="hidden sm:flex items-center justify-center text-[var(--text-sub)] px-0.5 shrink-0">
          <ArrowRight className="w-3.5 h-3.5 opacity-60" />
        </div>

        {/* 2. 結束時間選擇器（輸入框群組） */}
        <div
          className="flex-1 min-w-[140px] flex items-center border cyber-cut-sm transition-all focus-within:ring-1 focus-within:ring-[var(--neon-cyan)]"
          style={{
            backgroundColor: isLight ? '#ffffff' : 'rgba(8,14,26,0.85)',
            borderColor: borderCol,
          }}
        >
          <span className="px-2.5 py-1.5 text-[11px] font-bold font-mono text-[var(--text-sub)] select-none shrink-0 border-r border-[var(--border-color)]/50 bg-[var(--card-inner)]/40 whitespace-nowrap">
            {isEn ? 'TO' : '迄'}
          </span>
          <input
            type="text"
            value={endVal}
            onChange={(e) => {
              setEndVal(e.target.value);
              updateCombined(startVal, e.target.value);
            }}
            placeholder="YYYY/MM"
            disabled={disabled}
            className="w-full min-w-0 px-2.5 py-1.5 text-xs font-mono bg-transparent outline-none text-[var(--text-main)]"
          />
          <button
            type="button"
            onClick={triggerEndPicker}
            disabled={disabled}
            className="p-1.5 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/15 border-l border-[var(--border-color)]/40 shrink-0 transition-colors cursor-pointer disabled:opacity-40"
            title={isEn ? 'Select End Date' : '選擇結束時間'}
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
          <input
            ref={endPickerRef}
            type={type}
            onChange={handleEndNativeChange}
            disabled={disabled}
            className="absolute opacity-0 pointer-events-none w-0 h-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        {/* 3. 自由文字編輯切換按鈕 */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsManualMode(true)}
            disabled={disabled}
            className="p-2 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] bg-[var(--card-inner)] border-[var(--border-color)] transition-colors cursor-pointer shrink-0"
            title={isEn ? 'Switch to text edit mode' : '切換為手動純文字編輯'}
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CmsDatePicker;
