# Rate Limiter
CMD rate limiter tool working base of Sliding Window and Token Bucket algorithm as well as circular shifting for history tracking and cleaning

## 1. Introduction
In the given example it's hard to select best algorithm to limit incoming request in require window of time. It's because production-ready variants like
Token Bucket are not intended to work with required granularity. From the other had Sliding Window guarantee high precision for window shifting but memory footprint 
could be very big. So we have non-production approach which work in tests or production-ready which not satisfied the tests. Decision? Let's use both.

Why those and not other algorithms? 

In Sliding Windows each timestamp is memorized. Thanks to this even in case of small number of requests, the window could be moved with milliseconds precision.
Disadvantage is the way how the state is stored in memory. In case when diversity of source (many different clients) or capacity (many request and wide window) is high
the memory consumption could be problematic.

Token Bucket algorithm solving this problem by storing in memory only counters representing available amount of tokens (requests). Thanks to that the memory footprint 
is very small and almost doesn't change depend of window size. In case of production usage when usually we are talking abut hundreds or thousands request/s, granularity
is enough to move window forward with satisfactory precision. In our scenario the window is rather "jumping" so refillment frequency can make that in specific situation
user can have 19 available requests (fulfill each 6s).

It wasn't required but the implementation also include simple and effective memory tracking and cleaning approach. It's especially interesting case in JS/TS because 
the language by default doesn't offer dequeue so "pull and push" is done by Set() collection and single element iterator. In general the collection store unique client ids in order or requests. After each request the latest element (or more when configured) is taken and check if activity over it is older than X. If yes, 
then it's removed. The complexity for Set add/delete are both O(1) so progressive cleaning made this way it almost "invisible" from general performance perspective.  

## 2. Installation
 * be sure you have `ts-node` installed
 * being in root folder call `npm install` or `yarn install` or `pnpm install` or relevant command   

 The implementation don't use any external dependencies or libraries. It require ony `@types/node` to be installed.

## 3. Tests
To run all automation tests, call in root folder:

```sh
./run_all_tests.sh
```

If you need to run specific test, being in `limiters` folder call example:

```sh
ts-node rate.limiter.test.ts
```

To simulate incoming requests and processing you can run `./run_file_writer.sh` in one cmd and `./run_rate_limiter.sh` in another.
After call you will see new lines generated in `testfile.txt` and rate limiter which read these lines and print expected outputs to `stdout` and `stderr`.

To increase generation speed or number of client ids adjust configurable variables in `file.writer.ts`.

## 4. Usage
* **file writer**: The script to generate stream of model request to `testfile.txt`. Can be run by `./run_file_writer`.

* **main service**: The entry point of the service is saved in `main.ts` file. To run it in "listener mode" call `./run_rate_limiter.sh`.

Sliding Window is the algorithm run by default. To run sliding rate limiter with Token Bucket call
```sh
tail -f testfile.txt | ts-node main.ts --type TokenBucket
```

To run it in single-run, on fixed input, call:
```sh
cat testfile.txt | ts-node main.ts
```

To forward and store `stdout` and `stderr` to separated files call:
```sh
cat testfile.txt | ts-node main.ts > ok.txt 2> err.txt
``` 

* **testfile**: 
The fille called `testfile.txt` is default source of requests read and parse. If you want to test your own data, paste content to the fille. In case of use 
other file remember to adjust names in `file.reader.ts` and `run_rate_limiter.sh` script.

* **memory cleaner**: 
Memory cleaner is disabled by default. To enable it run function `canRequest()` in `rate.limiter.ts` with last parameter `true`.
Tests case in `rate.limiter.test.ts` cover with memory cleaner enabled. 
