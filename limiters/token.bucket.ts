import { RateLimiter } from "./rate.limiter";

export class TokenBucket implements RateLimiter {
  private capacity: number;
  private tokens: number;
  private refillInterval: number;
  private lastRefill: number | undefined;
  private lastRequestsTimestamp: number | undefined;

  constructor(capacity: number, refillInterval: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillInterval = (refillInterval / capacity) * 1000;
  }

  private refill(timestamp: number) {
    if (!this.lastRefill) {
      this.lastRefill = timestamp
    }
    const timePassed = timestamp - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval);

    if (tokensToAdd > 0 && timestamp > this.lastRefill) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill += tokensToAdd * this.refillInterval;
    }
  }

  get lastTimestamp(): number | undefined {
    return this.lastRequestsTimestamp;
  }

  get size(): number {
    return this.tokens;
  }

  canRequest(timestamp: number): boolean {
    this.refill(timestamp);

    if (this.tokens >= 1) {
      this.lastRequestsTimestamp = timestamp;
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}