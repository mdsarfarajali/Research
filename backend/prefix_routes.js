const fs = require('fs');

const path = './server.js';
let content = fs.readFileSync(path, 'utf8');

// Replace all app.get('/...', app.post('/...' etc with app.get('/api/...
content = content.replace(/app\.(get|post|put|delete)\('\/(?!\*|api)/g, (match, method) => {
  return `app.${method}('/api/`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Routes prefixed with /api');
