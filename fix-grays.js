const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync(path.join(__dirname, 'devflow-pro', 'src'))
  .filter(f => f.endsWith('.tsx') || f.endsWith('.css'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/#9ca3af/gi, '#64748b');
  content = content.replace(/#d1d5db/gi, '#475569');
  content = content.replace(/#6b7280/gi, '#334155');
  content = content.replace(/#94a3b8/gi, '#64748b'); // replace text-dim with darker slate

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log("Updated grays in " + file);
  }
}
