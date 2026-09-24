/* =========================================================================
   DocSim — game engine
   Real-time case clock, physiological deterioration model, lab queue,
   diagnosis matching, management grading, scoring and social sharing.
   ========================================================================= */
(function () {
  'use strict';

  /* ----------------------------- helpers ------------------------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const $CUR = '$';
  const money = (n) => $CUR + Math.round(n).toLocaleString('en-US');
  const mmss = (sec) => {
    sec = Math.max(0, Math.ceil(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  };
  const pct = (v) => Math.round(v) + '%';

  /* -------------------------- configuration ---------------------------- */
  const MAX_PENDING = 4;          // tests running at once
  const HINT_SECONDS = 25;        // time cost of a hint
  const HINT_POINTS = 40;         // score cost of a hint
  const WRONG_DX_POINTS = 60;

  const SCORE = { dx: 320, dxFirstTry: 60, mgmt: 420, outcome: 260, time: 180, budget: 160, efficiency: 120 };
  const MAX_SCORE = SCORE.dx + SCORE.dxFirstTry + SCORE.mgmt + SCORE.outcome
    + SCORE.time + SCORE.budget + SCORE.efficiency;

  const SERIES = [
    { key: 'hr', label: 'HR', unit: 'bpm', color: '#ff5b6e', range: [25, 190], dp: 0 },
    { key: 'sbp', label: 'SBP', unit: 'mmHg', color: '#4aa8ff', range: [40, 200], dp: 0 },
    { key: 'spo2', label: 'SpO2', unit: '%', color: '#2ee6c5', range: [55, 100], dp: 0 },
    { key: 'rr', label: 'RR', unit: '/min', color: '#ffb020', range: [5, 55], dp: 0 },
    { key: 'temp', label: 'Temp', unit: '\u00B0C', color: '#b98cff', range: [33, 42], dp: 1 },
    { key: 'gcs', label: 'GCS', unit: '', color: '#9fb3c2', range: [3, 15], dp: 0 }
  ];
  const SERIES_BY_KEY = {};
  SERIES.forEach((s) => { SERIES_BY_KEY[s.key] = s; });
  const PHYSIO_LIMITS = {
    hr: [18, 230], sbp: [20, 230], dbp: [8, 140], rr: [3, 70],
    spo2: [35, 100], temp: [30, 43], gcs: [3, 15]
  };
  const CAT_ORDER = ['Bedside', 'Bloods', 'Imaging', 'Microbiology', 'Special'];

  /* ------------------------------ state -------------------------------- */
  let S = null;                  // current case state
  let timer = null;              // interval handle
  let visibleSeries = { hr: true, sbp: true, spo2: true, rr: false, temp: false, gcs: false };
  let opts = { sound: true, hints: true, name: '' };
  let stats = { cases: {}, plays: 0, wins: 0, best: 0, total: 0 };

  /* ===================================================================== */
  /*  PERSISTENCE                                                          */
  /* ===================================================================== */
  const LS_STATS = 'docsim.stats.v1';
  const LS_OPTS = 'docsim.opts.v1';
  const LS_LEGACY = ['meditriage.stats.v1', 'meditriage.opts.v1'];   // pre-rename keys

  function loadStore() {
    try {
      const read = (key, legacy) => localStorage.getItem(key) || localStorage.getItem(legacy);
      const s = JSON.parse(read(LS_STATS, LS_LEGACY[0]) || 'null');
      if (s && typeof s === 'object') stats = Object.assign(stats, s);
      const o = JSON.parse(read(LS_OPTS, LS_LEGACY[1]) || 'null');
      if (o && typeof o === 'object') opts = Object.assign(opts, o);
    } catch (e) { /* first run or storage blocked — defaults are fine */ }
  }
  function saveStats() { try { localStorage.setItem(LS_STATS, JSON.stringify(stats)); } catch (e) {} }
  function saveOpts() { try { localStorage.setItem(LS_OPTS, JSON.stringify(opts)); } catch (e) {} }

  /* ===================================================================== */
  /*  SOUND                                                                */
  /* ===================================================================== */
  let actx = null;
  function audio() {
    if (!opts.sound) return null;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (e) { return null; }
  }
  function beep(freq, dur, type, gain) {
    const ac = audio(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(gain == null ? 0.06 : gain, ac.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (dur || 0.12));
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + (dur || 0.12) + 0.02);
  }
  const sfx = {
    click: () => beep(520, 0.05, 'square', 0.03),
    order: () => beep(760, 0.08, 'triangle', 0.05),
    result: () => { beep(880, 0.09, 'triangle', 0.05); setTimeout(() => beep(1180, 0.1, 'triangle', 0.05), 110); },
    good: () => { beep(660, 0.1, 'sine', 0.06); setTimeout(() => beep(990, 0.16, 'sine', 0.06), 120); },
    bad: () => { beep(220, 0.22, 'sawtooth', 0.05); },
    alarm: () => beep(440, 0.14, 'square', 0.05),
    flat: () => { beep(300, 0.5, 'sine', 0.06); setTimeout(() => beep(180, 0.9, 'sine', 0.05), 300); }
  };

  /* ===================================================================== */
  /*  TOASTS + LOG                                                         */
  /* ===================================================================== */
  function toast(msg, kind, ms) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' ' + kind : '');
    el.innerHTML = fmt(msg);
    box.appendChild(el);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; }, (ms || 4200) - 400);
    setTimeout(() => el.remove(), ms || 4200);
  }
  function log(msg, kind) {
    if (!S) return;
    S.log.push({ t: S.elapsed, msg, kind: kind || '' });
    const n = $('#log-count'); if (n) n.textContent = S.log.length;
    renderLog();
  }
  function renderLog() {
    const ul = $('#log-list'), end = $('#end-log');
    const html = (S ? S.log.slice().reverse() : []).map((e) =>
      `<li class="ev-${e.kind}"><span class="t">${mmss(e.t)}</span><span class="m">${fmt(e.msg)}</span></li>`).join('');
    if (ul) ul.innerHTML = html;
    if (end) end.innerHTML = html;
  }

  /* ===================================================================== */
  /*  START / HOME SCREEN                                                  */
  /* ===================================================================== */
  let caseFilter = 'all';

  function renderCaseList() {
    const list = $('#case-list');
    const cases = window.CASES.filter((c) => caseFilter === 'all' || c.difficulty === caseFilter);
    list.innerHTML = cases.map((c) => {
      const st = stats.cases[c.id] || {};
      const best = st.best ? `<span class="best">best ${st.best}</span>` : '<span class="best">not attempted</span>';
      return `<li class="case-item" data-case="${c.id}">
        <h3>${esc(c.title)}</h3>
        <span class="go">Play &rsaquo;</span>
        <span class="meta">
          <span class="pill pill-diff ${c.difficulty}">${esc(c.difficulty)}</span>
          <span>${mmss(c.timeLimitSec)}</span><span>${money(c.budget)}</span>${best}
        </span>
      </li>`;
    }).join('') || '<li class="muted">No cases in this category.</li>';
  }

  function renderCareer() {
    const st = $('#career-stats');
    const played = stats.plays || 0;
    const wins = stats.wins || 0;
    const rate = played ? Math.round((wins / played) * 100) : 0;
    st.innerHTML = `
      <div class="stat"><div class="k">Cases played</div><div class="v">${played}</div></div>
      <div class="stat"><div class="k">Patients saved</div><div class="v">${wins}</div></div>
      <div class="stat"><div class="k">Success rate</div><div class="v">${rate}%</div></div>
      <div class="stat"><div class="k">Best score</div><div class="v">${stats.best || 0}</div></div>`;
  }

  function showScreen(id) {
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.id === id));
    window.scrollTo(0, 0);
  }

  /* ===================================================================== */
  /*  CASE LIFECYCLE                                                       */
  /* ===================================================================== */
  function newState(cs) {
    const vitals = Object.assign({}, cs.base);
    return {
      cs,
      elapsed: 0,
      lastTick: performance.now(),
      remaining: cs.timeLimitSec,
      spent: 0,
      stability: 100,
      decayMul: 1,
      recovering: false,
      vitals,
      samples: [],
      lastSample: -99,
      tests: {},        // id -> {status:'pending'|'done', readyAt, result}
      actions: {},      // id -> true
      pending: [],
      firedEvents: {},
      log: [],
      dxSolved: false,
      dxTries: 0,
      dxWrong: 0,
      mgmtTries: 0,
      mgmtGrade: 0,
      mgmtSolved: false,
      hints: 0,
      lastAlarmSec: -99,
      lastLifeAlarm: -99,
      lastVitalsRender: -99,
      lastRenderStab: null,
      running: true,
      outcome: null
    };
  }

  function startCase(caseId) {
    const cs = window.CASES.find((c) => c.id === caseId);
    if (!cs) return;
    S = newState(cs);
    rxSelected = {};

    // header / static content
    // the specialty is withheld until the case is closed, so the diagnosis has to be discovered
    const caseNo = window.CASES.findIndex((c) => c.id === cs.id) + 1;
    $('#hud-cat').textContent = `Case ${caseNo} of ${window.CASES.length}`;
    const d = $('#hud-diff');
    d.textContent = cs.difficulty;
    d.className = 'pill pill-diff ' + cs.difficulty;
    $('#case-title').textContent = cs.title;
    $('#case-blurb').textContent = cs.blurb;
    $('#case-who').textContent = cs.who;
    $('#case-history').innerHTML = cs.history.map((h) => `<li>${esc(h)}</li>`).join('');
    $('#case-exam').innerHTML = cs.exam.map((h) => `<li>${fmt(h)}</li>`).join('');
    $('#dx-options').innerHTML = shuffle(cs.differentials.slice())
      .map((x) => `<option value="${esc(x)}"></option>`).join('');
    $('#dx-input').value = '';
    $('#dx-attempts').innerHTML = '';
    $('#dx-confirmed').hidden = true;
    $('#rx-feedback').innerHTML = '';
    $('#rx-list').innerHTML = '';
    $('#rx-locked').hidden = false;
    $('#rx-open').hidden = true;
    // controls that may have been left in a finished state by a previous case
    const rxBtn = $('#btn-rx');
    rxBtn.disabled = false;
    rxBtn.textContent = 'Give treatment';
    $('#rx-hint').textContent = '';
    $$('.hintline').forEach((el) => el.remove());
    $('#toasts').innerHTML = '';
    $$('#tabs .tab').forEach((t) => t.classList.remove('is-locked'));
    $$('#tabs .tab').forEach((t) => t.classList.toggle('is-on', t.dataset.tab === 'patient'));
    $$('.pane').forEach((p) => { p.hidden = p.dataset.pane !== 'patient'; });
    $('#hint-count').textContent = opts.hints ? cs.hints.length : 0;
    $('#test-count').textContent = '0';
    $('#log-count').textContent = '0';
    $('#alarm').hidden = true;

    renderSeriesToggles();
    renderTests();
    renderActions();
    renderPendingList();
    updateVitals(true);
    renderChart();
    updateHud();
    renderLog();

    showScreen('screen-play');
    const gate = $('#gate');
    if (gate) {
      gate.hidden = false;
      $('#gate-title').textContent = cs.title;
      $('#gate-meta').innerHTML = `<span class="pill pill-diff ${cs.difficulty}">${esc(cs.difficulty)}</span>
        <span>${mmss(cs.timeLimitSec)} on the clock</span><span>${money(cs.budget)} budget</span>`;
    }
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 100);
  }

  function beginClock() {
    const gate = $('#gate');
    if (gate) gate.hidden = true;
    if (!S) return;
    S.lastTick = performance.now();
    log('Case opened. Clock started — the patient will not wait.', 'act');
    toast('The clock is running. Read the history, then resuscitate.', 'warn', 5000);
    audio();
  }

  function endCase(outcome) {
    if (!S || S.outcome) return;
    S.outcome = outcome;
    S.running = false;
    if (timer) { clearInterval(timer); timer = null; }
    $('#alarm').hidden = true;
    if (outcome === 'died') sfx.flat();
    computeAndShowResults(outcome);
  }

  /* ------------------------------- ticking ----------------------------- */
  function tick() {
    if (!S || !S.running) return;
    const now = performance.now();
    let dt = (now - S.lastTick) / 1000;
    S.lastTick = now;
    if (dt <= 0) return;
    if (dt > 120) dt = 120;              // absurd gaps (device sleep) are capped
    S.elapsed += dt;
    S.remaining = Math.max(0, S.cs.timeLimitSec - S.elapsed);

    /* lab queue */
    let queueChanged = false;
    S.pending.slice().forEach((id) => {
      const st = S.tests[id];
      if (st.status === 'pending' && S.elapsed >= st.readyAt) {
        st.status = 'done';
        queueChanged = true;
        const t = testById(id);
        if (t.factor && t.factor !== 1) S.decayMul *= t.factor;
        if (t.harm) {
          S.decayMul *= 1.15;
          S.stability = clamp(S.stability - 4, 0, 100);
          log('**' + t.name + '**: ' + t.harm, 'alarm');
          toast('**' + t.name + '** — ' + t.harm, 'bad', 6000);
          sfx.bad();
        } else {
          log('**' + t.name + '** reported: ' + t.result, t.flag === 'critical' ? 'good' : 'test');
          toast('**' + t.name + '** result available', t.flag === 'critical' ? 'good' : '', 3800);
          if (t.flag === 'critical') sfx.result();
        }
      }
    });
    if (queueChanged) {
      S.pending = S.pending.filter((id) => S.tests[id].status === 'pending');
      renderTests();
      renderPendingList();
      updateCountdowns();
    }

    /* physiological decay / recovery */
    if (S.recovering) {
      S.stability = clamp(S.stability + 1.6 * dt, 0, 100);
      if (S.stability >= 100) { endCase('recovered'); return; }
    } else {
      S.stability = clamp(S.stability - S.cs.decay * S.decayMul * dt, 0, 100);
    }

    /* scripted deteriorations */
    (S.cs.events || []).forEach((ev, i) => {
      if (S.firedEvents[i]) return;
      if (S.elapsed >= ev.at && !hasRequirement(ev.need)) {
        S.firedEvents[i] = true;
        S.stability = clamp(S.stability - ev.loss, 0, 100);
        log(ev.msg, 'alarm');
        toast(ev.msg, 'bad', 6000);
        sfx.bad();
      }
    });

    /* charts + readouts */
    if (S.elapsed - S.lastSample >= 3) { S.lastSample = S.elapsed; sampleVitals(); }
    updateVitals();
    if (S.pending.length) updateCountdowns();
    updateHud();

    /* alarms */
    const secLeft = Math.floor(S.remaining);
    if (secLeft <= 60 && secLeft > 0 && secLeft % 10 === 0 && secLeft !== S.lastAlarmSec) {
      S.lastAlarmSec = secLeft; sfx.alarm();
      log('**' + mmss(secLeft) + ' remaining.**', 'alarm');
    }
    if (S.stability <= 30 && S.stability > 0) {
      if (Math.floor(S.elapsed) % 8 === 0 && Math.floor(S.elapsed) !== S.lastLifeAlarm) {
        S.lastLifeAlarm = Math.floor(S.elapsed); sfx.alarm();
      }
      $('#alarm').hidden = S.stability > 25;
    } else {
      $('#alarm').hidden = true;
    }

    /* endings */
    if (S.stability <= 0) {
      log('**Cardiac arrest.** Asystole on the monitor. Resuscitation attempted — the patient did not respond.', 'alarm');
      endCase('died');
      return;
    }
    if (S.remaining <= 0) {
      if (S.recovering && S.stability >= 80) {
        S.lateSave = true;
        log('**The clock ran out mid-treatment** — but the correct management was already working and the patient is stable enough to survive transfer.', 'alarm');
        endCase('recovered');
        return;
      }
      log('**Time expired.** The case is closed with the patient still undiagnosed or unstable.', 'alarm');
      endCase('timeout');
      return;
    }
  }

  function hasRequirement(need) {
    if (!need) return true;
    if (Array.isArray(need)) return need.every(hasRequirement);
    const parts = String(need).split(':');
    if (parts[0] === 'test') return !!(S.tests[parts[1]] && S.tests[parts[1]].status === 'done');
    if (parts[0] === 'action') return !!S.actions[parts[1]];
    return false;
  }
  const testById = (id) => S.cs.tests.find((t) => t.id === id);

  /* ===================================================================== */
  /*  PHYSIOLOGY                                                           */
  /* ===================================================================== */
  function computeVitals() {
    const inst = 100 - S.stability;
    const v = {};
    Object.keys(S.cs.base).forEach((k) => {
      const drift = (S.cs.drift && S.cs.drift[k]) || 0;
      const lim = PHYSIO_LIMITS[k] || [-1e9, 1e9];
      v[k] = clamp(S.cs.base[k] + drift * inst, lim[0], lim[1]);
    });
    return v;
  }
  function sampleVitals() {
    S.vitals = computeVitals();
    S.samples.push(Object.assign({ t: S.elapsed }, S.vitals));
    renderChart();
  }
  function updateVitals(force) {
    S.vitals = computeVitals();
    const jump = Math.abs(S.stability - (S.lastRenderStab == null ? -999 : S.lastRenderStab)) >= 1.2;
    if (force || jump || S.elapsed - S.lastVitalsRender > 0.5) {
      S.lastVitalsRender = S.elapsed;
      S.lastRenderStab = S.stability;
      renderVitals();
    }
  }

  function vitalClass(key) {
    const v = S.vitals;
    switch (key) {
      case 'hr': return v.hr >= 130 || v.hr <= 50 ? 'v-crit' : (v.hr > 100 || v.hr < 60 ? 'v-warn' : 'v-ok');
      case 'bp': return v.sbp < 90 ? 'v-crit' : (v.sbp < 100 ? 'v-warn' : 'v-ok');
      case 'rr': return v.rr > 30 || v.rr < 8 ? 'v-crit' : (v.rr > 20 || v.rr < 12 ? 'v-warn' : 'v-ok');
      case 'spo2': return v.spo2 < 90 ? 'v-crit' : (v.spo2 < 94 ? 'v-warn' : 'v-ok');
      case 'temp': return v.temp >= 39 || v.temp < 36 ? 'v-crit' : (v.temp > 37.5 ? 'v-warn' : 'v-ok');
      case 'gcs': return v.gcs <= 12 ? 'v-crit' : (v.gcs < 15 ? 'v-warn' : 'v-ok');
      default: return 'v-ok';
    }
  }

  function renderVitals() {
    const v = S.vitals;
    const rows = [
      ['hr', 'Pulse', Math.round(v.hr), 'bpm'],
      ['bp', 'Blood pressure', Math.round(v.sbp) + '/' + Math.round(v.dbp), 'mmHg'],
      ['rr', 'Resp rate', Math.round(v.rr), '/min'],
      ['spo2', 'SpO2', Math.round(v.spo2), '%'],
      ['temp', 'Temp', v.temp.toFixed(1), '\u00B0C'],
      ['gcs', 'GCS', Math.round(v.gcs), '/15']
    ];
    $('#vitals-grid').innerHTML = rows.map(([k, label, val, unit]) =>
      `<div class="vital ${vitalClass(k)}"><div class="k">${label}</div>
       <div class="v">${val}<span class="u">${unit}</span></div></div>`).join('');
  }

  function renderSeriesToggles() {
    $('#series-toggles').innerHTML = SERIES.map((s) =>
      `<button type="button" class="stog${visibleSeries[s.key] ? ' is-on' : ''}" data-series="${s.key}">${s.label}</button>`).join('');
  }

  /* -------------------------------- chart ------------------------------ */
  function renderChart() {
    const svg = $('#chart');
    const W = 600, H = 240, L = 8, R = 46, T = 12, B = 20;
    const iw = W - L - R, ih = H - T - B;
    const limit = S.cs.timeLimitSec;
    const x = (t) => L + (clamp(t, 0, limit) / limit) * iw;
    const y = (v, s) => T + ih - ((clamp(v, s.range[0], s.range[1]) - s.range[0]) / (s.range[1] - s.range[0])) * ih;

    let g = '';
    // vertical gridlines each minute
    for (let m = 0; m <= limit / 60; m++) {
      const gx = x(m * 60);
      g += `<line x1="${gx.toFixed(1)}" y1="${T}" x2="${gx.toFixed(1)}" y2="${T + ih}" stroke="#1b2b38" stroke-width="0.6"/>`;
      g += `<text x="${(gx + 2).toFixed(1)}" y="${H - 5}" fill="#43596b" font-size="10" font-family="monospace">${m}m</text>`;
    }
    for (let i = 1; i < 4; i++) {
      const gy = T + (ih / 4) * i;
      g += `<line x1="${L}" y1="${gy.toFixed(1)}" x2="${L + iw}" y2="${gy.toFixed(1)}" stroke="#16242f" stroke-width="0.6"/>`;
    }
    // deterioration markers
    Object.keys(S.firedEvents).forEach((i) => {
      const ev = S.cs.events[i];
      const gx = x(ev.at);
      g += `<line x1="${gx.toFixed(1)}" y1="${T}" x2="${gx.toFixed(1)}" y2="${T + ih}" stroke="#ff4d5e" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/>`;
    });

    // series
    let last = S.samples.length ? S.samples[S.samples.length - 1] : Object.assign({ t: 0 }, S.vitals);
    const pts = S.samples.concat([Object.assign({ t: S.elapsed }, S.vitals)]);
    const step = Math.max(1, Math.ceil(pts.length / 200));
    SERIES.forEach((s) => {
      if (!visibleSeries[s.key]) return;
      const d = [];
      for (let i = 0; i < pts.length; i += step) {
        d.push((i === 0 ? 'M' : 'L') + x(pts[i].t).toFixed(1) + ' ' + y(pts[i][s.key], s).toFixed(1));
      }
      if (d.length === 1) d.push('L' + x(S.elapsed).toFixed(1) + ' ' + y(last[s.key], s).toFixed(1));
      g += `<path d="${d.join(' ')}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>`;
      // current value dot + label
      const vy = y(last[s.key], s);
      const val = s.dp ? Number(last[s.key]).toFixed(s.dp) : Math.round(last[s.key]);
      g += `<circle cx="${x(S.elapsed).toFixed(1)}" cy="${vy.toFixed(1)}" r="2.6" fill="${s.color}"/>`;
      g += `<text x="${(L + iw + 4).toFixed(1)}" y="${clamp(vy + 3, T + 8, T + ih).toFixed(1)}" fill="${s.color}" font-size="11" font-family="monospace">${val}</text>`;
    });
    svg.innerHTML = g;
    svg.setAttribute('aria-label', 'Vital signs trend: pulse ' + Math.round(S.vitals.hr) +
      ', systolic ' + Math.round(S.vitals.sbp) + ', saturation ' + Math.round(S.vitals.spo2) + ' percent');
  }

  /* ===================================================================== */
  /*  HUD                                                                  */
  /* ===================================================================== */
  function updateHud() {
    if (!S) return;
    const st = S.stability;
    $('#time-left').textContent = mmss(S.remaining);
    $('#cash-left').textContent = money(S.cs.budget - S.spent);
    $('#money-inline').textContent = money(S.cs.budget - S.spent);
    $('#life-value').textContent = pct(st);
    $('#time-bar').style.width = (S.remaining / S.cs.timeLimitSec * 100) + '%';
    $('#cash-bar').style.width = ((S.cs.budget - S.spent) / S.cs.budget * 100) + '%';
    $('#life-bar').style.width = st + '%';

    const gt = $('#gauge-time');
    gt.classList.toggle('is-warn', S.remaining <= 120 && S.remaining > 60);
    gt.classList.toggle('is-crit', S.remaining <= 60);
    $('#gauge-time').classList.toggle('is-crit', S.remaining <= 60);

    const gl = $('.gauge-life');
    gl.classList.toggle('is-warn', st <= 55 && st > 30);
    gl.classList.toggle('is-crit', st <= 30);
  }
  function updateCountdowns() {
    if (!S) return;
    $$('[data-cd]').forEach((el) => {
      const st = S.tests[el.dataset.cd];
      if (!st || st.status !== 'pending') return;
      el.textContent = mmss(Math.max(0, st.readyAt - S.elapsed));
    });
  }

  /* ===================================================================== */
  /*  ACTIONS PANE                                                         */
  /* ===================================================================== */
  function renderActions() {
    $('#actions-list').innerHTML = S.cs.actions.map((a) => {
      const done = !!S.actions[a.id];
      return `<div class="entry ${done ? 'is-done' : ''}" data-act="${a.id}">
        <div class="entry-top">
          <span class="entry-name">${esc(a.label)}</span>
          ${done ? '<span class="status reported">done</span>' : ''}
        </div>
        <div class="entry-sub"><span>${esc(a.sub || '')}</span>
          <span class="entry-cost">${a.cost ? money(a.cost) : 'free'}</span>
          <span class="entry-tat">${a.tat || 0}s at the bedside</span>
        </div>
        ${done ? '' : `<div class="entry-actions">
          <button class="btn btn-sm" type="button" data-doact="${a.id}"
            ${a.cost > S.cs.budget - S.spent ? 'disabled' : ''}>Do it</button>
          ${a.cost > S.cs.budget - S.spent ? '<span class="status blocked">no funds</span>' : ''}
        </div>`}
      </div>`;
    }).join('');
  }

  function doAction(id) {
    if (!S || !S.running) return;
    const a = S.cs.actions.find((x) => x.id === id);
    if (!a || S.actions[id]) return;
    if (a.cost > S.cs.budget - S.spent) { toast('Not enough budget for ' + a.label + '.', 'bad'); return; }

    S.spent += a.cost;
    S.actions[id] = true;
    S.elapsed += a.tat || 0;              // bedside time passes
    S.remaining = Math.max(0, S.cs.timeLimitSec - S.elapsed);

    if (a.factor && a.factor !== 1) S.decayMul = clamp(S.decayMul * a.factor, 0.05, 6);
    if (a.harm) {
      S.stability = clamp(S.stability - 5, 0, 100);
      log('**' + a.label + '** — ' + a.msg, 'alarm');
      toast('**' + a.label + '** ' + a.msg, 'bad', 6000);
      sfx.bad();
    } else {
      log('**' + a.label + '** — ' + a.msg, 'act');
      toast('**' + a.label + '** ' + a.msg, a.factor < 0.8 ? 'good' : '', 4600);
      sfx.good();
    }
    renderActions();
    renderTests();
    updateHud();
  }

  /* ===================================================================== */
  /*  TESTS PANE                                                           */
  /* ===================================================================== */
  function renderTests() {
    if (!S) return;
    const groups = {};
    S.cs.tests.forEach((t) => { (groups[t.cat] = groups[t.cat] || []).push(t); });
    const cats = CAT_ORDER.filter((c) => groups[c]).concat(Object.keys(groups).filter((c) => CAT_ORDER.indexOf(c) < 0));
    $('#tests-list').innerHTML = cats.map((cat) => `
      <h3>${esc(cat)}</h3>
      ${groups[cat].map(testCard).join('')}`).join('');
    $('#test-count').textContent = Object.keys(S.tests).filter((id) => S.tests[id].status === 'done').length;
  }

  function testCard(t) {
    const st = S.tests[t.id];
    const done = st && st.status === 'done';
    const pending = st && st.status === 'pending';
    const afford = t.cost <= S.cs.budget - S.spent;
    const queued = S.pending.length >= MAX_PENDING;
    let status = '';
    if (done) status = `<span class="status reported">reported</span>`;
    else if (pending) status = `<span class="status queued">in lab</span> <span class="countdown" data-cd="${t.id}">${mmss(st.readyAt - S.elapsed)}</span>`;
    else if (!afford) status = '<span class="status blocked">no funds</span>';
    else if (queued) status = '<span class="status blocked">queue full</span>';

    return `<div class="entry ${done ? 'is-done' : ''}" data-test="${t.id}">
      <div class="entry-top">
        <span class="entry-name">${esc(t.name)}</span>${status}
      </div>
      <div class="entry-sub">
        <span class="entry-cost">${money(t.cost)}</span>
        <span class="entry-tat">result in ${t.tat}s</span>
        <span>${esc(t.cat)}</span>
      </div>
      ${done ? `<div class="entry-result ${t.flag === 'critical' ? 'abnormal' : t.flag}">${fmt(t.result)}</div>` : ''}
      ${!done && !pending ? `<div class="entry-actions">
        <button class="btn btn-sm" type="button" data-ordertest="${t.id}" ${(!afford || queued) ? 'disabled' : ''}>Order &middot; ${money(t.cost)}</button>
      </div>` : ''}
      ${pending ? '<div class="entry-actions"><span class="muted">Processing — the patient keeps deteriorating while you wait.</span></div>' : ''}
    </div>`;
  }

  function orderTest(id) {
    if (!S || !S.running) return;
    const t = testById(id);
    if (!t || S.tests[id]) return;
    if (t.cost > S.cs.budget - S.spent) { toast('Budget cannot stretch to ' + t.name + '. Choose more carefully.', 'bad'); return; }
    if (S.pending.length >= MAX_PENDING) { toast('The lab queue is full (4 tests). Wait for a result.', 'warn'); return; }

    S.spent += t.cost;
    S.tests[id] = { status: 'pending', readyAt: S.elapsed + t.tat };
    S.pending.push(id);
    log('Ordered **' + t.name + '** (' + money(t.cost) + ', result in ' + t.tat + 's).', 'test');
    sfx.order();
    renderTests();
    renderPendingList();
    updateHud();
    renderActions();
  }

  function renderPendingList() {
    if (!S) return;
    const items = S.cs.tests.filter((t) => S.tests[t.id]);
    $('#pending-count').textContent = items.filter((t) => S.tests[t.id].status === 'pending').length;
    $('#pending-list').innerHTML = items.length ? items.map((t) => {
      const st = S.tests[t.id];
      return `<div class="pending"><span>${esc(t.name)}</span>
        ${st.status === 'pending'
          ? `<span class="countdown" data-cd="${t.id}">${mmss(st.readyAt - S.elapsed)}</span>`
          : '<span class="status reported">reported</span>'}</div>`;
    }).join('') : '<p class="muted">Nothing ordered yet. Every test costs money and time.</p>';
  }

  /* ===================================================================== */
  /*  DIAGNOSIS                                                            */
  /* ===================================================================== */
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/haemo/g, 'hemo').replace(/aemia/g, 'emia').replace(/oedema/g, 'edema')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\b(acute|severe|suspected|probable|possible|likely|the|a|an|of|with|and|due|to|secondary|patient|has|have|is|my|this|diagnosis|dx)\b/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      const t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }
  const similarity = (a, b) => 1 - lev(a, b) / Math.max(a.length, b.length, 1);
  const SHORT_OK = ['pe', 'mi', 'dka', 'tb', 'itp', 'hhs', 'aki', 'dvt'];

  // word-boundary match for single words, substring for phrases
  function containsWord(g, phrase) {
    const p = normalize(phrase);
    if (!p) return false;
    if (p.indexOf(' ') >= 0) return g.indexOf(p) >= 0;
    return (' ' + g + ' ').indexOf(' ' + p + ' ') >= 0;
  }

  /* Pure matcher: any token in a reject row means the answer is a different diagnosis. */
  function matchDiagnosisFor(dx, guess) {
    const g = normalize(guess);
    if (!g) return { ok: false, msg: 'Type a diagnosis before confirming.' };
    for (const r of dx.reject || []) {
      for (const tok of r.m) {
        if (containsWord(g, tok)) return { ok: false, msg: r.msg };
      }
    }
    const accepts = dx.accept.map((a) => ({ raw: a, n: normalize(a) }));
    for (const a of accepts) if (a.n === g) return { ok: true };
    const gWords = g.split(' ');
    for (const a of accepts) {
      const toks = a.n.split(' ').filter((t) => t.length >= 4 || SHORT_OK.indexOf(t) >= 0);
      if (toks.length && toks.every((t) => gWords.indexOf(t) >= 0)) return { ok: true };
    }
    for (const a of accepts) if (similarity(g, a.n) >= 0.87) return { ok: true };
    // typo tolerance: every significant word of the accepted phrase must appear
    // among the words of the guess, allowing a couple of mistyped characters.
    // Short distinguishing words are kept: dropping them is how "bronchiectasis
    // exacerbation" used to pass for "acute exacerbation of COPD".
    for (const a of accepts) {
      const toks = a.n.split(' ').filter((t) => t.length >= 3 || SHORT_OK.indexOf(t) >= 0);
      if (toks.length && toks.every((t) => gWords.some((w) => w === t || similarity(w, t) >= 0.8))) {
        return { ok: true };
      }
    }
    return {
      ok: false,
      msg: 'That is not the diagnosis this patient has. Re-examine the findings you have already paid for.'
    };
  }

  function matchDiagnosis(guess) { return matchDiagnosisFor(S.cs.dx, guess); }

  function submitDiagnosis(text) {
    if (!S || !S.running) return;
    if (S.dxSolved) return;
    const res = matchDiagnosis(text);
    S.dxTries++;
    const box = $('#dx-attempts');
    if (res.ok) {
      S.dxSolved = true;
      log('**Diagnosis committed: ' + S.cs.dx.label + '.** ' + S.cs.dx.why, 'dx');
      sfx.good();
      $('#dx-confirmed').hidden = false;
      $('#dx-confirmed').innerHTML = `<b>Correct.</b> ${esc(S.cs.dx.label)}.<br><span class="muted">${esc(S.cs.dx.why)}</span>`;
      unlockTreat();
      toast('Diagnosis correct. Definitive treatment is now unlocked.', 'good', 5000);
    } else {
      S.dxWrong++;
      const clean = String(text).replace(/\*/g, '');
      S.elapsed += S.cs.dx.penaltySec;
      S.remaining = Math.max(0, S.cs.timeLimitSec - S.elapsed);
      S.stability = clamp(S.stability - S.cs.dx.penaltyStab, 0, 100);
      log('**Wrong diagnosis: "' + clean.slice(0, 60) + '".** ' + (res.msg || '') +
        ' (-' + S.cs.dx.penaltySec + 's and -' + S.cs.dx.penaltyStab + '% stability.)', 'alarm');
      toast((res.msg || 'Incorrect.') + ' **-' + S.cs.dx.penaltySec + ' seconds**', 'bad', 5200);
      sfx.bad();
      updateHud();
    }
    box.insertAdjacentHTML('afterbegin',
      `<div class="verdict ${res.ok ? 'verdict-good' : 'verdict-bad'}">
        <b>${res.ok ? 'Correct' : 'Incorrect'}:</b> ${esc(String(text).slice(0, 90))}
        ${res.ok ? '' : '<br><span class="muted">' + esc(res.msg || '') + '</span>'}
      </div>`);
    $('#dx-input').value = '';
  }

  function unlockTreat() {
    $('#rx-locked').hidden = true;
    $('#rx-open').hidden = false;
    $$('#tabs .tab').forEach((t) => t.classList.remove('is-locked'));
    renderRx();
    switchTab('rx');
  }

  /* ===================================================================== */
  /*  MANAGEMENT                                                           */
  /* ===================================================================== */
  let rxSelected = {};

  function renderRx() {
    if (!S) return;
    const opts2 = S.cs.mgmt.options;
    $('#rx-list').innerHTML = opts2.map((o) => `
      <label class="entry stack-check ${rxSelected[o.id] ? 'is-picked' : ''}" data-rx="${o.id}">
        <input type="checkbox" data-rxbox="${o.id}" ${rxSelected[o.id] ? 'checked' : ''}>
        <span class="entry-name">${esc(o.label)}</span>
      </label>`).join('');
    const n = Object.keys(rxSelected).filter((k) => rxSelected[k]).length;
    $('#rx-hint').textContent = n + ' of ' + opts2.length + ' measures selected';
  }

  function submitManagement() {
    if (!S || !S.running || !S.dxSolved) return;
    const os = S.cs.mgmt.options;
    const correctIds = os.filter((o) => o.correct).map((o) => o.id);
    const picked = Object.keys(rxSelected).filter((k) => rxSelected[k]);
    if (!picked.length) { toast('Select the measures you want to give.', 'warn'); return; }

    const hits = picked.filter((id) => correctIds.indexOf(id) >= 0);
    const harmful = picked.filter((id) => (os.find((o) => o.id === id) || {}).harm);
    const wrong = picked.filter((id) => correctIds.indexOf(id) < 0 && harmful.indexOf(id) < 0);
    const missed = correctIds.filter((id) => picked.indexOf(id) < 0);
    const grade = clamp((hits.length - 1.5 * harmful.length - 0.5 * wrong.length) / correctIds.length, 0, 1);

    S.mgmtTries++;
    S.mgmtGrade = Math.max(S.mgmtGrade, grade);
    S.elapsed += S.cs.mgmt.timeSec;
    S.remaining = Math.max(0, S.cs.timeLimitSec - S.elapsed);

    if (harmful.length) {
      const loss = 6 * harmful.length;
      S.stability = clamp(S.stability - loss, 0, 100);
      S.decayMul = clamp(S.decayMul * (1 + 0.3 * harmful.length), 0.05, 6);
      log('**Harmful treatment given** (' + harmful.length + ' measures) — stability fell by ' + loss + '%.', 'alarm');
      toast('Harmful measures given: the patient deteriorated.', 'bad', 5000);
      sfx.bad();
    }
    if (grade >= 0.75 && !S.recovering) {
      S.recovering = true;
      S.decayMul = 0.05;
      log('**Definitive treatment working.** The patient is stabilising and starting to improve.', 'good');
      toast('Treatment is working — the patient is stabilising.', 'good', 5000);
      sfx.good();
    } else if (grade > 0) {
      S.decayMul = clamp(S.decayMul * (grade >= 0.5 ? 0.6 : 0.85), 0.05, 6);
      log('Partial treatment (' + Math.round(grade * 100) + '% of the essential bundle). The patient is still deteriorating.', 'test');
      toast('Partial treatment only — ' + Math.round(grade * 100) + '% of what is needed.', 'warn', 5000);
    }

    const feedback = [];
    os.forEach((o) => {
      const wasPicked = picked.indexOf(o.id) >= 0;
      let cls = '';
      let note = '';
      if (o.correct && wasPicked) { cls = 'opt-correct'; note = 'Needed and given. ' + o.msg; }
      else if (o.correct && !wasPicked) { cls = 'opt-missed'; note = 'MISSED — ' + o.msg; }
      else if (!o.correct && wasPicked) { cls = 'opt-wrong'; note = 'GIVEN BUT WRONG — ' + o.msg; }
      else return;
      feedback.push(`<div class="entry ${cls}"><span class="entry-name">${esc(o.label)}</span>
        <div class="entry-result">${esc(note)}</div></div>`);
    });
    $('#rx-feedback').innerHTML =
      `<h3>Feedback — ${hits.length}/${correctIds.length} essential measures, ${harmful.length} harmful</h3>` +
      feedback.join('');

    log('Treatment given: ' + hits.length + '/' + correctIds.length + ' essential measures' +
      (harmful.length ? ', ' + harmful.length + ' harmful' : '') + '.', 'act');
    updateHud();

    if (grade >= 0.75) {
      setTimeout(() => {
        if (S && S.running && S.stability >= 100) endCase('recovered');
      }, 50);
      $('#btn-rx').disabled = true;
      $('#btn-rx').textContent = 'Treatment given';
    } else {
      $('#btn-rx').disabled = S.mgmtTries >= 3;
      $('#btn-rx').textContent = S.mgmtTries >= 3 ? 'No further attempts' : 'Give further treatment';
    }
  }

  /* ===================================================================== */
  /*  HINTS                                                                */
  /* ===================================================================== */
  function useHint() {
    if (!S || !S.running) return;
    if (!opts.hints) { toast('Hints are disabled in settings.', 'warn'); return; }
    if (S.hints >= S.cs.hints.length) { toast('No hints left for this case.', 'warn'); return; }
    const text = S.cs.hints[S.hints];
    S.hints++;
    S.elapsed += HINT_SECONDS;
    S.remaining = Math.max(0, S.cs.timeLimitSec - S.elapsed);
    $('#hint-count').textContent = Math.max(0, S.cs.hints.length - S.hints);
    log('**Hint (-' + HINT_SECONDS + 's):** ' + text, 'act');
    toast('**Hint:** ' + text, 'warn', 7000);
    const pane = $('.pane[data-pane="patient"]');
    if (pane) pane.insertAdjacentHTML('afterbegin', `<div class="hintline">${esc(text)}</div>`);
    updateHud();
  }

  /* ===================================================================== */
  /*  RESULTS + SCORING                                                    */
  /* ===================================================================== */
  function computeScore(outcome) {
    const cs = S.cs;
    const correctIds = cs.mgmt.options.filter((o) => o.correct).map((o) => o.id);
    const critCount = cs.tests.filter((t) => t.flag === 'critical').length;
    const par = critCount + 2;
    const ordered = Object.keys(S.tests).length;

    const dxPts = S.dxSolved ? SCORE.dx : 0;
    const firstTry = (S.dxSolved && S.dxWrong === 0) ? SCORE.dxFirstTry : 0;
    const mgmtPts = Math.round(SCORE.mgmt * S.mgmtGrade);
    let outcomePts = 0;
    if (outcome === 'recovered' && S.stability >= 100) outcomePts = SCORE.outcome;
    else if (S.stability >= 70) outcomePts = Math.round(SCORE.outcome * 0.58);
    else if (S.stability > 0) outcomePts = Math.round(SCORE.outcome * 0.22);
    const timePts = Math.round(SCORE.time * clamp(S.remaining / cs.timeLimitSec, 0, 1));
    const budgetPts = Math.round(SCORE.budget * clamp((cs.budget - S.spent) / cs.budget, 0, 1));
    const effPts = ordered ? Math.round(SCORE.efficiency * clamp(par / ordered, 0, 1)) : 0;
    const penalties = S.hints * HINT_POINTS + S.dxWrong * WRONG_DX_POINTS;

    const total = Math.max(0, dxPts + firstTry + mgmtPts + outcomePts + timePts + budgetPts + effPts - penalties);
    return {
      dxPts, firstTry, mgmtPts, outcomePts, timePts, budgetPts, effPts, penalties, total,
      ordered, par, correctCount: correctIds.length
    };
  }

  function rankFor(total) {
    if (total >= 1380) return { rank: 'Consultant', note: 'Outstanding — right diagnosis, right treatment, fast and economical.' };
    if (total >= 1200) return { rank: 'Registrar', note: 'Safe and correct; a little time or money was wasted along the way.' };
    if (total >= 950) return { rank: 'Senior House Officer', note: 'The patient survived, but the pathway cost more than it needed to.' };
    if (total >= 650) return { rank: 'Intern', note: 'You got there — eventually, and at a price.' };
    if (total >= 350) return { rank: 'Medical student', note: 'The patient survived despite the pathway, not because of it.' };
    return { rank: 'Needs revision', note: 'Read the debrief and run the case again.' };
  }

  let lastResult = null;

  function computeAndShowResults(outcome) {
    const sc = computeScore(outcome);
    const { rank, note } = rankFor(sc.total);
    const cs = S.cs;
    const outcomeMeta = {
      recovered: { cls: 'win', emoji: '\u2705', title: 'Case successfully managed', sub: 'Correct diagnosis, correct treatment, patient fully recovered.' },
      died: { cls: 'lose', emoji: '\u2620', title: 'The patient died', sub: 'The case was not successfully managed. Read the debrief.' },
      timeout: { cls: 'lose', emoji: '\u23F1', title: 'Time expired', sub: 'The clock beat you: the patient left the resuscitation room undiagnosed or unstable.' },
      withdrawn: { cls: 'part', emoji: '\u26D4', title: 'Case ended early', sub: 'You closed the case before the patient was managed.' }
    }[outcome] || { cls: 'part', emoji: '\u2757', title: 'Case ended', sub: '' };

    const success = outcome === 'recovered' && sc.mgmtPts >= Math.round(SCORE.mgmt * 0.75);
    const partial = !success && outcome !== 'died' && S.dxSolved && S.stability > 40;

    log('Case closed: ' + outcomeMeta.title + '. Final score ' + sc.total + ' (' + rank + ').', success ? 'good' : 'alarm');

    lastResult = { outcome, sc, rank, note, cs, success, partial, meta: outcomeMeta };

    // stats
    const key = cs.id;
    stats.plays = (stats.plays || 0) + 1;
    if (success) stats.wins = (stats.wins || 0) + 1;
    stats.total = (stats.total || 0) + sc.total;
    stats.cases[key] = stats.cases[key] || { plays: 0, wins: 0, best: 0 };
    stats.cases[key].plays++;
    if (success) stats.cases[key].wins++;
    stats.cases[key].best = Math.max(stats.cases[key].best || 0, sc.total);
    stats.best = Math.max(stats.best || 0, sc.total);
    saveStats();
    renderCareer();

    /* outcome banner */
    const cls = success ? 'win' : (S.stability <= 0 ? 'lose' : (partial ? 'part' : outcomeMeta.cls));
    const title = success ? 'Patient recovered — case successfully managed'
      : (outcome === 'died' ? 'The patient died — case not successfully managed'
        : (partial ? 'Patient stabilised but not fully managed' : outcomeMeta.title));
    const late = S.lateSave
      ? ' The clock expired while the treatment was taking effect — the patient survives, but the bonus for speed is gone.'
      : '';
    $('#outcome').className = 'outcome ' + cls;
    $('#outcome').innerHTML = `
      <div class="emoji">${success ? '\u2705' : (outcome === 'died' ? '\u2620' : (partial ? '\u26A0' : '\u23F1'))}</div>
      <h1>${esc(title)}</h1>
      <p class="sub">${esc(outcomeMeta.sub + late)}</p>
      <p class="sub"><b>Diagnosis:</b> ${esc(cs.dx.label)}</p>`;

    /* breakdown */
    const rows = [
      ['Correct diagnosis', sc.dxPts, sc.dxPts > 0],
      ['First-attempt bonus', sc.firstTry, sc.firstTry > 0],
      ['Management (' + Math.round(S.mgmtGrade * 100) + '% of the bundle)', sc.mgmtPts, sc.mgmtPts > 0],
      ['Patient outcome', sc.outcomePts, sc.outcomePts > 0],
      ['Time remaining', sc.timePts, true],
      ['Budget remaining', sc.budgetPts, true],
      ['Investigation efficiency (' + sc.ordered + ' ordered, par ' + sc.par + ')', sc.effPts, true]
    ];
    if (sc.penalties) rows.push(['Penalties (hints ' + S.hints + ', wrong diagnoses ' + S.dxWrong + ')', -sc.penalties, false]);
    $('#score-breakdown').innerHTML = rows.map(([k, v, pos]) =>
      `<div class="brow"><span class="k">${esc(k)}</span>
       <span class="v ${v < 0 ? 'neg' : (pos ? 'pos' : '')}">${v > 0 ? '+' : ''}${v}</span></div>`).join('') +
      `<div class="brow"><span class="k">Maximum possible</span><span class="v">${MAX_SCORE}</span></div>`;
    $('#score-total').textContent = sc.total;
    $('#rank-line').innerHTML = `Grade: <b>${esc(rank)}</b> &middot; ${esc(note)}`;

    /* debrief */
    $('#debrief').innerHTML = `
      <div class="pearl"><b>Correct diagnosis:</b> ${esc(cs.dx.label)}<br>${esc(cs.dx.why)}</div>
      <h3>Key clues</h3>
      ${cs.debrief.key.map((k) => `<div class="pearl">${esc(k)}</div>`).join('')}
      <h3>Pearls</h3>
      ${cs.debrief.pearls.map((k) => `<div class="pearl">${esc(k)}</div>`).join('')}
      <h3>Pitfalls</h3>
      ${cs.debrief.pitfalls.map((k) => `<div class="pearl bad">${esc(k)}</div>`).join('')}
      <h3>Your numbers</h3>
      <div class="pearl"><b>Specialty:</b> ${esc(cs.category)} &middot;
        time used ${mmss(S.elapsed)} of ${mmss(cs.timeLimitSec)} &middot;
        spent ${money(S.spent)} of ${money(cs.budget)} &middot; ${sc.ordered} investigations &middot;
        ${S.dxTries} diagnosis attempt(s) &middot; stability ${pct(S.stability)}</div>`;

    renderLog();
    buildShareText();
    drawScorecard();
    showScreen('screen-end');
  }

  /* ===================================================================== */
  /*  SHARING                                                              */
  /* ===================================================================== */
  function shareTextFor() {
    if (!lastResult) return '';
    const { cs, sc, rank, outcome, success, partial } = lastResult;
    const outcomeLine = success ? 'Patient recovered fully \u2014 case successfully managed'
      : (outcome === 'died' ? 'The patient died \u2014 case failed'
        : (partial ? 'Patient stabilised but not fully managed' : 'Ran out of time \u2014 case failed'));
    const who = opts.name ? opts.name + ' scored ' : 'I scored ';
    const url = location.protocol.indexOf('http') === 0 ? location.href : '';
    return [
      'DocSim \u2014 timed diagnostic challenge, by Ahamed Shahmy',
      who + sc.total + '/' + MAX_SCORE + ' as ' + rank + '.',
      outcomeLine,
      'Case: ' + cs.title + ' (' + cs.difficulty + ')',
      'Final diagnosis: ' + cs.dx.label,
      'Time used ' + mmss(S.elapsed) + '/' + mmss(cs.timeLimitSec) +
        ' \u00B7 budget left ' + money(cs.budget - S.spent) +
        ' \u00B7 ' + sc.ordered + ' investigations \u00B7 stability ' + pct(S.stability),
      '#DocSim #MedEd #ClinicalReasoning',
      url
    ].filter(Boolean).join('\n');
  }

  function buildShareText() {
    const t = shareTextFor();
    $('#share-text').value = t;
    return t;
  }

  function roundRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function drawScorecard() {
    if (!lastResult) return;
    const cv = $('#scorecard');
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const { cs, sc, rank, outcome, success, partial } = lastResult;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a1420'); bg.addColorStop(1, '#111c2e');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const accent = success ? '#37d67a' : (outcome === 'died' ? '#ff4d5e' : '#ffb020');
    ctx.fillStyle = accent; ctx.fillRect(0, 0, W, 14);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#2ee6c5';
    ctx.font = '700 46px system-ui, sans-serif';
    ctx.fillText('DocSim', 64, 118);
    ctx.fillStyle = '#6d8394';
    ctx.font = '600 26px ui-monospace, monospace';
    ctx.fillText('TIMED DIAGNOSTIC CHALLENGE', 64, 158);
    ctx.fillStyle = '#4f6a7d';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText('by Ahamed Shahmy \u00B7 maa.shahmy@gmail.com', 64, 192);

    ctx.fillStyle = '#e8f1f6';
    ctx.font = '700 46px system-ui, sans-serif';
    wrapText(ctx, cs.title, 64, 232, W - 128, 54);

    // score block
    roundRect(ctx, 64, 320, W - 128, 250, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
    ctx.strokeStyle = '#22323f'; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = '#9fb3c2'; ctx.font = '600 28px ui-monospace, monospace';
    ctx.fillText('SCORE', 104, 378);
    ctx.fillStyle = '#2ee6c5'; ctx.font = '700 118px ui-monospace, monospace';
    ctx.fillText(String(sc.total), 100, 486);
    const totalW = ctx.measureText(String(sc.total)).width;
    ctx.fillStyle = '#6d8394'; ctx.font = '600 34px ui-monospace, monospace';
    ctx.fillText('/ ' + MAX_SCORE, 100 + totalW + 24, 484);

    ctx.fillStyle = accent; ctx.font = '700 40px system-ui, sans-serif';
    ctx.fillText('Grade: ' + rank, 100, 546);

    // outcome line
    const outcomeLine = success ? 'Patient recovered \u2014 case successfully managed'
      : (outcome === 'died' ? 'The patient died \u2014 case failed'
        : (partial ? 'Stabilised but not fully managed' : 'Time expired \u2014 case failed'));
    ctx.fillStyle = '#e8f1f6'; ctx.font = '600 34px system-ui, sans-serif';
    wrapText(ctx, outcomeLine, 64, 640, W - 128, 42);

    // stats grid
    const cells = [
      ['DIAGNOSIS', cs.dx.label],
      ['TIME USED', mmss(S.elapsed) + ' of ' + mmss(cs.timeLimitSec)],
      ['BUDGET LEFT', money(cs.budget - S.spent) + ' of ' + money(cs.budget)],
      ['INVESTIGATIONS', sc.ordered + ' ordered'],
      ['STABILITY', pct(S.stability)],
      ['PLAYER', opts.name || 'Anonymous clinician']
    ];
    let y = 700;
    for (let i = 0; i < cells.length; i += 2) {
      for (let j = 0; j < 2; j++) {
        const c = cells[i + j]; if (!c) continue;
        const x = 64 + j * ((W - 128) / 2 + 0);
        const w = (W - 148) / 2;
        roundRect(ctx, x, y, w, 108, 20);
        ctx.fillStyle = 'rgba(255,255,255,0.035)'; ctx.fill();
        ctx.fillStyle = '#6d8394'; ctx.font = '600 22px ui-monospace, monospace';
        ctx.fillText(c[0], x + 24, y + 40);
        ctx.fillStyle = '#cfe0ea'; ctx.font = '700 30px system-ui, sans-serif';
        ctx.fillText(clip(ctx, c[1], w - 48), x + 24, y + 82);
      }
      y += 124;
    }

    ctx.fillStyle = '#43596b'; ctx.font = '600 24px ui-monospace, monospace';
    ctx.fillText('Ten minutes. One budget. One patient.', 64, H - 74);
    ctx.fillStyle = '#2ee6c5';
    ctx.fillText('Think you can do better?', 64, H - 36);
  }
  function wrapText(ctx, text, x, y, maxWidth, lh) {
    const words = String(text).split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, y); line = words[i]; y += lh; }
      else line = test;
    }
    if (line) ctx.fillText(line, x, y);
    return y;
  }
  function clip(ctx, text, maxWidth) {
    let t = String(text);
    if (ctx.measureText(t).width <= maxWidth) return t;
    while (t.length > 4 && ctx.measureText(t + '\u2026').width > maxWidth) t = t.slice(0, -1);
    return t + '\u2026';
  }

  function sharecardBlob(cb) {
    try { $('#scorecard').toBlob((b) => cb(b), 'image/png'); } catch (e) { cb(null); }
  }

  function doShare(kind) {
    const text = shareTextFor();
    const url = location.protocol.indexOf('http') === 0 ? location.href : '';
    const enc = encodeURIComponent;
    if (kind === 'copy') {
      const done = () => toast('Scorecard text copied. Paste it anywhere.', 'good');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
      } else fallbackCopy(text, done);
      return;
    }
    if (kind === 'image') {
      sharecardBlob((b) => {
        if (!b) { toast('Could not build the image.', 'bad'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = 'docsim-scorecard.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast('Scorecard downloaded — attach it to your post.', 'good');
      });
      return;
    }
    if (kind === 'native') {
      if (navigator.share) {
        sharecardBlob((b) => {
          let files = null;
          try {
            if (b && window.File) files = [new File([b], 'docsim-scorecard.png', { type: 'image/png' })];
          } catch (e) { files = null; }
          const payload = (files && navigator.canShare && navigator.canShare({ files }))
            ? { text, files, title: 'DocSim scorecard by Ahamed Shahmy' }
            : { text, title: 'DocSim scorecard by Ahamed Shahmy' };
          navigator.share(payload).catch((err) => {
            if (!err || err.name !== 'AbortError') {
              toast('Sharing was blocked — copying the text instead.', 'warn');
              doShare('copy');
            }
          });
        });
      } else {
        doShare('copy');
        toast('Native sharing is unavailable here — text copied instead.', 'warn');
      }
      return;
    }
    const links = {
      x: 'https://twitter.com/intent/tweet?text=' + enc(text),
      whatsapp: 'https://wa.me/?text=' + enc(text),
      telegram: 'https://t.me/share/url?url=' + enc(url) + '&text=' + enc(text),
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url || 'https://example.org/') + '&quote=' + enc(text),
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url || 'https://example.org/')
    };
    if (!url && (kind === 'facebook' || kind === 'linkedin')) {
      toast('Those networks need a public link. Host the game online (see README) or use X / WhatsApp / Telegram.', 'warn', 6000);
    }
    window.open(links[kind], '_blank', 'noopener,noreferrer,width=680,height=640');
  }
  function fallbackCopy(text, done) {
    const ta = $('#share-text');
    ta.removeAttribute('readonly'); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed — select the text manually.', 'bad'); }
    ta.setAttribute('readonly', 'readonly');
  }

  /* ===================================================================== */
  /*  UI PLUMBING                                                          */
  /* ===================================================================== */
  function switchTab(name) {
    if (name === 'rx' && S && !S.dxSolved) {
      toast('Commit to a diagnosis before starting definitive treatment.', 'warn');
      return;
    }
    $$('#tabs .tab').forEach((t) => t.classList.toggle('is-on', t.dataset.tab === name));
    $$('.pane').forEach((p) => { p.hidden = p.dataset.pane !== name; });
    // on a wide screen the monitor column stays put, so pair it with something useful
    if (name === 'patient' && window.matchMedia('(min-width:980px)').matches) {
      const side = $('.pane[data-pane="actions"]');
      if (side) side.hidden = false;
    }
    if (name === 'tests') renderTests();
    if (name === 'actions') renderActions();
    if (name === 'log') renderLog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function bind() {
    /* home */
    $('#case-list').addEventListener('click', (e) => {
      const li = e.target.closest('[data-case]');
      if (li) { sfx.click(); startCase(li.dataset.case); }
    });
    $$('.filters .chip').forEach((c) => c.addEventListener('click', () => {
      caseFilter = c.dataset.filter;
      $$('.filters .chip').forEach((x) => x.classList.toggle('is-on', x === c));
      renderCaseList();
    }));
    $('#btn-random').addEventListener('click', () => {
      const list = window.CASES.filter((c) => caseFilter === 'all' || c.difficulty === caseFilter);
      const pick = list[Math.floor(Math.random() * list.length)];
      if (pick) startCase(pick.id);
    });
    $('#btn-reset-stats').addEventListener('click', () => {
      stats = { cases: {}, plays: 0, wins: 0, best: 0, total: 0 };
      saveStats(); renderCareer(); renderCaseList();
      toast('Record cleared.', 'warn');
    });
    $('#opt-sound').addEventListener('change', (e) => { opts.sound = e.target.checked; saveOpts(); if (opts.sound) sfx.click(); });
    $('#opt-hints').addEventListener('change', (e) => { opts.hints = e.target.checked; saveOpts(); });
    $('#opt-name').addEventListener('input', (e) => { opts.name = e.target.value.slice(0, 24); saveOpts(); });

    /* gate */
    const gate = $('#gate');
    if (gate) $('#gate-begin').addEventListener('click', beginClock);

    /* tabs */
    $('#tabs').addEventListener('click', (e) => {
      const t = e.target.closest('.tab');
      if (t) switchTab(t.dataset.tab);
    });

    /* play panes (delegated) */
    $('#screen-play').addEventListener('click', (e) => {
      const act = e.target.closest('[data-doact]');
      if (act) { sfx.click(); doAction(act.dataset.doact); return; }
      const ord = e.target.closest('[data-ordertest]');
      if (ord) { orderTest(ord.dataset.ordertest); return; }
      const stog = e.target.closest('.stog');
      if (stog) {
        const k = stog.dataset.series;
        visibleSeries[k] = !visibleSeries[k];
        stog.classList.toggle('is-on', visibleSeries[k]);
        renderChart();
        return;
      }
    });
    $('#rx-list').addEventListener('change', (e) => {
      const box = e.target.closest('[data-rxbox]');
      if (box) { rxSelected[box.dataset.rxbox] = box.checked; renderRx(); }
    });

    $('#dx-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = $('#dx-input').value.trim();
      if (v) submitDiagnosis(v);
    });
    $('#btn-rx').addEventListener('click', submitManagement);
    $('#btn-hint').addEventListener('click', useHint);
    $('#btn-sound').addEventListener('click', () => {
      opts.sound = !opts.sound;
      $('#opt-sound').checked = opts.sound;
      $('#btn-sound').textContent = opts.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
      saveOpts();
      if (opts.sound) sfx.click();
    });
    $('#btn-quit').addEventListener('click', () => {
      if (!S || !S.running) return;
      if (window.confirm('End this case now? The patient will be handed over unmanaged.')) endCase('withdrawn');
    });

    /* results */
    $('#btn-again').addEventListener('click', () => startCase(S.cs.id));
    $('#btn-next').addEventListener('click', () => {
      const i = window.CASES.findIndex((c) => c.id === S.cs.id);
      startCase(window.CASES[(i + 1) % window.CASES.length].id);
    });
    $('#btn-home').addEventListener('click', () => { showScreen('screen-start'); renderCaseList(); renderCareer(); });
    $('#share-row').addEventListener('click', (e) => {
      const b = e.target.closest('[data-share]');
      if (b) doShare(b.dataset.share);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && S && S.running) { /* no pause: the clock is continuous */ }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && S && S.running) {
        log('Note: the case clock keeps running in the background.', 'test');
      }
    });
  }

  /* ===================================================================== */
  /*  BOOT                                                                 */
  /* ===================================================================== */
  function boot() {
    loadStore();
    if (location.protocol.indexOf('http') === 0 && !document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = 'manifest.webmanifest';
      document.head.appendChild(link);
    }
    if (!$('#gate')) {
      // injected so the HTML stays lean; keeps the pre-start gate available
      $('#screen-play').insertAdjacentHTML('beforeend', `
        <div id="gate" class="gate" hidden>
          <div class="gate-card">
            <p class="muted">Case ready</p>
            <h2 id="gate-title"></h2>
            <div id="gate-meta" class="gate-meta"></div>
            <p class="muted">The 10-minute clock starts the moment you press begin, and it never stops.
            Read the history, resuscitate, investigate, diagnose, treat.</p>
            <button id="gate-begin" class="btn btn-primary" type="button">Begin — start the clock</button>
          </div>
        </div>`);
    }
    $('#opt-sound').checked = !!opts.sound;
    $('#opt-hints').checked = !!opts.hints;
    $('#opt-name').value = opts.name || '';
    $('#btn-sound').textContent = opts.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
    if (!window.CASES || !window.CASES.length) {
      $('#case-list').innerHTML = '<li class="muted">Case files failed to load. Check that cases.js and cases-more.js are present.</li>';
      return;
    }
    window.CASES.forEach((c) => { c.dx = c.dx || {}; c.dx.reject = c.dx.reject || []; c.events = c.events || []; });
    bind();
    renderCaseList();
    renderCareer();
    showScreen('screen-start');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* expose a little for debugging in the console */
  window.DocSim = {
    get state() { return S; },
    cases: () => window.CASES,
    start: startCase,
    matchFor: matchDiagnosisFor,
    normalize
  };
})();
