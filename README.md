# DocSim — a timed, budget-limited diagnostic game

**by Ahamed Shahmy** · [maa.shahmy@gmail.com](mailto:maa.shahmy@gmail.com)

A patient is wheeled into your resuscitation room. You get **ten minutes**, a **fixed budget** and
whatever clinical skill you can bring. The clock never stops, the monitor trends downward until you
do the right thing, and every investigation you order costs money you may need later.

Read the history → resuscitate → investigate → **type the diagnosis** → choose the right management.
Save the patient and the case is successfully managed. Get it wrong, run out of money or run out of
time and the patient dies — and you get a full debrief explaining exactly where the pathway went wrong.

Built as a **single-page web app** with no build step, no frameworks and no network calls. It runs on
phones, tablets and desktops, and it can be installed to a phone home screen.

---

## Quick start

**On a computer** — just open `index.html` in any modern browser. Everything is local.

**On your phone** (same Wi-Fi as your computer):

```bash
cd medic-triage
python3 -m http.server 8000
# find your computer's LAN address, e.g. ip addr | grep 'inet 192'
# then open http://192.168.1.23:8000 on the phone
```

Then use the browser menu → **Add to Home Screen** to get a full-screen, offline-capable app.

> Serving over HTTP (rather than opening files directly) is recommended: browsers only allow
> `localStorage` — your score record — on `http(s)://` and `localhost`. Opened straight from disk the
> game still works, it just cannot remember your results between sessions.

---

## The game loop

| Step | What happens |
|---|---|
| **1. Case opens** | History, examination and the live monitor are free. Nothing has been spent yet. Press **Begin** when you are ready — that is when the clock starts, and it never pauses. |
| **2. Resuscitate** | Bedside measures are cheap or free (oxygen, IV access, aspirin, atropine, hydrocortisone…). The right ones slow the deterioration; the wrong ones accelerate it and the patient gets visibly worse. |
| **3. Investigate** | Each test has a **cost** and a **turnaround time**. Cost is charged when you order, and only **4 tests can be in the lab queue** at once. Results arrive while the patient keeps deteriorating. |
| **4. Diagnose** | Type the diagnosis. Natural phrasing is accepted (a typo-tolerant, synonym-aware matcher) and an autocomplete list of differentials is offered — most of them are deliberately wrong. A wrong answer costs **45 seconds and 6% stability**. |
| **5. Treat** | Management unlocks only after a committed diagnosis. Select **every** measure the patient needs and nothing that will hurt them. A full, correct bundle starts recovery; a partial bundle leaves them deteriorating; a harmful selection causes direct harm. |
| **6. Outcome** | Patient recovers → *case successfully managed*. Patient dies, or the clock/budget runs out before they are managed → *case not successfully managed*. Either way you get a scored debrief. |

### The deterioration model
Every case has a baseline set of observations and a decay rate. A hidden **stability** value falls in
real time; all vital signs are derived from it, so the monitor chart drifts, the numbers turn amber and
then red, and the alarm overlay fires as the patient approaches arrest. Correct early actions multiply
the decay rate down (a good resuscitation can make the patient survive well past the ten-minute limit),
while harmful measures, delayed antibiotics, ungiven antidotes and scripted deteriorations push it up.
Untreated, most cases arrest somewhere between **5.5 and 7.5 minutes**.

### Scoring (max 1520)
| Component | Points |
|---|---|
| Correct diagnosis | 320 |
| First-attempt bonus | 60 |
| Management bundle (weighted; harmful choices are penalised) | up to 420 |
| Patient outcome | up to 260 |
| Time remaining | up to 180 |
| Budget remaining | up to 160 |
| Investigation efficiency (fewer unnecessary tests) | up to 120 |
| Hints (−40 each) and wrong diagnoses (−60 each) | penalties |

Grades: **Consultant** ≥1380, **Registrar** ≥1200, **Senior House Officer** ≥950, **Intern** ≥650,
**Medical student** ≥350, otherwise *needs revision*. A perfect playthrough of a shipped case scores
around 1430–1475 — there is room at the top only if you are right, fast **and** economical.

### Publishing your score
The results screen can produce a **1080×1080 scorecard image** and a ready-made post:
native share sheet (with the image attached on phones), X, WhatsApp, Facebook, LinkedIn, Telegram,
copy-to-clipboard, and a PNG download. The text includes your score, grade, the case, the final
diagnosis, time used, budget left and your stability.

*Facebook and LinkedIn require a public URL to share, so host the folder anywhere static
(GitHub Pages, Netlify, any web server) if you want those buttons to work fully.*

---

## The thirty-eight cases

Grouped by difficulty: **10 easy**, **18 moderate** and **10 hard** — 26 specialties and
474 investigations in total.

**Titles are presentations, not answers.** The case list gives an age, a sex and a presenting
complaint; the specialty is withheld until the debrief, so the diagnosis has to be worked out from
the history, the examination and the investigations you choose to buy. The audit refuses any title or
blurb that the diagnosis matcher would accept as a diagnosis in its own right.

| Case | Specialty | Difficulty |
|---|---|---|
| Severe chest pain at rest in a 58-year-old man | Cardiology | Easy |
| Two weeks of thirst and weight loss in a 19-year-old student | Endocrinology | Easy |
| A 34-year-old farm worker, drowsy and drenched in sweat | Toxicology | Easy |
| A 24-year-old woman who can no longer finish a sentence | Respiratory | Easy |
| An unresponsive 24-year-old man found on a park bench | Toxicology | Easy |
| Sudden wheeze and rash at a picnic | Emergency medicine | Easy |
| A fall from a ladder in a 42-year-old roofer | Respiratory / Emergency | Easy |
| A 74-year-old woman found drowsy by her carer | Endocrinology | Easy |
| A 16-year-old woken by sudden scrotal pain | Urology | Easy |
| Breathlessness and drowsiness in a 68-year-old man | Respiratory | Easy |
| Two days of fever and headache in a 24-year-old student | Infectious disease | Moderate |
| Sudden breathlessness and a blackout in a 62-year-old woman | Respiratory / Thrombosis | Moderate |
| A 28-year-old man whose fever has settled but who feels worse | Tropical medicine | Moderate |
| A convulsion that has lasted twelve minutes in a 34-year-old man | Neurology | Moderate |
| Sudden severe lower abdominal pain in a 26-year-old woman | Obstetrics & Gynaecology | Moderate |
| Vomiting large volumes of blood in a 52-year-old man | Hepatology / Gastroenterology | Moderate |
| Four days of cough and fever in a 66-year-old woman | Respiratory / Infectious disease | Moderate |
| Severe upper abdominal pain in a 45-year-old man | Gastroenterology | Moderate |
| Two days of breathlessness in a 72-year-old man | Cardiology | Moderate |
| Fever and odd behaviour in a 41-year-old man | Neurology / Infectious disease | Moderate |
| Sudden weakness and loss of speech in a 71-year-old man | Neurology | Moderate |
| Three weeks of fever and weight loss in a 38-year-old man | Infectious disease / Cardiology | Moderate |
| Fever and rigors in a 54-year-old woman | Oncology / Infectious disease | Moderate |
| Fever and drowsiness in a 29-year-old man | Tropical medicine | Moderate |
| Weakness and difficulty swallowing in a 31-year-old farm worker | Toxicology / Tropical medicine | Moderate |
| Agitation and confusion three days into a hospital admission | Addiction medicine | Moderate |
| Heavy bleeding twenty minutes after a normal delivery | Obstetrics | Moderate |
| A nine-month-old who will not stop screaming | Paediatrics | Moderate |
| Three days of confusion and unsteadiness in a 68-year-old man | Nephrology / Neurology | Hard |
| Four days of vomiting in a 42-year-old woman, now barely responsive | Endocrinology | Hard |
| Confusion and vomiting in a 78-year-old woman | Toxicology / Cardiology | Hard |
| Fever and agitation in a 34-year-old woman with a racing pulse | Endocrinology | Hard |
| Weakness and palpitations in a 68-year-old man | Nephrology | Hard |
| Breathlessness and dizziness three weeks after a flu-like illness | Cardiology | Hard |
| Agitation and sweating in a 28-year-old man | Toxicology | Hard |
| Rapid breathing and vomiting in a 22-year-old woman | Toxicology | Hard |
| An unconscious 76-year-old woman found at home | Endocrinology | Hard |
| Confusion and weakness in a 66-year-old man | Endocrinology / Oncology | Hard |

Every test result, management option and debrief is written to teach the decision that actually
changes outcome — including several deliberately harmful options that are commonly chosen in real life.

---

## Adding your own cases

Cases are plain objects in `cases.js`, `cases-more.js`, `cases-emergency.js`, `cases-medicine.js` and
`cases-complex.js`. The engine is generic: **add an object to the array and it appears in the menu.**
Minimum viable template:

```js
add({
  id: 'mycase',                       // unique
  title: 'One-line hook for the case list',
  category: 'Cardiology',
  difficulty: 'moderate',             // easy | moderate | hard
  blurb: 'Short line shown above the monitor.',
  timeLimitSec: 600,
  budget: 2200,                       // in $CUR units
  who: 'Demographics and background.',
  history: ['bullet', 'bullet', 'bullet'],
  exam: ['bullet', 'bullet', 'bullet'],

  base:  { hr: 104, sbp: 106, dbp: 66, rr: 24, spo2: 93, temp: 36.9, gcs: 15 },
  drift: { hr: 0.55, sbp: -0.62, dbp: -0.34, rr: 0.22, spo2: -0.20, temp: 0.012, gcs: -0.03 },
  decay: 0.22,                        // stability points lost per second (100/decay = seconds to arrest)

  // scripted deteriorations: fires once, at `at` seconds, if `need` has not happened yet
  events: [ { at: 180, need: ['test:ecg'], loss: 9, msg: 'The pain is worsening...' } ],

  actions: [                          // bedside measures
    A('aspirin', 'Aspirin 300 mg chewed', 'Short rationale.', {
      cost: 5, tat: 4, factor: 0.58,  // factor < 1 slows decay, > 1 accelerates it
      msg: 'What the patient does in response.'
    }),
    A('furosemide', 'Furosemide 40 mg IV', 'Why this is wrong here.', {
      cost: 10, tat: 6, factor: 1.6, harm: true,
      msg: 'How the patient deteriorates.'
    })
  ],

  tests: [                            // investigations
    T('ecg', '12-lead ECG', 'Bedside', 40, 8,
      'Sinus tachycardia. **ST elevation 3 mm in V1-V4.**',   // **bold** is rendered
      { flag: 'critical', factor: 0.8 })                     // critical = essential/high-yield
  ],
  // categories in use: Bedside | Bloods | Imaging | Microbiology | Special
  // flag: 'critical' | 'abnormal' | 'normal'   (styling of the result panel)

  hints: ['Clue one.', 'Clue two.'],

  dx: {
    label: 'Acute anterior STEMI',                 // canonical answer, shown in the debrief
    accept: ['stemi', 'anterior stemi', 'myocardial infarction'],  // anything here is accepted
    reject: [                                       // checked first — teaches the near-miss
      { m: ['pericarditis'], msg: 'Pericarditis gives diffuse concave elevation...' }
    ],
    penaltySec: 45, penaltyStab: 6,
    why: 'Why this is the diagnosis.'
  },
  differentials: ['Acute myocardial infarction (STEMI)', 'Pericarditis', /* >=5 distractors */],

  mgmt: {
    timeSec: 30,                                    // time the treatment round consumes
    options: [
      { id: 'pci', label: 'Primary PCI', correct: true, msg: 'Why it is needed.' },
      { id: 'nsaid', label: 'Diclofenac IM', correct: false, harm: true, msg: 'Why it kills.' }
    ]
  },

  debrief: { key: ['clue'], pearls: ['teaching point'], pitfalls: ['common error'] }
});
```

`test/cases.mjs` enforces the rules for every case: unique ids, at least 8 investigations and 6 bedside
actions, 5 correct and 3 harmful management options, a differential list with at least 5 real
distractors, a critical-flagged investigation, every scripted event referring to an action or test that
actually exists, and a balance check — the essential path must fit the budget, the whole action list
must stay affordable (so mistakes remain reachable), the budget must *not* stretch to every
investigation plus the essential treatment (so money always forces a choice), and an untreated patient
must deteriorate before the clock runs out. `test/smoke.mjs` additionally proves that the diagnosis
matcher accepts the canonical answer and your natural phrasing while rejecting every distractor.

**Diagnosis matching** normalises the text (case, punctuation, stop-words, British/American spelling),
then: rejects anything hitting a `reject` row → exact match → every significant word of an accepted
phrase present → typo tolerance (every significant word must match, allowing a couple of mistyped characters). Anything else is wrong.

---

## Testing

```bash
npm test                  # all three suites
node test/cases.mjs       # case library validation — no browser, milliseconds
node test/smoke.mjs       # end-to-end UI, engine, failure paths, layout (needs google-chrome)
node test/playthrough.mjs # plays all 38 cases correctly and requires a full recovery
node test/matcher-report.mjs # prints what the diagnosis matcher accepts, per case
```

`cases.mjs` needs nothing but Node: it loads the case files exactly as the browser does, then audits
the schema, the internal references and the playability balance of every case, and prints a balance
table (budget, essential spend, time to arrest with and without treatment, and the size of each case).

`smoke.mjs` drives the real app in headless Chrome over CDP at a 390×844 phone viewport: it checks the
diagnosis matcher against all 180 differentials, plays a complete winning STEMI run (actions, lab
queue, wrong diagnosis, correct diagnosis, full management, recovery, score, share text, scorecard
canvas), exercises the budget cap, the death path, the timeout path, hints, tab switching, tap-target
sizes, overflow and the wide-screen layout, and fails on any console error.

`playthrough.mjs` runs the page clock at 15×, resuscitates, orders the high-yield investigations,
types the canonical diagnosis and gives the full correct management bundle for **every** case, asserting
that all thirty-eight end in a full recovery inside the budget. Screenshots land in `test/shots/`.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Screens: home, play (HUD, monitor, panes) and results |
| `styles.css` | Dark clinical theme, mobile-first, responsive to two columns |
| `cases.js`, `cases-more.js` | Case library, parts 1-2 |
| `cases-emergency.js`, `cases-medicine.js`, `cases-complex.js` | Case library, parts 3-5 |
| `cases-firsthour.js`, `cases-cardioresp.js`, `cases-neurology.js` | Case library, parts 6-8 |
| `cases-infection.js`, `cases-poisoning.js`, `cases-metabolic.js` | Case library, parts 9-11 |
| `cases-womens-paeds.js` | Case library, part 12 |
| `game.js` | Clock, physiology, lab queue, matcher, scoring, sharing |
| `manifest.webmanifest`, `icon.svg` | Home-screen install metadata |
| `test/harness.mjs` | Shared headless-Chrome/CDP harness |
| `test/cases.mjs` | Case library validation and balance audit (no browser) |
| `test/smoke.mjs`, `test/playthrough.mjs` | End-to-end browser tests |
| `test/matcher-report.mjs` | Diagnosis matcher report, for case authors |

---

## Disclaimer

**Educational simulation only.** Cases, doses, pathways and timings are simplified for teaching and
several are deliberately exaggerated for drama. Nothing here is clinical advice, the scoring is a game
mechanic rather than a competency assessment, and no real patient data is used. Always follow your own
local protocols and current guidelines in real practice.
