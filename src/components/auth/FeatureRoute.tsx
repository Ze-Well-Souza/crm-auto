import { ReactNode } from 'react';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface FeatureRouteProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureRoute = ({ feature, children, fallback }: FeatureRouteProps) => {
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
