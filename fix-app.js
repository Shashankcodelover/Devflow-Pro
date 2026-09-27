const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'devflow-pro', 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');
content = content.replace("border: '3px solid undefined',", "border: '3px solid rgba(0, 0, 0, 0.1)',");
content = content.replace("color: '#9ca3af',", "color: '#64748b',");
fs.writeFileSync(file, content);
console.log('Fixed App.tsx');
