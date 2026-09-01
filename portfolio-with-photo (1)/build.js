#!/usr/bin/env node
/* =============================================================
   PRODUCTION BUILD
   -------------------------------------------------------------
   This site is plain HTML/CSS/JS with no framework and no
   bundler, so "building" it means assembling a clean folder that
   contains only what a web server needs to serve.

   Run:   npm run build
   Out:   dist/   <- this is the folder you upload to your host

   Zero dependencies: Node's own fs module does all the work.
   ============================================================= */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'portfolio');
const OUT = path.join(ROOT, 'dist');

/* Only these are shipped. Anything else in /portfolio (backups,
   notes, scratch files) is deliberately left behind. */
const INCLUDE = ['index.html', 'css', 'js', 'assets'];

function copy(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copy(path.join(src, entry), path.join(dest, entry));
    }
    return 0;
  }

  fs.copyFileSync(src, dest);
  return stat.size;
}

function run() {
  if (!fs.existsSync(SRC)) {
    console.error('Build failed: source folder not found at ' + SRC);
    process.exit(1);
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  let files = 0;
  let bytes = 0;

  for (const item of INCLUDE) {
    const from = path.join(SRC, item);
    if (!fs.existsSync(from)) {
      console.error('Build failed: missing required item "' + item + '"');
      process.exit(1);
    }
    copy(from, path.join(OUT, item));
  }

  /* Report what actually landed in dist/ */
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else { files++; bytes += st.size; }
    }
  })(OUT);

  console.log('Build complete.');
  console.log('  Output folder : ' + OUT);
  console.log('  Files         : ' + files);
  console.log('  Total size    : ' + (bytes / 1024).toFixed(1) + ' KB');
  console.log('');
  console.log('Upload the contents of dist/ to your host.');
}

run();
