type TimestampPairs = {
  amountOfRequests: number;
  startTime: number;
  endTime: number
}

import { RateLimiter } from "./rate.limiter";

export class DiscreteWindow implements RateLimiter {
  private requestTimestamps: TimestampPairs[] = [];
  private lastRequestTimestamp: number | undefined;

  constructor(
    private numberOfRequests: number,
    private windowOfSeconds: number,
    private numberOfWindows: number,
  ) { }

  private isForwardRequest(timestamp: number): boolean {
    const lastTimestampsPair = this.requestTimestamps.at(-1);
    const lastTimestamp = lastTimestampsPair?.endTime ?? 0;

    if (timestamp > lastTimestamp) {
      if (this.requestTimestamps.length >= this.numberOfWindows) {
        this.requestTimestamps.shift();
      }
      this.requestTimestamps.push({
        amountOfRequests: 1,
        startTime: timestamp,
        endTime: timestamp + this.windowOfSeconds * 1000 - 1,
      });
      return true;
    }

    if (lastTimestampsPair
      && lastTimestampsPair.startTime <= timestamp
      && lastTimestampsPair.amountOfRequests <= this.numberOfRequests) {
      lastTimestampsPair.amountOfRequests += 1;
      return true;
    }

    return false;
  }

  private isBackwardRequest(timestamp: number): boolean {
    const pastWindow = this.requestTimestamps
      .find(rts => timestamp >= rts.startTime && timestamp <= rts.endTime);

    if (pastWindow && pastWindow.amountOfRequests < this.numberOfRequests) {
      pastWindow.amountOfRequests += 1;
      return true;
    }
    return false;
  }

  get size(): number {
    return this.requestTimestamps.at(-1)?.amountOfRequests ?? 0;
  }

  get lastTimestamp(): number | undefined {
    return this.lastRequestTimestamp;
  }

  canRequest(timestamp: number): boolean {
    if (this.isForwardRequest(timestamp) || this.isBackwardRequest(timestamp)) {
      this.lastRequestTimestamp = timestamp;
      return true;
    }
    return false;
  }
}