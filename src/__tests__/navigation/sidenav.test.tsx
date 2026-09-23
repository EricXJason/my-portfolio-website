/**
 * ============================================================================
 * 檔案名稱: sidenav.test.tsx
 * 所屬模組: Test Suite (桌面端側邊浮動快捷導覽單元測試)
 * 責任描述: 嚴格驗證 SideNav 之模組呈現順序、滾動錨點跳轉與可見度過濾機制。
 * 架構分層: Unit Tests (Vitest + Testing Library)
 * ============================================================================
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SideNav } from '../../components/SideNav';
import { LangProvider } from '../../context/LangContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { PortfolioDataProvider, getContentFingerprint } from '../../context/PortfolioDataContext';

const renderSideNav = (siteEntered = true) => {
  return render(
    <ThemeProvider>
      <LangProvider>
        <PortfolioDataProvider>
          <SideNav siteEntered={siteEntered} />
        </PortfolioDataProvider>
      </LangProvider>
    </ThemeProvider>
  );
};

describe('SideNav 側邊浮動導覽單元測試', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('portfolio_content_fingerprint', getContentFingerprint());
    vi.clearAllMocks();
  });

  it('應呈現正確的 7 大模組順序 (首頁 -> 關於我 -> 專案作品 -> 專業技能 -> 經歷 -> 專業證照 -> 美術畫廊)', () => {
    renderSideNav(true);
    const navLinks = screen.getAllByRole('link');
    const hrefs = navLinks.map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual([
      '#home',
      '#about',
      '#projects',
      '#skills',
      '#experience',
      '#awards',
      '#gallery',
    ]);
  });

  it('開場未進入站臺 (siteEntered=false) 時應具有隱藏樣式，進入後 (siteEntered=true) 顯示', () => {
    const { rerender } = renderSideNav(false);
    const nav = screen.getByRole('navigation', { name: /快速導覽/i });
    expect(nav.className).toContain('opacity-0');
    expect(nav.className).toContain('pointer-events-none');

    rerender(
      <ThemeProvider>
        <LangProvider>
          <PortfolioDataProvider>
            <SideNav siteEntered={true} />
          </PortfolioDataProvider>
        </LangProvider>
      </ThemeProvider>
    );
    expect(nav.className).toContain('opacity-100');
  });

  it('點擊導覽項目時應呼叫 window.scrollTo 進行滑順捲動', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'projects';
    Object.defineProperty(mockElement, 'getBoundingClientRect', {
      value: () => ({ top: 400 }),
    });
    document.body.appendChild(mockElement);

    renderSideNav(true);
    const projectsLink = screen.getByRole('link', { name: /專案作品|PROJECTS/i });
    fireEvent.click(projectsLink);

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: 'smooth',
      })
    );

    document.body.removeChild(mockElement);
  });

  it('當模組可視性變更為隱藏時，應即時過濾該章節且首頁永不隱藏', () => {
    localStorage.setItem(
      'portfolio_modules_visibility',
      JSON.stringify({
        home: false, // Attempt to hide home
        projects: false,
        gallery: false,
      })
    );

    renderSideNav(true);
    let navLinks = screen.getAllByRole('link');
    let hrefs = navLinks.map((link) => link.getAttribute('href'));

    // 首頁依規定不可隱藏，projects 與 gallery 則被過濾
    expect(hrefs).toContain('#home');
    expect(hrefs).not.toContain('#projects');
    expect(hrefs).not.toContain('#gallery');

    // 模擬動態廣播更新事件
    act(() => {
      localStorage.setItem(
        'portfolio_modules_visibility',
        JSON.stringify({ projects: true, gallery: true })
      );
      window.dispatchEvent(new Event('portfolio_modules_visibility_updated'));
    });

    navLinks = screen.getAllByRole('link');
    hrefs = navLinks.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('#projects');
    expect(hrefs).toContain('#gallery');
  });
});
