import { RateLimiter } from "./rate.limiter";

export class SlidingWindow implements RateLimiter {
  private requestTimestamps = new Set<number>();
  private lastRequestTimestamp: number | undefined;

  constructor(
    private limit: number,
    private windowOfSeconds: number
  ) { }

  private getOldestTimestamp(): number | undefined {
    return this.requestTimestamps.keys().next().value;
  }

  private clear(timestamp: number) {
    const windowEdge = timestamp - this.windowOfSeconds * 1000;
    let getOldestTimestamp = this.getOldestTimestamp();

    while (getOldestTimestamp && getOldestTimestamp <= windowEdge) {
      this.requestTimestamps.delete(getOldestTimestamp);
      getOldestTimestamp = this.getOldestTimestamp();
    }
  }

  get size(): number {
    return this.requestTimestamps.size;
  }

  get lastTimestamp(): number | undefined {
    return this.lastRequestTimestamp;
  }

  canRequest(timestamp: number): boolean {
    this.clear(timestamp);

    if (this.requestTimestamps.size < this.limit) {
      this.requestTimestamps.add(timestamp);
      this.lastRequestTimestamp = timestamp;
      return true;
    }
    return false;
  }
}