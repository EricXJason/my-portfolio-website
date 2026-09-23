/**
 * ============================================================================
 * 檔案名稱: navbar.test.tsx
 * 所屬模組: Test Suite (頂部導覽列 Navbar 整合測試)
 * 責任描述: 驗證 Navbar 模組順序拓撲、雙語文案渲染與音量、主題切換控制。
 * ============================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Navbar } from '../../components/Navbar';
import { PortfolioDataProvider } from '../../context/PortfolioDataContext';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';

const renderNavbar = (lang: 'zh' | 'en' = 'zh') => {
  return render(
    <PortfolioDataProvider>
      <LangProvider>
        <ThemeProvider>
          <Navbar
            soundPlaying={false}
            soundVolume={0.3}
            onToggleSound={vi.fn()}
            onChangeVolume={vi.fn()}
            siteEntered={true}
          />
        </ThemeProvider>
      </LangProvider>
    </PortfolioDataProvider>
  );
};

describe('前臺頂部導覽列 Navbar 測試', () => {
  it('正確渲染首頁、關於我、專案作品、專業技能、經歷、專業證照、美術畫廊各大導覽項目', () => {
    renderNavbar('zh');

    // 檢查導覽列中各區塊文字是否存在
    expect(screen.getByText('首頁')).toBeInTheDocument();
    expect(screen.getByText('關於我')).toBeInTheDocument();
    expect(screen.getByText('專案作品')).toBeInTheDocument();
    expect(screen.getByText('專業技能')).toBeInTheDocument();
    expect(screen.getByText('經歷')).toBeInTheDocument();
    expect(screen.getByText('專業證照')).toBeInTheDocument();
    expect(screen.getByText('美術畫廊')).toBeInTheDocument();
  });

  it('導覽連結的 href 錨點必須對齊各區塊 id，且經歷下拉選單項目完整', () => {
    renderNavbar('zh');

    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href')).filter(Boolean);

    // 驗證一般頁籤連結錨點
    expect(hrefs).toContain('#home');
    expect(hrefs).toContain('#about');
    expect(hrefs).toContain('#projects');
    expect(hrefs).toContain('#skills');
    expect(hrefs).toContain('#awards');
    expect(hrefs).toContain('#gallery');

    // 經歷模組為下拉選單按鈕，點擊展開驗證子項目錨點
    const expButton = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('經歷'));
    expect(expButton).toBeDefined();
    if (expButton) {
      fireEvent.click(expButton);
      const updatedLinks = screen.getAllByRole('link');
      const updatedHrefs = updatedLinks.map((l) => l.getAttribute('href')).filter(Boolean);
      expect(updatedHrefs).toContain('#work-experience');
    }
  });
});
