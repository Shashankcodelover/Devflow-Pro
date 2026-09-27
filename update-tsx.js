const fs = require('fs');
const path = require('path');
const filesToUpdate = [
  path.join(__dirname, 'devflow-pro', 'src', 'pages', 'SprintCopilot.tsx'),
  path.join(__dirname, 'devflow-pro', 'src', 'pages', 'TopologyMeshPage.tsx')
];

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/#161922/g, '#ffffff');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.15\)/g, 'rgba(0, 0, 0, 0.15)');
  fs.writeFileSync(file, content);
}
console.log('Updated tsx files');
