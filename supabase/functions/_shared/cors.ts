// CORS configuration for production
const ALLOWED_ORIGINS = [
  'https://crm-auto.com.br',
  'https://www.crm-auto.com.br',
  'https://app.crm-auto.com.br',
  // Add staging/dev domains as needed
  ...(Deno.env.get('ENVIRONMENT') === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173'] 
    : [])
]

export const corsHeaders = (origin?: string) => {
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin)
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }
}

export function handleCors(req: Request): Response | null {
  const origin = req.headers.get('origin')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders(origin)
    })
  }
  
  // Validate origin for actual requests
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Origin not allowed', { 
      status: 403,
      headers: corsHeaders()
    })
  }
  
  return null
}