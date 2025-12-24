import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '..', 'dist');
const indexPath = join(distPath, 'index.html');
const notFoundPath = join(distPath, '404.html');

try {
  // Read the index.html content
  let content = readFileSync(indexPath, 'utf8');
  
  // Add a redirect script at the beginning of the body to preserve the path
  const redirectScript = `
    <script>
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      (function() {
        var pathSegmentsToKeep = 1; // Keep /uit
        var l = window.location;
        l.replace(
          l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
          l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
          l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
        );
      })();
    </script>
  `;
  
  // Insert the redirect script right after the opening body tag
  content = content.replace('<body>', '<body>' + redirectScript);
  
  // Write the modified content to 404.html
  writeFileSync(notFoundPath, content, 'utf8');
  console.log('✓ Created 404.html for GitHub Pages routing');
} catch (error) {
  console.error('Error creating 404.html:', error);
  process.exit(1);
}

