#!/usr/bin/sh
ts-node ./limiters/token.bucket.test.ts 
ts-node ./limiters/sliding.window.test.ts 
ts-node ./limiters/rate.limiter.test.ts 
