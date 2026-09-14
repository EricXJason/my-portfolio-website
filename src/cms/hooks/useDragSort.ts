/**
 * ============================================================================
 * 檔案名稱: useDragSort.ts
 * 所屬模組: CMS Drag and Drop System (後臺拖曳排序自訂 Hook)
 * 責任描述: 封裝 HTML5 原生拖放 (Drag & Drop) API，提供通用且零外部相依之項目重排邏輯。
 * 架構分層: Custom Hook Layer (共用 Hook 層)
 * 依賴關係: 僅依賴 React 核心 Hook (useState, useRef, useCallback)。
 * 邊界處理: 防止拖曳至自身造成無效重排、索引查無保護、拖曳結束時自動清理暫存狀態。
 * ============================================================================
 */

import { useState, useRef, useCallback } from 'react';

export interface DragSortState {
  dragOverKey: string | null;
  draggingKey: string | null;
}

export interface DragHandleBindings {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export interface DropZoneBindings {
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

/**
 * 通用 HTML5 拖曳重新排序 Hook。
 * 完全不依賴外部龐大拖曳套件，保持極致輕量與流暢。
 *
 * @param items - 當前排序項目列表陣列
 * @param onReorder - 成功放置後觸發之更新回呼函式
 * @param getKey - 從項目中擷取穩定唯一鍵值的函式
 */
export function useDragSort<T>(
  items: T[],
  onReorder: (newItems: T[]) => void,
  getKey: (item: T) => string
) {
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const dragSourceRef = useRef<string | null>(null);

  const getDragHandleProps = useCallback(
    (key: string): DragHandleBindings => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        dragSourceRef.current = key;
        setDraggingKey(key);
        // 設定拖放效果與傳遞鍵值
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', key);
      },
      onDragEnd: (_e: React.DragEvent) => {
        setDraggingKey(null);
        setDragOverKey(null);
        dragSourceRef.current = null;
      },
    }),
    []
  );

  const getDropZoneProps = useCallback(
    (key: string): DropZoneBindings => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragSourceRef.current !== key) {
          setDragOverKey(key);
        }
      },
      onDragLeave: (_e: React.DragEvent) => {
        setDragOverKey(null);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        const sourceKey = dragSourceRef.current;
        const targetKey = key;

        if (!sourceKey || sourceKey === targetKey) {
          setDraggingKey(null);
          setDragOverKey(null);
          dragSourceRef.current = null;
          return;
        }

        const sourceIndex = items.findIndex((item) => getKey(item) === sourceKey);
        const targetIndex = items.findIndex((item) => getKey(item) === targetKey);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const newItems = [...items];
        const [removed] = newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, removed);

        onReorder(newItems);
        setDraggingKey(null);
        setDragOverKey(null);
        dragSourceRef.current = null;
      },
    }),
    [items, onReorder, getKey]
  );

  const isDragging = useCallback(
    (key: string) => draggingKey === key,
    [draggingKey]
  );

  const isDragOver = useCallback(
    (key: string) => dragOverKey === key,
    [dragOverKey]
  );

  return {
    getDragHandleProps,
    getDropZoneProps,
    isDragging,
    isDragOver,
    draggingKey,
    dragOverKey,
  };
}
