const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'devflow-pro', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const replacements = {
  '--bg-primary: #0a0b10;': '--bg-primary: #f8fafc;',
  '--bg-secondary: #11131a;': '--bg-secondary: #ffffff;',
  'rgba(255, 255, 255, 0.03)': 'rgba(0, 0, 0, 0.03)',
  'rgba(255, 255, 255, 0.06)': 'rgba(0, 0, 0, 0.06)',
  'rgba(255, 255, 255, 0.12)': 'rgba(0, 0, 0, 0.12)',
  '--text-main: #ffffff;': '--text-main: #0f172a;',
  '--text-muted: #e2e8f0;': '--text-muted: #334155;',
  '--text-dim: #94a3b8;': '--text-dim: #64748b;',
  'rgba(255, 255, 255, 0.25)': 'rgba(0, 0, 0, 0.25)',
  'rgba(255, 255, 255, 0.2)': 'rgba(0, 0, 0, 0.2)',
  'rgba(255, 255, 255, 0.08)': 'rgba(0, 0, 0, 0.08)',
  'rgba(15, 17, 23, 0.6)': 'rgba(255, 255, 255, 0.8)',
  'background: #161922;': 'background: #ffffff;',
  'rgba(255, 255, 255, 0.15)': 'rgba(0, 0, 0, 0.15)',
  'rgba(255, 255, 255, 0.3)': 'rgba(0, 0, 0, 0.3)',
  'color: #ffffff;': 'color: #ffffff;', // keep primary button text white
};

for (const [key, value] of Object.entries(replacements)) {
  css = css.split(key).join(value);
}

fs.writeFileSync(cssPath, css);
console.log('Updated index.css');
