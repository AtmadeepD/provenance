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
const confidenceCounts = {
  identity: { verified: 0, partial: 0, sketchy: 0 },
  status: { verified: 0, partial: 0, sketchy: 0 }
};

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

  for (const af of data.airframes) {
    if (af.status?.state !== 'unknown' && (!af.confidence || !af.confidence.status)) {
      const reg = af.identities?.[0]?.reg || af.airframe_id;
      console.error(`\n❌ Validation failed: [${reg}] has known status but missing confidence.status`);
      process.exit(1);
    }
  }

  const valid = validate(data);
  if (!valid) {
    console.error(`\n❌ Schema validation failed for ${file} (${filePath})`);
    validate.errors.forEach(err => {
      let reg = "unknown";
      const match = err.instancePath.match(/^\/airframes\/(\d+)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        const af = data.airframes[idx];
        if (af && af.identities && af.identities.length > 0) {
          reg = af.identities[0].reg;
        } else if (af) {
          reg = af.airframe_id;
        }
      }
      console.error(`  - [${reg}] ${err.instancePath} ${err.message}`);
    });
    process.exit(1);
  }

  const outPath = path.join(buildDir, `${data.operator_id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  totalIn += data.airframes.length;
  totalOut += data.airframes.length;
  
  data.airframes.forEach(af => {
    if (af.confidence?.identity) {
      confidenceCounts.identity[af.confidence.identity]++;
    }
    if (af.confidence?.status) {
      confidenceCounts.status[af.confidence.status]++;
    }
  });
}

console.log(`\n✅ Data build complete`);
console.log(`Airframes in: ${totalIn}`);
console.log(`Airframes out: ${totalOut}`);
console.log(`Confidence (identity):`);
Object.entries(confidenceCounts.identity).forEach(([conf, count]) => {
  console.log(`  - ${conf}: ${count}`);
});
console.log(`Confidence (status):`);
Object.entries(confidenceCounts.status).forEach(([conf, count]) => {
  console.log(`  - ${conf}: ${count}`);
});
