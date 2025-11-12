// Rate limiting utility for Supabase Edge Functions
// Uses a sliding window algorithm with Redis-like behavior using Deno KV

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyPrefix?: string; // Prefix for rate limit keys
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // Timestamp when the window resets
  retryAfter?: number; // Seconds until retry (when rate limited)
}

export class RateLimiter {
  private config: RateLimitConfig;
  private kv: Deno.Kv;

  constructor(config: RateLimitConfig, kv: Deno.Kv) {
    this.config = {
      keyPrefix: 'rate_limit',
      ...config
    };
    this.kv = kv;
  }

  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const key = [this.config.keyPrefix, identifier];
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Get current request timestamps
      const result = await this.kv.get<number[]>(key);
      let requests = result.value || [];

      // Remove old requests outside the window
      requests = requests.filter(timestamp => timestamp > windowStart);

      // Check if limit exceeded
      if (requests.length >= this.config.maxRequests) {
        const oldestRequest = requests[0];
        const resetTime = oldestRequest + this.config.windowMs;
        const retryAfter = Math.ceil((resetTime - now) / 1000);

        return {
          allowed: false,
          remaining: 0,
          reset: resetTime,
          retryAfter: Math.max(0, retryAfter)
        };
      }

      // Add current request
      requests.push(now);
      
      // Store updated requests with TTL
      await this.kv.set(key, requests, {
        expireIn: this.config.windowMs * 2 // Give some buffer for cleanup
      });

      return {
        allowed: true,
        remaining: this.config.maxRequests - requests.length,
        reset: now + this.config.windowMs
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        reset: now + this.config.windowMs
      };
    }
  }

  async resetLimit(identifier: string): Promise<void> {
    const key = [this.config.keyPrefix, identifier];
    await this.kv.delete(key);
  }
}

// Predefined rate limit configurations for different use cases
export const RATE_LIMIT_PRESETS = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },
  
  // Moderate limits for general API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60
  },
  
  // Relaxed limits for webhook endpoints
  webhook: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120
  },
  
  // Strict limits for email sending
  email: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10
  },
  
  // Limits for WhatsApp messages
  whatsapp: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30
  }
} as const;

// Helper function to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a default if no IP found (shouldn't happen in production)
  return 'unknown';
}

// Helper function to create rate limit identifier based on request
export function createRateLimitIdentifier(
  request: Request, 
  type: 'ip' | 'user' | 'api_key' = 'ip',
  userId?: string
): string {
  switch (type) {
    case 'ip':
      return `ip:${getClientIp(request)}`;
    
    case 'user':
      if (!userId) {
        throw new Error('User ID required for user-based rate limiting');
      }
      return `user:${userId}`;
    
    case 'api_key':
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return `ip:${getClientIp(request)}`; // Fallback to IP
      }
      const apiKey = authHeader.substring(7);
      return `api_key:${apiKey.substring(0, 16)}`; // Use first 16 chars of key
    
    default:
      return `ip:${getClientIp(request)}`;
  }
}