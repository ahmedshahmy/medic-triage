/* =========================================================================
   MediTriage — full playthrough test
   Plays all eight cases the way a good clinician would (resuscitate, order the
   high-yield tests, commit to the diagnosis, give the whole correct bundle)
   and requires every one of them to end in a full recovery.

   The page clock runs at 15x so ten-minute cases finish in seconds.

   Run:  node test/playthrough.mjs
   ========================================================================= */
import { resolve } from 'node:path';
import { ROOT, SHOTS, sleep, launch } from './harness.mjs';

const PAGE = process.env.MT_URL || `file://${resolve(ROOT, 'index.html')}`;

let pass = 0, fail = 0;
function check(name, ok, extra) {
  if (ok) { pass++; console.log(`  \u2713 ${name}`); }
  else { fail++; console.log(`  \u2717 ${name}${extra ? ' \u2014 ' + extra : ''}`); }
}

const app = await launch({ url: PAGE, speed: 15 });
const { cdp } = app;

async function waitFor(expr, ms = 30000, step = 120) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await cdp.eval(expr)) return true;
    await sleep(step);
  }
  return false;
}

try {
  await sleep(800);
  const cases = await cdp.eval(`window.CASES.map(c => c.id).join(',')`);
  const ids = cases.split(',');

  console.log('\nClinical playthrough of every case (15x clock)\n');
  console.log('  ' + 'case'.padEnd(14) + 'outcome'.padEnd(12) + 'score'.padEnd(8) +
    'grade'.padEnd(24) + 'tests  spent/budget   stability');

  for (const id of ids) {
    await cdp.eval(`MediTriage.start(${JSON.stringify(id)})`);
    await sleep(120);
    await cdp.eval(`document.querySelector('#gate-begin').click()`);
    await sleep(150);

    // 1. resuscitate with every helpful bedside measure (skip harmful ones)
    await cdp.eval(`(() => {
      const st = MediTriage.state;
      for (const a of st.cs.actions) {
        if (a.harm) continue;
        const b = document.querySelector('button[data-doact="' + a.id + '"]');
        if (b && !b.disabled) b.click();
      }
      return Object.keys(MediTriage.state.actions).length; })()`);

    // 2. order the fastest high-yield investigations the budget allows
    await cdp.eval(`(() => {
      const st = MediTriage.state;
      const crit = st.cs.tests.filter(t => t.flag === 'critical').sort((a, b) => a.tat - b.tat);
      for (const t of crit.slice(0, 3)) {
        const b = document.querySelector('button[data-ordertest="' + t.id + '"]');
        if (b && !b.disabled) b.click();
      }
      return true; })()`);

    // 3. wait for the first report the way a real clinician would read results
    await waitFor(`Object.values(MediTriage.state.tests).some(t => t.status === 'done')`, 15000);
    const readResults = await cdp.eval(`Object.values(MediTriage.state.tests).filter(t => t.status === 'done').length`);

    // 4. commit to the diagnosis (typed, not clicked)
    await cdp.eval(`document.querySelector('#tabs [data-tab="dx"]').click();
      document.querySelector('#dx-input').value = ${JSON.stringify('')} ;
      true`);
    const label = await cdp.eval(`MediTriage.state.cs.dx.label`);
    await cdp.eval(`document.querySelector('#dx-input').value = ${JSON.stringify(label)};
      document.querySelector('#dx-form').dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
      true`);
    await sleep(150);
    const dxOk = await cdp.eval(`MediTriage.state.dxSolved`);

    // 5. give the complete correct management bundle (and nothing harmful)
    await cdp.eval(`(() => {
      const st = MediTriage.state;
      for (const o of st.cs.mgmt.options) {
        if (!o.correct) continue;
        const box = document.querySelector('[data-rxbox="' + o.id + '"]');
        if (box && !box.checked) { box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      return true; })()`);
    await sleep(120);
    await cdp.eval(`document.querySelector('#btn-rx').click()`);

    // 6. let the patient recover
    const ended = await waitFor(`document.querySelector('.screen.is-active').id === 'screen-end'`, 20000, 150);
    const res = JSON.parse(await cdp.eval(`JSON.stringify({
      outcome: MediTriage.state && MediTriage.state.outcome,
      win: document.querySelector('#outcome').classList.contains('win'),
      total: Number(document.querySelector('#score-total').textContent),
      rank: document.querySelector('#rank-line').textContent.replace(/\\s+/g,' ').trim().slice(0, 22),
      ordered: Object.keys(MediTriage.state.tests).length,
      spent: MediTriage.state.spent, budget: MediTriage.state.cs.budget,
      stability: Math.round(MediTriage.state.stability),
      grade: MediTriage.state.mgmtGrade })`));

    console.log('  ' + id.padEnd(14) + String(res.outcome).padEnd(12) + String(res.total).padEnd(8) +
      res.rank.padEnd(24) + String(res.ordered).padEnd(7) +
      (res.spent + '/' + res.budget).padEnd(15) + res.stability + '%');

    check(`${id}: results screen reached`, ended === true);
    check(`${id}: diagnosis accepted ("${label.slice(0, 44)}")`, dxOk === true);
    check(`${id}: full management grade`, res.grade === 1, 'grade ' + res.grade);
    check(`${id}: patient fully recovered`, res.outcome === 'recovered' && res.win === true, res.outcome);
    check(`${id}: scored`, res.total > 300, 'score ' + res.total);
    check(`${id}: stayed inside the budget`, res.spent <= res.budget, res.spent + '/' + res.budget);
  }

  // the home screen record should now show eight wins
  await cdp.eval(`document.querySelector('#btn-home').click()`);
  await sleep(250);
  const career = JSON.parse(await cdp.eval(`JSON.stringify({
    played: document.querySelectorAll('#career-stats .stat .v')[0].textContent,
    saved: document.querySelectorAll('#career-stats .stat .v')[1].textContent,
    best: document.querySelectorAll('#career-stats .stat .v')[3].textContent,
    bests: document.querySelectorAll('#case-list .best').length })`));
  console.log('\n  record: ' + JSON.stringify(career));
  check('all eight playthroughs counted in the record', career.played === '8' && career.saved === '8',
    JSON.stringify(career));
  check('every case list entry shows a best score', career.bests === 8, String(career.bests));
  await app.shot('09-playthrough-home.png');

  const errs = cdp.errors();
  check('no console errors during any playthrough', errs.length === 0, errs.slice(0, 2).join(' || '));
} catch (err) {
  fail++;
  console.error('\nFATAL: ' + err.message);
} finally {
  app.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
console.log(`screenshots: ${SHOTS}`);
process.exit(fail ? 1 : 0);
