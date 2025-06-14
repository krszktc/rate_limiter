import { RateLimiter } from "./rate.limiter";

export class UnorderedSlidingWindow implements RateLimiter {
  private requestTimestamps: number[] = [];
  private lastRequestTimestamp: number | undefined;

  constructor(
    private limit: number,
    private windowOfSeconds: number
  ) { }

  private clear(timestamp: number) {
    const windowEdge = timestamp - this.windowOfSeconds * 1000;
    let elementsToRemove = 0;

    for (let requestTimestamp of this.requestTimestamps) {
      if (requestTimestamp < windowEdge) {
        elementsToRemove += 1;
      } else {
        break
      }
    }

    this.requestTimestamps.splice(0, elementsToRemove);
  }

  private insertTimestamp(timestamp: number) {
    if (this.requestTimestamps.length === 0) {
      this.requestTimestamps.push(timestamp);
    } else {
      for (let i = this.requestTimestamps.length - 1; i >= 0; i--) {
        if (this.requestTimestamps[i] === timestamp) {
          break
        }
        if (this.requestTimestamps[i] < timestamp) {
          this.requestTimestamps.splice(i + 1, 0, timestamp);
          break
        }
      }
    }
  }

  get size(): number {
    return this.requestTimestamps.length;
  }

  get lastTimestamp(): number | undefined {
    return this.lastRequestTimestamp;
  }

  canRequest(timestamp: number): boolean {
    this.clear(timestamp);

    if (this.requestTimestamps.length < this.limit) {
      this.insertTimestamp(timestamp);
      this.lastRequestTimestamp = timestamp;
      return true;
    }
    return false;
  }
}