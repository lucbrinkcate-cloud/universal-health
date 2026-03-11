const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf8');
  // Add type="module" to the main bundle script if not present
  if (!html.includes('type="module"')) {
    html = html.replace('<script src="', '<script type="module" src="');
    fs.writeFileSync(indexPath, html);
    console.log('✅ Added type="module" to script tag in dist/index.html');
  } else {
    console.log('✅ Script tag already has type="module"');
  }
} catch (err) {
  console.error('❌ Error updating index.html:', err.message);
  process.exit(1);
}
