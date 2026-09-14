/**
 * ============================================================================
 * 檔案名稱: SeoSchema.tsx
 * 所屬模組: Infrastructure / SEO Layer (JSON-LD 結構化資料注入模組)
 * 責任描述: 負責將個人作品集之 JSON-LD Schema 動態注入至 HTML document.head，供搜尋引擎與 AI 爬蟲檢索。
 * 架構分層: Infrastructure / SEO Layer (Head Injection)
 宣告式副作用組件 (Effect-only Component)。
 * 依賴關係: 依賴 seo-schema.json 結構化資料。
 * 邊界處理: 確保全域僅單一 script 節點、組件卸載時自動清理防止記憶體洩漏。
 * ============================================================================
 */

import React, { useEffect } from 'react';
import seoData from '../data/seo-schema.json';

export const SeoSchema: React.FC = () => {
  useEffect(() => {
    const scriptId = 'seo-jsonld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(seoData, null, 2);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default SeoSchema;
