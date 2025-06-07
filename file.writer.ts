import fs from 'fs';


const FILE_NAME = 'testfile.txt';
const USER_IDS = ['000', '001', '002', '003', '004', '005', '006', '007', '008', '009']

const stream = fs.createWriteStream(FILE_NAME, { flags: 'w', encoding: 'utf8' });

setInterval(() => {
  const timestamp = new Date().toISOString();
  const clientId = USER_IDS[Math.floor(Math.random() * USER_IDS.length)];
  const content = JSON.stringify({ timestamp, clientId })
  stream.write(`${content}\n`);
}, 100);



