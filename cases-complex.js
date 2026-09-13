/* =========================================================================
   DocSim — case library (part 5): complex medical emergencies
   Loaded after cases-medicine.js. Same schema; just push onto window.CASES.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 16 — Digoxin toxicity
     ======================================================================= */
  window.CASES.push({
    id: 'digoxin',
    title: 'Confused elderly woman with a pulse of 38 and yellow vision',
    category: 'Toxicology / Cardiology',
    difficulty: 'hard',
    blurb: 'Started amiodarone last week, been vomiting for three days, and now sees yellow halos around the lights.',
    timeLimitSec: 600,
    budget: 2000,
    who: 'Mrs. H., 78-year-old woman with atrial fibrillation on digoxin for eight years. Amiodarone was started last week for rhythm control, and she has had three days of vomiting and diarrhoea with poor oral intake. She is now confused and complains of yellow-green halos around lights.',
    history: [
      'Three days of nausea, vomiting and diarrhoea with reduced oral intake; now drowsy and confused.',
      '**Visual disturbance: yellow-green halos around lights and blurred vision.**',
      'Amiodarone 200 mg daily started one week ago for persistent atrial fibrillation; digoxin 125 micrograms daily continued unchanged.',
      'Also on bendroflumethiazide for hypertension. No overdose taken deliberately; no other new drugs.',
      'No chest pain, no syncope, no palpitations reported before today, no anticoagulant.'
    ],
    exam: [
      'Drowsy, confused, GCS 13, oriented to person only. Dry mucous membranes.',
      '**Pulse 38 and irregular**, BP 96/58, respiratory rate 18, SpO2 94%, temperature 36.5 C.',
      '**Bradycardia with a slow, irregular pulse and a raised JVP.** No pulmonary oedema, no murmur.',
      'Abdomen soft and tender generally; no organomegaly, no blood on rectal examination.',
      'No focal neurology, no rash, no needle marks. Reduced skin turgor and dry axillae.'
    ],
    base: { hr: 38, sbp: 96, dbp: 58, rr: 18, spo2: 94, temp: 36.5, gcs: 13 },
    drift: { hr: -0.12, sbp: -0.6, dbp: -0.35, rr: 0.15, spo2: -0.2, temp: 0.004, gcs: -0.05 },
    decay: 0.28,
    events: [
      { at: 140, need: ['action:fab'], loss: 14, msg: 'No antidote has been given. The bradyarrhythmia persists and the potassium is climbing — digoxin-specific antibody fragments are the definitive treatment.' },
      { at: 280, need: ['action:stopdrugs'], loss: 8, msg: 'Digoxin and amiodarone are still charted. The drug combination that caused this is still being given.' },
      { at: 400, need: ['action:monitor'], loss: 8, msg: 'No continuous cardiac monitoring. Runs of ventricular tachycardia are going unobserved.' }
    ],
    actions: [
      A('monitor', 'Continuous cardiac monitoring, IV access, treat as a time-critical poisoning', 'Digoxin kills by arrhythmia.', { cost: 20, tat: 6, factor: 0.86, msg: 'Monitoring established and the arrhythmia is now visible on the screen.' }),
      A('fab', 'Digoxin-specific antibody fragments (DigiFab) — the definitive antidote', 'Expensive, and the only thing that reverses this.', { cost: 700, tat: 15, factor: 0.3, msg: 'Fab fragments given. Within 20 minutes the heart rate has risen to 62, the potassium has fallen to 5.1 and the patient is more alert.' }),
      A('stopdrugs', 'Stop digoxin, amiodarone and the thiazide; review every interacting drug', 'Remove the cause while you treat the effect.', { cost: 0, tat: 5, factor: 0.78, msg: 'Digoxin and amiodarone stopped and the drug chart reviewed. No further digoxin will be absorbed.' }),
      A('atropine', 'Atropine 0.6 mg IV, repeated if needed', 'Frequently ineffective in digoxin toxicity, but worth a trial while awaiting Fab.', { cost: 15, tat: 6, factor: 0.92, msg: 'Atropine produced only a brief rise in heart rate to 44 — as expected in digoxin toxicity.' }),
      A('potassium', 'Insulin 10 units with 25 g dextrose (and consider salbutamol) for the hyperkalaemia', 'Hyperkalaemia here reflects sodium-potassium ATPase blockade.', { cost: 40, tat: 8, factor: 0.65, msg: 'Insulin-dextrose running; the potassium is falling and the ECG changes are softening.' }),
      A('pacing', 'Prepare for transcutaneous and then transvenous pacing if the bradycardia persists', 'A bridge until the antidote works.', { cost: 60, tat: 10, factor: 0.8, msg: 'Pacing pads applied and the transvenous kit requested; capture is available if needed.' }),
      A('fluids', 'Cautious 0.9% saline for the dehydration, with attention to the potassium', 'Improves renal clearance of digoxin, but do not overload.', { cost: 18, tat: 8, factor: 0.92, msg: 'Modest fluid given, urine output improving and no signs of overload.' }),
      A('charcoal', 'Activated charcoal if there was a recent ingestion', 'This is chronic accumulation, not acute overdose.', { cost: 25, tat: 8, factor: 0.98, msg: 'Charcoal given with airway protection. In chronic toxicity it binds very little — the Fab fragments are what matter.' }),
      A('cardioversion', 'DC cardioversion for the irregular bradyarrhythmia', 'Digoxin toxicity makes the myocardium electrically unstable.', { cost: 120, tat: 8, factor: 1.7, harm: true, msg: 'Cardioversion provoked refractory ventricular fibrillation. Digoxin toxicity is a classic contraindication to elective cardioversion.' }),
      A('calciumpush', 'IV calcium gluconate as the first treatment for the hyperkalaemia, before the antidote', 'Hyperkalaemia here is not a calcium problem.', { cost: 20, tat: 6, factor: 1.18, harm: true, msg: 'Calcium was given while the true problem — sodium-potassium ATPase blockade — went untreated. Calcium is traditionally avoided in digoxin toxicity; the antidote is what is needed.' }),
      A('amiodarone', 'IV amiodarone for the atrial fibrillation', 'The drug that caused this, given again.', { cost: 90, tat: 8, factor: 1.5, harm: true, msg: 'More amiodarone pushed the digoxin level higher still — amiodarone inhibits P-glycoprotein and reduces digoxin clearance.' }),
      A('verapamil', 'IV verapamil for rate control', 'A negative inotrope and chronotrope in digoxin toxicity.', { cost: 25, tat: 6, factor: 1.6, harm: true, msg: 'Verapamil caused profound bradycardia and hypotension; the combination with digoxin is dangerous.' }),
      A('resinonly', 'Oral sodium polystyrene sulfonate as the main treatment', 'Treats the number, not the poisoned heart.', { cost: 35, tat: 10, factor: 1.3, harm: true, msg: 'Resin alone left the arrhythmia untreated while the potassium crept back up.' })
    ],
    tests: [
      T('dig', 'Serum digoxin level', 'Bloods', 150, 50, '**4.8 ng/mL** (therapeutic 0.5-2.0 ng/mL) — severe toxicity. Levels correlate poorly with severity in chronic toxicity, but this one fits the clinical picture exactly.', { flag: 'critical', factor: 0.8 }),
      T('ue5', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, '**K 6.2 mmol/L**, creatinine 2.4 mg/dL, urea 92 mg/dL, Na 132, bicarbonate 18. Acute kidney injury from dehydration, plus potassium from ATPase blockade.', { flag: 'critical', factor: 0.8 }),
      T('ecg3', '12-lead ECG', 'Bedside', 40, 8, '**Complete heart block with a junctional escape at 38, runs of bidirectional ventricular tachycardia, scooped ST depression and a shortened QT.**', { flag: 'critical', factor: 0.78 }),
      T('mg', 'Magnesium', 'Bloods', 80, 40, '**0.62 mmol/L (low)** — hypomagnesaemia worsens digoxin-induced arrhythmia and needs correcting.', { flag: 'abnormal', factor: 0.95 }),
      T('abg5', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.28, HCO3 18, **K 6.2**, lactate 2.2, base excess -6 — a metabolic acidosis with hyperkalaemia.', { flag: 'abnormal' }),
      T('ca2', 'Calcium and phosphate', 'Bloods', 60, 40, 'Corrected calcium 2.2 mmol/L, phosphate 1.6 mmol/L — both normal. No independent calcium problem to treat.', { flag: 'normal' }),
      T('trop', 'High-sensitivity troponin', 'Bloods', 60, 35, 'hs-troponin 45 ng/L — mildly raised. Demand ischaemia from the arrhythmia and hypotension, not an acute coronary syndrome.', { flag: 'abnormal' }),
      T('tft2', 'Thyroid function tests', 'Bloods', 110, 80, 'TSH 1.6, free T4 normal. Thyroid disease is excluded as a cause of the atrial fibrillation.', { flag: 'normal' }),
      T('fbc4', 'Full blood count', 'Bloods', 45, 30, 'Hb 11.2 g/dL, WBC 9.0, platelets 210. Normal.', { flag: 'normal' }),
      T('cxr4', 'Chest X-ray', 'Imaging', 90, 30, 'Normal heart size with clear lung fields. No pulmonary oedema despite the raised JVP.', { flag: 'normal' }),
      T('tox2', 'Urine toxicology screen', 'Microbiology', 130, 90, 'Negative for opiates, benzodiazepines, tricyclics and amphetamines. No other cardiotoxic co-ingestion.', { flag: 'normal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 520, 90, 'Normal. No haemorrhage, infarct or mass — the confusion is toxic and metabolic, not structural.', { flag: 'normal' })
    ],
    hints: [
      'Digoxin plus amiodarone in a dehydrated elderly patient with a new AKI: the level is high, the potassium is high and the rhythm is dangerous.',
      'The antidote is the treatment. Calcium, cardioversion and more amiodarone all make this patient worse.'
    ],
    dx: {
      label: 'Severe digoxin toxicity with hyperkalaemia and bradyarrhythmia',
      accept: ['digoxin toxicity', 'digoxin poisoning', 'digitalis toxicity', 'digoxin overdose', 'digitalis intoxication', 'digoxin toxicity with hyperkalaemia', 'severe digoxin toxicity'],
      reject: [
        { m: ['beta blocker', 'beta blockade'], msg: 'She is not on a beta-blocker. The digoxin level is 4.8 ng/mL and she has visual halos with a raised potassium.' },
        { m: ['heart block'], msg: 'The heart block is the effect of digoxin — the level is 4.8 ng/mL after amiodarone was added. Treat the poison, not just the rhythm.' },
        { m: ['myocardial infarction', 'stemi', 'ischaemia', 'ischemia'], msg: 'The troponin is only mildly raised from demand, the ECG shows scooped ST depression with a shortened QT rather than territorial ischaemia, and the digoxin level is diagnostic.' },
        { m: ['organophosphate', 'cholinergic'], msg: 'Bradycardia, vomiting and confusion overlap, but there is no bronchorrhoea, miosis or fasciculation — and the digoxin level is 4.8 ng/mL.' },
        { m: ['thyrotoxicosis', 'thyroid'], msg: 'Thyroid function is normal; this is digoxin toxicity.' },
        { m: ['uraemic', 'uremic', 'renal failure'], msg: 'The renal impairment is why digoxin accumulated — it is the cause, not the diagnosis.' },
        { m: ['amiodarone'], msg: 'Amiodarone is the precipitant: it inhibits P-glycoprotein and reduces digoxin clearance. The toxicity is from digoxin.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Chronic digoxin therapy with amiodarone added, dehydration and acute kidney injury: level 4.8 ng/mL with visual halos, vomiting, confusion, complete heart block at 38 beats per minute and a potassium of 6.2.'
    },
    differentials: ['Severe digoxin toxicity', 'Complete heart block from ischaemia', 'Hyperkalaemia of acute kidney injury', 'Ventricular tachycardia from acute coronary syndrome', 'Beta-blocker toxicity', 'Organophosphate poisoning', 'Uraemic encephalopathy', 'Thyrotoxicosis', 'Amiodarone toxicity', 'Sick sinus syndrome'],
    mgmt: {
      timeSec: 35,
      options: [
        { id: 'fab2', label: 'Digoxin-specific antibody fragments (indicated for life-threatening arrhythmia or potassium above 5-5.5)', correct: true, msg: 'The definitive treatment — it binds digoxin and reverses the ATPase blockade.' },
        { id: 'k', label: 'Treat the hyperkalaemia with insulin-dextrose and consider salbutamol, with glucose monitoring', correct: true, msg: 'Lowers potassium while the antidote works.' },
        { id: 'atropine2', label: 'Atropine for the bradycardia, accepting that it is often ineffective', correct: true, msg: 'Worth a trial, but do not rely on it.' },
        { id: 'pacing2', label: 'Prepare transcutaneous and transvenous pacing for refractory bradyarrhythmia', correct: true, msg: 'A bridge to the antidote working.' },
        { id: 'stop2', label: 'Stop digoxin, amiodarone and the thiazide; correct magnesium; treat the dehydration gently', correct: true, msg: 'Removes the cause and the interaction.' },
        { id: 'monitor2', label: 'Continuous ECG monitoring in a high-dependency area with repeated potassium and renal function', correct: true, msg: 'Ventricular arrhythmia is the mode of death.' },
        { id: 'avoid', label: 'Avoid elective cardioversion, IV calcium as the primary treatment, verapamil and further amiodarone', correct: true, msg: 'Each of these worsens digoxin toxicity.' },
        { id: 'cv', label: 'DC cardioversion for the irregular bradyarrhythmia', correct: false, harm: true, msg: 'Provokes refractory ventricular fibrillation in digoxin toxicity.' },
        { id: 'ca3', label: 'IV calcium gluconate as the first-line treatment for the hyperkalaemia', correct: false, harm: true, msg: 'Hyperkalaemia in digoxin toxicity is from ATPase blockade and needs the antidote; calcium is traditionally avoided here.' },
        { id: 'amio2', label: 'IV amiodarone for the atrial fibrillation', correct: false, harm: true, msg: 'Raises the digoxin level further and deepens the toxicity.' },
        { id: 'vera2', label: 'IV verapamil for rate control', correct: false, harm: true, msg: 'Profound bradycardia and hypotension in combination with digoxin.' },
        { id: 'resin2', label: 'Potassium-binding resin as the main treatment', correct: false, harm: true, msg: 'Treats a number while the poisoned heart goes untreated.' }
      ]
    },
    debrief: {
      key: ['Elderly patient on long-term digoxin with amiodarone added a week ago and three days of vomiting.', 'Pulse 38, confusion, yellow-green visual halos, vomiting and a raised JVP.', 'Digoxin 4.8 ng/mL, potassium 6.2, AKI, and an ECG showing complete heart block with bidirectional ventricular tachycardia.'],
      pearls: ['Digoxin toxicity is a clinical diagnosis; the level supports it but the arrhythmia and potassium drive the treatment.', 'Fab fragments are indicated for life-threatening arrhythmia or potassium above 5-5.5 mmol/L — they are expensive and they are the answer.', 'Amiodarone, verapamil, quinidine and diuretics all raise digoxin levels. Review the drug chart whenever a level rises.'],
      pitfalls: ['Elective cardioversion in digoxin toxicity can provoke refractory ventricular fibrillation.', 'Treating the potassium without giving the antidote leaves the underlying ATPase blockade untouched.']
    }
  });

  /* =======================================================================
     CASE 17 — Thyroid storm
     ======================================================================= */
  window.CASES.push({
    id: 'thyroidstorm',
    title: 'Fever of 40.6 C and a racing irregular pulse in known Graves disease',
    category: 'Endocrinology',
    difficulty: 'hard',
    blurb: 'Stopped her carbimazole three weeks ago; now agitated, delirious, vomiting and in fast atrial fibrillation.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Ms. R., 34-year-old teacher with Graves disease diagnosed two years ago. She stopped her carbimazole three weeks ago because she felt well. Four days of sore throat and dysuria, and since this morning she has been agitated, confused and vomiting with a fever of 40.6 C.',
    history: [
      'Four days of sore throat and burning dysuria; increasingly agitated and confused over 24 hours.',
      'Carbimazole stopped three weeks ago; no beta-blocker, no recent blood tests.',
      'Weight loss of 4 kg over two months with heat intolerance, palpitations and tremor.',
      'No chest pain, no cough, no rash, no head injury, no alcohol or drug use.',
      'No previous thyroid surgery or radioiodine; no other medication.'
    ],
    exam: [
      'Agitated, delirious, restless, GCS 13. Sweating profusely with a temperature of **40.6 C**.',
      '**Pulse 152 and irregularly irregular, BP 148/62 with a wide pulse pressure**, respiratory rate 26, SpO2 95%.',
      '**Smooth diffuse goitre with a bruit, lid lag, exophthalmos, fine tremor and warm moist skin.**',
      'Chest clear, heart sounds with an irregular rhythm and no murmur. Abdomen tender suprapubically.',
      'No meningism, no rash, no focal neurology, no needle marks.'
    ],
    base: { hr: 152, sbp: 148, dbp: 62, rr: 26, spo2: 95, temp: 40.6, gcs: 13 },
    drift: { hr: 0.45, sbp: -0.4, dbp: -0.3, rr: 0.3, spo2: -0.28, temp: 0.012, gcs: -0.05 },
    decay: 0.3,
    events: [
      { at: 130, need: ['action:propranolol'], loss: 12, msg: 'No beta-blocker has been given. The heart rate is 165 and the patient is developing signs of high-output cardiac failure.' },
      { at: 260, need: ['action:thionamide'], loss: 12, msg: 'No thionamide has been started. Nothing is blocking new hormone synthesis.' },
      { at: 390, need: ['action:precipitant'], loss: 10, msg: 'The precipitating infection has not been treated. The storm will not settle while the trigger continues.' }
    ],
    actions: [
      A('cooling', 'Active cooling with tepid sponging and fans, plus paracetamol (never aspirin)', 'Aspirin displaces thyroxine from binding proteins.', { cost: 25, tat: 6, factor: 0.7, msg: 'Temperature falling from 40.6 C with active cooling and paracetamol.' }),
      A('fluids', 'IV 0.9% saline with dextrose for volume depletion and depleted glycogen', 'These patients are profoundly catabolic and dry.', { cost: 25, tat: 8, factor: 0.65, msg: 'Fluids and dextrose running; the patient is less tachycardic and more lucid.' }),
      A('propranolol', 'Propranolol 40 mg orally or 1 mg IV slowly (or an esmolol infusion)', 'Controls the heart rate and blocks peripheral conversion of T4 to T3.', { cost: 25, tat: 6, factor: 0.5, msg: 'Heart rate falling from 152 to 118 with better rate control of the atrial fibrillation.' }),
      A('thionamide', 'Propylthiouracil 600-1000 mg loading (or carbimazole 60 mg)', 'Block new hormone synthesis; PTU also blocks peripheral conversion.', { cost: 90, tat: 8, factor: 0.55, msg: 'Thionamide loading dose given — new hormone synthesis is now blocked.' }),
      A('iodine', 'Lugol\u2019s iodine at least one hour AFTER the thionamide (Wolff-Chaikoff effect)', 'Given before the thionamide, it feeds the fire.', { cost: 40, tat: 8, factor: 0.82, msg: 'Iodine given a full hour after the thionamide — release of stored hormone is now blocked.' }),
      A('steroid', 'Hydrocortisone 100 mg IV six-hourly', 'Blocks peripheral conversion and covers relative adrenal insufficiency.', { cost: 30, tat: 6, factor: 0.8, msg: 'Hydrocortisone given; conversion of T4 to the active T3 is reduced.' }),
      A('precipitant', 'Find and treat the precipitant: urine dipstick, cultures, chest imaging', 'A storm does not happen without a trigger.', { cost: 80, tat: 12, factor: 0.85, msg: 'Urine dipstick strongly positive for nitrites and leucocytes — a urinary tract infection. Antibiotics started.' }),
      A('monitor', 'Continuous monitoring, high-dependency or intensive care, strict fluid balance', 'Arrhythmia and cardiac failure are the modes of death.', { cost: 20, tat: 8, factor: 0.88, msg: 'Monitored bed secured with hourly observations.' }),
      A('iodinefirst', 'Give Lugol\u2019s iodine immediately, before any thionamide', 'Iodine loads the gland with substrate.', { cost: 40, tat: 6, factor: 1.5, harm: true, msg: 'Iodine given before the thionamide: the gland used it to synthesise more hormone and the storm worsened.' }),
      A('aspirin', 'Aspirin for the fever', 'Displaces thyroxine from binding proteins.', { cost: 10, tat: 5, factor: 1.3, harm: true, msg: 'Aspirin raised the free thyroxine further by displacing it from binding proteins. Paracetamol would have been safe.' }),
      A('amiodarone', 'IV amiodarone for the atrial fibrillation', 'An iodine-rich drug in a thyrotoxic patient.', { cost: 90, tat: 8, factor: 1.6, harm: true, msg: 'Amiodarone delivered a large iodine load and worsened the thyrotoxicosis.' }),
      A('rai', 'Radioiodine ablation now, during the storm', 'Radioiodine causes thyroiditis and hormone release.', { cost: 500, tat: 20, factor: 1.4, harm: true, msg: 'Radioiodine during a storm released more stored hormone and caused a further deterioration.' }),
      A('restrain', 'Physical restraint and sedation alone for the agitation', 'Sedation without treating the thyrotoxicosis.', { cost: 30, tat: 8, factor: 1.2, harm: true, msg: 'Sedation masked the agitation without treating the underlying thyrotoxicosis, and the tachycardia worsened.' })
    ],
    tests: [
      T('tft', 'Thyroid function tests', 'Bloods', 120, 60, '**Free T4 greater than 100 pmol/L, free T3 32 pmol/L, TSH suppressed below 0.01 mIU/L.** Grossly thyrotoxic.', { flag: 'critical', factor: 0.78 }),
      T('ecg4', '12-lead ECG', 'Bedside', 40, 8, '**Atrial fibrillation with a ventricular rate of 152**, no ischaemic change, no delta wave. High-output strain pattern.', { flag: 'critical', factor: 0.8 }),
      T('uac', 'Urine dipstick, microscopy and culture', 'Microbiology', 90, 50, '**Nitrites and leucocytes positive; Escherichia coli on culture.** The precipitating infection.', { flag: 'critical', factor: 0.85 }),
      T('abg6', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.48, pCO2 30 mmHg, pO2 88 mmHg, HCO3 22, **lactate 2.8 mmol/L** — a mild respiratory alkalosis with high-output strain.', { flag: 'abnormal' }),
      T('fbc5', 'Full blood count', 'Bloods', 45, 30, 'WBC 12.4 with neutrophilia, Hb 12.1, platelets 240 — consistent with infection and thyrotoxicosis.', { flag: 'abnormal' }),
      T('crp4', 'CRP', 'Bloods', 50, 35, '88 mg/L — supports a bacterial precipitant.', { flag: 'abnormal' }),
      T('ue7', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 131, K 3.2, urea 40 mg/dL, creatinine 1.0 — dehydration and thyrotoxic hypokalaemia.', { flag: 'abnormal' }),
      T('lft5', 'Liver function tests', 'Bloods', 90, 45, 'ALT 90 U/L, bilirubin 1.4 mg/dL, ALP 160 U/L — mild thyrotoxic hepatitis. Also relevant because it affects thionamide choice.', { flag: 'abnormal' }),
      T('glucose5', 'Capillary and laboratory glucose', 'Bedside', 15, 8, '8.9 mmol/L — mild hyperglycaemia from catecholamine excess and infection.', { flag: 'abnormal' }),
      T('trab', 'TSH receptor antibodies', 'Special', 200, 100, '**Positive and markedly elevated** — confirms Graves disease as the underlying cause.', { flag: 'abnormal' }),
      T('cortisol', 'Serum cortisol', 'Bloods', 140, 70, '620 nmol/L — adequately raised for the stress. Adrenal insufficiency is excluded as a cause of the shock.', { flag: 'normal' }),
      T('ca3', 'Calcium', 'Bloods', 60, 40, 'Corrected calcium 2.6 mmol/L — mildly raised, a known feature of thyrotoxicosis.', { flag: 'abnormal' }),
      T('bc4', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. The urinary tract is the source.', { flag: 'normal' }),
      T('cxr5', 'Chest X-ray', 'Imaging', 90, 30, 'Normal heart size with clear lung fields. No pneumonia, no cardiac failure yet.', { flag: 'normal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 520, 90, 'Normal. No structural cause for the delirium — the thyrotoxicosis explains it.', { flag: 'normal' })
    ],
    hints: [
      'Fever, delirium, atrial fibrillation and vomiting in a thyrotoxic patient who stopped treatment: block the hormone, block the conversion, block the release — in that order.',
      'Thionamide first, iodine at least an hour later. Reverse the order and you feed the storm.'
    ],
    dx: {
      label: 'Thyroid storm (thyrotoxic crisis) precipitated by urinary tract infection',
      accept: ['thyroid storm', 'thyrotoxic crisis', 'thyroid storm with atrial fibrillation', 'decompensated thyrotoxicosis', 'thyrotoxic storm', 'impending thyroid storm', 'thyroid storm precipitated by infection'],
      reject: [
        { m: ['sepsis', 'septic'], msg: 'Infection is the precipitant, but the free T4 is over 100 pmol/L with a goitre, exophthalmos and a temperature of 40.6 C — this is a thyroid storm.' },
        { m: ['pheochromocytoma', 'phaeochromocytoma'], msg: 'Phaeochromocytoma causes paroxysmal hypertension with sweating and headache, not a diffuse goitre with suppressed TSH and a free T4 above 100 pmol/L.' },
        { m: ['malignant hyperthermia', 'neuroleptic malignant', 'serotonin syndrome'], msg: 'There is no anaesthetic or neuroleptic exposure and no rigidity; the thyroid function is grossly abnormal.' },
        { m: ['heat stroke', 'heatstroke'], msg: 'There is no hot environment or exertion history, and heat stroke does not cause a goitre with a suppressed TSH.' },
        { m: ['meningitis', 'encephalitis'], msg: 'No meningism, no rash, and the delirium is explained by thyrotoxicosis; the CT head is normal.' },
        { m: ['delirium tremens', 'alcohol withdrawal'], msg: 'No alcohol history and no autonomic hyperactivity pattern of withdrawal — the thyroid function is the answer.' },
        { m: ['anticholinergic'], msg: 'There is no dry skin, mydriasis or urinary retention; the skin here is warm and moist.' },
        { m: ['dka', 'ketoacidosis'], msg: 'Glucose is 8.9 mmol/L without ketonaemia or acidosis from ketones.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Known Graves disease with treatment stopped, a precipitating urinary infection, fever of 40.6 C, delirium, atrial fibrillation at 152 and a free T4 above 100 pmol/L: a thyroid storm, at high risk of death without immediate multi-modal blockade.'
    },
    differentials: ['Thyroid storm', 'Sepsis with atrial fibrillation', 'Phaeochromocytoma', 'Malignant hyperthermia', 'Neuroleptic malignant syndrome', 'Serotonin syndrome', 'Heat stroke', 'Meningoencephalitis', 'Delirium tremens', 'Anticholinergic toxicity'],
    mgmt: {
      timeSec: 35,
      options: [
        { id: 'bb3', label: 'Propranolol (or esmolol) for rate control and to block peripheral T4 to T3 conversion', correct: true, msg: 'First-line for the adrenergic storm.' },
        { id: 'ptu', label: 'Propylthiouracil 600-1000 mg loading (or carbimazole 60 mg) to block new hormone synthesis', correct: true, msg: 'Blocks synthesis, and PTU also blocks peripheral conversion.' },
        { id: 'iodine2', label: 'Iodine (Lugol\u2019s) at least one hour after the thionamide to block hormone release', correct: true, msg: 'Order matters: the thionamide must go first.' },
        { id: 'hydro', label: 'Hydrocortisone 100 mg six-hourly to block conversion and cover relative adrenal insufficiency', correct: true, msg: 'Standard adjunct in thyroid storm.' },
        { id: 'support', label: 'Aggressive supportive care: cooling, paracetamol (not aspirin), IV fluids with dextrose, ICU monitoring', correct: true, msg: 'These patients are catabolic, dry and hyperthermic.' },
        { id: 'trigger', label: 'Find and treat the precipitating illness (here a urinary tract infection) with appropriate antibiotics', correct: true, msg: 'The storm will not settle while the trigger persists.' },
        { id: 'cholestyramine', label: 'Consider cholestyramine to interrupt enterohepatic circulation of thyroid hormone', correct: true, msg: 'A useful adjunct in severe storm.' },
        { id: 'iodinefirst2', label: 'Give iodine before the thionamide', correct: false, harm: true, msg: 'Iodine before blocking synthesis provides substrate for more hormone production.' },
        { id: 'aspirin2', label: 'Aspirin for the fever', correct: false, harm: true, msg: 'Aspirin displaces thyroxine from binding proteins and raises free hormone levels. Use paracetamol.' },
        { id: 'amio3', label: 'Amiodarone for the atrial fibrillation', correct: false, harm: true, msg: 'An iodine-rich drug that worsens thyrotoxicosis.' },
        { id: 'rai2', label: 'Radioiodine ablation during the acute storm', correct: false, harm: true, msg: 'Causes thyroiditis with hormone release — reserved for after the patient is euthyroid.' },
        { id: 'surgery3', label: 'Urgent thyroidectomy during the acute storm', correct: false, harm: true, msg: 'Surgery in an untreated thyrotoxic patient risks a fatal thyroid storm under anaesthesia.' },
        { id: 'sedate3', label: 'Sedation alone for the agitation, without treating the thyroid', correct: false, harm: true, msg: 'Masks the agitation while the storm continues.' }
      ]
    },
    debrief: {
      key: ['Known Graves disease with carbimazole stopped three weeks ago and a new urinary infection.', 'Temperature 40.6 C, delirium, atrial fibrillation at 152, wide pulse pressure, goitre with a bruit, lid lag and tremor.', 'Free T4 above 100 pmol/L with a suppressed TSH, and E. coli in the urine.'],
      pearls: ['Order matters: beta-blocker and thionamide first, iodine at least an hour later, plus steroid and cooling.', 'Aspirin is contraindicated for fever in thyrotoxicosis — it displaces thyroxine from binding proteins.', 'Always look for the precipitant: infection, surgery, trauma, iodine load or stopping treatment.'],
      pitfalls: ['Iodine given before a thionamide feeds the storm.', 'Amiodarone and radioiodine both add iodine and worsen the crisis.']
    }
  });

  /* =======================================================================
     CASE 18 — Severe hyperkalaemia with acute kidney injury
     ======================================================================= */
  window.CASES.push({
    id: 'hyperkalaemia',
    title: 'Weak, palpitations and a pulse of 48 in a patient on ramipril and spironolactone',
    category: 'Nephrology',
    difficulty: 'hard',
    blurb: 'Three days of vomiting on top of ACE inhibition, spironolactone and NSAIDs — and the ECG is already changing.',
    timeLimitSec: 600,
    budget: 950,
    who: 'Mr. T., 68-year-old man with heart failure on ramipril, spironolactone and bisoprolol. Three days of vomiting and diarrhoea with reduced oral intake, and he has been taking ibuprofen for back pain. Now he feels weak, light-headed and aware of his heart beating slowly.',
    history: [
      'Three days of vomiting and diarrhoea with poor oral intake; dizzy on standing.',
      'Progressive generalised weakness and palpitations over 24 hours; no chest pain, no syncope.',
      'Ibuprofen 400 mg three times daily for the last five days for back pain.',
      'Heart failure with reduced ejection fraction (LVEF 35%) on ramipril 5 mg, spironolactone 25 mg and bisoprolol 2.5 mg.',
      'No diabetes, no previous dialysis, no haematuria, no loin pain, no urinary retention.'
    ],
    exam: [
      'Alert but pale and weak, GCS 15. Dry mucous membranes with reduced skin turgor.',
      '**Pulse 48 and regular**, BP 104/60, respiratory rate 20, SpO2 96%, temperature 36.4 C.',
      'Heart sounds normal with no murmur and no raised JVP; chest clear; no pulmonary oedema.',
      'Abdomen soft with no palpable bladder, no renal bruit, no peripheral oedema.',
      'Generalised weakness with reduced reflexes but no focal neurology. No rash.'
    ],
    base: { hr: 48, sbp: 104, dbp: 60, rr: 20, spo2: 96, temp: 36.4, gcs: 15 },
    drift: { hr: -0.25, sbp: -0.5, dbp: -0.3, rr: 0.2, spo2: -0.15, temp: 0.003, gcs: -0.04 },
    decay: 0.3,
    events: [
      { at: 110, need: ['action:calcium'], loss: 16, msg: 'No calcium has been given. The QRS is widening further — myocardial membrane stabilisation is the immediate priority.' },
      { at: 250, need: ['action:insulin'], loss: 12, msg: 'No insulin-dextrose has been given. Nothing is shifting potassium into the cells and the level continues to rise.' },
      { at: 380, need: ['action:stopdrugs'], loss: 10, msg: 'Ramipril, spironolactone and ibuprofen are still charted — the causes are still being administered.' }
    ],
    actions: [
      A('calcium', 'IV calcium gluconate 10% 10-30 mL with continuous cardiac monitoring', 'Membrane stabilisation — the first thing to do when the ECG is abnormal.', { cost: 25, tat: 5, factor: 0.4, msg: 'Calcium gluconate given. Within three minutes the QRS has narrowed and the peaked T waves are flattening.' }),
      A('insulin', 'Insulin 10 units with 25 g dextrose IV, followed by a dextrose infusion', 'Shifts potassium into cells; monitor the glucose hourly.', { cost: 40, tat: 8, factor: 0.5, msg: 'Insulin-dextrose running. Potassium falling and a dextrose infusion started to prevent hypoglycaemia.' }),
      A('salbutamol', 'Nebulised salbutamol 10-20 mg', 'A useful adjunct shift, especially with a failing kidney.', { cost: 30, tat: 8, factor: 0.68, msg: 'Nebulised salbutamol given; potassium falling further.' }),
      A('stopdrugs', 'Stop ramipril, spironolactone, ibuprofen and any potassium supplements or salt substitutes', 'Every one of these is raising the potassium.', { cost: 0, tat: 5, factor: 0.7, msg: 'All potassium-raising drugs stopped and the chart annotated. No more will be given.' }),
      A('volume', 'Cautious 0.9% saline for the dehydration to restore renal perfusion', 'He is dry; the kidney needs volume to excrete potassium.', { cost: 20, tat: 8, factor: 0.75, msg: 'Fluid given with a rise in urine output — the kidney can now start excreting potassium.' }),
      A('bicarb', 'Sodium bicarbonate 50 mmol IV if acidotic', 'Only helps if there is a metabolic acidosis.', { cost: 25, tat: 6, factor: 0.88, msg: 'Bicarbonate given for the acidosis; potassium shifting intracellularly.' }),
      A('dialysis', 'Urgent renal referral: dialysis is the definitive treatment for refractory hyperkalaemia with AKI', 'The only way to remove potassium when the kidney cannot.', { cost: 0, tat: 10, factor: 0.6, msg: 'Nephrology have accepted the patient for urgent dialysis if the potassium does not fall, and a line is being arranged.' }),
      A('monitor', 'Continuous ECG monitoring with hourly potassium and glucose checks', 'Watch for recurrence: the shift is temporary.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring established with hourly bloods.' }),
      A('cacl', 'IV calcium chloride 10% through a peripheral cannula', 'Calcium chloride is a tissue irritant and sclerosant.', { cost: 30, tat: 6, factor: 1.2, harm: true, msg: 'Calcium chloride extravasated through the peripheral cannula causing severe tissue necrosis and phlebitis.' }),
      A('resin', 'Oral sodium polystyrene sulfonate as the main treatment', 'Works over hours, not minutes, and does not stabilise the myocardium.', { cost: 35, tat: 10, factor: 1.3, harm: true, msg: 'Resin was given as the sole treatment: it takes hours, and meanwhile the QRS widened further.' }),
      A('continue', 'Continue ramipril, spironolactone and ibuprofen while treating the potassium', 'The original insult continues.', { cost: 0, tat: 4, factor: 1.5, harm: true, msg: 'The drugs causing the hyperkalaemia were continued; the potassium rebounded within two hours.' }),
      A('furo', 'IV furosemide 80 mg as the sole therapy', 'Diuresis in a hypovolaemic patient worsens the AKI.', { cost: 12, tat: 6, factor: 1.3, harm: true, msg: 'Furosemide in an underfilled patient caused further prerenal deterioration and no meaningful potassium loss.' }),
      A('calciumonly', 'Give calcium and consider the problem solved', 'Calcium stabilises the membrane but does not lower potassium.', { cost: 20, tat: 6, factor: 1.4, harm: true, msg: 'Calcium bought minutes of a normal-looking ECG while the potassium continued to climb. The membrane effect wears off.' })
    ],
    tests: [
      T('ue6', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, '**Potassium 7.4 mmol/L**, creatinine 3.2 mg/dL, urea 148 mg/dL, Na 128, **bicarbonate 16**, chloride 108. Severe hyperkalaemia with acute kidney injury.', { flag: 'critical', factor: 0.75 }),
      T('ecg5', '12-lead ECG', 'Bedside', 40, 8, 'Sinus bradycardia 48 with **tall tented T waves, flattened absent P waves, PR prolongation and a widened QRS of 140 ms**. The pre-terminal pattern of hyperkalaemia.', { flag: 'critical', factor: 0.72 }),
      T('abg7', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.26, **pCO2 30 mmHg, HCO3 16**, pO2 92 mmHg, lactate 1.8, K 7.3 — a normal anion gap metabolic acidosis.', { flag: 'abnormal' }),
      T('caph', 'Calcium and phosphate', 'Bloods', 90, 40, 'Corrected calcium 2.05 mmol/L, **phosphate 2.4 mmol/L (high)** — the biochemistry of renal failure.', { flag: 'abnormal' }),
      T('ck', 'Creatine kinase', 'Bloods', 60, 40, '340 U/L — only mildly raised. Rhabdomyolysis is not the explanation for this potassium.', { flag: 'abnormal' }),
      T('uss3', 'Renal ultrasound', 'Imaging', 260, 50, '**Normal-sized kidneys with no hydronephrosis and no obstruction.** Renal parenchymal disease with prerenal insult — no surgical cause.', { flag: 'normal', factor: 0.9 }),
      T('fbc6', 'Full blood count', 'Bloods', 45, 30, 'Hb 11.2 g/dL, WBC 9.0, platelets 210. Normal.', { flag: 'normal' }),
      T('glucose6', 'Capillary and laboratory glucose', 'Bedside', 15, 8, '6.8 mmol/L — normal. Matters because insulin-dextrose will need monitoring.', { flag: 'normal' }),
      T('trop2', 'High-sensitivity troponin', 'Bloods', 60, 35, 'hs-troponin 38 ng/L — mildly raised. Demand from the bradyarrhythmia and renal impairment; the ECG changes are hyperkalaemic, not ischaemic.', { flag: 'abnormal' }),
      T('dig2', 'Serum digoxin level', 'Bloods', 150, 50, 'Undetectable — the patient is not on digoxin. Excludes a common cause of bradycardia with hyperkalaemia.', { flag: 'normal' }),
      T('tsh3', 'Thyroid function tests', 'Bloods', 110, 80, 'Normal. Excludes hypothyroidism as a cause of the bradycardia.', { flag: 'normal' }),
      T('urine', 'Urine sodium and osmolality', 'Bloods', 60, 45, 'Urine sodium 12 mmol/L with an osmolality of 520 mOsm/kg — **a prerenal picture**, supporting volume replacement rather than diuresis.', { flag: 'abnormal' })
    ],
    hints: [
      'An ECG with peaked T waves and a widening QRS needs calcium immediately — stabilise the membrane before you move the potassium.',
      'Nothing here will work while ramipril, spironolactone and ibuprofen are still on the chart. And diuresis in a dry patient makes the kidney worse.'
    ],
    dx: {
      label: 'Severe hyperkalaemia with acute kidney injury (RAAS blockade, spironolactone and NSAIDs)',
      accept: ['severe hyperkalaemia', 'hyperkalaemia with acute kidney injury', 'acute kidney injury with hyperkalaemia', 'hyperkalaemic emergency', 'severe hyperkalemia', 'hyperkalaemia', 'acute kidney injury with severe hyperkalaemia'],
      reject: [
        { m: ['digoxin'], msg: 'The digoxin level is undetectable and he is not on digoxin — the bradycardia and ECG changes are hyperkalaemic.' },
        { m: ['myocardial infarction', 'stemi'], msg: 'The troponin is only mildly raised from demand, and the ECG shows tented T waves with a widened QRS rather than territorial ischaemia.' },
        { m: ['adrenal', 'addison'], msg: 'There is no hyperpigmentation, no hypoglycaemia and no hyponatraemia with hyperkalaemia out of proportion — this is renal failure with RAAS blockade.' },
        { m: ['rhabdomyolysis'], msg: 'The creatine kinase is only 340 U/L. The potassium comes from renal failure, ACE inhibition, spironolactone and NSAIDs.' },
        { m: ['dka', 'ketoacidosis'], msg: 'The glucose is 6.8 mmol/L with no ketonaemia; this is a normal anion gap acidosis of renal failure.' },
        { m: ['hypocalcaemia', 'hypocalcemia'], msg: 'The corrected calcium is 2.05 mmol/L — not low enough to explain the ECG, which shows hyperkalaemic changes.' },
        { m: ['complete heart block'], msg: 'The bradycardia is hyperkalaemic conduction delay with a widened QRS and tented T waves, not primary conduction disease.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Vomiting and diarrhoea with continued ramipril, spironolactone and ibuprofen: potassium 7.4 mmol/L with a metabolic acidosis, an acute kidney injury and the pre-terminal ECG pattern of tented T waves with a widened QRS.'
    },
    differentials: ['Severe hyperkalaemia with acute kidney injury', 'Digoxin toxicity', 'Acute myocardial infarction', 'Adrenal insufficiency', 'Rhabdomyolysis', 'Diabetic ketoacidosis', 'Hypocalcaemia', 'Complete heart block', 'Acute urinary retention with obstruction', 'Metabolic acidosis from sepsis'],
    mgmt: {
      timeSec: 35,
      options: [
        { id: 'ca4', label: 'IV calcium gluconate 10-30 mL immediately for the ECG changes (membrane stabilisation)', correct: true, msg: 'It does not lower potassium — it protects the myocardium while the other measures work.' },
        { id: 'ins', label: 'Insulin 10 units with 25 g dextrose, with hourly glucose monitoring', correct: true, msg: 'Shifts potassium into cells within 15-30 minutes.' },
        { id: 'salb', label: 'Nebulised salbutamol 10-20 mg as an adjunct shift', correct: true, msg: 'Adds to the intracellular shift, particularly useful in renal failure.' },
        { id: 'stop3', label: 'Stop ramipril, spironolactone, NSAIDs and any potassium supplements or salt substitutes', correct: true, msg: 'Removes the cause — otherwise the potassium rebounds immediately.' },
        { id: 'vol', label: 'Restore volume with cautious saline to re-establish renal potassium excretion', correct: true, msg: 'He is prerenal: the kidney needs perfusion to excrete potassium.' },
        { id: 'dial', label: 'Refer for urgent dialysis if hyperkalaemia is refractory or the AKI is severe', correct: true, msg: 'The definitive removal therapy when the kidney cannot do it.' },
        { id: 'monitor3', label: 'Continuous ECG monitoring with repeated potassium and glucose, and treat the acidosis if present', correct: true, msg: 'The shift is temporary — potassium rebounds in a few hours.' },
        { id: 'cacl2', label: 'IV calcium chloride 10% through a peripheral line', correct: false, harm: true, msg: 'Calcium chloride is a sclerosant and causes tissue necrosis if it extravasates — use gluconate peripherally.' },
        { id: 'resin3', label: 'Oral potassium-binding resin as the primary treatment', correct: false, harm: true, msg: 'Slow onset and no membrane stabilisation: it does not treat the immediate danger.' },
        { id: 'cont2', label: 'Continue ramipril, spironolactone and NSAIDs alongside the treatment', correct: false, harm: true, msg: 'The potassium rebounds within hours while the causative drugs continue.' },
        { id: 'furo2', label: 'IV furosemide 80 mg as the sole treatment', correct: false, harm: true, msg: 'Diuresis in a hypovolaemic patient worsens the AKI and does not lower potassium meaningfully.' },
        { id: 'caonly', label: 'Calcium alone, then reassess in an hour', correct: false, harm: true, msg: 'Calcium stabilises the membrane for 30-60 minutes and wears off while the potassium keeps rising.' }
      ]
    },
    debrief: {
      key: ['Vomiting and diarrhoea with continued ramipril, spironolactone and five days of ibuprofen.', 'Pulse 48 with generalised weakness; potassium 7.4 mmol/L, creatinine 3.2 mg/dL and a bicarbonate of 16.', 'ECG shows tented T waves, absent P waves and a QRS of 140 ms — the pre-terminal hyperkalaemic pattern.'],
      pearls: ['Calcium first when the ECG is abnormal, then insulin-dextrose and salbutamol to shift, then remove the potassium and fix the cause.', 'The three-drug combination of ACE inhibitor, potassium-sparing diuretic and NSAID during an acute illness is a classic recipe for fatal hyperkalaemia.', 'The intracellular shift is temporary — repeat the potassium, because it will rebound.'],
      pitfalls: ['Treating hyperkalaemia without stopping the offending drugs guarantees recurrence.', 'Diuresis in a hypovolaemic patient worsens the kidney injury, and calcium alone wears off in under an hour.']
    }
  });

})();
