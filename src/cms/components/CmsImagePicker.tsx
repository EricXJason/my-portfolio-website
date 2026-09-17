/**
 * ============================================================================
 * 檔案名稱: CmsImagePicker.tsx
 * 所屬模組: Portfolio CMS (圖片上傳、即時預覽與清除通用組件)
 * 責任描述: 負責提供直覺流暢之本機圖片檔案非同步上傳至 Firebase Cloud Storage、
 *           即時 16:9 比例縮圖預覽、手動 URL 輸入切換與安全清除確認對話框。
 * 架構分層: CMS Presentation Layer (Form Control Component)
 * 依賴關係: 依賴 LangContext、ThemeContext、CmsConfirmDialog、storageService 與 Lucide 圖示。
 * 邊界處理: 支援進度百分比動畫、非圖片檔案阻斷、上傳錯誤回退提示與安全清除二次確認。
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import {
  CmsConfirmDialog,
  CmsConfirmDialogState,
  EMPTY_DIALOG,
} from './CmsConfirmDialog';
import {
  uploadPortfolioImage,
  type StorageFolder,
} from '../../services/storageService';

export interface CmsImagePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  previewHeight?: string;
  presetGroupFilter?: string;
  folder?: StorageFolder;
}

export const CmsImagePicker: React.FC<CmsImagePickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  aspectRatio = '16:9',
  previewHeight: _previewHeight = 'h-32',
  folder = 'general',
}) => {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isEn = lang === 'en';
  const isLight = theme === 'light';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewError, setPreviewError] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 當外部 value 變更時重設狀態
  useEffect(() => {
    setPreviewError(false);
    setUploadError(null);
  }, [value]);

  /**
   * 處理本機檔案選取並直接上傳至 Firebase Cloud Storage
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(isEn ? 'Please select a valid image file.' : '請選擇有效的圖片檔案格式。');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      const downloadUrl = await uploadPortfolioImage(file, folder, (progress) => {
        setUploadProgress(progress);
      });

      onChange(downloadUrl);
      setUploadProgress(100);
    } catch (err: any) {
      console.error('[CmsImagePicker]: Upload failed:', err);
      setUploadError(err.message || (isEn ? 'Upload failed' : '上傳失敗'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 觸發選擇本機檔案
  const triggerFileInput = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  // 觸發清除圖片確認 Dialog
  const triggerClearDialog = () => {
    if (disabled || isUploading) return;
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
    <div className="space-y-2.5 select-text">
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
        disabled={disabled || isUploading}
      />

      {/* 頂部標題與操作按鈕 */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs font-bold font-['Noto_Sans_TC'] text-[var(--text-main)] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {/* 上傳圖片至 Firebase Storage 按鈕（只允許直接上傳雲端） */}
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={triggerFileInput}
            className={`px-3 py-1.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              disabled || isUploading
                ? 'opacity-40 cursor-not-allowed'
                : 'bg-[var(--neon-cyan)]/15 hover:bg-[var(--neon-cyan)]/25 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/40 hover:scale-105 active:scale-95 shadow-xs'
            }`}
            title={isEn ? 'Upload to Firebase Cloud Storage' : '上傳圖片至 Firebase 雲端儲存空間'}
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--neon-cyan)]" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>
              {isUploading
                ? `${uploadProgress}%`
                : isEn
                ? 'Upload Cloud'
                : '上傳至雲端'}
            </span>
          </button>

          {/* 清除圖片按鈕 */}
          {value && !disabled && !isUploading && (
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

      {/* 上傳中霓虹進度條提示 */}
      {isUploading && (
        <div className="p-3 border cyber-cut-sm border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--neon-cyan)]">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isEn ? 'Uploading to Firebase Storage...' : '正在上傳至 Firebase 雲端空間...'}</span>
            </span>
            <span className="font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-none overflow-hidden">
            <div
              className="h-full bg-[var(--neon-cyan)] transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 上傳錯誤提示 */}
      {uploadError && (
        <div className="p-2.5 border cyber-cut-sm border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-['Noto_Sans_TC'] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* 即時視覺預覽區 (依 aspectRatio 支援 1:1 或 16:9，點擊可直接上傳) */}
      <div
        onClick={triggerFileInput}
        className={`relative border cyber-cut-sm overflow-hidden flex items-center justify-center transition-all group ${
          aspectRatio === '1:1' ? 'w-full max-w-[280px] aspect-square mx-auto' : 'w-full aspect-[16/9]'
        } ${
          disabled || isUploading ? 'cursor-default' : 'cursor-pointer hover:border-[var(--neon-cyan)]/70'
        }`}
        style={{
          borderColor: borderCol,
          backgroundColor: isLight ? '#f1f5f9' : '#030712',
        }}
        title={disabled || isUploading ? undefined : (isEn ? 'Click to upload image' : '點擊可直接上傳圖片')}
      >
        {value && !previewError ? (
          <>
            <img
              src={value}
              alt={label}
              onError={() => setPreviewError(true)}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {!disabled && !isUploading && (
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
                {isEn ? 'Click here or button above to upload to cloud' : '點擊此處或上方按鈕上傳至雲端'}
              </p>
            </div>
          </div>
        )}

        {/* 預覽浮動狀態徽章 */}
        <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none">
          {value && !previewError && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 border cyber-cut-sm bg-black/70 text-emerald-400 border-emerald-500/30 backdrop-blur-sm flex items-center gap-1">
              {value.includes('firebasestorage') ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Cloud Storage</span>
                </>
              ) : (
                <span>{aspectRatio === '1:1' ? '1:1' : '16:9'}</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CmsImagePicker;
