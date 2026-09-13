/* =========================================================================
   DocSim — case library (part 3): acute emergencies
   Loaded after cases-more.js. Same schema; just push onto window.CASES.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});
  const add = (c) => window.CASES.push(c);

  /* =======================================================================
     CASE 9 — Near-fatal asthma
     ======================================================================= */
  add({
    id: 'asthma',
    title: 'Young asthmatic who can no longer finish a sentence',
    category: 'Respiratory',
    difficulty: 'easy',
    blurb: 'Three days of a cold, twelve puffs of salbutamol in an hour, and now a silent chest.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Ms. N., 24-year-old student. Asthmatic since childhood, usually well controlled on a preventer inhaler. Three days of a viral cold with worsening wheeze and cough. She has used her salbutamol inhaler roughly twelve times in the last hour with no relief.',
    history: [
      'Three days of coryza and dry cough, followed by rapidly worsening breathlessness and wheeze.',
      'Unable to complete a sentence or climb the stairs; slept sitting up last night.',
      'Salbutamol inhaler used every few minutes for the last hour without improvement. Preventer inhaler finished a month ago and not replaced.',
      'No fever, no chest pain, no haemoptysis, no leg swelling. One previous admission to hospital aged 12, never to intensive care.',
      'No aspirin or NSAID use, no new pets, no occupational exposure.'
    ],
    exam: [
      'Sitting forward, tripod position, unable to speak in full sentences, visibly exhausted and sweating.',
      'Pulse 128, BP 118/72, respiratory rate 34, SpO2 89% on room air, temperature 37.1 C, GCS 14.',
      '**Silent chest** — minimal air entry and no audible wheeze bilaterally. Prolonged expiration.',
      'Pulsus paradoxus present. Peak flow unrecordable. No urticaria, no angioedema, no rash.'
    ],
    base: { hr: 128, sbp: 118, dbp: 72, rr: 34, spo2: 89, temp: 37.1, gcs: 14 },
    drift: { hr: 0.5, sbp: -0.35, dbp: -0.22, rr: 0.35, spo2: -0.5, temp: 0.005, gcs: -0.05 },
    decay: 0.28,
    events: [
      { at: 150, need: ['action:nebs'], loss: 12, msg: 'Bronchodilators have not been given: the chest remains silent and the patient is now drowsy between breaths.' },
      { at: 280, need: ['action:steroid'], loss: 8, msg: 'No systemic corticosteroid has been given. The airway inflammation is untouched and the attack will not settle.' },
      { at: 400, need: ['action:magnesium'], loss: 8, msg: 'No magnesium sulfate. A near-fatal attack needs more than repeated beta-agonists.' }
    ],
    actions: [
      A('oxygen', 'Oxygen titrated to SpO2 94-98%', 'Correct the hypoxaemia immediately.', { cost: 15, tat: 4, factor: 0.7, msg: 'SpO2 95% on 4 L. The patient is less agitated already.' }),
      A('nebs', 'Salbutamol 5 mg nebulised back-to-back, with ipratropium 0.5 mg', 'Drive the airway open while the steroid takes hours to work.', { cost: 45, tat: 8, factor: 0.48, msg: 'After the second nebuliser air entry has improved and a widespread wheeze is audible again — a good sign, not a bad one.' }),
      A('steroid', 'Hydrocortisone 100 mg IV or prednisolone 40-50 mg oral', 'Given early in every severe attack.', { cost: 12, tat: 5, factor: 0.78, msg: 'Systemic steroid given. It will take hours, but the clock has started.' }),
      A('magnesium', 'Magnesium sulfate 2 g IV over 20 minutes', 'Smooth muscle relaxation in near-fatal asthma.', { cost: 30, tat: 10, factor: 0.68, msg: 'Magnesium running — air entry continues to improve.' }),
      A('ivaccess', 'IV access, continuous monitoring, sitting upright', 'You may need a bolus drug or an anaesthetist at any moment.', { cost: 20, tat: 6, factor: 0.94, msg: 'Access secured and monitoring applied.' }),
      A('hdu', 'Call for senior and critical care help now, before the patient tires further', 'Near-fatal asthma arrests during intubation, not before it.', { cost: 0, tat: 8, factor: 0.82, msg: 'Anaesthetist, intensivist and senior physician at the bedside. A plan is agreed.' }),
      A('sedation', 'IV midazolam to settle the agitation', 'Sedating a patient with a silent chest and a rising CO2.', { cost: 15, tat: 6, factor: 1.9, harm: true, msg: 'Respiratory rate fell to 14 and the patient became unrousable. Sedation in a severe asthma attack precipitates respiratory arrest.' }),
      A('intubate', 'Immediate intubation with a large tube, no planning, no ketamine', 'Dynamic hyperinflation and cardiac arrest.', { cost: 60, tat: 12, factor: 1.7, harm: true, msg: 'Intubation caused severe dynamic hyperinflation: the chest is distended, the BP has fallen to 70/40 and the patient is peri-arrest.' }),
      A('morphine', 'Morphine for the distress', 'Respiratory depressant in a patient already retaining CO2.', { cost: 12, tat: 6, factor: 1.6, harm: true, msg: 'Respiratory rate and conscious level both fell — a dangerous combination in near-fatal asthma.' }),
      A('beta', 'IV atenolol for the tachycardia', 'Beta blockade in acute bronchospasm.', { cost: 15, tat: 6, factor: 2.0, harm: true, msg: 'The wheeze became inaudible for the wrong reason — catastrophic bronchospasm after beta blockade.' })
    ],
    tests: [
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.28, **pCO2 52 mmHg (rising)**, pO2 60 mmHg on air, HCO3 22, **lactate 2.2**, K 3.2 (salbutamol). A rising or normal CO2 in acute asthma is respiratory failure, not reassurance.', { flag: 'critical', factor: 0.8 }),
      T('pef', 'Peak expiratory flow', 'Bedside', 25, 6, '**Unrecordable** — the patient cannot sustain a forced effort. Less than 33% of predicted = life-threatening.', { flag: 'critical', factor: 0.88 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Hyperinflated lung fields with flattened diaphragms. **No pneumothorax**, no consolidation, normal heart size.', { flag: 'normal', factor: 0.95 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 130 with right axis deviation and peaked P waves. No ischaemic change.', { flag: 'abnormal', factor: 0.97 }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 13.4, **WBC 14.2** with neutrophilia. Steroids and viral illness raise the white count; this does not prove bacterial infection.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 138, **K 3.2**, urea 26, creatinine 0.8. Beta-agonist driven hypokalaemia.', { flag: 'abnormal' }),
      T('crp', 'CRP', 'Bloods', 50, 35, '12 mg/L — mildly raised. Does not change the management of an asthma attack.', { flag: 'abnormal' }),
      T('trop', 'Troponin', 'Bloods', 60, 20, 'Normal. There is no cardiac cause for the breathlessness.', { flag: 'normal' }),
      T('ddimer', 'D-dimer', 'Bloods', 110, 40, '0.9 ug/mL — mildly raised and entirely non-specific in acute severe illness.', { flag: 'abnormal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. There is no evidence of bacterial infection driving this attack.', { flag: 'normal' }),
      T('ct', 'CT chest with contrast', 'Imaging', 620, 90, 'Hyperinflation with air trapping, no embolism, no pneumothorax. A great deal of money and radiation for nothing that changes the next hour.', { flag: 'normal' }),
      T('allergy', 'Specific IgE panel for aeroallergens', 'Special', 380, 120, 'Raised to house dust mite and grass pollen. Interesting for the clinic in six weeks; useless during a life-threatening attack.', { flag: 'abnormal' })
    ],
    hints: [
      'A silent chest with a normal or rising CO2 is not improvement — it is the last stop before arrest.',
      'Steroid, magnesium and back-to-back bronchodilators are the treatment. Sedation and beta blockade are the two ways to kill this patient.'
    ],
    dx: {
      label: 'Acute severe (life-threatening) asthma with hypercapnia',
      accept: ['acute severe asthma', 'life threatening asthma', 'near fatal asthma', 'status asthmaticus', 'severe acute asthma', 'acute asthma', 'asthma exacerbation', 'acute exacerbation of asthma'],
      reject: [
        { m: ['copd', 'chronic obstructive'], msg: 'She is 24 with childhood-onset asthma and no smoking history. This is acute asthma, not COPD.' },
        { m: ['anaphylaxis', 'anaphylactic'], msg: 'There is no urticaria, angioedema or hypotension, and no exposure trigger — this is bronchospasm from asthma.' },
        { m: ['pulmonary embolism', 'embolus'], msg: 'No thromboembolic risk factors, and the picture is airflow obstruction with a silent chest rather than a clear chest with pleuritic pain.' },
        { m: ['pneumothorax'], msg: 'The chest X-ray shows no pneumothorax. The silent chest is severe airflow limitation, not a collapsed lung.' },
        { m: ['pulmonary oedema', 'heart failure', 'cardiac asthma'], msg: 'She has no cardiac history; the film shows hyperinflation and a normal heart size, not oedema.' },
        { m: ['hyperventilation', 'anxiety', 'panic'], msg: 'A rising CO2 with a silent chest and exhaustion is respiratory failure — the opposite of hyperventilation.' },
        { m: ['foreign body'], msg: 'Onset followed a viral illness over days, not a sudden choking episode.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Unable to complete sentences, respiratory rate 34, heart rate 128, SpO2 89%, a silent chest and a **rising pCO2** — the features of a life-threatening asthma attack.'
    },
    differentials: ['Acute severe asthma', 'Anaphylaxis', 'Pulmonary embolism', 'Pneumothorax', 'Acute pulmonary oedema', 'COPD exacerbation', 'Upper airway obstruction', 'Hyperventilation syndrome', 'Bronchiectasis exacerbation', 'Vocal cord dysfunction'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'o2', label: 'Oxygen titrated to 94-98% saturation', correct: true, msg: 'Corrects hypoxaemia without suppressing the respiratory drive.' },
        { id: 'nebs2', label: 'Back-to-back nebulised salbutamol and ipratropium', correct: true, msg: 'First-line bronchodilation, repeated until there is a response.' },
        { id: 'steroid2', label: 'Systemic corticosteroid (oral prednisolone or IV hydrocortisone)', correct: true, msg: 'Treats the inflammation; every severe attack gets it early.' },
        { id: 'mg2', label: 'IV magnesium sulfate 2 g over 20 minutes', correct: true, msg: 'Reduces smooth muscle spasm and admission rates in severe attacks.' },
        { id: 'icu', label: 'Critical care referral with a planned, senior-led intubation strategy if it is needed', correct: true, msg: 'Ketamine, a large tube, long expiratory times and permissive hypercapnia — arranged before the arrest, not during it.' },
        { id: 'monitor', label: 'Continuous SpO2 and ECG monitoring with serial blood gases', correct: true, msg: 'The CO2, not the wheeze, tells you whether the patient is winning.' },
        { id: 'aminophylline', label: 'Consider IV aminophylline or IV salbutamol with cardiac monitoring if the response is poor', correct: true, msg: 'Second-line intravenous therapy for a patient not responding to nebulisers and magnesium.' },
        { id: 'sedate', label: 'IV sedation to reduce distress and oxygen demand', correct: false, harm: true, msg: 'Sedation removes the respiratory drive in a patient who is already retaining CO2.' },
        { id: 'intubate2', label: 'Intubate immediately on arrival without a plan or pre-oxygenation strategy', correct: false, harm: true, msg: 'Dynamic hyperinflation during intubation is the commonest route to cardiac arrest in asthma.' },
        { id: 'beta2', label: 'IV beta-blocker for the tachycardia', correct: false, harm: true, msg: 'Beta blockade in acute bronchospasm causes catastrophic airway obstruction.' },
        { id: 'opioid', label: 'Morphine for the distress', correct: false, harm: true, msg: 'Respiratory depression in a patient who is already tiring.' },
        { id: 'abx2', label: 'Antibiotics as the main treatment for the attack', correct: false, harm: true, msg: 'There is no evidence of bacterial infection; treating the wrong thing delays the right thing.' }
      ]
    },
    debrief: {
      key: ['Unable to complete a sentence, respiratory rate 34, heart rate 128, SpO2 89%.', 'A silent chest with a pulsus paradoxus — minimal air movement, not a quiet recovery.', 'pH 7.28 with a pCO2 of 52 mmHg: hypercapnia in asthma means respiratory failure.'],
      pearls: ['A silent chest plus a rising CO2 means the patient is dying, however "settled" they look.', 'Magnesium and back-to-back nebulisers buy time; the steroid works over hours, so give it early.', 'Involve critical care and anaesthesia before you need them — planned intubation is survivable, emergency intubation is not.'],
      pitfalls: ['Sedation and beta blockade are the two classic fatal errors in acute severe asthma.', 'A normal or rising CO2 is never reassuring in an asthmatic; it means they can no longer compensate.']
    }
  });

  /* =======================================================================
     CASE 10 — Opioid overdose
     ======================================================================= */
  add({
    id: 'opioid',
    title: 'Unresponsive young man in a park with pinpoint pupils',
    category: 'Toxicology',
    difficulty: 'easy',
    blurb: 'Found slumped on a bench, breathing four times a minute, with a syringe on the ground beside him.',
    timeLimitSec: 600,
    budget: 1400,
    who: 'Mr. J., 24-year-old man brought in by ambulance after a passer-by called for help. Found unresponsive on a park bench with a used syringe nearby and a tourniquet mark on his left forearm. No identification, no known history.',
    history: [
      'Found unresponsive, blue around the lips, breathing slowly and noisily.',
      'Paramedics report a respiratory rate of 4-6 per minute with oxygen saturations of 82% on air.',
      'A syringe and a spoon with residue were found at the scene; the patient is known to the local homelessness team as a heroin user.',
      'No history of trauma, no seizure witnessed, no smell of alcohol, no empty medication packets at the scene.',
      'No medical alert bracelet, no insulin pen, no other medication found.'
    ],
    exam: [
      'Unresponsive to painful stimulus, GCS 6 (E1 V2 M3), blue lips and cold peripheries.',
      '**Pinpoint pupils that do not react to light.**',
      'Pulse 52, BP 92/58, **respiratory rate 5 with shallow, gurgling respirations**, SpO2 82% on room air, temperature 36.2 C.',
      'Chest clear; no wheeze, no secretions, no diarrhoea, no sweating. No needle marks other than the left forearm.',
      'No head injury, no rash, no focal neurology. Tone generally reduced.'
    ],
    base: { hr: 52, sbp: 92, dbp: 58, rr: 5, spo2: 82, temp: 36.2, gcs: 6 },
    drift: { hr: -0.25, sbp: -0.45, dbp: -0.28, rr: -0.12, spo2: -0.5, temp: -0.006, gcs: -0.05 },
    decay: 0.34,
    events: [
      { at: 120, need: ['action:airway'], loss: 14, msg: 'No airway support or ventilation. The saturations have fallen to 74% and the patient is bradycardic at 44.' },
      { at: 240, need: ['action:naloxone'], loss: 18, msg: 'The antidote has still not been given. This is a respiratory arrest waiting to happen, and it is entirely reversible.' },
      { at: 380, need: ['action:monitor'], loss: 8, msg: 'No monitoring in place. Naloxone wears off long before heroin does — re-sedation is the trap.' }
    ],
    actions: [
      A('airway', 'Airway opening, suction, bag-valve-mask ventilation with oxygen', 'Ventilate first — the antidote takes a moment to work.', { cost: 20, tat: 5, factor: 0.34, msg: 'Two minutes of bag-valve ventilation and the saturations are 97% with a pinker patient.' }),
      A('naloxone', 'Naloxone 400 micrograms IV or IM, titrated to respiratory rate', 'Titrate to breathing, not to full consciousness.', { cost: 35, tat: 5, factor: 0.42, msg: 'Within two minutes the respiratory rate is 14 and the patient is rousable. He is confused and agitated but he is breathing.' }),
      A('monitor', 'Continuous SpO2 and ECG monitoring, recovery position, IV access', 'Watch for re-sedation as naloxone wears off.', { cost: 20, tat: 8, factor: 0.8, msg: 'Monitoring established; the patient is positioned safely on his side.' }),
      A('repeat', 'Plan for repeat naloxone doses or an infusion (naloxone half-life is shorter than heroin)', 'The re-sedation trap.', { cost: 40, tat: 8, factor: 0.78, msg: 'An infusion is prepared and a repeat bolus is drawn up at the bedside.' }),
      A('glucose', 'Capillary glucose check and thiamine if malnourished', 'Cheap, immediate and easily missed.', { cost: 10, tat: 5, factor: 0.92, msg: 'Glucose 6.4 mmol/L — normal. Thiamine given for a likely poor diet.' }),
      A('warm', 'Warm the patient and recheck the temperature', 'Core temperature, glucose and co-ingestants all matter.', { cost: 10, tat: 8, factor: 0.95, msg: 'Patient warmed with a forced-air blanket.' }),
      A('withhold', 'Withhold naloxone until the toxicology screen confirms opiates', 'Waiting for a laboratory result while the patient is not breathing.', { cost: 0, tat: 6, factor: 1.9, harm: true, msg: 'The respiratory rate has fallen to 3 and the saturations to 68%. The diagnosis is clinical and the antidote is immediate.' }),
      A('bigdose', 'Naloxone 2 mg IV bolus as fast as possible', 'Precipitated withdrawal brings vomiting, agitation and aspiration.', { cost: 45, tat: 5, factor: 1.25, harm: true, msg: 'The patient woke abruptly, vomited, became combative and needed restraint — acute precipitated withdrawal. Titration would have avoided this.' }),
      A('flumazenil', 'Flumazenil 200 micrograms IV to reverse any benzodiazepine', 'No indication, and it causes seizures.', { cost: 60, tat: 6, factor: 1.5, harm: true, msg: 'Flumazenil given with no benzodiazepine on board: the patient seized. The toxicology screen later confirmed opiates only.' }),
      A('charcoal', 'Activated charcoal 50 g orally', 'An unprotected airway and a toxin that charcoal does not bind.', { cost: 25, tat: 10, factor: 1.4, harm: true, msg: 'Charcoal was aspirated into the airway of a patient with no gag reflex — a new pneumonia on top of an overdose.' })
    ],
    tests: [
      T('glucose', 'Capillary glucose', 'Bedside', 10, 6, '6.4 mmol/L — normal. Hypoglycaemia is a common cause of coma and is excluded in seconds.', { flag: 'normal' }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.18, **pCO2 68 mmHg**, pO2 48 mmHg, HCO3 26, lactate 2.0 — **acute respiratory acidosis with hypoxaemia** from hypoventilation.', { flag: 'critical', factor: 0.9 }),
      T('tox', 'Urine toxicology screen', 'Microbiology', 130, 90, '**Opiates positive.** Benzodiazepines, cannabis, amphetamines, cocaine and tricyclics negative.', { flag: 'critical', factor: 0.9 }),
      T('paracetamol', 'Paracetamol and salicylate levels', 'Bloods', 100, 60, 'Both undetectable. Always worth excluding, because a co-ingestion needs its own antidote.', { flag: 'normal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus bradycardia 50 with a normal QTc and no ischaemic change. No conduction delay.', { flag: 'abnormal', factor: 0.97 }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 14.2, WBC 9.1, platelets 240. Normal.', { flag: 'normal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 22, creatinine 0.9, Na 139, K 3.9, bicarbonate 26. Normal — no renal cause for the coma.', { flag: 'normal' }),
      T('ck', 'Creatine kinase', 'Bloods', 60, 40, '210 U/L — mildly raised from lying on a hard bench. Not rhabdomyolysis.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields, normal heart size. No aspiration, no pneumothorax, no pulmonary oedema.', { flag: 'normal' }),
      T('alcohol', 'Blood alcohol level', 'Bloods', 60, 45, 'Undetectable. Alcohol is not contributing to the reduced conscious level.', { flag: 'normal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. There is no infective explanation for this presentation.', { flag: 'normal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 520, 90, 'Normal. No haemorrhage, no mass, no cerebral oedema. A structural cause of coma is excluded — at a price that buys nothing here.', { flag: 'normal' })
    ],
    hints: [
      'Pinpoint pupils, a slow respiratory rate and a clear dry chest: the antidote is immediate and titrated to breathing.',
      'Naloxone wears off before heroin does — plan for re-sedation, and never sedate or give flumazenil.'
    ],
    dx: {
      label: 'Opioid (heroin) overdose with acute respiratory failure',
      accept: ['opioid overdose', 'opiate overdose', 'opioid poisoning', 'opiate toxicity', 'heroin overdose', 'narcotic overdose', 'opioid toxicity', 'opioid intoxication', 'opiate poisoning'],
      reject: [
        { m: ['benzodiazepine'], msg: 'Benzodiazepine overdose causes respiratory depression but not pinpoint pupils, and the urine screen is negative.' },
        { m: ['alcohol'], msg: 'Alcohol is undetectable and does not cause pinpoint pupils with a clear dry chest.' },
        { m: ['organophosphate', 'cholinergic'], msg: 'Organophosphate poisoning also gives pinpoint pupils — but with bronchorrhoea, sweating, diarrhoea and fasciculations. This chest is clear and dry.' },
        { m: ['hypoglycaemia', 'hypoglycemic', 'hypoglycaemic'], msg: 'The capillary glucose is 6.4 mmol/L. Hypoglycaemia is excluded at the bedside.' },
        { m: ['head injury', 'intracranial'], msg: 'No evidence of trauma and the CT head is normal; pinpoint pupils with a respiratory rate of 5 is a toxicological picture.' },
        { m: ['stroke', 'subarachnoid'], msg: 'The CT is normal and there are no focal signs. The pupils and respiratory pattern point to opiates.' },
        { m: ['brainstem'], msg: 'A brainstem lesion can give pinpoint pupils, but the CT is normal and the urine screen is positive for opiates.' },
        { m: ['myxoedema', 'hypothyroid'], msg: 'Myxoedema coma is hypothermic and insidious with a normal respiratory drive response to stimulation — not this.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Pinpoint pupils, a respiratory rate of 5, a GCS of 6 and a clear dry chest after a witnessed intravenous drug use: the opioid toxidrome, confirmed by a positive urine screen.'
    },
    differentials: ['Opioid overdose', 'Organophosphate poisoning', 'Benzodiazepine overdose', 'Alcohol intoxication', 'Hypoglycaemic coma', 'Head injury with intracranial haemorrhage', 'Brainstem stroke', 'Myxoedema coma', 'Carbon monoxide poisoning', 'Mixed drug overdose'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'nal', label: 'Naloxone titrated in small doses to a respiratory rate above 10-12', correct: true, msg: 'Reverses the respiratory depression without precipitating violent withdrawal.' },
        { id: 'vent', label: 'Airway support and bag-valve-mask ventilation with oxygen', correct: true, msg: 'Buys the time the antidote needs and prevents hypoxic brain injury.' },
        { id: 'obs', label: 'Continuous monitoring with repeat naloxone doses or an infusion for 4-6 hours', correct: true, msg: 'Naloxone has a shorter half-life than heroin — re-sedation is the classic trap.' },
        { id: 'coingest', label: 'Exclude co-ingestants (paracetamol, benzodiazepines, alcohol) with levels and a toxicology screen', correct: true, msg: 'Each co-ingestant has its own antidote and its own timetable.' },
        { id: 'glucose2', label: 'Check glucose, give thiamine if nutrition is poor, keep the patient warm', correct: true, msg: 'Cheap measures that prevent a second, easily missed insult.' },
        { id: 'refer', label: 'Refer for addiction services and a mental health assessment before discharge', correct: true, msg: 'Treating the overdose without treating the reason guarantees a repeat.' },
        { id: 'observe', label: 'Observe 4-6 hours after the last naloxone dose before considering discharge', correct: true, msg: 'The safe observation period for a short-acting antidote against a long-acting opioid.' },
        { id: 'flum2', label: 'Flumazenil to reverse any possible benzodiazepine', correct: false, harm: true, msg: 'No indication here, and it provokes seizures in mixed overdose.' },
        { id: 'big', label: 'Naloxone 2 mg IV push to wake the patient up fully', correct: false, harm: true, msg: 'Precipitated withdrawal causes vomiting, aspiration, agitation and occasionally pulmonary oedema.' },
        { id: 'charcoal2', label: 'Activated charcoal through an unprotected airway', correct: false, harm: true, msg: 'Aspiration risk in a patient with no gag reflex; charcoal does not bind opioids meaningfully anyway.' },
        { id: 'wait', label: 'Wait for the laboratory toxicology screen before giving any antidote', correct: false, harm: true, msg: 'The diagnosis is clinical and the patient stops breathing while you wait.' },
        { id: 'discharge', label: 'Discharge as soon as the patient is awake and talking', correct: false, harm: true, msg: 'Re-sedation after naloxone wears off kills patients who looked fine an hour earlier.' }
      ]
    },
    debrief: {
      key: ['Respiratory rate 5, GCS 6, SpO2 82% with pinpoint pupils.', 'A syringe at the scene and a tourniquet mark on the forearm.', 'pH 7.18 with a pCO2 of 68 mmHg — acute respiratory acidosis, and the urine screen is opiate positive.'],
      pearls: ['Ventilate and give naloxone — oxygenation comes before diagnosis.', 'Titrate naloxone to breathing, not to consciousness: full reversal causes vomiting, aspiration and violence.', 'Naloxone is short-acting, so the observation period is part of the treatment.'],
      pitfalls: ['Flumazenil in an unknown overdose can cause seizures.', 'A clear, dry chest with pinpoint pupils means opiates; a wet chest with pinpoint pupils means organophosphate.']
    }
  });

  /* =======================================================================
     CASE 11 — Convulsive status epilepticus
     ======================================================================= */
  add({
    id: 'status',
    title: 'Seizure that will not stop after two days of diarrhoea',
    category: 'Neurology',
    difficulty: 'moderate',
    blurb: 'Known epilepsy, ran out of tablets during a stomach bug, and has been fitting since the ambulance arrived.',
    timeLimitSec: 600,
    budget: 2000,
    who: 'Mr. K., 34-year-old warehouse worker with epilepsy since childhood, controlled on phenytoin. Two days of vomiting and diarrhoea; he has not kept his tablets down since yesterday. Continuous generalised tonic-clonic seizure for about 12 minutes, and 10 mg of buccal midazolam from the paramedics has had no effect.',
    history: [
      'Continuous generalised tonic-clonic seizure starting at home about 12 minutes ago; no recovery of consciousness between convulsions.',
      'Two days of vomiting and diarrhoea with no anticonvulsant since yesterday morning.',
      'Known epilepsy, one previous admission with a prolonged seizure after a similar illness; no previous intensive care admission.',
      'No head injury, no fever before today, no alcohol or recreational drug use, no rash, no recent travel.',
      'No other medication; no drug allergies documented.'
    ],
    exam: [
      'Continuing generalised tonic-clonic convulsion on arrival, with frothing at the mouth and central cyanosis.',
      'GCS 6 between convulsions; no focal deficit can be assessed. **Temperature 38.2 C**, pulse 138, BP 148/86, respiratory rate 26, SpO2 88% on air.',
      'No neck stiffness, no rash, no papilloedema, no head trauma, no needle marks.',
      'Chest clear, heart sounds normal, abdomen soft, no organomegaly. Peripheral glucose 7.1 mmol/L.'
    ],
    base: { hr: 138, sbp: 148, dbp: 86, rr: 26, spo2: 88, temp: 38.2, gcs: 6 },
    drift: { hr: 0.45, sbp: -0.55, dbp: -0.32, rr: 0.3, spo2: -0.4, temp: 0.014, gcs: -0.05 },
    decay: 0.3,
    events: [
      { at: 130, need: ['action:benzo'], loss: 14, msg: 'No benzodiazepine has been given in hospital. The seizure continues and the lactate is climbing.' },
      { at: 270, need: ['action:secondline'], loss: 16, msg: 'No second-line anticonvulsant has been started. This is now established status epilepticus and the patient is developing rhabdomyolysis and hyperthermia.' },
      { at: 400, need: ['action:airway'], loss: 10, msg: 'The airway is unprotected and the saturations are falling — aspiration and hypoxic injury are compounding the seizure.' }
    ],
    actions: [
      A('airway', 'Left lateral position, suction, high-flow oxygen, airway adjunct', 'Protect the airway while the drug works.', { cost: 15, tat: 5, factor: 0.62, msg: 'Airway protected, secretions cleared, SpO2 96% on 15 L.' }),
      A('ivaccess', 'IV access and immediate capillary glucose', 'Never treat a seizure without checking glucose.', { cost: 20, tat: 6, factor: 0.85, msg: 'Access secured; glucose 7.1 mmol/L — normoglycaemic.' }),
      A('benzo', 'IV lorazepam 4 mg slowly (repeat once after 10 minutes if the seizure continues)', 'First-line, and most seizures stop here.', { cost: 25, tat: 8, factor: 0.42, msg: 'Convulsions stopped 90 seconds after lorazepam. The patient remains unconscious but is no longer fitting.' }),
      A('secondline', 'Second-line: IV levetiracetam 60 mg/kg, or phenytoin 20 mg/kg with cardiac monitoring', 'Give it when the benzo fails — do not wait.', { cost: 120, tat: 12, factor: 0.5, msg: 'Levetiracetam loading dose running. The seizure has not returned and no further convulsions occur.' }),
      A('thiamine', 'Thiamine 100 mg IV and glucose if hypoglycaemic', 'Cheap, and prevents Wernicke encephalopathy if nutrition is poor.', { cost: 15, tat: 5, factor: 0.93, msg: 'Thiamine given before any glucose load.' }),
      A('cool', 'Active cooling and paracetamol for the hyperthermia', 'Hyperthermia worsens neuronal injury in status.', { cost: 15, tat: 8, factor: 0.88, msg: 'Temperature falling from 38.2 C with active cooling.' }),
      A('restrain', 'Physical restraint and force oral tablets between convulsions', 'A classic and dangerous error.', { cost: 0, tat: 5, factor: 1.7, harm: true, msg: 'Forcing tablets into a fitting patient caused aspiration and a facial injury. Nothing was absorbed.' }),
      A('fastphen', 'IV phenytoin 20 mg/kg pushed rapidly undiluted without monitoring', 'Rate-related hypotension and arrhythmia.', { cost: 120, tat: 8, factor: 1.6, harm: true, msg: 'Rapid undiluted phenytoin caused profound hypotension and a wide-complex rhythm on the monitor.' }),
      A('flumazenil', 'Flumazenil to reverse the benzodiazepine if the patient stays drowsy', 'Seizures, in the patient you were trying to sedate.', { cost: 60, tat: 6, factor: 1.8, harm: true, msg: 'Flumazenil precipitated a further prolonged convulsion — the opposite of what was needed.' }),
      A('delay', 'Delay second-line treatment until the CT head has been done', 'Imaging never comes before stopping the seizure.', { cost: 0, tat: 6, factor: 1.8, harm: true, msg: 'The seizure continued through the transfer to the scanner: hyperthermia 39.5 C, tachycardia 150 and rising creatine kinase.' })
    ],
    tests: [
      T('glucose2', 'Capillary glucose', 'Bedside', 10, 6, '7.1 mmol/L — normal. The single commonest reversible cause of a seizure, excluded in seconds.', { flag: 'normal' }),
      T('phenytoin', 'Serum phenytoin level', 'Bloods', 110, 40, '**2 mg/L** (therapeutic 10-20 mg/L) — **subtherapeutic**. The patient has not absorbed his anticonvulsant for two days.', { flag: 'critical', factor: 0.85 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.24, pCO2 52 mmHg, pO2 74 mmHg, HCO3 20, **lactate 5.1 mmol/L** — a lactic acidosis from prolonged muscle activity and hypoventilation.', { flag: 'critical', factor: 0.85 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 132, K 3.4, urea 42, creatinine 1.2, **creatine kinase 860 U/L** — dehydration from diarrhoea and early rhabdomyolysis.', { flag: 'abnormal' }),
      T('camg', 'Calcium and magnesium', 'Bloods', 90, 45, 'Adjusted calcium 2.28 mmol/L, **magnesium 0.58 mmol/L (low)** — both can lower the seizure threshold.', { flag: 'abnormal' }),
      T('cbc2', 'Full blood count', 'Bloods', 45, 30, 'Hb 15.8 (haemoconcentrated), WBC 17.2 with neutrophilia, platelets 268. A raised white count is expected after a prolonged seizure.', { flag: 'abnormal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 80, 'No haemorrhage, no mass, no infarct, no cerebral oedema. No structural cause for the seizure — worth excluding, but never before stopping it.', { flag: 'normal', factor: 0.96 }),
      T('tox', 'Urine toxicology screen', 'Microbiology', 130, 90, 'All negative — no cocaine, amphetamines, tricyclics or opiates.', { flag: 'normal' }),
      T('lp', 'Lumbar puncture and CSF analysis', 'Bedside', 180, 70, 'Opening pressure normal, clear CSF, WBC 2/mm3, protein 38 mg/dL, glucose 4.1 mmol/L, Gram stain and culture negative. No meningism and no organisms.', { flag: 'normal' }),
      T('eeg', 'EEG', 'Special', 400, 120, 'Generalised epileptiform discharges with post-ictal slowing. Useful to exclude non-convulsive status later; it does not change the next ten minutes.', { flag: 'abnormal' }),
      T('prolactin', 'Serum prolactin', 'Bloods', 90, 60, 'Raised at 980 mIU/L. A post-ictal rise supports a genuine generalised seizure — a retrospective answer to a question you already know.', { flag: 'abnormal' }),
      T('mri', 'MRI brain with contrast', 'Imaging', 900, 150, 'No structural lesion. The correct investigation for a first seizure, and completely irrelevant while a patient is actively convulsing.', { flag: 'normal' })
    ],
    hints: [
      'A benzodiazepine is first-line and most seizures stop there — give it before any imaging.',
      'The phenytoin level explains everything: he has not absorbed his tablets for two days.'
    ],
    dx: {
      label: 'Convulsive status epilepticus due to anticonvulsant non-adherence',
      accept: ['convulsive status epilepticus', 'status epilepticus', 'generalised status epilepticus', 'generalized status epilepticus', 'prolonged seizure', 'status epilepticus due to non adherence', 'established status epilepticus', 'epilepsy with status epilepticus'],
      reject: [
        { m: ['psychogenic', 'pseudoseizure', 'non epileptic', 'nonepileptic'], msg: 'A lactate of 5.1, a creatine kinase of 860 and a post-ictal prolactin rise all support genuine generalised seizures.' },
        { m: ['meningitis', 'encephalitis'], msg: 'No neck stiffness, no rash, and the CSF is acellular with negative cultures. The fever is from the seizure itself.' },
        { m: ['eclampsia', 'pre eclampsia', 'preeclampsia'], msg: 'This is a 34-year-old man.' },
        { m: ['hypoglycaemia', 'hypoglycemic', 'hypoglycaemic'], msg: 'The glucose is 7.1 mmol/L — hypoglycaemia is excluded.' },
        { m: ['alcohol withdrawal', 'delirium tremens'], msg: 'No alcohol history, and the toxicology screen is negative.' },
        { m: ['overdose', 'poisoning'], msg: 'The toxicology screen is negative; the phenytoin level is subtherapeutic because he has not taken it.' },
        { m: ['subarachnoid', 'stroke', 'haemorrhage', 'hemorrhage'], msg: 'The CT head is normal — no haemorrhage, no infarct.' },
        { m: ['tumour', 'tumor', 'neoplasm'], msg: 'The CT shows no mass lesion.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Continuous generalised convulsions for more than five minutes in a known epileptic who has not absorbed his anticonvulsant for two days, with a subtherapeutic phenytoin level of 2 mg/L.'
    },
    differentials: ['Convulsive status epilepticus', 'Psychogenic non-epileptic seizure', 'Hypoglycaemic seizure', 'Bacterial meningitis', 'Alcohol withdrawal seizure', 'Subarachnoid haemorrhage', 'Acute stroke', 'Drug overdose with seizures', 'Brain tumour', 'Eclampsia'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'benzo2', label: 'IV lorazepam 4 mg (repeat once after 10 minutes if convulsions continue)', correct: true, msg: 'First-line in status epilepticus and effective in most cases.' },
        { id: 'second', label: 'Second-line IV levetiracetam 60 mg/kg (or phenytoin/valproate) without waiting for imaging', correct: true, msg: 'Give it as soon as the benzodiazepine fails — established status needs a second agent.' },
        { id: 'airway2', label: 'Airway protection, oxygen and suction, with early critical care involvement', correct: true, msg: 'Prevents aspiration and hypoxic injury while the drugs work.' },
        { id: 'correct', label: 'Correct glucose, magnesium, calcium and potassium; give thiamine before glucose', correct: true, msg: 'Each of these lowers the seizure threshold and each is easy to fix.' },
        { id: 'refractory', label: 'Plan for refractory status: rapid sequence induction, intubation and a propofol or midazolam infusion to burst suppression on ICU', correct: true, msg: 'The pathway if two agents fail.' },
        { id: 'cause', label: 'Treat the cause: restart and review the anticonvulsant, address the vomiting illness, neurology follow-up', correct: true, msg: 'Non-adherence during gastroenteritis caused this; it must not cause the next one.' },
        { id: 'monitor2', label: 'Continuous monitoring with serial gases, creatine kinase and renal function', correct: true, msg: 'Rhabdomyolysis and acidosis are the complications of prolonged convulsions.' },
        { id: 'restrain2', label: 'Physical restraint with oral anticonvulsants during the convulsion', correct: false, harm: true, msg: 'Injury and aspiration; nothing is absorbed during a seizure.' },
        { id: 'rapid3', label: 'Rapid undiluted IV phenytoin push without cardiac monitoring', correct: false, harm: true, msg: 'Rate-related hypotension and arrhythmia — phenytoin needs dilution, a slow rate and a monitor.' },
        { id: 'flum3', label: 'Flumazenil if the patient remains drowsy after the benzodiazepine', correct: false, harm: true, msg: 'It reverses the anticonvulsant you just gave and provokes further seizures.' },
        { id: 'scanfirst', label: 'Take the patient to CT before any anticonvulsant', correct: false, harm: true, msg: 'Imaging never comes before stopping the seizure; the transfer itself prolongs it.' },
        { id: 'discharge2', label: 'Discharge once the seizure stops, with a prescription for phenytoin', correct: false, harm: true, msg: 'Establish why the level was 2 mg/L, correct the reversible causes and arrange follow-up before discharge.' }
      ]
    },
    debrief: {
      key: ['Continuous generalised convulsions for over 12 minutes with no recovery between them.', 'Two days of vomiting with no anticonvulsant absorbed; phenytoin level 2 mg/L.', 'Lactate 5.1, creatine kinase 860, temperature 38.2 C — the metabolic cost of prolonged convulsions.'],
      pearls: ['A benzodiazepine at the right dose is first-line; escalate to a second agent as soon as it fails.', 'Give oxygen, protect the airway and check glucose before any imaging.', 'Prolonged seizures are metabolic emergencies: lactate, creatine kinase, potassium and temperature all move.'],
      pitfalls: ['Flumazenil is contraindicated — it reverses your own treatment.', 'Waiting for a CT head before treating is one of the commonest causes of refractory status.']
    }
  });

  /* =======================================================================
     CASE 12 — Ruptured ectopic pregnancy
     ======================================================================= */
  add({
    id: 'ectopic',
    title: 'Collapse with severe pelvic pain in a woman with seven weeks of amenorrhoea',
    category: 'Obstetrics & Gynaecology',
    difficulty: 'moderate',
    blurb: 'Sudden severe left iliac fossa pain, a faint on the way to the toilet, and a shoulder-tip ache.',
    timeLimitSec: 600,
    budget: 1800,
    who: 'Ms. S., 26-year-old woman, no significant past medical history, brought in by her partner. Seven weeks of amenorrhoea with a positive home pregnancy test. Sudden severe left iliac fossa pain an hour ago, followed by a collapse and a brief loss of consciousness. She has had light vaginal spotting for two days.',
    history: [
      'Seven weeks of amenorrhoea, home pregnancy test positive five days ago; no antenatal booking yet.',
      'Sudden severe constant left iliac fossa pain an hour ago, radiating to the left shoulder tip when lying flat.',
      'One episode of syncope with dizziness and vomiting; feels "as if something has burst inside".',
      'Light brown vaginal spotting for two days, no clots, no tissue passed, no heavy bleeding.',
      'Previous chlamydia infection treated two years ago. No previous surgery, no intrauterine device, no known fertility problems.'
    ],
    exam: [
      'Pale, clammy and anxious; GCS 14, feels faint when sat up.',
      'Pulse 128 thready, **BP 84/52**, respiratory rate 24, SpO2 98%, temperature 36.9 C.',
      '**Abdomen distended with guarding and rebound tenderness**, maximal in the left iliac fossa. Bowel sounds present but reduced.',
      '**Cervical excitation and left adnexal tenderness** on gentle examination. Uterus feels normal in size, no fetal parts felt.',
      'Capillary refill 4 seconds, cool peripheries, no rash, no urine output recorded since arrival.'
    ],
    base: { hr: 128, sbp: 84, dbp: 52, rr: 24, spo2: 98, temp: 36.9, gcs: 14 },
    drift: { hr: 0.6, sbp: -0.8, dbp: -0.42, rr: 0.3, spo2: -0.2, temp: 0.005, gcs: -0.045 },
    decay: 0.32,
    events: [
      { at: 120, need: ['action:surgical'], loss: 14, msg: 'The gynaecology and surgical teams have not been called. She is bleeding into her abdomen while you work up the pain.' },
      { at: 240, need: ['action:blood'], loss: 16, msg: 'No blood products have been given. The systolic pressure is now 72 mmHg and the pulse 140 — decompensated haemorrhagic shock.' },
      { at: 380, need: ['test:hcg'], loss: 8, msg: 'No pregnancy test has been done. The entire diagnosis turns on a test that takes ten minutes.' }
    ],
    actions: [
      A('surgical', 'Call gynaecology and general surgery immediately and activate the emergency theatre', 'This is a surgical emergency, not a medical one.', { cost: 0, tat: 5, factor: 0.45, msg: 'Theatre alerted and the on-call gynaecologist is on the way. The patient is being moved to the emergency list.' }),
      A('ivaccess', 'Two large-bore IV lines, bloods for crossmatch, and warm blankets', 'Blood loss needs volume and blood, not time.', { cost: 25, tat: 8, factor: 0.7, msg: 'Two 14G lines in place with blood samples on their way to the laboratory.' }),
      A('blood', 'Transfuse (O-negative first, then crossmatched blood) — activate the massive haemorrhage protocol', 'Do not wait for the haemoglobin.', { cost: 300, tat: 12, factor: 0.45, msg: 'O-negative blood running and the massive transfusion pack activated. The blood pressure is responding.' }),
      A('tilt', 'Lie flat with a left lateral tilt; keep the patient warm and do not sit her up', 'Maintain venous return to a bleeding patient.', { cost: 0, tat: 4, factor: 0.92, msg: 'Positioned flat; the patient no longer feels faint when moved.' }),
      A('catheter', 'Urinary catheter and hourly output, high-flow oxygen, continuous monitoring', 'Perfusion targets and a safe transfer.', { cost: 20, tat: 8, factor: 0.88, msg: 'Catheter in, oxygen running, monitoring established.' }),
      A('tranexamic', 'Tranexamic acid 1 g IV', 'Reasonable in major haemorrhage while surgery is arranged.', { cost: 30, tat: 5, factor: 0.85, msg: 'Tranexamic acid given.' }),
      A('waitus', 'Wait for the ultrasound report before calling the surgeon', 'Imaging must never delay surgery in a shocked patient.', { cost: 0, tat: 6, factor: 1.8, harm: true, msg: 'The patient deteriorated in the ultrasound queue: systolic pressure 68 mmHg, GCS 13, and she is still bleeding.' }),
      A('methotrexate', 'Methotrexate 50 mg/m2 IM for the ectopic', 'A treatment for a stable, unruptured ectopic — not this.', { cost: 180, tat: 10, factor: 1.9, harm: true, msg: 'Medical management of a ruptured ectopic in shock: the bleeding continued and no surgical team had been called.' }),
      A('analgesia', 'IM analgesia and reassessment in four hours', 'Sedation and delay in a bleeding patient.', { cost: 15, tat: 6, factor: 1.7, harm: true, msg: 'Sedated, delayed and bleeding. The pain eased while the abdomen filled.' }),
      A('pid', 'Treat as pelvic inflammatory disease with antibiotics and discharge with follow-up', 'A diagnosis that kills when the hCG is positive.', { cost: 60, tat: 8, factor: 2.0, harm: true, msg: 'Antibiotics for a ruptured ectopic pregnancy — the patient became unresponsive shortly afterwards.' })
    ],
    tests: [
      T('hcg', 'Urine and quantitative serum beta-hCG', 'Bloods', 120, 30, '**Serum beta-hCG 2400 IU/L** — well above the discriminatory zone, so an intrauterine pregnancy should be visible on ultrasound. It is not.', { flag: 'critical', factor: 0.8 }),
      T('uss', 'Transabdominal and transvaginal ultrasound', 'Imaging', 260, 45, '**Empty uterus. Free fluid with echoes in the pouch of Douglas and both iliac fossae. A 3 cm left adnexal mass separate from the ovary, with no intrauterine pregnancy.**', { flag: 'critical', factor: 0.75 }),
      T('fast', 'FAST scan (focused assessment with sonography for trauma)', 'Bedside', 200, 20, '**Free fluid in Morison\u2019s pouch, the splenorenal space and the pelvis** — a large haemoperitoneum. Blood is accumulating fast.', { flag: 'critical', factor: 0.72 }),
      T('fbc', 'Full blood count and blood group with crossmatch', 'Bloods', 45, 30, 'Hb 9.8 g/dL (**falling; an early haemoglobin underestimates acute loss**), WBC 14.8, platelets 240. **Blood group O positive, antibody screen negative.**', { flag: 'abnormal', factor: 0.85 }),
      T('abg', 'Arterial or venous blood gas', 'Bloods', 95, 25, 'pH 7.28, **lactate 4.6 mmol/L**, base excess -7, Hb 9.4 — class III haemorrhagic shock.', { flag: 'critical', factor: 0.85 }),
      T('coag2', 'Coagulation screen and fibrinogen', 'Bloods', 90, 45, 'INR 1.3, APTT 38 s, fibrinogen 2.1 g/L. Worth knowing before transfusion, but never a reason to delay it.', { flag: 'abnormal' }),
      T('ue2', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 46, creatinine 1.3 (pre-renal), Na 132, K 3.6.', { flag: 'abnormal' }),
      T('lft2', 'Liver function tests and lipase', 'Bloods', 180, 50, 'Mildly deranged transaminases. Excludes other upper abdominal causes, at a cost of money and minutes.', { flag: 'abnormal' }),
      T('dip', 'Urine dipstick and midstream urine', 'Bedside', 12, 10, 'Trace of blood (from vaginal loss), no nitrites or leucocytes, hCG positive. Does not explain a shocked patient.', { flag: 'normal' }),
      T('prog', 'Serum progesterone', 'Bloods', 110, 60, 'Low at 8 nmol/L — consistent with a failing pregnancy. Confirms what the ultrasound already shows.', { flag: 'abnormal' }),
      T('ct', 'CT abdomen and pelvis with contrast', 'Imaging', 620, 100, 'Large haemoperitoneum with a left adnexal mass. Employs contrast and radiation in a hypotensive pregnant woman, and takes far longer than the scan you already have.', { flag: 'abnormal' }),
      T('cxr2', 'Chest X-ray', 'Imaging', 90, 30, 'Normal. No free air under the diaphragm and no pleural fluid.', { flag: 'normal' })
    ],
    hints: [
      'A positive pregnancy test with an empty uterus, free fluid and shock is a ruptured ectopic until proven otherwise — this needs a surgeon, not a scan.',
      'Shoulder-tip pain and guarding in a woman of childbearing age means blood under the diaphragm.'
    ],
    dx: {
      label: 'Ruptured ectopic pregnancy with haemoperitoneum and hypovolaemic shock',
      accept: ['ruptured ectopic pregnancy', 'ectopic pregnancy', 'tubal ectopic pregnancy', 'ectopic pregnancy with haemoperitoneum', 'ruptured ectopic', 'ectopic gestation', 'ruptured tubal pregnancy'],
      reject: [
        { m: ['appendicitis'], msg: 'Appendicitis does not cause a positive hCG with an empty uterus, free fluid and a 3 cm adnexal mass.' },
        { m: ['torsion'], msg: 'Ovarian torsion gives severe pain but not a haemoperitoneum with hypovolaemic shock, and the hCG would be negative.' },
        { m: ['pelvic inflammatory', 'pid'], msg: 'PID causes fever and bilateral tenderness without free intraperitoneal fluid or shock — and never with an adnexal mass and a positive hCG.' },
        { m: ['urinary tract infection', 'cystitis', 'pyelonephritis'], msg: 'The urine is bland and a urinary infection does not cause a haemoperitoneum.' },
        { m: ['gastroenteritis'], msg: 'Vomiting is a response to pain and bleeding here; the abdomen is guarded with free fluid.' },
        { m: ['ovarian cyst', 'corpus luteum'], msg: 'A ruptured corpus luteum cyst can bleed, but there would be an intrauterine pregnancy or a normal empty uterus without a separate adnexal mass and an hCG of 2400.' },
        { m: ['renal colic', 'calculus'], msg: 'Renal colic causes loin-to-groin pain with haematuria, not shock, guarding and free peritoneal fluid.' },
        { m: ['miscarriage', 'abortion'], msg: 'An empty uterus with a large haemoperitoneum and an adnexal mass is an ectopic pregnancy — a miscarriage bleeds vaginally, not into the abdomen.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Seven weeks of amenorrhoea with a positive hCG of 2400 IU/L, sudden severe pelvic pain, shoulder-tip pain, syncope, guarding and shock: a ruptured ectopic pregnancy with a large haemoperitoneum on FAST.'
    },
    differentials: ['Ruptured ectopic pregnancy', 'Acute appendicitis', 'Ovarian torsion', 'Pelvic inflammatory disease', 'Ruptured ovarian cyst', 'Urinary tract infection', 'Renal colic', 'Acute gastroenteritis', 'Threatened miscarriage', 'Degenerating fibroid'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'surgery', label: 'Emergency laparotomy or laparoscopy by the surgical team without waiting for further imaging', correct: true, msg: 'Surgery is the only treatment that stops the bleeding.' },
        { id: 'resus', label: 'Two large-bore lines with immediate blood products (O-negative then crossmatched) and a massive transfusion protocol', correct: true, msg: 'Blood, not crystalloid, replaces blood loss.' },
        { id: 'tilt2', label: 'Lie flat with a left lateral tilt, keep warm, and avoid sitting the patient up', correct: true, msg: 'Preserves venous return; the tilt also protects the uteroplacental circulation if there is any viable pregnancy.' },
        { id: 'monitor3', label: 'Continuous monitoring, urinary catheter, hourly output and oxygen', correct: true, msg: 'Perfusion targets guide resuscitation during transfer.' },
        { id: 'antid', label: 'Anti-D prophylaxis if the patient is Rh negative', correct: true, msg: 'Prevents sensitisation for future pregnancies.' },
        { id: 'counsel', label: 'Counselling about the loss and about future fertility, with early pregnancy follow-up', correct: true, msg: 'Essential after any pregnancy loss, and easy to forget in the chaos.' },
        { id: 'meth', label: 'Methotrexate for the ectopic pregnancy', correct: false, harm: true, msg: 'Medical management is for a stable, unruptured ectopic with no significant free fluid. In shock it is lethal.' },
        { id: 'scanwait', label: 'Wait for a formal radiology report before calling the surgeon', correct: false, harm: true, msg: 'Delay in a patient who is actively bleeding into her abdomen.' },
        { id: 'crystalloid', label: 'Resuscitate with 3 litres of crystalloid and reassess before arranging surgery', correct: false, harm: true, msg: 'Large-volume crystalloid dilutes clotting factors and worsens outcomes in haemorrhage — and it does not stop the bleeding.' },
        { id: 'abx', label: 'Treat empirically for pelvic inflammatory disease and observe', correct: false, harm: true, msg: 'Antibiotics for a surgical emergency.' },
        { id: 'home', label: 'Discharge with analgesia and an early pregnancy assessment appointment', correct: false, harm: true, msg: 'Discharging a shocked patient with a haemoperitoneum is fatal.' },
        { id: 'opiate', label: 'Heavy sedation to control the pain before reassessing in an hour', correct: false, harm: true, msg: 'Sedation masks the deterioration and delays the only treatment that works.' }
      ]
    },
    debrief: {
      key: ['Seven weeks of amenorrhoea with a positive hCG and light vaginal spotting.', 'Sudden severe pelvic pain, syncope and left shoulder-tip pain — blood under the diaphragm.', 'Shock with guarding, an empty uterus on ultrasound, free fluid on FAST and a beta-hCG of 2400 IU/L.'],
      pearls: ['Any woman of childbearing age with abdominal pain gets a pregnancy test. It costs minutes and it saves lives.', 'In a shocked patient with free fluid, the operating theatre comes before the radiology department.', 'Shoulder-tip pain with pelvic pain is diaphragmatic irritation from intraperitoneal blood.'],
      pitfalls: ['An early haemoglobin underestimates acute blood loss — treat the patient, not the number.', 'Methotrexate in a ruptured ectopic and large-volume crystalloid instead of blood are both common and dangerous errors.']
    }
  });

})();
