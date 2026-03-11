const path = require('path');
const { existsSync } = require('fs')
const datasource = require('../dist/infra/config/database.config').default

async function run() {
  const [module, fileName] = process.argv.slice(2);

  if(!module || !fileName) {
    console.error('❌ Usage: yarn seed <module> <seederFile>');
    console.error('👉 Example: yarn seed user create.seeder.ts');
    process.exit(1);
  }

  const seederPath = path.join(__dirname, `../dist/modules/${module}/infrastructure/persistence/seeders/${fileName}`);

  if(!existsSync(seederPath)){
    console.error(`❌ Seeder file not found: ${seederPath}`);
    process.exit(1);
  }

  const seederModule = await import(seederPath);

  if(typeof  seederModule.run !== 'function') {
    console.error(`❌ Seeder file must export a 'run(dataSource)' function.`);
    process.exit(1);
  }

  await datasource.initialize();
  await seederModule.run(datasource)
  await datasource.destroy();

  console.log(`✅ Seeder "${fileName}" from module "${module}" executed.`);
}


run().catch(error => {
  console.error('❌ Seeder execution failed:', error);
  process.exit(1);
})
