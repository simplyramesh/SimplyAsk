export const delayedBlockerSyncNavigation = (callback) =>
  setTimeout(() => {
    // This is added to synchronize isBlocked to false, before we proceed redirection
    // So that BlockNavigate doesn't trigger instantly
    callback?.();
  }, 150);
