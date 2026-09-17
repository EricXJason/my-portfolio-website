/**
 * ============================================================================
 * 檔案名稱: CmsModeSelectDialog.tsx
 * 所屬模組: Portfolio CMS (存取模式選擇全螢幕遮罩視窗)
 * 責任描述: 負責於未登入狀態下阻斷側邊欄存取，提供管理者帳密驗證登入入口、測試登入捷徑與唯讀預覽免登入入口。
 * 架構分層: CMS Presentation Layer (Modal Component)
 * 依賴關係: 依賴 React Router DOM、LangContext、ThemeContext、CmsModeContext 與 CmsConfirmDialog。
 * 邊界處理: 全螢幕阻斷底層點擊、支援未選前深淺色與雙語即時切換、帳密欄位 Enter 鍵觸發提交、返回使用者模式必先確認。
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ChevronRight, Lock, Sun, Moon, User, KeyRound, Loader2, AlertCircle, FlaskConical } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { useCmsMode } from '../context/CmsModeContext';
import { CmsConfirmDialog, CmsConfirmDialogState, EMPTY_DIALOG } from './CmsConfirmDialog';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../services/firebase';

/**
 * CmsModeSelectDialog
 * CMS 存取模式選擇全螢幕視窗：
 * 1. 覆蓋全螢幕遮罩，在尚未選擇模式前禁止側邊欄出現。
 * 2. 右上角整合雙語切換（EN/中）、深淺色切換。
 * 3. 管理者模式卡片：點擊後展開帳號密碼輸入表單，驗證通過後進入。
 * 4. 管理者模式 預覽：免登入直接進入唯讀模式。
 * 5. 全面遵循方形科技美學 (Square Cyber Aesthetics) 與 WCAG 高對比規範。
 */
export const CmsModeSelectDialog: React.FC = () => {
  const { lang, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { setMode } = useCmsMode();
  const navigate = useNavigate();

  const isEn = lang === 'en';
  const isLight = theme === 'light';

  // 卡片懸停狀態
  const [hoveredCard, setHoveredCard] = useState<'admin' | 'preview' | null>(null);

  // 管理者登入表單狀態
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 返回使用者模式二次確認對話框狀態
  const [exitConfirm, setExitConfirm] = useState<CmsConfirmDialogState>(EMPTY_DIALOG);

  const usernameRef = useRef<HTMLInputElement>(null);

  // 表單開啟時自動聚焦於帳號輸入框
  useEffect(() => {
    if (showLoginForm) {
      setTimeout(() => usernameRef.current?.focus(), 50);
    }
  }, [showLoginForm]);

  // 關閉登入表單並重設欄位
  const handleCancelLogin = () => {
    setShowLoginForm(false);
    setUsername('');
    setPassword('');
    setLoginError(null);
    setShowPassword(false);
  };

  // 觸發「返回使用者模式」確認對話框
  const handleReturnToUserMode = () => {
    setExitConfirm({
      isOpen: true,
      type: 'save',
      title: isEn ? 'Return to User Mode' : '返回使用者模式',
      message: isEn
        ? 'Are you sure you want to leave the Content Management System and return to User Mode?'
        : '確定要離開內容管理系統並返回使用者模式嗎？',
      confirmText: isEn ? 'Confirm Return' : '確認返回',
      cancelText: isEn ? 'Stay Here' : '留在本頁',
      onConfirm: () => {
        setExitConfirm(EMPTY_DIALOG);
        navigate('/');
      },
    });
  };

  /**
   * TODO: [後端端點對接] 驗證管理者帳號密碼並取得 JWT Access Token
   * 1. HTTP Method: POST
   * 2. 預期端點: /api/v1/auth/login
   * 3. 請求載荷 (Request Body):
   *    - Body: { username: string, password: string }
   * 4. 預期回應:
   *    - 200 OK: { success: true, data: { accessToken: string, expiresIn: number } }
   *    - 401 Unauthorized: 帳號或密碼錯誤
   *    - 429 Too Many Requests: 登入嘗試次數超過限制
   * 5. 當前狀態: 後端尚未就緒，暫以前端模擬驗證（任意非空帳密即可通過）供 UI 開發驗證使用。
   */
  const handleAdminLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setLoginError(isEn ? 'Email and password are required.' : '管理員信箱與密碼均為必填。');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    // 嚴格模式：Firebase 必須已正確初始化
    if (!auth || !isFirebaseConfigured) {
      setIsLoading(false);
      setLoginError(isEn ? 'Firebase Auth service is not ready. Please check connection.' : 'Firebase 雲端認證服務未連線，無法驗證管理員身分。');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, username.trim(), password);
      setIsLoading(false);
      setMode('admin');
    } catch (err: any) {
      setIsLoading(false);
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setLoginError(isEn ? 'Invalid email or password.' : '帳號或密碼錯誤，請確認後重新輸入。');
      } else if (code === 'auth/invalid-email') {
        setLoginError(isEn ? 'Invalid email address format.' : '帳號格式需為有效的電子郵件地址。');
      } else if (code === 'auth/too-many-requests') {
        setLoginError(isEn ? 'Too many failed attempts. Please try again later.' : '登入嘗試次數過多，帳戶已暫時鎖定，請稍後再試。');
      } else {
        setLoginError(err?.message || (isEn ? 'Authentication failed.' : '登入認證失敗，請檢查網路連線。'));
      }
    }
  };

  // 支援表單輸入框內按 Enter 鍵自動送出登入
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdminLogin();
  };

  // 直接進入唯讀預覽模式（無須認證憑證）
  const handlePreviewClick = () => {
    setMode('preview');
  };

  const borderCol = isLight ? '#cbd5e1' : 'rgba(0, 240, 255, 0.25)';

  return (
    <>
      {/* 返回使用者模式二次確認對話框 */}
      <CmsConfirmDialog
        dialog={exitConfirm}
        onClose={() => setExitConfirm(EMPTY_DIALOG)}
        isEn={isEn}
      />

      {/* 模式選擇全螢幕視窗容器 */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        style={{
          background: isLight
            ? 'rgba(248,250,252,0.96)'
            : 'rgba(3,7,18,0.97)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* 右上角控制項：語系與主題 */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
          {/* 1. 多國語系切換 */}
          <button
            type="button"
            onClick={toggleLang}
            className="w-[52px] sm:w-[62px] h-[28px] sm:h-[32px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer font-tech text-xs font-bold active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
              borderColor: borderCol,
            }}
            aria-label={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
            title={lang === 'zh' ? '切換為 English' : 'Switch to 繁體中文'}
          >
            <div className="w-full h-full flex items-center justify-between pointer-events-none z-0">
              <span
                className="w-1/2 text-center text-[10px] sm:text-xs font-bold"
                style={{ color: lang === 'en' ? 'transparent' : (isLight ? '#475569' : '#94a3b8') }}
              >
                EN
              </span>
              <span
                className="w-1/2 text-center text-[10px] sm:text-xs font-bold"
                style={{ color: lang === 'zh' ? 'transparent' : (isLight ? '#475569' : '#94a3b8') }}
              >
                中
              </span>
            </div>
            <div
              className="absolute top-[2px] bottom-[2px] left-[2px] w-[calc(50%-2px)] cyber-cut-sm flex items-center justify-center transition-transform duration-300 ease-out z-10 shadow-sm text-[10px] sm:text-xs font-black"
              style={{
                transform: lang === 'zh' ? 'translateX(100%)' : 'translateX(0%)',
                backgroundColor: isLight ? '#0369a1' : '#00f0ff',
                color: isLight ? '#ffffff' : '#030712',
              }}
            >
              {lang === 'en' ? 'EN' : '中'}
            </div>
          </button>

          {/* 2. 深淺主題切換 */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-[52px] sm:w-[62px] h-[28px] sm:h-[32px] border cyber-cut-sm relative p-[2px] flex items-center transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:border-cyan-400 shrink-0 select-none overflow-hidden"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
              borderColor: borderCol,
            }}
            aria-label={isLight ? '切換為深色模式' : '切換為淺色模式'}
            title={isLight ? '切換為深色模式' : '切換為淺色模式'}
          >
            <div className="w-full h-full flex items-center justify-between pointer-events-none z-0 px-1">
              <div className="w-1/2 flex items-center justify-center">
                <Sun size={12} className="text-amber-400 font-bold opacity-80" />
              </div>
              <div className="w-1/2 flex items-center justify-center">
                <Moon size={12} className="text-cyan-400 font-bold opacity-80" />
              </div>
            </div>
            <div
              className="absolute top-[2px] bottom-[2px] left-[2px] w-[calc(50%-2px)] cyber-cut-sm flex items-center justify-center transition-transform duration-300 ease-out z-10 shadow-sm"
              style={{
                transform: isLight ? 'translateX(0%)' : 'translateX(100%)',
                backgroundColor: isLight ? '#fbbf24' : '#00f0ff',
                color: '#0f172a',
              }}
            >
              {isLight ? (
                <Sun size={13} className="fill-current text-slate-900" />
              ) : (
                <Moon size={13} className="fill-current text-slate-900" />
              )}
            </div>
          </button>
        </div>

        {/* 動態科技網格背景 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isLight
              ? `linear-gradient(rgba(2,132,199,0.06) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(2,132,199,0.06) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 中央徑向光暈漸層 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight
              ? 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(2,132,199,0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,240,255,0.07) 0%, transparent 70%)',
          }}
        />

        {/* 對話框主內容容器 */}
        <div className="relative z-10 w-full max-w-3xl my-auto py-8">
          {/* 頂部標題列 */}
          <div className="text-center mb-8 sm:mb-10">
            {/* CMS 科技方形識別徽章 */}
            <div className="inline-flex items-center justify-center mb-4">
              <div
                className="w-14 h-14 border cyber-cut-sm flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: isLight ? '#e0f2fe' : '#080e1a',
                  borderColor: isLight ? '#0284c7' : 'rgba(0,240,255,0.6)',
                  boxShadow: isLight
                    ? '0 0 20px rgba(2,132,199,0.25)'
                    : '0 0 20px rgba(0,240,255,0.2)',
                }}
              >
                <span
                  className="font-['Orbitron',sans-serif] font-black text-sm tracking-wide"
                  style={{ color: isLight ? '#0284c7' : '#00f0ff' }}
                >
                  CMS
                </span>
              </div>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-['Orbitron',sans-serif] font-black tracking-widest mb-2 uppercase"
              style={{ color: isLight ? '#0f172a' : '#ffffff' }}
            >
              {isEn ? 'Select Access Mode' : '選擇存取模式'}
            </h1>
            <p
              className="text-xs sm:text-sm font-['Noto_Sans_TC'] tracking-wide"
              style={{ color: isLight ? '#64748b' : 'rgba(148,163,184,0.85)' }}
            >
              {isEn
                ? 'Choose how you want to access the Content Management System'
                : '請選擇您進入內容管理系統的方式'}
            </p>
          </div>

          {/* 雙模式卡片：管理者模式與預覽模式 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* ── 1. 管理者模式卡片 ── */}
            <div
              onMouseEnter={() => !showLoginForm && setHoveredCard('admin')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative text-left p-6 sm:p-7 border cyber-cut-sm transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: hoveredCard === 'admin' || showLoginForm
                  ? (isLight ? 'rgba(3,105,161,0.06)' : 'rgba(0,240,255,0.06)')
                  : (isLight ? '#ffffff' : 'rgba(8,14,26,0.85)'),
                borderColor: showLoginForm
                  ? (isLight ? '#0284c7' : '#00f0ff')
                  : hoveredCard === 'admin'
                    ? (isLight ? '#0284c7' : '#00f0ff')
                    : (isLight ? '#cbd5e1' : 'rgba(0,240,255,0.25)'),
                boxShadow: hoveredCard === 'admin' || showLoginForm
                  ? (isLight
                    ? '0 0 30px rgba(2,132,199,0.2), inset 0 0 20px rgba(2,132,199,0.05)'
                    : '0 0 30px rgba(0,240,255,0.2), inset 0 0 20px rgba(0,240,255,0.05)')
                  : 'none',
              }}
            >
              <div>
                {/* 頂部資訊列：圖示與狀態 */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 border cyber-cut-sm flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isLight ? '#e0f2fe' : 'rgba(0,240,255,0.12)',
                      borderColor: isLight ? '#38bdf8' : 'rgba(0,240,255,0.35)',
                    }}
                  >
                    <Shield
                      className="w-6 h-6 transition-all duration-300"
                      style={{ color: isLight ? '#0369a1' : '#00f0ff' }}
                    />
                  </div>

                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 border cyber-cut-sm text-[10px] font-['Share_Tech_Mono'] font-bold"
                    style={{
                      backgroundColor: isLight ? 'rgba(3,105,161,0.1)' : 'rgba(0,240,255,0.1)',
                      color: isLight ? '#0369a1' : '#00f0ff',
                      borderColor: isLight ? 'rgba(3,105,161,0.3)' : 'rgba(0,240,255,0.3)',
                    }}
                  >
                    <Lock className="w-2.5 h-2.5" />
                    {isEn ? 'ADMIN ACCESS' : '管理者存取'}
                  </span>
                </div>

                <h2
                  className="text-lg font-['Orbitron',sans-serif] font-bold mb-2 tracking-wide uppercase"
                  style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                >
                  {isEn ? 'Admin Mode' : '管理者模式'}
                </h2>
                <p
                  className="text-xs font-['Noto_Sans_TC'] leading-relaxed mb-4"
                  style={{ color: isLight ? '#475569' : 'rgba(148,163,184,0.85)' }}
                >
                  {isEn
                    ? 'Full read & write access. Edit and publish across all sections with persistence.'
                    : '具備完整讀寫與發布權限。可實時編輯所有模組、調整欄位排序並儲存生效。'}
                </p>

                {/* 核心特點清單 */}
                <ul className="space-y-1.5 mb-5">
                  {[
                    isEn ? 'Full read & write authorization' : '完整編輯與拖曳排序權限',
                    isEn ? 'Real-time JSON & LocalStorage persistence' : '實時儲存與自訂設定生效',
                    isEn ? 'Login required for content protection' : '需帳號驗證確保內容安全',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 shrink-0"
                        style={{ backgroundColor: isLight ? '#0284c7' : '#00f0ff' }}
                      />
                      <span
                        className="text-xs font-['Noto_Sans_TC']"
                        style={{ color: isLight ? '#334155' : 'rgba(226,232,240,0.9)' }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* ── 登入表單（點擊卡片後平滑展開）── */}
                {showLoginForm && (
                  <div
                    className="mb-4 p-4 border cyber-cut-sm space-y-3"
                    style={{
                      backgroundColor: isLight ? 'rgba(241,245,249,0.8)' : 'rgba(3,7,18,0.7)',
                      borderColor: isLight ? 'rgba(2,132,199,0.3)' : 'rgba(0,240,255,0.25)',
                    }}
                  >
                    {/* 管理者帳號輸入欄位 */}
                    <div className="space-y-1">
                      <label
                        className="text-[10px] font-['Share_Tech_Mono'] font-bold flex items-center gap-1.5"
                        style={{ color: isLight ? '#0369a1' : '#00f0ff' }}
                      >
                        <User className="w-3 h-3" />
                        {isEn ? 'USERNAME' : '帳號'}
                      </label>
                      <input
                        ref={usernameRef}
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setLoginError(null); }}
                        onKeyDown={handleKeyDown}
                        placeholder={isEn ? 'Enter username...' : '請輸入帳號...'}
                        autoComplete="username"
                        className="w-full px-3 py-2 text-xs border cyber-cut-sm bg-transparent outline-none font-['Share_Tech_Mono'] text-[var(--text-main)] focus:border-[var(--neon-cyan)] transition-colors"
                        style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.25)' }}
                      />
                    </div>

                    {/* 密碼輸入欄位 */}
                    <div className="space-y-1">
                      <label
                        className="text-[10px] font-['Share_Tech_Mono'] font-bold flex items-center gap-1.5"
                        style={{ color: isLight ? '#0369a1' : '#00f0ff' }}
                      >
                        <KeyRound className="w-3 h-3" />
                        {isEn ? 'PASSWORD' : '密碼'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                          onKeyDown={handleKeyDown}
                          placeholder={isEn ? 'Enter password...' : '請輸入密碼...'}
                          autoComplete="current-password"
                          className="w-full pl-3 pr-9 py-2 text-xs border cyber-cut-sm bg-transparent outline-none font-['Share_Tech_Mono'] text-[var(--text-main)] focus:border-[var(--neon-cyan)] transition-colors"
                          style={{ borderColor: isLight ? '#cbd5e1' : 'rgba(0,240,255,0.25)' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--neon-cyan)] transition-colors cursor-pointer"
                          tabIndex={-1}
                          title={showPassword ? (isEn ? 'Hide' : '隱藏') : (isEn ? 'Show' : '顯示')}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* 登入驗證錯誤訊息提示 */}
                    {loginError && (
                      <div
                        className="flex items-center gap-1.5 px-3 py-2 border cyber-cut-sm text-[11px] font-['Noto_Sans_TC']"
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.08)',
                          borderColor: 'rgba(239,68,68,0.3)',
                          color: '#f87171',
                        }}
                      >
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 底部操作：登入或進入管理後臺 */}
              <div
                className="pt-4 border-t space-y-2"
                style={{ borderColor: isLight ? 'rgba(2,132,199,0.2)' : 'rgba(0,240,255,0.2)' }}
              >
                {showLoginForm ? (
                  <div className="flex items-center gap-2">
                    {/* 取消操作 */}
                    <button
                      type="button"
                      onClick={handleCancelLogin}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center px-3 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer disabled:opacity-40"
                      style={{
                        backgroundColor: isLight ? '#f1f5f9' : '#080e1a',
                        color: isLight ? '#64748b' : '#94a3b8',
                        borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      {isEn ? 'Cancel' : '取消'}
                    </button>
                    {/* 確認登入驗證 */}
                    <button
                      type="button"
                      onClick={handleAdminLogin}
                      disabled={isLoading || !username.trim() || !password.trim()}
                      className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isLight ? '#0284c7' : 'rgba(0,240,255,0.15)',
                        color: isLight ? '#ffffff' : '#00f0ff',
                        borderColor: isLight ? '#0284c7' : '#00f0ff',
                      }}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isEn ? 'LOGIN' : '登入驗證'}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* 主要操作：透過登入表單驗證進入後臺 */}
                    <button
                      type="button"
                      onClick={() => setShowLoginForm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold transition-all cursor-pointer hover:opacity-90 active:scale-[0.98]"
                      style={{
                        backgroundColor: isLight ? '#0284c7' : 'rgba(0,240,255,0.15)',
                        color: isLight ? '#ffffff' : '#00f0ff',
                        borderColor: isLight ? '#0284c7' : '#00f0ff',
                      }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEn ? 'ENTER ADMIN MODE' : '進入管理者模式'}</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── 2. 預覽模式卡片 ── */}
            <div
              onClick={handlePreviewClick}
              onMouseEnter={() => setHoveredCard('preview')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative text-left p-6 sm:p-7 border cyber-cut-sm transition-all duration-300 cursor-pointer focus:outline-none flex flex-col justify-between"
              style={{
                backgroundColor: hoveredCard === 'preview'
                  ? (isLight ? 'rgba(109,40,217,0.06)' : 'rgba(168,85,247,0.06)')
                  : (isLight ? '#ffffff' : 'rgba(8,14,26,0.85)'),
                borderColor: hoveredCard === 'preview'
                  ? (isLight ? '#7c3aed' : '#a855f7')
                  : (isLight ? '#cbd5e1' : 'rgba(168,85,247,0.25)'),
                boxShadow: hoveredCard === 'preview'
                  ? (isLight
                    ? '0 0 30px rgba(124,58,237,0.2), inset 0 0 20px rgba(124,58,237,0.05)'
                    : '0 0 30px rgba(168,85,247,0.2), inset 0 0 20px rgba(168,85,247,0.05)')
                  : 'none',
                transform: hoveredCard === 'preview' ? 'translateY(-2px)' : 'none',
              }}
            >
              <div>
                {/* 頂部資訊列：圖示與狀態 */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 border cyber-cut-sm flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.12)',
                      borderColor: isLight ? '#c084fc' : 'rgba(168,85,247,0.35)',
                    }}
                  >
                    <Eye
                      className="w-6 h-6 transition-all duration-300"
                      style={{ color: isLight ? '#7c3aed' : '#c084fc' }}
                    />
                  </div>

                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 border cyber-cut-sm text-[10px] font-['Share_Tech_Mono'] font-bold"
                    style={{
                      backgroundColor: isLight ? 'rgba(124,58,237,0.1)' : 'rgba(168,85,247,0.1)',
                      color: isLight ? '#7c3aed' : '#c084fc',
                      borderColor: isLight ? 'rgba(124,58,237,0.3)' : 'rgba(168,85,247,0.3)',
                    }}
                  >
                    <Eye className="w-2.5 h-2.5" />
                    {isEn ? 'READ ONLY' : '唯讀預覽'}
                  </span>
                </div>

                <h2
                  className="text-lg font-['Orbitron',sans-serif] font-bold mb-2 tracking-wide uppercase"
                  style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                >
                  {isEn ? 'Admin Mode (Preview)' : '管理者模式 預覽'}
                </h2>
                <p
                  className="text-xs font-['Noto_Sans_TC'] leading-relaxed mb-4"
                  style={{ color: isLight ? '#475569' : 'rgba(148,163,184,0.85)' }}
                >
                  {isEn
                    ? 'Browse all actual live data and configurations. Fields are disabled to protect content.'
                    : '免登入即可瀏覽全部真實資料與配置結構。所有表單為唯讀保護狀態，無法提交寫入。'}
                </p>

                {/* 核心特點清單 */}
                <ul className="space-y-1.5 mb-6">
                  {[
                    isEn ? 'Inspect real production data & settings' : '完整檢視真實資料與架構欄位',
                    isEn ? 'Zero credentials or login required' : '免登入無門檻隨時隨地查閱',
                    isEn ? 'Read-only safety guard against accidental edits' : '唯讀防護，杜絕意外更動資料',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 shrink-0"
                        style={{ backgroundColor: isLight ? '#7c3aed' : '#c084fc' }}
                      />
                      <span
                        className="text-xs font-['Noto_Sans_TC']"
                        style={{ color: isLight ? '#334155' : 'rgba(226,232,240,0.9)' }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 底部操作：進入預覽模式 */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: isLight ? 'rgba(124,58,237,0.2)' : 'rgba(168,85,247,0.2)' }}
              >
                <button
                  type="button"
                  onClick={handlePreviewClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border cyber-cut-sm text-xs font-['Share_Tech_Mono'] font-bold transition-all cursor-pointer group-hover:border-purple-400 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: isLight ? '#f3e8ff' : 'rgba(168,85,247,0.15)',
                    color: isLight ? '#6d28d9' : '#c084fc',
                    borderColor: isLight ? '#c084fc' : '#a855f7',
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isEn ? 'ENTER PREVIEW MODE' : '進入管理者模式 預覽'}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* 底部操作：返回使用者模式（若有未儲存變更強制彈窗確認） */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleReturnToUserMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 border cyber-cut-sm text-xs font-['Noto_Sans_TC'] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
              style={{
                backgroundColor: isLight ? 'rgba(3,105,161,0.08)' : 'rgba(0,240,255,0.08)',
                borderColor: isLight ? '#0284c7' : 'rgba(0,240,255,0.35)',
                color: isLight ? '#0284c7' : 'var(--neon-cyan)',
              }}
            >
              <User className="w-4 h-4" />
              <span>{isEn ? 'Return to User Mode' : '返回使用者模式'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CmsModeSelectDialog;
