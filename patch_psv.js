const fs = require('fs');

const replacements = {
  'VT-KFA': 'VT-KFA|A320-232|2413|2005-04|2012-10|VP-BHW|active||Yamal Airlines; returned to ILFC and stored Dublin early 2012|verified|partial|https://www.jetphotos.com/info/A32X-2413|https://www.pictaero.com/en/search/search?a4=VT-KFA',
  'VT-KFB': 'VT-KFB|A320-232|2443|2005-05|2012-10|OE-ICG > XA-VAF > VT-IHS|scrapped|Teruel, Spain|broken up Aug 2021 after three post-Kingfisher operators|verified|verified|https://www.airfleets.fr/ficheapp/plane-a320-2443.htm|https://xfw-spotter.blogspot.com/2005/05/a320-232-kingfisher-airlines-f-wwbr-vt.html',
  'VT-KFC': 'VT-KFC|A320-232|2496|2005-07|2012-08|EI-EWO > AP-BMC > YR-DSI > RP-C7938 > ZS-GAC|active||Smartwings / Global Aviation|verified|verified|https://www.jetphotos.com/info/A32X-2496|https://www.aerotransport.org/php/archives.php?m=200507',
  'VT-KFF': 'VT-KFF|A320-232|2531|2005-09|2012-10|HS-PPD > LY-WSM|active||Heston Airlines|verified|verified|https://www.jetphotos.com/info/A32X-2531|https://commons.wikimedia.org/wiki/Category:VT-KFF_(aircraft)',
  'VT-KFG': 'VT-KFG|A320-232|2576|2005-10|2012-04|EI-EWE > RP-C8997 > XA-VAZ|written_off|Puerto Vallarta, Mexico|nose-gear collapse 18 Mar 2021|verified|verified|https://www.airfleets.es/ficheapp/plane-a320-2576.htm|https://xfw-spotter.blogspot.com/2005/10/',
  'VT-KFH': 'VT-KFH|A319-131|2621|2005-12|2012-10|EI-EYA > YU-APC|active||Air Serbia; photographed Tivat 12 Jul 2026|verified|verified|https://www.jetphotos.com/info/A32X-2621|https://www.airhistory.net/operators/427/Air-Serbia-GetJet-Airlines',
  'VT-KFI': 'VT-KFI|A319-132|2634|2005-12|2011-12|EI-EXZ > HS-PPF|active||Bangkok Airways; stored from Dec 2011, transferred Mar 2012|verified|verified|https://www.jetphotos.com/info/A32X-2634|https://www.airfleets.es/ficheapp/plane-a319-2634.htm',
  'VT-KFJ': 'VT-KFJ|A319|2664|2006-01|2012-11|M-BOCA > HS-PPG|active||Bangkok Airways; photographed Bangkok 4 Feb 2026|verified|partial|https://www.jetphotos.com/info/A32X-2664|https://www.airfleets.fr/ficheapp/plane-a319-2664.htm',
  'VT-KFK': 'VT-KFK|A320-232|2670|2006-02|2012-09|EI-EWS > VN-A557 > VT-IHQ|scrapped|Knock, Ireland|returned to lessor Sep 2012; scrapped 2021|verified|partial|https://www.jetphotos.com/info/A32X-2670|',
  'VT-KFM': 'VT-KFM|A320-232|2856|2006-08|2012-10|M-ABFN > OY-KAY|active||SAS; M-ABFN Apr 2013, OY-KAY Nov 2013|verified|partial|https://www.airfleets.net/ficheapp/plane-a320-2856.htm|https://oy-reg.dk/register/?p=20&sort=type',
  'VT-KFP': 'VT-KFP|A321-231|2919|2006-10|2012-10|OE-ICJ > TC-JMN > P4-AAI > N919NX|stored||freighter conversion completed 2024; stored|verified|partial|https://www.jetphotos.com/info/A32X-2919|',
  'VT-KFQ': 'VT-KFQ|A321-232|2927|2006-11|2012-02|N927AG > VQ-BRO > HL8073|active||Air Seoul; flight recorded 8 Aug 2026; left Kingfisher before the collapse|verified|verified|https://www.jetphotos.com/info/A32X-2927|https://www.airfleets.fr/ficheapp/plane-a321-2927.htm',
  'VT-KAC': 'VT-KAC|ATR 72-212A|729|2006-06|2009-11||written_off|Mumbai, India|runway excursion on flight IT-4124, 10 Nov 2009; damaged beyond repair|verified|verified|https://asn.flightsafety.org/reports/2009/20091110_AT75_VT-KAC.pdf|https://www.planespotters.net/airframe/atr-72-vt-kac-kingfisher-airlines/elw7gn',
  'VT-KAA': 'VT-KAA|ATR 72-212A|699|2006-03|2012-03|VT-APA|unknown||repossessed by lessor Mar 2012, then offered to Air Pegasus|verified|sketchy||',
  'VT-KAB': 'VT-KAB|ATR 72-212A|728|2006|2012||scrapped||broken up 2022|verified|partial||',
  'VT-KAD': 'VT-KAD|ATR 72-212A|730|2006|2012||unknown||named in lessor custody dispute|verified|sketchy||',
  'VT-KAE': 'VT-KAE|ATR 72-212A|737|2006|2012-10||scrapped|Chennai, India||verified|sketchy||',
  'VT-KAF': 'VT-KAF|ATR 72-212A|738|2006|2012-10||unknown|||verified|sketchy||',
  'VT-KAG': 'VT-KAG|ATR 72-212A|743|2007|2012||unknown|||verified|sketchy||',
  'VT-KAH': 'VT-KAH|ATR 72-212A|746|2007|2012|PK-PAW|unknown||Pelita Air|verified|sketchy||',
  'VT-KAI': 'VT-KAI|ATR 72-212A|750|2007-06|2012||unknown|||verified|sketchy||',
  'VT-KAJ': 'VT-KAJ|ATR 72-212A|754|2007|2012|HS-DRD|unknown||Nok Air|verified|sketchy||',
  'VT-KAK': 'VT-KAK|ATR 72-212A|758|2007|2012|VT-JDD|unknown||JetKonnect|verified|sketchy||',
  'VT-KAL': 'VT-KAL|ATR 72-212A|759|2007|2012|F-ONCL|unknown||Air Caledonie|verified|sketchy||',
  'VT-KAM': 'VT-KAM|ATR 72-212A|762|2007|2012|VT-APB|unknown||Air Pegasus|verified|sketchy||',
  'VT-KAN': 'VT-KAN|ATR 72-212A|767|2007|2012|VT-CMA|unknown||Air Carnival|verified|sketchy||',
  'VT-KAO': 'VT-KAO|ATR 72-212A|772|2007|2012|VT-JDC|unknown||JetKonnect|verified|sketchy||',
  'VT-KAP': 'VT-KAP|ATR 72-212A|776|2007|2012|9N-ALN|unknown||Yeti Airlines|verified|sketchy||',
  'VT-KAQ': 'VT-KAQ|ATR 72-212A|777|2007|2012|HS-KAD|unknown||Kan Air|verified|sketchy||',
  'VT-KAR': 'VT-KAR|ATR 72-212A|782|2007|2012|OY-CRV|unknown||Mistral Air|verified|sketchy||',
  'VT-KAS': 'VT-KAS|ATR 72-212A|786|2007|2012|A2-ABR|unknown||Air Botswana|verified|sketchy||',
  'VT-VJK': 'VT-VJK|A330-223|874|2008-06|2012|LZ-AWZ > TC-LNA > 9H-HFK|active||flying as 9H-HFK with Hi Fly Malta|verified|verified|https://hifly.aero/fleet/a330/9h-hfk/|https://www.flightradar24.com/data/aircraft/9h-hfk/',
  'VT-VJP': 'VT-VJP|A330-223|946|2008-08|2012-02|D-ANJB > VN-A383 > EI-GCU|stored|Teruel, Spain|stored at Teruel since 9 May 2022; physically sighted 13 Jul 2025|verified|verified|https://simpleflying.com/kingfisher-airlines-widebody-fleet-story/|https://www.jetphotos.com/registration/VT-VJP'
};

const path = 'pipeline/curated/roster/kingfisher-roster.psv';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const newLines = lines.map(line => {
  const reg = line.split('|')[0];
  if (replacements[reg]) {
    return replacements[reg];
  }
  return line;
});

fs.writeFileSync(path, newLines.join('\n'));
