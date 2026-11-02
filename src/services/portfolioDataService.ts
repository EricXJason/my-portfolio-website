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
      '新媒體藝術碩士，專注 Unity (C#) 客戶端架構、XR 體感互動與遊戲核心邏輯開發。具備軟體工程架構與全端開發整合實力，能無縫打通前端體驗、後端通訊與 3D 數位資產，並熟練運用 AI 工具加速產出，兼具美術視野與工程思維，能獨立高效落實各類互動系統與流暢體驗。',
  },
  en: {
    ...heroData.en,
    subtitle: 'Fullstack Dev / Interactive App Dev',
    description:
      'Master of New Media Arts specializing in Unity (C#) client architecture, XR physical interaction, and core game logic development. Possesses software engineering architecture and fullstack integration capabilities, seamlessly bridging frontend experience, backend communications, and 3D digital assets, proficient in AI tools to accelerate delivery, combining artistic vision with engineering rigor to independently build high-performance interactive systems.',
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
    heading: '核心專長與專業定位',
    p1: '我是許哲誠，具備機械製圖底子、次世代 3D 美術管線與軟體工程的跨領域背景。專注於 Unity (C#) 客戶端架構設計，堅持高內聚、低耦合與模組解耦原則，熟練運用狀態機模式、事件驅動架構與運行期零 GC 物件池調校。同時具備全端通訊與關聯式資料庫整合視野，能無障礙銜接機構硬體、3D 美術資產與後端系統，致力於打造兼具流暢運行效能與高維護性的互動產品。',
    bio: {
      ...aboutData.zh.bio,
      title: '個人自傳',
      p1_title: '工程基礎與跨領域積累',
      p1: '具備紮實的工程邏輯與數位資產整合實力。大學期間主導開發動作射擊遊戲《滅境之星》，奪得專題競賽第一名；連續三年擔任專任研發助理，主導《飛機檢修行動學習平臺》等三項產學互動系統，深入負責介面切版、事件監聽與流程控制。於樂美館參與商業遊戲次世代 3D 外包，熟練掌握 PBR 製程，具備嚴格控管模型面數預算與 Draw Call 的美術視野。',
      p2_title: 'Unity 客戶端架構與效能調校',
      p2: '碩士期間深耕 Unity (C#) 客戶端研發，堅持高內聚、低耦合的架構原則。在 2D 節奏跑酷專案《節奏同奏》中，實作純 C# 有限狀態機徹底消滅動畫過渡衝突，並以泛型物件池循環複用高頻物件，有效降低運行期記憶體配置與 GC 卡頓；於 VR 解謎專案《覺醒協議》中深度客製空間抓取與插槽機制，並自研純數學正弦插值取代高耗能狀態機評估，有效降低 CPU 負載，確保 VR 空間維持高度流暢。',
      p3_title: '全端通訊視野與團隊協作',
      p3: '兼具全端架構與軟體工程思維，能運用後端 API 打通前後端通訊，建立完整的 Client-Server 與資料庫整合視野。在開發流程中深度整合版本控制與現代 AI 協作流程，能高效進行模組設計、邏輯排查與快速交付，致力為團隊打造兼具優秀效能與穩定可維護性的互動產品。',
    },
  },
  en: {
    ...aboutData.en,
    intro: 'M.A. graduate in New Media Art, focusing on full-stack web development and real-time interactive applications.',
    heading: 'Core Competencies & Professional Specialization',
    p1: 'I am Che-Cheng Hsu, bringing an interdisciplinary background across mechanical drafting, next-gen 3D art pipelines, and software engineering. I specialize in Unity (C#) client architecture design, adhering to high-cohesion, loose-coupling, and modular decoupling principles, proficient in finite state machines, event-driven architectures, and zero-GC object pool optimization. Concurrently equipped with fullstack communication and relational database integration vision, I seamlessly bridge hardware mechanisms, 3D artistic assets, and backend systems to deliver high-performance, maintainable interactive products.',
    bio: {
      ...aboutData.en.bio,
      title: 'Personal Biography',
      p1_title: 'Engineering Foundations & Cross-Discipline Accumulation',
      p1: 'Equipped with solid engineering logic and digital asset integration expertise. During undergraduate studies, led the development of action shooter Planet of Extinction, winning 1st place in the National Special Topic Competition; served as a full-time research assistant for 3 consecutive years, directing 3 industry-academia interactive systems such as Aircraft Maintenance Mobile Learning Platform, taking charge of UI layout, event listening, and state flow control. Participated in commercial next-gen 3D AAA outsourcing at XPEC Art Center, mastering PBR workflows with strict polygon and Draw Call budget control.',
      p2_title: 'Unity Client Architecture & Performance Profiling',
      p2: 'Dedicated to Unity (C#) client engineering during master\'s studies, adhering to high cohesion and low coupling architectural principles. In 2D rhythm runner Ensemble Rhythm, implemented pure C# finite state machines to eliminate animation transition conflicts, utilizing generic object pools to recycle high-frequency objects, effectively minimizing runtime memory allocations and GC lag; in VR puzzle project Awakening Protocol, deeply customized spatial grab and socket mechanics, developing sinusoidal mathematical interpolation to replace heavy state evaluations, cutting CPU overhead and ensuring smooth VR experiences.',
      p3_title: 'Full-Stack Communication Vision & Team Collaboration',
      p3: 'Combining fullstack architecture with software engineering rigor, proficient in connecting frontend-backend communications via RESTful APIs, establishing comprehensive Client-Server and database integration perspectives. Deeply integrating modern version control and AI-assisted workflows into the development lifecycle, facilitating efficient module design, systematic debugging, and agile delivery to build high-performance, maintainable interactive products.',
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

// 專案排序：Fullstack 與 Frontend Web 專案優先
const fullstackProjects = (() => {
  const clone = JSON.parse(JSON.stringify(projectsData));
  const webItems = clone.filter((p: any) => p.category === 'fullstack' || p.category === 'frontend');
  const otherItems = clone.filter((p: any) => p.category !== 'fullstack' && p.category !== 'frontend');
  return [...webItems, ...otherItems];
})();

// 技能排序：Fullstack 分類移至第一順位
const fullstackSkills = (() => {
  const clone = JSON.parse(JSON.stringify(skillsData));
  const zhFullstack = clone.zh.find((c: any) => c.catType === 'fullstack');
  const zhOthers = clone.zh.filter((c: any) => c.catType !== 'fullstack');
  const enFullstack = clone.en.find((c: any) => c.catType === 'fullstack');
  const enOthers = clone.en.filter((c: any) => c.catType !== 'fullstack');

  return {
    zh: zhFullstack ? [zhFullstack, ...zhOthers] : clone.zh,
    en: enFullstack ? [enFullstack, ...enOthers] : clone.en,
  };
})();

export const FULLSTACK_FALLBACKS = {
  hero: fullstackHero,
  site_settings: fullstackSiteSettings,
  about: fullstackAbout,
  skills: fullstackSkills,
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
      '新媒體藝術碩士，專注 Unity (C#) 客戶端架構、XR 體感互動與遊戲核心邏輯開發。具備軟體工程架構與全端開發整合實力，能無縫打通前端體驗、後端通訊與 3D 數位資產，並熟練運用 AI 工具加速產出，兼具美術視野與工程思維，能獨立高效落實各類互動系統與流暢體驗。',
  },
  en: {
    ...heroData.en,
    subtitle: 'Interactive App Dev / Fullstack Dev',
    description:
      'Master of New Media Arts specializing in Unity (C#) client architecture, XR physical interaction, and core game logic development. Possesses software engineering architecture and fullstack integration capabilities, seamlessly bridging frontend experience, backend communications, and 3D digital assets, proficient in AI tools to accelerate delivery, combining artistic vision with engineering rigor to independently build high-performance interactive systems.',
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
    heading: '核心專長與專業定位',
    p1: '我是許哲誠，具備機械製圖底子、次世代 3D 美術管線與軟體工程的跨領域背景。專注於 Unity (C#) 客戶端架構設計，堅持高內聚、低耦合與模組解耦原則，熟練運用狀態機模式、事件驅動架構與運行期零 GC 物件池調校。同時具備全端通訊與關聯式資料庫整合視野，能無障礙銜接機構硬體、3D 美術資產與後端系統，致力於打造兼具流暢運行效能與高維護性的互動產品。',
    bio: {
      ...aboutData.zh.bio,
      title: '個人自傳',
      p1_title: '工程基礎與跨領域積累',
      p1: '具備紮實的工程邏輯與數位資產整合實力。大學期間主導開發動作射擊遊戲《滅境之星》，奪得專題競賽第一名；連續三年擔任專任研發助理，主導《飛機檢修行動學習平臺》等三項產學互動系統，深入負責介面切版、事件監聽與流程控制。於樂美館參與商業遊戲次世代 3D 外包，熟練掌握 PBR 製程，具備嚴格控管模型面數預算與 Draw Call 的美術視野。',
      p2_title: 'Unity 客戶端架構與效能調校',
      p2: '碩士期間深耕 Unity (C#) 客戶端研發，堅持高內聚、低耦合的架構原則。在 2D 節奏跑酷專案《節奏同奏》中，實作純 C# 有限狀態機徹底消滅動畫過渡衝突，並以泛型物件池循環複用高頻物件，有效降低運行期記憶體配置與 GC 卡頓；於 VR 解謎專案《覺醒協議》中深度客製空間抓取與插槽機制，並自研純數學正弦插值取代高耗能狀態機評估，有效降低 CPU 負載，確保 VR 空間維持高度流暢。',
      p3_title: '全端通訊視野與團隊協作',
      p3: '兼具全端架構與軟體工程思維，能運用後端 API 打通前後端通訊，建立完整的 Client-Server 與資料庫整合視野。在開發流程中深度整合版本控制與現代 AI 協作流程，能高效進行模組設計、邏輯排查與快速交付，致力為團隊打造兼具優秀效能與穩定可維護性的互動產品。',
    },
  },
  en: {
    ...aboutData.en,
    intro: 'M.A. graduate in New Media Art, focusing on Unity core development, XR interactions, and real-time graphics.',
    heading: 'Core Competencies & Professional Specialization',
    p1: 'I am Che-Cheng Hsu, bringing an interdisciplinary background across mechanical drafting, next-gen 3D art pipelines, and software engineering. I specialize in Unity (C#) client architecture design, adhering to high-cohesion, loose-coupling, and modular decoupling principles, proficient in finite state machines, event-driven architectures, and zero-GC object pool optimization. Concurrently equipped with fullstack communication and relational database integration vision, I seamlessly bridge hardware mechanisms, 3D artistic assets, and backend systems to deliver high-performance, maintainable interactive products.',
    bio: {
      ...aboutData.en.bio,
      title: 'Personal Biography',
      p1_title: 'Engineering Foundations & Cross-Discipline Accumulation',
      p1: 'Equipped with solid engineering logic and digital asset integration expertise. During undergraduate studies, led the development of action shooter Planet of Extinction, winning 1st place in the National Special Topic Competition; served as a full-time research assistant for 3 consecutive years, directing 3 industry-academia interactive systems such as Aircraft Maintenance Mobile Learning Platform, taking charge of UI layout, event listening, and state flow control. Participated in commercial next-gen 3D AAA outsourcing at XPEC Art Center, mastering PBR workflows with strict polygon and Draw Call budget control.',
      p2_title: 'Unity Client Architecture & Performance Profiling',
      p2: 'Dedicated to Unity (C#) client engineering during master\'s studies, adhering to high cohesion and low coupling architectural principles. In 2D rhythm runner Ensemble Rhythm, implemented pure C# finite state machines to eliminate animation transition conflicts, utilizing generic object pools to recycle high-frequency objects, effectively minimizing runtime memory allocations and GC lag; in VR puzzle project Awakening Protocol, deeply customized spatial grab and socket mechanics, developing sinusoidal mathematical interpolation to replace heavy state evaluations, cutting CPU overhead and ensuring smooth VR experiences.',
      p3_title: 'Full-Stack Communication Vision & Team Collaboration',
      p3: 'Combining fullstack architecture with software engineering rigor, proficient in connecting frontend-backend communications via RESTful APIs, establishing comprehensive Client-Server and database integration perspectives. Deeply integrating modern version control and AI-assisted workflows into the development lifecycle, facilitating efficient module design, systematic debugging, and agile delivery to build high-performance, maintainable interactive products.',
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
