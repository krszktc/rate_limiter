import { strictEqual } from 'assert';
import { DiscreteWindow } from "./discrete.window";


// 3 requests per 60 seconds, 10 windows
const timestampPairs = new DiscreteWindow(3, 60, 10);

strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:01:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:02:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:03:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:04:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:05:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:06:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:07:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:08:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:09:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T11:02:00Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:09:59Z')), true);
strictEqual(timestampPairs.canRequest(Date.parse('2025-06-06T10:11:00Z')), false);


// if any test fail this will not print
console.log("All TimestampPairs tests completed ✅");