import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import {
  Gamepad2, Globe, Palette,
  // Category & Skill Icons
  Cpu, Layers, Zap, Glasses, Wifi,
  Code2, Server, Monitor, Layout, Database, Cloud, Wrench, GitMerge,
  PenTool, Bot, FileText, Film, Box, Workflow
} from 'lucide-react';

/* Category Color Tokens */
const GAME_COL   = '#22d3ee';  // cyan
const WEB_COL    = '#c084fc';  // purple
const MEDIA_COL  = '#34d399';  // emerald

const itemIcon = (IconComp, color) => (
  <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
    style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}>
    <IconComp size={15} style={{ color }} />
  </span>
);

/* Helper mapping: Render specific technology icons for every tech badge pill */
const getTechIcon = (name) => {
  const n = name.toLowerCase().trim();
  if (n.includes('html')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#E34F26] fill-current" viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.78-2.928-.78-.188-2.091H6.248l.375 4.177 5.347 1.482 5.344-1.482.723-8.182H8.531z"/></svg>;
  if (n.includes('css') && !n.includes('sass') && !n.includes('scss')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#1572B6] fill-current" viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.78-2.928-.78-.188-2.091H6.248l.375 4.177 5.347 1.482 5.344-1.482.723-8.182H8.531z"/></svg>;
  if (n.includes('javascript') || n === 'js') return <svg className="w-3.5 h-3.5 shrink-0 text-[#F7DF1E] fill-current" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-.828-.153-.153-.213-.358-.213-.559 0-.649.48-.999 1.258-.999.736 0 1.24.255 1.588.857.067.118.172.164.286.118l1.398-.828c.119-.07.147-.215.088-.344-.658-1.29-1.89-1.922-3.359-1.922-1.996 0-3.327 1.139-3.327 2.766 0 1.218.665 2.128 2.37 2.828.915.375 1.485.645 1.68.915.225.315.225.69.045 1.05-.285.54-.99.795-1.815.795-.99 0-1.605-.405-2.04-1.23-.06-.12-.195-.165-.315-.09l-1.395.84c-.105.06-.135.195-.075.315.75 1.455 2.13 2.175 3.825 2.175 2.445 0 3.75-1.245 3.75-3.015z"/></svg>;
  if (n.includes('typescript') || n === 'ts') return <svg className="w-3.5 h-3.5 shrink-0 text-[#3178C6] fill-current" viewBox="0 0 24 24"><path d="M1.125 0C.507 0 0 .507 0 1.125v21.75C0 23.493.507 24 1.125 24h21.75c.618 0 1.125-.507 1.125-1.125V1.125C24 .507 23.493 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111.473.075.912.212 1.318.412v2.73a6.837 6.837 0 00-1.247-.45 6.006 6.006 0 00-1.425-.162c-.675 0-1.19.125-1.545.375s-.533.612-.533 1.087c0 .288.069.525.207.713.137.187.331.344.58.468.25.125.56.238.93.338l.613.162c.75.188 1.368.413 1.856.675.488.263.856.606 1.107 1.031.25.425.375.969.375 1.632 0 .975-.331 1.762-.994 2.362-.662.6-1.612.9-2.85.9-.662 0-1.331-.062-2.006-.187a11.1 11.1 0 01-1.856-.513v-2.85c.612.35 1.25.6 1.912.75.663.15 1.288.225 1.875.225.688 0 1.206-.131 1.556-.394.35-.262.525-.631.525-1.106 0-.313-.075-.563-.225-.75a2.29 2.29 0 00-.619-.488c-.262-.137-.587-.262-.975-.375l-.656-.175c-.75-.2-1.363-.438-1.838-.713a3.02 3.02 0 01-1.087-1.05c-.25-.437-.375-.987-.375-1.65 0-.95.325-1.725.975-2.325.65-.6 1.575-.9 2.775-.9zM9.54 10.05h3.694v2.587H11.46v9.338H8.381v-9.338H6.516V10.05h3.024z"/></svg>;
  if (n.includes('react')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#61DAFB] fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="#61DAFB" /><g stroke="#61DAFB" strokeWidth="1.2"><ellipse cx="12" cy="12" rx="9" ry="3.5" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" /></g></svg>;
  if (n.includes('angular')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#DD0031] fill-current" viewBox="0 0 24 24"><path d="M12 0L1.75 3.6 3.32 17.65 12 24l8.68-6.35L22.25 3.6 12 0zm0 3.8l6.47 14.5h-2.35l-1.3-3.25H9.18L7.88 18.3H5.53L12 3.8zm1.95 9.25L12 8.1l-1.95 4.95h3.9z"/></svg>;
  if (n.includes('sass') || n.includes('scss')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#CC6699] fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.83 15.65c-.68 1.48-2.31 2.35-4.22 2.35-3.3 0-5.18-2.22-5.18-4.8 0-3.33 2.68-5.3 5.92-5.3 1.95 0 3.42.74 3.98 1.83l-1.63 1c-.34-.63-1.12-1.03-2.25-1.03-1.85 0-3.35 1.15-3.35 3.35 0 1.8 1.15 3.05 3.12 3.05 1.25 0 2.18-.5 2.65-1.32l1.96 1.12z"/></svg>;
  if (n.includes('tailwind')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#38BDF8] fill-current" viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg>;
  if (n.includes('bootstrap')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#7952B3] fill-current" viewBox="0 0 24 24"><path d="M14.07 10.22c.98.24 1.58.98 1.58 2.06 0 1.5-1.12 2.52-3.1 2.52H8.8V8.42h3.42c1.7 0 2.76.84 2.76 2.1 0 .9-.54 1.54-1.41 1.7zm-3.22-.44h1.44c.82 0 1.34-.34 1.34-.96 0-.64-.52-.98-1.34-.98h-1.44v1.94zm0 3.7h1.66c.92 0 1.48-.38 1.48-1.04 0-.68-.56-1.04-1.48-1.04h-1.66v2.08zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/></svg>;
  if (n.includes('spring')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#6DB33F] fill-current" viewBox="0 0 24 24"><path d="M22.08 1.92c-.14.28-.43.43-.72.43-.86 0-3.32 1.43-4.44 2.56-1.43 1.43-2.58 3.32-3.6 5.32 1.58 1.58 3.16 3.16 4.74 4.74 2-1.02 3.89-2.17 5.32-3.6 1.13-1.12 2.56-3.58 2.56-4.44 0-.29-.15-.58-.43-.72L22.08 1.92zM.64 22.34c1.13-1.13 3.59-2.56 4.45-2.56.29 0 .58.14.72.43l3.45 3.45c.14.28.14.57 0 .85-.28.29-.57.29-.85 0l-3.45-3.45c-.29-.29-.72-.43-1.01-.43-.72 0-2.3 1.01-3.02 1.73-1.58 1.58-1.58 4.17 0 5.75 1.58 1.58 4.17 1.58 5.75 0 2.3-2.3 5.46-5.75 8.19-8.48 2.73-2.73 6.18-5.89 8.48-8.19 1.58-1.58 1.58-4.17 0-5.75-1.58-1.58-4.17-1.58-5.75 0-2.73 2.73-5.76 5.89-8.49 8.49C3.2 16.89-.25 20.04.64 22.34z"/></svg>;
  if (n.includes('java')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#ED8B00] fill-current" viewBox="0 0 24 24"><path d="M12.95 20.31s-.41.34-.95.34c-.75 0-1.19-.55-1.19-1.16 0-.82.68-1.78 1.64-1.78.48 0 .82.14.82.14s-.14-.55-.14-1.16c-.75.07-2.39.41-3.15 1.16-.75.75-.95 1.64-.95 2.39 0 1.57 1.16 2.39 2.53 2.39 1.3 0 2.19-.68 2.19-.68l-.8-1.64zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/></svg>;
  if (n.includes('python')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#3776AB] fill-current" viewBox="0 0 24 24"><path d="M11.87 0c-5.71 0-5.34 2.48-5.34 2.48l.01 2.57h5.43v.77H4.37S0 5.36 0 11.13c0 5.77 3.8 5.56 3.8 5.56h2.27v-3.21s-.12-3.83 3.77-3.83h6.53s3.65.06 3.65-3.56V2.48S20.47 0 11.87 0zm-2.85 1.74a1.07 1.07 0 1 1 0 2.14 1.07 1.07 0 0 1 0-2.14zm3.11 22.26c5.71 0 5.34-2.48 5.34-2.48l-.01-2.57h-5.43v-.77h7.6S24 18.64 24 12.87c0-5.77-3.8-5.56-3.8-5.56h-2.27v3.21s.12 3.83-3.77 3.83H7.63s-3.65-.06-3.65 3.56v3.65s-.45 2.48 8.15 2.48zm2.85-1.74a1.07 1.07 0 1 1 0-2.14 1.07 1.07 0 0 1 0 2.14z"/></svg>;
  if (n.includes('mysql')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#4479A1] fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.13 14.54c-.65.98-1.78 1.57-3.03 1.57-2.1 0-3.65-1.57-3.65-3.73 0-2.14 1.55-3.73 3.65-3.73 1.25 0 2.38.59 3.03 1.57l-1.42.92c-.35-.48-.92-.79-1.61-.79-1.12 0-1.92.83-1.92 2.04 0 1.2.8 2.04 1.92 2.04.69 0 1.26-.31 1.61-.79l1.42.92z"/></svg>;
  if (n.includes('postgres')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#4169E1] fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.4 12.3c-.3 2.7-2.4 4.8-5.1 5.1v-2.1c1.5-.3 2.7-1.5 3-3h2.1zm-8.7 0c.3 1.5 1.5 2.7 3 3v2.1c-2.7-.3-4.8-2.4-5.1-5.1h2.1z"/></svg>;
  if (n.includes('docker')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#2496ED] fill-current" viewBox="0 0 24 24"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.185.185 0 00.186-.186V3.574a.185.185 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.956 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.144a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm5.886 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.956 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.144a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.186v1.887c0 .102.083.185.185.185z"/></svg>;
  if (n.includes('git') && !n.includes('hub')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#F05032] fill-current" viewBox="0 0 24 24"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.216 1.398-.063 1.897.437.5.5.65 1.256.434 1.904l2.66 2.66c.648-.216 1.403-.063 1.902.437.7.7.7 1.838 0 2.538-.7.7-1.838.7-2.538 0-.52-.52-.662-1.284-.426-1.935L12.7 8.736v6.924c.216.082.42.203.59.37.7.7.7 1.838 0 2.538-.7.7-1.838.7-2.538 0-.7-.7-.7-1.838 0-2.538.226-.226.5-.375.795-.45V8.583c-.294-.076-.57-.225-.795-.45-.526-.526-.664-1.303-.414-1.96L7.548 3.39 1.433 9.505c-.603.604-.603 1.582 0 2.188l10.48 10.478c.604.604 1.582.604 2.186 0l9.447-9.446c.604-.603.604-1.58 0-2.184z"/></svg>;
  if (n.includes('github')) return <Workflow className="w-3.5 h-3.5 shrink-0 text-[#2088FF]" />;
  if (n.includes('vite')) return <svg className="w-3.5 h-3.5 shrink-0 text-[#646CFF] fill-current" viewBox="0 0 24 24"><path d="M22.632 3.633L12.753 22.37a.89.89 0 01-1.564 0L1.368 3.633a.89.89 0 01.81-1.317h19.645a.89.89 0 01.809 1.317z"/></svg>;
  if (n.includes('unity')) return <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-[#22d3ee]" />;
  if (n.includes('unreal')) return <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-[#a855f7]" />;
  if (n.includes('figma')) return <PenTool className="w-3.5 h-3.5 shrink-0 text-[#F24E1E]" />;
  if (n.includes('photoshop')) return <Palette className="w-3.5 h-3.5 shrink-0 text-[#31A8FF]" />;
  if (n.includes('illustrator')) return <PenTool className="w-3.5 h-3.5 shrink-0 text-[#FF9A00]" />;
  if (n.includes('blender')) return <Box className="w-3.5 h-3.5 shrink-0 text-[#EA7600]" />;
  if (n.includes('premiere')) return <Film className="w-3.5 h-3.5 shrink-0 text-[#9999FF]" />;
  if (n.includes('chatgpt') || n.includes('gemini') || n.includes('ai')) return <Bot className="w-3.5 h-3.5 shrink-0 text-[#10b981]" />;
  if (n.includes('aws') || n.includes('gcp') || n.includes('cloud')) return <Cloud className="w-3.5 h-3.5 shrink-0 text-[#38bdf8]" />;
  if (n.includes('pattern') || n.includes('architecture') || n.includes('singleton') || n.includes('pool') || n.includes('registry') || n.includes('observer')) return <Layers className="w-3.5 h-3.5 shrink-0 text-[#c084fc]" />;
  if (n.includes('urp') || n.includes('shader') || n.includes('cinemachine') || n.includes('dotween') || n.includes('timeline')) return <Zap className="w-3.5 h-3.5 shrink-0 text-[#38ef7d]" />;
  
  // Default fallback tech icon
  return <Zap className="w-3.5 h-3.5 shrink-0 text-cyan-400" />;
};

// Skills Data Sourced Verbatim from info.md
const rawSkillsData = {
  zh: [
    {
      category: '【互動遊戲開發】',
      catColor: GAME_COL,
      catIcon: Gamepad2,
      items: [
        { icon: itemIcon(Cpu,     GAME_COL), label: '遊戲引擎',       content: 'Unity ( C#) / Unreal Engine ( Blueprints )' },
        { icon: itemIcon(Layers,  GAME_COL), label: '設計模式與架構', content: 'Singleton / Object Pool / Registry / Observer Pattern / Event-based Architecture' },
        { icon: itemIcon(Zap,     GAME_COL), label: '核心技術',       content: 'URP / Shader Graph / Addressables / Editor Scripting ( Inspector, EditorWindow ) / Saving System / AI Navigation / Cinemachine / DOTween / Timeline' },
        { icon: itemIcon(Glasses, GAME_COL), label: 'XR 實境開發',   content: 'Vuforia / Meta SDK / XR Interaction Toolkit' },
        { icon: itemIcon(Wifi,    GAME_COL), label: '多人連線開發',   content: 'Netcode / Photon Pun' },
      ]
    },
    {
      category: '【全端開發】',
      catColor: WEB_COL,
      catIcon: Globe,
      items: [
        { icon: itemIcon(Code2,    WEB_COL), label: '後端程式語言',     content: 'Java / Python' },
        { icon: itemIcon(Server,   WEB_COL), label: '後端框架與技術',   content: 'Spring Boot / Hibernate / Flask / Django' },
        { icon: itemIcon(Monitor,  WEB_COL), label: '前端程式語言',     content: 'HTML / CSS / JavaScript / TypeScript' },
        { icon: itemIcon(Layout,   WEB_COL), label: '前端框架與樣式',   content: 'React / Angular / Sass/SCSS / Tailwind / Bootstrap' },
        { icon: itemIcon(Database, WEB_COL), label: '資料庫與服務',     content: 'MySQL / PostgreSQL' },
        { icon: itemIcon(Cloud,    WEB_COL), label: '雲端服務',         content: 'AWS / GCP' },
        { icon: itemIcon(Wrench,   WEB_COL), label: '開發與建構工具',   content: 'Git / Docker / Vite' },
        { icon: itemIcon(GitMerge, WEB_COL), label: 'CI/CD 自動化',    content: 'GitHub Actions' },
      ]
    },
    {
      category: '【多媒體設計】',
      catColor: MEDIA_COL,
      catIcon: Palette,
      items: [
        { icon: itemIcon(PenTool,   MEDIA_COL), label: '視覺設計與 UI/UX', content: 'Figma / Canva / Photoshop / Illustrator' },
        { icon: itemIcon(Bot,      MEDIA_COL), label: 'AI 內容創作',       content: 'ChatGPT / Gemini / ComfyUI / Suno' },
        { icon: itemIcon(FileText, MEDIA_COL), label: '流程圖設計與文書',  content: 'draw.io / Word / Excel / PowerPoint' },
        { icon: itemIcon(Film,     MEDIA_COL), label: '影片剪輯與後製',    content: 'Premiere / DaVinci' },
        { icon: itemIcon(Box,      MEDIA_COL), label: '3D 建模與材質',     content: 'AutoCAD / Blender / Maya / 3dsMax / RizomUV / Zbrush / Substance Painter' },
      ]
    }
  ],
  en: [
    {
      category: 'Interactive Game Dev',
      catColor: GAME_COL,
      catIcon: Gamepad2,
      items: [
        { icon: itemIcon(Cpu,     GAME_COL), label: 'Game Engines',          content: 'Unity ( C#) / Unreal Engine ( Blueprints )' },
        { icon: itemIcon(Layers,  GAME_COL), label: 'Design Patterns',       content: 'Singleton / Object Pool / Registry / Observer Pattern / Event-based Architecture' },
        { icon: itemIcon(Zap,     GAME_COL), label: 'Core Tech',             content: 'URP / Shader Graph / Addressables / Editor Scripting ( Inspector, EditorWindow ) / Saving System / AI Navigation / Cinemachine / DOTween / Timeline' },
        { icon: itemIcon(Glasses, GAME_COL), label: 'XR Development',        content: 'Vuforia / Meta SDK / XR Interaction Toolkit' },
        { icon: itemIcon(Wifi,    GAME_COL), label: 'Multiplayer Networking', content: 'Netcode / Photon Pun' },
      ]
    },
    {
      category: 'Fullstack Web Dev',
      catColor: WEB_COL,
      catIcon: Globe,
      items: [
        { icon: itemIcon(Code2,    WEB_COL), label: 'Backend Languages',  content: 'Java / Python' },
        { icon: itemIcon(Server,   WEB_COL), label: 'Backend Frameworks', content: 'Spring Boot / Hibernate / Flask / Django' },
        { icon: itemIcon(Monitor,  WEB_COL), label: 'Frontend Languages', content: 'HTML / CSS / JavaScript / TypeScript' },
        { icon: itemIcon(Layout,   WEB_COL), label: 'Frontend Frameworks',content: 'React / Angular / Sass/SCSS / Tailwind / Bootstrap' },
        { icon: itemIcon(Database, WEB_COL), label: 'Databases',          content: 'MySQL / PostgreSQL' },
        { icon: itemIcon(Cloud,    WEB_COL), label: 'Cloud Services',     content: 'AWS / GCP' },
        { icon: itemIcon(Wrench,   WEB_COL), label: 'Dev & Build Tools',  content: 'Git / Docker / Vite' },
        { icon: itemIcon(GitMerge, WEB_COL), label: 'CI/CD Automation',   content: 'GitHub Actions' },
      ]
    },
    {
      category: 'Multimedia Design',
      catColor: MEDIA_COL,
      catIcon: Palette,
      items: [
        { icon: itemIcon(PenTool,   MEDIA_COL), label: 'Visual Design & UI/UX',    content: 'Figma / Canva / Photoshop / Illustrator' },
        { icon: itemIcon(Bot,      MEDIA_COL), label: 'AIGC Creation',            content: 'ChatGPT / Gemini / ComfyUI / Suno' },
        { icon: itemIcon(FileText, MEDIA_COL), label: 'Flowcharts & Office',      content: 'draw.io / Word / Excel / PowerPoint' },
        { icon: itemIcon(Film,     MEDIA_COL), label: 'Video Post-Production',    content: 'Premiere / DaVinci' },
        { icon: itemIcon(Box,      MEDIA_COL), label: '3D Modeling & Materials',  content: 'AutoCAD / Blender / Maya / 3dsMax / RizomUV / Zbrush / Substance Painter' },
      ]
    }
  ]
};

export const Skills = () => {
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const currentSkills = rawSkillsData[lang] ?? rawSkillsData.zh;

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
            const CatIcon = cat.catIcon;
            return (
              <div key={idx} className="rounded-2xl glass-card overflow-hidden shadow-md border border-[var(--border-color)]">

                {/* Category Header bar */}
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

                {/* Skill Item Rows */}
                <div className="p-4 sm:p-6 space-y-3">
                  {cat.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="skill-row-bg rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 border"
                    >
                      {/* Sub-category Icon + Label */}
                      <div className="flex items-center gap-2.5 shrink-0 sm:w-[220px]">
                        {item.icon}
                        <span className="font-bold text-sm text-[var(--text-main)]">
                          {item.label}
                        </span>
                      </div>
                      {/* Vertical Divider for Desktop */}
                      <div className="hidden sm:block w-px h-5 shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />
                      {/* Tech Badge Pills with Dedicated Icon + Text */}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.content.split('/').map((sub, sIdx) => {
                          const cleanSub = sub.trim();
                          if (!cleanSub) return null;
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
                              {getTechIcon(cleanSub)}
                              <span>{cleanSub}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
