import React from 'react';

export function useRenaming() {
  const [isRenaming, setIsRenaming] = React.useState(false);
  return {
    isRenaming,
    startRenaming: () => setIsRenaming(true),
    stopRenaming: () => setIsRenaming(false),
  };
}
