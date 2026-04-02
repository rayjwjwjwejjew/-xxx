import { useCallback, useState } from 'react';

interface StatusMessage {
  tone: 'success' | 'error' | 'info';
  text: string;
}

export function useExport() {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const runAction = useCallback(
    async (actionKey: string, action: () => Promise<void>, successText: string) => {
      setActiveAction(actionKey);
      setStatusMessage({ tone: 'info', text: '正在处理中，请稍候…' });

      try {
        await action();
        setStatusMessage({ tone: 'success', text: successText });
      } catch (error) {
        const message = error instanceof Error ? error.message : '发生未知错误，请稍后重试。';
        setStatusMessage({ tone: 'error', text: message });
      } finally {
        setActiveAction(null);
      }
    },
    [],
  );

  return {
    activeAction,
    isBusy: activeAction !== null,
    runAction,
    setStatusMessage,
    statusMessage,
  };
}
