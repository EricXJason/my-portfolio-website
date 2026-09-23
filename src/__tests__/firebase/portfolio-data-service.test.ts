/**
 * ============================================================================
 * 檔案名稱: portfolio-data-service.test.ts
 * 所屬模組: Test Suite (Firebase 前端串接與服務層契約測試)
 * 責任描述: 嚴格驗證 portfolioDataService 之 Firestore CRUD 契約、
 *           資料封包結構 (payload + serverTimestamp)、安全離線降級 (Fallback)
 *           與防禦性錯誤攔截機制。
 * 架構分層: Unit Tests (Vitest)
 * ============================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// 建立 Firestore 原生 API 之 Mock
const mockDoc = vi.fn((...args: any[]) => ({
  _path: `${args[1]}/${args[2]}`,
  id: args[2],
}));
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockServerTimestamp = vi.fn(() => 'MOCK_SERVER_TIMESTAMP');

vi.mock('firebase/firestore', () => ({
  doc: (...args: any[]) => mockDoc(...args),
  getDoc: (...args: any[]) => mockGetDoc(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
}));

let mockDbConfigured = true;
vi.mock('../../services/firebase', () => ({
  get db() {
    return mockDbConfigured ? { type: 'mock-firestore-instance' } : null;
  },
  get isFirebaseConfigured() {
    return mockDbConfigured;
  },
}));

import {
  getPortfolioDoc,
  savePortfolioDoc,
  seedFirestoreFromLocalJson,
  LOCAL_FALLBACKS,
  type PortfolioDocId,
} from '../../services/portfolioDataService';

describe('Firebase 前端服務層串接測試 (PortfolioDataService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbConfigured = true;
  });

  describe('savePortfolioDoc - 儲存文檔至 Firestore', () => {
    it('應正確將資料包裝為 { payload, _updatedAt } 並指定 portfolio_content 集合與對應 docId 送至 Firestore', async () => {
      mockSetDoc.mockResolvedValueOnce(undefined);

      const testPayload = {
        title: '新專案作品',
        items: [{ id: 'proj-1', name: 'Cyberpunk Game' }],
      };

      const result = await savePortfolioDoc('projects', testPayload);

      expect(result).toBe(true);
      // 驗證 doc 路徑
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        'portfolio_content',
        'projects'
      );
      // 驗證送出的資料結構必須具備 payload 與 serverTimestamp
      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'projects' }),
        {
          payload: testPayload,
          _updatedAt: 'MOCK_SERVER_TIMESTAMP',
        }
      );
    });

    it('當 Firebase 尚未配置或 db 為 null 時，應拋出明確錯誤並阻止寫入', async () => {
      mockDbConfigured = false;

      await expect(
        savePortfolioDoc('hero', { badge: 'test' })
      ).rejects.toThrow('Firebase Firestore 尚未初始化，無法寫入雲端資料庫');

      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('當 Firestore setDoc 發生網路或權限錯誤時，應忠實向上拋出錯誤供前端 UI 捕捉', async () => {
      const networkError = new Error('PERMISSION_DENIED: Missing or insufficient permissions.');
      mockSetDoc.mockRejectedValueOnce(networkError);

      await expect(
        savePortfolioDoc('about', { bio: '測試自傳' })
      ).rejects.toThrow('PERMISSION_DENIED');
    });
  });

  describe('getPortfolioDoc - 從 Firestore 讀取文檔', () => {
    it('當 Firestore 存在文檔且具備 payload 時，應成功解包核心 payload 回傳', async () => {
      const mockCloudData = {
        payload: { headline: '雲端最新標題' },
        _updatedAt: '2026-09-24T00:00:00Z',
      };

      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockCloudData,
      });

      const data = await getPortfolioDoc<{ headline: string }>('hero');

      expect(data).toEqual({ headline: '雲端最新標題' });
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        'portfolio_content',
        'hero'
      );
    });

    it('當 Firestore 文檔不存在時，應安全降級回退到本地靜態 JSON (LOCAL_FALLBACKS)', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => false,
      });

      const data = await getPortfolioDoc('projects');

      expect(data).toEqual(LOCAL_FALLBACKS.projects);
    });

    it('當 Firestore 拋出網路異常時，應防禦性捕獲錯誤並安全降級回退本地靜態 JSON', async () => {
      mockGetDoc.mockRejectedValueOnce(new Error('Network offline'));

      const data = await getPortfolioDoc('skills');

      expect(data).toEqual(LOCAL_FALLBACKS.skills);
    });

    it('當 Firebase 未配置時，應直接回傳本地降級靜態 JSON，不發送 Firestore 請求', async () => {
      mockDbConfigured = false;

      const data = await getPortfolioDoc('experience');

      expect(data).toEqual(LOCAL_FALLBACKS.experience);
      expect(mockGetDoc).not.toHaveBeenCalled();
    });
  });

  describe('seedFirestoreFromLocalJson - 批次同步本地 9 大模組至雲端', () => {
    it('應完整涵蓋所有 9 大模組並批次寫入 Firestore', async () => {
      mockSetDoc.mockResolvedValue(undefined);

      const result = await seedFirestoreFromLocalJson();

      expect(result.success).toBe(true);
      expect(result.count).toBe(9);

      const expectedModules: PortfolioDocId[] = [
        'hero',
        'site_settings',
        'about',
        'skills',
        'projects',
        'experience',
        'certifications',
        'gallery',
        'site_translations',
      ];

      expectedModules.forEach((modId) => {
        expect(mockDoc).toHaveBeenCalledWith(
          expect.anything(),
          'portfolio_content',
          modId
        );
      });
    });
  });
});
