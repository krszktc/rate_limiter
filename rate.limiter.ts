#!/usr/bin/env ts-node
import * as readline from 'readline';

interface RequestEvent {
  timestamp: string;
  clientId: string;
}

export interface RateLimiter {
  canRequest(dateTime: string): boolean;
}

function processJsonLine(line: string) {
  try {
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

    const clientId = event.clientId;


  } catch (err: any) {
    console.error(`Error parsing input: ${line}`);
    console.error(err.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', processJsonLine);

