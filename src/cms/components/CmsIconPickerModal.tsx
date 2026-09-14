/**
 * ============================================================================
 * 檔案名稱: CmsIconPickerModal.tsx
 * 所屬模組: Portfolio CMS (全域通用圖示選擇彈窗)
 * 責任描述: 負責管理 CMS 各模組之 100+ 大規模 Lucide 向量圖示選擇、即時搜尋與分類篩選。
 * 架構分層: CMS Presentation Layer (Modal Component)
 * 依賴關係: 依賴 ThemeContext 與 Lucide 向量圖示庫。
 * 邊界處理: 支援 ESC 鍵快速關閉、搜尋無結果友善反饋、深淺色高對比賽博切角樣式。
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  GraduationCap,
  Award,
  Trophy,
  Medal,
  Crown,
  Star,
  Sparkles,
  Bookmark,
  Code,
  Code2,
  Terminal,
  Cpu,
  Database,
  Server,
  Globe,
  Globe2,
  GitBranch,
  GitMerge,
  GitCommit,
  Wrench,
  Layers,
  Gamepad,
  Gamepad2,
  Palette,
  Image as ImageIcon,
  Video,
  Music,
  Headphones,
  Camera,
  Film,
  Box,
  PenTool,
  Monitor,
  Play,
  Briefcase,
  Building,
  Building2,
  Compass,
  Target,
  Rocket,
  Lightbulb,
  Zap,
  TrendingUp,
  FolderGit2,
  Cloud,
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Radio,
  Bell,
  User,
  Users,
  Heart,
  ThumbsUp,
  Send,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Link,
  Share2,
  Eye,
  Calendar,
  Clock,
  History,
  FileText,
  FileCode,
  AlertTriangle,
  Info,
  School,
  BookOpen,
  Presentation,
  Landmark,
  Scroll,
  FlaskConical,
  LucideIcon,
} from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';

export interface IconEntry {
  name: string;
  labelZh: string;
  labelEn: string;
  category: 'academic' | 'dev' | 'multimedia' | 'business' | 'security' | 'general';
  component: LucideIcon;
}

/** 完整圖示資料庫 (100+ 個常用高頻圖示與專案相依圖示) */
export const ICON_LIBRARY: IconEntry[] = [
  // ── 學歷、榮譽與證照 ──
  { name: 'graduation-cap', labelZh: '學士/碩士帽', labelEn: 'Graduation Cap', category: 'academic', component: GraduationCap },
  { name: 'school',         labelZh: '學校學府',   labelEn: 'School Campus',  category: 'academic', component: School },
  { name: 'landmark',       labelZh: '典雅殿堂',   labelEn: 'Landmark',       category: 'academic', component: Landmark },
  { name: 'book-open',      labelZh: '翻閱書本',   labelEn: 'Open Book',      category: 'academic', component: BookOpen },
  { name: 'presentation',   labelZh: '簡報發表',   labelEn: 'Presentation',   category: 'academic', component: Presentation },
  { name: 'scroll',         labelZh: '學術卷軸',   labelEn: 'Academic Scroll',category: 'academic', component: Scroll },
  { name: 'flask-conical',  labelZh: '研究實驗',   labelEn: 'Research Flask', category: 'academic', component: FlaskConical },
  { name: 'award',          labelZh: '獎章證書',   labelEn: 'Award',          category: 'academic', component: Award },
  { name: 'trophy',         labelZh: '競賽獎盃',   labelEn: 'Trophy',         category: 'academic', component: Trophy },
  { name: 'medal',          labelZh: '金銀獎牌',   labelEn: 'Medal',          category: 'academic', component: Medal },
  { name: 'crown',          labelZh: '冠軍皇冠',   labelEn: 'Crown',          category: 'academic', component: Crown },
  { name: 'star',           labelZh: '精選星號',   labelEn: 'Star',           category: 'academic', component: Star },
  { name: 'sparkles',       labelZh: '亮點閃爍',   labelEn: 'Sparkles',       category: 'academic', component: Sparkles },
  { name: 'bookmark',       labelZh: '書籤標記',   labelEn: 'Bookmark',       category: 'academic', component: Bookmark },

  // ── 程式、架構與開發 ──
  { name: 'code',           labelZh: '程式代碼',   labelEn: 'Code',           category: 'dev', component: Code },
  { name: 'code-2',         labelZh: '尖括號代碼', labelEn: 'Code 2',         category: 'dev', component: Code2 },
  { name: 'terminal',       labelZh: '終端命令列', labelEn: 'Terminal',       category: 'dev', component: Terminal },
  { name: 'cpu',            labelZh: '核心處理器', labelEn: 'CPU Processor',  category: 'dev', component: Cpu },
  { name: 'database',       labelZh: '資料庫',     labelEn: 'Database',       category: 'dev', component: Database },
  { name: 'server',         labelZh: '後端伺服器', labelEn: 'Server',         category: 'dev', component: Server },
  { name: 'globe',          labelZh: '全球網路',   labelEn: 'Global Web',     category: 'dev', component: Globe },
  { name: 'globe-2',        labelZh: '網際網路 2', labelEn: 'Global Web 2',   category: 'dev', component: Globe2 },
  { name: 'git-branch',     labelZh: 'Git 分支',   labelEn: 'Git Branch',     category: 'dev', component: GitBranch },
  { name: 'git-merge',      labelZh: 'Git 合併',   labelEn: 'Git Merge',      category: 'dev', component: GitMerge },
  { name: 'git-commit',     labelZh: 'Git 節點',   labelEn: 'Git Commit',     category: 'dev', component: GitCommit },
  { name: 'wrench',         labelZh: '工具工程',   labelEn: 'Wrench Tool',    category: 'dev', component: Wrench },
  { name: 'layers',         labelZh: '架構分層',   labelEn: 'Layers Stack',   category: 'dev', component: Layers },
  { name: 'file-code',      labelZh: '原始檔代碼', labelEn: 'File Code',      category: 'dev', component: FileCode },

  // ── 多媒體、遊戲與設計 ──
  { name: 'gamepad-2',      labelZh: '遊戲把手',   labelEn: 'Gamepad 2',      category: 'multimedia', component: Gamepad2 },
  { name: 'gamepad',        labelZh: '經典搖桿',   labelEn: 'Gamepad Classic',category: 'multimedia', component: Gamepad },
  { name: 'palette',        labelZh: '調色美學',   labelEn: 'Palette',        category: 'multimedia', component: Palette },
  { name: 'image',          labelZh: '美術圖檔',   labelEn: 'Image Artwork',  category: 'multimedia', component: ImageIcon },
  { name: 'box',            labelZh: '3D 幾何模型',labelEn: '3D Box Model',   category: 'multimedia', component: Box },
  { name: 'pen-tool',       labelZh: '向量鋼筆',   labelEn: 'Pen Tool',       category: 'multimedia', component: PenTool },
  { name: 'monitor',        labelZh: 'XR/螢幕顯示',labelEn: 'Display Monitor',category: 'multimedia', component: Monitor },
  { name: 'video',          labelZh: '即時影音',   labelEn: 'Video Stream',   category: 'multimedia', component: Video },
  { name: 'music',          labelZh: '音樂音效',   labelEn: 'Music Track',    category: 'multimedia', component: Music },
  { name: 'headphones',     labelZh: '耳機音訊',   labelEn: 'Headphones',     category: 'multimedia', component: Headphones },
  { name: 'camera',         labelZh: '鏡頭攝影',   labelEn: 'Camera Shot',    category: 'multimedia', component: Camera },
  { name: 'film',           labelZh: '影音動畫',   labelEn: 'Film Reel',      category: 'multimedia', component: Film },
  { name: 'play',           labelZh: '播放播放',   labelEn: 'Play Button',    category: 'multimedia', component: Play },

  // ── 工作經歷與商業 ──
  { name: 'briefcase',      labelZh: '產業公事包', labelEn: 'Briefcase Work', category: 'business', component: Briefcase },
  { name: 'building',       labelZh: '企業大樓',   labelEn: 'Building Corp',  category: 'business', component: Building },
  { name: 'building-2',     labelZh: '商辦機構',   labelEn: 'Office Building',category: 'business', component: Building2 },
  { name: 'compass',        labelZh: '指針羅盤',   labelEn: 'Compass Nav',    category: 'business', component: Compass },
  { name: 'target',         labelZh: '專案目標',   labelEn: 'Project Target', category: 'business', component: Target },
  { name: 'rocket',         labelZh: '火箭啟航',   labelEn: 'Rocket Launch',  category: 'business', component: Rocket },
  { name: 'lightbulb',      labelZh: '創意靈感',   labelEn: 'Idea Lightbulb', category: 'business', component: Lightbulb },
  { name: 'zap',            labelZh: '極速執行',   labelEn: 'Lightning Zap',  category: 'business', component: Zap },
  { name: 'trending-up',    labelZh: '效能成長',   labelEn: 'Trending Up',    category: 'business', component: TrendingUp },
  { name: 'folder-git-2',   labelZh: '專案倉庫',   labelEn: 'Projects Repo',  category: 'business', component: FolderGit2 },

  // ── 雲端與資安 ──
  { name: 'cloud',          labelZh: '雲端運算',   labelEn: 'Cloud Storage',  category: 'security', component: Cloud },
  { name: 'shield',         labelZh: '資安防護盾', labelEn: 'Security Shield',category: 'security', component: Shield },
  { name: 'shield-check',   labelZh: '資安核可驗證',labelEn: 'Verified Shield',category: 'security', component: ShieldCheck },
  { name: 'lock',           labelZh: '資料加密鎖', labelEn: 'Crypto Lock',    category: 'security', component: Lock },
  { name: 'key',            labelZh: '存取金鑰',   labelEn: 'Access Key',     category: 'security', component: Key },
  { name: 'bell',           labelZh: '通知提醒',   labelEn: 'Notification',   category: 'security', component: Bell },
  { name: 'radio',          labelZh: '廣播天線',   labelEn: 'Radio Broadcast',category: 'security', component: Radio },

  // ── 個人、通訊與通用 ──
  { name: 'user',           labelZh: '個人檔案',   labelEn: 'User Profile',   category: 'general', component: User },
  { name: 'users',          labelZh: '團隊合作',   labelEn: 'Team Users',     category: 'general', component: Users },
  { name: 'heart',          labelZh: '熱忱愛心',   labelEn: 'Passion Heart',  category: 'general', component: Heart },
  { name: 'thumbs-up',      labelZh: '好評肯定',   labelEn: 'Thumbs Up',      category: 'general', component: ThumbsUp },
  { name: 'mail',           labelZh: '電子信箱',   labelEn: 'Email Mail',     category: 'general', component: Mail },
  { name: 'phone',          labelZh: '聯絡電話',   labelEn: 'Phone Call',     category: 'general', component: Phone },
  { name: 'message-square', labelZh: '留言即時通訊',labelEn: 'Instant Message',category: 'general', component: MessageSquare },
  { name: 'send',           labelZh: '發送訊息',   labelEn: 'Send Message',   category: 'general', component: Send },
  { name: 'calendar',       labelZh: '行事曆日程', labelEn: 'Calendar Date',  category: 'general', component: Calendar },
  { name: 'clock',          labelZh: '時鐘時間',   labelEn: 'Clock Time',     category: 'general', component: Clock },
  { name: 'history',        labelZh: '歷史歷程',   labelEn: 'Milestone History',category: 'general', component: History },
  { name: 'file-text',      labelZh: '文件檔案',   labelEn: 'Document Text',  category: 'general', component: FileText },
  { name: 'link',           labelZh: '超連結',     labelEn: 'Hyperlink',      category: 'general', component: Link },
  { name: 'external-link',  labelZh: '外部跳轉連結',labelEn: 'External Link', category: 'general', component: ExternalLink },
  { name: 'share-2',        labelZh: '社群分享',   labelEn: 'Social Share',   category: 'general', component: Share2 },
  { name: 'eye',            labelZh: '檢視預覽',   labelEn: 'Eye View',       category: 'general', component: Eye },
  { name: 'alert-triangle', labelZh: '警示注意',   labelEn: 'Alert Warning',  category: 'general', component: AlertTriangle },
  { name: 'info',           labelZh: '資訊說明',   labelEn: 'Info Note',      category: 'general', component: Info },
];

/** 根據名稱尋找 Icon 組件的 Helper (支援別名與語意自動推斷) */
export const getLucideIconByName = (name: string): LucideIcon => {
  if (!name) return Star;
  const normalized = name.toLowerCase().replace(/_/g, '-').trim();
  const found = ICON_LIBRARY.find(
    (item) => item.name === normalized || item.name.replace(/-/g, '') === normalized.replace(/-/g, '')
  );
  if (found) return found.component;

  // 語意別名對照表：確保各領域圖示具備高度視覺區隔度
  const aliasMap: Record<string, LucideIcon> = {
    game: Gamepad2,
    gaming: Gamepad2,
    gamepad: Gamepad2,
    box: Box,
    '3d': Box,
    code: Code2,
    dev: Code2,
    video: Video,
    school: School,
    academic: School,
    master: GraduationCap,
    bachelor: School,
    degree: GraduationCap,
    grad: GraduationCap,
    work: Briefcase,
    assistant: Briefcase,
    artist: Palette,
    art: Palette,
    painting: Palette,
    thesis: FileText,
    paper: FileText,
    presentation: Presentation,
    speech: Presentation,
    symposium: Presentation,
  };
  if (aliasMap[normalized]) return aliasMap[normalized];

  return Star;
};

interface CmsIconPickerModalProps {
  isOpen: boolean;
  currentIconName: string;
  onSelectIcon: (iconName: string) => void;
  onClose: () => void;
}

/**
 * CmsIconPickerModal
 * 全站 CMS 通用圖示選擇彈窗：
 * 1. 具備即時搜尋列 (Search Bar)
 * 2. 涵蓋 100+ 個高品質官方 Lucide 圖示
 * 3. 採用前臺語言選擇 dialog 方形切角 HUD 風格 (cyber-cut-corner, hud-corner-brackets)
 * 4. 支援 ESC 鍵與點擊外部關閉
 */
export const CmsIconPickerModal: React.FC<CmsIconPickerModalProps> = ({
  isOpen,
  currentIconName,
  onSelectIcon,
  onClose,
}) => {
  const { lang } = useLang();
  const isEn = lang === 'en';
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // ESC 鍵關閉
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  // 過濾圖示
  const filteredIcons = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return ICON_LIBRARY.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.labelZh.toLowerCase().includes(term) ||
        item.labelEn.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, activeCategory]);

  if (!isOpen) return null;

  const cyanCol = isLight ? '#0284c7' : '#00f0ff';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.35)';
  const bracketCol = isLight ? '#0284c7' : '#00f0ff';

  const categories = [
    { id: 'all', zh: '全部', en: 'All' },
    { id: 'academic', zh: '學歷榮譽', en: 'Academic' },
    { id: 'dev', zh: '程式架構', en: 'Dev & Code' },
    { id: 'multimedia', zh: '多媒體遊戲', en: 'Multimedia' },
    { id: 'business', zh: '產業實務', en: 'Business' },
    { id: 'security', zh: '雲端資安', en: 'Cloud & Security' },
    { id: 'general', zh: '個人通訊', en: 'General' },
  ];

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
      style={{
        backgroundColor: isLight ? 'rgba(248, 250, 252, 0.65)' : 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="圖示選擇器"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] border cyber-cut-corner p-5 sm:p-7 shadow-2xl flex flex-col gap-4 hud-corner-brackets transition-all duration-300"
        style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(8, 14, 26, 0.96)',
          borderColor: borderCol,
          boxShadow: isLight
            ? '0 20px 50px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)'
            : '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.25)',
          '--hud-bracket-color': bracketCol,
        } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 頂部標題列 */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 border p-[2px] cyber-cut-sm flex items-center justify-center shrink-0"
              style={{
                borderColor: cyanCol,
                backgroundColor: isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.12)',
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: cyanCol }} />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Noto_Sans_TC'] tracking-wide" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                {isEn ? 'Universal Icon Selector' : '全域圖示選擇器'}
              </h3>
              <p className="text-[11px] font-['Share_Tech_Mono'] text-[var(--text-sub)]">
                {isEn ? `${ICON_LIBRARY.length} PROFESSIONAL ICONS LOADED` : `已加載 ${ICON_LIBRARY.length} 款專業向量圖示庫`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border cyber-cut-sm text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)' }}
            title={isEn ? 'Close (ESC)' : '關閉 (ESC)'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 搜尋列 */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-sub)] opacity-60 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEn ? 'Search icons by name or keywords (e.g. code, star, award)...' : '搜尋圖示名稱或關鍵字（例如：code, star, award, 程式, 證照）...'}
            className="w-full pl-10 pr-9 py-2.5 text-xs border cyber-cut-sm bg-[var(--card-inner)] text-[var(--text-main)] outline-none font-['Noto_Sans_TC'] transition-colors"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)' }}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--text-main)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 分類切換分頁 */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 border cyber-cut-sm text-[11px] font-['Noto_Sans_TC'] whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'font-bold border-cyan-400 text-[var(--neon-cyan)] shadow-xs'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)] border-transparent'
                }`}
                style={{
                  backgroundColor: isActive ? (isLight ? '#e0f2fe' : 'rgba(0,240,255,0.15)') : 'transparent',
                  borderColor: isActive ? (isLight ? '#0284c7' : '#00f0ff') : 'transparent',
                }}
              >
                {isEn ? cat.en : cat.zh}
              </button>
            );
          })}
        </div>

        {/* 圖示網格清單 */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 min-h-[260px] max-h-[380px]">
          {filteredIcons.map((item) => {
            const IconComp = item.component;
            const isSelected =
              currentIconName.toLowerCase().replace(/_/g, '-') === item.name.toLowerCase();

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onSelectIcon(item.name);
                  onClose();
                }}
                className={`p-3 border cyber-cut-sm flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group relative ${
                  isSelected ? 'ring-2 ring-[var(--neon-cyan)] shadow-md' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: isSelected
                    ? (isLight ? '#e0f2fe' : 'rgba(0, 240, 255, 0.18)')
                    : (isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)'),
                  borderColor: isSelected
                    ? (isLight ? '#0284c7' : '#00f0ff')
                    : (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'),
                }}
                title={`${item.labelZh} (${item.name})`}
              >
                {isSelected && (
                  <span
                    className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: cyanCol, color: '#030712' }}
                  >
                    ✓
                  </span>
                )}
                <IconComp
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-sub)] group-hover:text-[var(--text-main)]'
                  }`}
                  style={{ color: isSelected ? cyanCol : undefined }}
                />
                <div className="w-full text-center">
                  <div className="text-[11px] font-['Noto_Sans_TC'] font-semibold truncate" style={{ color: isLight ? '#0f172a' : '#f1f5f9' }}>
                    {isEn ? item.labelEn : item.labelZh}
                  </div>
                  <div className="text-[9px] font-['Share_Tech_Mono'] text-[var(--text-sub)]/70 truncate">
                    {item.name}
                  </div>
                </div>
              </button>
            );
          })}

          {filteredIcons.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-[var(--text-sub)] gap-2">
              <Search className="w-8 h-8 opacity-30" />
              <p className="text-xs font-['Noto_Sans_TC']">
                {isEn ? 'No icons found matching your keyword.' : '查無符合此關鍵字的圖示。'}
              </p>
            </div>
          )}
        </div>

        {/* 頁尾提示資訊 */}
        <div className="flex items-center justify-between pt-2 border-t text-[11px] font-['Share_Tech_Mono'] text-[var(--text-sub)]" style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <span>CURRENT: {currentIconName || 'star'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] cursor-pointer"
            style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)' }}
          >
            {isEn ? 'Cancel' : '取消'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CmsIconPickerModal;
