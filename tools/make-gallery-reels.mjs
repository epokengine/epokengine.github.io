// Optional authoring step. npm run build only copies these checked-in demo clips.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const { items } = JSON.parse(fs.readFileSync(path.join(root, 'gallery-content.json'), 'utf8'));
const sourcePath = url => path.join(root, url.startsWith('/media/') ? `content/${url.slice(7)}` : url.slice(1));
for (const item of items.filter(item => item.demo && item.frames)) {
  const dest = sourcePath(item.src);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const inputs = item.frames.flatMap(frame => ['-loop', '1', '-framerate', '24', '-t', '4', '-i', sourcePath(frame)]);
  const filters = item.frames.map((_, i) => `[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x101214,setsar=1,format=yuv420p,fade=t=in:st=0:d=0.3,fade=t=out:st=3.7:d=0.3[v${i}]`);
  filters.push(`${item.frames.map((_, i) => `[v${i}]`).join('')}concat=n=${item.frames.length}:v=1:a=0[out]`);
  const result = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', filters.join(';'), '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-movflags', '+faststart', '-metadata', 'comment=Demo montage of still screenshots; not recorded gameplay', dest], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Could not encode ${item.id}`);
  console.log(`Created ${item.src}`);
}
