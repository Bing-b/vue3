import fs from 'fs';
import path from 'path';

// 文件统计脚本

const targetDir = path.resolve(process.cwd(), 'src');
const outputPath = path.resolve(process.cwd(), 'public/lang-stats.json');

const extToLang = {
  '.html': 'Html',
  '.vue': 'Vue',
  '.ts': 'TypeScript',
  '.js': 'JavaScript',
  '.tsx': 'TypeScript',
  '.jsx': 'JavaScript',
  '.scss': 'SCSS',
  '.css': 'SCSS',
};

const sizeMap = {};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const lang = extToLang[ext];
      if (!lang) continue;

      const stats = fs.statSync(fullPath);
      sizeMap[lang] = (sizeMap[lang] || 0) + stats.size;
    }
  }
}

export function generateLangStats() {
  walk(targetDir);

  const totalSize = Object.values(sizeMap).reduce((a, b) => a + b, 0);
  const result = Object.entries(sizeMap)
    .map(([lang, bytes]) => ({
      lang,
      bytes,
      percent: ((bytes / totalSize) * 100).toFixed(2),
    }))
    .sort((a, b) => b.bytes - a.bytes);

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log('📊 语言统计写入 public/lang-stats.json');
}
