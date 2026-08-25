import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import Ajv from 'ajv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true });
const schemaPath = path.join(__dirname, '../curated/schema/airline.schema.json');
const airlinesDir = path.join(__dirname, '../curated/airlines');
const buildDir = path.join(__dirname, '../../data/build/airlines');

const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validate = ajv.compile(schemaData);

fs.mkdirSync(buildDir, { recursive: true });

let totalIn = 0;
let totalOut = 0;
const confidenceCounts = { verified: 0, partial: 0, sketchy: 0 };

const files = fs.readdirSync(airlinesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

for (const file of files) {
  const filePath = path.join(airlinesDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = yaml.parse(fileContent);
  } catch (err) {
    console.error(`\n❌ Error parsing YAML in ${file}: ${err.message}`);
    process.exit(1);
  }

  const valid = validate(data);
  if (!valid) {
    console.error(`\n❌ Schema validation failed for ${file} (${filePath})`);
    validate.errors.forEach(err => {
      console.error(`  - ${err.instancePath} ${err.message}`);
    });
    process.exit(1);
  }

  const outPath = path.join(buildDir, `${data.operator_id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  totalIn += data.airframes.length;
  totalOut += data.airframes.length;
  
  data.airframes.forEach(af => {
    if (af.confidence) {
      confidenceCounts[af.confidence] = (confidenceCounts[af.confidence] || 0) + 1;
    }
  });
}

console.log(`\n✅ Data build complete`);
console.log(`Airframes in: ${totalIn}`);
console.log(`Airframes out: ${totalOut}`);
console.log(`Confidence counts:`);
Object.entries(confidenceCounts).forEach(([conf, count]) => {
  console.log(`  - ${conf}: ${count}`);
});
