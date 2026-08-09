const { execSync } = require('child_process');
const path = require('path');

const [moduleName, migrationName] = process.argv.slice(2);

if (!moduleName || !migrationName) {
  console.error('Usage: pnpm migration:create <module> <migrationName>');
  process.exit(1);
}

const migrationDir = `src/modules/${moduleName}/infrastructure/persistence/migrations/${migrationName}`;
const command = `pnpm exec typeorm migration:create ${path.join(migrationDir)}`;

try {
  console.log('Creating migration...');
  execSync(command, { stdio: 'inherit' });
  console.log('Migration created.');
} catch (error) {
  console.error('Migration error:', error.message);
  process.exit(1);
}
