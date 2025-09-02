// scripts/setup-directories.js
const fs = require('fs');
const path = require('path');

const directories = [
  'public/schoolImages',
  'src/components',
  'src/app/api/schools',
  'src/app/api/upload',
  'lib'
];

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`✅ Directory already exists: ${dir}`);
  }
});

console.log('🎉 Directory setup complete!');