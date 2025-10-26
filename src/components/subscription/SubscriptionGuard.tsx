import { ReactNode } from 'react';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { UpgradePrompt } from './UpgradePrompt';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface SubscriptionGuardProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
}

export const SubscriptionGuard = ({ 
  children, 
  feature,
  fallback 
}: SubscriptionGuardProps) => {
  const { hasFeature, loading } = useSubscriptionContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasFeature(feature)) {
    return fallback || <UpgradePrompt feature={feature} />;
  }

  return <>{children}</>;
};
