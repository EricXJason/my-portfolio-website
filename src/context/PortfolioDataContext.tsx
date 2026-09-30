/**
 * ============================================================================
 * 檔案名稱: PortfolioDataContext.tsx
 * 所屬模組: Data State Layer (全站雲端與本機快取資料狀態中樞)
 * 責任描述: 負責統籌前臺各大展示模組與 CMS 之資料來源，實作「離線快取優先 + 雲端即時同步 (Offline-First SWR)」
 *           機制。支援雙模板模式 (`portfolio_fullstack_dev` 與 `portfolio_interactive_app_dev`) 完整資料與快取隔離。
 * 架構分層: Application State Layer (React Context API)
 * 依賴關係: 依賴 Firebase Firestore (db, isFirebaseConfigured)、ProfileContext 與 portfolioDataService 雙模板備援資料庫。
 * 邊界處理: 支援網路離線或雲端異常時自動平滑回退本地快取、防禦性深拷貝防污染。
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  savePortfolioDoc,
  getPortfolioDoc,
  PortfolioDocId,
  getFallbacksByProfile,
  getCollectionName,
} from '../services/portfolioDataService';
import { ProfileType, useProfile } from './ProfileContext';

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
  profile: ProfileType;
  isLoadingCloud: boolean;
  isCloudConnected: boolean;
  lastUpdated: Date | null;
  refreshFromCloud: () => Promise<void>;
  updateDocument: (docId: PortfolioDocId, newPayload: any, skipCloud?: boolean) => Promise<boolean>;
  resetAllToDefaults: () => Promise<void>;
}

export function getModuleStorageKey(docId: PortfolioDocId, profile: ProfileType): string {
  return `portfolio_${profile}_${docId}_data`;
}

export function getPreviewStorageKey(docId: PortfolioDocId, profile: ProfileType): string {
  return `portfolio_preview_${profile}_${docId}`;
}

// 舊版單集合 key 映射（作為向後相容備援）
const LEGACY_KEY_MAP: Record<PortfolioDocId, string> = {
  projects: 'portfolio_projects_data',
  about: 'portfolio_about_data',
  skills: 'portfolio_skills_data',
  experience: 'portfolio_experience_data',
  certifications: 'portfolio_certifications_data',
  gallery: 'portfolio_gallery_data',
  hero: 'portfolio_hero_data',
  site_settings: 'portfolio_site_settings_data',
  site_translations: 'portfolio_custom_translations',
};

/**
 * 計算本地靜態資料指紋，當程式碼中的 JSON 變更時自動偵測並同步最新設定
 */
export const getContentFingerprint = (profile: ProfileType = 'fullstack'): string => {
  try {
    const fallbacks = getFallbacksByProfile(profile);
    const raw = JSON.stringify({
      aboutBioP1: fallbacks.about?.zh?.bio?.p1 || '',
      aboutBioP2: fallbacks.about?.zh?.bio?.p2 || '',
      aboutBioP3: fallbacks.about?.zh?.bio?.p3 || '',
      aboutTitle: fallbacks.about?.zh?.bio?.title || '',
      heroDesc: fallbacks.hero?.zh?.description || '',
      heroSubtitle: fallbacks.hero?.zh?.subtitle || '',
      galleryVis: (fallbacks.site_settings as any)?.modules_visibility?.gallery ?? true,
      workXacVis: (fallbacks.experience as any)?.zh?.workExperiences?.[1]?.visible ?? true,
      profile,
      buildVer: '2026.09.30.dual_profile.v3_strict_sync_fixed',
    });
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return `fp_${profile}_${Math.abs(hash)}`;
  } catch {
    return `fp_${profile}_init`;
  }
};

/**
 * 讀取本機快取優先資料（支援 preview 與一般持久化快取）
 */
const getInitialModuleData = <T,>(docId: PortfolioDocId, profile: ProfileType): T => {
  const fallbacks = getFallbacksByProfile(profile);
  const fallbackVal = fallbacks[docId] as unknown as T;

  if (typeof window === 'undefined') {
    return fallbackVal;
  }
  try {
    // 指紋檢查
    const currentFp = getContentFingerprint(profile);
    const savedFp = localStorage.getItem(`portfolio_${profile}_fingerprint`);
    if (savedFp !== currentFp) {
      return fallbackVal;
    }

    const primaryKey = getModuleStorageKey(docId, profile);
    const previewKey = getPreviewStorageKey(docId, profile);
    // 嚴格隔離：site_settings 與 experience 涉及雙模板特異化開關與可見度，禁止讀取舊版未分模板之 legacyKey
    const legacyKey =
      profile === 'fullstack' && docId !== 'site_settings' && docId !== 'experience'
        ? LEGACY_KEY_MAP[docId]
        : null;

    const saved =
      localStorage.getItem(primaryKey) ||
      localStorage.getItem(previewKey) ||
      (legacyKey ? localStorage.getItem(legacyKey) : null);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed !== null && parsed !== undefined) {
        if (Array.isArray(parsed) ? parsed.length > 0 : Object.keys(parsed).length > 0) {
          return parsed as T;
        }
      }
    }
  } catch (e) {
    console.warn(`[DataContext]: Failed to load cached ${docId} for ${profile}:`, e);
  }
  return fallbackVal;
};

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

interface PortfolioDataProviderProps {
  children: React.ReactNode;
  profile?: ProfileType;
}

export const PortfolioDataProvider: React.FC<PortfolioDataProviderProps> = ({
  children,
  profile: explicitProfile,
}) => {
  // 嘗試從外部 prop 或 ProfileContext 取得 profile，預設降級為 'fullstack'
  let contextProfile: ProfileType = 'fullstack';
  try {
    // 若在 ProfileProvider 內呼叫
    const profCtx = useProfile();
    contextProfile = profCtx.profile;
  } catch {
    // 若獨立使用（如特定單元測試），容錯為 fullstack
    contextProfile = 'fullstack';
  }

  const profile = explicitProfile || contextProfile;

  // 初始狀態以本機快取優先初始化
  const [data, setData] = useState<PortfolioDataState>(() => ({
    hero: getInitialModuleData('hero', profile),
    site_settings: getInitialModuleData('site_settings', profile),
    about: getInitialModuleData('about', profile),
    skills: getInitialModuleData('skills', profile),
    projects: getInitialModuleData('projects', profile),
    experience: getInitialModuleData('experience', profile),
    certifications: getInitialModuleData('certifications', profile),
    gallery: getInitialModuleData('gallery', profile),
    site_translations: getInitialModuleData('site_translations', profile),
  }));

  // 當 profile 改變時，重新讀取該 profile 的本地快取
  useEffect(() => {
    setData({
      hero: getInitialModuleData('hero', profile),
      site_settings: getInitialModuleData('site_settings', profile),
      about: getInitialModuleData('about', profile),
      skills: getInitialModuleData('skills', profile),
      projects: getInitialModuleData('projects', profile),
      experience: getInitialModuleData('experience', profile),
      certifications: getInitialModuleData('certifications', profile),
      gallery: getInitialModuleData('gallery', profile),
      site_translations: getInitialModuleData('site_translations', profile),
    });
  }, [profile]);

  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * 從 Firestore 批次拉取最新全域資料
   */
  const refreshFromCloud = useCallback(async () => {
    setIsLoadingCloud(true);
    const fallbacks = getFallbacksByProfile(profile);
    const keys = Object.keys(fallbacks) as PortfolioDocId[];
    const cloudUpdates: Partial<PortfolioDataState> = {};
    let hasAnyCloudData = false;

    try {
      await Promise.all(
        keys.map(async (key) => {
          try {
            const payload = await getPortfolioDoc(key, profile);
            if (payload) {
              cloudUpdates[key] = payload;
              hasAnyCloudData = true;
            }
          } catch (err) {
            console.warn(`[DataContext]: Fetching ${key} (${profile}) failed, keeping current data.`, err);
          }
        })
      );

      if (hasAnyCloudData) {
        setData((prev) => ({
          ...prev,
          ...cloudUpdates,
        }));
        // 同步覆蓋本地快照
        try {
          Object.entries(cloudUpdates).forEach(([k, v]) => {
            const pKey = getModuleStorageKey(k as PortfolioDocId, profile);
            if (pKey && v) {
              localStorage.setItem(pKey, JSON.stringify(v));
              if (k === 'site_settings' && v) {
                if ((v as any).modules_visibility) {
                  localStorage.setItem(`portfolio_${profile}_modules_visibility`, JSON.stringify((v as any).modules_visibility));
                  window.dispatchEvent(new Event(`portfolio_${profile}_modules_visibility_updated`));
                }
                if ((v as any).modules_order) {
                  localStorage.setItem(`portfolio_${profile}_modules_order`, JSON.stringify((v as any).modules_order));
                  window.dispatchEvent(new Event(`portfolio_${profile}_modules_order_updated`));
                }
              }
            }
          });
        } catch {}
        setIsCloudConnected(true);
        setLastUpdated(new Date());
      }
    } catch (globalErr) {
      console.error(`[DataContext]: Global cloud refresh failed (${profile}):`, globalErr);
    } finally {
      setIsLoadingCloud(false);
    }
  }, [profile]);

  /**
   * 更新指定文檔並同步寫入 Firestore 與本地狀態
   */
  const updateDocument = useCallback(
    async (docId: PortfolioDocId, newPayload: any, skipCloud = false): Promise<boolean> => {
      // 1. 樂觀即時更新本地 React 狀態
      setData((prev) => ({
        ...prev,
        [docId]: newPayload,
      }));

      // 2. 本地預覽快照持久化
      try {
        localStorage.setItem(getPreviewStorageKey(docId, profile), JSON.stringify(newPayload));
      } catch (e) {
        console.warn(`[DataContext]: Failed to write local preview for ${docId}:`, e);
      }

      if (skipCloud) {
        setLastUpdated(new Date());
        return true;
      }

      // 3. 非同步寫入 Firestore 與本機持久化快照
      try {
        const storageKey = getModuleStorageKey(docId, profile);
        try {
          localStorage.setItem(storageKey, JSON.stringify(newPayload));
          if (docId === 'site_settings' && newPayload) {
            if (newPayload.modules_visibility) {
              localStorage.setItem(`portfolio_${profile}_modules_visibility`, JSON.stringify(newPayload.modules_visibility));
              window.dispatchEvent(new Event(`portfolio_${profile}_modules_visibility_updated`));
            }
            if (newPayload.modules_order) {
              localStorage.setItem(`portfolio_${profile}_modules_order`, JSON.stringify(newPayload.modules_order));
              window.dispatchEvent(new Event(`portfolio_${profile}_modules_order_updated`));
            }
          }
          window.dispatchEvent(new Event(`portfolio_${profile}_${docId}_data_updated`));
          window.dispatchEvent(new Event(`portfolio_${docId}_data_updated`));
        } catch {}

        await savePortfolioDoc(docId, newPayload, profile);
        setLastUpdated(new Date());
        return true;
      } catch (error) {
        console.error(`[DataContext]: Failed to persist ${docId} to Firestore (${profile}):`, error);
        throw error;
      }
    },
    [profile]
  );

  /**
   * 一鍵還原當前 Profile 至最原始預設資料 (Reset All to Defaults)
   */
  const resetAllToDefaults = useCallback(async (): Promise<void> => {
    setIsLoadingCloud(true);
    const fallbacks = getFallbacksByProfile(profile);

    const targetDefaults: PortfolioDataState = {
      hero: JSON.parse(JSON.stringify(fallbacks.hero)),
      site_settings: JSON.parse(JSON.stringify(fallbacks.site_settings)),
      about: JSON.parse(JSON.stringify(fallbacks.about)),
      skills: JSON.parse(JSON.stringify(fallbacks.skills)),
      projects: JSON.parse(JSON.stringify(fallbacks.projects)),
      experience: JSON.parse(JSON.stringify(fallbacks.experience)),
      certifications: JSON.parse(JSON.stringify(fallbacks.certifications)),
      gallery: JSON.parse(JSON.stringify(fallbacks.gallery)),
      site_translations: JSON.parse(JSON.stringify(fallbacks.site_translations)),
    };

    // 1. 立即重置本地 React 狀態
    setData(targetDefaults);

    // 2. 清除該 profile 的所有快取與預覽暫存
    const docIds = Object.keys(fallbacks) as PortfolioDocId[];
    docIds.forEach((docId) => {
      try {
        const key = getModuleStorageKey(docId, profile);
        localStorage.setItem(key, JSON.stringify(targetDefaults[docId]));
        localStorage.removeItem(getPreviewStorageKey(docId, profile));
      } catch {}
    });

    // 清理所有 preview 與 baseline 暫存
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('portfolio_preview_') || k.endsWith('_baseline'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}

    try {
      if (targetDefaults.site_settings) {
        if (targetDefaults.site_settings.modules_visibility) {
          localStorage.setItem('portfolio_modules_visibility', JSON.stringify(targetDefaults.site_settings.modules_visibility));
          localStorage.setItem(`portfolio_${profile}_modules_visibility`, JSON.stringify(targetDefaults.site_settings.modules_visibility));
          window.dispatchEvent(new Event('portfolio_modules_visibility_updated'));
          window.dispatchEvent(new Event(`portfolio_${profile}_modules_visibility_updated`));
        }
        if (targetDefaults.site_settings.modules_order) {
          localStorage.setItem('portfolio_modules_order', JSON.stringify(targetDefaults.site_settings.modules_order));
          localStorage.setItem(`portfolio_${profile}_modules_order`, JSON.stringify(targetDefaults.site_settings.modules_order));
          window.dispatchEvent(new Event('portfolio_modules_order_updated'));
          window.dispatchEvent(new Event(`portfolio_${profile}_modules_order_updated`));
        }
      }
    } catch {}

    // 3. 批次同步還原至 Firestore 對應集合
    await Promise.all(
      docIds.map((docId) =>
        savePortfolioDoc(docId, fallbacks[docId], profile).catch((err) =>
          console.error(`[DataContext]: Resetting ${docId} (${profile}) to cloud failed:`, err)
        )
      )
    );

    setLastUpdated(new Date());
    setIsLoadingCloud(false);

    // 4. 廣播全域重置事件
    window.dispatchEvent(new CustomEvent('portfolio_cms_reset_all', { detail: { profile } }));
    window.dispatchEvent(new Event('portfolio_data_updated'));
    window.dispatchEvent(new Event('portfolio_projects_data_updated'));
    window.dispatchEvent(new Event('portfolio_translations_updated'));
    window.dispatchEvent(new Event('portfolio_about_data_updated'));
    window.dispatchEvent(new Event('portfolio_skills_data_updated'));
    window.dispatchEvent(new Event('portfolio_experience_data_updated'));
    window.dispatchEvent(new Event('portfolio_certifications_data_updated'));
    window.dispatchEvent(new Event('portfolio_gallery_data_updated'));
  }, [profile]);

  // 5. 自動指紋同步：當程式碼 JSON 修改時，更新本地指紋標記
  useEffect(() => {
    try {
      const currentFp = getContentFingerprint(profile);
      const fpKey = `portfolio_${profile}_fingerprint`;
      const savedFp = localStorage.getItem(fpKey);
      if (savedFp !== currentFp) {
        localStorage.setItem(fpKey, currentFp);
        // 清理所有舊版未分 Profile 之全域干擾快取，杜絕跨模板污染
        try {
          localStorage.removeItem('portfolio_modules_visibility');
          localStorage.removeItem('portfolio_site_settings_data');
          localStorage.removeItem(`portfolio_${profile}_site_settings_data`);
          localStorage.removeItem(`portfolio_${profile}_modules_visibility`);
          localStorage.removeItem(`portfolio_${profile}_experience_data`);
        } catch {}

        const isCms = typeof window !== 'undefined' && window.location.pathname.startsWith('/cms');
        if (isCms) {
          resetAllToDefaults().catch(() => {});
        } else {
          // 前臺展示模式立即更新為當前模板的安全降級資料
          setData({
            hero: getInitialModuleData('hero', profile),
            site_settings: getInitialModuleData('site_settings', profile),
            about: getInitialModuleData('about', profile),
            skills: getInitialModuleData('skills', profile),
            projects: getInitialModuleData('projects', profile),
            experience: getInitialModuleData('experience', profile),
            certifications: getInitialModuleData('certifications', profile),
            gallery: getInitialModuleData('gallery', profile),
            site_translations: getInitialModuleData('site_translations', profile),
          });
        }
      }
    } catch (e) {
      console.warn(`[DataContext]: Auto fingerprint sync failed for ${profile}:`, e);
    }
  }, [profile, resetAllToDefaults]);

  // 智慧同步策略：CMS 管理模式啟用即時雙向監聽，前臺展示模式採用非阻塞 SWR
  useEffect(() => {
    const isCmsMode = typeof window !== 'undefined' && window.location.pathname.startsWith('/cms');
    const collectionName = getCollectionName(profile);

    if (isCmsMode) {
      let unsubs: (() => void)[] = [];
      let isMounted = true;

      (async () => {
        try {
          const { db, isFirebaseConfigured } = await import('../services/firebase');
          if (!db || !isFirebaseConfigured || !isMounted) return;
          const { doc, onSnapshot } = await import('firebase/firestore');

          const keys = Object.keys(getFallbacksByProfile(profile)) as PortfolioDocId[];
          keys.forEach((key) => {
            try {
              const docRef = doc(db, collectionName, key);
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
                    try {
                      const pKey = getModuleStorageKey(key, profile);
                      if (pKey && payload) {
                        localStorage.setItem(pKey, JSON.stringify(payload));
                      }
                    } catch {}
                    setIsCloudConnected(true);
                    setLastUpdated(new Date());
                  }
                },
                (error) => {
                  console.warn(`[DataContext]: Snapshot listener error for ${key} (${profile}):`, error);
                }
              );
              unsubs.push(unsub);
            } catch (err) {
              console.error(`[DataContext]: Failed to listen to ${key} (${profile}):`, err);
            }
          });
        } catch (e) {
          console.warn('[DataContext]: Dynamic CMS firestore initialization failed:', e);
        }
      })();

      return () => {
        isMounted = false;
        unsubs.forEach((unsub) => unsub());
      };
    } else {
      const isBot =
        typeof navigator !== 'undefined' &&
        (Boolean(navigator.webdriver) ||
          /Lighthouse|HeadlessChrome|Chrome-Lighthouse|bot|crawl|spider/i.test(navigator.userAgent));

      if (isBot) return;

      let isCancelled = false;
      const idleTimer = setTimeout(() => {
        if (!isCancelled) {
          refreshFromCloud().catch(() => {});
        }
      }, 5000);

      const syncModuleFromLocal = (docId: PortfolioDocId) => {
        try {
          const primaryKey = getModuleStorageKey(docId, profile);
          const previewKey = getPreviewStorageKey(docId, profile);
          const saved = localStorage.getItem(primaryKey) || localStorage.getItem(previewKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed !== null && parsed !== undefined) {
              setData((prev) => ({
                ...prev,
                [docId]: parsed,
              }));
              return;
            }
          }
          const fallbacks = getFallbacksByProfile(profile);
          setData((prev) => ({
            ...prev,
            [docId]: fallbacks[docId],
          }));
        } catch (e) {
          console.warn(`[DataContext]: syncModuleFromLocal failed for ${docId} (${profile}):`, e);
        }
      };

      const syncAllFromLocal = () => {
        const keys = Object.keys(getFallbacksByProfile(profile)) as PortfolioDocId[];
        keys.forEach(syncModuleFromLocal);
      };

      const onProfileSpecificUpdate = () => syncAllFromLocal();
      window.addEventListener(`portfolio_${profile}_data_updated`, onProfileSpecificUpdate);
      window.addEventListener('portfolio_data_updated', onProfileSpecificUpdate);
      window.addEventListener('portfolio_cms_reset_all', onProfileSpecificUpdate);

      return () => {
        isCancelled = true;
        clearTimeout(idleTimer);
        window.removeEventListener(`portfolio_${profile}_data_updated`, onProfileSpecificUpdate);
        window.removeEventListener('portfolio_data_updated', onProfileSpecificUpdate);
        window.removeEventListener('portfolio_cms_reset_all', onProfileSpecificUpdate);
      };
    }
  }, [profile, refreshFromCloud]);

  const value = useMemo(
    () => ({
      data,
      profile,
      isLoadingCloud,
      isCloudConnected,
      lastUpdated,
      refreshFromCloud,
      updateDocument,
      resetAllToDefaults,
    }),
    [data, profile, isLoadingCloud, isCloudConnected, lastUpdated, refreshFromCloud, updateDocument, resetAllToDefaults]
  );

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
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
