/* =========================================================================
   DocSim — case library (part 4): acute general medicine
   Loaded after cases-emergency.js. Same schema; just push onto window.CASES.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 13 — Bleeding oesophageal varices
     ======================================================================= */
  window.CASES.push({
    id: 'varices',
    title: 'Vomiting large volumes of blood in known alcoholic cirrhosis',
    category: 'Hepatology / Gastroenterology',
    difficulty: 'moderate',
    blurb: 'Half a litre of fresh blood in the ambulance, jaundiced and hypotensive, with ascites and spider naevi.',
    timeLimitSec: 600,
    budget: 2200,
    who: 'Mr. D., 52-year-old man with alcohol-related cirrhosis diagnosed three years ago. Brought in after two episodes of large-volume haematemesis and melaena. He has been drinking heavily for the past month and has not attended clinic.',
    history: [
      'Two episodes of vomiting fresh red blood, roughly 500 mL in total, followed by black tarry stools.',
      'Light-headed and sweaty on standing; no chest pain, no previous bleeding episode.',
      'Known cirrhosis with ascites and previous uncomplicated varices on surveillance endoscopy two years ago.',
      'Heavy alcohol use, no NSAIDs, no anticoagulants, no previous surgery.',
      'Increasing drowsiness and confusion over the last day according to his brother.'
    ],
    exam: [
      'Pale, clammy and restless. **Confused and disorientated (GCS 14, grade 1 encephalopathy)**, with a flapping tremor.',
      'Pulse 118 thready, **BP 88/56**, respiratory rate 22, SpO2 96%, temperature 37.0 C.',
      '**Jaundiced with spider naevi, palmar erythema, gynaecomastia and clubbed fingers.**',
      '**Distended abdomen with shifting dullness (ascites)**, liver edge not palpable, spleen tip palpable. Melaena on rectal examination.',
      'Cool peripheries, capillary refill 4 seconds, no urine output since admission.'
    ],
    base: { hr: 118, sbp: 88, dbp: 56, rr: 22, spo2: 96, temp: 37.0, gcs: 14 },
    drift: { hr: 0.6, sbp: -0.8, dbp: -0.4, rr: 0.25, spo2: -0.25, temp: 0.01, gcs: -0.06 },
    decay: 0.3,
    events: [
      { at: 140, need: ['action:terlipressin'], loss: 12, msg: 'No splanchnic vasoconstrictor has been given. The varices are still bleeding and the haemoglobin is falling.' },
      { at: 260, need: ['action:blood'], loss: 16, msg: 'No blood products have been transfused. BP is 70/40 and the patient is now barely rousable.' },
      { at: 380, need: ['action:abx'], loss: 10, msg: 'No antibiotic prophylaxis. In variceal haemorrhage, infection drives early rebleeding and mortality — and it costs almost nothing to prevent.' }
    ],
    actions: [
      A('airway', 'Left lateral position, suction, oxygen, avoid over-sedation', 'A confused patient vomiting blood will aspirate.', { cost: 15, tat: 5, factor: 0.72, msg: 'Airway protected and clear; oxygenation maintained.' }),
      A('access', 'Two large-bore IV lines, crossmatch, coagulation and full bloods', 'You need lumens and a group and save immediately.', { cost: 25, tat: 8, factor: 0.7, msg: 'Two 14G lines sited and blood samples sent, including a crossmatch.' }),
      A('blood', 'Transfuse blood to a restrictive target haemoglobin of 70-80 g/L', 'Enough to perfuse, not enough to raise the portal pressure.', { cost: 320, tat: 12, factor: 0.5, msg: 'Two units running. The blood pressure is responding and the patient is less restless.' }),
      A('terlipressin', 'Terlipressin 2 mg IV four-hourly (or octreotide infusion)', 'Splanchnic vasoconstriction reduces variceal inflow.', { cost: 90, tat: 8, factor: 0.6, msg: 'Terlipressin given — portal inflow is falling and the bleeding is slowing.' }),
      A('abx', 'Prophylactic ceftriaxone 1 g IV', 'Standard of care in every cirrhotic GI bleed.', { cost: 60, tat: 6, factor: 0.7, msg: 'Antibiotic given. This single cheap step reduces rebleeding and death.' }),
      A('monitor', 'Continuous monitoring, urinary catheter, hourly output, keep the patient warm', 'Perfusion targets and a safe transfer to endoscopy.', { cost: 20, tat: 10, factor: 0.88, msg: 'Monitoring and output charting established.' }),
      A('ppi', 'IV proton pump inhibitor', 'Treats any concurrent peptic lesion and stabilises clot.', { cost: 25, tat: 6, factor: 0.92, msg: 'PPI infusion started.' }),
      A('lactulose', 'Lactulose and thiamine; treat the encephalopathy', 'The confusion is hepatic, and opioids or sedatives will worsen it.', { cost: 15, tat: 8, factor: 0.94, msg: 'Lactulose started, thiamine given.' }),
      A('overtransfuse', 'Transfuse to a haemoglobin of 12 g/dL', 'Over-transfusion raises portal pressure and causes rebleeding.', { cost: 420, tat: 12, factor: 1.5, harm: true, msg: 'The haemoglobin rose — and with it the portal pressure. Fresh bleeding appeared from the drain of the Sengstaken tube.' }),
      A('megafluid', 'Rapid 3 litres of crystalloid to normalise the blood pressure', 'Dilutes clotting factors and worsens ascites.', { cost: 40, tat: 10, factor: 1.45, harm: true, msg: 'Three litres of crystalloid caused gross ascites, dilutional coagulopathy and no lasting improvement in blood pressure.' }),
      A('balloon', 'Immediate balloon tamponade before any vasoactive drug', 'A temporising bridge, not a first-line treatment.', { cost: 90, tat: 15, factor: 1.35, harm: true, msg: 'The balloon was inflated before vasoactive therapy: the patient aspirated and developed aspiration pneumonia.' }),
      A('sedate', 'IV diazepam for the agitation and confusion', 'Sedating a patient with hepatic encephalopathy.', { cost: 15, tat: 6, factor: 1.5, harm: true, msg: 'After diazepam the patient became unrousable with no airway protection — encephalopathy plus sedation.' }),
      A('delay', 'Wait until the morning to arrange endoscopy', 'Bleeding varices do not keep office hours.', { cost: 0, tat: 6, factor: 1.7, harm: true, msg: 'The patient rebled at 3 am with a haemoglobin of 5.4 g/dL and required an emergency transfusion.' })
    ],
    tests: [
      T('fbc', 'Full blood count', 'Bloods', 45, 30, '**Hb 7.2 g/dL**, WBC 8.9, **platelets 78 x10^9/L** — hypersplenism and acute blood loss.', { flag: 'critical', factor: 0.85 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.33, pO2 88 mmHg on oxygen, **lactate 4.1 mmol/L**, base excess -6, Hb 7.0 g/dL — **shock with a metabolic acidosis**.', { flag: 'critical', factor: 0.85 }),
      T('endoscopy', 'Emergency upper GI endoscopy', 'Special', 600, 90, '**Large oesophageal varices with active spurting from a varix at 30 cm. Band ligation applied with good haemostasis.** No peptic ulcer, no Mallory-Weiss tear.', { flag: 'critical', factor: 0.7 }),
      T('coag', 'Coagulation screen and fibrinogen', 'Bloods', 90, 45, 'INR 1.9, APTT 42 s, fibrinogen 1.3 g/L, D-dimer raised — the synthetic failure of cirrhosis, not disseminated intravascular coagulation.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 92 mg/dL, creatinine 1.6, Na 128, K 4.4, bicarbonate 20 — pre-renal impairment from blood loss and diuretics.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 45, 'Bilirubin 4.2 mg/dL, albumin 26 g/L, AST 180, ALT 96, ALP 150 — decompensated cirrhosis (Child-Pugh C).', { flag: 'abnormal' }),
      T('crossmatch', 'Blood group and crossmatch', 'Bloods', 120, 35, 'O positive with no atypical antibodies. **Two units available now and four more on request.**', { flag: 'abnormal', factor: 0.9 }),
      T('uss', 'Abdominal ultrasound with Doppler', 'Imaging', 260, 50, '**Nodular liver with coarse echotexture, splenomegaly, gross ascites and reversed (hepatofugal) portal flow.** Portal hypertension confirmed.', { flag: 'abnormal', factor: 0.9 }),
      T('hep', 'Hepatitis and aetiology screen', 'Bloods', 200, 90, 'HBsAg negative, anti-HCV positive with RNA pending. Alcohol remains the dominant aetiology. Matters for long-term care, not for this bleed.', { flag: 'abnormal' }),
      T('ammonia', 'Serum ammonia', 'Bloods', 110, 60, '88 umol/L (raised) — consistent with the clinical grade 1 encephalopathy you already identified.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields, no aspiration, normal heart size.', { flag: 'normal' }),
      T('ct', 'CT abdomen with contrast', 'Imaging', 620, 100, 'Confirms cirrhosis, ascites and varices. Nothing here changes the next hour, and it takes a shocked patient away from the resuscitation room.', { flag: 'abnormal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. Bacterial infection precipitates variceal bleeding even when cultures are negative — which is why prophylaxis is given regardless.', { flag: 'normal' })
    ],
    hints: [
      'A cirrhotic patient bleeding from varices needs three things immediately: blood, a splanchnic vasoconstrictor and an antibiotic.',
      'Transfuse to a target haemoglobin of 70-80 g/L. Over-transfusion raises portal pressure and causes rebleeding.'
    ],
    dx: {
      label: 'Acute variceal haemorrhage from oesophageal varices in decompensated cirrhosis',
      accept: ['bleeding oesophageal varices', 'variceal bleeding', 'variceal haemorrhage', 'ruptured oesophageal varices', 'acute variceal bleed', 'oesophageal varices', 'varices bleeding', 'variceal upper gi bleed', 'cirrhosis with variceal bleeding', 'bleeding esophageal varices'],
      reject: [
        { m: ['peptic ulcer', 'gastric ulcer', 'duodenal ulcer'], msg: 'He has known varices, stigmata of chronic liver disease and no NSAID use — and the endoscopy shows a spurting varix, not an ulcer.' },
        { m: ['mallory'], msg: 'A Mallory-Weiss tear follows retching and is usually self-limiting; this patient has portal hypertension and a spurting varix.' },
        { m: ['gastric cancer', 'carcinoma', 'malignancy'], msg: 'The endoscopy shows varices with no malignant lesion.' },
        { m: ['haemoptysis', 'hemoptysis'], msg: 'The blood is vomited, coffee-ground and associated with melaena — this is a gastrointestinal bleed.' },
        { m: ['epistaxis'], msg: 'There is no nasal bleeding; the volume and the melaena point to an upper GI source.' },
        { m: ['dengue'], msg: 'Dengue causes thrombocytopenia with a febrile illness and haemoconcentration; this patient has cirrhosis with portal hypertension.' },
        { m: ['disseminated intravascular', 'dic'], msg: 'The coagulopathy is hepatic — a low fibrinogen with a raised INR from synthetic failure — not disseminated intravascular coagulation.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Known cirrhotic with ascites, jaundice and encephalopathy presenting with large-volume haematemesis and shock. Endoscopy shows actively bleeding oesophageal varices.'
    },
    differentials: ['Bleeding oesophageal varices', 'Peptic ulcer bleeding', 'Mallory-Weiss tear', 'Gastric carcinoma', 'Gastritis with erosion', 'Epistaxis with swallowed blood', 'Haemoptysis from bronchial carcinoma', 'Dengue with gastrointestinal bleeding', 'Disseminated intravascular coagulation', 'Angiodysplasia'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'blood2', label: 'Restrictive transfusion to a haemoglobin target of 70-80 g/L, with a major haemorrhage protocol ready', correct: true, msg: 'Over-transfusion raises portal pressure and provokes rebleeding.' },
        { id: 'terli', label: 'Terlipressin (or octreotide) started immediately and continued for five days', correct: true, msg: 'Reduces variceal inflow and is the first-line vasoactive drug.' },
        { id: 'abx2', label: 'Prophylactic antibiotics — ceftriaxone 1 g daily for up to seven days', correct: true, msg: 'One of the cheapest interventions with the largest mortality benefit in variceal bleeding.' },
        { id: 'scope', label: 'Urgent endoscopy with band ligation within 12 hours, immediately if unstable', correct: true, msg: 'The definitive haemostatic treatment.' },
        { id: 'balloon2', label: 'Balloon tamponade only as a temporary bridge when endoscopic control fails or is unavailable', correct: true, msg: 'Effective for minutes to hours, and dangerous beyond that.' },
        { id: 'enceph', label: 'Treat the encephalopathy with lactulose and thiamine, and avoid sedatives', correct: true, msg: 'The confusion is hepatic; sedatives precipitate coma.' },
        { id: 'airway2', label: 'Airway protection with a left lateral position, oxygen and a low threshold for critical care review', correct: true, msg: 'Aspiration is a common cause of death in a patient vomiting large volumes.' },
        { id: 'secondary', label: 'Plan secondary prophylaxis: carvedilol or propranolol plus serial banding, and alcohol treatment', correct: true, msg: 'Prevents the next bleed, which is the one that kills.' },
        { id: 'over2', label: 'Transfuse to a haemoglobin of 12 g/dL', correct: false, harm: true, msg: 'Over-transfusion increases portal pressure and rebleeding, and raises mortality.' },
        { id: 'crystalloid2', label: 'Rapid large-volume crystalloid resuscitation instead of blood', correct: false, harm: true, msg: 'Dilutes clotting factors, worsens ascites and does not replace oxygen-carrying capacity.' },
        { id: 'ffp', label: 'Routine fresh frozen plasma and platelets to correct the numbers', correct: false, harm: true, msg: 'Correcting laboratory numbers without bleeding does not help and can worsen volume overload.' },
        { id: 'tips', label: 'Immediate TIPS as the first-line treatment', correct: false, harm: true, msg: 'Reserved for failure of endoscopic and pharmacological therapy — not a first move in an unstable patient.' },
        { id: 'sedate2', label: 'IV benzodiazepines for the agitation', correct: false, harm: true, msg: 'Sedation in hepatic encephalopathy causes airway loss and aspiration.' }
      ]
    },
    debrief: {
      key: ['Known cirrhosis with ascites, jaundice, spider naevi and grade 1 encephalopathy.', 'Large-volume haematemesis with melaena, BP 88/56 and a lactate of 4.1.', 'Hb 7.2 g/dL with platelets of 78 and an INR of 1.9; endoscopy shows a spurting varix at 30 cm.'],
      pearls: ['Blood, terlipressin and an antibiotic — all three, immediately, in every cirrhotic GI bleed.', 'A restrictive transfusion target (70-80 g/L) reduces rebleeding compared with liberal transfusion.', 'Band ligation is definitive; balloon tamponade is a bridge measured in hours.'],
      pitfalls: ['Routine FFP and platelets to "correct" abnormal clotting in liver disease can worsen the bleed.', 'Sedating a patient with hepatic encephalopathy is a common and fatal error.']
    }
  });

  /* =======================================================================
     CASE 14 — Severe community-acquired pneumonia with sepsis
     ======================================================================= */
  window.CASES.push({
    id: 'cap',
    title: 'Four days of cough and fever, now confused and hypotensive',
    category: 'Respiratory / Infectious disease',
    difficulty: 'moderate',
    blurb: 'A diabetic smoker with rigors, pleuritic pain and new confusion — saturations 89% on air.',
    timeLimitSec: 600,
    budget: 1600,
    who: 'Mrs. W., 66-year-old retired shopkeeper with type 2 diabetes and a 30 pack-year smoking history. Four days of productive cough with rust-coloured sputum, fever and right-sided pleuritic chest pain. Brought in after her daughter found her confused and drowsy this morning.',
    history: [
      'Four days of fever with rigors, productive cough and right-sided pleuritic chest pain on deep breathing.',
      'Increasing breathlessness and now confusion and drowsiness over 12 hours.',
      'Type 2 diabetes on metformin; no antibiotics in the last three months, no recent hospital admission.',
      'No travel, no aspiration or swallowing difficulty, no weight loss, no night sweats before this illness.',
      'No chest trauma, no immobilisation, no previous thromboembolism.'
    ],
    exam: [
      'Drowsy but rousable, GCS 14, disorientated to time and place.',
      '**Temperature 38.9 C**, pulse 116, **BP 96/58**, respiratory rate 28, SpO2 89% on room air.',
      '**Dull percussion note and bronchial breathing with crackles in the right lower zone.** No pleural rub.',
      'Capillary refill 4 seconds, warm peripheries, no rash, no neck stiffness, no focal neurology.',
      'No leg swelling or calf tenderness. Heart sounds normal.'
    ],
    base: { hr: 116, sbp: 96, dbp: 58, rr: 28, spo2: 89, temp: 38.9, gcs: 14 },
    drift: { hr: 0.5, sbp: -0.7, dbp: -0.38, rr: 0.3, spo2: -0.4, temp: 0.015, gcs: -0.045 },
    decay: 0.26,
    events: [
      { at: 120, need: ['action:abx'], loss: 14, msg: 'Antibiotics have not been given. In severe pneumonia, every hour of delay increases mortality — and the blood pressure is falling.' },
      { at: 280, need: ['action:fluids'], loss: 10, msg: 'No fluid resuscitation for sepsis. Lactate is rising and the urine output has stopped.' },
      { at: 420, need: ['action:oxygen'], loss: 8, msg: 'Hypoxaemia is uncorrected and the patient is now drowsier with a respiratory rate of 32.' }
    ],
    actions: [
      A('oxygen', 'Oxygen titrated to SpO2 94-98%, with a plan for non-invasive ventilation if needed', 'Correct the hypoxaemia quickly.', { cost: 15, tat: 5, factor: 0.78, msg: 'SpO2 96% on 4 L via a venturi mask and the patient is easier to rouse.' }),
      A('abx', 'IV antibiotics within one hour: ceftriaxone plus clarithromycin (per local policy)', 'The single intervention that changes mortality.', { cost: 120, tat: 8, factor: 0.45, msg: 'Antibiotics running within 40 minutes of arrival — exactly what this patient needed.' }),
      A('fluids', '0.9% saline 500 mL bolus for sepsis, reassess and repeat to a target', 'Lactate-guided resuscitation, not a fixed volume.', { cost: 18, tat: 8, factor: 0.65, msg: 'BP improved to 108/66 with faster capillary refill.' }),
      A('monitor', 'Continuous monitoring, urinary catheter, hourly output, lactate and NEWS2 tracking', 'Sepsis is managed by numbers and repeated review.', { cost: 20, tat: 10, factor: 0.85, msg: 'Monitoring established with hourly output.' }),
      A('antipyretic', 'Paracetamol and tepid cooling for the fever', 'Reduces oxygen demand and discomfort.', { cost: 5, tat: 5, factor: 0.95, msg: 'Temperature falling; the patient is more comfortable.' }),
      A('vte', 'Venous thromboembolism prophylaxis', 'Pneumonia plus immobility is a thrombotic state.', { cost: 15, tat: 6, factor: 0.97, msg: 'Prophylaxis prescribed.' }),
      A('hdu', 'Refer to high-dependency care: CURB-65 of 4 with hypoxia and confusion', 'This patient can deteriorate within the hour.', { cost: 0, tat: 8, factor: 0.85, msg: 'Critical care review arranged and a bed requested.' }),
      A('delayabx', 'Withhold antibiotics until the chest X-ray and CT confirm pneumonia', 'Every hour of delay costs lives in severe pneumonia.', { cost: 0, tat: 6, factor: 1.9, harm: true, msg: 'Antibiotics were delayed for imaging: the BP fell to 78/44, the lactate rose to 4.2 and the patient became more confused.' }),
      A('restrict', 'Fluid restriction to prevent pulmonary oedema', 'This patient is septic and underfilled.', { cost: 0, tat: 5, factor: 1.4, harm: true, msg: 'Fluid restriction in septic shock caused worsening hypotension and renal impairment.' }),
      A('furo', 'Furosemide 40 mg IV for the crepitations', 'The crackles are consolidation, not pulmonary oedema.', { cost: 10, tat: 6, factor: 1.3, harm: true, msg: 'The crackles were consolidation. Diuresis worsened the hypotension and the patient became oliguric.' }),
      A('steroid', 'High-dose corticosteroids for the pneumonia', 'No routine role outside specific indications.', { cost: 20, tat: 6, factor: 1.15, harm: true, msg: 'High-dose steroid given without indication — hyperglycaemia worsened and there is no evidence of benefit here.' }),
      A('flood', 'Rapid 3 litres of crystalloid for the sepsis', 'Over-resuscitation causes pulmonary oedema in pneumonia.', { cost: 40, tat: 10, factor: 1.25, harm: true, msg: 'After three litres the saturations fell to 86% with new bilateral crackles — fluid overload on top of consolidation.' })
    ],
    tests: [
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, '**Dense consolidation of the right lower lobe with air bronchograms and a small effusion.** No pneumothorax, normal heart size.', { flag: 'critical', factor: 0.8 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.47, **pO2 56 mmHg on room air**, pCO2 32 mmHg, HCO3 22, **lactate 2.4 mmol/L** — type 1 respiratory failure with early sepsis.', { flag: 'critical', factor: 0.85 }),
      T('bc2', 'Blood cultures', 'Microbiology', 120, 120, '**Streptococcus pneumoniae** grown from both bottles at 14 hours — the causative organism, and fully sensitive to the antibiotics given.', { flag: 'critical' }),
      T('fbc2', 'Full blood count', 'Bloods', 45, 30, '**WBC 19.4 x10^9/L with neutrophilia and toxic granulation**, Hb 12.6, platelets 260.', { flag: 'abnormal' }),
      T('crp2', 'CRP', 'Bloods', 50, 35, '**240 mg/L** — markedly raised, consistent with severe bacterial infection.', { flag: 'abnormal' }),
      T('pct', 'Procalcitonin', 'Bloods', 140, 45, '**3.2 ng/mL** — supports bacterial infection and helps with antibiotic stewardship later, not with the decision to treat now.', { flag: 'abnormal' }),
      T('ue3', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 62 mg/dL, creatinine 1.4 mg/dL (pre-renal), Na 131, K 4.0. Contributes 2 points to the CURB-65 score.', { flag: 'abnormal' }),
      T('lft3', 'Liver function tests', 'Bloods', 90, 45, 'ALT 60, bilirubin 1.2 mg/dL, albumin 30 g/L. Mild transaminitis in severe infection.', { flag: 'abnormal' }),
      T('glucose3', 'Capillary and laboratory glucose', 'Bedside', 15, 8, '**14.2 mmol/L** — stress hyperglycaemia on a background of type 2 diabetes. Needs insulin and monitoring, and it is not ketoacidosis.', { flag: 'abnormal' }),
      T('sputum', 'Sputum Gram stain and culture', 'Microbiology', 90, 90, 'Gram-positive diplococci with numerous neutrophils; culture grows **Streptococcus pneumoniae**.', { flag: 'abnormal' }),
      T('uag', 'Urinary pneumococcal and legionella antigens', 'Microbiology', 120, 60, '**Pneumococcal urinary antigen positive**, legionella antigen negative.', { flag: 'abnormal', factor: 0.95 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 118. No ischaemic change, no arrhythmia.', { flag: 'normal' }),
      T('trop', 'High-sensitivity troponin', 'Bloods', 60, 30, 'hs-troponin 32 ng/L — mildly raised. **Demand ischaemia from sepsis and hypoxia, not plaque rupture.**', { flag: 'abnormal' }),
      T('ct', 'CT chest with contrast', 'Imaging', 620, 90, 'Consolidation and a small effusion, no abscess, no embolism. Useful later for a non-resolving pneumonia; unnecessary now.', { flag: 'abnormal' }),
      T('hiv', 'HIV test with consent', 'Bloods', 60, 60, 'Negative. A reasonable test in severe pneumonia, but not one that changes today.', { flag: 'normal' })
    ],
    hints: [
      'CURB-65 of 4 with hypoxia, confusion and hypotension: the antibiotic goes in within the hour, before the chest X-ray.',
      'The crackles are consolidation, not pulmonary oedema — diuretics will hurt, and so will fluid restriction.'
    ],
    dx: {
      label: 'Severe community-acquired pneumonia (pneumococcal) with sepsis',
      accept: ['community acquired pneumonia', 'severe community acquired pneumonia', 'pneumococcal pneumonia', 'lobar pneumonia', 'community acquired pneumonia with sepsis', 'severe cap', 'cap', 'pneumonia with sepsis'],
      reject: [
        { m: ['pulmonary embolism', 'embolus'], msg: 'No thromboembolic risk factors, four days of productive cough with fever, and the consolidation is visible on the chest X-ray.' },
        { m: ['tuberculosis', 'tb'], msg: 'TB is a subacute illness over weeks with upper lobe changes and weight loss; this is four days with lobar consolidation and pneumococcal antigen in the urine.' },
        { m: ['carcinoma', 'malignancy', 'tumour', 'tumor'], msg: 'The presentation is acute and infective. Malignancy is a consideration only if the pneumonia fails to resolve.' },
        { m: ['copd'], msg: 'She has no chronic productive cough or previous spirometry; this is an acute infective consolidation.' },
        { m: ['covid', 'influenza', 'viral pneumonia'], msg: 'Pneumococcal antigen is positive and blood cultures grow Streptococcus pneumoniae. She needs antibiotics regardless of any viral co-infection.' },
        { m: ['heart failure', 'pulmonary oedema'], msg: 'The heart size is normal, there is dense lobar consolidation with air bronchograms, and there is no orthopnoea or raised JVP.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Fever, rust-coloured sputum and pleuritic pain with right lower lobe consolidation, a pneumococcal urinary antigen and pneumococci in the blood: severe CAP with a CURB-65 of 4.'
    },
    differentials: ['Severe community-acquired pneumonia', 'Pulmonary embolism', 'Pulmonary tuberculosis', 'Bronchogenic carcinoma', 'Acute heart failure', 'COPD exacerbation', 'Influenza with viral pneumonia', 'Pneumothorax', 'Pleural effusion', 'Aspiration pneumonitis'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'abx3', label: 'Empirical antibiotics within one hour: a beta-lactam plus a macrolide (or a fluoroquinolone)', correct: true, msg: 'The single most important intervention in severe pneumonia.' },
        { id: 'cultures', label: 'Blood and sputum cultures plus pneumococcal and legionella antigens before or alongside antibiotics', correct: true, msg: 'Cultures before antibiotics (when it does not delay them) guide later de-escalation.' },
        { id: 'o2b', label: 'Oxygen to a target of 94-98%, escalating to non-invasive ventilation if needed', correct: true, msg: 'Corrects hypoxaemia and buys time for the antibiotics.' },
        { id: 'sepsis', label: 'Sepsis bundle: lactate, fluids, hourly urine output, repeated review and early critical care referral', correct: true, msg: 'This patient has a CURB-65 of 4 and needs level 2 care.' },
        { id: 'sugar', label: 'Treat the hyperglycaemia with insulin and monitoring; avoid metformin during acute illness', correct: true, msg: 'Acute illness plus metformin risks lactic acidosis; stress hyperglycaemia worsens outcomes.' },
        { id: 'analgesia', label: 'Analgesia and antipyretics for the pleuritic pain and fever', correct: true, msg: 'Enables deep breathing and coughing, which helps clearance.' },
        { id: 'vte2', label: 'VTE prophylaxis and early mobilisation', correct: true, msg: 'Infection and immobility are a thrombotic combination.' },
        { id: 'delay3', label: 'Delay antibiotics until imaging is reported', correct: false, harm: true, msg: 'Every hour of delay in severe pneumonia increases mortality; the clinical diagnosis is enough to treat.' },
        { id: 'restrict2', label: 'Fluid restriction to protect the lungs', correct: false, harm: true, msg: 'This patient is septic and underfilled; restriction worsens perfusion and renal function.' },
        { id: 'furo2', label: 'Furosemide for the basal crackles', correct: false, harm: true, msg: 'The crackles are consolidation. Diuresis deepens the shock.' },
        { id: 'steroid2', label: 'High-dose corticosteroids for the pneumonia', correct: false, harm: true, msg: 'Not routine in uncomplicated CAP; evidence of harm exists for high doses.' },
        { id: 'discharge3', label: 'Oral amoxicillin and discharge with review in 48 hours', correct: false, harm: true, msg: 'A CURB-65 of 4 with hypoxia and hypotension needs admission and intravenous therapy.' }
      ]
    },
    debrief: {
      key: ['Four days of fever with rust-coloured sputum and pleuritic pain in a diabetic smoker.', 'Drowsy and disorientated with a temperature of 38.9 C, BP 96/58 and saturations of 89%.', 'Right lower lobe consolidation, lactate 2.4, CRP 240 and pneumococci in the blood: CURB-65 of 4.'],
      pearls: ['Antibiotics within one hour — the clinical diagnosis of pneumonia is enough; do not wait for imaging.', 'CURB-65 (confusion, urea, respiratory rate, blood pressure, age over 65) determines the level of care.', 'A raised troponin in sepsis usually reflects demand ischaemia, not plaque rupture.'],
      pitfalls: ['Treating the crackles of consolidation with a diuretic, or restricting fluid in a septic patient, both worsen outcomes.', 'Metformin should be paused during acute severe illness because of the risk of lactic acidosis.']
    }
  });

  /* =======================================================================
     CASE 15 — Severe acute pancreatitis
     ======================================================================= */
  window.CASES.push({
    id: 'pancreatitis',
    title: 'Epigastric pain boring through to the back after a drinking binge',
    category: 'Gastroenterology',
    difficulty: 'moderate',
    blurb: 'Twelve hours of severe epigastric pain radiating to the back, repeated vomiting and a distended, silent abdomen.',
    timeLimitSec: 600,
    budget: 2000,
    who: 'Mr. M., 45-year-old builder, BMI 32, with a background of heavy weekend drinking and a recent episode of biliary colic. Twelve hours of severe constant epigastric pain radiating straight through to the back, with repeated vomiting and no relief from antacids.',
    history: [
      'Twelve hours of severe epigastric pain boring through to the back, worse lying flat and better sitting forward.',
      'Repeated vomiting with no blood, no diarrhoea, no melaena.',
      'Heavy alcohol intake over the weekend; one previous episode of self-limiting right upper quadrant pain after fatty food.',
      'No previous abdominal surgery, no regular medication, no NSAID use, no recent trauma.',
      'No chest pain, no breathlessness, no urinary symptoms, no weight loss.'
    ],
    exam: [
      'In pain, restless, sitting forward, sweating. GCS 15.',
      'Pulse 124, **BP 100/62**, respiratory rate 26, SpO2 94% on room air, temperature 38.1 C.',
      '**Abdomen distended with marked epigastric tenderness and guarding; bowel sounds absent.** No palpable mass, no bruising of the flanks.',
      '**Reduced air entry and dullness at the left base.** No jaundice, no rash.',
      'Dry mucous membranes, capillary refill 4 seconds, no urine output since admission.'
    ],
    base: { hr: 124, sbp: 100, dbp: 62, rr: 26, spo2: 94, temp: 38.1, gcs: 15 },
    drift: { hr: 0.5, sbp: -0.6, dbp: -0.35, rr: 0.28, spo2: -0.25, temp: 0.012, gcs: -0.03 },
    decay: 0.27,
    events: [
      { at: 150, need: ['action:fluids'], loss: 12, msg: 'No fluid resuscitation. Pancreatitis causes massive third-space loss and the patient is now oliguric with a rising urea.' },
      { at: 300, need: ['action:analgesia'], loss: 10, msg: 'The pain is untreated. Untreated pain drives tachycardia, hypoventilation and atelectasis.' },
      { at: 430, need: ['action:catheter'], loss: 8, msg: 'No urine output monitoring — you cannot titrate fluid resuscitation without it.' }
    ],
    actions: [
      A('fluids', 'Hartmann\u2019s solution 5-10 mL/kg/hour with hourly reassessment', 'Adequate but not aggressive: both under- and over-resuscitation harm.', { cost: 25, tat: 8, factor: 0.5, msg: 'Fluids running with a rise in blood pressure and a fall in heart rate.' }),
      A('analgesia', 'IV morphine titrated to comfort, with an antiemetic', 'Pancreatitis is exquisitely painful and analgesia is a priority.', { cost: 20, tat: 6, factor: 0.75, msg: 'Pain reduced from 10/10 to 3/10; the patient is now able to take a deep breath.' }),
      A('antiemetic', 'IV antiemetic and nasogastric tube only if vomiting persists', 'Symptom control, not routine decompression.', { cost: 12, tat: 5, factor: 0.9, msg: 'Vomiting settled.' }),
      A('catheter', 'Urinary catheter with hourly output, aiming for at least 0.5 mL/kg/hour', 'The only reliable endpoint for fluid resuscitation.', { cost: 20, tat: 10, factor: 0.82, msg: 'Hourly urine output monitoring in place; output is improving with the fluids.' }),
      A('oxygen', 'Oxygen to keep saturations above 94%, with physiotherapy', 'Left basal atelectasis and effusion are common.', { cost: 15, tat: 5, factor: 0.9, msg: 'Saturations maintained and the patient is encouraged to breathe deeply.' }),
      A('nutrition', 'Early enteral nutrition within 72 hours (oral or nasogastric), no routine parenteral feeding', 'Protects the gut barrier and reduces infection.', { cost: 40, tat: 10, factor: 0.9, msg: 'Enteral feeding plan started once the vomiting settled.' }),
      A('hdu', 'Critical care review for organ failure and severity scoring', 'Persistent organ failure defines severe pancreatitis.', { cost: 0, tat: 10, factor: 0.85, msg: 'High-dependency bed arranged with a plan for repeated severity scoring.' }),
      A('abxproph', 'Prophylactic broad-spectrum antibiotics', 'No proven benefit and drives resistance and fungal infection.', { cost: 120, tat: 8, factor: 1.2, harm: true, msg: 'Prophylactic antibiotics given with no infected necrosis — no benefit, and a step towards resistant organisms and candida.' }),
      A('flood', '3 litres of crystalloid as fast as possible in the first hour', 'Fluid overload causes respiratory failure in pancreatitis.', { cost: 45, tat: 10, factor: 1.3, harm: true, msg: 'After the rapid bolus the saturations fell to 87% with new bilateral crackles — fluid overload in a patient with a leaky capillary bed.' }),
      A('necrosectomy', 'Urgent surgical necrosectomy today', 'Intervention for infected necrosis is delayed for weeks, not hours.', { cost: 900, tat: 20, factor: 1.5, harm: true, msg: 'Early surgical intervention in sterile pancreatitis caused major physiological deterioration and bleeding.' }),
      A('ercp', 'Urgent ERCP with no cholangitis and no duct obstruction', 'Reserved for cholangitis or persistent obstruction.', { cost: 420, tat: 18, factor: 1.25, harm: true, msg: 'ERCP without an indication caused post-procedure pancreatitis and bleeding, with no benefit.' })
    ],
    tests: [
      T('lipase', 'Serum lipase', 'Bloods', 110, 40, '**1240 U/L — more than ten times the upper limit of normal.** Diagnostic of acute pancreatitis.', { flag: 'critical', factor: 0.8 }),
      T('ca', 'Corrected calcium', 'Bloods', 70, 40, '**Corrected calcium 1.85 mmol/L (low)** — saponification of fat in the retroperitoneum. A marker of severity.', { flag: 'critical', factor: 0.85 }),
      T('abg2', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.32, pO2 74 mmHg, HCO3 19, **lactate 3.2 mmol/L**, base excess -5 — hypoperfusion and early organ dysfunction.', { flag: 'critical', factor: 0.85 }),
      T('fbc3', 'Full blood count', 'Bloods', 45, 30, 'WBC 19.4 x10^9/L, **haematocrit 48% (haemoconcentration)**, Hb 15.6, platelets 320. A rising haematocrit means ongoing third-space loss.', { flag: 'abnormal' }),
      T('crp3', 'CRP at 48 hours', 'Bloods', 50, 60, '**190 mg/L** at 48 hours — a severity marker above 150 mg/L.', { flag: 'abnormal' }),
      T('ue4', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, '**Urea 52 mg/dL, creatinine 1.5 mg/dL** (pre-renal), Na 134, K 4.2. A rising urea at 24 hours predicts severity.', { flag: 'abnormal' }),
      T('lft4', 'Liver function tests', 'Bloods', 90, 45, 'ALT 180, bilirubin 2.6 mg/dL, ALP 140 — a biliary pattern. Suggests a gallstone cause alongside the alcohol.', { flag: 'abnormal' }),
      T('glucose4', 'Capillary and laboratory glucose', 'Bedside', 15, 8, '**12.4 mmol/L** — hyperglycaemia from pancreatic endocrine dysfunction, and a marker of severity.', { flag: 'abnormal' }),
      T('amylase', 'Serum amylase', 'Bloods', 90, 35, '980 U/L — raised but less specific and less sensitive than lipase, and it falls quickly. The lipase has already answered the question.', { flag: 'abnormal' }),
      T('tg', 'Triglycerides and lipid profile', 'Bloods', 130, 60, 'Triglycerides 1.8 mmol/L — normal. Hypertriglyceridaemia is excluded as a cause.', { flag: 'normal' }),
      T('uss2', 'Abdominal ultrasound', 'Imaging', 260, 50, '**Multiple small gallstones in a thick-walled gallbladder with a normal-calibre duct.** The pancreas is partly obscured by bowel gas. No free fluid.', { flag: 'abnormal', factor: 0.9 }),
      T('cxr3', 'Chest X-ray (erect)', 'Imaging', 90, 30, '**Small left pleural effusion with basal atelectasis.** No free gas under the diaphragm — an important exclusion.', { flag: 'abnormal', factor: 0.95 }),
      T('ct', 'CT abdomen with contrast', 'Imaging', 620, 95, 'Inflammatory change throughout the pancreas with peripancreatic fluid; **no necrosis visible yet**. Severity is best assessed at 72 hours — doing it now costs money and adds little.', { flag: 'abnormal' }),
      T('ecg2', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 126. No ischaemic change.', { flag: 'normal' }),
      T('bc3', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. Infection is not the issue today; infected necrosis appears after one to two weeks.', { flag: 'normal' })
    ],
    hints: [
      'A lipase more than ten times normal settles the diagnosis: now it is about fluids, analgesia and organ support.',
      'Prophylactic antibiotics and early surgery both make pancreatitis worse; a CT on day one tells you less than one at 72 hours.'
    ],
    dx: {
      label: 'Severe acute pancreatitis (biliary and alcohol-related) with hypocalcaemia',
      accept: ['acute pancreatitis', 'severe acute pancreatitis', 'alcoholic pancreatitis', 'gallstone pancreatitis', 'acute pancreatitis with hypocalcaemia', 'necrotising pancreatitis', 'necrotizing pancreatitis', 'biliary pancreatitis'],
      reject: [
        { m: ['perforated', 'perforation'], msg: 'There is no free gas under the diaphragm and the lipase is more than ten times normal.' },
        { m: ['cholecystitis'], msg: 'Cholecystitis gives right upper quadrant pain with a positive Murphy sign; the pain here bores through to the back and the lipase is grossly raised.' },
        { m: ['myocardial infarction', 'stemi', 'ischaemia', 'ischemia'], msg: 'The ECG is normal apart from sinus tachycardia; the lipase is 1240 U/L.' },
        { m: ['dissection', 'aneurysm'], msg: 'No tearing pain, no pulse deficit, no widened mediastinum — and a diagnostic lipase.' },
        { m: ['mesenteric'], msg: 'Mesenteric ischaemia causes pain out of proportion with a relatively soft abdomen and a very high lactate; here the lipase is diagnostic.' },
        { m: ['renal colic', 'pyelonephritis'], msg: 'There is no loin pain or urinary symptoms, and the lipase is ten times the upper limit of normal.' },
        { m: ['gastroenteritis', 'food poisoning'], msg: 'Vomiting is a symptom of the pancreatitis, not the diagnosis — the lipase and the imaging confirm it.' },
        { m: ['dka', 'ketoacidosis'], msg: 'The glucose is 12.4 mmol/L without ketonaemia or acidosis from ketones; the lipase is diagnostic.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Twelve hours of epigastric pain boring through to the back with vomiting, a grossly raised lipase of 1240 U/L, hypocalcaemia, a raised haematocrit and early organ dysfunction.'
    },
    differentials: ['Severe acute pancreatitis', 'Perforated peptic ulcer', 'Acute cholecystitis', 'Mesenteric ischaemia', 'Acute myocardial infarction', 'Aortic dissection', 'Renal colic', 'Acute gastroenteritis', 'Diabetic ketoacidosis', 'Ruptured abdominal aortic aneurysm'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'fluids3', label: 'Moderate, monitored fluid resuscitation with Hartmann\u2019s solution and hourly urine output targets', correct: true, msg: 'Both under- and over-resuscitation increase organ failure.' },
        { id: 'pain', label: 'Adequate analgesia with titrated opioids plus an antiemetic', correct: true, msg: 'Humane and physiological: pain drives tachycardia and atelectasis.' },
        { id: 'feed', label: 'Early enteral nutrition within 72 hours; parenteral nutrition only if enteral is impossible', correct: true, msg: 'Preserves the gut barrier and reduces infectious complications.' },
        { id: 'organ', label: 'Monitor and support organ failure in a high-dependency setting with repeated severity scoring', correct: true, msg: 'Persistent organ failure beyond 48 hours defines severe pancreatitis.' },
        { id: 'calcium', label: 'Replace calcium and magnesium if symptomatic or severely low, and correct glucose and potassium', correct: true, msg: 'Hypocalcaemia is a severity marker and can cause tetany and arrhythmia.' },
        { id: 'cause', label: 'Treat the cause: urgent ERCP only for cholangitis or obstruction, and cholecystectomy during the same admission for gallstones', correct: true, msg: 'Definitive treatment of the cause prevents recurrence.' },
        { id: 'nutri2', label: 'Nasogastric tube on free drainage and nil by mouth for at least five days', correct: true, msg: 'Only if vomiting persists — otherwise early enteral feeding is better. Acceptable supportive care.' },
        { id: 'abx4', label: 'Prophylactic broad-spectrum antibiotics', correct: false, harm: true, msg: 'No benefit in sterile pancreatitis; they select resistant organisms and fungal infection.' },
        { id: 'surgery2', label: 'Urgent surgical necrosectomy in the first 24 hours', correct: false, harm: true, msg: 'Early intervention for sterile necrosis increases mortality; intervention for infected necrosis is delayed for weeks where possible.' },
        { id: 'ercp2', label: 'Urgent ERCP in the absence of cholangitis or duct obstruction', correct: false, harm: true, msg: 'No indication, and the procedure itself can worsen pancreatitis.' },
        { id: 'overload', label: 'Rapid 3-litre fluid bolus in the first hour', correct: false, harm: true, msg: 'Aggressive resuscitation in pancreatitis increases respiratory failure and abdominal compartment pressure.' },
        { id: 'morphine2', label: 'Withhold opioids and give only paracetamol to avoid masking signs', correct: false, harm: true, msg: 'Untreated severe pain causes tachycardia, hypoventilation and atelectasis. Opioids are safe and appropriate.' },
        { id: 'tpn', label: 'Total parenteral nutrition as the first-line nutritional strategy', correct: false, harm: true, msg: 'Parenteral nutrition carries more infection and hyperglycaemia than enteral feeding.' }
      ]
    },
    debrief: {
      key: ['Severe epigastric pain boring through to the back with vomiting and a silent, distended abdomen.', 'Lipase 1240 U/L, corrected calcium 1.85 mmol/L, haematocrit 48% and a lactate of 3.2.', 'Ultrasound shows gallstones; the chest X-ray shows a left effusion and no free gas.'],
      pearls: ['Lipase more than three times normal is diagnostic — you do not need the amylase as well.', 'A rising urea, a rising haematocrit and hypocalcaemia are bedside severity markers.', 'Fluid resuscitation is a balance: aim for urine output and perfusion, not for litres.'],
      pitfalls: ['Prophylactic antibiotics and early surgery in sterile pancreatitis both increase mortality.', 'A CT on day one rarely shows necrosis and does not change management; day three or later is when it earns its cost.']
    }
  });

})();
