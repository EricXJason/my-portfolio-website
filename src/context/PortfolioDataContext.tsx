/**
 * ============================================================================
 * 檔案名稱: PortfolioDataContext.tsx
 * 所屬模組: Data State Layer (全站雲端與本機快取資料狀態中樞)
 * 責任描述: 負責統籌前臺各大展示模組與 CMS 之資料來源，實作「離線快取優先 + 雲端即時同步 (Offline-First SWR)」
 *           機制。首屏採用本地靜態 JSON 實現 0ms 瞬時載入，掛載後自動非同步獲取 Firestore 最新雲端內容並平滑替換。
 * 架構分層: Application State Layer (React Context API)
 * 依賴關係: 依賴 Firebase Firestore (db, isFirebaseConfigured) 與本地靜態 JSON 備援資料庫。
 * 邊界處理: 支援網路離線或雲端異常時自動平滑回退本地快取、防禦性深拷貝防污染。
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import {
  savePortfolioDoc,
  PortfolioDocId,
  LOCAL_FALLBACKS,
} from '../services/portfolioDataService';

// 9 大模組之型別定義集合
export interface PortfolioDataState {
  hero: any;
  site_settings: any;
  about: any;
  skills: any;
  projects: any;
  experience: any;
  certifications: any;
  gallery: any;
  site_translations: any;
}

interface PortfolioDataContextType {
  data: PortfolioDataState;
  isLoadingCloud: boolean;
  isCloudConnected: boolean;
  lastUpdated: Date | null;
  refreshFromCloud: () => Promise<void>;
  updateDocument: (docId: PortfolioDocId, newPayload: any) => Promise<boolean>;
}

const COLLECTION_NAME = 'portfolio_content';

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初始狀態以本地靜態 JSON 立即初始化，確保 0ms 首屏極速渲染
  const [data, setData] = useState<PortfolioDataState>({
    hero: LOCAL_FALLBACKS.hero,
    site_settings: LOCAL_FALLBACKS.site_settings,
    about: LOCAL_FALLBACKS.about,
    skills: LOCAL_FALLBACKS.skills,
    projects: LOCAL_FALLBACKS.projects,
    experience: LOCAL_FALLBACKS.experience,
    certifications: LOCAL_FALLBACKS.certifications,
    gallery: LOCAL_FALLBACKS.gallery,
    site_translations: LOCAL_FALLBACKS.site_translations,
  });

  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * 從 Firestore 批次拉取最新全域資料
   */
  const refreshFromCloud = useCallback(async () => {
    if (!db || !isFirebaseConfigured) {
      return;
    }

    setIsLoadingCloud(true);
    const keys = Object.keys(LOCAL_FALLBACKS) as PortfolioDocId[];
    const cloudUpdates: Partial<PortfolioDataState> = {};
    let hasAnyCloudData = false;

    try {
      await Promise.all(
        keys.map(async (key) => {
          try {
            const docRef = doc(db!, COLLECTION_NAME, key);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              const docData = snap.data();
              const payload = docData.payload !== undefined ? docData.payload : docData;
              cloudUpdates[key] = payload;
              hasAnyCloudData = true;
            }
          } catch (err) {
            console.warn(`[DataContext]: Fetching ${key} failed, keeping current data.`, err);
          }
        })
      );

      if (hasAnyCloudData) {
        setData((prev) => ({
          ...prev,
          ...cloudUpdates,
        }));
        setIsCloudConnected(true);
        setLastUpdated(new Date());
      }
    } catch (globalErr) {
      console.error('[DataContext]: Global cloud refresh failed:', globalErr);
    } finally {
      setIsLoadingCloud(false);
    }
  }, []);

  /**
   * 更新指定文檔並同步寫入 Firestore 與本地狀態
   */
  const updateDocument = useCallback(
    async (docId: PortfolioDocId, newPayload: any): Promise<boolean> => {
      // 1. 樂觀即時更新本地 React 狀態
      setData((prev) => ({
        ...prev,
        [docId]: newPayload,
      }));

      // 2. 非同步寫入 Firestore 雲端資料庫
      try {
        await savePortfolioDoc(docId, newPayload);
        setLastUpdated(new Date());
        return true;
      } catch (error) {
        console.error(`[DataContext]: Failed to persist ${docId} to Firestore:`, error);
        throw error;
      }
    },
    []
  );

  // 初次掛載時若已設定 Firebase，自動掛載 Firestore onSnapshot 實現全自動即時雙向同步
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const keys = Object.keys(LOCAL_FALLBACKS) as PortfolioDocId[];
    const unsubs: (() => void)[] = [];

    keys.forEach((key) => {
      try {
        const docRef = doc(db!, COLLECTION_NAME, key);
        const unsub = onSnapshot(
          docRef,
          (snap) => {
            if (snap.exists()) {
              const docData = snap.data();
              const payload = docData.payload !== undefined ? docData.payload : docData;
              setData((prev) => ({
                ...prev,
                [key]: payload,
              }));
              setIsCloudConnected(true);
              setLastUpdated(new Date());
            }
          },
          (error) => {
            console.warn(`[DataContext]: Snapshot listener error for ${key}:`, error);
          }
        );
        unsubs.push(unsub);
      } catch (err) {
        console.error(`[DataContext]: Failed to listen to ${key}:`, err);
      }
    });

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        isLoadingCloud,
        isCloudConnected,
        lastUpdated,
        refreshFromCloud,
        updateDocument,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

/**
 * Hook: 存取全站資料狀態與雲端同步操作
 */
export const usePortfolioData = (): PortfolioDataContextType => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};

export default PortfolioDataContext;
