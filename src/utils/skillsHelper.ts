/**
 * ============================================================================
 * 檔案名稱: skillsHelper.ts
 * 所屬模組: Utility System (技能標籤智慧分割工具庫)
 * 責任描述: 負責將技能字串依據半形「/」與全形「／」斜線智慧切割為獨立標籤，並保護中英括號內文字不被誤割。
 * 架構分層: Shared Utility Layer
 * 依賴關係: 純函數工具，無外部相依。
 * 邊界處理: 支援空字串防禦返回空陣列、自動去除首尾空白、智慧負向查找正則表示式。
 * ============================================================================
 */

/**
 * 將技能技術堆疊內容字串智慧切割為各個獨立的技能標籤項目。
 * 同時支援標準半形斜線「/」與全形斜線「／」作為分隔符號。
 * 具備括號防護正則機制，保護英文小括號 `()` 或繁體中文全形括號 `（）` 內部的斜線不被誤割。
 *
 * @example
 * splitSkillTokens("Unity ( C#) / Unreal Engine ( Blueprints )")
 * // => ["Unity ( C#)", "Unreal Engine ( Blueprints )"]
 */
export const splitSkillTokens = (content: string): string[] => {
  if (!content) return [];
  return content
    .split(/\s*[/／]\s*(?![^(（]*[)）])/)
    .map((s) => s.trim())
    .filter(Boolean);
};
