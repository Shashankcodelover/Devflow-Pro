const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'devflow-pro', 'src', 'index.css');
let content = fs.readFileSync(file, 'utf8');
content = content.replace("background: rgba(0, 0, 0, 0.8);", "background: #ffffff;");
fs.writeFileSync(file, content);
console.log('Fixed index.css input field background');
