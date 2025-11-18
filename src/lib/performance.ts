// Performance monitoring utilities

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 100;

  // Measure a function execution time
  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    }
  }

  // Measure an async function execution time
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    }
  }

  // Record a metric manually
  recordMetric(name: string, duration: number): void {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    // Keep only the last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow operations in development
    if (import.meta.env.DEV && duration > 1000) {
      console.warn(`⚠️ Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  // Get metrics summary
  getSummary(name?: string): {
    count: number;
    avgDuration: number;
    maxDuration: number;
    minDuration: number;
  } | null {
    const filtered = name
      ? this.metrics.filter((m) => m.name === name)
      : this.metrics;

    if (filtered.length === 0) return null;

    const durations = filtered.map((m) => m.duration);
    const sum = durations.reduce((a, b) => a + b, 0);

    return {
      count: filtered.length,
      avgDuration: sum / filtered.length,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
    };
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Clear all metrics
  clear(): void {
    this.metrics = [];
  }

  // Report Core Web Vitals
  reportWebVitals(): void {
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('📊 LCP:', lastEntry.startTime.toFixed(2), 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            console.log('📊 FID:', entry.processingStart - entry.startTime, 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              console.log('📊 CLS:', clsScore.toFixed(4));
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('⚠️ PerformanceObserver not fully supported:', e);
      }
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize Web Vitals reporting in development
if (import.meta.env.DEV) {
  performanceMonitor.reportWebVitals();
}

// Helper functions
export const measurePerformance = <T,>(name: string, fn: () => T): T =>
  performanceMonitor.measure(name, fn);

export const measurePerformanceAsync = <T,> (
  name: string,
  fn: () => Promise<T>
): Promise<T> => performanceMonitor.measureAsync(name, fn);

export const getPerformanceSummary = (name?: string) =>
  performanceMonitor.getSummary(name);

export const getAllPerformanceMetrics = () =>
  performanceMonitor.getAllMetrics();
