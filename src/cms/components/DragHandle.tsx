/**
 * ============================================================================
 * 檔案名稱: DragHandle.tsx
 * 所屬模組: CMS UI Components (後臺拖曳排序握柄組件)
 * 責任描述: 提供 CMS 所有可排序列表項目的通用抓取手柄 (Grip Icon)，支援拖曳樣式與觸控隔離。
 * 架構分層: Presentation / Shared Atom Component Layer
 * 依賴關係: 依賴 lucide-react 的 GripVertical 圖示。
 * 邊界處理: 預設包含 `touchAction: 'none'` 防止行動端捲動干擾，並動態依據拖曳狀態調整半透明度。
 * ============================================================================
 */

import React from 'react';
import { GripVertical } from 'lucide-react';

interface DragHandleProps {
  className?: string;
  title?: string;
  isDragging?: boolean;
}

/**
 * CMS 所有可排序列表項目的共用拖曳握柄組件。
 */
export const DragHandle: React.FC<DragHandleProps> = ({
  className = '',
  title = '按住並拖曳以重新排序',
  isDragging = false,
}) => {
  return (
    <span
      title={title}
      className={`inline-flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-150 select-none ${
        isDragging ? 'opacity-40' : 'opacity-30 hover:opacity-80'
      } ${className}`}
      style={{ touchAction: 'none' }}
    >
      <GripVertical className="w-4 h-4 text-[var(--text-sub)]" />
    </span>
  );
};
