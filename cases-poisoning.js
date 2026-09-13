/* =========================================================================
   DocSim — case library (part 10): poisons, venoms and withdrawal
   A krait, a bottle of aspirin, and a man who stopped drinking three days ago.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 32 — Neurotoxic snake envenomation
     ======================================================================= */
  window.CASES.push({
    id: 'snakebite',
    title: 'Drooping eyelids and slurred swallowing two hours after a bite',
    category: 'Toxicology / Tropical medicine',
    difficulty: 'moderate',
    blurb: 'Bitten on the ankle while harvesting; the wound looks trivial but he cannot keep his eyes open.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Mr. R., 31-year-old rice farmer bitten on the right ankle two hours ago while working in the paddy field. He killed the snake and brought it in a cloth bag. He now has drooping eyelids, double vision and difficulty swallowing his own saliva, and his voice has become nasal.',
    history: [
      'Bite to the right ankle two hours ago; the snake was killed and brought to hospital.',
      'Progressive drooping of the eyelids and double vision over the last hour.',
      'Difficulty swallowing saliva, nasal speech and weakness of the neck.',
      'No bleeding from the wound, gums or nose; no vomiting, no abdominal pain, no dark urine.',
      'No previous medical problems, no medication, no alcohol, no other bites or stings.'
    ],
    exam: [
      'Alert and fully orientated, **GCS 15**, but with **bilateral ptosis, external ophthalmoplegia and a nasal voice**.',
      'Pulse 104, BP 122/76, **respiratory rate 22 and shallow with paradoxical abdominal breathing and a weak cough**, SpO2 92%, temperature 36.9 C.',
      '**Pupils equal and reactive (3 mm).** No sweating, no salivation beyond the bulbar pooling, no bronchorrhoea, no diarrhoea.',
      '**Two faint fang marks on the right ankle with minimal local swelling, no bruising and no blistering.**',
      'Neck flexion and proximal limb power reduced; distal pulses and sensation intact. No bleeding from puncture sites.'
    ],
    base: { hr: 104, sbp: 122, dbp: 76, rr: 22, spo2: 92, temp: 36.9, gcs: 15 },
    drift: { hr: 0.35, sbp: -0.4, dbp: -0.25, rr: 0.32, spo2: -0.45, temp: 0.004, gcs: -0.05 },
    decay: 0.3,
    events: [
      { at: 110, need: ['action:antivenom'], loss: 16, msg: 'Antivenom has not been given. The ptosis and bulbar weakness are progressing and the vital capacity is falling — neurotoxic envenomation is a race against respiratory arrest.' },
      { at: 240, need: ['action:airway'], loss: 14, msg: 'No airway or ventilation plan. The patient cannot clear his own secretions and the saturations are falling.' },
      { at: 370, need: ['test:fvc'], loss: 10, msg: 'No vital capacity measurement. Single breath counting and vital capacity are the bedside measures that predict respiratory failure before it happens.' }
    ],
    actions: [
      A('antivenom', 'Polyvalent snake antivenom — 10 vials intravenously, with adrenaline and hydrocortisone drawn up for the reaction risk', 'The only treatment that halts neurotoxicity.', { cost: 500, tat: 12, factor: 0.35, msg: 'Antivenom infused over an hour with no reaction. The ptosis has stabilised and the vital capacity is improving.' }),
      A('airway', 'Airway protection with suction and early ventilation for bulbar and respiratory weakness', 'Aspiration and respiratory arrest are how these patients die.', { cost: 150, tat: 10, factor: 0.5, msg: 'Airway protected, secretions suctioned and non-invasive ventilation started with the anaesthetist on standby for intubation.' }),
      A('neostigmine', 'Neostigmine 2.5 mg with atropine 0.6 mg (for cobra-type postsynaptic neurotoxicity)', 'Worth a trial in cobra bites; less effective in krait envenomation.', { cost: 120, tat: 10, factor: 0.7, msg: 'After neostigmine the ptosis partially improved and neck power increased — consistent with a postsynaptic component.' }),
      A('immobilise', 'Immobilise the bitten limb at heart level and remove rings, bands and tight clothing', 'Reduces venom spread without cutting off circulation.', { cost: 0, tat: 5, factor: 0.85, msg: 'Limb immobilised and constricting items removed.' }),
      A('access', 'IV access, continuous monitoring, oxygen and a neurological observation chart', 'Envenomation evolves over hours.', { cost: 20, tat: 8, factor: 0.85, msg: 'Access and monitoring established with serial neurological observations documented.' }),
      A('icu', 'Refer to intensive care and repeat the antivenom if progression continues', 'Around one in five patients needs a second dose.', { cost: 0, tat: 10, factor: 0.7, msg: 'Intensive care accepting the patient with a plan for repeat dosing and ventilation.' }),
      A('tourniquet', 'Apply a tight tourniquet, incise the wound and suck out the venom', 'Traditional first aid that causes necrosis and bleeding.', { cost: 10, tat: 8, factor: 1.5, harm: true, msg: 'The tight tourniquet caused ischaemic damage to the foot, and the incision bled while removing none of the venom.' }),
      A('ice', 'Apply ice and elevate the limb', 'Ice worsens local tissue injury without slowing absorption.', { cost: 10, tat: 5, factor: 1.4, harm: true, msg: 'Ice caused further local tissue damage and the neurotoxicity progressed regardless.' }),
      A('wait', 'Wait for swelling, bleeding or a coagulopathy before giving antivenom', 'Neurotoxic bites may show almost no local signs.', { cost: 0, tat: 6, factor: 1.5, harm: true, msg: 'Waiting for local signs: the patient developed respiratory failure with a vital capacity of 10 mL/kg before antivenom was given.' }),
      A('im', 'Give the antivenom intramuscularly to save time', 'Intramuscular antivenom is poorly absorbed and slower than an infusion.', { cost: 300, tat: 12, factor: 1.2, harm: true, msg: 'Intramuscular antivenom was absorbed slowly and incompletely; the neurotoxicity progressed while waiting for it to work.' }),
      A('steroid', 'IV hydrocortisone and an antihistamine instead of antivenom', 'Steroids do not neutralise venom.', { cost: 25, tat: 6, factor: 1.3, harm: true, msg: 'Steroid and antihistamine given without antivenom: the bulbar weakness progressed to respiratory failure.' })
    ],
    tests: [
      T('wbct', '20-minute whole blood clotting test', 'Bedside', 60, 20, '**The blood clots normally at 20 minutes (a solid clot that does not dissolve).** This is a neurotoxic elapid bite, not a vasculotoxic viper bite — and the clotting test takes twenty minutes at the bedside.', { flag: 'critical', factor: 0.72 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.30, **pCO2 58 mmHg**, pO2 62 mmHg, HCO3 26 — **type 2 respiratory failure from neuromuscular weakness**, not from airway obstruction.', { flag: 'critical', factor: 0.75 }),
      T('fvc', 'Vital capacity and single-breath count', 'Bedside', 50, 10, '**Vital capacity 12 mL/kg (normal above 20) and a single-breath count of 9.** A falling vital capacity predicts respiratory failure before the saturations fall — measure it hourly.', { flag: 'critical', factor: 0.7 }),
      T('coag', 'Coagulation screen and fibrinogen', 'Bloods', 90, 40, 'INR 1.0, APTT 30 s, fibrinogen 3.1 g/L, platelets 220 — **normal clotting**, consistent with the normal whole blood clotting test.', { flag: 'normal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 14.2, WBC 11.6, platelets 220. No leucocytosis beyond the stress response and no evidence of haemorrhage.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine, electrolytes and creatine kinase', 'Bloods', 130, 40, 'Urea 32 mg/dL, creatinine 1.0 mg/dL, Na 138, K 4.0, **CK 400 U/L** — mild myotoxicity, seen with some elapid venoms.', { flag: 'abnormal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 104 with a normal axis and no ischaemic change. No hyperkalaemic pattern, which would suggest rhabdomyolysis.', { flag: 'normal' }),
      T('dip', 'Urine dipstick and microscopy', 'Bedside', 12, 8, 'No blood and no protein — no haemoglobinuria or myoglobinuria.', { flag: 'normal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields with no consolidation. **Excludes aspiration so far**, and there is no evidence of pulmonary oedema.', { flag: 'normal', factor: 0.95 }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. The wound is minimally contaminated and there is no systemic infection.', { flag: 'normal' }),
      T('film', 'Blood film and platelet count for haemolysis', 'Bloods', 80, 50, 'No schistocytes and no haemolysis. Some elapid venoms are haemolytic, so a baseline film is reasonable.', { flag: 'normal' })
    ],
    hints: [
      'Ptosis, ophthalmoplegia, bulbar weakness and a normal clotting test point to a neurotoxic elapid: antivenom plus a respiratory plan.',
      'Vital capacity and single-breath counting are the bedside tests that predict respiratory failure before the oxygen saturation does.'
    ],
    dx: {
      label: 'Neurotoxic snake envenomation (elapid) with bulbar and respiratory paralysis',
      accept: ['snake envenomation', 'neurotoxic snake bite', 'snake bite', 'elapid envenomation', 'snake bite with neurotoxicity', 'krait bite', 'cobra bite'],
      reject: [
        { m: ['viper', 'vasculotoxic'], msg: 'A viper bite is vasculotoxic: it causes coagulopathy, bleeding, swelling and necrosis, with a non-clotting 20-minute whole blood clotting test. Here the clotting test is normal and the problem is descending paralysis.' },
        { m: ['organophosphate', 'cholinergic'], msg: 'Organophosphate poisoning also causes ptosis and weakness — but with miosis, bronchorrhoea, sweating and diarrhoea. Here the pupils are 3 mm and reactive, the chest is dry and there is a documented bite.' },
        { m: ['guillain'], msg: 'Guillain-Barre syndrome is an ascending, symmetrical paralysis over days or weeks with absent reflexes and albuminocytological dissociation in the CSF — this is a descending paralysis hours after a bite.' },
        { m: ['myasthenia', 'myasthenic'], msg: 'Myasthenia is a fluctuating fatigable weakness without a bite history, and it does not progress over two hours with bulbar failure and a normal clotting test.' },
        { m: ['botulism'], msg: 'Botulism is a descending paralysis from contaminated food, with no bite mark, no local signs and no response to antivenom.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A witnessed bite with fang marks, ptosis, external ophthalmoplegia, nasal speech, bulbar weakness and type 2 respiratory failure, with a normal 20-minute whole blood clotting test: neurotoxic elapid envenomation requiring antivenom and ventilatory support.'
    },
    differentials: ['Neurotoxic snake envenomation', 'Vasculotoxic (viper) envenomation', 'Organophosphate poisoning', 'Guillain-Barre syndrome', 'Myasthenic crisis', 'Botulism', 'Brainstem stroke', 'Hypokalaemic periodic paralysis', 'Rabies', 'Tetanus'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'av', label: 'Intravenous polyvalent antivenom as soon as neurotoxicity is present, with adrenaline ready for anaphylaxis', correct: true, msg: 'Antivenom is the only treatment that halts the neurotoxicity.' },
        { id: 'vent', label: 'Airway protection, suction and early ventilatory support for bulbar and respiratory weakness', correct: true, msg: 'Aspiration and respiratory arrest are the causes of death.' },
        { id: 'vitals', label: 'Hourly vital capacity, single-breath count and neurological observations', correct: true, msg: 'Detects respiratory failure before the saturation falls.' },
        { id: 'repeat', label: 'Repeat the antivenom if neurotoxicity progresses, and involve intensive care', correct: true, msg: 'Around one in five patients needs a second dose.' },
        { id: 'firstaid', label: 'Immobilise the limb at heart level, remove constricting items, and do not cut or suck the wound', correct: true, msg: 'The correct first aid: nothing that causes local injury.' },
        { id: 'tetanus', label: 'Tetanus prophylaxis, wound care and antibiotics for the bite wound', correct: true, msg: 'Routine wound care after the antivenom has been started.' },
        { id: 'tourn', label: 'A tight tourniquet, incision and suction', correct: false, harm: true, msg: 'Causes ischaemic necrosis and bleeding without removing venom.' },
        { id: 'ice2', label: 'Ice packs and elevation of the limb', correct: false, harm: true, msg: 'Worsens local tissue injury and delays antivenom.' },
        { id: 'wait2', label: 'Wait for swelling or coagulopathy before giving antivenom', correct: false, harm: true, msg: 'Neurotoxic bites can be almost silent locally while the patient stops breathing.' },
        { id: 'im2', label: 'Intramuscular antivenom to save time', correct: false, harm: true, msg: 'Slow, incomplete absorption — the neurotoxicity progresses while you wait.' },
        { id: 'ster', label: 'Corticosteroids and antihistamines instead of antivenom', correct: false, harm: true, msg: 'They do not neutralise venom and delay the only effective treatment.' },
        { id: 'observe2', label: 'Observe for six hours and discharge if the clotting test remains normal', correct: false, harm: true, msg: 'Neurotoxic envenomation can progress for 12-24 hours; the vital capacity is already falling.' }
      ]
    },
    debrief: {
      key: ['Witnessed bite with fang marks, then ptosis, ophthalmoplegia, nasal speech and difficulty swallowing saliva.', 'Shallow breathing with paradoxical abdominal movement, SpO2 92% and a vital capacity of 12 mL/kg.', 'A normal 20-minute whole blood clotting test, a normal coagulation screen, and type 2 respiratory failure on the gas.'],
      pearls: ['The 20-minute whole blood clotting test is the bedside test that separates vasculotoxic from neurotoxic envenomation.', 'Vital capacity and single-breath counting detect respiratory failure before the saturation falls — measure them hourly.', 'Antivenom is the treatment; every traditional first-aid measure (tourniquet, incision, suction, ice) causes harm.'],
      pitfalls: ['Waiting for swelling or bleeding before giving antivenom is fatal in neurotoxic bites, which may leave almost no local signs.', 'Intramuscular antivenom is absorbed too slowly to help a patient who is already developing bulbar weakness.']
    }
  });

  /* =======================================================================
     CASE 33 — Salicylate poisoning
     ======================================================================= */
  window.CASES.push({
    id: 'salicylate',
    title: 'Breathing fast, ringing in the ears and vomiting after an overdose',
    category: 'Toxicology',
    difficulty: 'hard',
    blurb: 'Six hours after taking sixty aspirin tablets: tachypnoeic, sweaty, confused and profoundly acidotic underneath.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Ms. E., 22-year-old student brought in by her flatmate six hours after taking about sixty 500 mg aspirin tablets (30 g) in a deliberate overdose, together with some alcohol. She has vomited repeatedly and is now breathing deeply and rapidly, sweating and confused, complaining of ringing in her ears.',
    history: [
      'Ingestion of approximately 30 g of aspirin six hours ago, with alcohol.',
      'Persistent vomiting, epigastric pain, tinnitus and sweating.',
      'Increasing drowsiness and confusion over the last two hours.',
      'No other medication at the scene apart from an empty aspirin packet; no paracetamol packets found.',
      'No previous overdose, no psychiatric history known to the flatmate, no other medical problems.'
    ],
    exam: [
      'Drowsy and confused, GCS 13, **breathing deeply and rapidly with a respiratory rate of 30**.',
      'Pulse 118, BP 108/62, SpO2 97% on room air, **temperature 37.6 C**, sweating profusely.',
      '**Tinnitus reported on direct questioning**, hyperventilation, and mild epigastric tenderness with no guarding.',
      'Warm peripheries, capillary refill 3 seconds. **Capillary glucose 3.1 mmol/L.**',
      'No focal neurology, no rash, no needle marks, no smell of alcohol on the breath.'
    ],
    base: { hr: 118, sbp: 108, dbp: 62, rr: 30, spo2: 97, temp: 37.6, gcs: 13 },
    drift: { hr: 0.4, sbp: -0.5, dbp: -0.3, rr: 0.35, spo2: -0.25, temp: 0.01, gcs: -0.055 },
    decay: 0.27,
    events: [
      { at: 120, need: ['action:alkali'], loss: 14, msg: 'Urinary alkalinisation has not been started. Salicylate is cleared far faster in alkaline urine, and this patient has a level and a clinical picture that will only worsen without it.' },
      { at: 260, need: ['action:dialysis'], loss: 14, msg: 'No dialysis has been arranged. With a salicylate level of 850 mg/L, a metabolic acidosis and central nervous system features, haemodialysis is indicated.' },
      { at: 390, need: ['action:potassium'], loss: 8, msg: 'The hypokalaemia has not been corrected. Hypokalaemia causes paradoxical aciduria and prevents urinary alkalinisation from working.' }
    ],
    actions: [
      A('alkali', 'IV sodium bicarbonate to achieve and maintain a urine pH of 7.5-8, with monitoring', 'Alkalinisation traps salicylate in the urine and enhances clearance.', { cost: 80, tat: 10, factor: 0.45, msg: 'Bicarbonate running with the urine pH rising to 7.6 — salicylate clearance has increased several-fold.' }),
      A('potassium', 'Replace potassium to keep it above 4 mmol/L so alkalinisation can work', 'Hypokalaemia causes paradoxical aciduria and defeats the treatment.', { cost: 20, tat: 8, factor: 0.6, msg: 'Potassium replaced to 4.4 mmol/L; the urine pH is now holding and the alkalosis is improving.' }),
      A('fluids', 'IV crystalloid with dextrose for the volume deficit and the low glucose', 'These patients are dry from vomiting, sweating and hyperventilation.', { cost: 25, tat: 8, factor: 0.7, msg: 'Fluids and dextrose running; the glucose is corrected and the perfusion has improved.' }),
      A('dialysis', 'Urgent haemodialysis for the salicylate level, the acidosis and the neurological features', 'The definitive treatment for severe salicylism.', { cost: 600, tat: 15, factor: 0.5, msg: 'Haemodialysis started: the salicylate level halved within two hours and the conscious level improved dramatically.' }),
      A('glucose', 'Check glucose frequently — neuroglycopenia occurs with a normal plasma glucose', 'Salicylate affects brain glucose metabolism directly.', { cost: 15, tat: 6, factor: 0.85, msg: 'Glucose monitored half-hourly with dextrose support; the confusion is improving.' }),
      A('charcoal', 'Activated charcoal if the airway is protected and ingestion was recent', 'Limited benefit six hours after ingestion, but cheap and safe here.', { cost: 25, tat: 8, factor: 0.95, msg: 'Charcoal given with the airway protected; most absorption has already happened by six hours.' }),
      A('monitor', 'Monitor urine pH, potassium, glucose, salicylate level and blood gases every two hours', 'The treatment is monitored, not guessed.', { cost: 20, tat: 8, factor: 0.8, msg: 'Monitoring established with a documented urine pH and potassium target.' }),
      A('intubate', 'Intubate and ventilate to control the tachypnoea', 'Removing the respiratory compensation causes catastrophic acidosis.', { cost: 250, tat: 12, factor: 1.5, harm: true, msg: 'Intubation abolished the compensatory hyperventilation: the pH fell from 7.42 to 7.06 within minutes and the salicylate shifted into the brain.' }),
      A('acidify', 'Acidify the urine to trap the salicylate in the tubule', 'Acid urine increases non-ionised salicylate reabsorption.', { cost: 40, tat: 8, factor: 1.6, harm: true, msg: 'Urinary acidification increased the reabsorption of salicylate and the level rose sharply with worsening acidosis.' }),
      A('waitlevel', 'Wait for the laboratory salicylate level before starting treatment', 'The clinical picture with a mixed acid-base disturbance is treatment enough.', { cost: 0, tat: 6, factor: 1.5, harm: true, msg: 'Waiting for the level: the patient became more drowsy with worsening acidosis.' }),
      A('restrict', 'Restrict fluids to avoid cerebral oedema', 'These patients are volume depleted and need fluid and glucose.', { cost: 0, tat: 5, factor: 1.4, harm: true, msg: 'Fluid restriction worsened the perfusion, the renal clearance of salicylate and the hypoglycaemia.' }),
      A('flum', 'Flumazenil in case a benzodiazepine was also taken', 'No indication and it provokes seizures.', { cost: 60, tat: 6, factor: 1.5, harm: true, msg: 'Flumazenil given with no benzodiazepine on board caused a seizure in an already acidotic patient.' })
    ],
    tests: [
      T('sal', 'Serum salicylate level (repeated)', 'Bloods', 120, 40, '**850 mg/L (6.2 mmol/L)** six hours after ingestion — well into the range for severe toxicity, and rising on the repeat. Levels above 700 mg/L with acidosis or neurological features require dialysis.', { flag: 'critical', factor: 0.7 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.42 with **pCO2 22 mmHg, HCO3 14 mmol/L and a base excess of -9** — the classic **mixed respiratory alkalosis with a high anion gap metabolic acidosis** of salicylate toxicity. A normal pH hides a severe acidosis.', { flag: 'critical', factor: 0.68 }),
      T('glucose', 'Capillary and laboratory glucose', 'Bedside', 10, 6, '**3.1 mmol/L** — hypoglycaemia, which is common in salicylate poisoning and can be present with a normal plasma glucose in the brain.', { flag: 'critical', factor: 0.78 }),
      T('ue', 'Urea, creatinine, electrolytes and potassium', 'Bloods', 70, 35, '**K 2.9 mmol/L**, Na 135, urea 36 mg/dL, creatinine 1.1 mg/dL, bicarbonate 14. **Hypokalaemia prevents urinary alkalinisation from working.**', { flag: 'critical', factor: 0.75 }),
      T('paracetamol', 'Paracetamol level', 'Bloods', 100, 45, '**Undetectable.** Co-ingestion of paracetamol is common in deliberate overdose and needs its own antidote, so it must always be excluded.', { flag: 'normal' }),
      T('inr', 'Coagulation screen and full blood count', 'Bloods', 135, 40, 'INR 1.3, APTT 40 s, Hb 12.8, platelets 240, WBC 14.2. Mild coagulopathy and a leucocytosis are seen in salicylate toxicity.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 40, 'ALT 80 U/L, bilirubin 1.2 mg/dL — mild derangement. Relevant because hepatic impairment affects salicylate metabolism.', { flag: 'abnormal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 118 with a **QTc of 460 ms**. Salicylates can prolong the QT and cause arrhythmia.', { flag: 'abnormal', factor: 0.95 }),
      T('urineph', 'Urine pH and output', 'Bedside', 15, 10, '**Urine pH 5.4 with a low output.** Acidic, concentrated urine keeps salicylate reabsorbed — this is the measurement that guides alkalinisation.', { flag: 'critical', factor: 0.8 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lung fields with a normal heart size. Pulmonary oedema is a late complication of severe salicylate toxicity.', { flag: 'normal' }),
      T('tox', 'Toxicology screen', 'Microbiology', 130, 80, 'Ethanol detected at a low level; no tricyclics, opiates or benzodiazepines. Alcohol and salicylate together increase gastrointestinal absorption and central nervous system toxicity.', { flag: 'abnormal' }),
      T('ammonia', 'Serum ammonia and osmolal gap', 'Bloods', 150, 50, 'Ammonia normal with a raised osmolal gap. The osmolal gap helps identify concomitant alcohol or glycol ingestion.', { flag: 'abnormal' })
    ],
    hints: [
      'A normal pH with a low bicarbonate and a low CO2 means a mixed respiratory alkalosis and metabolic acidosis — the signature of salicylate poisoning.',
      'Alkalinise the urine, keep the potassium above 4, and dialyse for the level, the acidosis and the confused brain. Never intubate to control the breathing.'
    ],
    dx: {
      label: 'Salicylate (aspirin) poisoning with a mixed acid-base disturbance',
      accept: ['salicylate poisoning', 'aspirin poisoning', 'aspirin overdose', 'salicylate toxicity', 'salicylate overdose', 'salicylism'],
      reject: [
        { m: ['paracetamol'], msg: 'The paracetamol level is undetectable. The salicylate level is 850 mg/L with a mixed acid-base disturbance and tinnitus.' },
        { m: ['ketoacidosis'], msg: 'The glucose is 3.1 mmol/L with no ketonaemia, and the acidosis is a high anion gap acidosis with a compensatory respiratory alkalosis — the pattern of salicylate, not ketones.' },
        { m: ['sepsis', 'septic'], msg: 'There is no source of infection, the lactate is only modestly raised, and the primary problem is a high anion gap acidosis with tinnitus in a patient who ingested 30 g of aspirin.' },
        { m: ['meningitis', 'encephalitis'], msg: 'The fever and confusion are explained by the salicylate level; there is no meningism and the acid-base disturbance is diagnostic.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Thirty grams of aspirin with alcohol, presenting with tachypnoea, tinnitus, vomiting, sweating, hypoglycaemia and confusion. The gas shows a mixed respiratory alkalosis and high anion gap metabolic acidosis, and the level is 850 mg/L.'
    },
    differentials: ['Salicylate poisoning', 'Paracetamol overdose', 'Diabetic ketoacidosis', 'Lactic acidosis from sepsis', 'Meningoencephalitis', 'Alcoholic ketoacidosis', 'Methanol poisoning', 'Renal tubular acidosis', 'Anxiety with hyperventilation', 'Pulmonary embolism'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'alk', label: 'Urinary alkalinisation with IV sodium bicarbonate to a urine pH of 7.5-8', correct: true, msg: 'Increases salicylate clearance several-fold by trapping the ionised drug in the tubule.' },
        { id: 'k2', label: 'Correct the potassium to above 4 mmol/L so alkalinisation can work', correct: true, msg: 'Hypokalaemia causes paradoxical aciduria and defeats the treatment.' },
        { id: 'dial', label: 'Urgent haemodialysis for a level above 700 mg/L with acidosis or neurological features', correct: true, msg: 'Removes salicylate and corrects the acidosis simultaneously.' },
        { id: 'vol2', label: 'IV fluids with dextrose for the volume deficit and hypoglycaemia', correct: true, msg: 'Restores perfusion and renal clearance, and treats the neuroglycopenia.' },
        { id: 'char2', label: 'Activated charcoal if the airway is protected and ingestion is recent', correct: true, msg: 'Useful early; limited benefit at six hours but harmless here.' },
        { id: 'mon3', label: 'Monitor urine pH, potassium, glucose, gases and salicylate level regularly', correct: true, msg: 'The endpoint of alkalinisation is a measured urine pH, not an assumption.' },
        { id: 'psych', label: 'Psychiatric assessment, safe environment and a plan for follow-up', correct: true, msg: 'A deliberate overdose needs more than the antidote.' },
        { id: 'tube', label: 'Intubate and ventilate to control the hyperventilation', correct: false, harm: true, msg: 'Abolishing the compensatory hyperventilation causes a catastrophic fall in pH and drives salicylate into the brain.' },
        { id: 'acid2', label: 'Acidify the urine to trap the salicylate', correct: false, harm: true, msg: 'Acid urine increases the reabsorption of non-ionised salicylate and worsens the toxicity.' },
        { id: 'wait3', label: 'Withhold treatment until the salicylate level is reported', correct: false, harm: true, msg: 'The mixed acid-base disturbance and the clinical picture are enough; treatment starts immediately.' },
        { id: 'restrict2', label: 'Restrict fluids to protect against cerebral oedema', correct: false, harm: true, msg: 'Fluid restriction worsens perfusion, renal clearance and hypoglycaemia.' },
        { id: 'flum2', label: 'Give flumazenil in case a benzodiazepine was co-ingested', correct: false, harm: true, msg: 'No indication, and it provokes seizures in an acidotic patient.' }
      ]
    },
    debrief: {
      key: ['Thirty grams of aspirin with alcohol, six hours before arrival, with vomiting, tinnitus and sweating.', 'Respiratory rate 30 with a GCS of 13, glucose 3.1 mmol/L and potassium 2.9 mmol/L.', 'pH 7.42 with a pCO2 of 22 and a bicarbonate of 14: a mixed respiratory alkalosis and high anion gap metabolic acidosis, with a salicylate level of 850 mg/L.'],
      pearls: ['A normal pH with a low bicarbonate and a low CO2 is the fingerprint of salicylate toxicity — the alkalosis masks the acidosis.', 'Alkalinise the urine and keep potassium above 4; hypokalaemia prevents alkalinisation from working at all.', 'Dialysis is indicated for levels above 700 mg/L, refractory acidosis, renal failure or neurological features.'],
      pitfalls: ['Intubating to "control" the tachypnoea removes the respiratory compensation and kills the patient.', 'Acidifying the urine, waiting for the level and restricting fluids all make salicylate poisoning worse.']
    }
  });

  /* =======================================================================
     CASE 34 — Alcohol withdrawal with delirium tremens
     ======================================================================= */
  window.CASES.push({
    id: 'deliriumtremens',
    title: 'Three days into a hospital admission, now seeing insects on the wall',
    category: 'Addiction medicine',
    difficulty: 'moderate',
    blurb: 'A heavy drinker admitted with cellulitis who stopped abruptly: tremor, drenching sweats, hallucinations and a seizure.',
    timeLimitSec: 600,
    budget: 1300,
    who: 'Mr. W., 46-year-old builder, admitted three days ago with cellulitis of the left leg. He drinks about a litre of spirits daily and has had nothing since admission. He has become increasingly tremulous and agitated, is seeing insects crawling on the wall, and had a generalised seizure two hours ago.',
    history: [
      'Daily heavy alcohol use for over twenty years, roughly a litre of spirits a day, with previous morning shakes.',
      'Three days of abrupt abstinence since admission; no withdrawal prophylaxis was prescribed.',
      'Progressive tremor, sweating, agitation and visual hallucinations over 24 hours.',
      'A generalised tonic-clonic seizure two hours ago, lasting about a minute, with no previous epilepsy.',
      'No head injury during this admission, no fever before today, no other medication apart from antibiotics for the cellulitis.'
    ],
    exam: [
      'Agitated and disorientated, GCS 13, **plucking at the bedclothes and describing insects on the wall**, with a coarse tremor of both hands.',
      '**Pulse 126, BP 166/96, temperature 38.1 C**, respiratory rate 22, SpO2 96%, sweating profusely.',
      '**Dilated pupils with a brisk response, no neck stiffness, no rash, no focal neurology.**',
      'Confused but with no asterixis; liver edge palpable, no ascites, no jaundice. Cellulitis of the left shin improving.',
      'No head injury, no needle marks. Weight 78 kg.'
    ],
    base: { hr: 126, sbp: 166, dbp: 96, rr: 22, spo2: 96, temp: 38.1, gcs: 13 },
    drift: { hr: 0.5, sbp: -0.5, dbp: -0.3, rr: 0.28, spo2: -0.22, temp: 0.012, gcs: -0.06 },
    decay: 0.28,
    events: [
      { at: 110, need: ['action:benzo'], loss: 14, msg: 'No benzodiazepine has been given. Delirium tremens is the withdrawal state with the highest mortality, and benzodiazepines are the only treatment that prevents seizures and death.' },
      { at: 240, need: ['action:thiamine'], loss: 10, msg: 'Thiamine has not been given. Giving glucose before thiamine in a malnourished drinker can precipitate Wernicke encephalopathy.' },
      { at: 370, need: ['action:fluids'], loss: 8, msg: 'No fluid or electrolyte replacement. Sweating, fever and vomiting cause profound losses of magnesium and potassium, which lower the seizure threshold.' }
    ],
    actions: [
      A('benzo', 'Symptom-triggered benzodiazepine (chlordiazepoxide or diazepam) loading, titrated to a sedation scale', 'The only treatment that prevents seizures and death in delirium tremens.', { cost: 120, tat: 8, factor: 0.4, msg: 'Chlordiazepoxide loading started with a sedation scale: within an hour the tremor is settling, the pulse is 96 and the patient is orientated to place.' }),
      A('thiamine', 'IV thiamine (Pabrinex) before any glucose, then daily', 'Prevents and treats Wernicke encephalopathy.', { cost: 90, tat: 6, factor: 0.6, msg: 'Pabrinex given intravenously before any glucose load.' }),
      A('fluids', 'IV fluids with magnesium and potassium replacement', 'Low magnesium and potassium lower the seizure threshold.', { cost: 20, tat: 8, factor: 0.7, msg: 'Fluids and electrolytes replaced; the magnesium and potassium are being corrected.' }),
      A('seizure', 'IV benzodiazepine for the seizure with airway protection', 'Withdrawal seizures recur without adequate benzodiazepine cover.', { cost: 15, tat: 6, factor: 0.9, msg: 'Seizure treated and airway protected; no further seizure activity.' }),
      A('environment', 'Quiet, well-lit side room with reorientation, a nurse at the bedside and no restraints', 'Reduces agitation without drugs.', { cost: 0, tat: 6, factor: 0.85, msg: 'Patient moved to a quiet, well-lit room with continuous nursing and reorientation.' }),
      A('monitor', 'Continuous monitoring with a withdrawal severity score and seizure precautions', 'Deterioration is predictable and preventable.', { cost: 20, tat: 8, factor: 0.85, msg: 'Withdrawal scoring charted hourly with seizure precautions and a clear escalation plan.' }),
      A('cellulitis', 'Continue treatment of the precipitating illness (the cellulitis)', 'Infection triggers and worsens withdrawal.', { cost: 60, tat: 8, factor: 0.9, msg: 'Antibiotics continued; the cellulitis is improving.' }),
      A('haloperidol', 'IV haloperidol as the first-line sedative', 'Antipsychotics lower the seizure threshold and do not treat withdrawal.', { cost: 30, tat: 6, factor: 1.5, harm: true, msg: 'Haloperidol reduced the agitation but lowered the seizure threshold: a further seizure followed, and it prolonged the QT interval.' }),
      A('restraint', 'Physical restraint alone to control the agitation', 'Increases agitation, injury and rhabdomyolysis.', { cost: 0, tat: 5, factor: 1.3, harm: true, msg: 'Struggling against restraints worsened the agitation, tachycardia and hyperthermia.' }),
      A('glucosepre', 'Give 50% dextrose first, then thiamine later', 'Glucose before thiamine precipitates Wernicke encephalopathy.', { cost: 15, tat: 5, factor: 1.4, harm: true, msg: 'Dextrose given before thiamine: the patient developed ophthalmoplegia and ataxia — Wernicke encephalopathy precipitated.' }),
      A('betablock', 'Propranolol alone to control the tachycardia and tremor', 'Masks the signs of withdrawal without preventing seizures.', { cost: 15, tat: 6, factor: 1.3, harm: true, msg: 'The heart rate and tremor improved while the withdrawal continued unseen — the patient had a further seizure and became more confused.' }),
      A('discharge', 'Discharge once the tremor settles, with advice to reduce drinking', 'Withdrawal can progress to seizures and death after apparent improvement.', { cost: 0, tat: 5, factor: 1.6, harm: true, msg: 'Discharged early, the patient returned in status epilepticus with a temperature of 39.5 C.' })
    ],
    tests: [
      T('ue', 'Urea, creatinine, electrolytes and magnesium', 'Bloods', 70, 35, 'Na 130, **K 3.2, magnesium 0.52 mmol/L**, urea 42 mg/dL, creatinine 1.1 mg/dL. **Low magnesium and potassium lower the seizure threshold and prolong withdrawal.**', { flag: 'critical', factor: 0.78 }),
      T('lft', 'Liver function tests', 'Bloods', 90, 40, 'AST 210 U/L with a **raised GGT and an AST:ALT ratio above 2**, bilirubin 1.6 mg/dL, albumin 32 g/L — alcohol-related liver injury without decompensation.', { flag: 'critical', factor: 0.8 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 126 with a **QTc of 480 ms and a prolonged PR interval**. Correct the magnesium before considering any QT-prolonging drug.', { flag: 'critical', factor: 0.82 }),
      T('glucose', 'Capillary and laboratory glucose', 'Bedside', 10, 6, '4.2 mmol/L — normal. **Hypoglycaemia is excluded as a cause of the seizure, and it must be excluded before attributing anything to withdrawal.**', { flag: 'normal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 12.2 with **MCV 104 fL (macrocytosis)**, WBC 11.4, **platelets 88 x10^9/L** — the haematological signature of chronic alcohol use with hypersplenism.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen', 'Bloods', 90, 40, 'INR 1.5, APTT 40 s, fibrinogen 2.2 g/L — mildly deranged from chronic liver disease, and important if any procedure is planned.', { flag: 'abnormal' }),
      T('alcohol', 'Blood alcohol level', 'Bloods', 60, 40, 'Undetectable. He has had nothing for three days, which is the timing that fits withdrawal seizures and delirium.', { flag: 'normal' }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 25, 'pH 7.48, pCO2 30 mmHg, pO2 88 mmHg, lactate 1.8 — a mild respiratory alkalosis from the withdrawal-related hyperventilation.', { flag: 'abnormal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 70, 'No haemorrhage, no mass, no acute infarct. **A subdural haematoma is a classic mimic in a drinker with a seizure**, so imaging is warranted, but nothing here explains the picture.', { flag: 'normal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Clear lungs with a normal heart size. Reasonable in a febrile patient, though the fever is explained by the cellulitis.', { flag: 'normal' }),
      T('tox', 'Urine toxicology screen', 'Microbiology', 130, 80, 'Ethanol absent; negative for benzodiazepines, opiates, stimulants and cannabinoids. Excludes a stimulant-driven agitation and confirms that the benzodiazepine to come is not a duplication.', { flag: 'normal' }),
      T('nh3', 'Serum ammonia', 'Bloods', 110, 45, 'Normal at 24 umol/L with no asterixis and no fetor. **Argues against hepatic encephalopathy as the cause of the confusion.**', { flag: 'normal', factor: 0.95 })
    ],
    hints: [
      'Benzodiazepines are the treatment for alcohol withdrawal — antipsychotics and beta-blockers only mask it and lower the seizure threshold.',
      'Give thiamine before glucose, and correct the magnesium: low magnesium both lowers the seizure threshold and makes withdrawal harder to control.'
    ],
    dx: {
      label: 'Alcohol withdrawal with delirium tremens (and a withdrawal seizure)',
      accept: ['delirium tremens', 'alcohol withdrawal', 'alcohol withdrawal delirium', 'severe alcohol withdrawal', 'alcohol withdrawal syndrome'],
      reject: [
        { m: ['hepatic encephalopathy'], msg: 'The ammonia is normal, there is no asterixis, no fetor and no jaundice — the picture is autonomic hyperactivity with hallucinations and tremor, which is withdrawal rather than hepatic encephalopathy.' },
        { m: ['wernicke'], msg: 'Wernicke encephalopathy causes ophthalmoplegia, ataxia and confusion and is treated with thiamine — but it does not produce this degree of autonomic hyperactivity, and thiamine is given alongside benzodiazepines here.' },
        { m: ['subdural'], msg: 'The CT shows no subdural collection, and the fever, tremor and hallucinations with a normal glucose are typical of withdrawal.' },
        { m: ['meningitis', 'encephalitis'], msg: 'There is no meningism and no rash, and the disorientation with hallucinations, tremor and tachycardia three days after stopping alcohol is characteristic of withdrawal.' },
        { m: ['thyroid storm', 'thyrotoxic'], msg: 'Thyroid disease does not present with visual hallucinations and a withdrawal seizure three days after abrupt abstinence.' },
        { m: ['serotonin syndrome'], msg: 'There is no serotonergic drug and no clonus; the tremor here is a coarse withdrawal tremor with hallucinations.' },
        { m: ['hypoglycaemia', 'hypoglycemic'], msg: 'The glucose is 4.2 mmol/L — hypoglycaemia is excluded.' },
        { m: ['intoxication'], msg: 'He stopped drinking three days ago and the blood alcohol is undetectable: this is withdrawal, not intoxication.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A heavy daily drinker three days into abstinence with a coarse tremor, drenching sweats, fever, tachycardia, hypertension, visual hallucinations and a generalised seizure, with a normal glucose, a normal ammonia and a normal CT head.'
    },
    differentials: ['Alcohol withdrawal with delirium tremens', 'Hepatic encephalopathy', 'Wernicke encephalopathy', 'Meningoencephalitis', 'Subdural haematoma', 'Thyroid storm', 'Serotonin syndrome', 'Hypoglycaemia', 'Acute alcohol intoxication', 'Status epilepticus of other cause'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'bz2', label: 'Symptom-triggered benzodiazepine (chlordiazepoxide or diazepam) titrated to a sedation scale', correct: true, msg: 'The only treatment that prevents withdrawal seizures and reduces mortality in delirium tremens.' },
        { id: 'thia2', label: 'IV thiamine before any glucose, then daily', correct: true, msg: 'Prevents Wernicke encephalopathy.' },
        { id: 'electro', label: 'Replace magnesium and potassium and correct the fluid deficit', correct: true, msg: 'Low magnesium lowers the seizure threshold and prolongs withdrawal.' },
        { id: 'env', label: 'Quiet, well-lit room with reorientation and continuous nursing; avoid restraints', correct: true, msg: 'Non-pharmacological measures reduce agitation and the dose of sedative needed.' },
        { id: 'score', label: 'Use a validated withdrawal severity score with seizure precautions and regular review', correct: true, msg: 'Symptom-triggered dosing needs a score, not a guess.' },
        { id: 'treat', label: 'Treat the precipitating illness (the cellulitis) and look for other triggers', correct: true, msg: 'Infection, pain and dehydration all worsen withdrawal.' },
        { id: 'refer', label: 'Refer to alcohol services and plan a supervised community detoxification and thiamine', correct: true, msg: 'Prevents the next admission, which is often worse.' },
        { id: 'halo2', label: 'IV haloperidol as the first-line sedative', correct: false, harm: true, msg: 'Antipsychotics lower the seizure threshold, prolong the QT interval and do not treat the withdrawal.' },
        { id: 'tie2', label: 'Physical restraint to control the agitation', correct: false, harm: true, msg: 'Restraint increases agitation, injury, rhabdomyolysis and hyperthermia.' },
        { id: 'glu', label: 'Give 50% dextrose before thiamine', correct: false, harm: true, msg: 'Glucose without thiamine can precipitate Wernicke encephalopathy in a malnourished drinker.' },
        { id: 'propran', label: 'Propranolol alone to control the tachycardia and tremor', correct: false, harm: true, msg: 'Masks the signs of withdrawal without preventing seizures, and can hide a deteriorating patient.' },
        { id: 'home2', label: 'Discharge once the tremor settles with advice to cut down', correct: false, harm: true, msg: 'Withdrawal can escalate after apparent improvement, and unsupervised detoxification is dangerous.' }
      ]
    },
    debrief: {
      key: ['A litre of spirits daily, with abrupt abstinence three days ago and no withdrawal prophylaxis.', 'Coarse tremor with drenching sweats, temperature 38.1 C, pulse 126, BP 166/96, visual hallucinations and a withdrawal seizure.', 'MCV 104 with platelets of 88, potassium 3.2 and magnesium 0.52, a prolonged QTc, a normal glucose and a normal CT head.'],
      pearls: ['Benzodiazepines, titrated to a sedation scale, are the treatment for withdrawal — antipsychotics and beta-blockers only hide it.', 'Thiamine before glucose, and magnesium always: hypomagnesaemia lowers the seizure threshold and makes withdrawal refractory.', 'Delirium tremens carries substantial mortality — never discharge a patient who is improving, because withdrawal escalates over days.'],
      pitfalls: ['Haloperidol and physical restraint both increase the risk of seizures and death.', 'In a drinker with a seizure, exclude hypoglycaemia and intracranial bleeding before settling on withdrawal alone.']
    }
  });

})();
