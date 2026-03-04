// Performance monitoring utilities
import { logger } from '@/lib/logger';

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 100;

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try { return fn(); }
    finally { this.recordMetric(name, performance.now() - start); }
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try { return await fn(); }
    finally { this.recordMetric(name, performance.now() - start); }
  }

  recordMetric(name: string, duration: number): void {
    this.metrics.push({ name, duration, timestamp: Date.now() });
    if (this.metrics.length > this.maxMetrics) this.metrics.shift();
    if (import.meta.env.DEV && duration > 1000) {
      logger.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  getSummary(name?: string) {
    const filtered = name ? this.metrics.filter(m => m.name === name) : this.metrics;
    if (filtered.length === 0) return null;
    const durations = filtered.map(m => m.duration);
    const sum = durations.reduce((a, b) => a + b, 0);
    return {
      count: filtered.length,
      avgDuration: sum / filtered.length,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
    };
  }

  getAllMetrics(): PerformanceMetrics[] { return [...this.metrics]; }
  clear(): void { this.metrics = []; }

  reportWebVitals(): void {
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          logger.debug('LCP:', lastEntry.startTime.toFixed(2), 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            logger.debug('FID:', entry.processingStart - entry.startTime, 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              logger.debug('CLS:', clsScore.toFixed(4));
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        logger.warn('PerformanceObserver not fully supported:', e);
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

if (import.meta.env.DEV) {
  performanceMonitor.reportWebVitals();
}

export const measurePerformance = <T,>(name: string, fn: () => T): T =>
  performanceMonitor.measure(name, fn);

export const measurePerformanceAsync = <T,>(name: string, fn: () => Promise<T>): Promise<T> =>
  performanceMonitor.measureAsync(name, fn);

export const getPerformanceSummary = (name?: string) => performanceMonitor.getSummary(name);
export const getAllPerformanceMetrics = () => performanceMonitor.getAllMetrics();