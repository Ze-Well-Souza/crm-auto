// Service Worker para PWA - CRM Parceiro
const CACHE_NAME = 'crm-parceiro-v1.0.1'; // Atualizado para forçar nova instalação
const OFFLINE_URL = '/offline.html';

// Recursos essenciais para cache
const ESSENTIAL_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  // Adicionar outros recursos essenciais conforme necessário
];

// Recursos de dados para cache
const DATA_CACHE_NAME = 'crm-data-v1.0.0';

// URLs de API que devem ser cacheadas
const API_URLS = [
  '/api/appointments',
  '/api/clients',
  '/api/vehicles',
  '/api/financial',
  '/api/inventory'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential resources');
        return cache.addAll(ESSENTIAL_RESOURCES);
      })
      .then(() => {
        // Força a ativação imediata do novo service worker
        return self.skipWaiting();
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Assume controle de todas as páginas abertas
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Não cachear URLs externas (Supabase, etc.)
  const isExternalURL = !url.origin.includes(self.location.origin);
  const isSupabaseURL = url.origin.includes('supabase.co');
  
  // Ignorar requisições do Supabase para evitar erros de cache
  if (isSupabaseURL) {
    event.respondWith(fetch(request));
    return;
  }

  // Estratégia para navegação (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Se a resposta for bem-sucedida, cache e retorna
          if (response.status === 200 && !isExternalURL) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone).catch(err => {
                console.log('[SW] Failed to cache navigation:', err);
              });
            });
          }
          return response;
        })
        .catch(() => {
          // Se offline, tenta buscar no cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Se não encontrar no cache, retorna página offline
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Estratégia para APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Se a resposta for bem-sucedida, cache para uso offline
            if (response.status === 200 && request.method === 'GET') {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Se offline, busca no cache de dados
            return cache.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  // Adiciona header para indicar que é dados em cache
                  const response = cachedResponse.clone();
                  response.headers.set('X-From-Cache', 'true');
                  return response;
                }
                // Retorna resposta de erro offline
                return new Response(
                  JSON.stringify({
                    error: 'Dados não disponíveis offline',
                    offline: true,
                    timestamp: new Date().toISOString()
                  }),
                  {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Offline': 'true'
                    }
                  }
                );
              });
          });
      })
    );
    return;
  }

  // Estratégia para recursos estáticos (CSS, JS, imagens)
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'image') {
    
    // Não cachear recursos externos
    if (isExternalURL) {
      event.respondWith(fetch(request));
      return;
    }
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone).catch(err => {
                    console.log('[SW] Failed to cache resource:', err);
                  });
                });
              }
              return response;
            })
            .catch(() => {
              // Para imagens, retorna uma imagem placeholder se offline
              if (request.destination === 'image') {
                return new Response(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
              throw new Error('Resource not available offline');
            });
        })
    );
    return;
  }

  // Para outras requisições, usa estratégia network-first
  // Mas apenas para recursos do mesmo domínio
  if (isExternalURL) {
    event.respondWith(fetch(request));
    return;
  }
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch(err => {
              console.log('[SW] Failed to cache request:', err);
            });
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Função para sincronizar dados offline
async function syncOfflineData() {
  try {
    // Busca dados pendentes no IndexedDB
    const pendingData = await getPendingOfflineData();
    
    for (const item of pendingData) {
      try {
        // Tenta enviar dados para o servidor
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });
        
        if (response.ok) {
          // Remove item dos dados pendentes se enviado com sucesso
          await removePendingOfflineData(item.id);
          console.log('[SW] Synced offline data:', item.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync item:', item.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Funções auxiliares para IndexedDB (implementação simplificada)
async function getPendingOfflineData() {
  // Implementar busca no IndexedDB
  return [];
}

async function removePendingOfflineData(id) {
  // Implementar remoção no IndexedDB
  console.log('Removing pending data:', id);
}

// Notificações push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Você tem novas atualizações no CRM Parceiro',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir CRM',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/favicon.ico'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'CRM Parceiro';
  }

  event.waitUntil(
    self.registration.showNotification('CRM Parceiro', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Apenas fecha a notificação
    return;
  } else {
    // Clique na notificação (não em ação específica)
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
})