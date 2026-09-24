/* =========================================================================
   DocSim — case library (part 9): infection and fever
   A vegetation, a neutrophil count of zero, and a parasite with a stopwatch.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 29 — Infective endocarditis
     ======================================================================= */
  window.CASES.push({
    id: 'endocarditis',
    title: 'Three weeks of fever and weight loss in a 38-year-old man',
    category: 'Infectious disease / Cardiology',
    difficulty: 'moderate',
    blurb: 'Drenching night sweats and increasing breathlessness on exertion.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Mr. N., 38-year-old man who injects heroin. Three weeks of fever, drenching night sweats, malaise and 6 kg of weight loss. He has been treated twice with oral antibiotics for "flu" without improvement, and today he is more breathless with a racing heart.',
    history: [
      'Three weeks of intermittent fever with rigors and drenching night sweats.',
      '6 kg weight loss, poor appetite and progressive fatigue.',
      'Two courses of oral antibiotics from his general practitioner with no improvement.',
      'Injecting heroin into the groin and both arms for six years; last injection three days ago.',
      'Increasing breathlessness on exertion for four days. No chest pain, no haemoptysis, no dental work, no recent surgery.'
    ],
    exam: [
      'Unwell and clammy, GCS 15, temperature **38.7 C**.',
      'Pulse 118, **BP 98/58**, respiratory rate 24, SpO2 94% on room air.',
      '**A new loud pansystolic murmur at the apex radiating to the axilla, with a hyperdynamic circulation.**',
      '**Splinter haemorrhages in the nail beds, two Janeway lesions on the left palm, and conjunctival petechiae.**',
      '**Splenomegaly two finger-breadths below the costal margin.** Injection track marks in the groins. No peripheral oedema.'
    ],
    base: { hr: 118, sbp: 98, dbp: 58, rr: 24, spo2: 94, temp: 38.7, gcs: 15 },
    drift: { hr: 0.5, sbp: -0.72, dbp: -0.38, rr: 0.28, spo2: -0.25, temp: 0.014, gcs: -0.04 },
    decay: 0.26,
    events: [
      { at: 130, need: ['action:cultures'], loss: 10, msg: 'No blood cultures have been taken. Once antibiotics are given, the organism may never be recovered — and 14 days of blind therapy is unsafe in endocarditis.' },
      { at: 280, need: ['action:abx'], loss: 14, msg: 'Antibiotics have still not been given. The patient is now frankly hypotensive with a lactate of 4 mmol/L — acute severe mitral regurgitation is developing.' },
      { at: 400, need: ['test:echo'], loss: 8, msg: 'No echocardiogram has been requested. The size of the vegetation and the severity of the valve lesion determine whether this patient needs surgery tonight.' }
    ],
    actions: [
      A('cultures', 'Take three sets of blood cultures from separate peripheral sites before the first antibiotic dose', 'The organism and its sensitivities govern the next six weeks.', { cost: 60, tat: 10, factor: 0.6, msg: 'Three sets of cultures taken from separate sites and sent urgently. Thirty minutes later the laboratory calls to say Gram-positive cocci are growing in all of them.' }),
      A('abx', 'IV empirical therapy for native valve endocarditis (flucloxacillin plus gentamicin, per local policy)', 'Start within the hour in a septic patient — but cultures first.', { cost: 120, tat: 8, factor: 0.5, msg: 'Intravenous antibiotics running with therapeutic doses and monitoring for gentamicin toxicity.' }),
      A('fluids', 'IV crystalloid for the sepsis, with careful attention to the failing valve', 'Support the circulation without flooding a regurgitant valve.', { cost: 18, tat: 8, factor: 0.72, msg: 'Fluids given with a rise in blood pressure to 112/66.' }),
      A('surgery', 'Involve the cardiologist and cardiac surgeon early — acute severe regurgitation may need urgent valve surgery', 'Timing surgery is the hardest decision in endocarditis.', { cost: 0, tat: 12, factor: 0.6, msg: 'Cardiology and cardiac surgery at the bedside; the patient is being considered for early surgery if the regurgitation worsens.' }),
      A('monitor', 'Continuous monitoring with urinary output, repeat cultures and daily renal function', 'Gentamicin and heart failure both need watching.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring established with a clear plan for repeat cultures and drug levels.' }),
      A('oxygen', 'Oxygen to keep saturations above 94%', 'There is early pulmonary congestion from the regurgitant valve.', { cost: 15, tat: 5, factor: 0.9, msg: 'Saturations maintained at 97%.' }),
      A('echoorder', 'Request an urgent transthoracic echocardiogram and warn that a transoesophageal study may follow', 'You cannot size a vegetation or grade a valve lesion with a stethoscope.', { cost: 0, tat: 6, factor: 0.8, msg: 'Urgent echocardiography requested with the laboratory alerted for a possible transoesophageal study.' }),
      A('abxfirst', 'Give antibiotics first and take cultures later', 'Cultures are sterilised within hours.', { cost: 120, tat: 6, factor: 1.25, harm: true, msg: 'Antibiotics before cultures: the cultures remained sterile, the organism was never identified and the patient ended up on six weeks of blind, broad therapy.' }),
      A('waithecho', 'Withhold antibiotics until the echocardiogram confirms the diagnosis', 'A septic patient with a vegetation cannot wait for the scanner.', { cost: 0, tat: 6, factor: 1.5, harm: true, msg: 'Antibiotics withheld for the echo: the patient deteriorated with a lactate of 4.2 and worsening mitral regurgitation.' }),
      A('nsaid', 'Ibuprofen for the fever and night sweats', 'NSAIDs mask the fever and increase bleeding and renal risk.', { cost: 12, tat: 5, factor: 1.3, harm: true, msg: 'NSAIDs brought the temperature down and masked the ongoing sepsis, while the creatinine rose.' }),
      A('oral', 'Oral antibiotics and outpatient follow-up in a week', 'Endocarditis needs intravenous therapy and admission.', { cost: 40, tat: 6, factor: 1.8, harm: true, msg: 'Oral antibiotics for endocarditis: the patient returned in shock with a ruptured chorda and acute pulmonary oedema.' })
    ],
    tests: [
      T('bc', 'Blood cultures (three sets, separate sites)', 'Microbiology', 120, 90, '**Staphylococcus aureus in all three sets at 14 hours, methicillin-sensitive with a normal gentamicin MIC.** This is the result that makes the diagnosis and directs six weeks of therapy.', { flag: 'critical', factor: 0.7 }),
      T('echo', 'Echocardiography (transthoracic, then transoesophageal)', 'Imaging', 260, 50, '**A 12 mm mobile vegetation on the anterior mitral leaflet with a flail segment and severe mitral regurgitation.** No annular abscess, no aortic involvement, LVEF 55%.', { flag: 'critical', factor: 0.7 }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'WBC 14.8 with neutrophilia, **Hb 9.6 g/dL (normocytic anaemia of chronic disease)**, platelets 320.', { flag: 'abnormal' }),
      T('crp', 'CRP and ESR', 'Bloods', 90, 40, '**CRP 168 mg/L with an ESR of 88 mm/hour** — a markedly raised inflammatory response consistent with weeks of infection.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 62 mg/dL, **creatinine 1.6 mg/dL**, Na 133, K 4.4. Renal impairment from immune complex deposition and from the sepsis.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 40, 'Bilirubin 1.8 mg/dL, ALT 70, albumin 28 g/L — mild derangement in severe sepsis.', { flag: 'abnormal' }),
      T('dip', 'Urine dipstick and microscopy', 'Bedside', 12, 10, '**Microscopic haematuria with proteinuria** — immune complex glomerulonephritis, a classic endocarditis finding.', { flag: 'abnormal', factor: 0.95 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 118 with no conduction delay. **A new first-degree heart block would suggest an aortic root abscess** — worth repeating if the patient deteriorates.', { flag: 'normal', factor: 0.97 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, '**Two rounded peripheral opacities consistent with septic pulmonary emboli** and early pulmonary venous congestion.', { flag: 'abnormal', factor: 0.95 }),
      T('ct', 'CT chest, abdomen and pelvis with contrast', 'Imaging', 620, 80, 'Bilateral septic emboli, a 2 cm splenic infarct and no mycotic aneurysm. Genuinely useful in drug-related endocarditis, but it does not change tonight\'s antibiotics.', { flag: 'abnormal' }),
      T('viro', 'HIV, hepatitis B and C serology', 'Bloods', 200, 80, 'Hepatitis C antibody positive with a negative HIV test. Matters for the long-term plan and for the injecting history.', { flag: 'abnormal' }),
      T('trop', 'High-sensitivity troponin', 'Bloods', 60, 30, 'hs-troponin 45 ng/L — mildly raised from the valve lesion and tachycardia.', { flag: 'abnormal' })
    ],
    hints: [
      'Three sets of blood cultures from separate sites before the first antibiotic dose — then treat within the hour.',
      'The murmur, the Janeway lesions, the splinter haemorrhages and the splenomegaly are the diagnosis; the echo and the cultures are the confirmation.'
    ],
    dx: {
      label: 'Infective endocarditis (Staphylococcus aureus) with severe mitral regurgitation',
      accept: ['infective endocarditis', 'bacterial endocarditis', 'staphylococcus aureus endocarditis', 'acute infective endocarditis', 'endocarditis'],
      reject: [
        { m: ['rheumatic fever', 'acute rheumatic'], msg: 'Rheumatic fever follows a streptococcal pharyngitis in a younger patient with migratory polyarthritis and a raised antistreptolysin titre — not three weeks of rigors with a vegetation and Staph aureus in the blood.' },
        { m: ['pericarditis'], msg: 'Pericarditis causes positional chest pain with a rub and ECG changes; here there is a new murmur, splenomegaly and positive cultures.' },
        { m: ['myocarditis'], msg: 'Myocarditis causes heart failure with a normal valve and negative cultures; this patient has a flail mitral leaflet with staphylococcal bacteraemia.' },
        { m: ['septic shock'], msg: 'Sepsis is the syndrome — the source here is a mitral vegetation with Staph aureus in three sets of cultures. Find and treat the source.' },
        { m: ['myxoma'], msg: 'An atrial myxoma causes a murmur and systemic emboli but not a three-week febrile illness with positive blood cultures.' },
        { m: ['marantic', 'thrombotic endocarditis', 'non bacterial'], msg: 'Non-bacterial thrombotic endocarditis is a sterile, small, vegetation in malignancy or antiphospholipid syndrome — it does not produce Staph aureus bacteraemia.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Three weeks of fever and rigors in a person who injects drugs, with a new pansystolic murmur, Janeway lesions, splinter haemorrhages, splenomegaly, microscopic haematuria and Staph aureus in three sets of blood cultures: infective endocarditis with a flail mitral leaflet.'
    },
    differentials: ['Infective endocarditis', 'Acute rheumatic fever', 'Pericarditis', 'Myocarditis', 'Septic shock from another source', 'Atrial myxoma', 'Non-bacterial thrombotic endocarditis', 'Tuberculous pericarditis', 'Infective exacerbation of COPD', 'Lymphoma with fever of unknown origin'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'cult3', label: 'Three sets of blood cultures from separate sites before antibiotics', correct: true, msg: 'The organism and sensitivities determine whether the patient lives or needs surgery.' },
        { id: 'ivabx', label: 'Intravenous bactericidal therapy at endocarditis doses for 4-6 weeks (flucloxacillin plus gentamicin for native valve Staph aureus)', correct: true, msg: 'Short courses and oral therapy relapse.' },
        { id: 'surg2', label: 'Early cardiology and cardiac surgery involvement — urgent surgery for heart failure from valve destruction, uncontrolled infection or large mobile vegetations', correct: true, msg: 'Around half of patients with severe acute regurgitation need surgery during the admission.' },
        { id: 'sepsis2', label: 'Sepsis care: fluids, lactate monitoring, hourly urine output and oxygen', correct: true, msg: 'The immediate threat is the septic shock.' },
        { id: 'levels', label: 'Monitor renal function, gentamicin levels and repeat cultures until sterile', correct: true, msg: 'Gentamicin is nephrotoxic and the renal function is already impaired.' },
        { id: 'source', label: 'Address the source: dental and skin hygiene, injecting behaviour, and an echocardiogram to follow valve function', correct: true, msg: 'Recurrence is common without addressing the route of entry.' },
        { id: 'social', label: 'Involve addiction services and screen for blood-borne viruses', correct: true, msg: 'The injection history is not incidental — it is the mechanism.' },
        { id: 'first', label: 'Antibiotics immediately and cultures afterwards', correct: false, harm: true, msg: 'Antibiotics sterilise cultures within hours: the organism and its sensitivities are lost.' },
        { id: 'wait2', label: 'Withhold antibiotics until the echocardiogram confirms the diagnosis', correct: false, harm: true, msg: 'A septic patient with a vegetation cannot wait; the echo is arranged in parallel, not first.' },
        { id: 'nsaid2', label: 'Ibuprofen for the fever and night sweats', correct: false, harm: true, msg: 'NSAIDs mask the fever, worsen renal function and increase the risk of valve rupture and bleeding.' },
        { id: 'oral2', label: 'Oral antibiotics with outpatient follow-up', correct: false, harm: true, msg: 'Inadequate therapy for endocarditis causes valve destruction and death.' },
        { id: 'steroid', label: 'Corticosteroids for the presumed rheumatic carditis', correct: false, harm: true, msg: 'Steroids without treating the organism allow uncontrolled infection to destroy the valve.' }
      ]
    },
    debrief: {
      key: ['Three weeks of fever and rigors with 6 kg of weight loss in a person who injects drugs.', 'A new pansystolic murmur with Janeway lesions, splinter haemorrhages, conjunctival petechiae and splenomegaly.', 'Staph aureus in three sets of blood cultures and a 12 mm flail mitral vegetation with severe regurgitation.'],
      pearls: ['Three sets of cultures from separate sites before antibiotics — the single most important step in endocarditis.', 'The peripheral stigmata and the urinalysis (microscopic haematuria) may be the earliest clues.', 'Early surgical referral for heart failure from valve destruction saves lives; wait for the organism to guide antibiotics, not for the organism to decide surgery.'],
      pitfalls: ['Giving antibiotics before cultures loses the diagnosis and commits the patient to blind therapy.', 'Oral therapy and outpatient management of endocarditis lead to valve destruction and embolic events.']
    }
  });

  /* =======================================================================
     CASE 30 — Febrile neutropenia
     ======================================================================= */
  window.CASES.push({
    id: 'febrileneutropenia',
    title: 'Fever and rigors in a 54-year-old woman',
    category: 'Oncology / Infectious disease',
    difficulty: 'moderate',
    blurb: 'Two hours of fever with rigors and painful mouth ulcers.',
    timeLimitSec: 600,
    budget: 1400,
    who: 'Ms. T., 54-year-old teacher with breast cancer, day 10 after her third cycle of adjuvant chemotherapy (FEC), which included a pegfilgrastim injection. She has had a temperature at home for two hours with rigors, sore mouth ulcers and increasing lethargy. Her neutrophil count yesterday was 0.8 and her central line was inserted two months ago.',
    history: [
      'Fever 38.6 C at home with rigors and worsening malaise over six hours.',
      'Day 10 after chemotherapy — the expected nadir of the white cell count.',
      'Painful mouth ulcers and difficulty swallowing; no cough, no dysuria, no diarrhoea, no abdominal pain.',
      'Central venous access device in situ, used for the last chemotherapy cycle.',
      'No antibiotics in the last month, no recent travel, no pets, no sick contacts.'
    ],
    exam: [
      'Lethargic but orientated, GCS 15, **temperature 38.6 C**, with rigors.',
      'Pulse 122, **BP 92/56**, respiratory rate 24, SpO2 96%.',
      '**Painful oral mucositis with ulceration over the soft palate and buccal mucosa.**',
      'Chest clear, heart sounds normal, abdomen soft with mild right iliac fossa tenderness but no guarding.',
      'Central line site clean and dry without discharge or erythema. No rash, no focal neurology.'
    ],
    base: { hr: 122, sbp: 92, dbp: 56, rr: 24, spo2: 96, temp: 38.6, gcs: 15 },
    drift: { hr: 0.5, sbp: -0.75, dbp: -0.4, rr: 0.28, spo2: -0.25, temp: 0.015, gcs: -0.04 },
    decay: 0.27,
    events: [
      { at: 110, need: ['action:abx'], loss: 16, msg: 'Antibiotics have not been given. In neutropenic sepsis, mortality rises with every hour of delay — the infection can progress from fever to septic shock in the time it takes to get a chest X-ray.' },
      { at: 250, need: ['action:cultures'], loss: 8, msg: 'No cultures have been taken. The organism and sensitivities drive de-escalation, and they are lost once antibiotics are running.' },
      { at: 380, need: ['action:fluids'], loss: 10, msg: 'No fluid resuscitation despite a systolic pressure of 92 and a lactate of 3 mmol/L — this is septic shock in evolution.' }
    ],
    actions: [
      A('abx', 'IV piperacillin-tazobactam (an antipseudomonal beta-lactam) within one hour of the fever', 'Neutropenic sepsis is treated empirically and immediately.', { cost: 150, tat: 8, factor: 0.4, msg: 'Antibiotics running 35 minutes after the fever was documented — this is the intervention that decides the outcome.' }),
      A('cultures', 'Blood cultures from a peripheral vein and from the central line, plus urine, stool and throat swabs', 'You need the organism to de-escalate later.', { cost: 90, tat: 10, factor: 0.6, msg: 'Cultures taken from both lumens of the line and a peripheral vein before the first dose.' }),
      A('fluids', '0.9% saline 500 mL bolus for sepsis, repeated to a target with lactate monitoring', 'Septic shock in a neutropenic patient needs volume.', { cost: 18, tat: 8, factor: 0.7, msg: 'Fluids given with the systolic pressure rising to 106 mmHg and the lactate falling.' }),
      A('monitor', 'Continuous monitoring, urinary catheter, hourly output and a sepsis six checklist', 'Detect deterioration early.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring and hourly output charting established with a sepsis bundle completed.' }),
      A('antipyretic', 'Paracetamol for the fever — avoid NSAIDs', 'NSAIDs add bleeding and renal risk in neutropenic sepsis.', { cost: 5, tat: 5, factor: 0.95, msg: 'Temperature falling with paracetamol; no NSAIDs used.' }),
      A('barrier', 'Reverse barrier nursing, hand hygiene, and mouth care for the mucositis', 'Protects a patient with no neutrophils.', { cost: 0, tat: 8, factor: 0.9, msg: 'Single room with barrier nursing, antiseptic mouth care started.' }),
      A('gcsf', 'Give granulocyte colony-stimulating factor to correct the neutropenia', 'Not a treatment for established sepsis; it takes days to work.', { cost: 300, tat: 10, factor: 0.97, msg: 'G-CSF continued as part of the protocol, but it will not raise the neutrophil count in time to matter tonight. Antibiotics are the treatment.' }),
      A('waitcount', 'Wait for the neutrophil count before starting antibiotics', 'The count is irrelevant to the decision: fever plus chemotherapy is enough.', { cost: 0, tat: 6, factor: 1.8, harm: true, msg: 'Waiting for the count: the patient became hypotensive with a lactate of 4.6 mmol/L before antibiotics were started.' }),
      A('oral', 'Oral ciprofloxacin and review in the clinic tomorrow', 'Oral monotherapy is inadequate for neutropenic sepsis.', { cost: 40, tat: 6, factor: 1.7, harm: true, msg: 'Oral therapy, and by the next morning the patient was in septic shock with a Pseudomonas bacteraemia.' }),
      A('rectal', 'Take a rectal temperature and perform a rectal examination to look for a source', 'Mucosal injury in neutropenia causes bacteraemia.', { cost: 0, tat: 6, factor: 1.35, harm: true, msg: 'Rectal examination in a neutropenic patient with mucositis caused bleeding and a further bacteraemia.' }),
      A('nsaid', 'Ibuprofen for the fever and discomfort', 'NSAIDs mask infection and worsen renal function and bleeding.', { cost: 12, tat: 5, factor: 1.3, harm: true, msg: 'NSAIDs suppressed the fever and the creatinine rose — the infection progressed unnoticed.' }),
      A('lineout', 'Remove the central line immediately before any cultures are taken', 'Line removal is not the first move; cultures come first.', { cost: 150, tat: 12, factor: 1.2, harm: true, msg: 'The line was removed before cultures were taken: the source could never be identified and a new line had to be inserted in a coagulopathic patient.' })
    ],
    tests: [
      T('fbc', 'Full blood count with differential', 'Bloods', 45, 25, '**Neutrophils 0.3 x10^9/L (absolute neutrophil count)**, total WBC 1.1, Hb 9.8, **platelets 68 x10^9/L** — the expected nadir, and the definition of febrile neutropenia.', { flag: 'critical', factor: 0.75 }),
      T('bc', 'Blood cultures (peripheral and central line)', 'Microbiology', 120, 90, '**Gram-negative bacilli grown from the central line sample at 16 hours, later identified as Pseudomonas aeruginosa.** Taken before the first dose, so the sensitivities are available.', { flag: 'critical', factor: 0.7 }),
      T('abg', 'Arterial blood gas and lactate', 'Bloods', 95, 20, 'pH 7.36, pO2 88 mmHg, HCO3 21, **lactate 3.0 mmol/L** — sepsis with impaired perfusion, before overt hypotension.', { flag: 'critical', factor: 0.82 }),
      T('crp', 'CRP', 'Bloods', 50, 35, '**180 mg/L.** Useful for tracking the response, but a normal CRP does not exclude neutropenic sepsis — and the initial value is never a reason to delay antibiotics.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 48 mg/dL, creatinine 1.3 mg/dL, Na 132, K 3.6 — early acute kidney injury from sepsis.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 40, 'ALT 60, bilirubin 1.2 mg/dL, albumin 30 g/L — mild derangement in sepsis, and important baseline before prolonged antibiotics.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields with no consolidation or effusion. In neutropenia, chest imaging is frequently normal even with pneumonia because there are no neutrophils to form an infiltrate.', { flag: 'normal', factor: 0.95 }),
      T('urine', 'Urine dipstick, microscopy and culture', 'Microbiology', 90, 60, 'No nitrites or leucocytes (there are no neutrophils to produce them) and no growth at 48 hours.', { flag: 'normal' }),
      T('coag', 'Coagulation screen and fibrinogen', 'Bloods', 90, 40, 'INR 1.3, APTT 38 s, fibrinogen 2.6 g/L, platelets 68. Thrombocytopenia is expected after chemotherapy and after sepsis.', { flag: 'abnormal' }),
      T('ct', 'CT chest, abdomen and pelvis', 'Imaging', 620, 80, 'No focus identified; mild colonic wall thickening. A CT is reasonable if the fever persists beyond 48-72 hours, but it must never delay the first dose of antibiotics.', { flag: 'abnormal' }),
      T('line', 'Central line culture and differential time to positivity', 'Microbiology', 120, 120, 'Growth from the line sample 2 hours before the peripheral sample — consistent with a line-associated infection and guiding the decision to remove the device.', { flag: 'abnormal', factor: 0.9 }),
      T('viral', 'Respiratory viral PCR panel', 'Microbiology', 250, 90, 'Negative for influenza, RSV, SARS-CoV-2 and adenovirus. Useful information, particularly before de-escalating antibiotics.', { flag: 'normal' }),
      T('glucose2', 'Capillary glucose', 'Bedside', 15, 8, '7.4 mmol/L — normal. Steroid premedication and sepsis both affect glucose, so it should be monitored.', { flag: 'normal' })
    ],
    hints: [
      'Fever after chemotherapy is neutropenic sepsis until proven otherwise: cultures and an antipseudomonal beta-lactam within one hour, without waiting for the count.',
      'In neutropenia the usual signs are missing — no pus, no infiltrate, no leucocytes in the urine. Treat the fever, not the findings.'
    ],
    dx: {
      label: 'Febrile neutropenia (neutropenic sepsis with Pseudomonas aeruginosa)',
      accept: ['febrile neutropenia', 'neutropenic sepsis', 'neutropenic fever', 'febrile neutropenic sepsis'],
      reject: [
        { m: ['tumour lysis', 'tumor lysis'], msg: 'Tumour lysis syndrome causes hyperkalaemia, hyperphosphataemia, hyperuricaemia and renal failure after bulky, chemosensitive disease — not fever with a central line and Pseudomonas in the blood.' },
        { m: ['graft versus host', 'graft-versus-host'], msg: 'Graft-versus-host disease follows stem cell transplantation and causes a rash, diarrhoea and liver dysfunction rather than this presentation.' },
        { m: ['transfusion reaction'], msg: 'There has been no transfusion; the fever preceded any blood product and the cultures grew Pseudomonas.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Day 10 after chemotherapy with a temperature of 38.6 C and an absolute neutrophil count of 0.3: febrile neutropenia, which is treated as sepsis with cultures and an antipseudomonal beta-lactam within one hour.'
    },
    differentials: ['Febrile neutropenia', 'Tumour lysis syndrome', 'Graft-versus-host disease', 'Transfusion reaction', 'Viral upper respiratory infection', 'Urinary tract infection', 'Clostridioides difficile colitis', 'Acute leukaemia relapse', 'Drug fever', 'Deep vein thrombosis with fever'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'betal', label: 'IV antipseudomonal beta-lactam (piperacillin-tazobactam, cefepime or meropenem) within one hour', correct: true, msg: 'Empirical, broad and immediate — this is the treatment.' },
        { id: 'cult4', label: 'Blood cultures from the periphery and every lumen of the central line, plus urine, stool and throat swabs', correct: true, msg: 'Essential for de-escalation, and taken alongside rather than before antibiotics.' },
        { id: 'sepsis3', label: 'Sepsis bundle: fluids, lactate, hourly urine output and oxygen as needed', correct: true, msg: 'The mortality is driven by unrecognised shock.' },
        { id: 'add', label: 'Add vancomycin or an aminoglycoside if there is line sepsis, hypotension or a resistant organism suspected', correct: true, msg: 'Escalation is guided by the clinical picture while cultures are pending.' },
        { id: 'line2', label: 'Remove the central line if it is suspected as the source, once cultures have been taken', correct: true, msg: 'Removal is often required for Pseudomonas or Staph aureus line infection.' },
        { id: 'review', label: 'Review daily with an antimicrobial stewardship plan, and stop the G-CSF debate — it is not a treatment for sepsis', correct: true, msg: 'De-escalate on sensitivities, usually at 48-72 hours.' },
        { id: 'mucosa', label: 'Mouth care, barrier nursing and paracetamol (not NSAIDs)', correct: true, msg: 'Protects the patient without masking the infection.' },
        { id: 'wait3', label: 'Wait for the neutrophil count before starting antibiotics', correct: false, harm: true, msg: 'The count never delays treatment: fever after chemotherapy is enough.' },
        { id: 'po', label: 'Oral ciprofloxacin with outpatient review', correct: false, harm: true, msg: 'Oral monotherapy is inadequate and Pseudomonas is commonly resistant.' },
        { id: 'pr', label: 'Rectal temperature and rectal examination to look for a source', correct: false, harm: true, msg: 'Mucosal injury in a neutropenic patient causes bacteraemia.' },
        { id: 'nsaid3', label: 'Ibuprofen for the fever and bone pain', correct: false, harm: true, msg: 'NSAIDs mask infection, worsen renal function and increase bleeding.' },
        { id: 'linefirst', label: 'Remove the central line before taking any cultures', correct: false, harm: true, msg: 'You lose the chance to identify the organism and the sensitivities.' }
      ]
    },
    debrief: {
      key: ['Day 10 after chemotherapy — the expected neutrophil nadir — with fever, rigors and oral mucositis.', 'Temperature 38.6 C, BP 92/56, pulse 122, lactate 3.0 and an absolute neutrophil count of 0.3.', 'Gram-negative bacilli from the central line culture, later Pseudomonas aeruginosa.'],
      pearls: ['Fever after chemotherapy is neutropenic sepsis: cultures and an antipseudomonal beta-lactam within one hour, every time.', 'Neutropenia removes the signs you rely on — no pus, no infiltrate, no leucocytes in the urine. Treat the fever.', 'The central line is a common source; cultures from the line and the periphery guide both the antibiotic and the decision to remove it.'],
      pitfalls: ['Waiting for the neutrophil count or the CRP before treating is the commonest fatal delay.', 'Rectal examination and NSAIDs are both harmful in a neutropenic patient.']
    }
  });

  /* =======================================================================
     CASE 31 — Severe falciparum malaria
     ======================================================================= */
  window.CASES.push({
    id: 'malaria',
    title: 'Fever and drowsiness in a 29-year-old man',
    category: 'Tropical medicine',
    difficulty: 'moderate',
    blurb: 'Four days of rigors, now drowsy and jaundiced.',
    timeLimitSec: 600,
    budget: 1300,
    who: 'Mr. S., 29-year-old man who returned six days ago from a three-week visit to family in Nigeria. He took no antimalarial prophylaxis. Four days of fever with rigors, headache and vomiting; he has become drowsy and confused since this morning, and his wife says his eyes are yellow.',
    history: [
      'Four days of fever up to 40 C with rigors, drenching sweats, headache and myalgia.',
      'Two days of vomiting with poor oral intake, and dark urine today.',
      'Increasing drowsiness and confusion since the morning; no seizure witnessed.',
      'No antimalarial prophylaxis; no insecticide-treated net; mosquito bites noted throughout the trip.',
      'No rash, no diarrhoea, no dysuria, no cough, no previous malaria and no other medication.'
    ],
    exam: [
      'Drowsy and disorientated, GCS 12, unable to give a coherent history, with **scleral icterus** and pale conjunctivae.',
      '**Temperature 39.4 C**, pulse 124, **BP 96/58**, respiratory rate 26, SpO2 94%.',
      '**Hepatosplenomegaly with a tender liver edge** and dark urine in the catheter bag. No rash, no eschar, no lymphadenopathy.',
      'No neck stiffness, no photophobia, no focal neurology, fundi normal with no retinal haemorrhages.',
      'Capillary glucose 2.4 mmol/L. Cool peripheries with a capillary refill of 4 seconds.'
    ],
    base: { hr: 124, sbp: 96, dbp: 58, rr: 26, spo2: 94, temp: 39.4, gcs: 12 },
    drift: { hr: 0.5, sbp: -0.72, dbp: -0.38, rr: 0.3, spo2: -0.3, temp: 0.015, gcs: -0.06 },
    decay: 0.28,
    events: [
      { at: 120, need: ['action:artesunate'], loss: 16, msg: 'Parenteral artesunate has not been given. Severe malaria kills within hours, and oral therapy cannot be absorbed by a vomiting, drowsy patient.' },
      { at: 250, need: ['action:dextrose'], loss: 12, msg: 'The hypoglycaemia has not been corrected. Hypoglycaemia in severe malaria is common, easily missed and adds to the coma.' },
      { at: 380, need: ['action:monitor'], loss: 8, msg: 'No hourly glucose and urine output monitoring. Both hypoglycaemia and pulmonary oedema from over-resuscitation are avoidable causes of death.' }
    ],
    actions: [
      A('artesunate', 'IV artesunate 2.4 mg/kg at 0, 12 and 24 hours, then daily', 'The treatment of choice for severe malaria — it reduces mortality compared with quinine.', { cost: 220, tat: 10, factor: 0.4, msg: 'Artesunate given within 40 minutes. Parasite clearance has begun; the fever is already settling.' }),
      A('dextrose', 'Check glucose immediately and give 10% dextrose for hypoglycaemia, then monitor hourly', 'Hypoglycaemia is common, dangerous and invisible.', { cost: 20, tat: 5, factor: 0.55, msg: '10% dextrose given: glucose corrected from 2.4 to 6.8 mmol/L and the conscious level is improving.' }),
      A('fluids', 'Careful IV crystalloid — correct the deficit without flooding the lungs', 'Both hypovolaemia and pulmonary oedema kill in severe malaria.', { cost: 20, tat: 8, factor: 0.75, msg: 'Modest fluid resuscitation with a rise in blood pressure and no respiratory deterioration.' }),
      A('monitor', 'Hourly glucose, urine output, parasitaemia and neurological observations', 'The complications are predictable and preventable.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring established with a clear plan for repeat films and glucose checks.' }),
      A('benzo', 'IV benzodiazepine for seizures if they occur, with airway support', 'Seizures are common in cerebral malaria.', { cost: 15, tat: 6, factor: 0.9, msg: 'Airway protected and an anticonvulsant plan documented.' }),
      A('icu', 'Refer to critical care for cerebral malaria with a GCS of 12 and a lactate of 5', 'Severe malaria needs level 2 or 3 care.', { cost: 0, tat: 10, factor: 0.7, msg: 'Intensive care accepting the patient with a plan for dialysis if the renal function deteriorates further.' }),
      A('oral', 'Oral artemether-lumefantrine and outpatient review', 'A vomiting, drowsy patient cannot absorb oral therapy.', { cost: 60, tat: 6, factor: 1.8, harm: true, msg: 'Oral therapy was vomited back within minutes; the parasitaemia rose and the patient became more obtunded.' }),
      A('steroid', 'IV dexamethasone for cerebral malaria', 'Steroids increase complications and prolong coma.', { cost: 25, tat: 6, factor: 1.4, harm: true, msg: 'Steroid given for cerebral malaria: no benefit, and more gastrointestinal bleeding and prolonged coma.' }),
      A('flood', 'Aggressive 30 mL/kg fluid bolus', 'Fluid overload causes pulmonary oedema in severe malaria.', { cost: 30, tat: 10, factor: 1.3, harm: true, msg: 'After the large bolus the saturations fell to 86% with new bilateral crackles — pulmonary oedema in a patient with increased capillary permeability.' }),
      A('waitfilm', 'Wait for the malaria film result before starting treatment in a comatose patient', 'A febrile comatose patient from an endemic area is treated immediately.', { cost: 0, tat: 6, factor: 1.5, harm: true, msg: 'Treatment delayed for the laboratory: the parasitaemia rose and the GCS fell to 10.' })
    ],
    tests: [
      T('film', 'Thick and thin blood films (repeated) with parasite count', 'Microbiology', 40, 40, '**Plasmodium falciparum, 8% parasitaemia with schizonts and pigment in neutrophils.** Severe malaria is defined by a parasitaemia above 2% plus any organ dysfunction.', { flag: 'critical', factor: 0.7 }),
      T('antigen', 'Rapid malaria antigen test', 'Microbiology', 60, 20, '**Positive for P. falciparum** within 15 minutes. A rapid test is what allows treatment to start before the films are reported.', { flag: 'critical', factor: 0.72 }),
      T('glucose', 'Capillary and laboratory glucose', 'Bedside', 10, 6, '**2.4 mmol/L (43 mg/dL)** — hypoglycaemia, from parasite glucose consumption, impaired gluconeogenesis and quinine if it were used.', { flag: 'critical', factor: 0.7 }),
      T('abg', 'Arterial blood gas and lactate', 'Bloods', 95, 20, 'pH 7.24, pO2 84 mmHg, HCO3 15, **lactate 5.1 mmol/L** — a lactic acidosis, one of the defining features of severe malaria.', { flag: 'critical', factor: 0.8 }),
      T('fbc', 'Full blood count', 'Bloods', 45, 25, '**Hb 7.8 g/dL with thrombocytopenia of 62 x10^9/L**, WBC 8.4 — anaemia and thrombocytopenia are typical and do not require transfusion or platelets on their own.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 78 mg/dL, **creatinine 2.1 mg/dL**, Na 128, K 4.2, bicarbonate 15 — acute kidney injury, another marker of severity.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 40, '**Bilirubin 4.2 mg/dL** with ALT 90 and an albumin of 28 g/L — jaundice is a severity criterion.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen and fibrinogen', 'Bloods', 90, 40, 'INR 1.4, APTT 42 s, fibrinogen 1.6 g/L with a raised D-dimer — early disseminated intravascular coagulation.', { flag: 'abnormal' }),
      T('lp', 'Lumbar puncture and CSF analysis', 'Bedside', 180, 60, 'Clear CSF, opening pressure normal, 3 cells/mm3, protein 40 mg/dL, glucose 4.0 mmol/L, Gram stain and culture negative, and a negative meningococcal PCR. **Bacterial meningitis is excluded — the coma is cerebral malaria.**', { flag: 'normal', factor: 0.9 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields with a normal heart size. A baseline before fluid resuscitation and a useful check if the saturations fall.', { flag: 'normal', factor: 0.95 }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. Typhoid and other bacteraemias can present with fever and splenomegaly in a returning traveller, so it is a reasonable test alongside antimalarials.', { flag: 'normal' }),
      T('dip', 'Urine dipstick and microscopy', 'Bedside', 12, 8, '**Haemoglobinuria with proteinuria** and no nitrites — blackwater fever from massive intravascular haemolysis.', { flag: 'abnormal', factor: 0.95 }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 80, 'Normal. No cerebral oedema, no haemorrhage, no mass. The coma is metabolic and parasitic, not structural.', { flag: 'normal' })
    ],
    hints: [
      'Fever in a returning traveller with drowsiness is severe malaria until proven otherwise: parenteral artesunate immediately, and check the glucose.',
      'Hypoglycaemia and pulmonary oedema from over-resuscitation are the two avoidable killers in severe malaria.'
    ],
    dx: {
      label: 'Severe falciparum malaria with cerebral involvement and hypoglycaemia',
      accept: ['severe falciparum malaria', 'falciparum malaria', 'severe malaria', 'cerebral malaria', 'malaria with cerebral involvement', 'plasmodium falciparum malaria'],
      reject: [
        { m: ['vivax'], msg: 'The film shows P. falciparum with 8% parasitaemia and schizonts. Vivax rarely causes coma, lactic acidosis or this degree of severity, and it requires different radical treatment.' },
        { m: ['dengue'], msg: 'Dengue causes haemoconcentration with a falling platelet count and plasma leakage; here the films are positive for falciparum malaria with a lactate of 5.1.' },
        { m: ['typhoid', 'enteric fever'], msg: 'Typhoid is a stepwise illness with relative bradycardia and rose spots; the malaria films are positive and there is a lactic acidosis.' },
        { m: ['meningitis', 'meningoencephalitis'], msg: 'The CSF is acellular with normal protein and glucose — bacterial meningitis is excluded, and the coma is cerebral malaria.' },
        { m: ['encephalitis'], msg: 'Viral encephalitis does not cause a parasitaemia of 8% with a lactate of 5.1, and the CSF is bland.' },
        { m: ['leptospirosis'], msg: 'Leptospirosis gives conjunctival suffusion, myalgia and renal failure, but the malaria films are positive here.' },
        { m: ['influenza', 'viral illness'], msg: 'A returning traveller from an endemic area with fever and jaundice has malaria until the films say otherwise — and these films are positive.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A returning traveller with no prophylaxis, four days of rigors, jaundice, a GCS of 12, glucose of 2.4 mmol/L, lactate of 5.1, creatinine of 2.1 and a parasitaemia of 8% with schizonts: severe falciparum malaria with cerebral involvement.'
    },
    differentials: ['Severe falciparum malaria', 'Dengue with shock', 'Typhoid fever', 'Bacterial meningitis', 'Viral encephalitis', 'Leptospirosis', 'Plasmodium vivax malaria', 'Rickettsial infection', 'Hepatitis A with acute liver failure', 'Heat stroke'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'art', label: 'IV artesunate 2.4 mg/kg at 0, 12 and 24 hours, then daily until oral therapy can be taken', correct: true, msg: 'Superior to quinine for severe malaria, with fewer hypoglycaemic and cardiac complications.' },
        { id: 'glu', label: 'Check and correct hypoglycaemia, then monitor glucose hourly', correct: true, msg: 'Hypoglycaemia is common, easily missed and worsens the coma.' },
        { id: 'vol2', label: 'Careful, monitored fluid resuscitation with strict attention to the lungs', correct: true, msg: 'Correct the deficit without causing pulmonary oedema.' },
        { id: 'mon2', label: 'Hourly glucose, urine output, neurological observations and serial parasitaemia', correct: true, msg: 'Parasite clearance and renal function guide the duration of therapy.' },
        { id: 'renal', label: 'Manage the acute kidney injury and consider dialysis for refractory acidosis or renal failure', correct: true, msg: 'Renal replacement is often needed and is a marker of severity.' },
        { id: 'seiz', label: 'Treat seizures promptly with benzodiazepines and protect the airway', correct: true, msg: 'Seizures are common in cerebral malaria.' },
        { id: 'notify', label: 'Notify public health and give travel advice about prophylaxis for future trips', correct: true, msg: 'Malaria is notifiable, and prevention is the real lesson.' },
        { id: 'oral2', label: 'Oral artemether-lumefantrine and outpatient follow-up', correct: false, harm: true, msg: 'A vomiting, drowsy patient cannot absorb oral therapy and the parasitaemia will climb.' },
        { id: 'ster2', label: 'IV dexamethasone for cerebral malaria', correct: false, harm: true, msg: 'Steroids prolong coma and increase gastrointestinal bleeding and infection in cerebral malaria.' },
        { id: 'bolus30', label: 'Aggressive 30 mL/kg fluid bolus', correct: false, harm: true, msg: 'Aggressive boluses increase pulmonary oedema and mortality in severe malaria.' },
        { id: 'wait2', label: 'Wait for the laboratory films before treating a comatose patient', correct: false, harm: true, msg: 'Treat immediately: severe malaria kills within hours and the rapid antigen test takes fifteen minutes.' },
        { id: 'exchange', label: 'Exchange transfusion as the primary treatment', correct: false, harm: true, msg: 'No longer recommended; artesunate is the treatment and exchange transfusion adds risk without proven benefit.' }
      ]
    },
    debrief: {
      key: ['Returned from Nigeria six days ago without prophylaxis, with four days of rigors and new drowsiness.', 'GCS 12 with jaundice, hepatosplenomegaly, glucose 2.4 mmol/L, lactate 5.1 and creatinine 2.1.', 'P. falciparum at 8% parasitaemia with schizonts, and a bland CSF excluding meningitis.'],
      pearls: ['Any fever in a returning traveller is malaria until the films say otherwise — and severe malaria is treated with parenteral artesunate, not oral tablets.', 'Check the glucose in every drowsy patient with malaria: hypoglycaemia is common and reversible in seconds.', 'Both hypovolaemia and fluid overload kill: resuscitate to a target and watch the lungs.'],
      pitfalls: ['Steroids in cerebral malaria prolong coma and cause complications.', 'Waiting for the film result before treating a comatose patient from an endemic area costs lives.']
    }
  });

})();
