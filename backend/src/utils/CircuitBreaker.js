import Logger from "./logger.js";

export const CircuitState = {
  CLOSED: "CLOSED",
  OPEN: "OPEN",
  HALF_OPEN: "HALF_OPEN",
};

export class CircuitBreakerError extends Error {
  constructor(message, state) {
    super(message);
    this.name = "CircuitBreakerError";
    this.state = state;
  }
}

export class BulkheadError extends Error {
  constructor(message) {
    super(message);
    this.name = "BulkheadError";
  }
}

export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}

export class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.timeout = options.timeout || 3000; // Operation timeout in ms
    this.failureThreshold = options.failureThreshold || 3; // Consecutive failures to trip
    this.resetTimeout = options.resetTimeout || 5000; // ms to wait in OPEN before HALF_OPEN
    this.maxConcurrent = options.maxConcurrent || 5; // Bulkhead concurrency limit
    this.halfOpenMaxAttempts = options.halfOpenMaxAttempts || 2; // Probes needed in HALF_OPEN

    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.activeRequests = 0;
    this.fallback = options.fallback || null;
  }

  getState() {
    this.evaluateState();
    return this.state;
  }

  evaluateState() {
    if (
      this.state === CircuitState.OPEN &&
      this.lastFailureTime &&
      Date.now() - this.lastFailureTime >= this.resetTimeout
    ) {
      this.state = CircuitState.HALF_OPEN;
      this.successCount = 0;
      Logger.info(`[CircuitBreaker:${this.name}] Transitioned OPEN -> HALF_OPEN (Testing recovery)`);
    }
  }

  async execute(action, fallback = null) {
    this.evaluateState();

    const effectiveFallback = fallback || this.fallback;

    // 1. Check Circuit State (Fast-Fail if OPEN)
    if (this.state === CircuitState.OPEN) {
      const errorMsg = `[CircuitBreaker:${this.name}] Circuit is OPEN. Fast-failing request.`;
      Logger.warn(errorMsg);
      if (effectiveFallback) {
        return await effectiveFallback(new CircuitBreakerError(errorMsg, this.state));
      }
      throw new CircuitBreakerError(errorMsg, this.state);
    }

    // 2. Check Bulkhead Concurrency Limit
    if (this.activeRequests >= this.maxConcurrent) {
      const errorMsg = `[CircuitBreaker:${this.name}] Bulkhead capacity exceeded (${this.activeRequests}/${this.maxConcurrent} active).`;
      Logger.warn(errorMsg);
      if (effectiveFallback) {
        return await effectiveFallback(new BulkheadError(errorMsg));
      }
      throw new BulkheadError(errorMsg);
    }

    this.activeRequests++;
    let timerId = null;

    try {
      // 3. Execute action with Timeout signal
      const promise = Promise.race([
        action(),
        new Promise((_, reject) => {
          timerId = setTimeout(() => {
            reject(new TimeoutError(`[CircuitBreaker:${this.name}] Operation timed out after ${this.timeout}ms`));
          }, this.timeout);
        }),
      ]);

      const result = await promise;
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      if (effectiveFallback) {
        return await effectiveFallback(err);
      }
      throw err;
    } finally {
      if (timerId) clearTimeout(timerId);
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    }
  }

  onSuccess() {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.halfOpenMaxAttempts) {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        Logger.info(`[CircuitBreaker:${this.name}] Transitioned HALF_OPEN -> CLOSED (Dependency recovered)`);
      }
    } else if (this.state === CircuitState.CLOSED) {
      this.failureCount = 0;
    }
  }

  onFailure(err) {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    Logger.error(`[CircuitBreaker:${this.name}] Failure count ${this.failureCount}/${this.failureThreshold}: ${err.message}`);

    if (this.state === CircuitState.HALF_OPEN || this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      Logger.warn(`[CircuitBreaker:${this.name}] Circuit TRIPPED to OPEN state!`);
    }
  }

  getMetrics() {
    this.evaluateState();
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      activeRequests: this.activeRequests,
      maxConcurrent: this.maxConcurrent,
      timeout: this.timeout,
    };
  }

  reset() {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.activeRequests = 0;
  }
}
