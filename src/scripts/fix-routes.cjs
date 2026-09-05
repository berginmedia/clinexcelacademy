const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.tsx') && !f.startsWith('__'));

for (const file of files) {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove "use client";
  content = content.replace(/"use client";\n?/g, '');
  content = content.replace(/'use client';\n?/g, '');

  // Replace next/link
  content = content.replace(/import\s+(?:\{\s*Link\s*\}|Link)\s+from\s+["']next\/link["'];/g, '');

  // Add tanstack router imports if not present
  if (!content.includes('@tanstack/react-router')) {
    content = `import { Link, createFileRoute } from "@tanstack/react-router";\n` + content;
  } else if (!content.includes('createFileRoute')) {
    content = content.replace(/from\s+["']@tanstack\/react-router["']/, ', createFileRoute } from "@tanstack/react-router"');
    // Fix if it ended up like `import { Link, createFileRoute } from`
    content = content.replace(/import\s+\{\s*([^}]*)\s*\}\s*,\s*createFileRoute\s*\}\s*from/, 'import { $1, createFileRoute } from');
  }

  // Find the default export function
  const match = content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/);
  if (match) {
    const componentName = match[1];
    
    // Convert to regular function
    content = content.replace(match[0], `function ${componentName}(`);
    
    // Determine route path
    let routePath = '/' + file.replace('.tsx', '').replace(/\./g, '/');
    if (routePath === '/index') routePath = '/';
    
    // Append the route definition
    content += `\n\nexport const Route = createFileRoute('${routePath}')({\n  component: ${componentName},\n});\n`;
    
    // Save file
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
}
