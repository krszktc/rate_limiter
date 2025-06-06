export class SlidingWindow {
  private readonly requestTimestamps = new Set<number>();

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

  canRequest(dateTime: string): boolean {
    const timestamp = new Date(dateTime).getTime();
    this.clear(timestamp);

    if (this.requestTimestamps.size < this.limit) {
      this.requestTimestamps.add(timestamp);
      return true;
    }
    return false;
  }
}