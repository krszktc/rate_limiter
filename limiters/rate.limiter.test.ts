import { strictEqual } from "assert";
import { canRequest, limiterState } from "./rate.limiter";

const request1 = canRequest('001', Date.parse('2025-06-06T10:00:00Z'), true);
strictEqual(request1, true);
const request2 = canRequest('001', Date.parse('2025-06-06T10:00:05Z'), true);
strictEqual(request2, true);
const request3 = canRequest('001', Date.parse('2025-06-06T10:00:10Z'), true);
strictEqual(request3, true);
const request4 = canRequest('001', Date.parse('2025-06-06T10:00:15Z'), true);
strictEqual(request4, true);
const request5 = canRequest('001', Date.parse('2025-06-06T10:00:20Z'), true);
strictEqual(request5, true);
const request6 = canRequest('001', Date.parse('2025-06-06T10:00:25Z'), true);
strictEqual(request6, true);
const request7 = canRequest('001', Date.parse('2025-06-06T10:00:30Z'), true);
strictEqual(request7, true);
const request8 = canRequest('002', Date.parse('2025-06-06T10:00:30Z'), true);
strictEqual(request8, true);
const request9 = canRequest('003', Date.parse('2025-06-06T10:00:30Z'), true);
strictEqual(request9, true);


strictEqual([...limiterState.tracker].toString(), '001,002,003')

const request10 = canRequest('001', Date.parse('2025-06-06T10:00:35Z'), true);
strictEqual(request10, true);
const request11 = canRequest('001', Date.parse('2025-06-06T10:00:40Z'), true);
strictEqual(request11, true);
const request12 = canRequest('001', Date.parse('2025-06-06T10:00:45Z'), true);
strictEqual(request12, true);
const request13 = canRequest('001', Date.parse('2025-06-06T10:00:50Z'), true);
strictEqual(request13, false);
const request14 = canRequest('001', Date.parse('2025-06-06T10:00:55Z'), true);
strictEqual(request14, false);
const request15 = canRequest('001', Date.parse('2025-06-06T10:01:00Z'), true);
strictEqual(request15, true);
const request16 = canRequest('001', Date.parse('2025-06-06T10:01:10Z'), true);
strictEqual(request16, true);
const request17 = canRequest('001', Date.parse('2025-06-06T10:01:20Z'), true);
strictEqual(request17, true);
const request18 = canRequest('002', Date.parse('2025-06-06T10:01:20Z'), true);
strictEqual(request18, true);


strictEqual([...limiterState.tracker].toString(), '003,001,002')
strictEqual(limiterState.state.get('001')?.size, 8)
strictEqual(limiterState.state.get('002')?.size, 2)
strictEqual(limiterState.state.get('003')?.size, 1)

const request19 = canRequest('003', Date.parse('2025-06-06T10:12:00Z'), true);
strictEqual(request19, true);

strictEqual(limiterState.state.size, 2);
strictEqual(limiterState.state.has('001'), false);
strictEqual([...limiterState.tracker].toString(), '002,003');

const request20 = canRequest('002', Date.parse('2025-06-06T10:25:00Z'), true);
strictEqual(request20, true);

strictEqual(limiterState.state.size, 1);
strictEqual(limiterState.state.has('003'), false);
strictEqual([...limiterState.tracker].toString(), '002');

// if any test fail this will not print
console.log("All RateLimiter tests completed ✅");