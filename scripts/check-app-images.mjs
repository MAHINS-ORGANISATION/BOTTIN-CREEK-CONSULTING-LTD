#!/usr/bin/env node
/**
 * Fails if bundled JPEGs are missing (Metro will error at runtime).
 * Run: node scripts/check-app-images.mjs
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const dir = join(root, 'assets', 'images', 'app');
const required = [
  'drawer-hero.jpg',
  'home-hero.jpg',
  'onboarding-1.jpg',
  'onboarding-2.jpg',
  'onboarding-3.jpg',
  'service-governance.jpg',
  'service-compliance.jpg',
  'service-contracts.jpg',
  'service-risk.jpg',
  'service-retainer.jpg',
  'service-workshop.jpg',
  'blog-leadership.jpg',
  'blog-documentation.jpg',
  'blog-disputes.jpg',
  'about-team.jpg',
];

let ok = true;
for (const name of required) {
  const p = join(dir, name);
  if (!existsSync(p)) {
    console.error(`Missing asset: assets/images/app/${name}`);
    ok = false;
  }
}

if (!ok) {
  console.error('\nDownload or restore these JPEGs so require() in constants/appImages.ts resolves.');
  process.exit(1);
}
console.log('All app JPEG assets present.');
