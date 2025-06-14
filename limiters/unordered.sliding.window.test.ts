import { strictEqual } from 'assert';
import { UnorderedSlidingWindow } from "./unordered.sliding.window";

// parse unordered
const unorderedSlidingWindow = new UnorderedSlidingWindow(10, 60) // 10 requests per 60 seconds 

strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:01Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:02Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:03Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:04Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:05Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:06Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:07Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:08Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:09Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:11:02Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:10Z')), true);
strictEqual(unorderedSlidingWindow.canRequest(Date.parse('2025-06-07T10:10:11Z')), false);


// if any test fail this will not print
console.log("All UnorderedSlidingWindow tests completed ✅");