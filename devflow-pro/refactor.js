import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Prism Glass aesthetics
    // Replace heavy dark backgrounds with glassmorphism translucent colors
    if (content.match(/rgba\(22,\s*25,\s*34,\s*0\.\d+\)/)) {
      content = content.replace(/rgba\(22,\s*25,\s*34,\s*0\.\d+\)/g, 'rgba(255, 255, 255, 0.05)');
      changed = true;
    }
    if (content.match(/rgba\(15,\s*17,\s*23,\s*0\.\d+\)/)) {
      content = content.replace(/rgba\(15,\s*17,\s*23,\s*0\.\d+\)/g, 'rgba(255, 255, 255, 0.03)');
      changed = true;
    }
    if (content.match(/background:\s*'#121620'/)) {
      content = content.replace(/background:\s*'#121620'/g, "background: 'rgba(255, 255, 255, 0.04)'");
      changed = true;
    }
    if (content.match(/backdropFilter:\s*'blur\(\d+px\)'/)) {
      content = content.replace(/backdropFilter:\s*'blur\(\d+px\)'/g, "backdropFilter: 'blur(24px)'");
      changed = true;
    }

    // Border colors
    if (content.match(/rgba\(255,\s*255,\s*255,\s*0\.0[0-8]\)/)) {
      content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.0[0-8]\)/g, 'rgba(255, 255, 255, 0.15)');
      changed = true;
    }

    // Remove wasted space: reduce padding & margins
    if (content.match(/padding:\s*'32px/)) {
      content = content.replace(/padding:\s*'32px/g, "padding: '16px");
      changed = true;
    }
    if (content.match(/padding:\s*'24px/)) {
      content = content.replace(/padding:\s*'24px/g, "padding: '16px");
      changed = true;
    }
    if (content.match(/padding:\s*'28px\s*24px'/)) {
      content = content.replace(/padding:\s*'28px\s*24px'/g, "padding: '16px'");
      changed = true;
    }
    if (content.match(/gap:\s*'28px'/)) {
      content = content.replace(/gap:\s*'28px'/g, "gap: '16px'");
      changed = true;
    }
    if (content.match(/gap:\s*'24px'/)) {
      content = content.replace(/gap:\s*'24px'/g, "gap: '16px'");
      changed = true;
    }
    
    // Fix z-indexes - simple regex to find zIndex: >1000 and standardizing
    if (content.match(/zIndex:\s*\d+/)) {
      content = content.replace(/zIndex:\s*(\d+)/g, (match, p1) => {
        let z = parseInt(p1);
        if (z > 9000) return `zIndex: 1000`; // clamp weird z-indexes
        if (z === 100) return `zIndex: 100`; // navbar
        return match;
      });
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
