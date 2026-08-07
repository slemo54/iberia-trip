// One-shot script: genera icone PNG 192/512 dal favicon SVG
import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('./public/favicon.svg');
const buf = Buffer.from(svg);

await sharp(buf).resize(192, 192).png().toFile('./public/icon-192.png');
await sharp(buf).resize(512, 512).png().toFile('./public/icon-512.png');
await sharp(buf).resize(180, 180).png().toFile('./public/apple-touch-icon.png');
console.log('Icons generated');
