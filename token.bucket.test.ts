import { TokenBucket } from "./token.bucket";
import { assertEq } from "./utils";


const initTime = new Date('2025-06-06T10:00:00Z').getTime();
const tokenBucket = new TokenBucket(3, 60, initTime); // 1 token / 20s


assertEq(tokenBucket.canRequest('2025-06-06T10:00:00Z'), true); // 3 tokens
assertEq(tokenBucket.canRequest('2025-06-06T10:00:05Z'), true); // 2 tokens
assertEq(tokenBucket.canRequest('2025-06-06T10:00:10Z'), true); // 1 token
assertEq(tokenBucket.canRequest('2025-06-06T10:00:15Z'), false); // 0 token 
assertEq(tokenBucket.canRequest('2025-06-06T10:00:20Z'), true); // 1 token
assertEq(tokenBucket.canRequest('2025-06-06T10:00:25Z'), false); // 0 token 
assertEq(tokenBucket.canRequest('2025-06-06T10:00:30Z'), false); // 0 token 
assertEq(tokenBucket.canRequest('2025-06-06T10:00:35Z'), false); // 0 token 
// 2025-06-06T10:00:40Z -> 1 token
// 2025-06-06T10:01:00Z -> 2 token
assertEq(tokenBucket.canRequest('2025-06-06T10:01:05Z'), true); // 2 token 
assertEq(tokenBucket.canRequest('2025-06-06T10:01:10Z'), true); // 1 token 
assertEq(tokenBucket.canRequest('2025-06-06T10:01:15Z'), false); // 0 token 
// 2025-06-06T10:01:20Z -> 1 token
// 2025-06-06T10:01:40Z -> 2 token
// 2025-06-06T10:02:00Z -> 3 token
// 2025-06-06T10:03:00Z -> still 3 tokens
assertEq(tokenBucket.canRequest('2025-06-06T10:04:30Z'), true); // 3 tokens 
assertEq(tokenBucket.canRequest('2025-06-06T10:04:35Z'), true); // 2 tokens 
assertEq(tokenBucket.canRequest('2025-06-06T10:04:40Z'), true); // 2 tokens
assertEq(tokenBucket.canRequest('2025-06-06T10:04:45Z'), true); // 1 tokens 
assertEq(tokenBucket.canRequest('2025-06-06T10:04:50Z'), false); // 0 tokens 







