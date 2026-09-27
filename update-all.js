const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT') return;
      throw err;
    }
  });
  return filelist;
}

const files = walkSync(path.join(__dirname, 'devflow-pro', 'src'))
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/#0f1117/gi, '#f8fafc');
  content = content.replace(/#161922/gi, '#ffffff');
  content = content.replace(/#0a0b10/gi, '#f8fafc');
  content = content.replace(/#11131a/gi, '#ffffff');
  content = content.replace(/rgba\(15, 17, 23/gi, 'rgba(255, 255, 255');
  
  content = content.replace(/rgba\(255, 255, 255, (\d*\.?\d+)\)/g, (match, opacity) => {
      return "rgba(0, 0, 0, " + opacity + ")";
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
}
