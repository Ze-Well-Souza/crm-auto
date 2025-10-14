import React, { createContext, useContext, ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, stripeConfig } from '@/lib/stripe';

interface StripeContextType {
  // Adicionar métodos específicos do contexto se necessário
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const contextValue: StripeContextType = {
    // Implementar métodos específicos se necessário
  };

  if (!stripePromise) {
    // Stripe não configurado: retorna filhos sem Elements para evitar erros no console
    return (
      <StripeContext.Provider value={contextValue}>
        {children}
      </StripeContext.Provider>
    );
  }

  return (
    <Elements 
      stripe={stripePromise!} 
      options={{
        appearance: stripeConfig.appearance,
        locale: stripeConfig.locale,
      }}
    >
      <StripeContext.Provider value={contextValue}>
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};