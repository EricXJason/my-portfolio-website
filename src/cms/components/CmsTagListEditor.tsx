/**
 * ============================================================================
 * 檔案名稱: CmsTagListEditor.tsx
 * 所屬模組: Portfolio CMS (技術標籤通用新增、拖曳排序與刪除組件)
 * 責任描述: 負責統一 CMS 內所有標籤項目清單之互動，支援晶片標籤新增、拖曳即時排序與單擊刪除。
 * 架構分層: CMS Presentation Layer (Form Control Component)
 * 依賴關係: 依賴 LangContext、ThemeContext 與 Lucide 向量圖示庫。
 * 邊界處理: 標籤重複防護、空白輸入過濾、拖曳狀態防抖與唯讀模式安全鎖定。
 * ============================================================================
 */

import React, { useState, useRef } from 'react';
import { Plus, X, GripVertical, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';

export interface CmsTagListEditorProps {
  label?: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  badgeAccent?: 'cyan' | 'purple' | 'blue' | 'amber';
}

export const CmsTagListEditor: React.FC<CmsTagListEditorProps> = ({
  label,
  tags = [],
  onChange,
  disabled = false,
  placeholder,
  badgeAccent = 'cyan',
}) => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isEn = lang === 'en';
  const isLight = theme === 'light';

  const [inputVal, setInputVal] = useState('');
  const dragItemRef = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed || disabled) return;
    if (tags.includes(trimmed)) {
      setInputVal('');
      return;
    }
    onChange([...tags, trimmed]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (index: number) => {
    if (disabled) return;
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleMove = (fromIdx: number, toIdx: number) => {
    if (disabled || toIdx < 0 || toIdx >= tags.length || fromIdx === toIdx) return;
    const updated = [...tags];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    onChange(updated);
  };

  // 拖放重新排序事件處理函式
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    dragItemRef.current = index;
    setDraggingIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItemRef.current !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = dragItemRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex || disabled) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      dragItemRef.current = null;
      return;
    }
    handleMove(sourceIndex, targetIndex);
    setDraggingIdx(null);
    setDragOverIdx(null);
    dragItemRef.current = null;
  };

  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
    dragItemRef.current = null;
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';

  const getAccentStyle = () => {
    switch (badgeAccent) {
      case 'purple':
        return {
          bg: isLight ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.12)',
          border: isLight ? '#c084fc' : 'rgba(168,85,247,0.4)',
          text: isLight ? '#7c3aed' : '#c084fc',
        };
      case 'blue':
        return {
          bg: isLight ? 'rgba(56,189,248,0.08)' : 'rgba(56,189,248,0.15)',
          border: isLight ? '#38bdf8' : 'rgba(56,189,248,0.5)',
          text: isLight ? '#0284c7' : '#38bdf8',
        };
      case 'amber':
        return {
          bg: isLight ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.12)',
          border: isLight ? '#fcd34d' : 'rgba(245,158,11,0.4)',
          text: isLight ? '#b45309' : '#fbbf24',
        };
      default:
        return {
          bg: isLight ? 'rgba(2,132,199,0.08)' : 'rgba(0,240,255,0.1)',
          border: isLight ? '#38bdf8' : 'rgba(0,240,255,0.35)',
          text: isLight ? '#0369a1' : '#00f0ff',
        };
    }
  };

  const accent = getAccentStyle();

  return (
    <div className="space-y-2.5">
      {/* 標籤名稱 */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
          <span>{label || (isEn ? 'Tags List' : '標籤清單')}</span>
        </label>
      </div>

      {/* 標籤流式容器 */}
      <div
        className="p-3 border cyber-cut-sm bg-[var(--card-inner)] flex flex-wrap items-center gap-2 min-h-[50px] transition-colors"
        style={{ borderColor: borderCol }}
      >
        {tags.map((tag, idx) => {
          const isDragging = draggingIdx === idx;
          const isOver = dragOverIdx === idx;

          return (
            <div
              key={`${tag}-${idx}`}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 border cyber-cut-sm text-xs font-mono select-none transition-all duration-150 ${
                isDragging ? 'opacity-30 scale-95' : ''
              } ${isOver ? 'ring-2 ring-[var(--neon-cyan)] scale-105' : ''} ${
                !disabled ? 'cursor-grab active:cursor-grabbing shadow-xs' : ''
              }`}
              style={{
                backgroundColor: accent.bg,
                borderColor: accent.border,
                color: accent.text,
              }}
              title={isEn ? 'Drag to reorder tag' : '拖曳可調整標籤順序'}
            >
              {/* 懸停拖曳握柄圖示 */}
              {!disabled && (
                <GripVertical className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
              )}

              <span className="font-bold tracking-wide">{tag}</span>

              {/* 左右微調按鈕 (永遠顯示，供快速重排) */}
              {!disabled && tags.length > 1 && (
                <div className="flex items-center gap-0.5 opacity-50 hover:opacity-100 pl-0.5">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, idx - 1)}
                      className="hover:scale-125 cursor-pointer text-current"
                      title={isEn ? 'Move left' : '向左微調'}
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  )}
                  {idx < tags.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, idx + 1)}
                      className="hover:scale-125 cursor-pointer text-current"
                      title={isEn ? 'Move right' : '向右微調'}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* 刪除按鈕 */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-0.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-none transition-colors cursor-pointer shrink-0 ml-0.5"
                  title={isEn ? 'Delete tag' : '刪除標籤'}
                  aria-label={`Delete ${tag}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* 行內快速新增標籤輸入框 */}
        {!disabled && (
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || (isEn ? 'Add new tag...' : '新增標籤...')}
              className="px-2.5 py-1 text-xs border cyber-cut-sm bg-transparent outline-none font-mono text-[var(--text-main)] w-28 sm:w-36 focus:border-[var(--neon-cyan)] transition-all"
              style={{ borderColor: borderCol }}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!inputVal.trim()}
              className="p-1.5 border cyber-cut-sm bg-[var(--neon-cyan)]/15 border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={isEn ? 'Add Tag' : '加入標籤'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CmsTagListEditor;
