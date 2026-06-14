// Usage: node scripts/generate-favicon-ico.mjs (run from repo root)
//
// Rasterizes public/favicon.svg into a multi-resolution Windows ICO file
// (16x16 + 32x32, PNG-compressed entries) and writes public/favicon.ico.
//
// Why a hand-rolled ICO packer instead of a dependency:
//   The ICO container is a 6-byte header + 16-byte-per-entry directory
//   pointing at PNG payloads. That's ~25 lines of Buffer math. Pulling in
//   `to-ico` (or similar) for that would add a dependency to the project's
//   minimal-tooling stack for a one-shot artifact tool. `sharp` is already
//   present transitively via Astro's image service.
//
// Re-run this script whenever public/favicon.svg changes.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const srcPath = path.join(repoRoot, "public", "favicon.svg");
const outPath = path.join(repoRoot, "public", "favicon.ico");

/**
 * Build a 16-byte ICONDIRENTRY for a PNG-compressed icon entry.
 *
 * Layout (all little-endian):
 *   0:    width  (1 byte; 0 = 256)
 *   1:    height (1 byte; 0 = 256)
 *   2:    color palette count (0 for PNG-compressed)
 *   3:    reserved (0)
 *   4-5:  color planes (uint16, set to 1)
 *   6-7:  bits per pixel (uint16, set to 32)
 *   8-11: image data size in bytes (uint32)
 *   12-15: offset of image data from start of file (uint32)
 */
function buildEntry({ size, dataSize, dataOffset }) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2); // no palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(dataSize, 8);
  entry.writeUInt32LE(dataOffset, 12);
  return entry;
}

/**
 * Pack PNG buffers into a multi-resolution ICO.
 * Entries are written in the supplied order; convention is small-to-large.
 */
function packIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + entrySize * images.length;

  // Header: reserved=0, type=1 (ICO), count=N (uint16 LE)
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type ICO
  header.writeUInt16LE(images.length, 4); // image count

  // Compute offsets and build entries
  const entries = [];
  let cursor = directorySize;
  for (const img of images) {
    entries.push(
      buildEntry({
        size: img.size,
        dataSize: img.png.length,
        dataOffset: cursor,
      }),
    );
    cursor += img.png.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((img) => img.png)]);
}

async function main() {
  const svgBuffer = fs.readFileSync(srcPath);

  // Density 384 gives sharp's SVG rasterizer enough headroom to produce
  // a crisp source image before downsampling to 16/32 px squares.
  const sizes = [16, 32];
  const images = [];
  for (const size of sizes) {
    const png = await sharp(svgBuffer, { density: 384 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    images.push({ size, png });
  }

  const icoBuffer = packIco(images);
  fs.writeFileSync(outPath, icoBuffer);
  console.log(
    `Wrote ${outPath} (${icoBuffer.length} bytes; ${sizes
      .map((s) => `${s}x${s}`)
      .join(" + ")})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
