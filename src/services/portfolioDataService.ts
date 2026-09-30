/**
 * ============================================================================
 * 檔案名稱: portfolioDataService.ts
 * 所屬模組: Data Persistence Layer — 作品集全站資料持久化服務
 * 責任描述:
 * 1. 統一管理前臺與 CMS 對接 Firestore 雙集合契約：
 *    - `portfolio_fullstack_dev` (/ 與 /f)
 *    - `portfolio_interactive_app_dev` (/i)
 * 2. 實作安全降級機制 (Graceful Fallback)：網路離線或未配置時無縫回退至雙模板靜態 JSON。
 * 3. 提供一鍵雲端資料庫初始化/同步方法 (seedFirestoreFromLocalJson)。
 * 4. 前臺展示完全資料驅動，展示層零硬編碼，所有優先順位皆由此處資料集決定。
 * 架構分層: Data Infrastructure Service Layer
 * 依賴關係: 依賴 Firebase Firestore 模組與本地靜態 JSON。
 * ============================================================================
 */

import { ProfileType, COLLECTION_MAP } from '../context/ProfileContext';

// 內部非同步輔助函式：按需載入 Firebase 與 Firestore 模組
async function getFirestoreContext() {
  try {
    const { db, isFirebaseConfigured } = await import('./firebase');
    if (!db || !isFirebaseConfigured) return null;
    const firestore = await import('firebase/firestore');
    return { db, firestore };
  } catch (err) {
    console.warn('[DataService]: Dynamic import of Firebase failed:', err);
    return null;
  }
}

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

/**
 * 取得指定 Profile 所對應之 Firestore Collection 名稱
 */
export function getCollectionName(profile: ProfileType = 'fullstack'): string {
  return COLLECTION_MAP[profile] || COLLECTION_MAP.fullstack;
}

// ── 建立兩套獨立的優先順位模板資料 (Templates) ──

// 1. Fullstack 優先模板 (對應 / 與 /f)
const fullstackHero = {
  ...heroData,
  zh: {
    ...heroData.zh,
    subtitle: '全端開發／互動應用開發',
    description:
      '專注於全端網頁開發與系統實作，熟悉前後端串接、RESTful API 與資料庫設計。寫程式重視清晰好維護的架構，並能將互動體驗思維融入 Web 開發，打造穩定好用的數位產品。',
  },
  en: {
    ...heroData.en,
    subtitle: 'Fullstack Dev / Interactive App Dev',
    description:
      'Focusing on full-stack web development with hands-on experience in RESTful APIs, relational databases, and frontend state management. Committed to writing readable, maintainable code to build stable and responsive applications.',
  },
};

const fullstackSiteSettings = {
  ...siteSettingsData,
  modules_visibility: {
    ...siteSettingsData.modules_visibility,
    gallery: false, // 全端 /f 模式預設隱藏美術畫廊，專注於全端系統與軟體工程
  },
};

// 關於我與自傳：全端為主軸，互動為輔
const fullstackAbout = {
  ...aboutData,
  zh: {
    ...aboutData.zh,
    intro: '畢業於臺藝大新媒體藝術碩士，專注於全端網頁開發與即時互動應用。',
    p1: '我是許哲誠，擁有新媒體藝術與程式開發的跨領域背景。平時主要使用 React、Node.js 與 Java Spring Boot 開發全端網頁，並具備 Unity (C#) 互動專案經驗。在開發過程中，我重視程式碼的易讀性與好維護性，能獨立處理從資料庫、後端 API 到前端畫面的完整串接，致力於做出穩定、好用的數位產品。',
    bio: {
      ...aboutData.zh.bio,
      p1_title: '從 Unity 互動到打穩資工基礎',
      p1: '大學時因為喜歡做出好玩的互動體驗，從 Unity C# 開始寫程式。做專題時發現想要系統跑得順，底層基礎非常重要，因此主動跨系去修了計算機概論、資料結構與演算法，把觀念打穩。求學期間也連續三年擔任教授的研究助理參與國科會計畫，在無數次寫原型、排查問題與除錯的過程中，確定了自己想走軟體開發這條路。',
      p2_title: '模組拆分與前後端實作經驗',
      p2: '碩士班開發較複雜的互動專案時，曾體會過模組耦合嚴重、改一個功能到處報錯的痛苦，這讓我學會注重模組拆分與物件導向設計，把畫面邏輯和資料處理分開。之後我也把開發範疇延伸到全端 Web，動手實作 Spring Boot / Node.js 後端服務、關聯式資料庫設計與 React 前端狀態管理。過往在遊戲引擎打下的程式邏輯，讓我在串接前後端資料時能更順暢地綜觀全局。',
    },
  },
  en: {
    ...aboutData.en,
    intro: 'M.A. graduate in New Media Art, focusing on full-stack web development and real-time interactive applications.',
    p1: 'I am Che-Cheng Hsu, bringing an interdisciplinary background across multimedia design and software engineering. Experienced in building full-stack applications with React, Node.js, and Spring Boot, alongside interactive 3D systems in Unity (C#). I value clean, readable code and maintainable structures, with hands-on capability spanning database modeling, backend APIs, and responsive frontends.',
    bio: {
      ...aboutData.en.bio,
      p1_title: 'From Unity Interactions to CS Fundamentals',
      p1: 'My programming journey started with Unity C# out of enthusiasm for interactive media. Realizing that stability and performance stem from strong foundations, I actively cross-enrolled in core CS courses such as Data Structures and Algorithms. Serving as a research assistant on NSTC research projects for three consecutive years solidified my practical debugging, rapid prototyping, and engineering mindset.',
      p2_title: 'Modular Architecture & Full-Stack Practices',
      p2: 'Leading larger interactive projects in graduate school taught me the hard lessons of code coupling. This spurred me to practice modular decoupling and object-oriented design, separating business logic from presentation. I then extended my skill set to full-stack web development, working with Spring Boot, Node.js backends, relational databases, and React frontends. The computational rigor from game engines allows me to navigate end-to-end data flows with clarity.',
    },
  },
};

// 經歷：/f 模式將「樂美館股份有限公司 • 3D 遊戲美術人員」設為隱藏
const fullstackExperience = (() => {
  const clone = JSON.parse(JSON.stringify(experienceData));
  ['zh', 'en'].forEach((l) => {
    if (Array.isArray(clone[l]?.workExperiences)) {
      clone[l].workExperiences = clone[l].workExperiences.map((item: any) => {
        if (
          item.company?.includes('樂美館') ||
          item.company_en?.includes('XAC') ||
          item.role?.includes('3D 遊戲美術人員') ||
          item.role_en?.includes('3D Game Artist')
        ) {
          return { ...item, visible: false };
        }
        return item;
      });
    }
  });
  return clone;
})();

// 專案排序：Fullstack 專案優先
const fullstackProjects = (() => {
  const clone = JSON.parse(JSON.stringify(projectsData));
  const fullstackItems = clone.filter((p: any) => p.category === 'fullstack');
  const otherItems = clone.filter((p: any) => p.category !== 'fullstack');
  return [...fullstackItems, ...otherItems];
})();

export const FULLSTACK_FALLBACKS = {
  hero: fullstackHero,
  site_settings: fullstackSiteSettings,
  about: fullstackAbout,
  skills: skillsData, // 預設第一項為全端開發，已含性能優化 Unity Profiler / Addressables 條目
  projects: fullstackProjects,
  experience: fullstackExperience,
  certifications: certsData,
  gallery: galleryData,
  site_translations: siteTranslations,
};

// 2. Interactive App Dev 優先模板 (對應 /i)
const interactiveHero = {
  ...heroData,
  zh: {
    ...heroData.zh,
    subtitle: '互動應用開發／全端開發',
    description:
      '專注於 Unity (C#) 與 XR 互動應用開發，具備遊戲迴圈邏輯、即時著色器 (Shader) 與效能調校實務。同時具備全端資料串接能力，致力於打造流暢且有臨場感的互動體驗。',
  },
  en: {
    ...heroData.en,
    subtitle: 'Interactive App Dev / Fullstack Dev',
    description:
      'Focusing on Unity (C#) and XR interactive applications, with hands-on practice in game loops, custom shaders, and runtime profiling, backed by reliable full-stack data integration.',
  },
};

const interactiveSiteSettings = {
  ...siteSettingsData,
  modules_visibility: {
    ...siteSettingsData.modules_visibility,
    gallery: true, // 互動應用開發面試強調視聽整合與 3D 表現，美術畫廊預設開啟
  },
};

// 關於我與自傳：互動為主軸，全端為輔
const interactiveAbout = {
  ...aboutData,
  zh: {
    ...aboutData.zh,
    intro: '畢業於臺藝大新媒體藝術碩士，專注於 Unity 核心開發、XR 互動應用與即時視覺呈現。',
    p1: '我是許哲誠，擁有新媒體藝術與程式開發背景。專注於 Unity (C#) 互動專案開發，熟悉遊戲迴圈邏輯、事件驅動架構與即時著色器 (Shader) 撰寫，並具備全端資料庫與 API 串接能力。在專案實作中重視效能調校與程式碼好讀性，致力於打造兼具流暢手感與穩定表現的互動產品。',
    bio: {
      ...aboutData.zh.bio,
      p1_title: '從遊戲互動到打穩資工基礎',
      p1: '大學時因為喜歡做出好玩的互動體驗，從 Unity C# 開始寫程式。做專題時發現想要遊戲跑得順，底層基礎非常重要，因此主動跨系去修了計算機概論、資料結構與演算法，把觀念打穩。求學期間也連續三年擔任教授的研究助理參與國科會計畫，在無數次寫原型、排查問題與除錯的過程中，奠定了扎實的程式底子。',
      p2_title: '互動系統架構與效能調校',
      p2: '碩士班主導較大型的 VR/XR 與多人互動專案時，曾遇過模組寫得太黏、執行效能低落的挑戰。我透過事件驅動架構、物件池與 ScriptableObject 將 UI、音效、動畫等子系統拆分開來，並利用 Unity Profiler 找出效能瓶頸進行優化。同時我也串接了雲端後端與資料庫，讓即時互動系統也能順暢處理連線與資料儲存。',
    },
  },
  en: {
    ...aboutData.en,
    intro: 'M.A. graduate in New Media Art, focusing on Unity core development, XR interactions, and real-time graphics.',
    p1: 'I am Che-Cheng Hsu, bringing an interdisciplinary background in multimedia and interactive engineering. Focusing on Unity (C#) projects with practical experience in game loops, event-driven architecture, and custom shaders, complemented by full-stack database and API integration. Committed to runtime profiling and readable code to deliver responsive interactive systems.',
    bio: {
      ...aboutData.en.bio,
      p1_title: 'From Game Interactions to CS Fundamentals',
      p1: 'Driven by enthusiasm for interactive media, I started programming with Unity C# in college. Realizing that game stability depends on solid fundamentals, I audited core CS courses including Data Structures and Algorithms. Serving as an NSTC project research assistant for three years gave me deep hands-on experience in debugging and system building.',
      p2_title: 'Interactive Systems & Profiler Optimization',
      p2: 'Managing larger VR/XR interactive systems in graduate school exposed performance bottlenecks and coupling challenges. I decoupled UI, audio, and physics systems using Event-Driven Architecture, Object Pooling, and ScriptableObjects, while profiling runtime bottlenecks with Unity Profiler. Integrating cloud backends further enabled cross-platform data synchronization.',
    },
  },
};

// 經歷：/i 模式保留「樂美館股份有限公司 • 3D 遊戲美術人員」顯示
const interactiveExperience = (() => {
  const clone = JSON.parse(JSON.stringify(experienceData));
  ['zh', 'en'].forEach((l) => {
    if (Array.isArray(clone[l]?.workExperiences)) {
      clone[l].workExperiences = clone[l].workExperiences.map((item: any) => {
        if (
          item.company?.includes('樂美館') ||
          item.company_en?.includes('XAC') ||
          item.role?.includes('3D 遊戲美術人員') ||
          item.role_en?.includes('3D Game Artist')
        ) {
          return { ...item, visible: true };
        }
        return item;
      });
    }
  });
  return clone;
})();

// 技能排序：互動應用開發分類移至第一順位
const interactiveSkills = (() => {
  const clone = JSON.parse(JSON.stringify(skillsData));
  const zhInteractive = clone.zh.find((c: any) => c.catType === 'game');
  const zhOthers = clone.zh.filter((c: any) => c.catType !== 'game');
  const enInteractive = clone.en.find((c: any) => c.catType === 'game');
  const enOthers = clone.en.filter((c: any) => c.catType !== 'game');

  return {
    zh: zhInteractive ? [zhInteractive, ...zhOthers] : clone.zh,
    en: enInteractive ? [enInteractive, ...enOthers] : clone.en,
  };
})();

// 專案排序：Interactive 專案優先
const interactiveProjects = (() => {
  const clone = JSON.parse(JSON.stringify(projectsData));
  const interactiveItems = clone.filter((p: any) => p.category === 'interactive');
  const otherItems = clone.filter((p: any) => p.category !== 'interactive');
  return [...interactiveItems, ...otherItems];
})();

export const INTERACTIVE_FALLBACKS = {
  hero: interactiveHero,
  site_settings: interactiveSiteSettings,
  about: interactiveAbout,
  skills: interactiveSkills,
  projects: interactiveProjects,
  experience: interactiveExperience,
  certifications: certsData,
  gallery: galleryData,
  site_translations: siteTranslations,
};

/**
 * 依據 Profile 取得對應之安全降級資料集合
 */
export function getFallbacksByProfile(profile: ProfileType = 'fullstack') {
  return profile === 'interactive' ? INTERACTIVE_FALLBACKS : FULLSTACK_FALLBACKS;
}

// 保持既有匯出以維持向前相容性
export const LOCAL_FALLBACKS = FULLSTACK_FALLBACKS;

export type PortfolioDocId = keyof typeof FULLSTACK_FALLBACKS;

/**
 * 讀取指定文檔資料（優先從 Firestore 讀取，若無資料或錯誤則降級至對應 Profile 的本地 JSON）
 */
export async function getPortfolioDoc<T>(
  docId: PortfolioDocId,
  profile: ProfileType = 'fullstack'
): Promise<T> {
  const fallbacks = getFallbacksByProfile(profile);
  const fallback = fallbacks[docId] as unknown as T;

  const ctx = await getFirestoreContext();
  if (!ctx) {
    return fallback;
  }

  try {
    const { db, firestore } = ctx;
    const collectionName = getCollectionName(profile);
    const docRef = firestore.doc(db, collectionName, docId);
    const snap = await firestore.getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      // 移除內建時間戳記後回傳核心資料
      const { _updatedAt, ...content } = data;
      return (content.payload !== undefined ? content.payload : content) as T;
    }
  } catch (error) {
    console.warn(`[DataService]: Failed to fetch ${docId} from Firestore (${profile}), using local fallback.`, error);
  }

  return fallback;
}

/**
 * 儲存指定文檔資料至對應 Profile 的 Firestore 集合
 */
export async function savePortfolioDoc<T>(
  docId: PortfolioDocId,
  payload: T,
  profile: ProfileType = 'fullstack'
): Promise<boolean> {
  const ctx = await getFirestoreContext();
  if (!ctx) {
    console.error(`[DataService]: Firestore not initialized. Unable to save ${docId}.`);
    throw new Error('Firebase Firestore 尚未初始化，無法寫入雲端資料庫');
  }

  try {
    const { db, firestore } = ctx;
    const collectionName = getCollectionName(profile);
    const docRef = firestore.doc(db, collectionName, docId);
    await firestore.setDoc(docRef, {
      payload,
      _updatedAt: firestore.serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`[DataService]: Failed to save ${docId} to Firestore (${profile}):`, error);
    throw error;
  }
}

/**
 * 一鍵將本地指定 Profile 的所有靜態 JSON 同步/初始化上傳至 Firestore 對應集合
 */
export async function seedFirestoreFromLocalJson(
  profile: ProfileType = 'fullstack'
): Promise<{ success: boolean; count: number; error?: string }> {
  const ctx = await getFirestoreContext();
  if (!ctx) {
    return { success: false, count: 0, error: 'Firebase 尚未正確初始化' };
  }

  try {
    const fallbacks = getFallbacksByProfile(profile);
    const keys = Object.keys(fallbacks) as PortfolioDocId[];
    let count = 0;

    for (const key of keys) {
      await savePortfolioDoc(key, fallbacks[key], profile);
      count++;
    }

    return { success: true, count };
  } catch (error: any) {
    console.error(`[DataService]: Seed Firestore failed for profile ${profile}:`, error);
    return { success: false, count: 0, error: error?.message || '未知錯誤' };
  }
}
