/**
 * ============================================================================
 * 檔案名稱: assetPath.ts
 * 所屬模組: Asset Management System (靜態資產路徑解析模組)
 * 責任描述: 安全地將 Vite 的部署 BASE_URL 附加至公開靜態資產路徑，確保於根目錄與子目錄部署時皆能正確加載資材。
 * 架構分層: Utility Layer (共用工具層)
 * 依賴關係: 依賴 Vite 環境變數 `import.meta.env.BASE_URL`。
 * 邊界處理: 自動判斷並保留外部 HTTP/HTTPS/data: 絕對網址，防止重複斜線拼接。
 * ============================================================================
 */

// 安全為靜態資產路徑拼接 Vite BASE_URL 的共用輔助函式
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  // 外部絕對網址或 Base64 Data URI 直接返回
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base: string = import.meta.env.BASE_URL || './';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (base === './' || base === '') {
    return `./${cleanPath}`;
  }
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};
