import { SlidingWindow } from "./sliding.window";
import { TokenBucket } from "./token.bucket";


const LIMITER_TYPE_PARAM = '--type';
const REQUESTS_LIMIT = 10;
const TIME_WINDOW = 60 // 1 minute (60s)

const TRACK_ENTRIES_TO_CHECK = 1;
const TRACK_ENTRIES_TIME_LIMIT = 600 // 10 mutes (600s) 

export interface RequestEvent {
  timestamp: string;
  clientId: string;
}

export enum LimiterType {
  SLIDING_WINDOW = 'SlidingWindow',
  TOKEN_BUCKET = 'TokenBucket',
}

export interface RateLimiter {
  size: number;
  lastTimestamp: number | undefined;
  canRequest(timestamp: number): boolean;
}

export const limiterState = {
  limiterType: LimiterType.SLIDING_WINDOW,
  state: new Map<string, RateLimiter>(),
  tracker: new Set<string>(),
};

function setLimiterByType(clientId: string): RateLimiter {
  const limiter = limiterState.limiterType === LimiterType.SLIDING_WINDOW
    ? new SlidingWindow(REQUESTS_LIMIT, TIME_WINDOW)
    : new TokenBucket(REQUESTS_LIMIT, TIME_WINDOW)
  limiterState.state.set(clientId, limiter);

  return limiter;
}

function trackAndClean(clientId: string, timeLimit: number) {
  limiterState.tracker.delete(clientId);
  limiterState.tracker.add(clientId);

  const cleanTimeLimit = timeLimit - TRACK_ENTRIES_TIME_LIMIT * 1000;
  const trackerKeys = limiterState.tracker.keys();

  for (let i = 0; i < TRACK_ENTRIES_TO_CHECK; i++) {
    const oldestUserId: string = trackerKeys.next().value;
    const rateLimiter = limiterState.state.get(oldestUserId);
    if (rateLimiter?.lastTimestamp && rateLimiter.lastTimestamp < cleanTimeLimit) {
      limiterState.state.delete(oldestUserId);
      limiterState.tracker.delete(oldestUserId)
    } else {
      break // oldest entry not matching so doesn't make sense to check newest
    }
  }
}

export function canRequest(clientId: string, dateTime: number, track?: boolean): boolean {
  if (!limiterState.state.has(clientId)) {
    setLimiterByType(clientId)
  }
  const clientLimiter = limiterState.state.get(clientId);
  const canRequest = clientLimiter?.canRequest(dateTime);
  if (track) {
    trackAndClean(clientId, dateTime);
  }
  return !!canRequest;
}

export function setLimiterType(params: string[]) {
  const typeIndex = params.findIndex(arg => arg === LIMITER_TYPE_PARAM);

  if (typeIndex >= 0 && params.length > typeIndex + 1) {
    const typeValue = params[typeIndex + 1];
    if (typeValue !== LimiterType.SLIDING_WINDOW && typeValue !== LimiterType.TOKEN_BUCKET) {
      throw new Error(`Only ${LimiterType.SLIDING_WINDOW} or ${LimiterType.TOKEN_BUCKET} values accepted`);
    }
    limiterState.limiterType = typeValue;
  }
  console.log(`Rate Limiter selected: ${limiterState.limiterType}`);
}

