/**
 * ============================================================================
 * 檔案名稱: portfolio.ts
 * 所屬模組: Core Data Types & CMS Contracts
 * 責任描述: 定義全站作品集前端展示與 CMS 編輯之統一資料模型契約 (Single Source of Truth)，
 *           供 React 元件、CMS 表單與未來 Firebase 資料庫持久化全面對齊。
 * 架構分層: Types & Domain Model Layer
 * 邊界處理: 支援雙語多國語言結構 (zh / en)，區隔多語文字與跨語系同步之結構欄位。
 * ============================================================================
 */

/** 1. 網站全域設定 (Site Settings) */
export interface SiteNavNames {
  nav_home: string;
  nav_about: string;
  nav_skills: string;
  nav_projects: string;
  nav_awards: string;
  nav_experience: string;
  nav_gallery: string;
}

export interface SiteLanguageSetting {
  htmlTitle: string;
  headerTop: string;
  headerBottom: string;
  navNames: SiteNavNames;
}

export interface SiteSettingsData {
  codeAnimationSpeed: number;
  zh: SiteLanguageSetting;
  en: SiteLanguageSetting;
}

/** 2. 首頁 Hero 區塊 (Hero Section) */
export interface HeroContactItem {
  id: string;
  label: string;
  value: string;
  copyValue?: string;
  link?: string;
  visible?: boolean;
}

export interface HeroLinks {
  github: string;
  artstation: string;
}

export interface HeroLocaleData {
  greeting: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  btn_projects: string;
  btn_contact: string;
  badge?: string;
}

export interface HeroSectionData {
  zh: HeroLocaleData;
  en: HeroLocaleData;
  links: HeroLinks;
  contacts: HeroContactItem[];
  showGithub?: boolean;
  showArtstation?: boolean;
}

export interface AboutStatItem {
  id: string;
  title: string;
  label: string;
  icon: string;
  visible?: boolean;
}

export interface AboutLocaleData {
  title: string;
  intro: string;
  heading: string;
  p1: string;
  stats: AboutStatItem[];
}

export interface AboutSectionData {
  avatarUrl?: string;
  zh: AboutLocaleData;
  en: AboutLocaleData;
}

/** 4. 專業技能區塊 (Skills Section) */
export interface SkillDetailItem {
  label: string;
  content: string;
  visible?: boolean;
}

export interface SkillCategoryData {
  id: string;
  name: string;
  subtitle: string;
  accentColor: string;
  items: SkillDetailItem[];
  visible?: boolean; // 根分類固定顯示 (預設 true)
}

export interface SkillsLocaleData {
  title: string;
  subtitle: string;
  categories: SkillCategoryData[];
}

export interface SkillsSectionData {
  zh: SkillsLocaleData;
  en: SkillsLocaleData;
}

/** 5. 專案作品區塊 (Projects Section) */
export interface ProjectActionLink {
  label?: string;
  url: string;
  icon?: string;
}

export interface ProjectItemData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  category: 'interactive' | 'fullstack';
  tags: string[];
  techStack?: string[];
  image: string;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  frontendUrl?: string;
  backendUrl?: string;
  isAiDev?: boolean; // AI 輔助開發
  visible?: boolean;
  featured?: boolean;
  actions?: {
    custom1?: ProjectActionLink;
    custom2?: ProjectActionLink;
  };
}

export interface ProjectsLocaleData {
  title: string;
  subtitle: string;
  interactive_title: string;
  interactive_subtitle: string;
  fullstack_title: string;
  fullstack_subtitle: string;
  projects: ProjectItemData[];
}

export interface ProjectsSectionData {
  zh: ProjectsLocaleData;
  en: ProjectsLocaleData;
}

/** 6. 歷程經歷區塊 (Experience Section) */
export interface DegreeItemData {
  id: string;
  school: string;
  major: string;
  degree: string;
  type: 'master' | 'bachelor';
  period: string; // YYYY/MM ~ YYYY/MM (強制兩位數月份)
  bullets: string[];
  iconType?: string; // 固定語意圖示 (graduation-cap / school)
  visible?: boolean;
}

export interface WorkExperienceItemData {
  id: string;
  title: string;
  company: string;
  period: string; // YYYY/MM ~ YYYY/MM (強制兩位數月份)
  bullets: string[];
  iconType?: string; // 固定語意圖示 (school / palette)
  visible?: boolean;
}

export interface WorkshopItemData {
  id: string;
  title: string;
  issuer: string;
  date: string; // YYYY/MM ~ YYYY/MM 或 YYYY/MM (強制兩位數月份)
  description: string;
  certificateUrl?: string;
  hasCertificate?: boolean;
  iconType?: string;
  visible?: boolean;
}

export interface ThesisItemData {
  id: string;
  title: string;
  type: 'master' | 'conference';
  date: string; // YYYY/MM (強制兩位數月份)
  advisor?: string;
  conference?: string;
  abstract: string;
  keywords: string[];
  thesisUrl?: string;
  presentationUrl?: string;
  diplomaUrl?: string;
  transcriptUrl?: string;
  rankingUrl?: string;
  iconType?: string; // 固定語意圖示 (file-text / presentation)
  visible?: boolean;
}

export interface ExperienceLocaleData {
  title: string;
  subtitle: string;
  degrees_title: string;
  degrees_subtitle: string;
  degrees: DegreeItemData[];
  work_title: string;
  work_subtitle: string;
  workExperiences: WorkExperienceItemData[];
  workshops_title: string;
  workshops_subtitle: string;
  workshops: WorkshopItemData[];
  theses_title: string;
  theses_subtitle: string;
  theses: ThesisItemData[];
}

export interface ExperienceSectionData {
  zh: ExperienceLocaleData;
  en: ExperienceLocaleData;
}

/** 7. 專業證照區塊 (Certifications Section) */
export interface CertificationItemData {
  id: string;
  name: string;
  issuer: string;
  date: string; // YYYY/MM (強制兩位數月份)
  credentialId?: string;
  verifyUrl?: string;
  iconType?: string;
  badgeColor?: string;
  visible?: boolean;
}

export interface CertificationsLocaleData {
  title: string;
  subtitle: string;
  certifications: CertificationItemData[];
}

export interface CertificationsSectionData {
  zh: CertificationsLocaleData;
  en: CertificationsLocaleData;
}

/** 8. 美術畫廊區塊 (Gallery Section) */
export interface GalleryItemData {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tools: string[];
  visible?: boolean;
}

export interface GalleryLocaleData {
  title: string;
  subtitle: string;
  artstationUrl?: string;
  items: GalleryItemData[];
}

export interface GallerySectionData {
  zh: GalleryLocaleData;
  en: GalleryLocaleData;
}
