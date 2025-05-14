const { execSync } = require('child_process');
const path = require('path');

const [moduleName] = process.argv.slice(2);

if (!moduleName) {
  console.error('❌ Migration invalid');
  process.exit(1);
}

const migrationDir = `src/modules/${moduleName}/infra/database/typeorm/migrations`;

const command = `yarn typeorm migration:create ${path.join(migrationDir)}`;

try {
  console.log(`📦  Migration creating...`);
  execSync(command, { stdio: 'inherit' });
  console.log('✅  Migration created.');
} catch (error) {
  console.error('❌  Error  migration:', error.message);
  process.exit(1);
}
