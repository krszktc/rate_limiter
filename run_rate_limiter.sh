#!/usr/bin/env bash

# add --type SlidingWindow / TokenBucket to change limiter algorithm
tail -f testfile.txt | ts-node main.ts