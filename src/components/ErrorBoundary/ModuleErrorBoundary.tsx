import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
  moduleIcon?: React.ReactNode;
  fallbackRoute?: string;
}

const ModuleErrorFallback: React.FC<{
  moduleName: string;
  moduleIcon?: React.ReactNode;
  fallbackRoute?: string;
}> = ({ moduleName, moduleIcon, fallbackRoute }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (fallbackRoute) {
      navigate(fallbackRoute);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="mb-6 flex justify-center">
          {moduleIcon || <AlertTriangle className="h-20 w-20 text-red-500" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Erro no módulo {moduleName}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Ocorreu um erro no módulo <strong>{moduleName}</strong>. 
          Este erro foi registrado e nossa equipe foi notificada. 
          Você pode tentar acessar outras funcionalidades do sistema.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recarregar módulo
          </button>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium ml-3"
          >
            <Home className="h-5 w-5 mr-2" />
            Ir para início
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>Se o problema persistir, entre em contato com o suporte técnico.</p>
        </div>
      </div>
    </div>
  );
};

export const ModuleErrorBoundary: React.FC<ModuleErrorBoundaryProps> = ({
  children,
  moduleName,
  moduleIcon,
  fallbackRoute,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log específico do módulo
    console.error(`Error in ${moduleName} module:`, error, errorInfo);
    
    // Aqui você pode enviar para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    // trackError(error, { module: moduleName, ...errorInfo });
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={
        <ModuleErrorFallback
          moduleName={moduleName}
          moduleIcon={moduleIcon}
          fallbackRoute={fallbackRoute}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ModuleErrorBoundary;