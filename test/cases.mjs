/* =========================================================================
   MediTriage — case library validation (no browser, runs in milliseconds)
   Checks the schema, the internal references and the playability balance of
   every case: is the essential path affordable, does an untreated patient
   deteriorate before the clock runs out, and can good play keep them alive?

   Run:  node test/cases.mjs
   ========================================================================= */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './harness.mjs';

const FILES = ['cases.js', 'cases-more.js', 'cases-emergency.js', 'cases-medicine.js', 'cases-complex.js',
  'cases-firsthour.js', 'cases-cardioresp.js', 'cases-neurology.js', 'cases-infection.js', 'cases-poisoning.js', 'cases-metabolic.js', 'cases-womens-paeds.js'];

let pass = 0, fail = 0;
function check(name, ok, extra) {
  if (ok) { pass++; console.log(`  \u2713 ${name}`); }
  else { fail++; console.log(`  \u2717 ${name}${extra ? ' \u2014 ' + extra : ''}`); }
}

/* load the case files exactly as the browser does */
const sandbox = { window: {} };
for (const f of FILES) {
  try {
    new Function('window', readFileSync(resolve(ROOT, f), 'utf8'))(sandbox.window);
  } catch (e) {
    console.error(`  \u2717 ${f} threw while loading: ${e.message}`);
    process.exit(1);
  }
}
const CASES = sandbox.window.CASES || [];

const REQUIRED = ['id', 'title', 'category', 'difficulty', 'blurb', 'timeLimitSec', 'budget', 'who',
  'history', 'exam', 'base', 'drift', 'decay', 'actions', 'tests', 'hints', 'dx', 'differentials',
  'mgmt', 'debrief'];
const VITALS = ['hr', 'sbp', 'dbp', 'rr', 'spo2', 'temp', 'gcs'];

console.log(`\nCase library: ${FILES.length} files, ${CASES.length} cases\n`);

/* ------------------------------ schema ------------------------------- */
const problems = [];
const ids = new Set();
for (const c of CASES) {
  const p = (m) => problems.push(`${c.id || '<no id>'}: ${m}`);
  for (const k of REQUIRED) if (c[k] === undefined) p(`missing field ${k}`);
  if (ids.has(c.id)) p('duplicate case id');
  ids.add(c.id);
  if (!['easy', 'moderate', 'hard'].includes(c.difficulty)) p(`bad difficulty "${c.difficulty}"`);
  if (!(c.timeLimitSec >= 300 && c.timeLimitSec <= 1800)) p('time limit outside 5-30 minutes');
  if (c.history.length < 3) p('history needs at least 3 bullets');
  if (c.exam.length < 3) p('examination needs at least 3 bullets');
  if (!c.who || c.who.length < 60) p('thin demographics line');
  if (!c.blurb || c.blurb.length < 20) p('thin blurb');
  if (c.hints.length < 2) p('fewer than 2 hints');
  if (c.dx.penaltySec <= 0 || c.dx.penaltyStab <= 0) p('diagnosis penalty not set');
  if (!c.dx.label || !c.dx.why) p('diagnosis label or rationale missing');
  if (!(c.dx.reject || []).length) p('no reject rules for near-miss diagnoses');
  if (c.debrief.key.length < 3 || c.debrief.pearls.length < 3 || c.debrief.pitfalls.length < 2) {
    p('debrief needs 3 key clues, 3 pearls and 2 pitfalls');
  }
  VITALS.forEach((v) => {
    if (typeof c.base[v] !== 'number') p(`base.${v} missing`);
    if (typeof c.drift[v] !== 'number') p(`drift.${v} missing`);
  });
  if (!(c.decay > 0 && c.decay < 1)) p('decay should be between 0 and 1 stability points per second');

  /* ids unique within the case */
  const tids = new Set(), aids = new Set(), oids = new Set();
  for (const t of c.tests) {
    if (tids.has(t.id)) p(`duplicate test id ${t.id}`);
    tids.add(t.id);
    if (!(t.cost >= 0)) p(`test ${t.id} has a negative cost`);
    if (!(t.tat > 0)) p(`test ${t.id} has no turnaround time`);
    if (!t.name || !t.result) p(`test ${t.id} missing name or result`);
  }
  for (const a of c.actions) {
    if (aids.has(a.id)) p(`duplicate action id ${a.id}`);
    aids.add(a.id);
    if (!a.label || !a.msg) p(`action ${a.id} missing label or response`);
    if (!(a.factor > 0)) p(`action ${a.id} has a bad decay factor`);
  }
  for (const o of c.mgmt.options) {
    if (oids.has(o.id)) p(`duplicate management id ${o.id}`);
    oids.add(o.id);
    if (!o.label || !o.msg) p(`management option ${o.id} missing label or feedback`);
    if (!o.correct && !o.harm && !o.msg) p(`management option ${o.id} is neither correct nor harmful`);
  }

  /* internal references: a typo here silently disables a scripted deterioration */
  for (const [i, ev] of (c.events || []).entries()) {
    if (!(ev.at > 0)) p(`event ${i} has no time`);
    if (ev.at > c.timeLimitSec) p(`event ${i} fires after the clock ends`);
    if (!(ev.loss > 0)) p(`event ${i} has no stability loss`);
    if (!ev.msg) p(`event ${i} has no message`);
    for (const need of [].concat(ev.need || [])) {
      const [kind, ref] = String(need).split(':');
      if (kind === 'test' && !tids.has(ref)) p(`event ${i} waits on unknown test "${ref}"`);
      if (kind === 'action' && !aids.has(ref)) p(`event ${i} waits on unknown action "${ref}"`);
      if (kind !== 'test' && kind !== 'action') p(`event ${i} has a malformed requirement "${need}"`);
    }
  }

  /* content thresholds */
  if (c.tests.length < 8) p(`only ${c.tests.length} investigations (need 8+)`);
  if (c.actions.length < 6) p(`only ${c.actions.length} bedside actions (need 6+)`);
  const correct = c.mgmt.options.filter((o) => o.correct).length;
  const harmful = c.mgmt.options.filter((o) => o.harm).length;
  if (correct < 5) p(`only ${correct} correct management options (need 5+)`);
  if (harmful < 3) p(`only ${harmful} harmful options (need 3+)`);
  if (!c.tests.some((t) => t.flag === 'critical')) p('no investigation flagged critical');
  if (c.differentials.length < 6) p('differential list too short');

  /* every harmful management option should carry an explanation */
  for (const o of c.mgmt.options.filter((x) => x.harm)) {
    if (!o.msg || o.msg.length < 30) p(`harmful option ${o.id} has no teaching message`);
  }

  /* ----------------------------- balance ----------------------------- */
  const critCost = c.tests.filter((t) => t.flag === 'critical').reduce((s, t) => s + t.cost, 0);
  const allActionsCost = c.actions.reduce((s, a) => s + a.cost, 0);
  const goodActions = c.actions.filter((a) => !a.harm && a.factor < 1);
  const essential = critCost + goodActions.reduce((s, a) => s + a.cost, 0);
  const traps = c.actions.filter((a) => a.harm).reduce((s, a) => s + a.cost, 0);
  const allTests = c.tests.reduce((s, t) => s + t.cost, 0);
  const untreated = 100 / c.decay;
  const mul = goodActions.reduce((m, a) => m * a.factor, 1);
  const treated = 100 / (c.decay * Math.max(mul, 0.05));

  if (essential > c.budget) p(`essential path costs ${Math.round(essential)} but the budget is ${c.budget}`);
  if (critCost + allActionsCost > c.budget) {
    p(`the full action list (${Math.round(critCost + allActionsCost)}) does not fit the budget of ${c.budget} ` +
      '— some mistakes would be unaffordable');
  }
  if (untreated >= c.timeLimitSec) p('an untreated patient would survive past the clock — no time pressure');
  if (treated <= c.timeLimitSec) p('even good resuscitation cannot keep the patient alive to the clock');
  const goodActionsCost = goodActions.reduce((s, a) => s + a.cost, 0);
  if (allTests + goodActionsCost <= c.budget) {
    p(`the budget of ${c.budget} covers every investigation (${allTests}) plus the whole essential ` +
      'treatment — money never forces a choice');
  }
}

check('schema, references and content thresholds for every case', problems.length === 0,
  problems.slice(0, 6).join(' | '));
check('case ids are unique', ids.size === CASES.length, `${ids.size} unique of ${CASES.length}`);

/* --------------------------- library shape --------------------------- */
const byDiff = {};
CASES.forEach((c) => { byDiff[c.difficulty] = (byDiff[c.difficulty] || 0) + 1; });
const cats = new Set(CASES.map((c) => c.category));
check('at least a dozen cases', CASES.length >= 12, String(CASES.length));
check('all three difficulty bands populated', Object.keys(byDiff).length === 3, JSON.stringify(byDiff));
check('at least ten distinct specialties', cats.size >= 10, String(cats.size));
check('every case has a unique title', new Set(CASES.map((c) => c.title)).size === CASES.length);
check('every case has a unique canonical diagnosis',
  new Set(CASES.map((c) => c.dx.label)).size === CASES.length);

/* ------------------------------ summary ------------------------------ */
const pad = (s, n) => String(s).padEnd(n);
console.log('\n  ' + pad('case', 15) + pad('difficulty', 11) + pad('budget', 8) + pad('essential', 10) +
  pad('arrests@', 10) + pad('survives@', 10) + pad('tests', 7) + pad('actions', 8) + 'mgmt c/h');
for (const c of CASES) {
  const critCost = c.tests.filter((t) => t.flag === 'critical').reduce((s, t) => s + t.cost, 0);
  const good = c.actions.filter((a) => !a.harm && a.factor < 1);
  const essential = critCost + good.reduce((s, a) => s + a.cost, 0);
  const treated = 100 / (c.decay * Math.max(good.reduce((m, a) => m * a.factor, 1), 0.05));
  console.log('  ' + pad(c.id, 15) + pad(c.difficulty, 11) + pad(c.budget, 8) + pad(Math.round(essential), 10) +
    pad(Math.round(100 / c.decay) + 's', 10) + pad(Math.round(treated) + 's', 10) +
    pad(c.tests.length, 7) + pad(c.actions.length, 8) +
    `${c.mgmt.options.filter((o) => o.correct).length}/${c.mgmt.options.filter((o) => o.harm).length}`);
}
console.log(`\n  ${CASES.length} cases (${JSON.stringify(byDiff)}), ${cats.size} specialties, ` +
  `${CASES.reduce((s, c) => s + c.tests.length, 0)} investigations, ` +
  `${CASES.reduce((s, c) => s + c.mgmt.options.length, 0)} management options`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
