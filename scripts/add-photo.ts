import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function main() {
  const [,, photoPath, caption, pinnedArg, photoDate] = process.argv;
  const pinned = pinnedArg === 'true';

  if (!photoPath || !caption) {
    console.error("error: missing photoPath or caption args");
    process.exit(1);
  }

  const publicPhotographyDir = path.join(process.cwd(), 'public', 'photography');
  if (!fs.existsSync(publicPhotographyDir)) {
    fs.mkdirSync(publicPhotographyDir, { recursive: true });
  }

  const parsedPath = path.parse(photoPath);
  const safeName = parsedPath.name.replace(/[^a-z0-9_-]/gi, '_');
  const timestamp = Date.now();
  const newFilename = `${safeName}_${timestamp}_optimized.webp`;
  const destPath = path.join(publicPhotographyDir, newFilename);

  console.log(`processing: ${photoPath}`);
  
  // keep the instance to reuse it
  const baseImage = sharp(photoPath);
  const metadata = await baseImage.metadata().catch(err => {
    console.error("failed to read metadata:", err.message);
    process.exit(1);
  });

  if (!metadata.width || !metadata.height) {
    console.error("invalid image dimensions");
    process.exit(1);
  }

  const orientation = metadata.height > metadata.width ? 'portrait' : 'landscape';
  const maxSize = 2560;

  let imgPipeline = baseImage;
  if (metadata.width > maxSize || metadata.height > maxSize) {
    imgPipeline = imgPipeline.resize({
      width: metadata.width > metadata.height ? maxSize : undefined,
      height: metadata.height > metadata.width ? maxSize : undefined,
      withoutEnlargement: true,
      fit: 'inside'
    });
  }
  
  // save main image
  await imgPipeline
    .webp({ quality: 80, effort: 6 })
    .toFile(destPath);
  console.log(`saved: public/photography/${newFilename}`);

  // reuse baseImage clone for blur to save an I/O read
  const blurBuffer = await baseImage
    .clone()
    .resize(20, 20, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();
  const blurBase64 = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  const lensPagePath = path.join(process.cwd(), 'src', 'pages', 'LensPage.tsx');
  if (!fs.existsSync(lensPagePath)) {
    console.error(`could not find lens page at ${lensPagePath}`);
    process.exit(1);
  }

  let lensContent = fs.readFileSync(lensPagePath, 'utf-8');
  
  // specific regex to only look inside the array definition block if possible
  const idMatch = lensContent.match(/id:\s*"(\d+)"/g);
  let maxId = 0;
  if (idMatch) {
    for (const match of idMatch) {
      const id = parseInt(match.replace(/[^\d]/g, ''), 10);
      if (id > maxId) maxId = id;
    }
  }
  const newId = (maxId + 1).toString();

  const newEntryObj = [
    `  {`,
    `    id: "${newId}",`,
    `    url: "/photography/${newFilename}",`,
    `    description: ${JSON.stringify(caption)},`,
    photoDate ? `    date: ${JSON.stringify(photoDate)},` : null,
    `    orientation: "${orientation}",`,
    `    blur: "${blurBase64}"${pinned ? ',' : ''}`,
    pinned ? `    pinned: true` : null,
    `  },`
  ].filter(Boolean).join('\n');

  const targetStr = `const LENS_PHOTOS = [`;
  if (!lensContent.includes(targetStr)) {
    console.error("target array 'const LENS_PHOTOS = [' not found in file");
    process.exit(1);
  }

  lensContent = lensContent.replace(targetStr, `${targetStr}\n${newEntryObj}`);
  fs.writeFileSync(lensPagePath, lensContent, 'utf-8');
  console.log(`successfully added photo id ${newId} to lenspage`);
}

main().catch(err => {
  console.error("fatal processing failure:", err);
  process.exit(1);
});
