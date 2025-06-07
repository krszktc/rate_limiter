import { SlidingWindow } from "./sliding.window";
import { strictEqual } from 'assert';


const slidingWindow = new SlidingWindow(3, 60) // 3 requests per 60 seconds

strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:00:00Z')), true);
strictEqual(slidingWindow.size, 1);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:00:10Z')), true);
strictEqual(slidingWindow.size, 2);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:00:20Z')), true);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:00:30Z')), false);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:00:40Z')), false);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:00:50Z')), false);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:01:00Z')), true);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:01:05Z')), false);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:01:10Z')), true);
strictEqual(slidingWindow.size, 3);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:02:00Z')), true);
strictEqual(slidingWindow.size, 2);
strictEqual(slidingWindow.canRequest(Date.parse('2025-06-06T10:04:00Z')), true);
strictEqual(slidingWindow.size, 1);

// if any test fail this will not print
console.log("All SlidingWindow tests completed ✅");