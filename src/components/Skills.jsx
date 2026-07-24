import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import {
  Gamepad2, Globe, Palette,
  Cpu, Glasses, Wifi,
  Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge,
  PenTool, Bot, FileText, Film, Box, Workflow
} from 'lucide-react';
import skillsData from '../data/skills.json';

/* Category icon map by catType */
const CAT_ICON_MAP = {
  game:  Gamepad2,
  web:   Globe,
  media: Palette,
};

/* Sub-category icon map by label (both zh & en via lowercase match) */
const LABEL_ICON_MAP = [
  { match: ['遊戲引擎', 'game engines'],             Icon: Cpu },
  { match: ['xr 實境開發', 'xr development'],        Icon: Glasses },
  { match: ['多人連線開發', 'multiplayer networking'], Icon: Wifi },
  { match: ['後端程式語言', 'backend languages'],     Icon: Code2 },
  { match: ['後端框架', 'backend frameworks'],        Icon: Server },
  { match: ['前端程式語言', 'frontend languages'],    Icon: Monitor },
  { match: ['前端框架', 'frontend frameworks'],       Icon: Layout },
  { match: ['資料庫', 'databases'],                   Icon: Database },
  { match: ['雲端', 'cloud services'],                Icon: Cloud },
  { match: ['開發與建構', 'dev & build'],             Icon: Wrench },
  { match: ['ci/cd', 'ci/cd automation'],             Icon: GitMerge },
  { match: ['視覺設計', 'visual design'],             Icon: PenTool },
  { match: ['ai 內容', 'aigc'],                       Icon: Bot },
  { match: ['流程圖', 'flowcharts'],                  Icon: FileText },
  { match: ['影片', 'video'],                         Icon: Film },
  { match: ['3d 建模', '3d modeling'],                Icon: Box },
];

const getLabelIcon = (label) => {
  const l = label.toLowerCase();
  const found = LABEL_ICON_MAP.find(entry => entry.match.some(m => l.includes(m)));
  return found ? found.Icon : Cpu;
};

/* Individual tech badge icon (SVG inline for accuracy) */
const getTechIcon = (name) => {
  const n = name.toLowerCase().trim();
  if (n === 'html' || n === 'html5' || n === 'html / css') return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#E34F26' }} viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.78-2.928-.78-.188-2.091H6.248l.375 4.177 5.347 1.482 5.344-1.482.723-8.182H8.531z"/></svg>;
  if (n === 'css' || n === 'css3') return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#1572B6' }} viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.78-2.928-.78-.188-2.091H6.248l.375 4.177 5.347 1.482 5.344-1.482.723-8.182H8.531z"/></svg>;
  if (n.includes('javascript') || n === 'js') return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#F7DF1E' }} viewBox="0 0 24 24"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-.828-.153-.153-.213-.358-.213-.559 0-.649.48-.999 1.258-.999.736 0 1.24.255 1.588.857l1.384-.808c-.658-1.29-1.89-1.922-3.359-1.922-1.996 0-3.327 1.139-3.327 2.766 0 1.218.665 2.128 2.37 2.828.915.375 1.485.645 1.68.915.225.315.225.69.045 1.05-.285.54-.99.795-1.815.795-.99 0-1.605-.405-2.04-1.23l-1.395.84c.75 1.455 2.13 2.175 3.825 2.175 2.445 0 3.75-1.245 3.75-3.015z"/></svg>;
  if (n.includes('typescript') || n === 'ts') return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#3178C6' }} viewBox="0 0 24 24"><path d="M1.125 0C.507 0 0 .507 0 1.125v21.75C0 23.493.507 24 1.125 24h21.75c.618 0 1.125-.507 1.125-1.125V1.125C24 .507 23.493 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111v2.73a6.837 6.837 0 00-1.247-.45 6.006 6.006 0 00-1.425-.162c-.675 0-1.19.125-1.545.375s-.533.612-.533 1.087c0 .288.069.525.207.713.137.187.331.344.58.468.25.125.56.238.93.338l.613.162c.75.188 1.368.413 1.856.675.488.263.856.606 1.107 1.031.25.425.375.969.375 1.632 0 .975-.331 1.762-.994 2.362-.662.6-1.612.9-2.85.9-.662 0-1.331-.062-2.006-.187a11.1 11.1 0 01-1.856-.513v-2.85c.612.35 1.25.6 1.912.75.663.15 1.288.225 1.875.225.688 0 1.206-.131 1.556-.394.35-.262.525-.631.525-1.106 0-.313-.075-.563-.225-.75a2.29 2.29 0 00-.619-.488c-.262-.137-.587-.262-.975-.375l-.656-.175c-.75-.2-1.363-.438-1.838-.713a3.02 3.02 0 01-1.087-1.05c-.25-.437-.375-.987-.375-1.65 0-.95.325-1.725.975-2.325.65-.6 1.575-.9 2.775-.9zM9.54 10.05h3.694v2.587H11.46v9.338H8.381v-9.338H6.516V10.05z"/></svg>;
  if (n.includes('react')) return <svg className="w-3.5 h-3.5 shrink-0 fill-none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="#61DAFB"/><g stroke="#61DAFB" strokeWidth="1.2"><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)"/></g></svg>;
  if (n.includes('angular')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#DD0031' }} viewBox="0 0 24 24"><path d="M12 0L1.75 3.6 3.32 17.65 12 24l8.68-6.35L22.25 3.6 12 0zm0 3.8l6.47 14.5h-2.35l-1.3-3.25H9.18L7.88 18.3H5.53L12 3.8zm1.95 9.25L12 8.1l-1.95 4.95h3.9z"/></svg>;
  if (n.includes('scss') || n.includes('sass')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#CC6699' }} viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.176 16.544c-1.378 1.3-3.69 1.76-5.834 1.345-2.66-.516-4.52-2.673-4.52-5.385 0-3.037 2.37-5.5 5.5-5.5 2.14 0 4.02 1.25 4.88 3.12l-2.02.82c-.44-.96-1.47-1.6-2.66-1.6-1.74 0-3.14 1.4-3.14 3.14 0 1.52 1.04 2.76 2.5 3.06 1.3.26 2.78-.02 3.62-.82l1.674 1.82z"/></svg>;
  if (n.includes('tailwind')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#38BDF8' }} viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>;
  if (n.includes('bootstrap')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#7952B3' }} viewBox="0 0 24 24"><path d="M14.07 10.22c.98.24 1.58.98 1.58 2.06 0 1.5-1.12 2.52-3.1 2.52H8.8V8.42h3.42c1.7 0 2.76.84 2.76 2.1 0 .9-.54 1.54-1.41 1.7zm-3.22-.44h1.44c.82 0 1.34-.34 1.34-.96 0-.64-.52-.98-1.34-.98h-1.44v1.94zm0 3.7h1.66c.92 0 1.48-.38 1.48-1.04 0-.68-.56-1.04-1.48-1.04h-1.66v2.08zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/></svg>;
  if (n.includes('spring')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#6DB33F' }} viewBox="0 0 24 24"><path d="M22.08 1.92c-.14.28-.43.43-.72.43-.86 0-3.32 1.43-4.44 2.56-1.43 1.43-2.58 3.32-3.6 5.32 1.58 1.58 3.16 3.16 4.74 4.74 2-1.02 3.89-2.17 5.32-3.6 1.13-1.12 2.56-3.58 2.56-4.44 0-.29-.15-.58-.43-.72L22.08 1.92z"/></svg>;
  if (n.includes('java') && !n.includes('javascript')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#ED8B00' }} viewBox="0 0 24 24"><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.474 3.618-.474s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.895 3.776-.895M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.543 1.644-2.469 6.197-3.665 5.19-7.623M9.734 23.924c4.322.277 10.959-.153 11.116-2.19 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.631"/></svg>;
  if (n.includes('python')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#3776AB' }} viewBox="0 0 24 24"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.959 3.403 5.959h2.034v-2.867s-.109-3.402 3.35-3.402h5.766s3.24.052 3.24-3.131V3.261S18.28 0 11.914 0zm-3.21 1.874a1.049 1.049 0 110 2.098 1.049 1.049 0 010-2.098zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.959-3.403-5.959h-2.034v2.867s.109 3.402-3.35 3.402H9.447s-3.24-.052-3.24 3.131v5.227S5.72 24 12.086 24zm3.21-1.874a1.049 1.049 0 110-2.098 1.049 1.049 0 010 2.098z"/></svg>;
  if (n.includes('mysql')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#4479A1' }} viewBox="0 0 24 24"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.19.213.29.054.072.108.149.163.221l.014-.015c.028-.133.005-.32-.13-.542zm5.405 7.515h-.104c-.055.087-.141.163-.215.236l-.008-.006c.061-.123.094-.249.14-.373-.215.07-.395.159-.57.258l.074.009c-.008.076-.02.136-.035.202l-.022.005c.046-.141.075-.278.107-.412-.25.094-.483.195-.703.304l.065.025c-.04.11-.086.206-.13.3l-.025.002c.037-.118.076-.22.108-.325-.215.095-.41.2-.6.305l.073.017c-.045.112-.087.222-.132.333l-.01-.004c.048-.124.086-.247.12-.37-.183.091-.356.189-.53.286l.041.018c-.037.09-.083.17-.129.249l-.008-.003c.047-.095.087-.188.129-.285l-.16.09a.81.81 0 01-.124.166c.145.047.186-.12.28-.173-.011.046-.025.089-.039.131.175-.081.351-.162.53-.24l-.024-.031a6.32 6.32 0 01.122-.269c.19-.093.383-.182.576-.27l-.01-.035c.04-.112.087-.217.13-.32.198-.087.398-.168.597-.248l.004.014c-.036.095-.075.185-.112.275a5.18 5.18 0 01.616-.21l-.012-.034c.044-.109.09-.212.133-.318.217-.075.437-.14.655-.205l.003.015c-.038.087-.077.168-.117.252.245-.055.494-.1.74-.138l-.009-.04c.046-.102.091-.202.133-.3.24-.04.482-.07.722-.095z"/></svg>;
  if (n.includes('postgres')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#4169E1' }} viewBox="0 0 24 24"><path d="M23.5615 14.535c-.2137-.0918-.4307-.1518-.6505-.1768.095-.1683.178-.3421.247-.5198.6394-1.6635.3901-3.5453-.671-5.0884C21.7 7.3 19.8 6.1 17.8 5.9c-.3-.03-.6-.04-.9-.03-.7-1.1-1.8-1.9-3.1-2.3C12.5 3.1 11.1 3.1 9.8 3.5 8.6 3 7.3 2.9 6.1 3.2 3.3 3.9 1.5 6.4 1.6 9.2c-.3.4-.5.9-.6 1.4-.2 1.1 0 2.3.7 3.2.2.3.4.5.7.7-.1.7-.1 1.4.1 2.1.5 1.8 1.9 3.2 3.7 3.6.5.1 1.1.2 1.6.1.4.5 1 .9 1.6 1.1 1 .3 2 .2 2.9-.2.3.1.6.2.9.3 1.8.4 3.6-.2 4.8-1.5.2-.2.3-.4.5-.7.5.1 1 .1 1.5-.1.8-.3 1.4-.9 1.6-1.7.2-.7.1-1.4-.3-2z"/></svg>;
  if (n.includes('docker')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#2496ED' }} viewBox="0 0 24 24"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.185.185 0 00.186-.186V3.574a.185.185 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.956 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.144a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm5.886 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.956 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.144a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185z"/></svg>;
  if (n.includes('git') && !n.includes('hub') && !n.includes('action')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#F05032' }} viewBox="0 0 24 24"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.216 1.398-.063 1.897.437.5.5.65 1.256.434 1.904l2.66 2.66c.648-.216 1.403-.063 1.902.437.7.7.7 1.838 0 2.538-.7.7-1.838.7-2.538 0-.52-.52-.662-1.284-.426-1.935L12.7 8.736v6.924c.216.082.42.203.59.37.7.7.7 1.838 0 2.538-.7.7-1.838.7-2.538 0-.7-.7-.7-1.838 0-2.538.226-.226.5-.375.795-.45V8.583c-.294-.076-.57-.225-.795-.45-.526-.526-.664-1.303-.414-1.96L7.548 3.39 1.433 9.505c-.603.604-.603 1.582 0 2.188l10.48 10.478c.604.604 1.582.604 2.186 0l9.447-9.446c.604-.603.604-1.58 0-2.184z"/></svg>;
  if (n.includes('github actions')) return <Workflow className="w-3.5 h-3.5 shrink-0" style={{ color: '#2088FF' }} />;
  if (n.includes('vite')) return <svg className="w-3.5 h-3.5 shrink-0 fill-current" style={{ color: '#646CFF' }} viewBox="0 0 24 24"><path d="M22.632 3.633L12.753 22.37a.89.89 0 01-1.564 0L1.368 3.633a.89.89 0 01.81-1.317h19.645a.89.89 0 01.809 1.317z"/></svg>;
  if (n.includes('unity')) return <Gamepad2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#22d3ee' }} />;
  if (n.includes('unreal')) return <Gamepad2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#a855f7' }} />;
  if (n.includes('vuforia') || n.includes('meta sdk') || n.includes('xr interaction')) return <Glasses className="w-3.5 h-3.5 shrink-0" style={{ color: '#22d3ee' }} />;
  if (n.includes('netcode') || n.includes('photon')) return <Wifi className="w-3.5 h-3.5 shrink-0" style={{ color: '#34d399' }} />;
  if (n.includes('figma')) return <PenTool className="w-3.5 h-3.5 shrink-0" style={{ color: '#F24E1E' }} />;
  if (n.includes('photoshop') || n.includes('canva')) return <Box className="w-3.5 h-3.5 shrink-0" style={{ color: '#31A8FF' }} />;
  if (n.includes('illustrator')) return <PenTool className="w-3.5 h-3.5 shrink-0" style={{ color: '#FF9A00' }} />;
  if (n.includes('blender') || n.includes('maya') || n.includes('3dsmax') || n.includes('autocad') || n.includes('rizom') || n.includes('zbrush') || n.includes('substance')) return <Box className="w-3.5 h-3.5 shrink-0" style={{ color: '#EA7600' }} />;
  if (n.includes('premiere') || n.includes('davinci')) return <Film className="w-3.5 h-3.5 shrink-0" style={{ color: '#9999FF' }} />;
  if (n.includes('chatgpt') || n.includes('gemini') || n.includes('comfyui') || n.includes('suno')) return <Bot className="w-3.5 h-3.5 shrink-0" style={{ color: '#10b981' }} />;
  if (n.includes('aws') || n.includes('gcp')) return <Cloud className="w-3.5 h-3.5 shrink-0" style={{ color: '#38bdf8' }} />;
  if (n.includes('draw.io') || n.includes('word') || n.includes('excel') || n.includes('powerpoint')) return <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: '#c084fc' }} />;
  if (n.includes('hibernate') || n.includes('flask') || n.includes('django') || n.includes('spring')) return <Server className="w-3.5 h-3.5 shrink-0" style={{ color: '#6DB33F' }} />;
  // Default
  return <Cpu className="w-3.5 h-3.5 shrink-0 text-cyan-400" />;
};

export const Skills = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentSkills = skillsData[lang] ?? skillsData.zh;

  return (
    <section id="skills" className="py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          {lang === 'en' && (
            <span className="text-xs font-code text-cyan-400 tracking-widest uppercase block mb-1">
              {t('skills_subtitle')}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
            {t('skills_title')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-sub)] font-medium leading-relaxed">
            {t('skills_intro')}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto mt-4 rounded-full" aria-hidden="true" />
        </div>

        {/* Skill Categories */}
        <div className="space-y-10 max-w-5xl mx-auto">
          {currentSkills.map((cat, idx) => {
            const CatIcon = CAT_ICON_MAP[cat.catType] ?? Gamepad2;
            return (
              <div key={idx} className="rounded-2xl glass-card overflow-hidden shadow-md border border-[var(--border-color)]">

                {/* Category Header */}
                <div
                  className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-color)]"
                  style={{ borderLeftWidth: '4px', borderLeftColor: cat.catColor }}
                >
                  <div className="p-2.5 rounded-xl cat-icon-bg border">
                    <CatIcon size={22} style={{ color: cat.catColor }} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)]">
                    {cat.category}
                  </h3>
                </div>

                {/* Skill Rows */}
                <div className="p-4 sm:p-6 space-y-3">
                  {cat.items.map((item, iIdx) => {
                    const LabelIcon = getLabelIcon(item.label);
                    const isTextRow = item.rowType === 'text';
                    return (
                      <div
                        key={iIdx}
                        className="skill-row-bg rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 border"
                      >
                        {/* Label */}
                        <div className="flex items-center gap-2.5 shrink-0 sm:w-[220px]">
                          <span
                            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
                            style={{
                              backgroundColor: `${cat.catColor}14`,
                              border: `1px solid ${cat.catColor}28`,
                            }}
                          >
                            <LabelIcon size={15} style={{ color: cat.catColor }} />
                          </span>
                          <span className="font-bold text-sm text-[var(--text-main)]">
                            {item.label}
                          </span>
                        </div>

                        {/* Divider (desktop) */}
                        <div className="hidden sm:block w-px h-5 shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />

                        {/* Content — tech badges or plain text list */}
                        {isTextRow ? (
                          <div className="flex flex-wrap gap-1.5">
                            {item.content.split('/').map((sub, sIdx) => {
                              const clean = sub.trim();
                              if (!clean) return null;
                              return (
                                <span
                                  key={sIdx}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold font-code"
                                  style={{
                                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(15,23,42,0.6)',
                                    color: isLight ? '#475569' : '#94a3b8',
                                    border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}`,
                                  }}
                                >
                                  {clean}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {item.content.split('/').map((sub, sIdx) => {
                              const clean = sub.trim();
                              if (!clean) return null;
                              return (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold font-code transition-all hover:scale-105 shadow-xs"
                                  style={{
                                    backgroundColor: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)',
                                    borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)',
                                    color: isLight ? '#0f172a' : '#f8fafc',
                                    borderWidth: '1px',
                                  }}
                                >
                                  {getTechIcon(clean)}
                                  <span>{clean}</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
