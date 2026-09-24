/* =========================================================================
   DocSim — case library (part 11): metabolic emergencies
   A cold, unconscious patient with no thyroid hormone, and a calcium of 4.1.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 35 — Myxoedema coma
     ======================================================================= */
  window.CASES.push({
    id: 'myxoedema',
    title: 'An unconscious 76-year-old woman found at home',
    category: 'Endocrinology',
    difficulty: 'hard',
    blurb: 'She is cold to the touch, barely breathing and unrousable.',
    timeLimitSec: 600,
    budget: 1800,
    who: 'Mrs. C., 76-year-old widow with hypothyroidism on levothyroxine. Her prescription ran out three weeks ago and she has not replaced it. A neighbour found her unconscious on the floor of her unheated flat this morning; the ambulance crew record a temperature of 33.5 C that their thermometer would not read below.',
    history: [
      'Known primary hypothyroidism for 15 years; levothyroxine 100 micrograms daily, stopped three weeks ago.',
      'Progressive lethargy, cold intolerance, constipation, hoarseness and weight gain over two weeks.',
      'Found unconscious at home with no evidence of trauma; the flat was cold.',
      'No alcohol, no sedatives, no opioids, no insulin, no other medication.',
      'No chest pain, no cough, no fever at home, no head injury, no previous similar episode.'
    ],
    exam: [
      'Unrousable to voice but responding to pain, **GCS 8**, with **dry, coarse, cool skin and marked periorbital puffiness** (non-pitting).',
      '**Temperature 33.5 C**, pulse 44 and regular, **BP 92/60**, **respiratory rate 10 and shallow**, SpO2 88% on room air.',
      '**Macroglossia with a hoarse, low-pitched breathing pattern and delayed relaxation of the tendon reflexes.**',
      'Sparse dry hair, loss of the outer third of the eyebrows, no palpable goitre, no thyroidectomy scar.',
      'Abdomen soft and distended with reduced bowel sounds; no oedema of the legs, no rash, no needle marks.'
    ],
    base: { hr: 44, sbp: 92, dbp: 60, rr: 10, spo2: 88, temp: 33.5, gcs: 8 },
    drift: { hr: -0.12, sbp: -0.5, dbp: -0.3, rr: 0.12, spo2: -0.35, temp: -0.006, gcs: -0.05 },
    decay: 0.28,
    events: [
      { at: 110, need: ['action:thyroid'], loss: 16, msg: 'Thyroid hormone has not been given. Myxoedema coma has a mortality of 20-40% even when treated; without hormone replacement the coma deepens and the hypoventilation worsens.' },
      { at: 240, need: ['action:steroid'], loss: 12, msg: 'No hydrocortisone has been given. Adrenal insufficiency must be covered until the cortisol is known, and thyroid hormone without steroid cover can precipitate an adrenal crisis.' },
      { at: 370, need: ['action:ventilation'], loss: 14, msg: 'No ventilatory support for a respiratory rate of 10 with a rising CO2 — hypoventilation, not hypoxia, is what kills these patients.' }
    ],
    actions: [
      A('thyroid', 'IV levothyroxine 300-500 micrograms loading, then 50-100 micrograms daily', 'The definitive treatment — the intravenous route because absorption is unreliable.', { cost: 400, tat: 10, factor: 0.4, msg: 'Loading dose of intravenous levothyroxine given. The metabolic rate will take days to recover, but the treatment is under way.' }),
      A('steroid', 'IV hydrocortisone 100 mg immediately and six-hourly until adrenal insufficiency is excluded', 'Thyroid hormone without steroid cover can precipitate an adrenal crisis.', { cost: 30, tat: 6, factor: 0.6, msg: 'Hydrocortisone given before the thyroid hormone — the safe order when the cortisol is not yet known.' }),
      A('warming', 'Slow, passive rewarming with blankets, warm fluids and a warm room — avoid rapid active rewarming', 'Rapid rewarming causes vasodilatation and cardiovascular collapse.', { cost: 20, tat: 8, factor: 0.6, msg: 'Passive rewarming started with the temperature rising by 0.5 C per hour — deliberately slow.' }),
      A('ventilation', 'Ventilatory support for the hypoventilation — non-invasive first, with a low threshold for intubation', 'The CO2 is what kills, not the oxygen saturation.', { cost: 150, tat: 10, factor: 0.5, msg: 'Non-invasive ventilation started: the respiratory rate has risen to 14 and the CO2 is falling.' }),
      A('fluids', 'Cautious IV fluids with dextrose, and careful correction of the hyponatraemia', 'These patients are volume depleted but tolerate fluid poorly.', { cost: 20, tat: 8, factor: 0.7, msg: 'Fluids and dextrose given with the glucose corrected and no sign of overload.' }),
      A('icu', 'Intensive care with monitoring of temperature, glucose, sodium, CO2 and cardiac rhythm', 'Everything moves slowly and everything needs watching.', { cost: 0, tat: 10, factor: 0.7, msg: 'Intensive care accepting the patient with a warming and ventilation plan.' }),
      A('precipitant', 'Look for and treat the precipitant: infection, myocardial infarction, cold exposure, sedative drugs', 'There is always a trigger for the decompensation.', { cost: 80, tat: 12, factor: 0.85, msg: 'Chest infection identified and treated; the cold flat and the missing prescription are the other contributors.' }),
      A('rapid', 'Rapid active rewarming by warm water immersion to 37 C within 30 minutes', 'Vasodilatation in a hypovolaemic patient causes collapse.', { cost: 40, tat: 10, factor: 1.4, harm: true, msg: 'Rapid rewarming caused profound vasodilatation: the blood pressure fell to 68/40 and the patient developed a bradyarrhythmia.' }),
      A('nothyroid', 'Withhold thyroid hormone until the thyroid function tests are reported', 'Treatment must start on clinical suspicion.', { cost: 0, tat: 6, factor: 1.7, harm: true, msg: 'Thyroid hormone withheld pending results: the coma deepened, the CO2 rose to 9.8 kPa and the patient required emergency intubation.' }),
      A('nosteroid', 'Give the thyroid hormone without any hydrocortisone cover', 'Precipitates an adrenal crisis in unsuspected adrenal insufficiency.', { cost: 0, tat: 5, factor: 1.5, harm: true, msg: 'Thyroxine given without steroid cover: the blood pressure fell further, consistent with an unmasked adrenal insufficiency.' }),
      A('flood', 'Aggressive fluid boluses to correct the blood pressure', 'A failing myocardium tolerates rapid volume badly.', { cost: 30, tat: 8, factor: 1.25, harm: true, msg: 'Rapid fluid loading caused pulmonary congestion with a fall in the saturations.' }),
      A('sedate', 'IV sedation to allow intubation for the low conscious level', 'Sedation in myxoedema coma is dangerous: these patients metabolise drugs very slowly.', { cost: 25, tat: 8, factor: 1.3, harm: true, msg: 'Sedation produced a prolonged, deep coma — hypothyroid patients clear sedatives extraordinarily slowly.' })
    ],
    tests: [
      T('tft', 'Thyroid function tests', 'Bloods', 120, 50, '**TSH greater than 100 mIU/L with an undetectable free T4 and a low free T3.** Profound primary hypothyroidism.', { flag: 'critical', factor: 0.75 }),
      T('cortisol', 'Serum cortisol (and ACTH)', 'Bloods', 140, 50, '**Cortisol 180 nmol/L with a modestly raised ACTH** — an inadequate response to critical illness. Adrenal insufficiency had to be covered before the thyroid hormone was given.', { flag: 'critical', factor: 0.8 }),
      T('glucose', 'Capillary and laboratory glucose', 'Bedside', 10, 6, '**2.8 mmol/L** — hypoglycaemia, from reduced gluconeogenesis and depleted glycogen.', { flag: 'critical', factor: 0.8 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, '**Na 118 mmol/L** with K 4.4, urea 24 mg/dL, creatinine 1.2 mg/dL. The hyponatraemia is dilutional from impaired free water clearance; the low urea fits.', { flag: 'critical', factor: 0.75 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.24, **pCO2 8.2 kPa (62 mmHg)**, pO2 7.6 kPa, HCO3 26 — **type 2 respiratory failure from hypoventilation**, the usual mode of death in myxoedema coma.', { flag: 'critical', factor: 0.72 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, '**Sinus bradycardia at 44 with low-voltage complexes, a prolonged QT and flattened T waves.** Pericardial effusion is common and can contribute to the low voltage.', { flag: 'abnormal', factor: 0.9 }),
      T('ck', 'Creatine kinase and renal function', 'Bloods', 60, 40, '**CK 1200 U/L** with normal renal function — hypothyroid myopathy. It settles with treatment and does not indicate rhabdomyolysis-induced renal failure.', { flag: 'abnormal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, '**Hb 10.8 g/dL with a raised MCV** — the normochromic normocytic or macrocytic anaemia of hypothyroidism. WBC 7.2, platelets 180.', { flag: 'abnormal' }),
      T('crp', 'CRP', 'Bloods', 50, 35, '62 mg/L — raised, consistent with the chest infection that precipitated the decompensation.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, '**A small pleural effusion with an enlarged cardiac silhouette** and right basal consolidation. The effusion and cardiomegaly are hypothyroid features rather than heart failure.', { flag: 'abnormal', factor: 0.95 }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth at 24 hours. Sepsis is a differential for hypothermia with hypotension and must be excluded, but the temperature here is low rather than high.', { flag: 'normal' }),
      T('lipids', 'Lipid profile', 'Bloods', 90, 45, 'Total cholesterol 9.2 mmol/L with a raised LDL — the classic hyperlipidaemia of hypothyroidism. It will normalise with replacement.', { flag: 'abnormal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 80, 'Normal. No structural cause for the coma — the metabolic picture explains it.', { flag: 'normal' }),
      T('trop', 'High-sensitivity troponin', 'Bloods', 60, 30, 'hs-troponin 60 ng/L — mildly raised. Hypothyroidism causes a myopathic leak, and demand ischaemia is also possible in a hypothermic patient.', { flag: 'abnormal' })
    ],
    hints: [
      'Hypothermia, bradycardia, hypoventilation, hyponatraemia and a patient off her thyroxine: give thyroid hormone and steroid together, and support the ventilation.',
      'Rewarm slowly, and never sedate: hypothyroid patients clear drugs very slowly and vasodilate catastrophically with rapid warming.'
    ],
    dx: {
      label: 'Myxoedema coma (severe hypothyroidism) with hypothermia and hypoventilation',
      accept: ['myxoedema coma', 'myxedema coma', 'severe hypothyroidism with coma', 'myxoedema crisis', 'hypothyroid coma'],
      reject: [
        { m: ['adrenal', 'addison'], msg: 'Adrenal crisis also causes hypothermia, hyponatraemia and hypoglycaemia — but the TSH here is above 100 with an undetectable free T4, and hydrocortisone is given anyway until the cortisol is known.' },
        { m: ['sepsis', 'septic'], msg: 'Sepsis causes fever, not a temperature of 33.5 C with bradycardia, macroglossia and delayed reflexes. Infection is the precipitant here, not the diagnosis.' },
        { m: ['environmental'], msg: 'Environmental hypothermia alone does not explain the macroglossia, the delayed reflexes, the hyponatraemia or the absent thyroxine for three weeks.' },
        { m: ['stroke', 'subarachnoid'], msg: 'The CT is normal and there is no focal deficit; the coma is metabolic.' },
        { m: ['opioid', 'sedative'], msg: 'There are no sedative drugs at home and the toxicology screen is negative; the low respiratory rate is from hypothyroidism.' },
        { m: ['ketoacidosis'], msg: 'The glucose is 2.8 mmol/L with no ketonaemia — this is hypoglycaemia, not ketoacidosis.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A hypothyroid patient off treatment for three weeks, found unconscious with a temperature of 33.5 C, bradycardia of 44, hypoventilation with a pCO2 of 8.2 kPa, hyponatraemia of 118, hypoglycaemia and a TSH above 100: myxoedema coma.'
    },
    differentials: ['Myxoedema coma', 'Adrenal crisis', 'Sepsis with hypothermia', 'Environmental hypothermia', 'Opioid or sedative overdose', 'Acute stroke', 'Diabetic ketoacidosis', 'Pituitary apoplexy', 'Hypoglycaemic coma', 'Meningoencephalitis'],
    mgmt: {
      timeSec: 35,
      options: [
        { id: 't4', label: 'Intravenous levothyroxine loading (300-500 micrograms) then daily replacement', correct: true, msg: 'The definitive treatment, given intravenously because gut absorption is unreliable.' },
        { id: 'hc', label: 'IV hydrocortisone until adrenal insufficiency is excluded', correct: true, msg: 'Prevents an adrenal crisis precipitated by thyroid hormone.' },
        { id: 'warm2', label: 'Slow passive rewarming, aiming for around 0.5 C per hour', correct: true, msg: 'Rapid rewarming causes vasodilatation and cardiovascular collapse.' },
        { id: 'vent2', label: 'Ventilatory support for hypoventilation with close CO2 monitoring', correct: true, msg: 'Hypercapnia is the usual mode of death.' },
        { id: 'glu3', label: 'Correct the hypoglycaemia and the hyponatraemia carefully with dextrose and isotonic fluids', correct: true, msg: 'Dilutional hyponatraemia corrects slowly as the thyroid hormone takes effect.' },
        { id: 'icu2', label: 'Intensive care with continuous temperature, glucose, sodium and cardiac monitoring', correct: true, msg: 'Everything moves slowly; arrhythmia and hypoventilation are the risks.' },
        { id: 'treat3', label: 'Identify and treat the precipitant (here a chest infection) and restart the prescription', correct: true, msg: 'Prevents the next episode, which is often fatal.' },
        { id: 'fastwarm', label: 'Rapid active rewarming with warm water immersion', correct: false, harm: true, msg: 'Vasodilatation in a hypovolaemic, myopathic circulation causes profound hypotension.' },
        { id: 'wait4', label: 'Withhold thyroid hormone until the laboratory results are available', correct: false, harm: true, msg: 'Treatment of myxoedema coma starts on clinical suspicion; delay deepens the coma.' },
        { id: 'noster', label: 'Give thyroid hormone without hydrocortisone cover', correct: false, harm: true, msg: 'Unmasks adrenal insufficiency and can cause cardiovascular collapse.' },
        { id: 'flood2', label: 'Aggressive fluid boluses for the hypotension', correct: false, harm: true, msg: 'A hypothyroid myocardium tolerates rapid volume loading badly.' },
        { id: 'sed2', label: 'IV sedation to facilitate intubation and imaging', correct: false, harm: true, msg: 'Hypothyroid patients metabolise sedatives extremely slowly, producing prolonged coma.' }
      ]
    },
    debrief: {
      key: ['Known hypothyroidism with levothyroxine stopped three weeks ago; found unconscious in a cold flat.', 'Temperature 33.5 C, pulse 44, respiratory rate 10, GCS 8, with macroglossia, coarse dry skin, periorbital puffiness and delayed reflexes.', 'TSH above 100 with an undetectable free T4, sodium 118, glucose 2.8, cortisol 180 and a pCO2 of 8.2 kPa.'],
      pearls: ['Myxoedema coma is treated on suspicion: intravenous thyroxine plus hydrocortisone, slow rewarming and ventilatory support.', 'Hypercapnia, not hypoxia, is what kills these patients — watch the CO2 and support the ventilation early.', 'Adrenal insufficiency must be covered before or with thyroid hormone, because thyroxine accelerates cortisol metabolism.'],
      pitfalls: ['Rapid active rewarming and sedation both cause collapse in myxoedema coma.', 'Waiting for thyroid function results before treating is a fatal delay in a comatose hypothermic patient.']
    }
  });

  /* =======================================================================
     CASE 36 — Severe hypercalcaemia of malignancy
     ======================================================================= */
  window.CASES.push({
    id: 'hypercalcaemia',
    title: 'Confusion and weakness in a 66-year-old man',
    category: 'Endocrinology / Oncology',
    difficulty: 'hard',
    blurb: 'Five days of vomiting, constipation and passing large volumes of urine.',
    timeLimitSec: 600,
    budget: 1800,
    who: 'Mr. L., 66-year-old retired teacher with metastatic squamous cell carcinoma of the lung diagnosed four months ago, currently between chemotherapy cycles. Five days of increasing confusion, constipation, nausea and vomiting, with passing large volumes of urine. He is now profoundly weak and drowsy.',
    history: [
      'Five days of progressive confusion, drowsiness and generalised weakness.',
      'Constipation for a week, nausea and vomiting for three days, and polyuria with nocturia.',
      'Known metastatic squamous cell lung cancer; no bone pain, no recent bisphosphonate, no calcium or vitamin D supplements.',
      'Also on bendroflumethiazide for hypertension and codeine for cough.',
      'No fever, no headache, no focal weakness, no seizure, no recent falls.'
    ],
    exam: [
      'Drowsy and disorientated, **GCS 13**, with generalised weakness and reduced tendon reflexes.',
      'Pulse 108, **BP 106/62** with a postural drop, respiratory rate 20, SpO2 95%, temperature 36.9 C.',
      '**Dry mucous membranes with reduced skin turgor and a capillary refill of 4 seconds. No urine output recorded for six hours.**',
      'Chest examination shows reduced air entry at the right apex with dullness. No bony tenderness, no lymphadenopathy, no rash.',
      'No focal neurology and no meningism. Abdomen soft with reduced bowel sounds and no palpable mass.'
    ],
    base: { hr: 108, sbp: 106, dbp: 62, rr: 20, spo2: 95, temp: 36.9, gcs: 13 },
    drift: { hr: 0.35, sbp: -0.5, dbp: -0.3, rr: 0.2, spo2: -0.2, temp: 0.006, gcs: -0.06 },
    decay: 0.28,
    events: [
      { at: 120, need: ['action:rehydrate'], loss: 16, msg: 'No fluid resuscitation. Hypercalcaemia causes an osmotic diuresis, and the resulting hypovolaemia reduces the renal clearance of calcium — the dehydration is what makes the calcium spiral upwards.' },
      { at: 250, need: ['action:bisphosphonate'], loss: 12, msg: 'No bisphosphonate has been given. Rehydration alone rarely brings a calcium of 4.1 mmol/L down; the osteoclasts need to be switched off.' },
      { at: 380, need: ['action:stopdrugs'], loss: 8, msg: 'The thiazide has not been stopped. Thiazides reduce calcium excretion and will keep the calcium high.' }
    ],
    actions: [
      A('rehydrate', 'IV 0.9% saline 1-2 litres in the first hours, then 2-4 litres over 24 hours with monitoring', 'Restores the glomerular filtration rate and calcium excretion.', { cost: 40, tat: 8, factor: 0.5, msg: 'Two litres of saline running: the blood pressure is 118/70, the pulse 92 and the confusion is already lightening.' }),
      A('bisphosphonate', 'IV zoledronic acid (or pamidronate) after rehydration is under way', 'Switches off osteoclastic bone resorption — the definitive treatment.', { cost: 500, tat: 12, factor: 0.6, msg: 'Zoledronic acid infused after two litres of saline; the calcium will fall steadily over the next 48 hours.' }),
      A('calcitonin', 'Calcitonin 4 units/kg subcutaneously twice daily for a rapid but temporary effect', 'Works within hours, unlike bisphosphonates.', { cost: 180, tat: 8, factor: 0.7, msg: 'Calcitonin given: the calcium has fallen by 0.4 mmol/L within six hours.' }),
      A('stopdrugs', 'Stop the thiazide, codeine and any calcium or vitamin D supplements', 'Thiazides and vitamin D raise calcium; codeine worsens the constipation.', { cost: 0, tat: 6, factor: 0.8, msg: 'Thiazide stopped and the drug chart reviewed; no further calcium-retaining drugs will be given.' }),
      A('monitor', 'Monitor calcium, potassium, magnesium, phosphate, creatinine and hourly urine output', 'Refeeding and treatment both shift electrolytes.', { cost: 20, tat: 8, factor: 0.8, msg: 'Monitoring established with electrolyte replacement planned.' }),
      A('onc', 'Involve the oncology team to treat the underlying malignancy', 'Without treating the cancer the calcium will rise again within weeks.', { cost: 0, tat: 10, factor: 0.85, msg: 'Oncology review arranged with a plan for disease-directed treatment.' }),
      A('dialysis', 'Consider haemodialysis for severe hypercalcaemia with renal failure or heart failure', 'The fastest way to lower calcium when the kidneys cannot help.', { cost: 0, tat: 12, factor: 0.7, msg: 'Renal team alerted: dialysis is available if the calcium does not respond or the renal function deteriorates.' }),
      A('restrict', 'Fluid restriction to avoid pulmonary oedema', 'These patients are profoundly volume depleted.', { cost: 0, tat: 5, factor: 1.7, harm: true, msg: 'Fluid restriction in a patient with an osmotic diuresis caused worsening renal failure and a rising calcium.' }),
      A('furofirst', 'IV furosemide before any rehydration', 'Diuresis before volume replacement worsens the dehydration.', { cost: 10, tat: 6, factor: 1.4, harm: true, msg: 'Furosemide before rehydration deepened the hypovolaemia, dropped the blood pressure and reduced calcium excretion further.' }),
      A('thiazide', 'Continue the thiazide diuretic for the hypertension', 'Thiazides reduce urinary calcium excretion.', { cost: 0, tat: 4, factor: 1.5, harm: true, msg: 'The thiazide was continued: the calcium remained high despite rehydration.' }),
      A('bisphosfirst', 'Give the bisphosphonate before starting any fluids', 'Bisphosphonates in a dehydrated patient cause renal injury.', { cost: 500, tat: 10, factor: 1.3, harm: true, msg: 'Bisphosphonate given before rehydration: the creatinine rose further, and the drug is nephrotoxic in a volume-depleted patient.' }),
      A('steroid', 'High-dose corticosteroids as the first-line treatment', 'Only for granulomatous disease or haematological malignancy.', { cost: 25, tat: 6, factor: 1.2, harm: true, msg: 'Steroids given first: they have little effect on PTHrP-mediated hypercalcaemia from squamous cell carcinoma, and they delay the treatments that work.' })
    ],
    tests: [
      T('calcium', 'Corrected serum calcium (and albumin)', 'Bloods', 70, 30, '**Corrected calcium 4.1 mmol/L** with an albumin of 30 g/L. Above 3.5 mmol/L is a hypercalcaemic crisis and needs treatment regardless of symptoms.', { flag: 'critical', factor: 0.7 }),
      T('pth', 'Parathyroid hormone', 'Bloods', 140, 50, '**PTH suppressed below the reference range** — this excludes primary hyperparathyroidism and points to a non-parathyroid cause.', { flag: 'critical', factor: 0.75 }),
      T('pthrp', 'PTH-related peptide (PTHrP)', 'Special', 200, 90, '**PTHrP markedly elevated** — the classic mechanism in squamous cell carcinoma, which secretes a peptide that mimics parathyroid hormone.', { flag: 'abnormal', factor: 0.85 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 96 mg/dL, **creatinine 2.2 mg/dL**, **K 3.1 mmol/L**, Na 143, bicarbonate 24, phosphate 1.1 mmol/L — acute kidney injury from dehydration, with hypokalaemia from vomiting and the osmotic diuresis.', { flag: 'abnormal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 108 with a **shortened QT interval** and a prolonged PR segment. Hypercalcaemia shortens the QT and predisposes to arrhythmia, particularly once rehydration and potassium correction are under way.', { flag: 'abnormal', factor: 0.9 }),
      T('vitd', 'Vitamin D (1,25-dihydroxy)', 'Special', 110, 70, 'Normal. Excludes vitamin D toxicity and granulomatous disease as the mechanism.', { flag: 'normal' }),
      T('alp', 'Alkaline phosphatase and bone profile', 'Bloods', 90, 40, 'ALP 340 U/L with normal phosphate — a raised alkaline phosphatase in malignancy usually reflects bone turnover or liver involvement.', { flag: 'abnormal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 11.2 g/dL, WBC 9.8, platelets 260 — mild anaemia of chronic disease, no leucoerythroblastic picture to suggest marrow infiltration.', { flag: 'abnormal' }),
      T('glucose', 'Capillary and laboratory glucose', 'Bedside', 15, 8, '6.8 mmol/L — normal. Steroid therapy will require monitoring.', { flag: 'normal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, '**A right apical mass with hilar enlargement and a small pleural effusion**, unchanged from previous imaging. Confirms the underlying malignancy.', { flag: 'abnormal', factor: 0.95 }),
      T('ct', 'CT chest, abdomen and pelvis with contrast', 'Imaging', 620, 80, 'Progressive pulmonary disease with no new bony metastases. Employs contrast in a patient with a creatinine of 2.2 mg/dL and does not change the next hour.', { flag: 'abnormal' }),
      T('urine', '24-hour urinary calcium and urine output', 'Bloods', 60, 60, 'High urinary calcium with a low urine output — the osmotic diuresis of hypercalcaemia.', { flag: 'abnormal' })
    ],
    hints: [
      'Rehydrate first with saline, then switch off the osteoclasts with a bisphosphonate — and stop the thiazide.',
      'Furosemide before rehydration, fluid restriction and a bisphosphonate in a dry patient all make hypercalcaemia worse.'
    ],
    dx: {
      label: 'Severe hypercalcaemia of malignancy (PTHrP-mediated) with acute kidney injury',
      accept: ['hypercalcaemia of malignancy', 'severe hypercalcaemia', 'malignant hypercalcaemia', 'hypercalcaemic crisis', 'hypercalcemia of malignancy', 'hypercalcaemia with dehydration'],
      reject: [
        { m: ['hyperparathyroidism'], msg: 'The PTH is suppressed and the PTHrP is markedly elevated — primary hyperparathyroidism is excluded.' },
        { m: ['vitamin d'], msg: 'The vitamin D level is normal; this is PTHrP-mediated hypercalcaemia from squamous cell carcinoma.' },
        { m: ['sarcoidosis'], msg: 'Sarcoidosis causes hypercalcaemia through unregulated vitamin D production, with a normal or high vitamin D and a suppressed PTH — but there is known metastatic lung cancer and a raised PTHrP.' },
        { m: ['milk alkali'], msg: 'Milk-alkali syndrome follows large calcium and antacid intake with a raised bicarbonate and a suppressed PTH — there is no such history here and the PTHrP is elevated.' },
        { m: ['myeloma'], msg: 'Myeloma causes hypercalcaemia through local osteolysis with a suppressed PTHrP; this patient has known squamous cell lung cancer with a markedly raised PTHrP.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Known metastatic squamous cell lung cancer with five days of confusion, constipation, vomiting and polyuria, a corrected calcium of 4.1 mmol/L, a suppressed PTH, a markedly raised PTHrP and an acute kidney injury from the osmotic diuresis.'
    },
    differentials: ['Hypercalcaemia of malignancy', 'Primary hyperparathyroidism', 'Vitamin D toxicity', 'Sarcoidosis', 'Milk-alkali syndrome', 'Bone metastases with immobilisation', 'Adrenal insufficiency', 'Thyrotoxicosis', 'Multiple myeloma', 'Paget disease with immobilisation'],
    mgmt: {
      timeSec: 35,
      options: [
        { id: 'saline', label: 'IV 0.9% saline rehydration, 1-2 litres in the first hours then 2-4 litres per day', correct: true, msg: 'Restores the glomerular filtration rate, which is what allows calcium to be excreted.' },
        { id: 'bisph', label: 'IV bisphosphonate (zoledronic acid or pamidronate) once rehydration has started', correct: true, msg: 'Inhibits osteoclastic resorption; the effect lasts weeks.' },
        { id: 'calc', label: 'Calcitonin for a rapid temporary reduction while the bisphosphonate takes effect', correct: true, msg: 'Works within hours, though tachyphylaxis develops after a couple of days.' },
        { id: 'stop4', label: 'Stop the thiazide, codeine and any calcium or vitamin D supplements', correct: true, msg: 'Thiazides reduce calcium excretion and perpetuate the problem.' },
        { id: 'mon4', label: 'Monitor calcium, potassium, magnesium, phosphate and renal function with hourly urine output', correct: true, msg: 'Electrolytes shift during treatment and potassium is already low.' },
        { id: 'onc2', label: 'Involve oncology to treat the underlying malignancy, and consider dialysis if refractory', correct: true, msg: 'Without disease control the calcium recurs in weeks.' },
        { id: 'sympt', label: 'Treat the symptoms: antiemetics, laxatives for constipation, and analgesia', correct: true, msg: 'Symptom control matters for a patient with an incurable disease.' },
        { id: 'restrict3', label: 'Fluid restriction to protect against pulmonary oedema', correct: false, harm: true, msg: 'These patients are profoundly dehydrated; restriction worsens renal failure and raises the calcium further.' },
        { id: 'furo3', label: 'IV furosemide before rehydration', correct: false, harm: true, msg: 'Diuresis before volume replacement deepens the hypovolaemia and lowers calcium excretion.' },
        { id: 'thia2', label: 'Continue the thiazide for the hypertension', correct: false, harm: true, msg: 'Thiazides reduce urinary calcium excretion and keep the calcium high.' },
        { id: 'bisphfirst', label: 'Give the bisphosphonate before any fluids', correct: false, harm: true, msg: 'Bisphosphonates are nephrotoxic in a volume-depleted patient and can worsen the kidney injury.' },
        { id: 'ster2', label: 'High-dose corticosteroids as the first-line treatment', correct: false, harm: true, msg: 'Steroids work in granulomatous disease and haematological malignancy, not in PTHrP-mediated hypercalcaemia, and they delay effective treatment.' }
      ]
    },
    debrief: {
      key: ['Known metastatic squamous cell lung cancer with five days of confusion, constipation, vomiting and polyuria.', 'Corrected calcium 4.1 mmol/L with a suppressed PTH and a markedly elevated PTHrP.', 'Creatinine 2.2 mg/dL and potassium 3.1 from the osmotic diuresis and vomiting; a shortened QT on the ECG.'],
      pearls: ['Rehydrate first, then switch off bone resorption with a bisphosphonate — and add calcitonin if you need a rapid effect.', 'A suppressed PTH with a raised PTHrP names the mechanism: squamous cell carcinoma is the classic PTHrP producer.', 'Look for and stop the drugs that perpetuate it: thiazides, vitamin D and calcium supplements.'],
      pitfalls: ['Furosemide before rehydration, fluid restriction and bisphosphonates in a dry patient all worsen hypercalcaemia.', 'Steroids are not a first-line treatment for PTHrP-mediated hypercalcaemia.']
    }
  });

})();
