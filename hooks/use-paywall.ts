// Simplified paywall hook - no restrictions, everything is free
export const usePaywall = () => {
  return {
    isLoading: false,
    shouldBlock: false, // Never block anything
    triggerPaywall: () => {
      // Do nothing - no paywall needed
    },
  };
};
