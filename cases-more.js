/* =========================================================================
   MediTriage — case library (part 2 of 2)
   Loaded after cases.js. Same schema; just push onto window.CASES.
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
     CASE 5 — High-risk pulmonary embolism
     ======================================================================= */
  add({
    id: 'pe',
    title: 'Sudden breathlessness and collapse eight days after knee surgery',
    category: 'Respiratory / Thrombosis',
    difficulty: 'moderate',
    blurb: 'Day eight after a total knee replacement: sudden pleuritic pain, breathlessness and a faint in the bathroom.',
    timeLimitSec: 600,
    budget: 2600,
    who: 'Mrs. L., 62-year-old retired teacher. Total knee replacement eight days ago; mobility poor since, calf discomfort for two days. Sudden pleuritic right-sided chest pain while walking to the bathroom, then a collapse with brief loss of consciousness.',
    history: [
      'Sudden onset of pleuritic right-sided chest pain and severe breathlessness 40 minutes ago.',
      'Transient loss of consciousness, now drowsy but rousable, feeling of impending doom.',
      'Two days of right calf pain and swelling; reduced mobility since surgery; no anticoagulant prophylaxis after discharge.',
      'No fever, no cough or sputum, no wheeze, no chest trauma. No previous cardiopulmonary disease.',
      'Non-smoker, BMI 31, on no regular medication.'
    ],
    exam: [
      'Anxious, pale, clammy and tachypnoeic. GCS 14.',
      'Pulse 126 regular, **BP 88/56**, respiratory rate 32, SpO2 86% on room air, temperature 37.4 C.',
      'JVP raised with a prominent v wave; **loud P2** and a right ventricular heave; clear lung fields.',
      '**Right calf swollen, warm and tender** with a 3 cm circumferential difference.',
      'No murmur, no rub, no crackles. Peripheral pulses present but thready.'
    ],
    base: { hr: 126, sbp: 88, dbp: 56, rr: 32, spo2: 86, temp: 37.4, gcs: 14 },
    drift: { hr: 0.7, sbp: -0.85, dbp: -0.45, rr: 0.4, spo2: -0.5, temp: 0.01, gcs: -0.05 },
    decay: 0.30,
    events: [
      { at: 150, need: ['action:anticoag'], loss: 12, msg: 'No anticoagulation yet — the right ventricle is failing and the blood pressure is falling.' },
      { at: 270, need: ['action:thrombolysis'], loss: 18, msg: 'This patient is haemodynamically unstable and has not been thrombolysed. The monitor shows sinus tachycardia with new right axis deviation.' },
      { at: 400, need: ['test:ctpa'], loss: 8, msg: 'No definitive imaging has been obtained. The diagnosis remains unproven while the patient deteriorates.' }
    ],
    actions: [
      A('oxygen', 'Oxygen to keep SpO2 above 94%', 'Hypoxia is present and easily corrected.', { cost: 15, tat: 5, factor: 0.8, msg: 'SpO2 improved to 95% on 4 L — the work of breathing is less.' }),
      A('anticoag', 'Therapeutic anticoagulation now: LMWH or unfractionated heparin', 'Do not wait for confirmatory imaging in an unstable patient.', { cost: 70, tat: 8, factor: 0.62, msg: 'Heparin given — thrombus propagation is being halted while imaging is arranged.' }),
      A('thrombolysis', 'Systemic thrombolysis: alteplase 100 mg over 2 hours (or 1.5 mg/kg)', 'The treatment for PE with haemodynamic instability.', { cost: 420, tat: 15, factor: 0.35, msg: 'Alteplase running. Over 20 minutes the BP rose to 108/70, the heart rate fell to 104 and the saturation improved to 97%.' }),
      A('cautiousfluid', 'Cautious 250-500 mL crystalloid bolus with close monitoring', 'A small bolus can help a failing right ventricle; large volumes flood it.', { cost: 18, tat: 8, factor: 0.85, msg: 'Small bolus given with a modest rise in blood pressure.' }),
      A('bigfluid', 'Rapid 2 L crystalloid resuscitation', 'The right ventricle is already distended.', { cost: 30, tat: 10, factor: 1.6, harm: true, msg: 'After 2 L the JVP is higher, the liver is tender and the blood pressure has not improved — the failing right ventricle is being overdistended and the septum is shifting.' }),
      A('furosemide', 'Furosemide 40 mg IV for the raised JVP', 'The raised JVP is right heart failure, not fluid overload.', { cost: 10, tat: 6, factor: 1.8, harm: true, msg: 'BP fell to 70/40 within minutes. A preload-dependent right ventricle cannot afford diuresis.' }),
      A('nitrate', 'GTN infusion for the elevated filling pressures', 'Venodilation removes the preload this patient needs.', { cost: 12, tat: 6, factor: 1.7, harm: true, msg: 'Profound hypotension after the nitrate infusion — preload was the only thing maintaining cardiac output.' }),
      A('icu', 'Call critical care and prepare for vasopressors and possible CPR', 'This patient can arrest at any moment.', { cost: 0, tat: 8, factor: 0.85, msg: 'Critical care at the bedside with noradrenaline prepared and the arrest trolley checked.' }),
      A('monitor', 'Continuous cardiac monitoring, IV access, arterial line if available', 'Anticipate arrhythmia and arrest.', { cost: 25, tat: 8, factor: 0.9, msg: 'Monitoring established.' }),
      A('legcare', 'Elevate the leg, avoid massaging the calf', 'Prevent further embolisation.', { cost: 0, tat: 5, factor: 0.95, msg: 'Leg elevated; no manipulation of the thrombus.' })
    ],
    tests: [
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 128. **S1 Q3 T3 pattern, right axis deviation, new incomplete right bundle branch block, T wave inversion in V1-V3.**', { flag: 'critical', factor: 0.85 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.47, **pO2 52 mmHg on room air**, pCO2 28 mmHg, HCO3 20, **lactate 3.4 mmol/L** — significant hypoxaemia with a widened A-a gradient and hypoperfusion.', { flag: 'critical', factor: 0.85 }),
      T('echo', 'Focused bedside echocardiography', 'Bedside', 160, 40, '**Dilated, hypokinetic right ventricle with a D-shaped septum and a McConnell sign.** Estimated pulmonary pressure high. The left ventricle is small and underfilled. No pericardial effusion. This is acute right heart strain.', { flag: 'critical', factor: 0.8 }),
      T('trop', 'High-sensitivity troponin', 'Bloods', 120, 50, '**hs-troponin T 96 ng/L** — myocardial injury from right ventricular strain, not plaque rupture.', { flag: 'abnormal' }),
      T('bnp', 'NT-proBNP', 'Bloods', 130, 55, '**3400 pg/mL** — consistent with acute right ventricular strain.', { flag: 'abnormal' }),
      T('ddimer', 'D-dimer', 'Bloods', 110, 40, '**4.8 ug/mL** — raised, but in a post-operative patient this is expected and cannot confirm or exclude the diagnosis.', { flag: 'abnormal' }),
      T('ctpa', 'CT pulmonary angiogram', 'Imaging', 700, 90, '**Filling defects in the right main and both lobar pulmonary arteries with right ventricular enlargement (RV:LV ratio 1.4).** No infarct, no pneumothorax. This is the definitive test — if the patient is stable enough to travel.', { flag: 'critical', factor: 0.85 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields, normal heart size, no pneumothorax, no consolidation. A raised hemidiaphragm on the right. Mostly useful for excluding alternatives.', { flag: 'normal' }),
      T('doppler', 'Compression ultrasound of the legs', 'Imaging', 180, 60, '**Non-compressible right popliteal and femoral veins** — proximal deep vein thrombosis. Confirms the source even when CT is unavailable.', { flag: 'abnormal', factor: 0.92 }),
      T('cbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 12.6, WBC 13.8, platelets 232. Nothing here explains the presentation.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 48, creatinine 1.4 (pre-renal), Na 134, K 4.4.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen', 'Bloods', 90, 40, 'INR 1.1, APTT 30 s, fibrinogen normal — safe to anticoagulate and to thrombolyse.', { flag: 'normal' }),
      T('vq', 'Ventilation-perfusion scan', 'Imaging', 480, 120, 'Multiple mismatched segmental defects. Diagnostic, but far slower than CTPA in a patient this unstable.', { flag: 'abnormal' }),
      T('tft', 'Thyroid function tests', 'Bloods', 110, 90, 'Normal. Achieves nothing in the next ten minutes.', { flag: 'normal' })
    ],
    hints: [
      'Post-operative immobility, a swollen calf, sudden hypoxia and a raised JVP: think clot in the lungs with a strained right ventricle.',
      'An unstable patient with a failing right ventricle needs reperfusion and anticoagulation, not diuresis. Preload is keeping this patient alive.'
    ],
    dx: {
      label: 'High-risk (massive) acute pulmonary embolism with right ventricular failure',
      accept: ['pulmonary embolism', 'acute pulmonary embolism', 'massive pulmonary embolism', 'high risk pulmonary embolism', 'pe', 'pulmonary thromboembolism', 'submassive pulmonary embolism with right ventricular strain'],
      reject: [
        { m: ['myocardial infarction', 'stemi', 'acs', 'coronary'], msg: 'The troponin is raised but the ECG shows right heart strain (S1Q3T3, RBBB) and the echo shows a dilated right ventricle — this is not plaque rupture.' },
        { m: ['pneumonia'], msg: 'There is no fever, no cough and the chest X-ray is clear. Hypoxia with a clear chest and a swollen calf points to embolism.' },
        { m: ['pneumothorax'], msg: 'The chest X-ray shows no pneumothorax and breath sounds are equal.' },
        { m: ['tamponade', 'pericardial'], msg: 'There is no pericardial effusion and the JVP is raised with right ventricular dilation, not equalisation of pressures.' },
        { m: ['dissection'], msg: 'No tearing pain, no pulse deficit, no mediastinal widening.' },
        { m: ['anxiety', 'panic'], msg: 'A saturation of 86% with a lactate of 3.4 is not anxiety.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Sudden dyspnoea and syncope eight days after major orthopaedic surgery, with a swollen calf, clear chest, hypoxaemia, raised JVP, S1Q3T3 on ECG and a dilated hypocontractile right ventricle. CTPA confirms proximal emboli.'
    },
    differentials: ['Acute pulmonary embolism', 'Acute myocardial infarction', 'Pneumonia', 'Pneumothorax', 'Cardiac tamponade', 'Aortic dissection', 'Acute severe asthma / COPD exacerbation', 'Anxiety with hyperventilation', 'Pleural effusion', 'Fat embolism syndrome'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'thrombo', label: 'Systemic thrombolysis (alteplase) for haemodynamic instability', correct: true, msg: 'Reperfusion of the obstructed pulmonary bed; the only therapy shown to reduce mortality in shock from PE.' },
        { id: 'heparin', label: 'Unfractionated heparin bolus and infusion (or LMWH) — continue anticoagulation after thrombolysis', correct: true, msg: 'Prevents clot propagation and recurrence.' },
        { id: 'o2', label: 'Oxygen with ventilatory support if needed, avoiding excessive intubation pressures', correct: true, msg: 'Corrects hypoxaemia; high airway pressures can worsen right ventricular failure.' },
        { id: 'smallvol', label: 'Small cautious fluid bolus, then noradrenaline for persistent hypotension', correct: true, msg: 'Vasopressors support the right ventricle better than large volumes.' },
        { id: 'icu2', label: 'Critical care admission with continuous monitoring and an arrest plan', correct: true, msg: 'The risk of arrest is highest in the first hours.' },
        { id: 'catheter', label: 'Consider catheter-directed therapy or surgical embolectomy if thrombolysis is contraindicated or fails', correct: true, msg: 'Escalation options for a patient in refractory shock.' },
        { id: 'doppler2', label: 'Confirm the source with leg ultrasound; consider an IVC filter only if anticoagulation is contraindicated', correct: true, msg: 'Filter is a second-line option, not a substitute for anticoagulation.' },
        { id: 'observe', label: 'Repeat the D-dimer in 6 hours and observe', correct: false, harm: true, msg: 'Observation in a patient with a systolic pressure of 88 mmHg and a lactate of 3.4 is a fatal plan.' },
        { id: 'furo2', label: 'Furosemide to reduce the raised JVP', correct: false, harm: true, msg: 'Diuresis in a preload-dependent right ventricle causes profound hypotension.' },
        { id: 'nitro2', label: 'Nitrates for the pulmonary congestion you assume is there', correct: false, harm: true, msg: 'The lungs are clear — this is right heart failure, and venodilation removes the preload keeping the patient alive.' },
        { id: 'bigfluid2', label: 'Rapid 2 L fluid resuscitation', correct: false, harm: true, msg: 'Overdistending the right ventricle worsens septal shift and reduces left ventricular filling.' },
        { id: 'dapt', label: 'Aspirin and clopidogrel as for acute coronary syndrome', correct: false, harm: true, msg: 'Antiplatelet therapy does not treat venous thromboembolism and adds bleeding risk on top of thrombolysis.' },
        { id: 'discharge2', label: 'Discharge with analgesia and outpatient follow-up', correct: false, harm: true, msg: 'This patient can arrest within the hour.' }
      ]
    },
    debrief: {
      key: ['Day eight after knee replacement with poor mobility and no prophylaxis.', 'Swollen tender calf, sudden pleuritic pain, syncope, BP 88/56, SpO2 86%, raised JVP.', 'ECG S1Q3T3 with RBBB, troponin 96, dilated hypokinetic right ventricle, CTPA showing proximal emboli.'],
      pearls: ['In an unstable patient, treat first and image afterwards — heparin immediately, thrombolysis if shocked.', 'The right ventricle is preload dependent: small fluid boluses and vasopressors, never diuretics or nitrates.', 'A swollen calf after surgery is the warning shot. Prophylaxis and early mobilisation prevent the whole scenario.'],
      pitfalls: ['Treating a raised JVP with furosemide is a classic fatal error in right heart failure.', 'A raised troponin does not make this a coronary event — look at the ECG and the echo.']
    }
  });

  /* =======================================================================
     CASE 6 — Dengue with warning signs progressing to shock
     ======================================================================= */
  add({
    id: 'dengue',
    title: 'Day five of fever, now with abdominal pain and bleeding gums',
    category: 'Tropical medicine',
    difficulty: 'moderate',
    blurb: 'The fever has broken, but the patient is worse: severe abdominal pain, vomiting, cold hands and bleeding gums.',
    timeLimitSec: 600,
    budget: 1900,
    who: 'Mr. A., 28-year-old software engineer. Five days of high fever with severe body aches and headache. The fever settled this morning, but he now has severe abdominal pain, repeated vomiting and bleeding from the gums.',
    history: [
      'Day 1-4: high fever 39-40 C with retro-orbital headache, myalgia and a transient blanching rash on the trunk.',
      'Today (day 5): fever has settled but the patient feels much worse — severe generalised abdominal pain, persistent vomiting, and bleeding gums while brushing.',
      'Passing smaller volumes of dark urine. No melaena, no haematemesis, no epistaxis.',
      'He has been taking ibuprofen four times a day for the body aches. Lives in an area with a current dengue outbreak.',
      'No travel abroad, no jaundice, no prior bleeding disorder, no anticoagulant use.'
    ],
    exam: [
      'Restless, alert but anxious. GCS 15.',
      'Pulse 124 thready, **BP 92/64 with a narrow pulse pressure of 28 mmHg**, respiratory rate 24, SpO2 97%, temperature 37.6 C.',
      '**Cold, clammy peripheries with capillary refill of 4 seconds.**',
      '**Bleeding gums and a few petechiae**; a positive tourniquet test. No ecchymoses or haemarthrosis.',
      'Abdomen tender with **right upper quadrant tenderness and a palpable liver edge**, no guarding or rigidity. No ascites clinically. No pleural rub.'
    ],
    base: { hr: 124, sbp: 92, dbp: 64, rr: 24, spo2: 97, temp: 37.6, gcs: 15 },
    drift: { hr: 0.55, sbp: -0.55, dbp: -0.65, rr: 0.28, spo2: -0.15, temp: 0.008, gcs: -0.03 },
    decay: 0.25,
    events: [
      { at: 170, need: ['action:fluids'], loss: 12, msg: 'No fluid resuscitation: the pulse pressure is now 18 mmHg and the patient is in compensated-to-decompensated dengue shock.' },
      { at: 300, need: ['test:cbc2'], loss: 8, msg: 'No repeat haematocrit has been done. You are resuscitating blind — rising haematocrit means continuing leakage, falling haematocrit means bleeding.' },
      { at: 430, need: ['action:noNsaid'], loss: 10, msg: 'The patient is still taking ibuprofen. NSAIDs in dengue cause gastritis, bleeding and acute kidney injury.' }
    ],
    actions: [
      A('fluids', 'Isotonic crystalloid 5-10 mL/kg over 1 hour, then titrate to urine output', 'Just enough, not too much — leakage is transient.', { cost: 20, tat: 8, factor: 0.6, msg: 'BP improved to 104/70 with a pulse pressure of 34 mmHg and warm peripheries.' }),
      A('bigbolus', 'Rapid 30 mL/kg crystalloid bolus over 15 minutes', 'Over-resuscitation causes pulmonary oedema in dengue.', { cost: 35, tat: 10, factor: 1.6, harm: true, msg: 'After the large bolus the JVP is raised, the liver is more tender and the respiratory rate is climbing — fluid overload in the leakage phase.' }),
      A('noNsaid', 'Stop all NSAIDs and intramuscular injections; use paracetamol only', 'Ibuprofen is actively harming this patient.', { cost: 5, tat: 5, factor: 0.75, msg: 'NSAIDs stopped and paracetamol substituted. Platelet function and gastric mucosa will thank you.' }),
      A('monitor', 'Hourly vital signs, urine output chart, serial haematocrit', 'The haematocrit is your only bedside gauge of leakage.', { cost: 20, tat: 10, factor: 0.8, msg: 'Monitoring protocol in place with hourly observations and 4-hourly haematocrit.' }),
      A('oxygen', 'Oxygen if SpO2 falls below 94%', 'Watch for pleural effusion and overload.', { cost: 15, tat: 5, factor: 0.95, msg: 'Oxygen at hand; saturations stable.' }),
      A('platelets', 'Prophylactic platelet transfusion because the count is 28,000', 'Not indicated without significant bleeding.', { cost: 260, tat: 25, factor: 1.25, harm: true, msg: 'Platelets transfused with no significant bleeding — no evidence of benefit, and a transfusion reaction risk in a patient who did not need it.' }),
      A('steroids', 'IV dexamethasone for the thrombocytopenia', 'Steroids do not treat dengue.', { cost: 25, tat: 6, factor: 1.3, harm: true, msg: 'Steroid given — no benefit, and it may mask signs of deterioration.' }),
      A('catheter', 'Urinary catheter for accurate hourly output, weigh the patient', 'Target 0.5-1 mL/kg/hour.', { cost: 15, tat: 10, factor: 0.9, msg: 'Hourly urine output monitoring in place.' }),
      A('prone', 'Left lateral position and reassurance', 'Comfort and aspiration prevention with vomiting.', { cost: 0, tat: 4, factor: 0.98, msg: 'Patient settled and positioned safely.' })
    ],
    tests: [
      T('cbc2', 'Full blood count with haematocrit', 'Bloods', 45, 30, '**Haematocrit 52% (baseline 42%) — haemoconcentration**, Hb 16.8 g/dL, **platelets 28 x10^9/L**, WBC 3.4 with relative lymphocytosis, atypical lymphocytes present.', { flag: 'critical', factor: 0.8 }),
      T('ns1', 'Dengue NS1 antigen', 'Microbiology', 150, 60, '**Dengue NS1 antigen POSITIVE** — confirms acute dengue infection. Can be negative after day 5.', { flag: 'critical', factor: 0.9 }),
      T('igm', 'Dengue IgM and IgG serology', 'Microbiology', 180, 90, '**Dengue IgM positive** with IgG negative — consistent with primary dengue at day 5.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 42, creatinine 1.5 (rising), Na 132, K 4.0, bicarbonate 18.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 45, 'AST 320 U/L, ALT 180 U/L, bilirubin 1.6 mg/dL, albumin 2.9 g/dL — dengue hepatitis with hypoalbuminaemia from leakage.', { flag: 'abnormal' }),
      T('coag2', 'Coagulation screen', 'Bloods', 90, 45, 'PT 16 s, INR 1.4, APTT 44 s, fibrinogen 1.6 g/L — mild coagulopathy. No evidence of overt DIC yet.', { flag: 'abnormal' }),
      T('usg', 'Abdominal ultrasound', 'Imaging', 260, 50, '**Gallbladder wall thickening, mild ascites and bilateral pleural effusions** — evidence of plasma leakage. No free air, no intussusception.', { flag: 'abnormal', factor: 0.9 }),
      T('cxr2', 'Chest X-ray (erect)', 'Imaging', 90, 30, 'Small bilateral pleural effusions, no consolidation or pneumothorax, normal heart size.', { flag: 'abnormal' }),
      T('abg2', 'Arterial or venous blood gas', 'Bloods', 95, 30, 'pH 7.33, HCO3 18, **lactate 3.2 mmol/L**, base excess -5 — compensated metabolic acidosis from shock.', { flag: 'abnormal' }),
      T('glucose2', 'Capillary glucose', 'Bedside', 10, 6, '5.4 mmol/L — normal.', { flag: 'normal' }),
      T('film2', 'Malaria thick and thin films, dengue rapid test for chikungunya', 'Microbiology', 60, 50, 'No malarial parasites. Chikungunya negative. Useful exclusion but does not explain the leakage.', { flag: 'normal' }),
      T('widal', 'Widal test for enteric fever', 'Microbiology', 50, 60, 'TO 1:160, TH 1:160 — a single titre in an endemic area is meaningless and often falsely positive.', { flag: 'abnormal' }),
      T('bc2', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. Dengue is not a bacterial illness, but co-infection must be considered in shock.', { flag: 'normal' }),
      T('ctabd', 'CT abdomen with contrast', 'Imaging', 620, 100, 'Confirms ascites and gallbladder wall thickening. Employs contrast in a patient with a rising creatinine, at high cost, and changes nothing.', { flag: 'abnormal' })
    ],
    hints: [
      'The fever has broken but the patient is worse — that is the critical phase, and the haematocrit tells you what is leaking.',
      'In dengue, give just enough fluid to keep the circulation going. Too little and the patient is in shock; too much and the lungs fill.'
    ],
    dx: {
      label: 'Dengue fever with warning signs, in the critical (leakage) phase, with compensated shock',
      accept: ['dengue with warning signs', 'dengue shock syndrome', 'severe dengue', 'dengue haemorrhagic fever', 'dengue fever with warning signs', 'dengue hemorrhagic fever', 'dengue fever', 'dengue'],
      reject: [
        { m: ['malaria'], msg: 'Blood films are negative and malaria does not cause haemoconcentration with a thickened gallbladder wall.' },
        { m: ['typhoid', 'enteric fever'], msg: 'A single Widal titre is uninterpretable in an endemic area. The NS1 antigen is positive.' },
        { m: ['chikungunya'], msg: 'Chikungunya causes severe joint pain and rarely plasma leakage or thrombocytopenia this severe.' },
        { m: ['leptospirosis'], msg: 'Leptospirosis causes jaundice with renal failure and conjunctival suffusion, not haemoconcentration with gallbladder wall thickening.' },
        { m: ['itp', 'immune thrombocytopenia'], msg: 'ITP does not cause fever, plasma leakage or haemoconcentration.' },
        { m: ['gastroenteritis'], msg: 'The abdominal pain and vomiting are dengue warning signs — the haemoconcentration and thrombocytopenia give the diagnosis away.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'NS1-positive dengue with deferred fever, severe abdominal pain, persistent vomiting, mucosal bleeding, narrow pulse pressure, haemoconcentration (haematocrit 52%) and ultrasound evidence of plasma leakage: dengue with warning signs in the critical phase.'
    },
    differentials: ['Dengue fever with warning signs', 'Dengue shock syndrome', 'Malaria', 'Typhoid (enteric) fever', 'Chikungunya', 'Leptospirosis', 'Immune thrombocytopenic purpura', 'Acute gastroenteritis', 'Bacterial sepsis', 'Acute appendicitis'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'crystal', label: 'Isotonic crystalloid 5-10 mL/kg/hour titrated to urine output 0.5-1 mL/kg/hour and improving pulse pressure', correct: true, msg: 'The correct fluid strategy in the leakage phase — enough perfusion without overload.' },
        { id: 'hct', label: 'Serial haematocrit (4-hourly, more often in shock) with strict input-output charting', correct: true, msg: 'Rising haematocrit means ongoing leakage; a sudden fall means bleeding until proven otherwise.' },
        { id: 'nonsaid', label: 'Paracetamol only; stop NSAIDs and avoid intramuscular injections', correct: true, msg: 'Protects platelets, gastric mucosa and kidneys.' },
        { id: 'monitor2', label: 'High-dependency monitoring with hourly observations and early warning score escalation', correct: true, msg: 'Deterioration in the critical phase can happen in an hour.' },
        { id: 'blood', label: 'Cross-match and transfuse packed cells if there is significant bleeding or a falling haematocrit with shock', correct: true, msg: 'Transfusion for bleeding, not for a number on the platelet count.' },
        { id: 'colloid', label: 'Consider colloid or a small fluid challenge if shock persists after crystalloid', correct: true, msg: 'Accepted step-up for refractory dengue shock.' },
        { id: 'edu', label: 'Educate on warning signs and plan discharge only after 24 hours without fever and stable haematocrit', correct: true, msg: 'Prevents the re-admission in the next critical window.' },
        { id: 'bigfluids', label: 'Aggressive 20 mL/kg boluses repeated until the blood pressure is normal', correct: false, harm: true, msg: 'Over-resuscitation in the leakage phase causes pulmonary oedema and prolonged effusions.' },
        { id: 'platelet2', label: 'Prophylactic platelet transfusion for a count of 28,000 without bleeding', correct: false, harm: true, msg: 'No proven benefit; platelets are consumed anyway and reactions are common.' },
        { id: 'steroid2', label: 'IV dexamethasone to shorten the illness', correct: false, harm: true, msg: 'Steroids are not indicated in dengue and may mask deterioration.' },
        { id: 'nsaid3', label: 'Continue ibuprofen for the severe body aches', correct: false, harm: true, msg: 'NSAIDs cause gastritis, bleeding and renal injury on top of dengue.' },
        { id: 'im', label: 'Intramuscular analgesic injection for the abdominal pain', correct: false, harm: true, msg: 'Intramuscular injections cause haematomas in a thrombocytopenic, leaking patient.' },
        { id: 'discharge3', label: 'Discharge home now that the fever has settled', correct: false, harm: true, msg: 'The afebrile period is exactly when plasma leakage and shock occur.' }
      ]
    },
    debrief: {
      key: ['Defervescence on day 5 with worsening abdominal pain, persistent vomiting and mucosal bleeding — the classic transition into the critical phase.', 'Narrow pulse pressure of 28 mmHg with cold peripheries, haematocrit 52% and platelets 28,000.', 'NS1 antigen positive with ultrasound evidence of plasma leakage.'],
      pearls: ['In dengue the danger is not the fever, it is the leakage that follows it.', 'Haematocrit plus urine output are your two bedside gauges; titrate fluid to a target, never to a reflex.', 'NSAIDs and intramuscular injections are contraindicated — they convert a manageable illness into a bleeding one.'],
      pitfalls: ['Both under- and over-resuscitation kill: shock from leakage, pulmonary oedema from enthusiasm.', 'A single Widal titre and a mildly raised AST are not a diagnosis of typhoid or hepatitis.']
    }
  });

  /* =======================================================================
     CASE 7 — Acute severe hyponatraemia with seizure
     ======================================================================= */
  add({
    id: 'hyponatraemia',
    title: 'Confusion and a seizure in a man on a thiazide',
    category: 'Nephrology / Neurology',
    difficulty: 'hard',
    blurb: 'Three days of confusion and unsteadiness, now a generalised seizure in the resuscitation room.',
    timeLimitSec: 600,
    budget: 2300,
    who: 'Mr. B., 68-year-old retired clerk. Three days of nausea, headache, confusion and unsteadiness on his feet. He has just had a generalised tonic-clonic seizure on arrival. He takes hydrochlorothiazide for hypertension and drinks three to four litres of water daily.',
    history: [
      'Three days of progressive confusion, lethargy and unsteadiness; his wife says he is "not himself" and is drinking and passing large volumes.',
      'A generalised tonic-clonic seizure lasting about 90 seconds, witnessed in the ambulance; now post-ictal.',
      'Started hydrochlorothiazide 25 mg six weeks ago for hypertension; no dose change otherwise.',
      'High water intake, low salt diet. No vomiting or diarrhoea, no diuretic excess, no head injury, no alcohol.',
      'No previous seizures, no thyroid disease, no known cancer, no steroids.'
    ],
    exam: [
      'Post-ictal and drowsy, GCS 10 (E2 V3 M5), moving all four limbs symmetrically, no focal deficit.',
      'Pulse 88, BP 138/78 lying and 128/76 standing, temperature 36.6 C, respiratory rate 18, SpO2 96%.',
      'Mucous membranes moist, no oedema, no rash, no lymphadenopathy, chest clear, no hepatosplenomegaly.',
      'Fundi normal, no papilloedema. No meningism. No tremor or asterixis.',
      'Weight 68 kg; urine output has been high over the last day.'
    ],
    base: { hr: 88, sbp: 138, dbp: 78, rr: 18, spo2: 96, temp: 36.6, gcs: 10 },
    drift: { hr: 0.28, sbp: -0.35, dbp: -0.22, rr: 0.16, spo2: -0.12, temp: 0.004, gcs: -0.075 },
    decay: 0.24,
    events: [
      { at: 140, need: ['action:hypertonic'], loss: 16, msg: 'No hypertonic saline has been given despite the seizure. The patient is now deeply drowsy with a further seizure beginning.' },
      { at: 280, need: ['action:stopdrug'], loss: 8, msg: 'Hydrochlorothiazide is still being charted — the cause is still being administered.' },
      { at: 420, need: ['test:na'], loss: 8, msg: 'No serum sodium has been measured. You cannot correct what you have not quantified.' }
    ],
    actions: [
      A('hypertonic', '3% hypertonic saline 100 mL IV bolus over 10 minutes', 'The treatment for hyponatraemic seizure.', { cost: 80, tat: 6, factor: 0.42, msg: 'Seizure activity stopped. After 100 mL of 3% saline the sodium rose by 3 mmol/L and the patient is beginning to rouse.' }),
      A('benzo', 'IV lorazepam for ongoing seizure activity, with airway support', 'Stop the seizure while you correct the sodium.', { cost: 20, tat: 6, factor: 0.6, msg: 'Seizure terminated with lorazepam; airway protected.' }),
      A('stopdrug', 'Stop hydrochlorothiazide immediately and review all medications', 'The cause is in the drug chart.', { cost: 0, tat: 5, factor: 0.8, msg: 'Thiazide stopped and the chart reviewed — free water retention will start to resolve.' }),
      A('airway', 'Left lateral position, oxygen, suction, airway adjunct', 'Protect an airway during a seizure.', { cost: 15, tat: 5, factor: 0.88, msg: 'Airway secured, oxygen saturations maintained.' }),
      A('restrict', 'Fluid restriction to 800 mL per day', 'The right medium-term treatment — but not during a seizure.', { cost: 0, tat: 8, factor: 0.98, msg: 'Fluid restriction charted for once the acute crisis is controlled.' }),
      A('saline', '0.9% saline 1 L rapid infusion', 'In SIADH this can worsen the sodium.', { cost: 18, tat: 10, factor: 1.35, harm: true, msg: 'The urine remains concentrated and the serum sodium has fallen further — the saline is being excreted and free water retained.' }),
      A('rapid', 'Correct the sodium to 140 mmol/L within two hours', 'Osmotic demyelination is irreversible.', { cost: 25, tat: 10, factor: 1.5, harm: true, msg: 'Sodium over-corrected rapidly — this now risks osmotic demyelination with locked-in syndrome in a week.' }),
      A('mannitol', 'Mannitol 20% 250 mL for presumed cerebral oedema', 'Not the treatment for hyponatraemic encephalopathy.', { cost: 45, tat: 8, factor: 1.3, harm: true, msg: 'Mannitol caused an osmotic diuresis, worsening hypovolaemia and the sodium abnormality.' }),
      A('dextrose', '5% dextrose infusion as maintenance fluid', 'Free water in a patient who cannot excrete it.', { cost: 15, tat: 8, factor: 1.6, harm: true, msg: 'Dextrose is free water — the sodium fell further and the confusion deepened.' }),
      A('monitor', 'Hourly neurological observations and 2-hourly sodium, strict fluid balance', 'You must watch the rate of correction.', { cost: 20, tat: 10, factor: 0.85, msg: 'Monitoring established; the correction rate is now being tracked.' })
    ],
    tests: [
      T('na', 'Serum sodium, potassium and paired serum/urine osmolality', 'Bloods', 70, 30, '**Serum sodium 108 mmol/L**, K 3.4, chloride 78. **Serum osmolality 228 mOsm/kg (low), urine osmolality 480 mOsm/kg (inappropriately concentrated), urine sodium 68 mmol/L.**', { flag: 'critical', factor: 0.75 }),
      T('glucose3', 'Capillary glucose', 'Bedside', 10, 6, '5.6 mmol/L — normal. Always exclude hypoglycaemia as a cause of seizure and confusion.', { flag: 'normal' }),
      T('ue3', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 18 mg/dL (low), creatinine 0.8, Na 108, K 3.4, bicarbonate 24. Low urea with euvolaemia fits SIADH.', { flag: 'critical' }),
      T('cortisol', '9 am cortisol (and ACTH)', 'Bloods', 140, 70, 'Cortisol 420 nmol/L with a normal ACTH — adrenal insufficiency excluded. Worth excluding in every unexplained hyponatraemia.', { flag: 'normal' }),
      T('tsh', 'Thyroid function tests', 'Bloods', 110, 80, 'TSH 2.1, free T4 normal — hypothyroidism excluded.', { flag: 'normal' }),
      T('cthead2', 'CT head (non-contrast)', 'Imaging', 420, 80, 'No haemorrhage, no infarct, no mass lesion, no hydrocephalus. Mild generalised cerebral oedema consistent with acute hypotonic hyponatraemia.', { flag: 'abnormal', factor: 0.95 }),
      T('cxr3', 'Chest X-ray', 'Imaging', 90, 30, 'Normal. No hilar mass or effusion — no radiological clue to a small cell lung cancer today.', { flag: 'normal' }),
      T('cbc3', 'Full blood count', 'Bloods', 45, 30, 'Hb 13.0, WBC 6.2, platelets 220. Normal.', { flag: 'normal' }),
      T('abg3', 'Blood gas', 'Bloods', 95, 30, 'pH 7.36, pCO2 38, pO2 88, HCO3 24, lactate 1.4. No acidosis.', { flag: 'normal' }),
      T('urine_na', 'Urine sodium and urine output measurement', 'Bloods', 60, 45, 'Urine sodium 68 mmol/L with a urine osmolality of 480 mOsm/kg. Urine sodium above 30 on a thiazide points to thiazide-induced SIADH-like physiology.', { flag: 'abnormal' }),
      T('lipids2', 'Lipid profile and serum protein electrophoresis', 'Bloods', 180, 90, 'Normal. Pseudohyponatraemia excluded — but it never causes seizures, because the osmolality is normal.', { flag: 'normal' }),
      T('mri', 'MRI brain', 'Imaging', 900, 150, 'No acute finding. Excellent for the future workup of a first seizure, useless in the next ten minutes.', { flag: 'normal' }),
      T('eeg', 'EEG', 'Special', 400, 120, 'Generalised slowing consistent with metabolic encephalopathy. Does not change emergency management.', { flag: 'abnormal' })
    ],
    hints: [
      'A sodium of 108 mmol/L with a seizure is a neurological emergency: hypertonic saline, small bolus, and a target — not a rapid dash to normal.',
      'Correct too fast and you cause osmotic demyelination. Aim for 4-6 mmol/L in the first two hours and no more than 8-10 mmol/L in 24 hours.'
    ],
    dx: {
      label: 'Acute severe symptomatic hyponatraemia (thiazide-induced, SIADH-like) with a seizure',
      accept: ['severe hyponatraemia', 'acute symptomatic hyponatraemia', 'hyponatraemic seizure', 'hyponatraemia with seizures', 'siadh', 'siadh with severe hyponatraemia', 'thiazide induced hyponatraemia', 'hyponatraemic encephalopathy', 'acute hyponatraemia'],
      reject: [
        { m: ['hypernatraemia'], msg: 'The sodium is 108 mmol/L, not high.' },
        { m: ['hyperglycaemia', 'hyperglycaemic', 'hyperglycemia', 'hyperglycemic', 'diabetes', 'ketoacidosis'], msg: 'Hyperglycaemic hyponatraemia is a dilutional fall in sodium from osmotically active glucose. The glucose here is 5.6 mmol/L, the urine is concentrated and the osmolality is genuinely low.' },
        { m: ['pseudohyponatraemia', 'pseudohyponatremia'], msg: 'Pseudohyponatraemia from hyperlipidaemia or paraproteinaemia never causes seizures, because the measured osmolality is normal. Here the osmolality is 228 mOsm/kg — a true hypotonic hyponatraemia.' },
        { m: ['adrenal', 'addison'], msg: 'Cortisol is normal at 420 nmol/L with a normal ACTH (and she is not on steroids or hyperpigmented) — adrenal insufficiency has been excluded.' },
        { m: ['hypothyroid', 'myxoedema'], msg: 'Thyroid function is normal.' },
        { m: ['status epilepticus'], msg: 'Status epilepticus describes the seizure, not the cause. The sodium of 108 mmol/L is the diagnosis.' },
        { m: ['meningitis', 'encephalitis', 'stroke', 'subarachnoid'], msg: 'The CT is normal, there is no fever or meningism, and the sodium is 108 mmol/L with concentrated urine.' },
        { m: ['hypoglyc'], msg: 'Glucose is 5.6 mmol/L — hypoglycaemia is excluded.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Serum sodium 108 mmol/L with a low serum osmolality, inappropriately concentrated urine and a urine sodium of 68 in a patient on a thiazide with high water intake: acute symptomatic hypotonic hyponatraemia, SIADH-like, presenting with a seizure.'
    },
    differentials: ['Acute severe symptomatic hyponatraemia (thiazide-induced, SIADH)', 'Adrenal insufficiency', 'Hypothyroidism', 'Hyperglycaemic hyponatraemia', 'Status epilepticus of other cause', 'Meningoencephalitis', 'Acute stroke', 'Pseudohyponatraemia', 'Diuretic-induced hypovolaemia', 'Primary polydipsia'],
    mgmt: {
      timeSec: 35,
      options: [
        { id: 'hss', label: '3% hypertonic saline 100-150 mL IV bolus over 10-20 minutes, repeated until seizures stop', correct: true, msg: 'The correct emergency treatment: rapid small boluses for neurological symptoms.' },
        { id: 'target', label: 'Aim for a 4-6 mmol/L rise in the first 2-4 hours, then no more than 8-10 mmol/L per 24 hours', correct: true, msg: 'Enough to stop the seizures, slow enough to avoid osmotic demyelination.' },
        { id: 'freq', label: 'Check sodium every 1-2 hours during active correction with strict fluid balance', correct: true, msg: 'You cannot keep to the rate limit without measuring.' },
        { id: 'stop', label: 'Stop hydrochlorothiazide and review all contributing drugs', correct: true, msg: 'Removes the cause.' },
        { id: 'anticonv', label: 'Treat ongoing seizure activity with IV benzodiazepines and airway support', correct: true, msg: 'Symptomatic seizure control while the sodium is corrected.' },
        { id: 'restrict2', label: 'Once out of the emergency, fluid restriction 800-1000 mL/day with daily weights and sodium', correct: true, msg: 'The definitive medium-term treatment for SIADH.' },
        { id: 'cause', label: 'Investigate the underlying cause (chest imaging, medications, cortisol, thyroid) and consider tolvaptan/urea if refractory', correct: true, msg: 'Treats the disease, not just the number.' },
        { id: 'overcorrect', label: 'Rapidly normalise the sodium to 140 mmol/L within a few hours', correct: false, harm: true, msg: 'Risks osmotic demyelination — a fate worse than the presenting seizure.' },
        { id: 'freewater', label: '5% dextrose infusion for maintenance', correct: false, harm: true, msg: 'Free water in a patient who cannot excrete it worsens the hyponatraemia.' },
        { id: 'salineonly', label: 'Large volumes of 0.9% saline as the primary treatment', correct: false, harm: true, msg: 'In SIADH the kidney excretes the sodium and retains the water — the sodium can fall further.' },
        { id: 'restrictseizure', label: 'Fluid restriction alone during the seizure, without hypertonic saline', correct: false, harm: true, msg: 'Fluid restriction works over days. A seizing brain needs sodium now.' },
        { id: 'mannitol2', label: 'Mannitol for the cerebral oedema', correct: false, harm: true, msg: 'Worsens hypovolaemia and the electrolyte disturbance without correcting the cause.' }
      ]
    },
    debrief: {
      key: ['Three days of confusion and unsteadiness with a generalised seizure in a patient on a thiazide with high water intake.', 'Sodium 108 mmol/L with low serum osmolality, urine osmolality 480 and urine sodium 68.', 'CT normal apart from cerebral oedema; cortisol and thyroid function normal.'],
      pearls: ['Hyponatraemic seizure is treated with a small bolus of 3% saline, regardless of the cause.', 'The rate of correction is the safety rail: 4-6 mmol/L in the first hours, no more than 8-10 per day.', 'Thiazides are the commonest drug cause of severe hyponatraemia, often within weeks of starting.'],
      pitfalls: ['Rapid full correction causes osmotic demyelination — the patient improves and then becomes locked-in a week later.', 'Treating with dextrose or large volumes of normal saline can make SIADH worse.']
    }
  });

  /* =======================================================================
     CASE 8 — Adrenal (Addisonian) crisis
     ======================================================================= */
  add({
    id: 'adrenal',
    title: 'Known Addison disease, vomiting for four days and now barely responsive',
    category: 'Endocrinology',
    difficulty: 'hard',
    blurb: 'She stopped her hydrocortisone because she could not keep the tablets down. Now shocked, hyponatraemic and hypoglycaemic.',
    timeLimitSec: 600,
    budget: 2000,
    who: 'Ms. P., 42-year-old teacher with known primary adrenal insufficiency (Addison disease) on hydrocortisone and fludrocortisone. Four days of a flu-like illness with vomiting and diarrhoea; she stopped her tablets because they would not stay down.',
    history: [
      'Four days of fever, sore throat, vomiting and watery diarrhoea; she has taken nothing by mouth reliably since yesterday.',
      'Hydrocortisone and fludrocortisone both omitted for two days because of vomiting; she did not know about injectable rescue steroid.',
      'Progressive weakness, dizziness on standing and increasing drowsiness; today she is barely rousable.',
      'Also on levothyroxine for autoimmune hypothyroidism. Known vitiligo. No recent trauma, no bleeding, no anticoagulants.',
      'No previous intensive care admission, no other medication, no alcohol.'
    ],
    exam: [
      'Drowsy, GCS 13, grey and clammy, barely able to answer questions.',
      'Pulse 128 thready, **BP 78/48 (supine) and unrecordable on standing**, respiratory rate 22, SpO2 98%, temperature 37.8 C.',
      'Capillary refill 5 seconds, cold peripheries; mucous membranes dry.',
      '**Diffuse hyperpigmentation of the skin creases, buccal mucosa and scars**, vitiligo over both hands.',
      'Chest clear, abdomen soft and mildly tender, no mass, no rash, no focal neurology.'
    ],
    base: { hr: 128, sbp: 78, dbp: 48, rr: 22, spo2: 98, temp: 37.8, gcs: 13 },
    drift: { hr: 0.75, sbp: -0.85, dbp: -0.5, rr: 0.3, spo2: -0.2, temp: 0.006, gcs: -0.06 },
    decay: 0.30,
    events: [
      { at: 120, need: ['action:hydrocortisone'], loss: 18, msg: 'No steroid has been given. This is a steroid-dependent patient in shock — the blood pressure is now 68/40 and she is barely responsive.' },
      { at: 260, need: ['action:fluids'], loss: 12, msg: 'No volume resuscitation: profound hypovolaemia in a patient with mineralocorticoid deficiency.' },
      { at: 380, need: ['action:dextrose'], loss: 10, msg: 'The glucose has fallen to 2.1 mmol/L — hypoglycaemia is deepening the coma.' },
      { at: 470, need: ['test:ue4'], loss: 8, msg: 'Potassium has never been checked. The ECG now shows peaked T waves with a broadened QRS.' }
    ],
    actions: [
      A('hydrocortisone', 'IV hydrocortisone 100 mg immediately, then 200 mg per 24 hours', 'Seconds matter in an Addisonian crisis.', { cost: 60, tat: 5, factor: 0.33, msg: 'Hydrocortisone given within a minute of the diagnosis being considered. Vascular tone and glucose will start to recover within the hour.' }),
      A('fluids', '0.9% saline 1 L over 30-60 minutes, then reassess', 'Both salt and water are depleted.', { cost: 20, tat: 8, factor: 0.55, msg: 'BP rose to 96/60 with warmer peripheries after the first litre.' }),
      A('dextrose', '10% dextrose 200 mL for hypoglycaemia, then a dextrose-containing infusion', 'Neuroglycopenia kills faster than hypotension.', { cost: 25, tat: 6, factor: 0.7, msg: 'Glucose corrected to 6.8 mmol/L and the conscious level is improving.' }),
      A('oxygen', 'Oxygen to keep SpO2 above 94%, protect the airway', 'Supportive care while the steroid works.', { cost: 15, tat: 5, factor: 0.9, msg: 'Oxygenation secured.' }),
      A('precipitant', 'Look for and treat the precipitant: examine for infection, take cultures, review drugs', 'Steroid crisis is usually triggered by infection.', { cost: 20, tat: 12, factor: 0.85, msg: 'Throat is inflamed with exudate — a likely streptococcal trigger. Cultures taken.' }),
      A('monitor', 'Continuous monitoring, hourly glucose, potassium, sodium and urine output', 'Anticipate hyperkalaemia and hypoglycaemia.', { cost: 20, tat: 10, factor: 0.85, msg: 'Monitoring established with an electrolyte plan.' }),
      A('vasopressor', 'Start noradrenaline before giving steroids', 'Vasopressors without steroid in a steroid-deficient patient.', { cost: 60, tat: 8, factor: 1.25, harm: true, msg: 'Vasopressor started without steroid replacement — the blood pressure response is poor because the vasculature is steroid-deficient.' }),
      A('insulin', 'Insulin-dextrose infusion to treat the hyperkalaemia', 'This is not renal failure; it is mineralocorticoid deficiency.', { cost: 30, tat: 8, factor: 1.4, harm: true, msg: 'Insulin drove the glucose down further in a patient already hypoglycaemic — a dangerous choice.' }),
      A('restrict', 'Fluid restriction to prevent overload', 'This patient is severely volume depleted.', { cost: 0, tat: 5, factor: 1.6, harm: true, msg: 'Fluid restriction in hypovolaemic shock caused further deterioration.' }),
      A('oral', 'Give oral hydrocortisone and observe, since the tablets were the problem', 'Oral absorption fails in vomiting.', { cost: 10, tat: 8, factor: 1.5, harm: true, msg: 'The oral steroid was vomited back within minutes. Absorption in shock is unpredictable even when it stays down.' })
    ],
    tests: [
      T('glucose4', 'Capillary glucose', 'Bedside', 10, 6, '**2.4 mmol/L (43 mg/dL)** — hypoglycaemia. Adrenal insufficiency impairs gluconeogenesis.', { flag: 'critical', factor: 0.8 }),
      T('ue4', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, '**Na 124 mmol/L, K 6.1 mmol/L**, urea 52 mg/dL, creatinine 1.6, bicarbonate 16, chloride 96. Classic mineralocorticoid deficiency pattern.', { flag: 'critical', factor: 0.8 }),
      T('cortisol2', 'Serum cortisol and ACTH', 'Bloods', 140, 70, '**Cortisol 90 nmol/L with ACTH markedly elevated at 320 pg/mL** — undetectable adrenal reserve despite severe physiological stress.', { flag: 'critical', factor: 0.85 }),
      T('ecg2', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 130 with **peaked T waves, a small P wave and a widened QRS** — hyperkalaemia.', { flag: 'critical', factor: 0.85 }),
      T('abg4', 'Blood gas', 'Bloods', 95, 30, 'pH 7.28, HCO3 16, **lactate 3.6 mmol/L**, Na 124, K 6.1 — metabolic acidosis with hypoperfusion.', { flag: 'abnormal' }),
      T('fbc4', 'Full blood count', 'Bloods', 45, 30, 'Hb 12.4, WBC 15.2 with neutrophilia, platelets 260 — consistent with an infective precipitant or stress response.', { flag: 'abnormal' }),
      T('cultures2', 'Blood cultures and throat swab', 'Microbiology', 150, 110, 'Blood cultures no growth at 24 hours; throat swab grows **Streptococcus pyogenes** — the precipitant.', { flag: 'abnormal' }),
      T('cxr4', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields, normal heart size. No pneumonia, no effusion.', { flag: 'normal' }),
      T('tsh2', 'Thyroid function tests', 'Bloods', 110, 80, 'TSH elevated at 9.8 with a low free T4 — she has known autoimmune hypothyroidism and may be under-replaced. This is not the emergency, but it matters later.', { flag: 'abnormal' }),
      T('synacthen', 'Short synacthen (ACTH stimulation) test', 'Special', 260, 120, 'Not interpretable now and dangerous to organise before treatment: **steroid must be given first, and the test performed later** when the patient is stable.', { flag: 'abnormal' }),
      T('aldosterone', 'Renin and aldosterone', 'Bloods', 280, 120, 'Suppressed aldosterone with high renin — mineralocorticoid deficiency. Useful for confirmation after recovery, not needed now.', { flag: 'abnormal' }),
      T('ctabd2', 'CT adrenals with contrast', 'Imaging', 640, 100, 'Atrophic adrenal glands with no calcification or mass. Genuinely interesting, and genuinely irrelevant in the next ten minutes.', { flag: 'abnormal' })
    ],
    hints: [
      'Vomiting plus a steroid-dependent patient plus shock is an Addisonian crisis until proven otherwise — the treatment is a syringe of hydrocortisone, not a scan.',
      'Give steroid and saline immediately, correct the hypoglycaemia, and never organise a synacthen test before the first dose.'
    ],
    dx: {
      label: 'Acute adrenal (Addisonian) crisis precipitated by infection',
      accept: ['adrenal crisis', 'addisonian crisis', 'acute adrenal insufficiency', 'acute adrenal failure', 'adrenal crisis in addison disease', 'acute adrenocortical insufficiency', 'adrenocortical crisis', 'addison disease with crisis'],
      reject: [
        { m: ['diabetic', 'ketoacidosis', 'dka'], msg: 'Glucose is 2.4 mmol/L — hypoglycaemia, not hyperglycaemia. Kussmaul breathing is absent.' },
        { m: ['sepsis'], msg: 'Infection is the precipitant, not the diagnosis: shock with Na 124, K 6.1, glucose 2.4 and hyperpigmentation in a patient who stopped her steroids is an adrenal crisis.' },
        { m: ['gastroenteritis'], msg: 'The diarrhoea is part of the crisis, and it explains why steroids stopped — but the shock with K 6.1 requires steroid replacement, not rehydration alone.' },
        { m: ['hypothyroid', 'myxoedema'], msg: 'Myxoedema coma is hypothermic and bradycardic with a normal or low potassium. This patient is febrile, tachycardic and hyperkalaemic.' },
        { m: ['renal failure', 'aki'], msg: 'The creatinine of 1.6 is pre-renal from salt and water depletion; the potassium of 6.1 is from aldosterone deficiency.' },
        { m: ['hypoglycaemia'], msg: 'Hypoglycaemia is a consequence of the adrenal insufficiency, not the primary diagnosis.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Known Addison disease with steroids omitted during a vomiting illness, presenting with shock, hyponatraemia, hyperkalaemia, hypoglycaemia, hyperpigmentation and a low cortisol with a hugely elevated ACTH.'
    },
    differentials: ['Adrenal (Addisonian) crisis', 'Septic shock', 'Diabetic ketoacidosis with hypoglycaemia', 'Hypothyroidism / myxoedema coma', 'Acute kidney injury with hyperkalaemia', 'Gastroenteritis with hypovolaemic shock', 'Cardiogenic shock', 'Anaphylaxis', 'Lactic acidosis', 'Pituitary apoplexy'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'hc', label: 'IV hydrocortisone 100 mg immediately, then 200 mg/24 h (bolus or infusion)', correct: true, msg: 'Replaces the missing cortisol — restores vascular tone, glucose and sodium handling.' },
        { id: 'saline2', label: '0.9% saline 1 L over 30-60 minutes, then reassess and repeat as needed', correct: true, msg: 'Corrects the salt and water depletion of mineralocorticoid deficiency.' },
        { id: 'dex2', label: 'Correct hypoglycaemia with 10% dextrose and continue dextrose-containing fluid', correct: true, msg: 'Protects the brain while gluconeogenesis recovers.' },
        { id: 'infection', label: 'Identify and treat the precipitating infection (throat infection here) with appropriate antibiotics', correct: true, msg: 'The precipitant must be treated alongside the crisis.' },
        { id: 'obs', label: 'Hourly glucose, potassium and sodium, continuous cardiac monitoring for hyperkalaemia', correct: true, msg: 'Catches the two things that kill: arrhythmia and hypoglycaemia.' },
        { id: 'hdu2', label: 'High-dependency care with vasopressor support reserved for steroid-refractory shock', correct: true, msg: 'Vasopressors are usually unnecessary once steroid and volume are given.' },
        { id: 'later', label: 'Give intramuscular hydrocortisone (100 mg) if IV access is delayed, and organise the synacthen test after treatment', correct: true, msg: 'Never delay steroid for a diagnostic test; the test can wait until recovery.' },
        { id: 'educate', label: 'Educate on sick-day rules, provide an emergency injectable hydrocortisone kit and a steroid alert card', correct: true, msg: 'Prevents the next crisis.' },
        { id: 'fludro', label: 'Give fludrocortisone 100 micrograms immediately as the mainstay of treatment', correct: false, harm: true, msg: 'Mineralocorticoid is not needed acutely: 200 mg/day of hydrocortisone provides more than enough mineralocorticoid activity, and fludrocortisone takes days to work.' },
        { id: 'insulin2', label: 'Insulin-dextrose infusion for the potassium of 6.1', correct: false, harm: true, msg: 'Drives glucose down in a hypoglycaemic patient; the potassium will correct with steroid and volume.' },
        { id: 'restrict2', label: 'Fluid restriction because of the hyponatraemia', correct: false, harm: true, msg: 'Restricting fluid in hypovolaemic shock worsens perfusion; the hyponatraemia corrects with steroid and saline.' },
        { id: 'oral2', label: 'Oral hydrocortisone 20 mg and reassess in an hour', correct: false, harm: true, msg: 'A crisis dose is 100 mg parenterally — oral absorption fails in vomiting and shock.' },
        { id: 'testfirst', label: 'Perform the synacthen test before giving any steroid', correct: false, harm: true, msg: 'Delaying steroid to confirm the diagnosis can be fatal. Treat first, test later.' }
      ]
    },
    debrief: {
      key: ['Known Addison disease, steroids stopped for two days because of vomiting.', 'Shock with Na 124, K 6.1, glucose 2.4, cortisol 90 with ACTH 320.', 'Hyperpigmentation and vitiligo on examination; streptococcal throat infection as the precipitant.'],
      pearls: ['Any steroid-dependent patient who is vomiting needs parenteral steroid. Sick-day rules and a rescue kit prevent this presentation.', 'Hyponatraemia with hyperkalaemia and hypoglycaemia in a shocked patient should raise adrenal insufficiency immediately.', 'Treat first and test later: 100 mg of hydrocortisone then the synacthen test once stable.'],
      pitfalls: ['Fluid restriction for the hyponatraemia and insulin for the hyperkalaemia both make this crisis worse.', 'Fludrocortisone has no role in the acute phase — high-dose hydrocortisone covers mineralocorticoid needs.']
    }
  });

})();
