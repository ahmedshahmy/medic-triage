/* =========================================================================
   DocSim — case library (part 7): cardiorespiratory emergencies
   Oxygen, preload and the two ways to obstruct a heart.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 23 — Hypercapnic COPD exacerbation
     ======================================================================= */
  window.CASES.push({
    id: 'copd',
    title: 'Drowsy COPD patient given 15 litres of oxygen by the ambulance crew',
    category: 'Respiratory',
    difficulty: 'easy',
    blurb: 'Four days of purulent sputum and worsening breathlessness, now barely rousable on high-flow oxygen.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Mr. G., 68-year-old retired carpenter with COPD (FEV1 40% predicted, 40 pack-years) and a known CO2 retainer — his last arterial gas showed a pCO2 of 7.5 kPa. Four days of worsening breathlessness with green purulent sputum; the ambulance crew applied 15 litres of oxygen through a reservoir mask.',
    history: [
      'Four days of increasing breathlessness, cough with green sputum and two nights of orthopnoea.',
      'Increasing drowsiness over the last six hours, according to his wife.',
      'Home nebulisers and a long-acting bronchodilator; no oral steroids in the last year, no home oxygen.',
      'Two previous admissions with exacerbations, both needing non-invasive ventilation. He has never been intubated.',
      'No chest pain, no haemoptysis, no fever at home, no leg swelling before this week.'
    ],
    exam: [
      'Drowsy but rousable, GCS 13, able to answer simple questions slowly. **Flushed and warm with a fine tremor and bounding pulse.**',
      'Pulse 112, BP 138/76, respiratory rate 26 and shallow, **SpO2 88% on the ambulance oxygen**, temperature 37.8 C.',
      '**Barrel chest with a prolonged expiratory phase, widespread expiratory wheeze and coarse crackles at both bases.**',
      'Nicotine staining, pursed-lip breathing at rest, mild peripheral oedema of the ankles.',
      'No focal chest signs, no pneumothorax, no calf tenderness.'
    ],
    base: { hr: 112, sbp: 138, dbp: 76, rr: 26, spo2: 88, temp: 37.8, gcs: 13 },
    drift: { hr: 0.45, sbp: -0.4, dbp: -0.25, rr: 0.3, spo2: -0.3, temp: 0.01, gcs: -0.06 },
    decay: 0.26,
    events: [
      { at: 130, need: ['action:niv'], loss: 12, msg: 'No non-invasive ventilation has been started. The pH has fallen to 7.18 with a pCO2 of 11 kPa and the patient is now barely rousable.' },
      { at: 260, need: ['action:abx'], loss: 8, msg: 'No antibiotic for the purulent sputum. Infection drives the airway inflammation and the hypercapnia.' },
      { at: 300, need: ['test:abg'], loss: 10, msg: 'No blood gas has been taken. You are managing a known CO2 retainer without knowing what the carbon dioxide is doing.' }
    ],
    actions: [
      A('oxygen', 'Controlled oxygen through a 24-28% Venturi mask, target saturations 88-92%', 'In a CO2 retainer, more oxygen is not better.', { cost: 15, tat: 4, factor: 0.55, msg: 'Oxygen reduced to 28%: saturations 89%, and within ten minutes the drowsiness is lifting as the CO2 starts to fall.' }),
      A('nebs', 'Nebulised salbutamol 5 mg and ipratropium 0.5 mg, driven by air or controlled oxygen', 'Nebulisers driven by oxygen deliver a large unmeasured dose.', { cost: 45, tat: 6, factor: 0.6, msg: 'After two back-to-back nebulisers the wheeze is quieter, air entry is better and the respiratory rate has fallen to 22.' }),
      A('steroid', 'Prednisolone 30 mg orally or hydrocortisone 100 mg IV', 'Shortens recovery and reduces relapse in every exacerbation.', { cost: 12, tat: 5, factor: 0.78, msg: 'Systemic steroid given; the airway inflammation will settle over the next 24-72 hours.' }),
      A('niv', 'Early non-invasive ventilation (BiPAP) for the hypercapnic acidosis', 'The treatment that prevents intubation and reduces mortality.', { cost: 150, tat: 10, factor: 0.42, msg: 'BiPAP started with good tolerance: the respiratory rate is 18, the pH is improving and the patient is more alert.' }),
      A('abx', 'Antibiotic for the purulent sputum (amoxicillin, doxycycline or co-amoxiclav per local policy)', 'Purulent sputum plus increased breathlessness = treat.', { cost: 60, tat: 6, factor: 0.78, msg: 'Antibiotic started; the infective driver of this exacerbation is being treated.' }),
      A('monitor', 'Continuous oximetry with a repeat arterial gas in 30-60 minutes', 'You cannot manage hypercapnia without measuring it.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring established with a repeat gas planned and an escalation trigger documented.' }),
      A('stopsed', 'Review and stop any sedative or opioid; avoid sedation', 'Sedatives remove the respiratory drive.', { cost: 0, tat: 5, factor: 0.9, msg: 'Drug chart reviewed; nothing sedating will be given.' }),
      A('physio', 'Chest physiotherapy, mucolytics and sitting the patient up', 'Supports clearance of the purulent secretions.', { cost: 15, tat: 10, factor: 0.95, msg: 'Physiotherapy started; the patient is clearing secretions more effectively.' }),
      A('highflow', 'High-flow oxygen 15 L via a reservoir mask', 'The classic way to cause CO2 narcosis in a retainer.', { cost: 25, tat: 4, factor: 1.6, harm: true, msg: 'Saturations rose to 99% and the patient became unrousable. The repeat gas shows a pCO2 of 10.4 kPa — oxygen-induced hypercapnia from loss of hypoxic drive and the Haldane effect.' }),
      A('sedate', 'IV sedation for the agitation and breathlessness', 'Removes the drive to breathe in a patient already retaining CO2.', { cost: 20, tat: 5, factor: 1.7, harm: true, msg: 'After sedation the respiratory rate fell to 8 and the patient needed bag-valve-mask ventilation — an avoidable intubation.' }),
      A('delayniv', 'Withhold non-invasive ventilation until the patient is comatose', 'NIV works best before the patient is exhausted.', { cost: 0, tat: 5, factor: 1.5, harm: true, msg: 'Waiting until coma meant intubation and a prolonged intensive care stay with a much higher mortality risk.' }),
      A('intubate', 'Immediate intubation before any trial of non-invasive ventilation', 'A patient who is protecting his airway deserves a trial of NIV first.', { cost: 250, tat: 12, factor: 1.25, harm: true, msg: 'Intubated without a NIV trial: prolonged ventilation, higher mortality and a difficult wean in severe COPD.' })
    ],
    tests: [
      T('abg', 'Arterial blood gas on controlled oxygen', 'Bloods', 95, 20, 'pH 7.26, **pCO2 9.5 kPa (71 mmHg)**, pO2 6.6 kPa, **HCO3 30 mmol/L** (chronically raised), lactate 1.8. **Acute-on-chronic hypercapnic respiratory acidosis.**', { flag: 'critical', factor: 0.75 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, '**Hyperinflated lungs with flattened diaphragms and a narrow mediastinum.** No consolidation, no pneumothorax, no pleural effusion, normal heart size.', { flag: 'abnormal', factor: 0.95 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 112 with peaked P waves (P pulmonale) and right axis deviation. No ischaemic change.', { flag: 'abnormal', factor: 0.97 }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, '**Hb 17.2 g/dL (secondary polycythaemia)**, WBC 12.4, platelets 300 — chronic hypoxaemia with a superimposed infection.', { flag: 'abnormal' }),
      T('crp', 'CRP', 'Bloods', 50, 35, '48 mg/L — supports a bacterial infective trigger.', { flag: 'abnormal' }),
      T('sputum', 'Sputum culture', 'Microbiology', 90, 90, '**Haemophilus influenzae** with numerous neutrophils — a typical exacerbation pathogen.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 138, **K 3.4** (beta-agonist driven), urea 34 mg/dL, creatinine 1.1 mg/dL, bicarbonate 30 mmol/L. The raised bicarbonate tells you this retention is chronic.', { flag: 'abnormal' }),
      T('bnp', 'NT-proBNP', 'Bloods', 130, 50, '**55 pg/mL — normal.** Argues strongly against a cardiac cause for the breathlessness, which matters when the chest X-ray shows hyperinflation.', { flag: 'normal', factor: 0.95 }),
      T('theophylline', 'Theophylline level', 'Bloods', 110, 50, 'Undetectable. He is not on theophylline, and routine use is no longer recommended because of arrhythmia and toxicity.', { flag: 'normal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. Excludes bacteraemia but not the airway infection.', { flag: 'normal' }),
      T('glucose', 'Capillary glucose', 'Bedside', 15, 8, '7.8 mmol/L — normal. Steroid therapy will need glucose monitoring.', { flag: 'normal' }),
      T('ct', 'CT chest with contrast', 'Imaging', 620, 90, 'Centrilobular emphysema with no pulmonary embolism, no consolidation and no pneumothorax. Far too slow and expensive to change what you do in the next hour.', { flag: 'normal' }),
      T('echo', 'Transthoracic echocardiogram', 'Imaging', 200, 60, 'Normal left ventricular function with mild right ventricular dilatation from chronic lung disease. Excludes a cardiac cause but does not alter emergency management.', { flag: 'abnormal' })
    ],
    hints: [
      'A known CO2 retainer who becomes drowsy on high-flow oxygen has oxygen-induced hypercapnia: reduce the oxygen and start non-invasive ventilation.',
      'Target saturations of 88-92% in COPD. The blood gas, not the saturation, tells you how the patient is doing.'
    ],
    dx: {
      label: 'Acute hypercapnic exacerbation of COPD (type 2 respiratory failure)',
      accept: ['acute exacerbation of copd', 'copd exacerbation', 'acute hypercapnic respiratory failure', 'type 2 respiratory failure', 'copd with co2 retention', 'acute on chronic copd', 'exacerbation of chronic obstructive pulmonary disease'],
      reject: [
        { m: ['asthma'], msg: 'He is 68 with 40 pack-years, a barrel chest and an FEV1 of 40% predicted with chronic CO2 retention — this is COPD, not asthma.' },
        { m: ['pneumonia'], msg: 'There is no consolidation on the film: the purulent sputum reflects an infective exacerbation of bronchitis, and the failure is hypercapnic rather than a parenchymal problem.' },
        { m: ['pneumothorax'], msg: 'The chest X-ray shows hyperinflation but no pneumothorax, and the trachea is central.' },
        { m: ['pulmonary embolism'], msg: 'No pleuritic pain or thromboembolic risk factors; the presentation is an infective exacerbation with a chronically raised bicarbonate.' },
        { m: ['pulmonary oedema', 'heart failure'], msg: 'The NT-proBNP is 55 pg/mL — normal. This is not cardiac failure.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A known CO2 retainer with four days of purulent sputum and breathlessness, now drowsy on high-flow oxygen, with a pH of 7.26, a pCO2 of 9.5 kPa and a chronically raised bicarbonate of 30: acute-on-chronic hypercapnic respiratory failure.'
    },
    differentials: ['Acute hypercapnic exacerbation of COPD', 'Acute severe asthma', 'Community-acquired pneumonia', 'Tension pneumothorax', 'Pulmonary embolism', 'Acute cardiogenic pulmonary oedema', 'Pleural effusion', 'Upper airway obstruction', 'Opioid-induced hypoventilation', 'Bronchiectasis exacerbation'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'controlled', label: 'Controlled oxygen via a Venturi mask to a target of 88-92%', correct: true, msg: 'Titrated oxygen prevents hypercapnia while treating the hypoxaemia.' },
        { id: 'niv2', label: 'Early non-invasive ventilation for the hypercapnic acidosis (pH below 7.35 with a raised CO2)', correct: true, msg: 'Reduces intubation, length of stay and mortality.' },
        { id: 'neb', label: 'Nebulised bronchodilators driven by air, with ipratropium', correct: true, msg: 'Relieves bronchospasm without delivering uncontrolled oxygen.' },
        { id: 'ster', label: 'Systemic corticosteroid (prednisolone 30 mg or IV hydrocortisone)', correct: true, msg: 'Accelerates recovery and reduces relapse.' },
        { id: 'anti', label: 'Antibiotics for purulent sputum', correct: true, msg: 'Treats the infective driver.' },
        { id: 'gas', label: 'Repeat arterial gases within 30-60 minutes and monitor with continuous oximetry', correct: true, msg: 'The only way to know whether the ventilation is working.' },
        { id: 'escalate', label: 'Document an escalation plan and what the patient would want, and avoid sedation', correct: true, msg: 'Most COPD patients who need ventilation can be managed without intubation.' },
        { id: 'hf', label: 'High-flow oxygen until the saturations are normal', correct: false, harm: true, msg: 'Oxygen-induced hypercapnia: the commonest iatrogenic cause of deterioration in COPD.' },
        { id: 'sed2', label: 'IV sedation for the agitation', correct: false, harm: true, msg: 'Removes the respiratory drive and leads to intubation.' },
        { id: 'late', label: 'Withhold non-invasive ventilation until the patient is comatose', correct: false, harm: true, msg: 'NIV works before exhaustion; waiting until coma converts a preventable intubation into a prolonged one.' },
        { id: 'intub2', label: 'Intubate immediately without a trial of NIV', correct: false, harm: true, msg: 'Avoids a treatment that works in most hypercapnic exacerbations and carries a higher mortality in COPD.' },
        { id: 'diuretic', label: 'IV furosemide for the ankle oedema', correct: false, harm: true, msg: 'The oedema is cor pulmonale from chronic hypoxaemia, not fluid overload — diuresis worsens the preload and the renal function.' }
      ]
    },
    debrief: {
      key: ['Known CO2 retainer with four days of purulent sputum, now drowsy after 15 litres of oxygen.', 'Barrel chest, widespread wheeze, SpO2 88% with a fine tremor and bounding pulse.', 'pH 7.26 with a pCO2 of 9.5 kPa and a chronically raised bicarbonate of 30: acute-on-chronic type 2 failure.'],
      pearls: ['In COPD the oxygen target is 88-92% — both hypoxia and hyperoxia kill, in different ways.', 'Non-invasive ventilation is the intervention that avoids intubation; start it early, not at the point of coma.', 'A raised bicarbonate with a raised CO2 means chronic retention, so judge the acute change against the patient\'s baseline gas.'],
      pitfalls: ['High-flow oxygen for a retainer is the classic iatrogenic error.', 'Treating the ankle oedema of cor pulmonale with a diuretic worsens preload without touching the lung problem.']
    }
  });

  /* =======================================================================
     CASE 24 — Acute cardiogenic pulmonary oedema
     ======================================================================= */
  window.CASES.push({
    id: 'apoedema',
    title: 'Sitting bolt upright with pink frothy sputum',
    category: 'Cardiology',
    difficulty: 'moderate',
    blurb: 'Two nights of orthopnoea, now drowning: saturations 86%, bibasal crackles and a blood pressure of 178/98.',
    timeLimitSec: 600,
    budget: 1600,
    who: 'Mr. P., 72-year-old retired bus driver with ischaemic cardiomyopathy (previous inferior myocardial infarction, LVEF 30%) and permanent atrial fibrillation. Two days of worsening orthopnoea and ankle swelling, now unable to speak in sentences with pink frothy sputum.',
    history: [
      'Two nights of waking up gasping, needing four pillows, with increasing ankle swelling.',
      'Sudden severe breathlessness over the last two hours with pink frothy sputum.',
      'Known heart failure with an ejection fraction of 30%, on furosemide, ramipril and bisoprolol. He stopped his diuretic a week ago because of urinary inconvenience.',
      'Palpitations for two days with a fast irregular pulse. No chest pain, no fever, no pleuritic pain.',
      'No recent immobilisation, no leg pain, no previous thromboembolism.'
    ],
    exam: [
      'Sitting bolt upright, grey and sweating, unable to complete a sentence. GCS 14.',
      'Pulse 118 irregularly irregular, **BP 178/98**, respiratory rate 32, **SpO2 86% on room air**, temperature 36.6 C.',
      '**Widespread coarse crackles to the mid-zones bilaterally with pink frothy sputum at the mouth.**',
      '**Raised JVP with a loud third heart sound and a pansystolic murmur at the apex.** Cool peripheries, capillary refill 4 seconds.',
      'Bilateral pitting oedema to the mid-shins. Calves soft and non-tender.'
    ],
    base: { hr: 118, sbp: 178, dbp: 98, rr: 32, spo2: 86, temp: 36.6, gcs: 14 },
    drift: { hr: 0.4, sbp: -0.55, dbp: -0.32, rr: 0.35, spo2: -0.45, temp: 0.004, gcs: -0.05 },
    decay: 0.28,
    events: [
      { at: 120, need: ['action:cpap'], loss: 12, msg: 'No non-invasive ventilation. The patient is tiring, the respiratory rate is climbing and the CO2 is starting to rise — the transition from type 1 to type 2 failure.' },
      { at: 250, need: ['action:furo'], loss: 10, msg: 'No diuretic has been given. The patient is fluid overloaded and the kidneys are not being asked to help.' },
      { at: 380, need: ['action:trigger'], loss: 8, msg: 'The fast atrial fibrillation has not been addressed — the trigger for this decompensation is still running.' }
    ],
    actions: [
      A('situp', 'Sit the patient upright and give oxygen titrated to 94-98%', 'Posture alone buys a surprising amount of lung volume.', { cost: 15, tat: 4, factor: 0.6, msg: 'Sitting upright with oxygen: saturations 94% and the work of breathing visibly reduced.' }),
      A('furo', 'IV furosemide 40-80 mg (his usual dose doubled, given intravenously)', 'Venodilation first, diuresis later.', { cost: 25, tat: 6, factor: 0.6, msg: 'Furosemide given: within 30 minutes the breathlessness has eased and urine output is under way.' }),
      A('gtn', 'Nitrate infusion (GTN) titrated to blood pressure, starting at 10-20 micrograms/min', 'The most effective venodilator for acute pulmonary oedema.', { cost: 30, tat: 8, factor: 0.55, msg: 'GTN running with the systolic held above 110: crackles are clearing from the bases.' }),
      A('cpap', 'CPAP or non-invasive ventilation (BiPAP) with PEEP of 5-10 cmH2O', 'Recruits flooded alveoli and reduces the work of breathing.', { cost: 150, tat: 10, factor: 0.5, msg: 'CPAP at 7.5 cmH2O: respiratory rate 22, saturations 96%, and the patient can speak in sentences again.' }),
      A('monitor', 'Continuous monitoring, urinary catheter and strict fluid balance', 'You cannot manage overload without an output chart.', { cost: 20, tat: 10, factor: 0.85, msg: 'Monitoring and strict input-output charting established.' }),
      A('opioid', 'Small titrated doses of IV opioid for distress and breathlessness', 'Helpful in small doses; harmful in large ones.', { cost: 12, tat: 6, factor: 0.92, msg: 'Small dose of morphine given with a reduction in distress and no fall in respiratory rate.' }),
      A('trigger', 'Identify and treat the trigger: fast atrial fibrillation, ischaemia or infection', 'Decompensation always has a cause.', { cost: 40, tat: 10, factor: 0.9, msg: 'The fast AF is being treated with rate control and the trigger has been addressed.' }),
      A('fluids', 'IV crystalloid 500 mL bolus for the low blood pressure', 'This is not hypovolaemia: the patient is waterlogged.', { cost: 18, tat: 8, factor: 1.7, harm: true, msg: 'The fluid bolus flooded the patient further: saturations fell to 78%, the frothy sputum increased and intubation became imminent.' }),
      A('bb', 'IV beta-blocker to slow the atrial fibrillation', 'Rate control before the patient is stabilised can tip them over.', { cost: 20, tat: 6, factor: 1.5, harm: true, msg: 'IV beta-blockade caused an abrupt fall in cardiac output: BP 96/60 with worsening pulmonary oedema and a rising lactate.' }),
      A('bigopioid', 'Morphine 10 mg IV as a bolus', 'Large doses cause respiratory depression and worsen outcomes.', { cost: 15, tat: 6, factor: 1.3, harm: true, msg: 'After 10 mg of morphine the respiratory rate fell to 10 with worsening hypercapnia. Small titrated doses are the rule.' }),
      A('flat', 'Lay the patient flat to examine the abdomen and site a central line', 'Lying a patient with pulmonary oedema flat is dangerous.', { cost: 0, tat: 5, factor: 1.4, harm: true, msg: 'Laid flat, the patient became severely distressed with saturations of 76% — orthopnoea is protective.' })
    ],
    tests: [
      T('cxr', 'Chest X-ray (erect)', 'Imaging', 90, 25, '**Alveolar oedema with perihilar bat-wing shadowing, upper lobe diversion, small bilateral effusions and cardiomegaly.** A normal heart size would argue against cardiogenic oedema.', { flag: 'critical', factor: 0.8 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.31, **pO2 55 mmHg**, pCO2 45 mmHg, HCO3 22, **lactate 2.6 mmol/L**. A normal or rising CO2 in acute pulmonary oedema means the patient is tiring.', { flag: 'critical', factor: 0.8 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, '**Atrial fibrillation with a ventricular rate of 118**, inferior Q waves from the old infarct, left ventricular hypertrophy, no acute ST elevation.', { flag: 'critical', factor: 0.85 }),
      T('trop', 'High-sensitivity troponin (serial)', 'Bloods', 60, 35, 'hs-troponin 88 ng/L, unchanged on the repeat — demand from the tachyarrhythmia and wall stress rather than an acute plaque rupture. Serial sampling is what separates the two.', { flag: 'abnormal' }),
      T('bnp', 'NT-proBNP', 'Bloods', 130, 50, '**2400 pg/mL** — grossly raised, consistent with decompensated heart failure.', { flag: 'abnormal', factor: 0.95 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 132, K 3.6, urea 62 mg/dL, **creatinine 1.6 mg/dL** (worse than his baseline) — cardiorenal compromise from congestion.', { flag: 'abnormal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 12.4, WBC 8.2, platelets 240. Nothing to suggest infection as the trigger.', { flag: 'normal' }),
      T('echo', 'Transthoracic echocardiogram', 'Imaging', 200, 60, '**Severe left ventricular systolic dysfunction (LVEF 22%), moderate functional mitral regurgitation, bi-atrial dilatation, no vegetation, no pericardial effusion.** Confirms the mechanism and rules out endocarditis.', { flag: 'abnormal', factor: 0.9 }),
      T('tft', 'Thyroid function tests', 'Bloods', 110, 70, 'Normal. Thyrotoxicosis is a classic cause of new or fast atrial fibrillation and should be excluded in every patient.', { flag: 'normal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. Worth taking before antibiotics if infection is suspected as the trigger.', { flag: 'normal' }),
      T('ddimer', 'D-dimer', 'Bloods', 110, 45, 'Raised at 1.8 ug/mL — entirely non-specific in a patient with heart failure and congestion, and a common route to unnecessary imaging.', { flag: 'abnormal' }),
      T('ct', 'CT pulmonary angiogram', 'Imaging', 620, 90, 'No pulmonary embolism; pulmonary oedema and pleural effusions. A costly answer to a question the chest X-ray and the examination had already settled.', { flag: 'abnormal' }),
      T('glucose', 'Capillary glucose', 'Bedside', 15, 8, '6.9 mmol/L — normal.', { flag: 'normal' })
    ],
    hints: [
      'Sit the patient up, oxygenate, offload with nitrate and diuretic, and add CPAP early — the combination works faster than any single drug.',
      'This patient is waterlogged with a blood pressure of 178/98: a fluid bolus and a beta-blocker are both the wrong way round.'
    ],
    dx: {
      label: 'Acute cardiogenic pulmonary oedema from decompensated heart failure',
      accept: ['acute pulmonary oedema', 'acute cardiogenic pulmonary oedema', 'acute decompensated heart failure', 'flash pulmonary oedema', 'acute left ventricular failure', 'cardiogenic pulmonary edema', 'decompensated heart failure with pulmonary edema'],
      reject: [
        { m: ['copd'], msg: 'He is a non-smoker with an orthopnoeic, frothy presentation, a third heart sound and a BNP of 2400 — this is cardiac, not obstructive.' },
        { m: ['asthma'], msg: 'There is no wheeze-dominant obstructive picture; the crackles are alveolar flooding with a raised JVP and a third heart sound.' },
        { m: ['pneumonia'], msg: 'The shadowing is perihilar and bilateral with effusions and cardiomegaly; there is no fever, and the BNP is 2400 pg/mL.' },
        { m: ['pulmonary embolism'], msg: 'The chest X-ray shows alveolar oedema with cardiomegaly rather than a clear chest, and the presentation is orthopnoeic rather than sudden pleuritic.' },
        { m: ['acute respiratory distress', 'ards'], msg: 'ARDS gives bilateral infiltrates with a normal heart size and no evidence of raised filling pressures; here there is cardiomegaly, a third heart sound and a very high BNP.' },
        { m: ['pneumothorax'], msg: 'There is no pneumothorax; breath sounds are present with widespread crackles.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A known cardiomyopathy with a diuretic stopped, a fast atrial fibrillation, orthopnoea, pink frothy sputum, bibasal crackles, a third heart sound and a BNP of 2400 pg/mL: acute cardiogenic pulmonary oedema.'
    },
    differentials: ['Acute cardiogenic pulmonary oedema', 'COPD exacerbation', 'Community-acquired pneumonia', 'Pulmonary embolism', 'Acute respiratory distress syndrome', 'Pneumothorax', 'Pleural effusion', 'Anaphylaxis', 'Cirrhotic ascites with hepatic hydrothorax', 'Nephrotic syndrome with fluid overload'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'sit', label: 'Sit the patient upright with oxygen titrated to 94-98%', correct: true, msg: 'Posture and oxygenation are immediate, effective and free.' },
        { id: 'cpap2', label: 'CPAP or non-invasive ventilation early', correct: true, msg: 'Reduces the work of breathing, recruits flooded alveoli and reduces intubation.' },
        { id: 'nitrate', label: 'Nitrate infusion titrated to blood pressure', correct: true, msg: 'Venodilation reduces preload faster than any diuretic.' },
        { id: 'diuretic', label: 'IV loop diuretic at a dose at least equal to the patient\'s usual oral dose', correct: true, msg: 'Relieves congestion over the following hours.' },
        { id: 'rate', label: 'Treat the trigger: rate control for the fast atrial fibrillation (digoxin or amiodarone), and treat ischaemia or infection', correct: true, msg: 'Without treating the trigger the patient re-decompensates.' },
        { id: 'balance', label: 'Catheterise, chart strict fluid balance and monitor renal function and potassium', correct: true, msg: 'Diuresis and nitrates both need monitoring.' },
        { id: 'smallop', label: 'Small titrated doses of opioid for distress, avoiding respiratory depression', correct: true, msg: 'Relieves the sensation of drowning without depressing ventilation.' },
        { id: 'fluid2', label: 'Fluid bolus for the low blood pressure', correct: false, harm: true, msg: 'This patient is congested, not dry: a bolus floods the alveoli further.' },
        { id: 'bb2', label: 'IV beta-blocker to slow the atrial fibrillation immediately', correct: false, harm: true, msg: 'Rate control before stabilisation drops cardiac output and worsens the oedema.' },
        { id: 'morphine', label: 'Morphine 10 mg IV bolus', correct: false, harm: true, msg: 'Large opioid doses cause hypercapnia and are associated with worse outcomes.' },
        { id: 'flat2', label: 'Lay the patient flat to examine and line them', correct: false, harm: true, msg: 'Orthopnoea is protective; lying a flooded patient flat precipitates respiratory arrest.' },
        { id: 'nv', label: 'Non-invasive ventilation is contraindicated in heart failure', correct: false, harm: true, msg: 'The opposite is true: CPAP is a first-line treatment for acute cardiogenic pulmonary oedema.' }
      ]
    },
    debrief: {
      key: ['Orthopnoea for two nights with a diuretic stopped and fast atrial fibrillation.', 'Sitting bolt upright with pink frothy sputum, bibasal crackles, a raised JVP, a third heart sound and BP 178/98.', 'CXR shows alveolar oedema with cardiomegaly; BNP 2400; LVEF 22% with moderate mitral regurgitation.'],
      pearls: ['Sit up, oxygenate, offload and add CPAP — the combination is greater than the sum of its parts.', 'Nitrates act within minutes through venodilation; diuretics take longer than most people think.', 'Always name the trigger: here a fast atrial fibrillation in a patient who had stopped his diuretic.'],
      pitfalls: ['A fluid bolus for the low blood pressure in a congested patient is a fast route to intubation.', 'A normal or rising CO2 in acute pulmonary oedema signals exhaustion and impending respiratory arrest.']
    }
  });

  /* =======================================================================
     CASE 25 — Cardiac tamponade
     ======================================================================= */
  window.CASES.push({
    id: 'tamponade',
    title: 'Hypotensive, distended neck veins and a quiet heart after a viral illness',
    category: 'Cardiology',
    difficulty: 'hard',
    blurb: 'Three days of breathlessness and dizziness, now shocked with a pulse pressure of 24 mmHg and clear lungs.',
    timeLimitSec: 600,
    budget: 1800,
    who: 'Mrs. B., 62-year-old retired teacher. Three weeks ago she had a flu-like illness with pleuritic chest pain that settled. For three days she has been increasingly breathless and dizzy, and today she collapsed while getting dressed.',
    history: [
      'Three weeks of a viral illness with pleuritic chest pain that resolved spontaneously.',
      'Three days of progressive breathlessness, fatigue and dizziness on standing.',
      'Collapse today with a brief loss of consciousness while dressing.',
      'No chest pain now, no cough, no fever, no leg swelling, no orthopnoea.',
      'On bendroflumethiazide for hypertension only. No anticoagulants, no recent surgery, no malignancy.'
    ],
    exam: [
      'Pale, clammy and anxious, GCS 14, sitting forward and uncomfortable.',
      'Pulse 128 with a **pulse pressure of only 24 mmHg (BP 82/58)**, and **a fall in systolic pressure of 18 mmHg on inspiration (pulsus paradoxus)**.',
      '**JVP markedly raised to the angle of the jaw with muffled heart sounds and no murmur. Lungs are completely clear.**',
      'No pleural rub, no oedema, no calf tenderness, no rash. Peripheral pulses present but thready.',
      'Trachea central, chest expansion equal, no surgical emphysema.'
    ],
    base: { hr: 128, sbp: 82, dbp: 58, rr: 26, spo2: 93, temp: 37.2, gcs: 14 },
    drift: { hr: 0.5, sbp: -0.75, dbp: -0.3, rr: 0.3, spo2: -0.3, temp: 0.005, gcs: -0.05 },
    decay: 0.3,
    events: [
      { at: 110, need: ['action:drain'], loss: 16, msg: 'No drainage has been arranged. The pulse pressure is now 14 mmHg and the patient is drowsy — obstructive shock from tamponade is fatal without pericardial drainage.' },
      { at: 240, need: ['test:echo'], loss: 10, msg: 'No echocardiogram has been performed. The diagnosis is a clinical one, but the echo confirms it and directs the drainage.' },
      { at: 360, need: ['action:fluid'], loss: 10, msg: 'No preload support. In tamponade the ventricles are underfilled — volume is temporarily life-saving while the drainage is arranged.' }
    ],
    actions: [
      A('drain', 'Urgent pericardiocentesis (echo-guided) or surgical drainage — call cardiology and prepare the kit now', 'The only treatment that relieves the obstruction.', { cost: 300, tat: 12, factor: 0.32, msg: 'Pericardiocentesis performed with echocardiographic guidance: 450 mL of bloody fluid aspirated. The blood pressure immediately rose to 118/74 and the JVP fell.' }),
      A('fluid', 'Cautious IV fluid bolus to maintain preload while drainage is arranged', 'An underfilled ventricle needs volume, temporarily.', { cost: 20, tat: 8, factor: 0.6, msg: 'A 500 mL bolus produced a useful rise in blood pressure — preload is keeping this circulation going.' }),
      A('oxygen', 'Oxygen to keep saturations above 94%, sitting the patient forward for comfort', 'Supportive, and does not delay drainage.', { cost: 15, tat: 4, factor: 0.85, msg: 'Saturations maintained; the patient is more comfortable sitting forward.' }),
      A('monitor', 'IV access, continuous monitoring, arterial line if available', 'Peri-arrest precautions before the drainage.', { cost: 20, tat: 8, factor: 0.85, msg: 'Access and monitoring established with the arrest trolley at the bedside.' }),
      A('stopdiuretic', 'Stop the diuretic and any venodilator immediately', 'Drugs that reduce preload are harmful here.', { cost: 0, tat: 4, factor: 0.9, msg: 'Bendroflumethiazide stopped and the chart annotated; no venodilators will be given.' }),
      A('prepare', 'Alert the anaesthetist and theatre for a possible pericardial window; cross-match blood', 'Bleeding into the pericardium may need surgery.', { cost: 120, tat: 12, factor: 0.85, msg: 'Anaesthetist and surgical team alerted with blood cross-matched.' }),
      A('sitforward', 'Sit the patient forward and keep them still and calm', 'Reduces the discomfort of pericardial stretch.', { cost: 0, tat: 4, factor: 0.95, msg: 'Patient positioned comfortably forward.' }),
      A('furo', 'IV furosemide for the raised JVP', 'The raised JVP is obstruction, not overload.', { cost: 10, tat: 6, factor: 1.8, harm: true, msg: 'Diuresis in tamponade caused a further collapse: preload was the only thing maintaining cardiac output and it has been removed.' }),
      A('nitrate', 'Nitrate infusion for the breathlessness', 'Venodilation removes the preload this patient depends on.', { cost: 12, tat: 6, factor: 1.7, harm: true, msg: 'After the nitrate the blood pressure fell to 60/40 and the patient became unresponsive.' }),
      A('waitct', 'Send the patient to CT for a definitive diagnosis before drainage', 'A crashing patient does not go to the scanner.', { cost: 0, tat: 6, factor: 1.6, harm: true, msg: 'In the CT scanner the patient arrested. The diagnosis was already made at the bedside.' }),
      A('bigfluid', 'Rapid 2 litres of crystalloid', 'Modest volume helps; flooding a compressed heart does not.', { cost: 30, tat: 10, factor: 1.3, harm: true, msg: 'Two litres of fluid raised the filling pressures without improving output, worsening the breathlessness.' }),
      A('cpap', 'CPAP for the breathlessness', 'Positive pressure reduces venous return to an obstructed heart.', { cost: 150, tat: 10, factor: 1.4, harm: true, msg: 'Positive pressure ventilation reduced venous return further: the blood pressure fell and the patient became peri-arrest.' })
    ],
    tests: [
      T('echo', 'Focused bedside echocardiography', 'Bedside', 160, 30, '**Large circumferential pericardial effusion (3 cm) with right ventricular diastolic collapse, a dilated non-collapsing inferior vena cava, a swinging heart and marked respiratory variation in mitral inflow.** This is tamponade physiology.', { flag: 'critical', factor: 0.75 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 128 with **low-voltage complexes and electrical alternans** (beat-to-beat variation in QRS amplitude) — the swinging heart.', { flag: 'critical', factor: 0.8 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 25, '**Enlarged, globular cardiac silhouette with completely clear lung fields.** A large heart with clear lungs is a classic tamponade pattern.', { flag: 'abnormal', factor: 0.9 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.28, pO2 82 mmHg, HCO3 18, **lactate 4.4 mmol/L** — a lactic acidosis from low cardiac output.', { flag: 'critical', factor: 0.85 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 46 mg/dL, creatinine 1.5 mg/dL, Na 134, K 3.9 — pre-renal impairment from poor output.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen and full blood count', 'Bloods', 135, 40, 'INR 1.2, APTT 34 s, Hb 11.4, platelets 240. A normal clotting screen is needed before any drainage procedure.', { flag: 'normal', factor: 0.95 }),
      T('crp', 'CRP and ESR', 'Bloods', 50, 35, 'CRP 88 mg/L with a raised ESR — inflammation, consistent with the recent viral pericarditis and evolving effusion.', { flag: 'abnormal' }),
      T('trop', 'High-sensitivity troponin', 'Bloods', 60, 30, 'hs-troponin 120 ng/L — mildly raised from pericardial inflammation and reduced coronary perfusion. Not an acute coronary syndrome.', { flag: 'abnormal' }),
      T('tsh', 'Thyroid function tests', 'Bloods', 110, 70, 'Normal. Hypothyroidism is a classic cause of a large pericardial effusion and must be excluded.', { flag: 'normal' }),
      T('bnp', 'NT-proBNP', 'Bloods', 130, 50, 'Mildly raised at 320 pg/mL. Not high enough for a primary pump failure, which fits the obstructive picture.', { flag: 'abnormal' }),
      T('viral', 'Viral serology and autoimmune screen', 'Special', 200, 90, '**Coxsackie B IgM positive** with a normal autoimmune screen. Confirms the likely viral aetiology, and matters for follow-up rather than for tonight.', { flag: 'abnormal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. Purulent pericarditis is a consideration but the patient is afebrile with a viral prodrome.', { flag: 'normal' }),
      T('ct', 'CT chest with contrast', 'Imaging', 620, 90, 'Confirms a large pericardial effusion with no aortic dissection, no mass and no pulmonary embolism. Far too slow and unstable a journey when echocardiography and a needle will do.', { flag: 'abnormal' })
    ],
    hints: [
      'Hypotension, a raised JVP and muffled heart sounds with clear lungs is Beck\'s triad: the treatment is a needle, not a diuretic.',
      'In tamponade the ventricles are underfilled: fluid helps temporarily, while diuretics, nitrates and positive pressure are all harmful.'
    ],
    dx: {
      label: 'Cardiac tamponade from a large pericardial effusion',
      accept: ['cardiac tamponade', 'tamponade', 'pericardial tamponade', 'tamponade from pericardial effusion', 'large pericardial effusion with tamponade'],
      reject: [
        { m: ['pulmonary embolism', 'embolus'], msg: 'PE also raises the JVP, but the echo here shows a large pericardial effusion with right ventricular collapse rather than a dilated right ventricle, and the lungs are clear.' },
        { m: ['tension pneumothorax', 'pneumothorax'], msg: 'There are no absent breath sounds, no hyper-resonance and no tracheal deviation; the chest is clear with a globular heart on the film.' },
        { m: ['myocardial infarction', 'stemi'], msg: 'The troponin is only mildly raised and there are no ischaemic changes — the problem is mechanical obstruction to filling.' },
        { m: ['cardiogenic shock'], msg: 'The pump is not the problem: a large effusion is compressing the ventricles and the JVP is markedly raised with clear lungs.' },
        { m: ['sepsis', 'septic'], msg: 'The patient is afebrile with no source and no leucocytosis; the lactate is from low output, not from sepsis.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Hypotension with a narrow pulse pressure, a markedly raised JVP, muffled heart sounds, pulsus paradoxus, clear lungs, low-voltage complexes with electrical alternans and a large effusion with right ventricular collapse on echo: cardiac tamponade.'
    },
    differentials: ['Cardiac tamponade', 'Pulmonary embolism', 'Tension pneumothorax', 'Acute myocardial infarction with cardiogenic shock', 'Septic shock', 'Constrictive pericarditis', 'Right ventricular infarction', 'Superior vena cava obstruction', 'Acute severe asthma', 'Anaphylaxis'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'drain2', label: 'Urgent echocardiographically guided pericardiocentesis, or surgical drainage if it is safer', correct: true, msg: 'The definitive treatment: relieve the obstruction.' },
        { id: 'preload', label: 'Cautious fluid bolus to maintain preload until drainage', correct: true, msg: 'Temporarily improves filling in a compressed heart.' },
        { id: 'stop', label: 'Stop diuretics and venodilators', correct: true, msg: 'Both remove the preload that is keeping this patient alive.' },
        { id: 'peri', label: 'Peri-arrest precautions: monitoring, arterial line, blood cross-matched, anaesthetist and surgeon alerted', correct: true, msg: 'Drainage can be complicated by bleeding, arrhythmia or vagal collapse.' },
        { id: 'send', label: 'Send the pericardial fluid for cytology, culture and viral studies and arrange follow-up echo', correct: true, msg: 'The cause matters for recurrence and for the next few months.' },
        { id: 'o2c', label: 'Oxygen and sitting the patient forward for comfort', correct: true, msg: 'Supportive care that does not delay drainage.' },
        { id: 'diuretic', label: 'IV furosemide for the raised JVP', correct: false, harm: true, msg: 'Diuresis removes preload and causes circulatory collapse in tamponade.' },
        { id: 'nitrate2', label: 'Nitrate infusion for the breathlessness', correct: false, harm: true, msg: 'Venodilation in a preload-dependent circulation drops the blood pressure precipitously.' },
        { id: 'ctfirst', label: 'CT chest before drainage to characterise the effusion', correct: false, harm: true, msg: 'Imaging must never delay drainage in a shocked patient; echocardiography at the bedside is enough.' },
        { id: 'cpap2', label: 'CPAP for the breathlessness', correct: false, harm: true, msg: 'Positive pressure reduces venous return to an already compressed heart.' },
        { id: 'steroid', label: 'High-dose corticosteroids for the presumed viral pericarditis', correct: false, harm: true, msg: 'Steroids do not relieve tamponade and may increase recurrence of viral pericarditis.' },
        { id: 'observe', label: 'Observe with serial observations and repeat the echo in the morning', correct: false, harm: true, msg: 'Tamponade is a mechanical emergency that will not wait for the morning.' }
      ]
    },
    debrief: {
      key: ['Viral pericarditis three weeks earlier, now progressive breathlessness, dizziness and collapse.', 'Beck\'s triad: hypotension with a narrow pulse pressure, a raised JVP and muffled heart sounds — with clear lungs and pulsus paradoxus.', 'Low-voltage complexes with electrical alternans, and a 3 cm effusion with right ventricular diastolic collapse on echo.'],
      pearls: ['Hypotension plus a raised JVP plus clear lungs should make you reach for the ultrasound probe.', 'Electrical alternans is specific but late; the echo makes the diagnosis.', 'Drainage is the treatment. Fluid buys minutes, and diuretics, nitrates and positive pressure all take the patient the wrong way.'],
      pitfalls: ['Treating the raised JVP with a diuretic is the classic fatal error.', 'Sending a shocked patient to CT before drainage delays the only intervention that works.']
    }
  });

})();
