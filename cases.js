/* =========================================================================
   DocSim — case library (part 1 of 2)
   Each case is a plain object. See README.md for the field reference.
   Add your own cases here or in cases-more.js; the engine never needs editing.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  /* --- small builders so cases stay readable ------------------------------ */
  // action = something you do at the bedside. factor<1 slows deterioration, >1 accelerates it.
  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});

  // test = investigation. cost charged on ordering, tat = turnaround in seconds.
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  const add = (c) => window.CASES.push(c);

  /* =======================================================================
     CASE 1 — STEMI
     ======================================================================= */
  add({
    id: 'stemi',
    title: 'Severe chest pain at rest in a 58-year-old man',
    category: 'Cardiology',
    difficulty: 'easy',
    blurb: 'Ninety minutes of chest pain that began while he was watching television.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Mr. R.K., 58-year-old autorickshaw driver. Smoker (30 pack-years), type 2 diabetes on metformin, no previous cardiac history. Father died of a "heart attack" at 62.',
    history: [
      '90 minutes of severe retrosternal chest pain, "like an elephant sitting on my chest", radiating to the left arm and jaw.',
      'Onset at rest while watching television. Associated with sweating, nausea and breathlessness.',
      'No relief after two antacid tablets. No prior similar episode. No pleuritic or positional component.',
      'No recent travel, immobility, surgery or leg swelling.'
    ],
    exam: [
      'Anxious, pale and drenched in sweat. Speaks in short sentences.',
      'Pulse 104 and irregular, BP 106/66 in both arms, JVP not raised.',
      'Chest clear on auscultation. S1 S2 with a soft fourth heart sound, no murmur, no rub.',
      'Abdomen soft and non-tender. Peripheral pulses present and equal. No leg swelling. No calf tenderness.'
    ],
    base: { hr: 104, sbp: 106, dbp: 66, rr: 24, spo2: 93, temp: 36.9, gcs: 15 },
    drift: { hr: 0.55, sbp: -0.62, dbp: -0.34, rr: 0.22, spo2: -0.20, temp: 0.012, gcs: -0.03 },
    decay: 0.22,
    events: [
      { at: 180, need: ['test:ecg'], loss: 9, msg: 'Still no ECG: the pain is worsening, the patient is vomiting and the monitor shows runs of ventricular ectopics.' },
      { at: 330, need: ['action:aspirin'], loss: 16, msg: 'No antiplatelet given yet — a burst of ventricular tachycardia, briefly conscious.' },
      { at: 450, need: ['action:cathlab'], loss: 12, msg: 'Reperfusion has still not been arranged. Cardiogenic shock is developing.' }
    ],
    actions: [
      A('oxygen', 'Oxygen — titrate to SpO2 94-98%', 'Only if hypoxic. Hyperoxia is harmful in MI.', { cost: 15, tat: 5, factor: 0.85, msg: 'SpO2 96% on 2 L. Work of breathing looks easier.' }),
      A('highflow', 'Oxygen 15 L via reservoir mask regardless of saturation', 'High-flow oxygen in a normoxic patient.', { cost: 25, tat: 5, factor: 1.18, harm: true, msg: 'SpO2 100% on 15 L. No symptomatic benefit — and hyperoxia may worsen reperfusion injury.' }),
      A('ivaccess', 'Two large-bore IV lines + monitor + defibrillator at bedside', 'Boring, cheap, saves lives.', { cost: 20, tat: 8, factor: 0.92, msg: 'IV access secured, rhythm monitored, defibrillator and adrenaline drawn up.' }),
      A('aspirin', 'Aspirin 300 mg chewed', 'Do not wait for the ECG result to give this.', { cost: 5, tat: 4, factor: 0.58, msg: 'Aspirin given. Platelet aggregation is being shut down at the site of the plaque rupture.' }),
      A('gtn', 'GTN 0.4 mg sublingual, repeat if SBP > 90', 'For ongoing pain and ischaemia.', { cost: 8, tat: 5, factor: 0.78, msg: 'Pain eased from 9/10 to 4/10 within four minutes.' }),
      A('morphine', 'Morphine 3 mg IV titrated', 'Analgesia plus venodilation.', { cost: 12, tat: 6, factor: 0.82, msg: 'Patient settled, pain 3/10, respiratory rate unchanged.' }),
      A('furosemide', 'Furosemide 40 mg IV', 'No signs of congestion in this patient.', { cost: 10, tat: 6, factor: 1.6, harm: true, msg: 'No pulmonary oedema to treat. BP fell to 88/54, the patient is paler and more tachycardic.' }),
      A('fluidbolus', 'Normal saline 500 mL bolus', 'Preload loading without evidence of RV infarction.', { cost: 12, tat: 8, factor: 1.22, harm: true, msg: 'Crackles appeared at both bases. The failing left ventricle does not want extra volume.' }),
      A('cathlab', 'Activate the cath lab / call cardiology now', 'Door-to-balloon time is the outcome.', { cost: 0, tat: 5, factor: 0.68, msg: 'Cardiology alerted, cath lab activated, transfer planned for primary PCI.' }),
      A('reassure', 'Sit up, loosen clothes, calm the patient, keep nil by mouth', 'Free comfort measures.', { cost: 0, tat: 3, factor: 0.96, msg: 'Patient more comfortable and cooperative.' })
    ],
    tests: [
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 104. **ST elevation 3 mm in V1-V4 with reciprocal ST depression in II, III and aVF.** No Q waves yet. No PR depression.', { flag: 'critical', factor: 0.8 }),
      T('poc_trop', 'Point-of-care troponin I', 'Bedside', 60, 20, '**Troponin I 8.4 ng/mL** (cut-off 0.04). Massive myocardial necrosis.', { flag: 'critical', factor: 0.9 }),
      T('hs_trop', 'Laboratory high-sensitivity troponin T', 'Bloods', 120, 60, '**hs-troponin T 640 ng/L** (cut-off 14), rising on the delta check at one hour.', { flag: 'critical' }),
      T('glucose', 'Random capillary glucose', 'Bedside', 15, 8, '**214 mg/dL (11.9 mmol/L)** — stress hyperglycaemia on a background of type 2 diabetes. Ketones not requested.', { flag: 'abnormal' }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 13.1 g/dL, WBC 12.4 x10^9/L (neutrophil predominant), platelets 268 x10^9/L.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 38 mg/dL, creatinine 1.2 mg/dL, Na 138, K 4.1, bicarbonate 22 mmol/L.', { flag: 'normal' }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 30, 'pH 7.46, pO2 68 mmHg on room air, pCO2 32 mmHg, **lactate 2.6 mmol/L** — mild type 1 respiratory failure and hypoperfusion.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray (portable)', 'Imaging', 90, 30, 'Normal heart size, clear lung fields, no pneumothorax, no widened mediastinum.', { flag: 'normal' }),
      T('echo', 'Focused bedside echocardiography', 'Bedside', 160, 45, '**Anterior and apical akinesia, LVEF about 38%.** No pericardial effusion, no RV dilatation, no valve destruction.', { flag: 'abnormal', factor: 0.92 }),
      T('ddimer', 'D-dimer', 'Bloods', 110, 40, '**1.9 ug/mL** (raised). Non-specific — this will be raised in any acute coronary syndrome, infection or recent surgery.', { flag: 'abnormal' }),
      T('lipids', 'Fasting lipid profile', 'Bloods', 60, 45, 'Total cholesterol 244, LDL 168, HDL 32, triglycerides 210 mg/dL. Useful next week — useless in the first ten minutes.', { flag: 'abnormal' }),
      T('cta', 'CT aortogram', 'Imaging', 520, 90, 'No aortic dissection, no intramural haematoma, no pulmonary embolism. Heart is enlarged, coronary calcification present.', { flag: 'normal' }),
      T('lipase', 'Serum lipase', 'Bloods', 110, 60, 'Mildly raised at 180 U/L — non-specific in this context.', { flag: 'abnormal' })
    ],
    hints: [
      'Two things change the outcome in the first five minutes: an ECG and a chewable aspirin.',
      'The patient is not in pulmonary oedema and not hypoxic — diuretics and fluid boluses will both hurt him.'
    ],
    dx: {
      label: 'Acute anterior ST-elevation myocardial infarction (STEMI)',
      accept: ['stemi', 'st elevation myocardial infarction', 'anterior stemi', 'anterior myocardial infarction', 'acute myocardial infarction', 'acute anterior myocardial infarction', 'myocardial infarction', 'heart attack', 'acute coronary syndrome with st elevation', 'ami'],
      reject: [
        { m: ['unstable', 'angina'], msg: 'Unstable angina has no ST elevation and a normal troponin. This ECG is diagnostic of infarction.' },
        { m: ['pericarditis'], msg: 'Pericarditis gives diffuse concave ST elevation with PR depression — not territorial elevation with reciprocal changes.' },
        { m: ['dissection'], msg: 'Aortic dissection classically gives tearing pain to the back with pulse or BP inequality. Both arms are equal here and the ECG is territorial.' },
        { m: ['reflux', 'gastritis', 'oesophageal', 'esophageal'], msg: 'There is objective ST elevation and a troponin of 8.4. This is infarction, not dyspepsia.' },
        { m: ['pulmonary embolism', 'pe'], msg: 'PE does not cause 3 mm territorial ST elevation in V1-V4 with reciprocal change.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Territorial ST elevation in V1-V4 with reciprocal depression plus a grossly raised troponin = acute anterior STEMI, and the clock to reperfusion started 90 minutes ago.'
    },
    differentials: ['Acute myocardial infarction (STEMI)', 'Unstable angina', 'Aortic dissection', 'Pulmonary embolism', 'Acute pericarditis', 'Pneumothorax', 'Gastro-oesophageal reflux', 'Musculoskeletal chest pain', 'Pneumonia', 'Acute cholecystitis'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'pci', label: 'Emergency reperfusion: primary PCI (or thrombolysis if PCI is unavailable within 120 min)', correct: true, msg: 'Reperfusion is the single intervention that saves myocardium.' },
        { id: 'dapt', label: 'Dual antiplatelet therapy: ticagrelor 180 mg or clopidogrel 300 mg loading', correct: true, msg: 'Standard with aspirin before PCI.' },
        { id: 'heparin', label: 'Anticoagulation: unfractionated heparin or enoxaparin', correct: true, msg: 'Reduces thrombus propagation and re-occlusion.' },
        { id: 'statin', label: 'High-intensity statin: atorvastatin 80 mg', correct: true, msg: 'Plaque stabilisation and secondary prevention.' },
        { id: 'bb', label: 'Oral beta-blocker once haemodynamically stable, if no contraindication', correct: true, msg: 'Reduces infarct size, arrhythmia and re-infarction.' },
        { id: 'acei', label: 'ACE inhibitor started within 24 hours (anterior MI, LV dysfunction)', correct: true, msg: 'Prevents adverse remodelling after anterior infarction.' },
        { id: 'ccu', label: 'Admit to coronary care with continuous ECG monitoring and serial troponin', correct: true, msg: 'Where the arrhythmias get caught.' },
        { id: 'o2only', label: 'Oxygen only if SpO2 falls below 90-94%', correct: true, msg: 'Correct oxygen targets — neither hypoxia nor hyperoxia.' },
        { id: 'nsaid', label: 'Diclofenac IM for the pain', correct: false, harm: true, msg: 'NSAIDs in acute MI increase death, re-infarction and heart failure. Never for chest pain of suspected cardiac origin.' },
        { id: 'verapamil', label: 'IV verapamil to slow the heart rate', correct: false, harm: true, msg: 'Non-dihydropyridine calcium blockers are contraindicated with LV dysfunction — profound hypotension and heart block.' },
        { id: 'discharge', label: 'Discharge with antacids and outpatient review', correct: false, harm: true, msg: 'Discharging an evolving STEMI is a death sentence.' },
        { id: 'warfarin', label: 'Load warfarin 10 mg for anticoagulation', correct: false, harm: true, msg: 'Warfarin has no role in the acute phase — it takes days and increases bleeding risk during PCI.' }
      ]
    },
    debrief: {
      key: [
        '90 minutes of crushing central pain with radiation to arm and jaw, diaphoresis and vomiting.',
        'Territorial ST elevation V1-V4 with reciprocal depression, troponin 8.4 ng/mL.',
        'Diabetes plus 30 pack-years of smoking: two major risk factors.'
      ],
      pearls: [
        'ECG within 10 minutes of arrival and aspirin chewed immediately — both are free compared with the cost of myocardial loss.',
        'Time is muscle: door-to-balloon under 90 minutes, or thrombolysis within 30 minutes if PCI is unavailable.',
        'Analgesia, oxygen only if hypoxic, nitrates if the blood pressure allows.'
      ],
      pitfalls: [
        'Loop diuretics and fluid boluses are both wrong in an uncomplicated anterior STEMI — one empties a ventricle that is already underfilled, the other floods a ventricle that cannot cope.',
        'A chest X-ray and a D-dimer add cost and delay without changing management when the ECG is already diagnostic.'
      ]
    }
  });

  /* =======================================================================
     CASE 2 — Diabetic ketoacidosis
     ======================================================================= */
  add({
    id: 'dka',
    title: 'Two weeks of thirst and weight loss in a 19-year-old student',
    category: 'Endocrinology',
    difficulty: 'easy',
    blurb: 'Three days of vomiting and abdominal pain; the family thought it was a stomach bug.',
    timeLimitSec: 600,
    budget: 1600,
    who: 'Ms. A., 19-year-old student. No known diabetes. Two weeks of increasing thirst, frequent urination and 5 kg weight loss; three days of vomiting and abdominal pain. Mother noticed she was breathing "like after running".',
    history: [
      'Polyuria, polydipsia and nocturia for two weeks with marked weight loss despite a good appetite.',
      'Three days of vomiting, generalised abdominal pain and a sweet, fruity smell to the breath.',
      'Increasing drowsiness today; the family thought she had a stomach bug and gave her sips of sugary drinks.',
      'No fever, no diarrhoea, no dysuria, no rash, no head injury.',
      'No other medication, no alcohol, no steroid use.'
    ],
    exam: [
      'Drowsy but rousable, GCS 14. Very dry mucous membranes, sunken eyes, reduced skin turgor, capillary refill 4 seconds.',
      'Pulse 122, BP 96/60, temperature 37.2 C, respiratory rate 30 with deep sighing (Kussmaul) breathing.',
      'Abdomen soft but generally tender, no guarding, no rigidity, bowel sounds present.',
      'No focal neurology, no neck stiffness, no rash. A trace of ketones on the breath.'
    ],
    base: { hr: 122, sbp: 96, dbp: 60, rr: 30, spo2: 98, temp: 37.2, gcs: 14 },
    drift: { hr: 0.6, sbp: -0.72, dbp: -0.4, rr: 0.32, spo2: -0.10, temp: 0.008, gcs: -0.05 },
    decay: 0.26,
    events: [
      { at: 200, need: ['action:fluids'], loss: 10, msg: 'No fluid has been given: BP is now 84/50, HR 138 — hypovolaemic shock in a 5 kg-dry patient.' },
      { at: 330, need: ['action:insulin'], loss: 14, msg: 'No insulin has been given. GCS is falling and the acidosis is deepening.' },
      { at: 430, need: ['action:potassium'], loss: 8, msg: 'No potassium replacement: the ECG shows flattened T waves and a long QT — total body potassium is depleted.' }
    ],
    actions: [
      A('airway', 'Left lateral position, airway suction, high-flow oxygen if SpO2 < 94%', 'Protect a drowsy vomiting airway.', { cost: 15, tat: 5, factor: 0.9, msg: 'Airway protected; no further aspiration.' }),
      A('ivaccess', 'Two large-bore IV lines, monitor, hourly urine output chart', 'You will need every lumen.', { cost: 20, tat: 8, factor: 0.94, msg: 'IV access secured and monitoring started.' }),
      A('fluids', '0.9% saline 1 L over the first hour, then reassess', 'The lethal deficit here is water and sodium, not insulin.', { cost: 18, tat: 8, factor: 0.55, msg: 'Saline running fast — the pulse is already slowing and the extremities warming.' }),
      A('insulin', 'Soluble insulin 0.1 units/kg/hour infusion (no bolus needed)', 'Do not bolus insulin in a child or teenager.', { cost: 30, tat: 10, factor: 0.5, msg: 'Insulin infusion started. Ketone production will now start to switch off.' }),
      A('dextrose', 'Add 10% dextrose once glucose falls below 250 mg/dL', 'Insulin needs glucose to keep running safely.', { cost: 22, tat: 8, factor: 0.85, msg: 'Dextrose co-infusion running — insulin can continue without hypoglycaemia.' }),
      A('potassium', 'Potassium 40 mmol/L in the next litre once K < 5.5 and urine output present', 'Total body potassium is always depleted, even when serum K is normal.', { cost: 18, tat: 8, factor: 0.7, msg: 'Potassium replacing — the T waves are normalising.' }),
      A('bicarb', 'Sodium bicarbonate 8.4% 100 mL IV', 'Only for pH < 6.9, and it is rarely the right answer.', { cost: 25, tat: 6, factor: 1.45, harm: true, msg: 'Bicarbonate given: serum potassium crashed, and CO2 generation worsened intracellular and CSF acidosis.' }),
      A('catheter', 'Urinary catheter with hourly output, weigh the patient', 'You cannot manage DKA without an output chart.', { cost: 15, tat: 10, factor: 0.9, msg: 'Hourly urine output monitoring in place.' }),
      A('warm', 'Warm the patient, check for a precipitant (infection, non-adherence, new diagnosis)', 'Look for the cause while you treat.', { cost: 0, tat: 10, factor: 0.95, msg: 'This looks like new-onset type 1 diabetes rather than an infective precipitant.' })
    ],
    tests: [
      T('glucose', 'Capillary blood glucose', 'Bedside', 10, 6, '**38.6 mmol/L (695 mg/dL)** — the meter tops out in the high 30s.', { flag: 'critical', factor: 0.95 }),
      T('dipstick', 'Urine dipstick', 'Bedside', 12, 10, '**Ketones 3+**, glucose 4+, protein trace, nitrites negative, leucocytes negative. No infection to explain the ketosis.', { flag: 'critical' }),
      T('bga', 'Blood gas (venous is enough)', 'Bloods', 90, 25, 'pH 7.09, pCO2 22 mmHg, HCO3 8 mmol/L, **anion gap 24**, K 5.6, Na 129, Cl 98, glucose 37 mmol/L, **lactate 2.1**, beta-hydroxybutyrate 6.4 mmol/L.', { flag: 'critical', factor: 0.85 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 62 mg/dL, creatinine 1.4 mg/dL (pre-renal), Na 129 with **corrected Na 141**, K 5.6, bicarbonate 8.', { flag: 'abnormal' }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 15.2 g/dL (haemoconcentrated), WBC 18.9 x10^9/L with neutrophilia, platelets 402. The white count alone does not prove infection.', { flag: 'abnormal' }),
      T('hba1c', 'HbA1c', 'Bloods', 60, 45, '**12.4%** — chronically poor glycaemic control, consistent with undiagnosed type 1 diabetes.', { flag: 'abnormal' }),
      T('ketones', 'Blood beta-hydroxybutyrate', 'Bloods', 85, 40, '**6.8 mmol/L** — severe ketonaemia. This is the test that tells you the ketosis is resolving.', { flag: 'critical' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 124. Flattened T waves and a prominent U wave — **hypokalaemia pattern** despite a serum K of 5.6. No ischaemia.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields, normal heart size, no consolidation or pneumothorax.', { flag: 'normal' }),
      T('crp', 'CRP', 'Bloods', 50, 35, '12 mg/L — mildly raised. Ketosis and dehydration do that on their own.', { flag: 'abnormal' }),
      T('cultures', 'Blood cultures', 'Microbiology', 120, 120, 'No growth after 24 hours (final at 48 hours).', { flag: 'normal' }),
      T('urineculture', 'Urine culture', 'Microbiology', 90, 120, 'No significant growth.', { flag: 'normal' }),
      T('lipase', 'Serum lipase', 'Bloods', 110, 60, 'Mildly raised at 180 U/L. Amylase and lipase are commonly elevated in DKA and rarely mean pancreatitis here.', { flag: 'abnormal' }),
      T('tft', 'Thyroid function tests', 'Bloods', 110, 90, 'TSH 1.8, free T4 normal.', { flag: 'normal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 520, 90, 'Normal. No cerebral oedema, no focal lesion, no haemorrhage. Nothing here explains a metabolic drowsiness.', { flag: 'normal' })
    ],
    hints: [
      'The patient is dry, not poisoned — start with volume, then insulin, then watch the potassium.',
      'Serum potassium falls fast once insulin starts. Half the deaths in DKA are from hypokalaemia and arrhythmia, not from the sugar.'
    ],
    dx: {
      label: 'Diabetic ketoacidosis (new-onset type 1 diabetes)',
      accept: ['diabetic ketoacidosis', 'dka', 'ketoacidosis', 'diabetes ketoacidosis', 'new onset type 1 diabetes mellitus with diabetic ketoacidosis', 'type 1 diabetes mellitus with ketoacidosis', 'severe diabetic ketoacidosis'],
      reject: [
        { m: ['hyperosmolar', 'hhs', 'hnk'], msg: 'HHS has glucose above 600 mg/dL, minimal ketones and no significant acidosis. Here ketones are 3+ with a pH of 7.09.' },
        { m: ['gastroenteritis', 'gastro', 'food poisoning'], msg: 'Vomiting is a symptom here, not the disease — the glucose is 695 mg/dL with heavy ketonaemia.' },
        { m: ['lactic acidosis', 'lactate'], msg: 'Lactate is only 2.1 mmol/L. The anion gap acidosis is ketone driven.' },
        { m: ['alcoholic'], msg: 'Alcoholic ketoacidosis occurs after binge drinking with a normal or low glucose and a modest ketosis. This patient is 19, has never drunk alcohol and her glucose is 695 mg/dL with an HbA1c of 12.4%.' },
        { m: ['uraemia', 'renal failure', 'ckd'], msg: 'The creatinine of 1.4 is pre-renal and will correct with volume — it is not the cause of the acidosis.' },
        { m: ['meningitis', 'encephalitis'], msg: 'No fever, no neck stiffness, no rash, no focal neurology — and a glucose of 695 mg/dL with ketones.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Hyperglycaemia + ketonaemia + high anion gap metabolic acidosis = DKA. The two-week history with weight loss makes this new-onset type 1 diabetes.'
    },
    differentials: ['Diabetic ketoacidosis', 'Hyperosmolar hyperglycaemic state', 'Gastroenteritis with dehydration', 'Lactic acidosis', 'Salicylate poisoning', 'Meningoencephalitis', 'Alcoholic ketoacidosis', 'Acute pancreatitis', 'Sepsis', 'Uraemic encephalopathy'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'saline', label: '0.9% saline resuscitation with reassessment after each litre', correct: true, msg: 'Volume first — it improves perfusion, renal clearance of ketones and insulin sensitivity.' },
        { id: 'insulin', label: 'Fixed-rate soluble insulin infusion 0.1 units/kg/hour', correct: true, msg: 'Turns off ketogenesis and lipolysis.' },
        { id: 'dex', label: 'Add 10% dextrose when glucose falls below 250 mg/dL and continue insulin', correct: true, msg: 'Clears ketones without hypoglycaemia.' },
        { id: 'k', label: 'Potassium replacement 40 mmol/L in each litre once K < 5.5 and urine output is present', correct: true, msg: 'The single most important safety measure after insulin starts.' },
        { id: 'monitor', label: 'Hourly glucose, ketones and potassium with 2-hourly blood gases', correct: true, msg: 'Resolution is defined by ketone clearance, not by glucose.' },
        { id: 'precipitant', label: 'Identify and treat the precipitant: new diagnosis education, insulin regimen, infection screen', correct: true, msg: 'Explains the presentation and prevents recurrence.' },
        { id: 'hdu', label: 'High-dependency or level 2 care with hourly nursing observations', correct: true, msg: 'Appropriate level of monitoring for severe DKA.' },
        { id: 'vte', label: 'Venous thromboembolism prophylaxis once bleeding risk assessed', correct: true, msg: 'DKA is a prothrombotic state.' },
        { id: 'bicarb2', label: 'Sodium bicarbonate infusion to correct the acidosis', correct: false, harm: true, msg: 'Contraindicated unless pH < 6.9: it worsens hypokalaemia and paradoxical CSF acidosis.' },
        { id: 'bigbolus', label: 'Soluble insulin 20 units IV stat and repeat in an hour', correct: false, harm: true, msg: 'A large bolus risks hypoglycaemia, hypokalaemia and cerebral oedema without clearing ketones any faster.' },
        { id: 'restrict', label: 'Fluid restriction to avoid cerebral oedema', correct: false, harm: true, msg: 'Restricting fluid in a patient 5 kg dry is exactly the wrong way round.' },
        { id: 'scinsulin', label: 'Subcutaneous sliding-scale insulin only', correct: false, harm: true, msg: 'Absorption is unpredictable in shock — ketogenesis continues.' },
        { id: 'kfirst', label: 'Potassium 40 mmol IV bolus before any urine output and with K 5.6', correct: false, harm: true, msg: 'An unmonitored potassium bolus in a patient who is not passing urine can cause fatal hyperkalaemic arrest.' },
        { id: 'discharge', label: 'Discharge with oral metformin and outpatient follow-up', correct: false, harm: true, msg: 'This patient needs admission, not a prescription.' }
      ]
    },
    debrief: {
      key: ['Glucose 695 mg/dL with urine ketones 3+ and beta-hydroxybutyrate 6.8 mmol/L.', 'pH 7.09 with a bicarbonate of 8 and an anion gap of 24.', 'Dry, tachycardic, Kussmaul breathing, 5 kg weight loss over two weeks.'],
      pearls: ['Fluids first, insulin second, potassium always — and watch the K as insulin drives it into cells.', 'Resolution of DKA is when ketones clear and the anion gap closes, not when glucose normalises.', 'Look for the precipitant in every episode: here it is a brand new diagnosis of type 1 diabetes.'],
      pitfalls: ['Bicarbonate, big insulin boluses and fluid restriction all kill patients in DKA.', 'A raised white cell count and mildly raised lipase are common in DKA — they are not automatically infection or pancreatitis.']
    }
  });

  /* =======================================================================
     CASE 3 — Organophosphate poisoning
     ======================================================================= */
  add({
    id: 'op',
    title: 'A 34-year-old farm worker, drowsy and drenched in sweat',
    category: 'Toxicology',
    difficulty: 'easy',
    blurb: 'Brought in after an argument at home, vomiting and struggling to breathe.',
    timeLimitSec: 600,
    budget: 1600,
    who: 'Mr. S., 34-year-old farmer. Found by his brother beside an empty 100 mL bottle of dichlorvos ("Nuvan") after an argument at home. Vomiting, drooling and incontinent of stool on the way in.',
    history: [
      'Deliberate ingestion of roughly 50 mL of concentrated organophosphate about 40 minutes ago.',
      'Vomiting, profuse salivation, abdominal cramps, watery diarrhoea and urinary incontinence.',
      'Blurred vision, chest tightness and copious bronchial secretions. No seizure witnessed.',
      'Background of a recent family dispute; no previous psychiatric history documented.'
    ],
    exam: [
      'Drowsy, GCS 12, drenched in sweat with a garlic-like odour to the breath.',
      '**Pinpoint pupils**, profuse salivation and bronchial secretions, coarse crepitations and wheeze across both lungs.',
      'Pulse 56, BP 100/64, respiratory rate 28 with poor air entry and falling saturations.',
      'Fasciculations of the eyelids and tongue, generalised muscle weakness, brisk bowel sounds.'
    ],
    base: { hr: 56, sbp: 100, dbp: 64, rr: 28, spo2: 88, temp: 37.0, gcs: 12 },
    drift: { hr: -0.35, sbp: -0.5, dbp: -0.3, rr: 0.35, spo2: -0.42, temp: 0.005, gcs: -0.06 },
    decay: 0.28,
    events: [
      { at: 150, need: ['action:atropine'], loss: 12, msg: 'No atropine yet: the chest is now full of secretions and the saturations have dropped to 80%.' },
      { at: 300, need: ['action:decon'], loss: 8, msg: 'Contaminated clothing is still on the patient — absorption continues and staff are at risk.' },
      { at: 420, need: ['test:che'], loss: 6, msg: 'Cholinesterase has not been measured; the diagnosis and the degree of exposure remain unquantified.' }
    ],
    actions: [
      A('suction', 'Suction the airway, position laterally, give oxygen', 'A patient drowning in their own secretions.', { cost: 20, tat: 5, factor: 0.72, msg: 'Airway cleared of secretions; saturations improved to 92%.' }),
      A('atropine', 'Atropine 1.2 mg IV, double the dose every 5 minutes until the chest is clear', 'The endpoint is a dry chest, not a heart rate.', { cost: 30, tat: 6, factor: 0.42, msg: 'After 3.6 mg the chest is drier, the heart rate is 96 and secretions have eased dramatically.' }),
      A('pralidoxime', 'Pralidoxime 2 g IV over 30 minutes, then infusion', 'Reactivates the enzyme before ageing occurs — give it early.', { cost: 90, tat: 10, factor: 0.65, msg: 'Oxime running: neuromuscular transmission is starting to recover.' }),
      A('decon', 'Remove all clothing, wash skin with soap and water', 'Protects the patient and your team.', { cost: 15, tat: 12, factor: 0.8, msg: 'Decontamination done — ongoing absorption has stopped and the smell is much reduced.' }),
      A('charcoal', 'Activated charcoal 50 g via nasogastric tube (within 1 hour)', 'Reasonable if the airway is protected.', { cost: 25, tat: 10, factor: 0.9, msg: 'Charcoal given with the airway protected.' }),
      A('ivaccess', 'IV access, cardiac monitor, urinary catheter', 'Anticipate arrhythmias and fluid shifts.', { cost: 20, tat: 8, factor: 0.92, msg: 'Access and monitoring established.' }),
      A('morphine', 'Morphine 5 mg IV for distress and breathlessness', 'Respiratory depressant in a patient with a failing respiratory drive.', { cost: 12, tat: 6, factor: 1.7, harm: true, msg: 'Respiratory rate fell to 10 and the patient became unrousable — morphine was a serious error here.' }),
      A('sux', 'Succinylcholine before intubation', 'Prolonged paralysis in organophosphate poisoning.', { cost: 40, tat: 8, factor: 1.5, harm: true, msg: 'Succinylcholine given: the patient remains paralysed far longer than expected because plasma cholinesterase is inhibited.' }),
      A('benzo', 'IV diazepam for agitation or seizures, monitored', 'Benzodiazepines are the anticonvulsant of choice here.', { cost: 15, tat: 6, factor: 0.95, msg: 'Patient settled without respiratory compromise.' }),
      A('fluids', 'Cautious IV crystalloid, monitor for pulmonary oedema', 'Secretions and vomiting mean real losses.', { cost: 12, tat: 8, factor: 0.95, msg: 'Modest fluid given, chest remains clear.' })
    ],
    tests: [
      T('che', 'Plasma (red cell) cholinesterase', 'Bloods', 150, 60, '**0.9 kU/L** (reference 7-19 kU/L) — profoundly inhibited acetylcholinesterase. This confirms organophosphate poisoning and quantifies exposure.', { flag: 'critical', factor: 0.9 }),
      T('abg', 'Arterial blood gas', 'Bloods', 90, 25, 'pH 7.22, pCO2 48 mmHg, pO2 55 mmHg, HCO3 19 mmol/L, **lactate 3.1** — **type 2 respiratory failure with a raised A-a gradient** from secretions and bronchospasm.', { flag: 'critical', factor: 0.9 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus bradycardia 54 with a **prolonged QTc of 480 ms**. No ischaemic changes.', { flag: 'abnormal', factor: 0.95 }),
      T('glucose', 'Capillary glucose', 'Bedside', 10, 6, '5.8 mmol/L (104 mg/dL) — normal.', { flag: 'normal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 30, creatinine 1.0, Na 134, K 3.4 (vomiting and diarrhoea), bicarbonate 19.', { flag: 'abnormal' }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 14.0, WBC 16.2 with neutrophilia, platelets 240. Leucocytosis without infection is typical of acute poisoning.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Bilateral patchy perihilar infiltrates. No pneumothorax, no consolidation of lobar distribution. Consistent with aspiration and bronchorrhoea.', { flag: 'abnormal' }),
      T('poc_trop', 'Point-of-care troponin', 'Bloods', 60, 20, 'Troponin I 0.02 ng/mL — normal. Nothing here suggests acute coronary syndrome.', { flag: 'normal' }),
      T('tox', 'Urine toxicology screen', 'Microbiology', 130, 90, 'Opiates, benzodiazepines, cannabis, amphetamines and tricyclics all negative. Confirms no co-ingestion.', { flag: 'normal' }),
      T('lipase', 'Serum lipase', 'Bloods', 110, 60, 'Mildly raised at 190 U/L — non-specific in an acutely unwell patient.', { flag: 'abnormal' }),
      T('cthead', 'CT head', 'Imaging', 520, 90, 'Normal. No haemorrhage, no infarct, no cerebral oedema. The reduced GCS is cholinergic, not structural.', { flag: 'normal' }),
      T('paracetamol', 'Paracetamol and salicylate levels', 'Bloods', 100, 60, 'Both undetectable. Worth excluding co-ingestion, but not the diagnosis here.', { flag: 'normal' })
    ],
    hints: [
      'Wet, wheezing, pinpoint pupils, slow pulse — think acetylcholine excess and reach for the antidote.',
      'The endpoint of atropinisation is a dry chest with adequate oxygenation, not a fixed heart rate or pupil size.'
    ],
    dx: {
      label: 'Acute organophosphate insecticide poisoning (cholinergic crisis)',
      accept: ['organophosphate poisoning', 'organophosphate insecticide poisoning', 'op poisoning', 'organophosphorus poisoning', 'anticholinesterase poisoning', 'cholinergic poisoning', 'cholinergic crisis', 'insecticide poisoning'],
      reject: [
        { m: ['carbamate'], msg: 'Carbamate poisoning looks identical but does not age the enzyme — the same antidotes are given. The bottle here contains an organophosphate (dichlorvos).' },
        { m: ['opioid', 'opiate', 'heroin', 'morphine overdose'], msg: 'Opioids give pinpoint pupils and respiratory depression but never bronchorrhoea, diarrhoea and fasciculations together with a garlicky odour.' },
        { m: ['alcohol'], msg: 'Alcohol does not produce this wet cholinergic picture. The toxicology screen is negative.' },
        { m: ['myasthenia'], msg: 'Myasthenic crisis causes weakness without the profuse secretions, miosis and diarrhoea seen here.' },
        { m: ['meningitis', 'encephalitis'], msg: 'No fever or meningism, and the toxidrome is unmistakable.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'DUMBBELS: Diarrhoea, Urination, Miosis, Bradycardia/Bronchorrhoea, Emesis, Lacrimation, Salivation — a full muscarinic toxidrome after a documented organophosphate ingestion, confirmed by cholinesterase of 0.9 kU/L.'
    },
    differentials: ['Organophosphate poisoning', 'Carbamate poisoning', 'Opioid overdose', 'Acute gastroenteritis', 'Alcoholic intoxication', 'Meningoencephalitis', 'Myasthenic crisis', 'Serotonin syndrome', 'Acute severe asthma', 'Heat stroke'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'atropine', label: 'Escalating atropine (doubling doses) until the chest is clear and oxygenation adequate', correct: true, msg: 'Atropine reverses the muscarinic effects; end-point is a dry chest, not a heart rate.' },
        { id: 'oxime', label: 'Pralidoxime 2 g IV over 30 minutes followed by an infusion', correct: true, msg: 'Reactivates acetylcholinesterase before ageing; also helps the nicotinic weakness.' },
        { id: 'decon', label: 'Full decontamination: remove and bag clothing, wash skin with soap and water', correct: true, msg: 'Stops ongoing absorption and protects staff.' },
        { id: 'vent', label: 'Early intubation and ventilation for respiratory failure with secretion clearance', correct: true, msg: 'Respiratory failure is the usual cause of death — support it early.' },
        { id: 'nosux', label: 'Avoid succinylcholine; use a non-depolarising agent if paralysis is needed', correct: true, msg: 'Plasma cholinesterase is inhibited, so succinylcholine causes prolonged paralysis.' },
        { id: 'benzo', label: 'Benzodiazepines for seizures, agitation and to reduce central cholinergic drive', correct: true, msg: 'First-line anticonvulsant and sedative here.' },
        { id: 'icu', label: 'ICU admission with monitoring for intermediate syndrome at 24-96 hours', correct: true, msg: 'Weakness of respiratory muscles can appear days later.' },
        { id: 'psych', label: 'Psychiatric assessment and safe discharge planning once medically stable', correct: true, msg: 'Deliberate self-harm needs addressing, not just the poison.' },
        { id: 'morphine2', label: 'Morphine for distress', correct: false, harm: true, msg: 'Adds respiratory depression to an already failing respiratory drive.' },
        { id: 'sux2', label: 'Succinylcholine to facilitate intubation', correct: false, harm: true, msg: 'Prolonged paralysis from inhibited plasma cholinesterase.' },
        { id: 'flumazenil', label: 'Flumazenil to reverse any sedation', correct: false, harm: true, msg: 'No role here and it risks seizures.' },
        { id: 'smallatropine', label: 'Single 0.6 mg dose of atropine and observation', correct: false, harm: true, msg: 'Grossly under-dosed. These patients need milligram after milligram until the chest is dry.' },
        { id: 'discharge', label: 'Observe for 6 hours and discharge if the patient looks better', correct: false, harm: true, msg: 'Intermediate syndrome and delayed respiratory failure make early discharge lethal.' }
      ]
    },
    debrief: {
      key: ['Documented organophosphate ingestion with a full muscarinic toxidrome: miosis, bronchorrhoea, salivation, diarrhoea, bradycardia.', 'Cholinesterase 0.9 kU/L with type 2 respiratory failure.', 'Fasciculations and garlicky breath on examination.'],
      pearls: ['Atropine is titrated to a dry chest — huge doses are often needed and the pupils are a poor endpoint.', 'An oxime works best before the enzyme "ages"; give it early, not after everything else fails.', 'Decontaminate: it protects the patient from continued absorption and your team from secondary exposure.'],
      pitfalls: ['Morphine and succinylcholine are both dangerous in this toxidrome.', 'A normal pupil size after atropine does not mean the patient is treated.']
    }
  });

  /* =======================================================================
     CASE 4 — Acute bacterial meningitis / meningococcaemia
     ======================================================================= */
  add({
    id: 'meningitis',
    title: 'Two days of fever and headache in a 24-year-old student',
    category: 'Infectious disease',
    difficulty: 'moderate',
    blurb: 'Photophobia and vomiting; her roommate says she is not making sense.',
    timeLimitSec: 600,
    budget: 2200,
    who: 'Ms. F., 24-year-old university student, no significant past medical history. Two days of severe generalised headache, fever and vomiting. This morning she was confused and a rash appeared on both shins.',
    history: [
      'Two days of severe, generalised, throbbing headache with fever, rigors and repeated vomiting.',
      'Photophobia and neck pain; unable to tolerate the light in her hostel room.',
      'Progressive drowsiness and confusion over 12 hours; today she does not recognise her roommate.',
      'No rash until this morning; the rash is spreading. No recent head injury, no ear or sinus infection, no dental work.',
      'Not immunised against meningococcus; lives in a crowded hostel.'
    ],
    exam: [
      'Unwell, GCS 13 (E3 V4 M6), photophobic, irritable.',
      'Temperature 39.4 C, pulse 118, BP 92/58, respiratory rate 24, capillary refill 3 seconds.',
      '**Neck stiffness and a positive Kernig sign.**',
      '**Non-blanching purpuric and petechial rash over both shins and the left forearm, a few lesions with dusky centres.**',
      'No focal neurological deficit, fundi normal, no papilloedema. No skin sepsis source. Mild splinter haemorrhages absent.'
    ],
    base: { hr: 118, sbp: 92, dbp: 58, rr: 24, spo2: 96, temp: 39.4, gcs: 13 },
    drift: { hr: 0.6, sbp: -0.75, dbp: -0.42, rr: 0.28, spo2: -0.18, temp: 0.02, gcs: -0.055 },
    decay: 0.26,
    events: [
      { at: 150, need: ['action:abx'], loss: 14, msg: 'Antibiotics still not given. The purpura is spreading rapidly and BP has fallen to 80/44 — meningococcal septic shock.' },
      { at: 300, need: ['action:fluids'], loss: 10, msg: 'No fluid resuscitation: cold peripheries, lactate climbing, urine output falling.' },
      { at: 420, need: ['action:dex'], loss: 6, msg: 'Dexamethasone was never given — the window for reducing hearing loss and neurological sequelae has passed.' }
    ],
    actions: [
      A('abx', 'IV ceftriaxone 2 g immediately (do not wait for the LP)', 'Every minute of delay increases mortality.', { cost: 60, tat: 6, factor: 0.45, msg: 'Ceftriaxone given within minutes. Bacteraemia is being sterilised — and the LP can safely wait.' }),
      A('dex', 'Dexamethasone 10 mg IV with or just before the first antibiotic dose', 'Reduces hearing loss in bacterial meningitis.', { cost: 20, tat: 5, factor: 0.85, msg: 'Dexamethasone given with the first dose — the correct timing.' }),
      A('fluids', '0.9% saline 500 mL bolus, reassess, repeat for shock', 'Septic shock needs volume, cautiously in meningitis.', { cost: 18, tat: 8, factor: 0.6, msg: 'BP improved to 104/64, capillary refill under 2 seconds.' }),
      A('oxygen', 'Oxygen to keep SpO2 above 96%, airway protection if GCS falls', 'Anticipate a falling conscious level.', { cost: 15, tat: 5, factor: 0.9, msg: 'Oxygenation secured, airway plan documented.' }),
      A('isolate', 'Droplet precautions, isolation and notify public health for contact prophylaxis', 'Meningococcus is a public health emergency.', { cost: 0, tat: 10, factor: 0.95, msg: 'Isolation and notification done; household and hostel contacts will need chemoprophylaxis.' }),
      A('monitor', 'Continuous monitoring, urinary catheter, hourly neurological observations', 'Detect rising ICP early.', { cost: 20, tat: 10, factor: 0.9, msg: 'Monitoring in place with a clear escalation plan.' }),
      A('delay', 'Wait for CT and LP results before starting antibiotics', 'The classic and lethal mistake.', { cost: 0, tat: 5, factor: 2.1, harm: true, msg: 'Antibiotics delayed — GCS has fallen to 11 and the purpura is spreading. Minutes cost lives in meningococcal sepsis.' }),
      A('mannitol', 'Mannitol 20% 200 mL IV routinely', 'Not indicated without signs of raised ICP.', { cost: 40, tat: 8, factor: 1.35, harm: true, msg: 'Osmotic diuresis dropped the blood pressure further in an already hypotensive patient.' }),
      A('nsaid', 'Paracetamol and ibuprofen for the headache instead of antibiotics', 'Symptomatic treatment of a lethal disease.', { cost: 10, tat: 5, factor: 1.6, harm: true, msg: 'The headache eased briefly. The infection did not.' }),
      A('restrict', 'Fluid restriction to 1 L per day to prevent cerebral oedema', 'Fluid restriction harms septic patients.', { cost: 0, tat: 5, factor: 1.5, harm: true, msg: 'BP fell to 74/40 and the patient is now frankly shocked.' })
    ],
    tests: [
      T('glucose', 'Capillary glucose (before LP)', 'Bedside', 10, 6, '5.2 mmol/L (94 mg/dL). Normal — hypoglycaemia has not caused this confusion.', { flag: 'normal' }),
      T('lp', 'Lumbar puncture and CSF analysis', 'Bedside', 180, 70, 'Opening pressure raised. **Turbid CSF: WBC 2400/mm3 (92% neutrophils), protein 220 mg/dL, CSF glucose 1.4 mmol/L (CSF:blood ratio 0.27)**, Gram stain shows **Gram-negative diplococci**.', { flag: 'critical', factor: 0.9 }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, '**Neisseria meningitidis** grown from both bottles at 18 hours (preliminary report).', { flag: 'critical' }),
      T('pct', 'Meningococcal PCR (blood)', 'Microbiology', 200, 100, '**Neisseria meningitidis DNA detected** — allows typing and confirms the diagnosis even after antibiotics.', { flag: 'critical' }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'WBC 22.4 x10^9/L with toxic granulation and left shift, **platelets 118 x10^9/L** (falling), Hb 12.9.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen and fibrinogen', 'Bloods', 90, 45, 'INR 1.6, APTT 42 s, **fibrinogen 1.4 g/L (low), D-dimer markedly raised** — early disseminated intravascular coagulation.', { flag: 'abnormal' }),
      T('crp', 'CRP and procalcitonin', 'Bloods', 140, 40, 'CRP 184 mg/L and procalcitonin 12 ng/mL — both consistent with invasive bacterial infection.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 44, creatinine 1.3 (pre-renal), Na 131, K 3.6, lactate 3.8 mmol/L.', { flag: 'abnormal' }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 30, 'pH 7.31, pO2 88 mmHg on 4 L, HCO3 19, **lactate 3.8 mmol/L** — shock with a metabolic acidosis.', { flag: 'abnormal' }),
      T('cthead', 'CT head (non-contrast) before LP', 'Imaging', 420, 90, 'No mass lesion, no hydrocephalus, no cerebral oedema, no focal change. Safe to proceed to LP — but do not delay antibiotics while waiting.', { flag: 'normal', factor: 0.97 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lungs, normal cardiac silhouette. No pneumonia as a source.', { flag: 'normal' }),
      T('film', 'Thick and thin blood films for malaria', 'Microbiology', 40, 45, 'No malarial parasites seen. Worth excluding in a febrile traveller.', { flag: 'normal' }),
      T('hiv', 'HIV test with consent', 'Bloods', 60, 60, 'Negative. Relevant to the workup of any unexplained infection, but not the diagnosis today.', { flag: 'normal' }),
      T('mri', 'MRI brain with contrast', 'Imaging', 900, 150, 'Mild meningeal enhancement only. Far too slow and expensive to change what you do in the next ten minutes.', { flag: 'abnormal' })
    ],
    hints: [
      'Non-blanching purpura plus fever plus neck stiffness is a time-critical emergency: antibiotics come before imaging and before the lumbar puncture.',
      'Look at the clock, not the scanner. Every hour of delay in meningococcal sepsis increases mortality.'
    ],
    dx: {
      label: 'Acute bacterial meningitis with meningococcaemia (Neisseria meningitidis)',
      accept: ['bacterial meningitis', 'acute bacterial meningitis', 'meningococcal meningitis', 'meningococcal sepsis', 'meningococcaemia', 'meningitis', 'meningococcal disease', 'pyogenic meningitis'],
      reject: [
        { m: ['viral'], msg: 'Viral meningitis does not produce purpura, a neutrophil CSF predominance or DIC.' },
        { m: ['tuberculous', 'tb ', 'tuberculosis'], msg: 'TB meningitis is a subacute illness over weeks with a lymphocytic CSF. This is hours to days with Gram-negative diplococci.' },
        { m: ['cryptococcal', 'fungal'], msg: 'Fungal meningitis is typically insidious and in the immunocompromised. The CSF here is frankly pyogenic.' },
        { m: ['dengue'], msg: 'Dengue causes thrombocytopenia and rash but a positive tourniquet test, not purpura fulminans with neutrophilic CSF and a Gram stain full of diplococci.' },
        { m: ['malaria'], msg: 'Blood films are negative and the CSF is purulent.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Fever, headache, neck stiffness, photophobia, altered consciousness plus a non-blanching purpuric rash = meningococcal sepsis with meningitis until proven otherwise. CSF shows neutrophilic pleocytosis with Gram-negative diplococci.'
    },
    differentials: ['Acute bacterial meningitis (meningococcal)', 'Viral meningitis', 'Tuberculous meningitis', 'Cryptococcal meningitis', 'Dengue fever', 'Malaria', 'Subarachnoid haemorrhage', 'Encephalitis', 'Leptospirosis', 'Rickettsial infection'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'cef', label: 'IV ceftriaxone 2 g 12-hourly for 10-14 days (or cefotaxime)', correct: true, msg: 'Empirical cover for meningococcus and pneumococcus.' },
        { id: 'vanc', label: 'Add vancomycin if pneumococcal resistance is likely or the Gram stain shows Gram-positive cocci', correct: true, msg: 'Covers resistant pneumococcus until sensitivities return.' },
        { id: 'dex', label: 'Dexamethasone 10 mg 6-hourly for 4 days, started with or before the first antibiotic dose', correct: true, msg: 'Reduces hearing loss and neurological sequelae — timing matters.' },
        { id: 'fluids', label: 'Careful fluid resuscitation for septic shock with vasopressor support if needed', correct: true, msg: 'Restore perfusion without drowning the brain.' },
        { id: 'icu', label: 'ICU or high-dependency care with invasive monitoring', correct: true, msg: 'Meningococcaemia can kill within hours.' },
        { id: 'prophy', label: 'Public health notification and chemoprophylaxis for close contacts (rifampicin, ciprofloxacin or ceftriaxone)', correct: true, msg: 'Stops secondary cases in household and hostel contacts.' },
        { id: 'icp', label: 'Monitor for raised intracranial pressure and treat seizures promptly (no routine mannitol)', correct: true, msg: 'Seizures and raised ICP drive secondary brain injury.' },
        { id: 'clot', label: 'Correct coagulopathy and anaemia; consider activated protein C pathway support/platelets as indicated', correct: true, msg: 'DIC in meningococcaemia must be tracked and corrected.' },
        { id: 'oral', label: 'Oral amoxicillin and discharge with review in 48 hours', correct: false, harm: true, msg: 'Meningococcal sepsis has a mortality approaching 10-20% even with optimal care.' },
        { id: 'restrict', label: 'Fluid restriction for cerebral oedema', correct: false, harm: true, msg: 'Fluid restriction in septic shock kills; the brain needs perfusion too.' },
        { id: 'late', label: 'Start steroids only after 24 hours of antibiotics', correct: false, harm: true, msg: 'Given late, dexamethasone gives no benefit for hearing loss and may harm.' },
        { id: 'acyclovir', label: 'IV acyclovir alone as the sole antimicrobial', correct: false, harm: true, msg: 'Acyclovir covers herpes simplex, not meningococcus — untreated bacterial meningitis is fatal.' },
        { id: 'nsaid2', label: 'Analgesia only with regular NSAIDs and reassessment tomorrow', correct: false, harm: true, msg: 'Symptomatic treatment of a lethal infection.' }
      ]
    },
    debrief: {
      key: ['Fever, severe headache, photophobia, neck stiffness and Kernig sign.', 'Non-blanching purpuric rash with dusky centres — meningococcaemia.', 'GCS 13, BP 92/58, platelets 118, INR 1.6, lactate 3.8: septic shock with early DIC.'],
      pearls: ['Antibiotics first, then imaging, then lumbar puncture. The CT and the LP are diagnostic, never therapeutic.', 'Dexamethasone with or before the first antibiotic dose, not after.', 'Notify public health: the hostel contacts need prophylaxis tonight.'],
      pitfalls: ['Waiting for the CT scan before giving ceftriaxone is the single most common lethal error in this disease.', 'Routine mannitol and fluid restriction both worsen the outcome.']
    }
  });

})();
