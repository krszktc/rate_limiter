import { SlidingWindow } from "./sliding.window";
import { TokenBucket } from "./token.bucket";


const LIMITER_TYPE_PARAM = '--type';
const REQUESTS_LIMIT = 10;
const TIME_WINDOW = 60 // seconds

export interface RequestEvent {
  timestamp: string;
  clientId: string;
}

export enum LimiterType {
  SLIDING_WINDOW = 'SlidingWindow',
  TOKEN_BUCKET = 'TokenBucket',
}

export interface RateLimiter {
  canRequest(dateTime: string): boolean;
}

const limiterState = {
  limiterType: LimiterType.SLIDING_WINDOW,
  state: new Map<string, RateLimiter>(),
};

function setLimiterByType(clientId: string) {
  if (limiterState.limiterType === LimiterType.SLIDING_WINDOW) {
    limiterState.state.set(
      clientId,
      new SlidingWindow(REQUESTS_LIMIT, TIME_WINDOW)
    )
  } else {
    limiterState.state.set(
      clientId,
      new TokenBucket(REQUESTS_LIMIT, TIME_WINDOW)
    )
  }
}

export function canRequest(clientId: string, dateTime: string): boolean {
  const clientLimiter = limiterState.state.get(clientId);
  if (clientLimiter) {
    return clientLimiter.canRequest(dateTime);
  }
  setLimiterByType(clientId);
  return true;
}

export function setLimiterType(args: string[]) {
  const params = args.slice(2);
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

