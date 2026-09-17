/**
 * ============================================================================
 * 檔案名稱: storageService.ts
 * 所屬模組: Cloud Infrastructure & Storage Service Layer (Firebase 雲端多媒體儲存服務)
 * 責任描述: 負責前臺與 CMS 之多媒體圖片非同步上傳至 Firebase Cloud Storage Bucket，
 *           提供上傳進度監聽、副檔名安全驗證、檔案大小上限防護與永久 HTTPS 存取 URL 解析。
 * 架構分層: Infrastructure & BaaS Service Layer
 * 依賴關係: 依賴 Firebase Storage 實例 (storage) 與 isFirebaseConfigured 配置標誌。
 * 邊界處理: 圖片超過 15MB 阻斷、非圖片格式阻斷、雲端未連線或離線環境降級防禦。
 * ============================================================================
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

/** 支援的多媒體儲存根資料夾 */
export type StorageFolder = 'projects' | 'gallery' | 'about' | 'certifications' | 'avatars' | 'general';

/**
 * 格式化安全檔名（移除非法字元並追加時間戳記與隨機字串防碰撞）
 */
function sanitizeFileName(originalName: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'webp';
  const cleanBase = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanBase}_${Date.now()}_${randomSuffix}.${extension}`;
}

/**
 * 上傳圖片至 Firebase Cloud Storage 並獲取公開下載 URL
 *
 * @param file 圖片檔案物件 (File)
 * @param folder 儲存目標資料夾 (如 'projects', 'gallery', 'about')
 * @param onProgress 上傳進度百分比回調函式 (0 - 100)
 * @returns Promise<string> 永久公開下載網址
 */
export async function uploadPortfolioImage(
  file: File,
  folder: StorageFolder = 'general',
  onProgress?: UploadProgressCallback
): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    console.error('[StorageService]: Firebase Storage is not configured or offline.');
    throw new Error('Firebase Storage 雲端服務未設定或處於離線狀態，無法執行雲端上傳');
  }

  // 1. 安全格式校驗
  if (!file.type.startsWith('image/')) {
    throw new Error('上傳檔案格式不符，僅支援圖片檔案格式 (PNG, JPG, WebP, SVG, GIF)');
  }

  // 2. 檔案大小防禦 (上限 15MB)
  const MAX_SIZE_BYTES = 15 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('圖片大小超出限制 (單一檔案上限為 15MB)，請壓縮後再行上傳');
  }

  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `portfolio_assets/${folder}/${safeFileName}`;
  const storageRef = ref(storage, storagePath);

  // 3. 建立可追蹤進度之非同步上傳任務
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0 && onProgress) {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(percent);
        }
      },
      (error) => {
        console.error('[StorageService]: Upload failed:', error);
        reject(new Error(`圖片上傳至雲端失敗: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) onProgress(100);
          resolve(downloadUrl);
        } catch (err: any) {
          console.error('[StorageService]: Failed to obtain download URL:', err);
          reject(new Error(`取得雲端下載網址失敗: ${err.message}`));
        }
      }
    );
  });
}

/**
 * 依 URL 安全刪除 Firebase Storage 中的圖片（非強制，僅於需要清理舊資源時使用）
 */
export async function deletePortfolioImage(imageUrl: string): Promise<boolean> {
  if (!isFirebaseConfigured || !storage || !imageUrl) {
    return false;
  }

  // 僅處理本專案之 Firebase Storage 網址
  if (!imageUrl.includes('firebasestorage.googleapis.com')) {
    return false;
  }

  try {
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.warn('[StorageService]: Failed to delete cloud image (might be already removed):', error);
    return false;
  }
}
