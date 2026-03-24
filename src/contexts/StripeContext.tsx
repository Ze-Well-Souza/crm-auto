import React, { createContext, useContext, ReactNode } from 'react';

// v2: integração Mercado Pago / Stripe será adicionada aqui
interface StripeContextType {}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  // Pagamento online desabilitado na v1 — cobranças feitas no estabelecimento
  const contextValue: StripeContextType = {};

  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripeContext must be used within a StripeProvider');
  }
  return context;
};
