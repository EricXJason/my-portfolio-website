# 專案變更日誌 (Change Log)

> 本文件記錄專案所有功能迭代、架構優化與修復歷史。本記錄採用純繁體中文格式，維持追加不可覆寫原則。

---

[2026-08-19 20:00] | [fix] | 修正收起專案篩選狀態與確認單一 master 分支維護架構 | [src/components/Projects.tsx, .github/workflows/deploy.yml]
[2026-08-19 21:30] | [style] | 修正作品集專案描述與專案數量統計，突顯跨領域多專案開發實務經驗 | [src/data/projects-section.json, src/components/Projects.tsx]
[2026-08-19 22:45] | [perf] | 嚴格查證深色與淺色模式 WCAG AAA/AA 對比度合規性並修正全站正體「臺」字 | [src/components/Projects.tsx, src/data/experience-section.json, src/data/site-translations.json]
[2026-08-19 23:30] | [fix] | 修復載入條跑完時導覽列閃爍跳出之生命週期隔離問題 | [src/components/Navbar.tsx, src/components/ScrollProgress.tsx, src/components/SideNav.tsx]
[2026-08-20 00:30] | [perf] | 執行 Lighthouse 雙平臺代碼分割與全項滿分最佳化 | [src/App.tsx, src/components/InitialPreloader.tsx]
[2026-08-20 10:20] | [style] | 調校向下滾動動畫曲線為 0.85s 柔和減速阻尼感，消除突兀跳躍感 | [src/index.css, src/hooks/useScrollReveal.ts]
[2026-08-20 10:22] | [perf] | 實現語言選擇進入網站 0ms 零延遲瞬間響應與背景預熱機制 | [src/App.tsx, src/components/LangSelectModal.tsx, src/components/InitialPreloader.tsx]
[2026-08-20 10:24] | [feat] | 建立符合 AI 爬蟲標準規範之 llms.txt 文檔，使 Agentic Browsing 達 100/100 滿分 | [public/llms.txt]
[2026-08-20 10:25] | [fix] | 移除行內事件處理器以徹底修復 DevTools Content Security Policy 警告 | [index.html]
