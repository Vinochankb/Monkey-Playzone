const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'public');

// Exclude directories
const excludeDirs = ['node_modules', '.git', '.wrangler', '.claude', 'scratch', 'public', '.github'];

// Exclude files
const excludeFiles = [
  'worker.js',
  'wrangler.toml',
  'package.json',
  'package-lock.json',
  '.gitignore',
  '.htaccess',
  'serve.py',
  '_redirects',
  '_headers',
  'sync.js'
];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (excludeDirs.includes(path.basename(src))) return;
    
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    if (excludeFiles.includes(path.basename(src))) return;
    fs.copyFileSync(src, dest);
  }
}



console.log('Syncing files to public directory...');
copyRecursiveSync(srcDir, destDir);
fs.copyFileSync(path.join(srcDir, 'worker.js'), path.join(destDir, '_worker.js'));
console.log('Sync complete!');
