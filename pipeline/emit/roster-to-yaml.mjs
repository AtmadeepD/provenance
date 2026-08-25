import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const psvPath = path.join(__dirname, '../curated/roster/kingfisher-roster.psv');
const yamlPath = path.join(__dirname, '../curated/airlines/kingfisher.yaml');

const psvContent = fs.readFileSync(psvPath, 'utf8');
const lines = psvContent.split('\n');

const airframes = [];
let total = 0;
const counts = {
  state: {},
  idConf: {},
  stConf: {},
  noDates: 0
};

let headerProcessed = false;
let columns = [];

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;

  if (!headerProcessed) {
    columns = line.split('|');
    headerProcessed = true;
    continue;
  }

  const parts = line.split('|');
  const row = {};
  columns.forEach((col, idx) => {
    row[col] = parts[idx]?.trim() || '';
  });

  total++;
  
  let mfrSlug = '';
  let mfrName = '';
  if (row.type.startsWith('A3')) {
    mfrSlug = 'airbus';
    mfrName = 'Airbus';
  } else if (row.type.startsWith('ATR')) {
    mfrSlug = 'atr';
    mfrName = 'ATR';
  } else {
    console.error(`Loud failure: unknown manufacturer for type ${row.type} on reg ${row.reg}`);
    process.exit(1);
  }

  const airframe_id = `${mfrSlug}-${row.msn}`;
  
  const identities = [];
  const kfIdentity = {
    reg: row.reg,
    country: "IN"
  };
  if (row.kf_from) kfIdentity.from = row.kf_from;
  if (row.kf_to) kfIdentity.to = row.kf_to;
  identities.push(kfIdentity);

  if (row.later_ids) {
    const ids = row.later_ids.split('>').map(s => s.trim()).filter(Boolean);
    for (const reg of ids) {
      identities.push({ reg });
    }
  }

  const eras = [];
  const era = {
    operator_id: "kingfisher",
    role: "passenger"
  };
  if (row.kf_from) era.from = row.kf_from;
  if (row.kf_to) era.to = row.kf_to;
  eras.push(era);

  if (!row.kf_from && !row.kf_to) {
    counts.noDates++;
  }

  const status = {
    state: row.state,
    as_of: "2026-08-25"
  };
  if (row.place) status.place = { name: row.place };
  if (row.note) status.note = row.note;

  counts.state[row.state] = (counts.state[row.state] || 0) + 1;
  counts.idConf[row.id_conf] = (counts.idConf[row.id_conf] || 0) + 1;
  counts.stConf[row.st_conf] = (counts.stConf[row.st_conf] || 0) + 1;

  const sources = [];
  if (row.src1) sources.push({ ref: row.src1 });
  if (row.src2) sources.push({ ref: row.src2 });

  airframes.push({
    airframe_id,
    manufacturer: mfrName,
    type: row.type,
    msn: row.msn,
    status,
    events: [],
    identities,
    eras,
    sources,
    confidence: {
      identity: row.id_conf,
      status: row.st_conf
    }
  });
}

const yamlContent = fs.readFileSync(yamlPath, 'utf8');
const doc = yaml.parseDocument(yamlContent);

const data = doc.toJSON();
data.snapshot_fleet_size = {
  count: "64–66",
  as_of: "late 2011 – February 2012"
};
data.airframes = airframes;

fs.writeFileSync(yamlPath, yaml.stringify(data));

console.log('Total airframes:', total);
console.log('Count by status.state:', counts.state);
console.log('Count by confidence.identity:', counts.idConf);
console.log('Count by confidence.status:', counts.stConf);
console.log('Rows with no KF era dates:', counts.noDates);
