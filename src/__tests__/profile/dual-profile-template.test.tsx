/**
 * ============================================================================
 * 檔案名稱: dual-profile-template.test.tsx
 * 所屬模組: 雙履歷模板中樞單元測試 (Dual Profile Template Tests)
 * 責任描述: 驗證雙模板架構：
 * 1. ProfileContext 集合映射 (portfolio_fullstack_dev vs portfolio_interactive_app_dev)
 * 2. Fallbacks 優先順位差異 (Fullstack vs Interactive)
 * 3. 性能優化條目 (Unity Profiler / Addressables) 獨立拆分驗收
 * 4. 前臺零硬編碼純資料驅動原則
 * ============================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  COLLECTION_MAP,
  CACHE_PREFIX_MAP,
} from '../../context/ProfileContext';
import {
  FULLSTACK_FALLBACKS,
  INTERACTIVE_FALLBACKS,
  getFallbacksByProfile,
  getCollectionName,
} from '../../services/portfolioDataService';

describe('雙履歷模板中樞單元測試 (Dual Profile Template System)', () => {
  describe('一、Firestore 集合與快取前綴映射契約', () => {
    it('fullstack 模式必須嚴格對應 portfolio_fullstack_dev 集合', () => {
      expect(COLLECTION_MAP.fullstack).toBe('portfolio_fullstack_dev');
      expect(CACHE_PREFIX_MAP.fullstack).toBe('portfolio_fullstack_dev');
      expect(getCollectionName('fullstack')).toBe('portfolio_fullstack_dev');
    });

    it('interactive 模式必須嚴格對應 portfolio_interactive_app_dev 集合', () => {
      expect(COLLECTION_MAP.interactive).toBe('portfolio_interactive_app_dev');
      expect(CACHE_PREFIX_MAP.interactive).toBe('portfolio_interactive_app_dev');
      expect(getCollectionName('interactive')).toBe('portfolio_interactive_app_dev');
    });
  });

  describe('二、雙模板優先順位 (Priority Hierarchy) 驗收', () => {
    it('Fullstack 模板之 Hero subtitle 必須為全端開發／互動應用開發 (Fullstack Dev / Interactive App Dev)', () => {
      const fb = getFallbacksByProfile('fullstack');
      expect(fb.hero.zh.subtitle).toBe('全端開發／互動應用開發');
      expect(fb.hero.en.subtitle).toBe('Fullstack Dev / Interactive App Dev');
    });

    it('Interactive 模板之 Hero subtitle 必須為互動應用開發／全端開發 (Interactive App Dev / Fullstack Dev)', () => {
      const fb = getFallbacksByProfile('interactive');
      expect(fb.hero.zh.subtitle).toBe('互動應用開發／全端開發');
      expect(fb.hero.en.subtitle).toBe('Interactive App Dev / Fullstack Dev');
    });

    it('Fullstack 模板之技能順位：全端開發必須位於第一順位', () => {
      const fb = FULLSTACK_FALLBACKS;
      expect(fb.skills.zh[0].catType).toBe('fullstack');
      expect(fb.skills.zh[0].category).toBe('全端開發');
      expect(fb.skills.en[0].catType).toBe('fullstack');
    });

    it('Interactive 模板之技能順位：互動應用開發必須位於第一順位', () => {
      const fb = INTERACTIVE_FALLBACKS;
      expect(fb.skills.zh[0].catType).toBe('game');
      expect(fb.skills.zh[0].category).toBe('互動應用開發');
      expect(fb.skills.en[0].catType).toBe('game');
      expect(fb.skills.en[0].category).toBe('Interactive App Dev');
    });
  });

  describe('三、性能優化 Unity Profiler / Addressables 條目驗收', () => {
    it('互動應用開發分類中必須具備獨立的性能優化條目 (中文)', () => {
      const zhSkills = FULLSTACK_FALLBACKS.skills.zh.find((c: any) => c.catType === 'game');
      expect(zhSkills).toBeDefined();

      const perfItem = zhSkills?.items.find((item: any) => item.label === '性能優化');
      expect(perfItem).toBeDefined();
      expect(perfItem?.content).toContain('Unity Profiler');
      expect(perfItem?.content).toContain('Addressables');

      // 核心技術中不重複出現 Addressables
      const coreItem = zhSkills?.items.find((item: any) => item.label === '核心技術');
      expect(coreItem?.content).not.toContain('Addressables');
    });

    it('Interactive App Dev 分類中必須具備獨立的 Performance Optimization 條目 (英文)', () => {
      const enSkills = FULLSTACK_FALLBACKS.skills.en.find((c: any) => c.catType === 'game');
      expect(enSkills).toBeDefined();

      const perfItem = enSkills?.items.find((item: any) => item.label === 'Performance Optimization');
      expect(perfItem).toBeDefined();
      expect(perfItem?.content).toContain('Unity Profiler');
      expect(perfItem?.content).toContain('Addressables');

      const coreItem = enSkills?.items.find((item: any) => item.label === 'Core Technologies');
      expect(coreItem?.content).not.toContain('Addressables');
    });
  });

  describe('四、專案作品優先排布驗收', () => {
    it('Fullstack 模板專案清單首項必須為 fullstack 類型', () => {
      const fb = FULLSTACK_FALLBACKS;
      expect(fb.projects[0].category).toBe('fullstack');
    });

    it('Interactive 模板專案清單首項必須為 interactive 類型', () => {
      const fb = INTERACTIVE_FALLBACKS;
      expect(fb.projects[0].category).toBe('interactive');
    });
  });

  describe('五、工作經驗樂美館定向隱藏驗收', () => {
    it('Fullstack 模板之「樂美館股份有限公司」必須為 visible: false', () => {
      const fb = FULLSTACK_FALLBACKS;
      const xacItemZh = (fb.experience as any).zh.workExperiences.find(
        (w: any) => w.company?.includes('樂美館') || w.role?.includes('3D 遊戲美術人員')
      );
      expect(xacItemZh).toBeDefined();
      expect(xacItemZh.visible).toBe(false);

      const xacItemEn = (fb.experience as any).en.workExperiences.find(
        (w: any) => w.company?.includes('樂美館') || w.role_en?.includes('3D Game Artist')
      );
      expect(xacItemEn).toBeDefined();
      expect(xacItemEn.visible).toBe(false);
    });

    it('Interactive 模板之「樂美館股份有限公司」必須為 visible: true', () => {
      const fb = INTERACTIVE_FALLBACKS;
      const xacItemZh = (fb.experience as any).zh.workExperiences.find(
        (w: any) => w.company?.includes('樂美館') || w.role?.includes('3D 遊戲美術人員')
      );
      expect(xacItemZh).toBeDefined();
      expect(xacItemZh.visible).toBe(true);
    });
  });

  describe('六、美術畫廊模組定向可見度驗收', () => {
    it('Fullstack 模板之 gallery 模組必須預設為 false (隱藏)', () => {
      const fb = FULLSTACK_FALLBACKS;
      expect((fb.site_settings as any).modules_visibility.gallery).toBe(false);
    });

    it('Interactive 模板之 gallery 模組必須預設為 true (開啟)', () => {
      const fb = INTERACTIVE_FALLBACKS;
      expect((fb.site_settings as any).modules_visibility.gallery).toBe(true);
    });
  });

  describe('七、雙模板還原預設基準驗收 (拒絕最基礎模式)', () => {
    it('Fullstack 模式還原預設必須保持 Fullstack 專屬設定 (樂美館隱藏、畫廊關閉、全端優先副標題)', () => {
      const fsFallback = FULLSTACK_FALLBACKS;
      // 驗證副標題 (全端優先之雙主修)
      expect(fsFallback.hero.zh.subtitle).toBe('全端開發／互動應用開發');
      expect(fsFallback.hero.en.subtitle).toBe('Fullstack Dev / Interactive App Dev');
      // 驗證畫廊設定
      expect((fsFallback.site_settings as any).modules_visibility.gallery).toBe(false);
      // 驗證樂美館
      const xacItem = (fsFallback.experience as any).zh.workExperiences.find(
        (w: any) => w.company?.includes('樂美館')
      );
      expect(xacItem.visible).toBe(false);
    });

    it('Interactive 模式還原預設必須保持 Interactive 專屬設定 (樂美館顯示、畫廊開啟、互動應用優先副標題)', () => {
      const iFallback = INTERACTIVE_FALLBACKS;
      // 驗證副標題 (互動應用優先之雙主修)
      expect(iFallback.hero.zh.subtitle).toBe('互動應用開發／全端開發');
      expect(iFallback.hero.en.subtitle).toBe('Interactive App Dev / Fullstack Dev');
      // 驗證畫廊設定
      expect((iFallback.site_settings as any).modules_visibility.gallery).toBe(true);
      // 驗證樂美館
      const xacItem = (iFallback.experience as any).zh.workExperiences.find(
        (w: any) => w.company?.includes('樂美館')
      );
      expect(xacItem.visible).toBe(true);
    });
  });
});

