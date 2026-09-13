/* =========================================================================
   DocSim — headless smoke test
   Drives the real app in headless Chrome over CDP: validates every case file,
   plays a full winning run, and checks the death / timeout / budget paths.

   Run:  node test/smoke.mjs          (or MT_URL=http://host/... to test a server)
   ========================================================================= */
import { resolve } from 'node:path';
import { ROOT, SHOTS, sleep, launch } from './harness.mjs';

const PAGE = process.env.MT_URL || `file://${resolve(ROOT, 'index.html')}`;
const EXPECTED_CASES = 18;   // keep in step with the case files

let pass = 0, fail = 0;
function check(name, ok, extra) {
  if (ok) { pass++; console.log(`  \u2713 ${name}`); }
  else { fail++; console.log(`  \u2717 ${name}${extra ? ' \u2014 ' + extra : ''}`); }
}

/* --------------------------------- run --------------------------------- */
const app = await launch({ url: PAGE });
const cdp = app.cdp;
const shot = (name) => app.shot(name);
try {
  await sleep(900);

  /* ---------------------------- 1. boot ---------------------------- */
  console.log('\n1. Boot and case files');
  const ready = await cdp.eval('!!(window.DocSim && window.CASES && window.CASES.length)');
  check('app boots and exposes DocSim', ready === true);
  const n = await cdp.eval('window.CASES.length');
  check(`case library loaded (expect ${EXPECTED_CASES})`, n === EXPECTED_CASES, 'got ' + n);

  const problems = await cdp.eval(`(() => {
    const req = ['id','title','category','difficulty','blurb','timeLimitSec','budget','who','history','exam',
      'base','drift','decay','actions','tests','hints','dx','differentials','mgmt','debrief'];
    const out = [];
    const seen = new Set();
    for (const c of window.CASES) {
      const p = (m) => out.push(c.id + ': ' + m);
      for (const k of req) if (c[k] === undefined) p('missing field ' + k);
      if (seen.has(c.id)) p('duplicate id'); seen.add(c.id);
      if (c.history.length < 3) p('thin history');
      if (c.exam.length < 3) p('thin exam');
      if (c.tests.length < 8) p('fewer than 8 tests');
      if (c.actions.length < 6) p('fewer than 6 actions');
      const ids = new Set();
      for (const t of c.tests) { if (ids.has(t.id)) p('duplicate test id ' + t.id); ids.add(t.id);
        if (!(t.cost >= 0) || !(t.tat > 0)) p('bad test economics ' + t.id); }
      const aids = new Set();
      for (const a of c.actions) { if (aids.has(a.id)) p('duplicate action id ' + a.id); aids.add(a.id); }
      const crit = c.tests.filter(t => t.flag === 'critical').length;
      if (!crit) p('no critical-flag test');
      const correct = c.mgmt.options.filter(o => o.correct).length;
      if (correct < 5) p('fewer than 5 correct management options');
      if (c.mgmt.options.filter(o => o.harm).length < 3) p('fewer than 3 harmful options');
      if (!c.dx.accept.length || !c.dx.label) p('dx missing accept/label');
      const budgetPar = c.tests.filter(t => t.flag === 'critical').reduce((s,t) => s + t.cost, 0)
        + c.actions.reduce((s,a) => s + a.cost, 0);
      if (budgetPar > c.budget) p('essential spend exceeds budget: ' + budgetPar + ' > ' + c.budget);
      for (const e of (c.events || [])) if (e.at > c.timeLimitSec) p('event fires after the clock ends');
    }
    return out;
  })()`);
  check('every case passes schema validation', problems.length === 0, problems.join(' | '));

  /* ------------- 1b. the diagnosis matcher against every case ------------- */
  const matcher = await cdp.eval(`(() => {
    const out = [];
    for (const c of window.CASES) {
      const labelOk = window.DocSim.matchFor(c.dx, c.dx.label).ok;
      const accepted = c.differentials.filter(d => window.DocSim.matchFor(c.dx, d).ok);
      const rejectedDistractors = c.differentials.length - accepted.length;
      out.push({ id: c.id, labelOk, accepted, rejectedDistractors,
        total: c.differentials.length,
        typo: window.DocSim.matchFor(c.dx, c.dx.accept[0].replace(/tion/, 'shun')).ok,
        nonsense: window.DocSim.matchFor(c.dx, 'a bad case of the vapours').ok });
    }
    return JSON.stringify(out); })()`);
  const mrows = JSON.parse(matcher);
  const labelBad = mrows.filter((r) => !r.labelOk).map((r) => r.id);
  check('the canonical diagnosis is always accepted', labelBad.length === 0, labelBad.join(', '));
  const leaky = mrows.filter((r) => r.accepted.length > 2).map((r) => r.id + ':' + r.accepted.length);
  check('the differential list mostly stays rejected (no free hints)', leaky.length === 0, leaky.join(', '));
  const thinList = mrows.filter((r) => r.rejectedDistractors < 5).map((r) => r.id);
  check('each case offers at least 5 real distractors', thinList.length === 0, thinList.join(', '));
  check('a nonsense answer never matches', mrows.every((r) => r.nonsense === false));
  console.log('    accepted differentials: ' + mrows.map((r) => r.id + '=' + r.accepted.length).join(' '));

  /* --------------------- 2. home screen renders --------------------- */
  console.log('\n2. Home screen');
  const home = await cdp.eval(`JSON.stringify({
    active: document.querySelector('.screen.is-active')?.id,
    cases: document.querySelectorAll('#case-list .case-item').length,
    stats: document.querySelectorAll('#career-stats .stat').length,
    title: document.title,
    heading: document.querySelector('.logo h1').textContent.trim(),
    byline: document.querySelector('.byline').textContent.replace(/\\s+/g, ' ').trim(),
    footer: document.querySelector('.home-foot').textContent.replace(/\\s+/g, ' ').trim(),
    mailto: document.querySelector('.byline a').getAttribute('href'),
    bylineBox: (() => {
      const el = document.querySelector('.byline');
      const b = el.getBoundingClientRect();
      const tag = document.querySelector('.tagline').getBoundingClientRect();
      return { w: Math.round(b.width), h: Math.round(b.height),
        below: b.top >= tag.bottom - 1, size: parseFloat(getComputedStyle(el).fontSize) };
    })() })`);
  const h = JSON.parse(home);
  check('start screen is active', h.active === 'screen-start', h.active);
  check('all cases listed', h.cases === EXPECTED_CASES, 'got ' + h.cases);
  check('career panel rendered', h.stats === 4, 'got ' + h.stats);
  check('the app is titled DocSim', h.title.startsWith('DocSim') && h.heading === 'DocSim',
    `${h.title} / ${h.heading}`);
  check('the author credit sits next to the title',
    /Ahamed Shahmy/.test(h.byline) && /maa\.shahmy@gmail\.com/.test(h.byline),
    h.byline);
  check('the credit links to the author email', h.mailto === 'mailto:maa.shahmy@gmail.com', h.mailto);
  check('the credit is legible and sits directly under the title',
    h.bylineBox.w > 120 && h.bylineBox.h >= 14 && h.bylineBox.size >= 12 && h.bylineBox.below === true,
    JSON.stringify(h.bylineBox));
  check('the footer repeats the credit', /Ahamed Shahmy/.test(h.footer), h.footer);
  await shot('01-home.png');

  /* ------------------------- 3. start a case ------------------------ */
  console.log('\n3. Start the STEMI case');
  await cdp.eval(`document.querySelector('[data-case="stemi"]').click()`);
  await sleep(300);
  const play = await cdp.eval(`JSON.stringify({
    active: document.querySelector('.screen.is-active')?.id,
    gate: !document.querySelector('#gate').hidden,
    time: document.querySelector('#time-left').textContent,
    money: document.querySelector('#cash-left').textContent,
    life: document.querySelector('#life-value').textContent,
    actions: document.querySelectorAll('#actions-list .entry').length,
    tests: document.querySelectorAll('#tests-list .entry').length,
    vitals: document.querySelectorAll('#vitals-grid .vital').length,
    history: document.querySelectorAll('#case-history li').length,
    dxOptions: document.querySelectorAll('#dx-options option').length,
    rxLocked: !document.querySelector('#rx-locked').hidden })`);
  const p = JSON.parse(play);
  check('play screen active', p.active === 'screen-play', p.active);
  check('pre-start gate shown (clock not running yet)', p.gate === true);
  check('clock shows 10:00', p.time === '10:00', p.time);
  check('budget shows the case budget', p.money === '$1,500', p.money);
  check('stability 100%', p.life === '100%', p.life);
  check('actions rendered (10)', p.actions === 10, 'got ' + p.actions);
  check('tests rendered (13)', p.tests === 13, 'got ' + p.tests);
  check('vitals monitor rendered (6)', p.vitals === 6, 'got ' + p.vitals);
  check('history rendered (4)', p.history === 4, 'got ' + p.history);
  check('differential list offered (10)', p.dxOptions === 10, 'got ' + p.dxOptions);
  check('management locked before diagnosis', p.rxLocked === true);
  await shot('02-gate.png');

  await cdp.eval(`document.querySelector('#gate-begin').click()`);
  await sleep(400);
  const started = await cdp.eval(`!document.querySelector('#gate').hidden === false &&
    DocSim.state && DocSim.state.running`);
  check('clock is running after Begin', started === true);

  /* ------------------- 4. resuscitation + lab queue ----------------- */
  console.log('\n4. Resuscitation, investigations and the lab queue');
  await cdp.eval(`document.querySelector('[data-doact="aspirin"]').click()`);
  await cdp.eval(`document.querySelector('[data-doact="cathlab"]').click()`);
  await cdp.eval(`document.querySelector('[data-doact="oxygen"]').click()`);
  await sleep(150);
  const afterActions = await cdp.eval(`JSON.stringify({ spent: DocSim.state.spent,
    mul: DocSim.state.decayMul, done: Object.keys(DocSim.state.actions).length })`);
  const aa = JSON.parse(afterActions);
  check('three bedside actions recorded', aa.done === 3, 'got ' + aa.done);
  check('actions charged to the budget', aa.spent === 20, 'spent ' + aa.spent);
  check('correct actions slow the deterioration', aa.mul < 0.7, 'multiplier ' + aa.mul);

  await cdp.eval(`document.querySelector('[data-ordertest="ecg"]').click()`);
  await cdp.eval(`document.querySelector('[data-ordertest="hs_trop"]').click()`);
  await cdp.eval(`document.querySelector('[data-ordertest="cxr"]').click()`);
  await cdp.eval(`document.querySelector('[data-ordertest="cta"]').click()`);
  await sleep(150);
  const queued = await cdp.eval(`JSON.stringify({ pending: DocSim.state.pending.length,
    spend: DocSim.state.spent, blockMsg: !!document.querySelector('.status.blocked') })`);
  const q = JSON.parse(queued);
  check('four tests running at once', q.pending === 4, 'got ' + q.pending);
  check('test costs charged', q.spend === 790, 'spent ' + q.spend);
  const full = await cdp.eval(`(() => {
    const b = document.querySelector('button[data-ordertest="echo"]');
    return b ? b.disabled : null; })()`);
  check('further ordering blocked while queue is full', full === true, 'disabled=' + full);

  await sleep(9500);
  const ecg = await cdp.eval(`JSON.stringify({
    done: DocSim.state.tests.ecg?.status,
    shown: (document.querySelector('[data-test="ecg"] .entry-result')||{}).textContent?.slice(0,40),
    mul: DocSim.state.decayMul, pending: DocSim.state.pending.length })`);
  const e = JSON.parse(ecg);
  check('ECG reported after its turnaround', e.done === 'done', e.done);
  check('ECG result text displayed', /ST elevation/.test(e.shown || ''), e.shown);
  check('queue drains', e.pending < 4, 'pending ' + e.pending);

  const freeAgain = await cdp.eval(`(() => {
    const b = document.querySelector('button[data-ordertest="echo"]');
    return b && !b.disabled; })()`);
  check('ordering possible again after a result', freeAgain === true);

  /* -------------------------- 5. the clock -------------------------- */
  console.log('\n5. The clock and the deteriorating patient');
  const before = await cdp.eval('DocSim.state.elapsed');
  await sleep(1200);
  const after = await cdp.eval('DocSim.state.elapsed');
  check('clock advances in real time', after > before, `${before} -> ${after}`);
  const lifeNow = await cdp.eval('DocSim.state.stability');
  check('patient stability falls while untreated', lifeNow < 100, 'stability ' + lifeNow);
  const chartPts = await cdp.eval('document.querySelectorAll("#chart path").length');
  check('monitor chart is drawing the trend', chartPts >= 3, 'paths ' + chartPts);
  await shot('03-patient.png');

  /* --------------------------- 6. diagnosis ------------------------- */
  console.log('\n6. Diagnosis entry');
  await cdp.eval(`document.querySelector('#tabs [data-tab="dx"]').click()`);
  await cdp.eval(`document.querySelector('#dx-input').value = 'pneumothorax';
    document.querySelector('#dx-form').dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}))`);
  await sleep(200);
  const wrong = await cdp.eval(`JSON.stringify({ wrong: DocSim.state.dxWrong,
    solved: DocSim.state.dxSolved, msgs: document.querySelectorAll('#dx-attempts .verdict-bad').length })`);
  const w = JSON.parse(wrong);
  check('wrong diagnosis is rejected with an explanation', w.wrong === 1 && w.solved === false, wrong);
  check('wrong diagnosis shown in the attempt history', w.msgs === 1, 'got ' + w.msgs);

  const lockMsg = await cdp.eval(`(() => { document.querySelector('#tabs [data-tab="rx"]').click();
    return document.querySelector('.pane[data-pane="rx"]').hidden; })()`);
  check('management stays locked before a correct diagnosis', lockMsg === true);

  await cdp.eval(`document.querySelector('#tabs [data-tab="dx"]').click();
    document.querySelector('#dx-input').value = 'she has an acute anterior STEMI';
    document.querySelector('#dx-form').dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}))`);
  await sleep(300);
  const right = await cdp.eval(`JSON.stringify({ solved: DocSim.state.dxSolved,
    confirmed: !document.querySelector('#dx-confirmed').hidden,
    tab: document.querySelector('.pane[data-pane="rx"]').hidden === false,
    options: document.querySelectorAll('#rx-list .stack-check').length })`);
  const r = JSON.parse(right);
  check('natural-language correct diagnosis accepted', r.solved === true, right);
  check('confirmation panel shown', r.confirmed === true);
  check('management unlocked and opened', r.tab === true);
  check('management options rendered (12)', r.options === 12, 'got ' + r.options);
  await shot('04-treat.png');

  /* -------------------------- 7. management ------------------------- */
  console.log('\n7. Management and recovery');
  const CORRECT = ['pci', 'dapt', 'heparin', 'statin', 'bb', 'acei', 'ccu', 'o2only'];
  await cdp.eval(`(() => {
    const ids = ${JSON.stringify(CORRECT)};
    for (const id of ids) {
      const box = document.querySelector('[data-rxbox="' + id + '"]');
      box.checked = true;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return Object.keys(DocSim.state ? {} : {}); })()`);
  await sleep(200);
  const picked = await cdp.eval(`document.querySelectorAll('#rx-list input:checked').length`);
  check('correct bundle selected (8 of 12)', picked === 8, 'got ' + picked);

  await cdp.eval(`document.querySelector('#btn-rx').click()`);
  await sleep(400);
  const rx = await cdp.eval(`JSON.stringify({ grade: DocSim.state.mgmtGrade,
    recovering: DocSim.state.recovering,
    feedback: document.querySelectorAll('#rx-feedback .entry').length })`);
  const rxr = JSON.parse(rx);
  check('full correct management graded 1.0', rxr.grade === 1, 'grade ' + rxr.grade);
  check('patient starts recovering', rxr.recovering === true);
  check('feedback given for every selected or missed measure', rxr.feedback === 8, 'got ' + rxr.feedback);

  for (let i = 0; i < 40; i++) {
    if (await cdp.eval(`document.querySelector('.screen.is-active').id === 'screen-end'`)) break;
    await sleep(250);
  }
  const end = await cdp.eval(`JSON.stringify({
    screen: document.querySelector('.screen.is-active').id,
    win: document.querySelector('#outcome').classList.contains('win'),
    title: document.querySelector('#outcome h1').textContent,
    total: document.querySelector('#score-total').textContent,
    rank: document.querySelector('#rank-line').textContent,
    rows: document.querySelectorAll('#score-breakdown .brow').length,
    debrief: document.querySelectorAll('#debrief .pearl').length,
    share: document.querySelector('#share-text').value,
    card: document.querySelector('#scorecard').toDataURL().length })`);
  const en = JSON.parse(end);
  check('results screen shown after recovery', en.screen === 'screen-end', en.screen);
  check('outcome banner is a success', en.win === true, en.title);
  check('score is a positive number', Number(en.total) > 0, en.total);
  check('grade line present', /Grade:/.test(en.rank), en.rank);
  check('score breakdown itemised', en.rows >= 8, 'rows ' + en.rows);
  check('debrief populated', en.debrief >= 8, 'pearls ' + en.debrief);
  check('share text carries the app name, the score and the author credit',
    /DocSim/.test(en.share) && /1520/.test(en.share) && /Ahamed Shahmy/.test(en.share),
    en.share.slice(0, 90));
  check('scorecard image drawn on canvas', en.card > 5000, 'dataURL length ' + en.card);
  await shot('05-results.png');

  const persisted = await cdp.eval(`(() => { try { return localStorage.getItem('docsim.stats.v1'); }
    catch (e) { return 'unavailable'; } })()`);
  const ps = persisted && persisted !== 'unavailable' ? JSON.parse(persisted) : null;
  check('record survives the case (persistent when storage is available)',
    persisted === 'unavailable' ? true : (ps && ps.plays >= 1 && ps.best > 0),
    persisted === 'unavailable' ? 'storage blocked on this origin — in-memory only' : persisted);
  console.log('    storage: ' + (persisted === 'unavailable' ? 'unavailable on this origin' : persisted));

  /* ------------------- 8. budget, death and timeout ----------------- */
  console.log('\n8. Failure paths');
  await cdp.eval(`document.querySelector('#btn-home').click()`);
  await sleep(200);
  await cdp.eval(`DocSim.start('dka')`);
  await sleep(200);
  await cdp.eval(`document.querySelector('#gate-begin').click()`);
  await sleep(200);
  const blocked = await cdp.eval(`(() => {
    document.querySelector('#tabs [data-tab="tests"]').click();
    const btn = document.querySelector('button[data-ordertest="cthead"]');
    DocSim.state.spent = DocSim.state.cs.budget - 10;
    document.querySelector('#tabs [data-tab="patient"]').click();
    document.querySelector('#tabs [data-tab="tests"]').click();
    const btn2 = document.querySelector('button[data-ordertest="cthead"]');
    const before = DocSim.state.spent;
    if (btn2 && !btn2.disabled) btn2.click();
    return JSON.stringify({ disabled: btn2 ? btn2.disabled : null, overspent: DocSim.state.spent > before,
      blockedBadge: !!document.querySelector('[data-test="cthead"] .status.blocked') }); })()`);
  const bl = JSON.parse(blocked);
  check('test blocked when the budget cannot cover it', bl.disabled === true, blocked);
  check('budget cannot be exceeded', bl.overspent === false);
  check('blocked test is labelled as unaffordable', bl.blockedBadge === true);

  await cdp.eval(`DocSim.state.stability = 0.02`);
  await sleep(1400);
  const dead = await cdp.eval(`JSON.stringify({ screen: document.querySelector('.screen.is-active').id,
    outcome: DocSim.state.outcome, lose: document.querySelector('#outcome').classList.contains('lose'),
    title: document.querySelector('#outcome h1').textContent })`);
  const dd = JSON.parse(dead);
  check('death ends the case', dd.outcome === 'died', dd.outcome);
  check('death shows the failure banner', dd.lose === true, dd.title);
  await shot('06-death.png');

  await cdp.eval(`DocSim.start('op')`);
  await sleep(200);
  await cdp.eval(`document.querySelector('#gate-begin').click()`);
  await sleep(200);
  await cdp.eval(`DocSim.state.elapsed = DocSim.state.cs.timeLimitSec - 0.3`);
  await sleep(900);
  const to = await cdp.eval(`JSON.stringify({ outcome: DocSim.state.outcome,
    title: document.querySelector('#outcome h1').textContent })`);
  const tt = JSON.parse(to);
  check('running out of time ends the case as a failure', tt.outcome === 'timeout', to);

  /* ---------------------- 9. hints and welfare ---------------------- */
  console.log('\n9. Support features and console hygiene');
  await cdp.eval(`document.querySelector('#btn-home').click()`);
  await sleep(150);
  await cdp.eval(`DocSim.start('meningitis')`);
  await sleep(150);
  await cdp.eval(`document.querySelector('#gate-begin').click()`);
  await sleep(150);
  const t0 = await cdp.eval('DocSim.state.remaining');
  await cdp.eval(`document.querySelector('#btn-hint').click()`);
  await sleep(150);
  const hint = await cdp.eval(`JSON.stringify({ used: DocSim.state.hints,
    remaining: DocSim.state.remaining, badge: document.querySelector('#hint-count').textContent,
    shown: document.querySelectorAll('.hintline').length })`);
  const hh = JSON.parse(hint);
  check('hint reveals a clue', hh.used === 1 && hh.shown === 1, hint);
  check('hint costs 25 seconds of clock time', Math.abs((t0 - hh.remaining) - 25) < 1.5, `${t0} -> ${hh.remaining}`);
  check('hint counter decrements', hh.badge === '1', hh.badge);

  const tabCheck = await cdp.eval(`(() => {
    const out = [];
    for (const t of document.querySelectorAll('#tabs .tab')) {
      t.click();
      const pane = document.querySelector('.pane[data-pane="' + t.dataset.tab + '"]');
      out.push(t.dataset.tab + ':' + (pane ? !pane.hidden : 'missing'));
    }
    return out.join(','); })()`);
  check('all tabs switch to their panel (Treat stays locked before diagnosis)',
    tabCheck === 'patient:true,actions:true,tests:true,dx:true,rx:false,log:true', tabCheck);

  const layout = await cdp.eval(`(() => {
    const over = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.tabs')) continue;            // the tab strip scrolls on purpose
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > window.innerWidth + 2) {
        over.push((el.id ? '#' + el.id : el.className || el.tagName) + '=' + Math.round(r.right));
      }
    }
    const tabs = document.querySelector('#tabs');
    const small = [];
    for (const b of document.querySelectorAll('button')) {
      const r = b.getBoundingClientRect();
      if (r.height > 0 && r.height < 36) small.push((b.textContent || b.id).trim().slice(0, 18) + ':' + Math.round(r.height));
    }
    const hud = getComputedStyle(document.querySelector('#hud'));
    const cols = getComputedStyle(document.querySelector('.gauges')).gridTemplateColumns.split(' ');
    const bar = document.querySelector('#life-bar');
    const vitals = [...document.querySelectorAll('#vitals-grid .vital')].map(v => ({
      k: v.querySelector('.k').textContent, v: v.querySelector('.v').textContent, cls: v.className }));
    return JSON.stringify({ over: over.slice(0, 5), overCount: over.length,
      small: small.slice(0, 5), hudPos: hud.position, cols: cols.length,
      docFits: document.documentElement.scrollWidth <= window.innerWidth + 1,
      tabsScrollable: tabs.scrollWidth > tabs.clientWidth,
      tabsTotal: tabs.scrollWidth, tabsVisible: tabs.clientWidth,
      barWidth: bar.style.width, vitalsCount: vitals.length });
  })()`);
  const lay = JSON.parse(layout);
  check('no element overflows the 390px viewport', lay.overCount === 0, JSON.stringify(lay.over));
  check('the page itself never scrolls sideways', lay.docFits === true, JSON.stringify(lay));
  check('the tab strip is a scrollable rail, not clipped content',
    lay.tabsScrollable === true, `${lay.tabsVisible} of ${lay.tabsTotal}px visible`);
  check('tap targets are phone sized (>=36px)', lay.small.length === 0, JSON.stringify(lay.small));
  check('HUD stays pinned while scrolling', lay.hudPos === 'sticky', lay.hudPos);
  check('three gauges sit on one row', lay.cols === 3, 'columns ' + lay.cols);
  check('stability bar is being driven by state', /%$/.test(lay.barWidth), lay.barWidth);
  check('six vitals tiles rendered', lay.vitalsCount === 6, 'got ' + lay.vitalsCount);

  const colour = await cdp.eval(`(() => {
    DocSim.state.stability = 20;
    return new Promise(r => setTimeout(() => r(JSON.stringify({
      pulse: document.querySelectorAll('#vitals-grid .v-crit').length,
      alarm: !document.querySelector('#alarm').hidden,
      lifeCrit: document.querySelector('.gauge-life').classList.contains('is-crit'),
      lifeText: document.querySelector('#life-value').textContent })), 900)); })()`, true);
  const col = JSON.parse(colour);
  check('vitals turn critical red as the patient deteriorates', col.pulse >= 3, 'critical tiles ' + col.pulse);
  check('alarm overlay activates in extremis', col.alarm === true);
  check('stability gauge switches to critical styling', col.lifeCrit === true, col.lifeText);
  await shot('07-critical.png');

  const canvas = await cdp.eval(`(() => {
    const cv = document.querySelector('#scorecard');
    const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
    const seen = new Set();
    for (let i = 0; i < d.length; i += 4000) seen.add(d[i] + ',' + d[i+1] + ',' + d[i+2]);
    return seen.size; })()`);
  check('scorecard canvas contains real drawn content', canvas > 12, 'distinct sampled colours ' + canvas);

  /* --------------------- 10. desktop / tablet layout --------------------- */
  console.log('\n10. Wide-screen layout and a clean reload');
  await cdp.send('Emulation.setDeviceMetricsOverride',
    { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.reload', { ignoreCache: true });
  await sleep(1400);
  const desk = await cdp.eval(`(() => {
    const ready = !!(window.DocSim && window.CASES);
    if (!ready) return JSON.stringify({ ready: false });
    DocSim.start('pe');
    document.querySelector('#tabs [data-tab="tests"]').click();
    const grid = getComputedStyle(document.querySelector('.play-grid'));
    const patient = document.querySelector('.pane[data-pane="patient"]').getBoundingClientRect();
    const work = document.querySelector('.pane[data-pane="tests"]').getBoundingClientRect();
    return JSON.stringify({ ready: true, columns: grid.gridTemplateColumns.split(' ').length,
      sideBySide: work.left > patient.right - 5,
      monitorStaysVisible: patient.width > 200,
      chartHeight: document.querySelector('#chart').getBoundingClientRect().height,
      docFits: document.documentElement.scrollWidth <= window.innerWidth + 1 });
  })()`);
  const dsk = JSON.parse(desk);
  check('app reloads cleanly at desktop width', dsk.ready === true, desk);
  check('two-column working layout on wide screens', dsk.columns === 2, 'columns ' + dsk.columns);
  check('monitor pane and working pane sit side by side', dsk.sideBySide === true, desk);
  check('monitor column stays visible while working another tab', dsk.monitorStaysVisible === true, desk);
  check('chart scales up on desktop', dsk.chartHeight > 200, 'height ' + dsk.chartHeight);
  check('no horizontal overflow at 1280px', dsk.docFits === true, desk);
  await shot('08-desktop.png');

  const errs = cdp.errors();
  check('no uncaught page errors or console errors', errs.length === 0, errs.slice(0, 3).join(' || '));

} catch (err) {
  fail++;
  console.error('\nFATAL: ' + err.message);
} finally {
  app.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
console.log(`screenshots: ${SHOTS}`);
process.exit(fail ? 1 : 0);
