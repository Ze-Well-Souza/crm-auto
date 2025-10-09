import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'date-vendor': ['date-fns'],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', 'zod'],
          
          // Feature chunks
          'appointments': [
            './src/pages/Agendamentos.tsx',
            './src/components/appointments/AppointmentForm.tsx',
            './src/components/appointments/AppointmentCard.tsx',
            './src/hooks/useAppointmentsNew.ts'
          ],
          'parts': [
            './src/pages/Estoque.tsx',
            './src/components/parts/PartsForm.tsx',
            './src/components/parts/PartsCard.tsx',
            './src/hooks/usePartsNew.ts'
          ],
          'financial': [
            './src/pages/Financeiro.tsx',
            './src/components/financial/TransactionForm.tsx',
            './src/components/financial/FinancialCard.tsx',
            './src/hooks/useFinancialTransactionsNew.ts'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  }
}));
