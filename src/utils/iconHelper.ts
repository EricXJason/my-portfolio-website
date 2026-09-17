/**
 * ============================================================================
 * 檔案名稱: iconHelper.ts
 * 所屬模組: Shared Presentation Utility Layer (向量圖示共用轉換模組)
 * 責任描述: 負責提供全站與 CMS 通用之 Lucide 向量圖示名稱映射、別名對齊與預設圖示回退。
 *           物理隔離前臺展示與 CMS 管理後臺，避免前臺首屏因圖示解析而誤載入 CMS 巨型代碼塊。
 * 架構分層: Utility Layer (Shared Presentation Contract)
 * 依賴關係: 依賴 lucide-react 向量圖示庫。
 * 邊界處理: 查無名稱時自動回退至 Star 圖示，支援大小寫不敏感、底線連字號容錯與領域別名推斷。
 * ============================================================================
 */

import {
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
  type LucideIcon,
} from 'lucide-react';

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
    cert: Award,
    certificate: Award,
    certification: Award,
    paper: FileText,
    thesis: FileText,
    publication: Scroll,
    conference: Presentation,
    workshop: Presentation,
    speech: Presentation,
    award: Award,
    trophy: Trophy,
    rank: Medal,
    transcript: Scroll,
    diploma: GraduationCap,
    work: Briefcase,
    job: Briefcase,
    company: Building,
    phone: Phone,
    email: Mail,
    line: MessageSquare,
  };

  return aliasMap[normalized] || Star;
};
