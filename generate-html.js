import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'dist', 'client', 'assets');
const clientDir = path.join(process.cwd(), 'dist', 'client');

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));
  const jsFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.js'));

  const cssLink = cssFile ? `<link rel="stylesheet" href="./assets/${cssFile}">` : '';
  const jsTags = jsFiles.map(f => `<script type="module" src="./assets/${f}"></script>`).join('\n    ');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>MediCare AI — Health Companion Pro</title>
    ${cssLink}
  </head>
  <body>
    <div id="root"></div>
    ${jsTags}
  </body>
</html>`;

  fs.mkdirSync(clientDir, { recursive: true });
  fs.writeFileSync(path.join(clientDir, 'index.html'), htmlContent);
  console.log('[HTML Generator] Successfully created dist/client/index.html with relative asset references.');
}
