/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 【服務層】作品集全站資料持久化服務 (Portfolio Firestore Data Service)
 * ─────────────────────────────────────────────────────────────────────────────
 * 職責：
 * 1. 統一管理前臺與 CMS 對接 Firestore `portfolio_content` 集合之讀寫契約。
 * 2. 實作安全降級機制 (Graceful Fallback)：網路離線或未配置時無縫回退至本地靜態 JSON。
 * 3. 提供一鍵雲端資料庫初始化/同步方法 (seedFirestoreFromLocalJson)。
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

// 匯入本地靜態 JSON 作為安全降級備援
import aboutData from '../data/about-section.json';
import skillsData from '../data/skills-section.json';
import projectsData from '../data/projects-section.json';
import experienceData from '../data/experience-section.json';
import certsData from '../data/certifications-section.json';
import galleryData from '../data/gallery-section.json';
import heroData from '../data/hero-section.json';
import siteSettingsData from '../data/site-settings.json';
import siteTranslations from '../data/site-translations.json';

const COLLECTION_NAME = 'portfolio_content';

export const LOCAL_FALLBACKS = {
  hero: heroData,
  site_settings: siteSettingsData,
  about: aboutData,
  skills: skillsData,
  projects: projectsData,
  experience: experienceData,
  certifications: certsData,
  gallery: galleryData,
  site_translations: siteTranslations,
};

export type PortfolioDocId = keyof typeof LOCAL_FALLBACKS;

/**
 * 讀取指定文檔資料（優先從 Firestore 讀取，若無資料或錯誤則降級至本地 JSON）
 */
export async function getPortfolioDoc<T>(docId: PortfolioDocId): Promise<T> {
  const fallback = LOCAL_FALLBACKS[docId] as unknown as T;

  if (!db || !isFirebaseConfigured) {
    return fallback;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      // 移除內建時間戳記後回傳核心資料
      const { _updatedAt, ...content } = data;
      return (content.payload !== undefined ? content.payload : content) as T;
    }
  } catch (error) {
    console.warn(`[DataService]: Failed to fetch ${docId} from Firestore, using local fallback.`, error);
  }

  return fallback;
}

/**
 * 儲存指定文檔資料至 Firestore
 */
export async function savePortfolioDoc<T>(docId: PortfolioDocId, payload: T): Promise<boolean> {
  if (!db || !isFirebaseConfigured) {
    console.error(`[DataService]: Firestore not initialized. Unable to save ${docId}.`);
    throw new Error('Firebase Firestore 尚未初始化，無法寫入雲端資料庫');
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, {
      payload,
      _updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`[DataService]: Failed to save ${docId} to Firestore:`, error);
    throw error;
  }
}

/**
 * 一鍵將本地所有靜態 JSON 同步/初始化上傳至 Firestore
 */
export async function seedFirestoreFromLocalJson(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!db || !isFirebaseConfigured) {
    return { success: false, count: 0, error: 'Firebase 尚未正確初始化' };
  }

  try {
    const keys = Object.keys(LOCAL_FALLBACKS) as PortfolioDocId[];
    let count = 0;

    for (const key of keys) {
      await savePortfolioDoc(key, LOCAL_FALLBACKS[key]);
      count++;
    }

    return { success: true, count };
  } catch (error: any) {
    console.error('[DataService]: Seed Firestore failed:', error);
    return { success: false, count: 0, error: error?.message || '未知錯誤' };
  }
}
