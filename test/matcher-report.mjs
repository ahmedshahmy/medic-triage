/* =========================================================================
   DocSim — diagnosis matcher report
   For every case, prints which differentials the matcher accepts, so case
   authors can confirm that a distractor is rejected (and see why a legitimate
   alternative answer is allowed).

   Run:  node test/matcher-report.mjs [caseId]
   ========================================================================= */
import { resolve } from 'node:path';
import { ROOT, launch } from './harness.mjs';

const PAGE = process.env.MT_URL || `file://${resolve(ROOT, 'index.html')}`;
const only = process.argv[2];

const app = await launch({ url: PAGE });
try {
  const report = JSON.parse(await app.cdp.eval(`JSON.stringify(window.CASES.map(c => ({
    id: c.id,
    difficulty: c.difficulty,
    label: c.dx.label,
    labelOk: DocSim.matchFor(c.dx, c.dx.label).ok,
    accepted: c.differentials.filter(d => DocSim.matchFor(c.dx, d).ok),
    rejected: c.differentials.filter(d => !DocSim.matchFor(c.dx, d).ok),
    natural: ['she has ' + c.dx.accept[0], c.dx.accept[0].toUpperCase(),
      c.dx.accept[0].replace(/([a-z])([a-z])(?=[a-z]*$)/,
        (m, a, b) => b + a)].map(g => g + ' -> ' + (DocSim.matchFor(c.dx, g).ok ? 'ok' : 'REJECTED'))
  })))`));

  let leaks = 0;
  for (const r of report) {
    if (only && r.id !== only) continue;
    const unexpected = r.accepted.filter((d) => d.toLowerCase() !== r.label.toLowerCase());
    console.log(`\n${r.id} (${r.difficulty}) — ${r.label}`);
    console.log(`  canonical label accepted: ${r.labelOk ? 'yes' : 'NO'}`);
    console.log(`  phrasing and one transposed typo: ${r.natural.join(' | ')}`);
    console.log(`  differentials accepted (${r.accepted.length}): ${r.accepted.join(' ; ') || 'none'}`);
    console.log(`  differentials rejected (${r.rejected.length})`);
    if (unexpected.length) {
      leaks++;
      console.log(`  NOTE: extra accepted strings beyond the canonical label: ${unexpected.join(' ; ')}`);
    }
  }

  const bad = report.filter((r) => !r.labelOk).map((r) => r.id);
  console.log(`\n${report.length} cases, ${leaks} with alternative accepted answers, ` +
    `${bad.length} failing to accept their own canonical label${bad.length ? ': ' + bad.join(', ') : ''}`);
  process.exit(bad.length ? 1 : 0);
} finally {
  app.close();
}
