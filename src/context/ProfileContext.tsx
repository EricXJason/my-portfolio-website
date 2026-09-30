/**
 * ============================================================================
 * 檔案名稱: ProfileContext.tsx
 * 所屬模組: Application State Layer — 雙履歷模板中樞協調器
 * 責任描述: 提供全站 Profile ('fullstack' | 'interactive') 狀態管理，
 *           供前臺展示分流、PortfolioDataContext 資料隔離與 CMS Toggle 切換器共用。
 *           Profile 初始值由 URL 路徑決定（/i → interactive；其餘 / 與 /f → fullstack）。
 * 架構分層: Application State Layer (React Context API)
 * 依賴關係: 純 React Context，零外部耦合。
 * 邊界處理: Profile 切換不影響語系狀態；CMS 可透過 setProfile 動態切換模板。
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProfileType = 'fullstack' | 'interactive';

export interface ProfileContextValue {
  profile: ProfileType;
  setProfile: (p: ProfileType) => void;
  collectionName: string;
  cachePrefix: string;
  isFullstack: boolean;
  isInteractive: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const COLLECTION_MAP: Record<ProfileType, string> = {
  fullstack: 'portfolio_fullstack_dev',
  interactive: 'portfolio_interactive_app_dev',
};

export const CACHE_PREFIX_MAP: Record<ProfileType, string> = {
  fullstack: 'portfolio_fullstack_dev',
  interactive: 'portfolio_interactive_app_dev',
};

interface ProfileProviderProps {
  children: React.ReactNode;
  /** 由路由層或 CMS 傳入初始 profile，避免首屏閃爍 */
  initialProfile?: ProfileType;
  /** 可選之外部受控 profile */
  currentProfile?: ProfileType;
  onProfileChange?: (p: ProfileType) => void;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  initialProfile = 'fullstack',
  currentProfile,
  onProfileChange,
}) => {
  const [internalProfile, setInternalProfile] = useState<ProfileType>(initialProfile);

  const profile = currentProfile !== undefined ? currentProfile : internalProfile;

  const handleSetProfile = (nextProfile: ProfileType) => {
    setInternalProfile(nextProfile);
    if (onProfileChange) {
      onProfileChange(nextProfile);
    }
  };

  useEffect(() => {
    if (currentProfile !== undefined) {
      setInternalProfile(currentProfile);
    }
  }, [currentProfile]);

  const value: ProfileContextValue = {
    profile,
    setProfile: handleSetProfile,
    collectionName: COLLECTION_MAP[profile],
    cachePrefix: CACHE_PREFIX_MAP[profile],
    isFullstack: profile === 'fullstack',
    isInteractive: profile === 'interactive',
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

/**
 * 取得當前 Profile 狀態的 Hook。
 * 呼叫方需位於 ProfileProvider 內，否則拋出明確提示。
 */
export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('[ProfileContext]: useProfile() 必須在 <ProfileProvider> 內呼叫');
  }
  return ctx;
}
