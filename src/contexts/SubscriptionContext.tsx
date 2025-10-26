import React, { createContext, useContext, ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionContext = createContext<ReturnType<typeof useSubscription> | null>(null);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const subscription = useSubscription();
  
  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within SubscriptionProvider');
  }
  return context;
};
