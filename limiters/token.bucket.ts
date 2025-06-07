import { RateLimiter } from "./rate.limiter";

export class TokenBucket implements RateLimiter {
  private capacity: number;
  private tokens: number;
  private refillInterval: number;
  private lastRefill: number;

  constructor(capacity: number, refillInterval: number, lastRefill?: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillInterval = (refillInterval / capacity) * 1000;
    this.lastRefill = lastRefill ?? Date.now();
  }

  private refill(timestamp: number) {
    const timePassed = timestamp - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval);

    if (tokensToAdd > 0 && timestamp > this.lastRefill) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill += tokensToAdd * this.refillInterval;
    }
  }

  get lastUpdate(): number {
    return this.lastRefill;
  }

  get size(): number {
    return this.tokens;
  }

  canRequest(timestamp: number): boolean {
    this.refill(timestamp);

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}