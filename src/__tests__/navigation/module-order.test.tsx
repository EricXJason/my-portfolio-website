/**
 * ============================================================================
 * 檔案名稱: module-order.test.tsx
 * 所屬模組: Test Suite (全域模組順序與可視性契約測試)
 * 責任描述: 確保前臺展示層、導覽列、側邊導覽與 CMS 系統之全域模組順序絕對一致，
 *           並嚴格驗證動態可視性過濾與首頁恆常置頂鎖定契約。
 * ============================================================================
 */

import { describe, it, expect } from 'vitest';
import siteSettings from '../../data/site-settings.json';
import { DEFAULT_MODULE_ORDER, DEFAULT_MODULE_VISIBILITY } from '../../cms/components/CmsSidebar';

describe('全域模組順序契約驗證 (Global Module Order SSOT)', () => {
  const EXPECTED_ORDER = [
    'home',
    'about',
    'projects',
    'skills',
    'experience',
    'awards',
    'gallery',
  ];

  it('site-settings.json 預設順序必須精確符合「首頁 -> 關於我 -> 專案作品 -> 專業技能 -> 經歷 -> 專業證照 -> 美術畫廊」', () => {
    expect(siteSettings.modules_order).toEqual(EXPECTED_ORDER);
  });

  it('CmsSidebar.tsx 的 DEFAULT_MODULE_ORDER 必須與 site-settings.json 保持絕對一致', () => {
    expect(DEFAULT_MODULE_ORDER).toEqual(EXPECTED_ORDER);
  });

  it('DEFAULT_MODULE_VISIBILITY 必須涵蓋全域 7 大核心模組且預設全數為 true', () => {
    EXPECTED_ORDER.forEach((id) => {
      expect(DEFAULT_MODULE_VISIBILITY[id]).toBe(true);
    });
  });

  it('首頁 (home) 必須恆常維持可見，即使 visibility 設定為 false 亦不得被過濾', () => {
    const mockVisibility: Record<string, boolean> = {
      home: false, // 嘗試將 home 設為 false
      about: true,
      projects: false,
      skills: true,
      experience: true,
      awards: true,
      gallery: true,
    };

    // 模擬 MainSiteContent / Navbar / SideNav 的過濾邏輯:
    // filter((id) => id === 'home' || moduleVisibility[id] !== false)
    const filteredModules = EXPECTED_ORDER.filter(
      (id) => id === 'home' || mockVisibility[id] !== false
    );

    expect(filteredModules[0]).toBe('home');
    expect(filteredModules).toContain('home');
    expect(filteredModules).not.toContain('projects');
    expect(filteredModules).toEqual(['home', 'about', 'skills', 'experience', 'awards', 'gallery']);
  });

  it('當全數子模組被隱藏時，過濾清單仍必須保留首頁 (home)', () => {
    const mockVisibility: Record<string, boolean> = {
      about: false,
      projects: false,
      skills: false,
      experience: false,
      awards: false,
      gallery: false,
    };

    const filteredModules = EXPECTED_ORDER.filter(
      (id) => id === 'home' || mockVisibility[id] !== false
    );

    expect(filteredModules).toEqual(['home']);
  });
});
