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
  .filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/color:\s*"#fff"/gi, 'color: "#0f172a"');
  content = content.replace(/color:\s*"#ffffff"/gi, 'color: "#0f172a"');
  content = content.replace(/color:\s*"white"/gi, 'color: "#0f172a"');
  content = content.replace(/color="#fff"/gi, 'color="#0f172a"');
  content = content.replace(/color="#ffffff"/gi, 'color="#0f172a"');
  content = content.replace(/color="white"/gi, 'color="#0f172a"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log("Updated double quotes in " + file);
  }
}
