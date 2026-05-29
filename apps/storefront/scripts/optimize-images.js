#!/usr/bin/env node
/**
 * KINFORM — Image optimizer for product photography
 * 
 * Run: node scripts/optimize-images.js
 * 
 * Compresses PNG/JPG in public/images while preserving visual quality.
 * Use before git add when adding new earring or flat photos.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public", "images");

async function optimizeDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeDir(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const origSize = fs.statSync(full).size;
    if (origSize < 150 * 1024) continue; // skip small files

    const tmp = full + ".opt.tmp";
    try {
      if (ext === ".png") {
        await sharp(full)
          .png({ quality: 82, compressionLevel: 9, adaptiveFiltering: true, palette: true })
          .toFile(tmp);
      } else {
        await sharp(full)
          .jpeg({ quality: 86, mozjpeg: true })
          .toFile(tmp);
      }
      const newSize = fs.statSync(tmp).size;
      if (newSize < origSize) {
        fs.renameSync(tmp, full);
        const pct = ((origSize - newSize) / origSize * 100).toFixed(1);
        console.log(`${path.relative(ROOT, full)}: ${(origSize/1024/1024).toFixed(2)}MB → ${(newSize/1024/1024).toFixed(2)}MB (-${pct}%)`);
      } else {
        fs.unlinkSync(tmp);
      }
    } catch (e) {
      console.warn("Skipped", entry.name, e.message);
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }
  }
}

console.log("Optimizing KINFORM product images...\n");
optimizeDir(ROOT).then(() => console.log("\nDone. Commit the smaller files."));
