import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { initSentry } from "./integrations/sentry";
// import { ErrorBoundary } from "./components/ErrorBoundary";

// Initialize Sentry for error monitoring
// initSentry(); // temporariamente desabilitado

// Service Worker temporariamente desabilitado para debug
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registrado com sucesso: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW falhou ao registrar: ', registrationError);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);