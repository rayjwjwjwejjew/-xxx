import { useState } from 'react';

import type { TileTemplate } from '@/types';

export function useDragAndDrop() {
  const [draggingTemplate, setDraggingTemplate] = useState<TileTemplate | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const startDragging = (template: TileTemplate) => {
    setDraggingTemplate(template);
  };

  const endDragging = () => {
    setDraggingTemplate(null);
    setDropTargetIndex(null);
  };

  return {
    draggingTemplate,
    dropTargetIndex,
    endDragging,
    setDropTargetIndex,
    startDragging,
  };
}
