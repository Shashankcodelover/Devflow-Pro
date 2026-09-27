const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'devflow-pro', 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');
content = content.replace("const BulkIngestionStudio = lazy(() => import('./pages/BulkIngestionStudio'))", "const BulkIngestionStudio = lazy(() => import('./pages/BulkIngestionStudio'))\nconst NotFound = lazy(() => import('./pages/NotFound'))");
fs.writeFileSync(file, content);

const file2 = path.join(__dirname, 'devflow-pro', 'src', 'pages', 'NotFound.tsx');
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace("import React from 'react'", "");
fs.writeFileSync(file2, content2);
