import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, '../package.json');
const versionJsonPath = path.resolve(__dirname, '../public/version.json');

// Read package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Increment version (Patch)
const versionParts = pkg.version.split('.').map(Number);
versionParts[2] += 1;
const newVersion = versionParts.join('.');

pkg.version = newVersion;

// Write back to package.json
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Write to version.json
const versionInfo = {
  version: newVersion,
  buildTime: new Date().toLocaleString(),
};

fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2) + '\n');

console.log(`Version updated: ${newVersion}`);
