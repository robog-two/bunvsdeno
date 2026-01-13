import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ICON_PATH = 'icon.png';
const PUBLIC_DIR = 'public';

if (!fs.existsSync(ICON_PATH)) {
  console.error(`Error: ${ICON_PATH} not found.`);
  process.exit(1);
}

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR);
}

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('Generating icons...');
  
  for (const { name, size } of sizes) {
    await sharp(ICON_PATH)
      .resize(size, size)
      .toFile(path.join(PUBLIC_DIR, name));
    console.log(`Created ${name}`);
  }
  
  // Create a favicon.ico (using 32x32 png content, many browsers accept this)
  // For better compatibility, we just copy the 32x32 one or let sharp handle it if format supported
  // Sharp usually infers format from extension. ICO support in libvips (sharp's engine) is limited.
  // We'll just rely on the <link> tags in HTML mainly, but let's make a copy for legacy.
  // Actually, let's just use the pngs.
  
  console.log('Icons generated successfully.');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
