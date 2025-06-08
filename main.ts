#!/usr/bin/env ts-node
import { createInterface } from 'readline';
import { canRequest, RequestEvent, setLimiterType } from './limiters/rate.limiter';


function processJsonLine(line: string) {
  try {
    const event: RequestEvent = JSON.parse(line);

    if (!event.timestamp || !event.clientId) {
      console.error(`Missing fields in input: ${line}`);
      return;
    }

    const timestamp = Date.parse(event.timestamp);
    if (isNaN(timestamp)) {
      console.error(`Invalid timestamp format: ${event.timestamp}`);
      return;
    }

    // calling 'track=true' old client entries can be tracked and removed
    const decision = canRequest(event.clientId, timestamp) ? 'ALLOW' : 'DENY';
    const output = JSON.stringify({ ...event, decision });
    console.log(output)
  } catch (err: any) {
    console.error(err.message);
  }
}

function main() {
  setLimiterType(process.argv.slice(2));

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on('line', processJsonLine);
}

main();