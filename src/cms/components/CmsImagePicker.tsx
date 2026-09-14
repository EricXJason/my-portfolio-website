/**
 * ============================================================================
 * 檔案名稱: CmsImagePicker.tsx
 * 所屬模組: Portfolio CMS (圖片上傳、即時預覽與清除通用組件)
 * 責任描述: 負責提供單一簡潔的本機圖片檔案上傳、即時 16:9 縮圖預覽與安全清除確認功能。
 * 架構分層: CMS Presentation Layer (Form Control Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、CmsConfirmDialog 與 Lucide 向量圖示庫。
 * 邊界處理: 支援 FileReader Base64 檔案讀取、圖片載入失敗退回佔位、唯讀模式鎖定與清除確認 Dialog。
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, X, Eye } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';

export interface CmsImagePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  previewHeight?: string;
  presetGroupFilter?: string;
}

export const CmsImagePicker: React.FC<CmsImagePickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  aspectRatio: _aspectRatio = '16:9',
  previewHeight: _previewHeight = 'h-32',
}) => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isEn = lang === 'en';
  const isLight = theme === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewError, setPreviewError] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  // 當 value 變更時重設錯誤狀態
  useEffect(() => {
    setPreviewError(false);
  }, [value]);

  /**
   * TODO: [後端端點對接] 上傳圖片檔案至雲端儲存空間 (Cloud Storage / S3 / Firebase)
   * 1. HTTP Method: POST
   * 2. 預期端點: /api/v1/assets/upload
   * 3. 請求載荷 (Request Body): Multipart/form-data (file: File)
   * 4. 預期回應:
   *    - 201 Created: { success: true, url: string }
   *    - 413 Payload Too Large: 檔案大小超過上限
   * 5. 當前狀態: 暫以本地 FileReader 轉為 Base64 Data URL 儲存，待雲端存儲服務就緒後替換為 apiClient.post()。
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isEn ? 'Please select a valid image file.' : '請選擇有效的圖片檔案。');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);

    // 重置 input 讓同檔名也能重複觸發
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 觸發選擇本機檔案
  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  // 觸發清除圖片確認 Dialog
  const triggerClearDialog = () => {
    if (disabled) return;
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      title: isEn ? 'Confirm Clear Image' : '確認清除圖片',
      message: isEn
        ? 'Are you sure you want to remove this image? It will be cleared from this field.'
        : '確定要清除當前欄位的圖片嗎？此操作將移除該圖片設定。',
      confirmText: isEn ? 'Clear Image' : '確定清除',
      cancelText: isEn ? 'Cancel' : '取消',
      onConfirm: () => {
        onChange('');
      },
    });
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.3)';

  return (
    <div className="space-y-2.5">
      {/* 確認對話框 */}
      <CmsConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 隱藏的原生檔案上傳輸入框 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      {/* 頂部標題與操作按鈕 */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {/* 單一上傳圖片按鈕 */}
          <button
            type="button"
            disabled={disabled}
            onClick={triggerFileInput}
            className={`px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              disabled
                ? 'opacity-40 cursor-not-allowed'
                : 'bg-[var(--neon-cyan)]/15 hover:bg-[var(--neon-cyan)]/25 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 hover:scale-105 active:scale-95'
            }`}
            title={isEn ? 'Upload Image file from device' : '從本機選擇並上傳圖片'}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isEn ? 'Upload Image' : '上傳圖片'}</span>
          </button>

          {/* 清除圖片按鈕 */}
          {value && !disabled && (
            <button
              type="button"
              onClick={triggerClearDialog}
              className="p-1.5 border cyber-cut-sm bg-[var(--card-inner)] border-[var(--border-color)] text-[var(--text-sub)] hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10 cursor-pointer transition-colors"
              title={isEn ? 'Clear Image' : '清除圖片'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 即時視覺預覽區 (16:9 比例且絕不裁切，點擊可直接上傳) */}
      <div
        onClick={triggerFileInput}
        className={`relative w-full aspect-[16/9] border cyber-cut-sm overflow-hidden flex items-center justify-center transition-all group ${
          disabled ? 'cursor-default' : 'cursor-pointer hover:border-[var(--neon-cyan)]/70'
        }`}
        style={{
          borderColor: borderCol,
          backgroundColor: isLight ? '#f1f5f9' : '#030712',
        }}
        title={disabled ? undefined : (isEn ? 'Click to upload image' : '點擊可直接上傳圖片')}
      >
        {value && !previewError ? (
          <>
            <img
              src={value}
              alt={label}
              onError={() => setPreviewError(true)}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200">
                <Upload className="w-6 h-6 text-[var(--neon-cyan)] animate-bounce" />
                <span className="text-xs font-['Noto_Sans_TC'] font-bold text-white tracking-wide">
                  {isEn ? 'Click to replace image' : '點擊上傳圖片取代'}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 select-none">
            <div className="w-12 h-12 border cyber-cut-sm border-[var(--border-color)] bg-[var(--card-inner)] flex items-center justify-center text-[var(--text-sub)]/50 group-hover:border-[var(--neon-cyan)] group-hover:text-[var(--neon-cyan)] transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-['Noto_Sans_TC'] font-bold text-[var(--text-main)]">
                {isEn ? 'No image configured' : '尚未設定圖片'}
              </p>
              <p className="text-[11px] text-[var(--text-sub)]">
                {isEn ? 'Click here to upload an image' : '點擊此處上傳圖片'}
              </p>
            </div>
          </div>
        )}

        {/* 預覽浮動狀態徽章 */}
        <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none">
          {value && !previewError && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm bg-black/70 text-emerald-400 border-emerald-500/30 backdrop-blur-sm flex items-center gap-1">
              <Eye className="w-2.5 h-2.5" />
              16:9
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CmsImagePicker;
