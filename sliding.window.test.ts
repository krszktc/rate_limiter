import { SlidingWindow } from "./sliding.window";
import { assertEq } from "./utils";


const slidingWindow = new SlidingWindow(3, 60) // 3 requests per 60 seconds

assertEq(slidingWindow.canRequest('2025-06-06T10:00:00Z'), true);
assertEq(slidingWindow.size, 1);
assertEq(slidingWindow.canRequest('2025-06-06T10:00:10Z'), true);
assertEq(slidingWindow.size, 2);
assertEq(slidingWindow.canRequest('2025-06-06T10:00:20Z'), true);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:00:30Z'), false);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:00:40Z'), false);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:00:50Z'), false);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:01:00Z'), true);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:01:05Z'), false);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:01:10Z'), true);
assertEq(slidingWindow.size, 3);
assertEq(slidingWindow.canRequest('2025-06-06T10:02:00Z'), true);
assertEq(slidingWindow.size, 2);
assertEq(slidingWindow.canRequest('2025-06-06T10:04:00Z'), true);
assertEq(slidingWindow.size, 1);