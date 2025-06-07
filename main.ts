#!/usr/bin/env ts-node
import * as readline from 'readline';
import { canRequest, RequestEvent, setLimiterType } from './rate.limiter';


function processJsonLine(line: string) {
  const event: RequestEvent = JSON.parse(line);

  if (!event.timestamp || !event.clientId) {
    console.error(`Missing fields in input: ${line}`);
    return;
  }

  const timestampMs = Date.parse(event.timestamp);
  if (isNaN(timestampMs)) {
    console.error(`Invalid timestamp format: ${event.timestamp}`);
    return;
  }

  const decision = canRequest(event.clientId, event.timestamp) ? 'ALLOW' : 'DENY';
  const output = JSON.stringify({ ...event, decision });
  console.log(output)
}

function main() {
  try {
    setLimiterType(process.argv);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', processJsonLine);

  } catch (err: any) {
    console.error(err.message);
  }
}

main();