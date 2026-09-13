/* =========================================================================
   DocSim — case library (part 6): the first hour
   Time-critical emergencies where the first few minutes decide the outcome.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 19 — Anaphylaxis
     ======================================================================= */
  window.CASES.push({
    id: 'anaphylaxis',
    title: 'Wasp sting at a picnic, now wheezing with a pulse of 138',
    category: 'Emergency medicine',
    difficulty: 'easy',
    blurb: 'Ten minutes after a sting: generalised hives, a tight chest, a swollen tongue and a falling blood pressure.',
    timeLimitSec: 600,
    budget: 1400,
    who: 'Ms. J., 27-year-old graphic designer with hay fever and no other history. Stung on the forearm by a wasp at a picnic ten minutes ago. Within two minutes she developed itching of the palms and soles, generalised hives, a tight chest and a sensation that "something terrible is about to happen".',
    history: [
      'Wasp sting ten minutes ago; rapid onset of urticaria, itching and swelling of the lips and tongue.',
      'Tight chest with audible wheeze and difficulty speaking in full sentences.',
      'Feeling of impending doom, dizziness on standing and one episode of vomiting.',
      'No previous sting reactions, no known food or drug allergy, no asthma. Takes no regular medication other than an antihistamine for hay fever.',
      'No chest pain, no fever, no recent illness.'
    ],
    exam: [
      'Anxious, flushed and covered in **widespread urticaria with lip and tongue swelling**. Voice is hoarse.',
      'Pulse 138, **BP 78/44**, respiratory rate 30, SpO2 88% on room air, temperature 36.8 C, GCS 14.',
      '**Widespread expiratory wheeze with a prolonged expiratory phase.** No urticaria sparing, no stridor at rest but a hoarse voice.',
      'A red punctum with a small weal on the left forearm. No other rash. Warm peripheries early, then cool and clammy.'
    ],
    base: { hr: 138, sbp: 78, dbp: 44, rr: 30, spo2: 88, temp: 36.8, gcs: 14 },
    drift: { hr: 0.5, sbp: -0.9, dbp: -0.5, rr: 0.35, spo2: -0.5, temp: 0.004, gcs: -0.05 },
    decay: 0.32,
    events: [
      { at: 90, need: ['action:adrenaline'], loss: 18, msg: 'No adrenaline has been given. The blood pressure is now 66/38 with a silent chest — this is the only drug that reverses anaphylaxis.' },
      { at: 200, need: ['action:oxygen'], loss: 10, msg: 'No oxygen and no airway plan. The voice is becoming more hoarse and the saturations are falling further.' },
      { at: 320, need: ['action:fluids'], loss: 12, msg: 'No fluid resuscitation. Anaphylaxis causes massive capillary leak — up to a third of the circulating volume can move into the tissues within minutes.' }
    ],
    actions: [
      A('adrenaline', 'Adrenaline 0.5 mg intramuscularly into the anterolateral thigh', 'The only drug that reverses anaphylaxis — give it now.', { cost: 60, tat: 4, factor: 0.38, msg: 'Adrenaline given within seconds. The wheeze is easing, the blood pressure is climbing and the itching has settled dramatically.' }),
      A('repeatadr', 'Repeat adrenaline 0.5 mg IM after 5 minutes if there is no improvement', 'Anaphylaxis often needs more than one dose.', { cost: 60, tat: 5, factor: 0.8, msg: 'A second dose given at five minutes; the blood pressure is now 104/62.' }),
      A('lieflat', 'Lie the patient flat with the legs raised; remove the sting', 'Sitting a patient up in anaphylaxis can empty the ventricle.', { cost: 5, tat: 3, factor: 0.85, msg: 'Positioned flat with legs elevated; the patient feels less faint and the blood pressure improves.' }),
      A('oxygen', 'High-flow oxygen and an airway plan for the swelling', 'Anticipate laryngeal oedema.', { cost: 15, tat: 5, factor: 0.78, msg: 'Oxygen running; the anaesthetist has been asked to stand by because of the tongue swelling.' }),
      A('fluids', 'Rapid IV crystalloid 500-1000 mL for the distributive shock', 'Replaces the volume lost to capillary leak.', { cost: 18, tat: 8, factor: 0.62, msg: 'Fluid running fast; the blood pressure and heart rate are responding.' }),
      A('nebs', 'Nebulised salbutamol and ipratropium for the bronchospasm', 'Adjunct to adrenaline, never a substitute.', { cost: 25, tat: 6, factor: 0.86, msg: 'Wheeze improved further after nebulisers.' }),
      A('ivaccess', 'IV access, continuous monitoring, ECG', 'Adrenaline may need to be repeated or infused.', { cost: 20, tat: 6, factor: 0.9, msg: 'Access secured and monitoring applied.' }),
      A('antihist', 'IV chlorphenamine and hydrocortisone', 'Second-line comfort measures that do not treat the airway or the shock.', { cost: 12, tat: 5, factor: 0.98, msg: 'Antihistamine and steroid given. They will help the urticaria over hours, but they did not touch the hypotension or the wheeze.' }),
      A('ivadr', 'IV adrenaline 1 mg bolus', 'An intravenous bolus of the dilute preparation is lethal.', { cost: 60, tat: 5, factor: 1.7, harm: true, msg: 'The intravenous bolus caused malignant hypertension with a broad-complex tachycardia and chest pain. IV adrenaline must be diluted and infused with monitoring.' }),
      A('situp', 'Sit the patient upright to help the breathing', 'Upright positioning in anaphylaxis has caused fatal cardiac arrest.', { cost: 0, tat: 3, factor: 1.5, harm: true, msg: 'Sat upright, the patient became unresponsive within a minute — an empty ventricle from loss of venous return.' }),
      A('steroidonly', 'Antihistamine and steroid only, and observe', 'Treating the rash while the airway closes.', { cost: 25, tat: 6, factor: 1.8, harm: true, msg: 'Given antihistamine alone, the wheeze and hypotension progressed: the urticaria faded while the patient deteriorated.' }),
      A('discharge', 'Discharge after the hives settle with oral antihistamines', 'Biphasic reactions occur hours later.', { cost: 10, tat: 5, factor: 1.9, harm: true, msg: 'Anaphylaxis needs observation for a biphasic reaction — discharging after the rash fades is dangerous.' })
    ],
    tests: [
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.28, pO2 62 mmHg, pCO2 36 mmHg, **lactate 4.2 mmol/L**, base excess -6 — hypoxaemia with a lactic acidosis from distributive shock.', { flag: 'critical', factor: 0.85 }),
      T('pef', 'Peak expiratory flow', 'Bedside', 25, 6, '**Unrecordable** — severe bronchospasm. Serial peak flow is a useful measure of the response to adrenaline.', { flag: 'critical', factor: 0.9 }),
      T('tryptase', 'Serum mast cell tryptase', 'Bloods', 180, 60, '**48 ug/L** (normal below 11). Take it within an hour and again at 24 hours: it confirms mast cell degranulation retrospectively.', { flag: 'abnormal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 130 with no ischaemic change. Worth having before any adrenaline infusion.', { flag: 'abnormal', factor: 0.97 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Hyperinflated lung fields with no consolidation, no pneumothorax and a normal heart size.', { flag: 'normal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'Hb 15.4 (haemoconcentrated from capillary leak), WBC 14.8, platelets 300.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Urea 34 mg/dL, creatinine 1.1 mg/dL, Na 137, K 4.0. Angiotensin-converting enzyme inhibitors and beta-blockers would make this harder to treat.', { flag: 'normal' }),
      T('glucose', 'Capillary glucose', 'Bedside', 15, 6, '7.2 mmol/L — normal.', { flag: 'normal' }),
      T('ige', 'Wasp venom specific IgE', 'Special', 200, 90, '**Grade 4 positive to wasp venom.** Confirms the trigger and identifies who needs an adrenaline autoinjector and venom immunotherapy.', { flag: 'abnormal', factor: 0.95 }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. Sepsis can mimic anaphylaxis but here the onset was within minutes of a sting with urticaria and wheeze.', { flag: 'normal' }),
      T('ct', 'CT chest with contrast', 'Imaging', 620, 90, 'Hyperinflation only; no pulmonary embolism, no airway narrowing demonstrated. A large bill for a clinical diagnosis.', { flag: 'normal' }),
      T('allergy', 'Broad food and drug allergy panel', 'Special', 380, 120, 'Negative apart from wasp venom. The trigger is already known from the history; this panel is for the allergy clinic, not the resuscitation room.', { flag: 'normal' })
    ],
    hints: [
      'Adrenaline intramuscularly into the thigh is the treatment. Everything else is supportive.',
      'Keep the patient flat: sitting them up in anaphylaxis has caused fatal cardiac arrest from an empty ventricle.'
    ],
    dx: {
      label: 'Anaphylaxis (wasp venom) with bronchospasm and distributive shock',
      accept: ['anaphylaxis', 'anaphylactic shock', 'anaphylactic reaction', 'severe allergic reaction', 'anaphylactoid reaction', 'anaphylaxis with bronchospasm'],
      reject: [
        { m: ['vasovagal'], msg: 'A vasovagal reaction causes bradycardia and pallor without urticaria, wheeze or a raised tryptase.' },
        { m: ['panic', 'hyperventilation', 'anxiety'], msg: 'Panic does not cause urticaria, wheeze, a lactate of 4.2 and a systolic pressure of 78.' },
        { m: ['sepsis', 'septic'], msg: 'Sepsis does not begin within ten minutes of a sting, and the tryptase is 48 ug/L.' },
        { m: ['asthma'], msg: 'Asthma does not cause generalised urticaria, tongue swelling and hypotension minutes after a sting.' },
        { m: ['scombroid'], msg: 'Scombroid poisoning follows spoiled fish, not a wasp sting.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Onset within ten minutes of a wasp sting with urticaria, tongue swelling, wheeze, hypotension and a raised mast cell tryptase: an IgE-mediated anaphylactic reaction.'
    },
    differentials: ['Anaphylaxis', 'Acute severe asthma', 'Vasovagal syncope', 'Panic attack with hyperventilation', 'Septic shock', 'Scombroid fish poisoning', 'Hereditary angioedema', 'Chronic spontaneous urticaria', 'Vocal cord dysfunction', 'Pulmonary embolism'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'im', label: 'Adrenaline 0.5 mg intramuscularly into the anterolateral thigh, repeated after 5 minutes if needed', correct: true, msg: 'The definitive treatment; delay is the main cause of death.' },
        { id: 'flat', label: 'Lie the patient flat with the legs elevated', correct: true, msg: 'Preserves venous return; sudden upright positioning has caused fatal arrests.' },
        { id: 'o2b', label: 'High-flow oxygen with an early airway plan for laryngeal oedema', correct: true, msg: 'Swelling can close the airway within minutes.' },
        { id: 'vol', label: 'Rapid IV crystalloid for the distributive shock', correct: true, msg: 'Replaces the volume lost to capillary leak.' },
        { id: 'bronch', label: 'Nebulised bronchodilators as an adjunct', correct: true, msg: 'Helps the wheeze but never replaces adrenaline.' },
        { id: 'adr', label: 'Consider an adrenaline infusion and repeat intramuscular doses for refractory shock', correct: true, msg: 'Refractory anaphylaxis needs a titrated infusion, not a bolus.' },
        { id: 'obs', label: 'Observe for a biphasic reaction, take a 24-hour tryptase, and provide an autoinjector plus allergy referral', correct: true, msg: 'Up to one in five reactions recur without further exposure.' },
        { id: 'ivpush', label: 'Adrenaline 1 mg intravenously as a bolus', correct: false, harm: true, msg: 'Undiluted intravenous adrenaline causes hypertensive crisis, arrhythmia and myocardial infarction.' },
        { id: 'upright', label: 'Sit the patient upright to help their breathing', correct: false, harm: true, msg: 'Upright positioning in anaphylaxis causes fatal loss of venous return.' },
        { id: 'second', label: 'Antihistamine and corticosteroid as the main treatment', correct: false, harm: true, msg: 'They relieve the rash over hours; they do nothing for the airway or the blood pressure.' },
        { id: 'home', label: 'Discharge once the rash settles', correct: false, harm: true, msg: 'Biphasic reactions occur up to 12 hours later.' },
        { id: 'beta', label: 'IV beta-blocker for the tachycardia', correct: false, harm: true, msg: 'Beta blockade worsens anaphylaxis and makes adrenaline less effective.' }
      ]
    },
    debrief: {
      key: ['Wasp sting with urticaria, tongue swelling and wheeze within ten minutes.', 'Pulse 138, BP 78/44, SpO2 88% with a widespread wheeze and a hoarse voice.', 'Lactate 4.2 and a mast cell tryptase of 48 ug/L.'],
      pearls: ['Intramuscular adrenaline into the thigh is the only treatment that changes the outcome; antihistamines and steroids are comfort measures.', 'Position matters: lying flat preserves venous return, and sitting a hypotensive anaphylactic patient up can kill them.', 'Take a tryptase within an hour and again at 24 hours — it confirms the diagnosis the next day, and identifies who needs an autoinjector.'],
      pitfalls: ['Intravenous adrenaline must be diluted and infused with monitoring; a bolus of the 1 mg/mL preparation is lethal.', 'A fading rash does not mean recovery — biphasic reactions are common.']
    }
  });

  /* =======================================================================
     CASE 20 — Tension pneumothorax
     ======================================================================= */
  window.CASES.push({
    id: 'tensionpneumo',
    title: 'Fall from a ladder, now hypoxic with distended neck veins',
    category: 'Respiratory / Emergency',
    difficulty: 'easy',
    blurb: 'Four rib fractures on the right, saturations 84%, trachea deviated, and no breath sounds on that side.',
    timeLimitSec: 600,
    budget: 1400,
    who: 'Mr. V., 42-year-old roofer who fell three metres from a ladder thirty minutes ago onto his right side. He is in severe respiratory distress, and the paramedics report that his saturations have fallen from 96% to 84% during the journey.',
    history: [
      'Fall of three metres onto the right side of the chest, landing on the edge of a wall.',
      'Rapidly worsening breathlessness over the last twenty minutes with sharp right-sided chest pain.',
      'No loss of consciousness, no head injury, no abdominal pain, no vomiting.',
      'Fit and well, no regular medication, non-smoker, no previous chest problems.',
      'No drug or alcohol use before the fall.'
    ],
    exam: [
      'Severe distress, sitting forward, barely able to speak. GCS 14.',
      'Pulse 132, **BP 84/50**, respiratory rate 34, **SpO2 84% on 15 L**, temperature 36.5 C.',
      '**Absent breath sounds and a hyper-resonant percussion note over the entire right hemithorax, with the trachea deviated to the left and distended neck veins.**',
      'Paradoxical movement of the right chest wall with bruising and surgical emphysema.',
      'Heart sounds difficult to hear but present; no murmurs. Abdomen soft.'
    ],
    base: { hr: 132, sbp: 84, dbp: 50, rr: 34, spo2: 84, temp: 36.5, gcs: 14 },
    drift: { hr: 0.55, sbp: -0.95, dbp: -0.5, rr: 0.35, spo2: -0.55, temp: 0.004, gcs: -0.05 },
    decay: 0.34,
    events: [
      { at: 80, need: ['action:needle'], loss: 18, msg: 'No decompression has been performed. The systolic pressure has fallen to 68 mmHg and the trachea is more deviated — this is obstructive shock.' },
      { at: 200, need: ['action:oxygen'], loss: 10, msg: 'Hypoxaemia is uncorrected. Saturations are now 76% with a rising lactate.' },
      { at: 330, need: ['action:drain'], loss: 12, msg: 'Needle decompression alone has bought minutes. A definitive chest drain is needed — the lung has not re-expanded.' }
    ],
    actions: [
      A('needle', 'Immediate needle decompression — second intercostal space, mid-clavicular line (or fifth space, mid-axillary)', 'A clinical diagnosis: decompress before any imaging.', { cost: 25, tat: 4, factor: 0.3, msg: 'A rush of air escaped the cannula. Within a minute the saturations rose to 94%, the blood pressure to 112/70 and the trachea began to return to the midline.' }),
      A('drain', 'Insert a definitive intercostal chest drain with an underwater seal', 'Definitive treatment after decompression.', { cost: 120, tat: 12, factor: 0.5, msg: 'Chest drain inserted with a large air leak and bubbling. The right lung is re-expanding.' }),
      A('oxygen', 'High-flow oxygen, and avoid positive pressure until decompressed', 'Correct hypoxaemia but never ventilate a tension before decompressing.', { cost: 15, tat: 4, factor: 0.75, msg: 'Saturations maintained above 94% on a reservoir mask.' }),
      A('ivaccess', 'Two large-bore IV lines, monitoring, analgesia', 'Anticipate deterioration during the transfer.', { cost: 20, tat: 8, factor: 0.88, msg: 'Access secured with adequate analgesia; the patient is more comfortable.' }),
      A('callsenior', 'Call the trauma team, senior emergency physician and anaesthetist', 'The airway may become the next problem.', { cost: 0, tat: 6, factor: 0.85, msg: 'Trauma team and anaesthetist at the bedside; a plan is agreed for intubation after decompression.' }),
      A('analgesia', 'IV opioid analgesia titrated, with antiemetic', 'Pain limits ventilation and worsens atelectasis.', { cost: 18, tat: 6, factor: 0.9, msg: 'Pain controlled; the patient can now take a deeper breath.' }),
      A('fluids', 'Cautious IV crystalloid for the obstructive shock', 'Volume supports the circulation while the obstruction is relieved.', { cost: 15, tat: 8, factor: 0.9, msg: 'Small fluid bolus given with a modest rise in blood pressure.' }),
      A('waitxray', 'Wait for a chest X-ray before any intervention', 'Tension pneumothorax is a clinical diagnosis.', { cost: 0, tat: 6, factor: 1.7, harm: true, msg: 'Waiting for the radiograph cost precious minutes: the blood pressure fell to 62/34 and the patient became drowsy.' }),
      A('bag', 'Bag-valve-mask ventilation before decompression', 'Positive pressure converts a pneumothorax into a tension.', { cost: 0, tat: 4, factor: 1.6, harm: true, msg: 'Positive pressure ventilation before decompression worsened the tension: the blood pressure collapsed and the chest became more distended.' }),
      A('o2only', 'Oxygen alone and observation', 'Oxygen does not relieve an obstruction to venous return.', { cost: 15, tat: 5, factor: 1.4, harm: true, msg: 'Oxygen alone: the saturations briefly improved but the blood pressure continued to fall as the tension increased.' }),
      A('sedate', 'IV sedation to reduce distress and oxygen demand', 'Sedation removes the respiratory drive in an obstructed patient.', { cost: 20, tat: 6, factor: 1.5, harm: true, msg: 'After sedation the patient became apnoeic and profoundly hypotensive — a pre-arrest state.' })
    ],
    tests: [
      T('cxr', 'Chest X-ray (supine) after decompression', 'Imaging', 90, 25, '**Right hemithorax hyperlucent with absent lung markings, mediastinal shift to the left and a depressed right hemidiaphragm.** Four displaced ribs. Confirmatory, never a reason to delay decompression.', { flag: 'critical', factor: 0.85 }),
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.18, pO2 51 mmHg, **pCO2 58 mmHg**, HCO3 20, **lactate 5.4 mmol/L** — hypoxaemic and hypercapnic respiratory failure with obstructive shock.', { flag: 'critical', factor: 0.85 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 134 with right axis deviation and low-voltage complexes. No ischaemic change.', { flag: 'abnormal', factor: 0.97 }),
      T('fast', 'FAST scan (focused assessment with sonography for trauma)', 'Bedside', 200, 20, 'No free fluid in the abdomen or pericardium. The right lung shows absent lung sliding — consistent with pneumothorax rather than haemothorax.', { flag: 'normal', factor: 0.95 }),
      T('fbc', 'Full blood count and group and save', 'Bloods', 45, 30, 'Hb 13.8, WBC 15.2, platelets 260. Blood group O positive, antibody screen negative.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen', 'Bloods', 90, 40, 'INR 1.1, APTT 32 s — safe to place a chest drain.', { flag: 'normal', factor: 0.97 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 138, K 4.2, urea 30 mg/dL, creatinine 1.1 mg/dL.', { flag: 'normal' }),
      T('trop', 'Troponin', 'Bloods', 60, 30, 'hs-troponin 18 ng/L — mildly raised. Demand from shock and hypoxaemia, not myocardial injury.', { flag: 'abnormal' }),
      T('ct', 'CT trauma series (chest, abdomen, pelvis)', 'Imaging', 620, 90, 'Confirms the pneumothorax, lung contusions and rib fractures. The correct test once the patient is decompressed and stable — contraindicated as a first move in a crashing patient.', { flag: 'abnormal' }),
      T('bloods', 'Blood alcohol and toxicology screen', 'Bloods', 130, 60, 'Negative. Relevant to the mechanism of the fall, irrelevant to the tension.', { flag: 'normal' })
    ],
    hints: [
      'Absent breath sounds, hyper-resonance, tracheal deviation and shock is a tension pneumothorax: decompress it now with a needle.',
      'Never give positive pressure ventilation to an undecompressed tension pneumothorax.'
    ],
    dx: {
      label: 'Right-sided tension pneumothorax with obstructive shock',
      accept: ['tension pneumothorax', 'pneumothorax', 'right sided tension pneumothorax', 'traumatic tension pneumothorax', 'traumatic pneumothorax'],
      reject: [
        { m: ['cardiac tamponade', 'tamponade'], msg: 'Tamponade gives muffled heart sounds, a raised JVP and clear lungs — here there are absent breath sounds with hyper-resonance and a shifted trachea.' },
        { m: ['haemothorax', 'hemothorax'], msg: 'A massive haemothorax is dull to percussion and the trachea shifts away late; this chest is hyper-resonant with absent lung markings.' },
        { m: ['flail chest'], msg: 'The flail segment is a consequence of the rib fractures, but the immediate threat is the pressure in the pleural space.' },
        { m: ['contusion'], msg: 'Pulmonary contusion does not cause tracheal deviation, hyper-resonance or obstructive shock.' },
        { m: ['dissection'], msg: 'No tearing pain or pulse deficit; the findings are confined to the right hemithorax.' },
        { m: ['myocardial infarction'], msg: 'The ECG shows sinus tachycardia with right axis deviation, and the problem is mechanical.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Trauma with absent breath sounds, hyper-resonance, tracheal deviation, distended neck veins and obstructive shock: a tension pneumothorax, which is a clinical diagnosis treated before any imaging.'
    },
    differentials: ['Tension pneumothorax', 'Cardiac tamponade', 'Massive haemothorax', 'Flail chest with pulmonary contusion', 'Aortic dissection', 'Myocardial infarction', 'Acute severe asthma', 'Pulmonary embolism', 'Diaphragmatic rupture', 'Rib fracture with atelectasis'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'needle2', label: 'Immediate needle decompression before any imaging', correct: true, msg: 'The intervention that reverses the obstruction to venous return.' },
        { id: 'drain2', label: 'Definitive intercostal chest drain to an underwater seal', correct: true, msg: 'Prevents recurrence and re-expands the lung.' },
        { id: 'oxy', label: 'High-flow oxygen with positive pressure ventilation only after decompression', correct: true, msg: 'Positive pressure before decompression converts a pneumothorax into a fatal tension.' },
        { id: 'fluid2', label: 'Cautious fluid resuscitation and analgesia while preparing the drain', correct: true, msg: 'Supports the circulation and allows deeper ventilation.' },
        { id: 'team', label: 'Involve the trauma team, anaesthetist and surgeon early', correct: true, msg: 'Rib fractures, contusions and possible haemothorax need a coordinated plan.' },
        { id: 'serial', label: 'Serial observations and a repeat chest X-ray after the drain', correct: true, msg: 'Confirms re-expansion and detects a persistent air leak.' },
        { id: 'xrayfirst', label: 'Obtain a chest X-ray before decompressing', correct: false, harm: true, msg: 'Tension pneumothorax is diagnosed clinically and treated immediately; imaging kills patients.' },
        { id: 'ppv', label: 'Bag-valve-mask ventilation before decompression', correct: false, harm: true, msg: 'Positive pressure without decompression worsens the obstruction to venous return.' },
        { id: 'observe2', label: 'Oxygen and observation with a repeat film in an hour', correct: false, harm: true, msg: 'Obstructive shock does not improve with oxygen alone.' },
        { id: 'sedate2', label: 'IV sedation for distress before treating the chest', correct: false, harm: true, msg: 'Removes the respiratory drive and the last of the venous return.' },
        { id: 'ctfirst', label: 'Take the patient to CT for a definitive diagnosis', correct: false, harm: true, msg: 'A crashing patient does not go to the scanner before the chest is decompressed.' }
      ]
    },
    debrief: {
      key: ['Fall onto the right side with four rib fractures and rapidly falling saturations.', 'Absent breath sounds and hyper-resonance on the right with tracheal deviation and distended neck veins.', 'BP 84/50, SpO2 84% on 15 L, lactate 5.4: obstructive shock from a tension pneumothorax.'],
      pearls: ['Tension pneumothorax is a clinical diagnosis: decompress first, image afterwards.', 'The trachea deviates late — do not wait for it as a prerequisite.', 'Never apply positive pressure ventilation to an undecompressed tension.'],
      pitfalls: ['Waiting for a chest X-ray in a shocked patient is the classic fatal delay.', 'Sedation and bag-valve-mask ventilation before decompression both accelerate the arrest.']
    }
  });

  /* =======================================================================
     CASE 21 — Sulfonylurea hypoglycaemia
     ======================================================================= */
  window.CASES.push({
    id: 'hypoglycaemia',
    title: 'Confused elderly diabetic who missed lunch',
    category: 'Endocrinology',
    difficulty: 'easy',
    blurb: 'Found drowsy and disoriented by her carer; the capillary glucose reads 1.9 mmol/L.',
    timeLimitSec: 600,
    budget: 1400,
    who: 'Mrs. D., 74-year-old retired seamstress with type 2 diabetes on gliclazide and metformin. Her carer found her drowsy, sweating and disoriented this afternoon; she had skipped lunch after a hospital appointment ran late.',
    history: [
      'Increasing confusion and drowsiness over two hours; the carer could not rouse her properly.',
      'Missed lunch, and had been off her food for two days with a mild chest infection.',
      'Gliclazide 80 mg twice daily and metformin 1 g twice daily, both continued throughout.',
      'No alcohol, no insulin, no recent change in tablets. One previous episode of "funny turns" after exercise.',
      'No head injury, no seizure witnessed, no fever, no focal weakness.'
    ],
    exam: [
      'Drowsy, disoriented, GCS 10, sweaty with cool clammy skin. **Capillary glucose 1.9 mmol/L.**',
      'Pulse 96, BP 148/84, respiratory rate 16, SpO2 97%, temperature 36.3 C.',
      'No focal neurological deficit, pupils equal and reactive, no head injury, no rash. Mild crackles at the right base.',
      'Abdomen soft, no organomegaly. No needle marks. Weight 58 kg.'
    ],
    base: { hr: 96, sbp: 148, dbp: 84, rr: 16, spo2: 97, temp: 36.3, gcs: 10 },
    drift: { hr: 0.35, sbp: -0.3, dbp: -0.2, rr: 0.15, spo2: -0.2, temp: 0.004, gcs: -0.08 },
    decay: 0.26,
    events: [
      { at: 100, need: ['action:dextrose'], loss: 14, msg: 'No dextrose has been given. The glucose is unrecordably low and the patient is now unresponsive to pain — prolonged neuroglycopenia causes permanent brain injury.' },
      { at: 240, need: ['action:infusion'], loss: 10, msg: 'No dextrose infusion has been started. After the initial bolus the glucose will fall again within the hour.' },
      { at: 380, need: ['action:cause'], loss: 8, msg: 'The sulfonylurea has not been reviewed. Gliclazide has a long duration of action and will cause recurrent hypoglycaemia for up to 24 hours.' }
    ],
    actions: [
      A('dextrose', 'IV 10% dextrose 200 mL (or 20% dextrose 100 mL) bolus via a large vein', 'Immediate glucose; the brain has no other fuel.', { cost: 20, tat: 4, factor: 0.4, msg: 'Within two minutes the glucose is 6.8 mmol/L and the patient is opening her eyes and speaking.' }),
      A('infusion', 'Start a 10% dextrose infusion and recheck glucose every 15-30 minutes', 'A single bolus wears off while the sulfonylurea is still working.', { cost: 25, tat: 8, factor: 0.6, msg: 'Dextrose infusion running with a monitoring plan; the glucose is holding above 5 mmol/L.' }),
      A('cause', 'Stop the gliclazide and review every hypoglycaemic agent', 'A long-acting sulfonylurea causes prolonged, recurrent hypoglycaemia.', { cost: 0, tat: 6, factor: 0.75, msg: 'Gliclazide stopped and the drug chart reviewed. No further sulfonylurea will be given.' }),
      A('octreotide', 'Consider octreotide 50 micrograms subcutaneously for refractory sulfonylurea hypoglycaemia', 'Suppresses further insulin release when dextrose alone is not holding.', { cost: 120, tat: 10, factor: 0.7, msg: 'Octreotide given; the dextrose requirement has fallen sharply.' }),
      A('glucagon', 'Glucagon 1 mg intramuscularly if intravenous access is delayed', 'Buys time when there is no line.', { cost: 45, tat: 6, factor: 0.8, msg: 'Glucagon given while access was obtained; the glucose rose enough to allow the IV line to be sited.' }),
      A('thiamine', 'Thiamine 100 mg IV (Pabrinex) before or with the glucose', 'Prevents Wernicke encephalopathy in the at-risk patient.', { cost: 15, tat: 5, factor: 0.93, msg: 'Thiamine given before the glucose load.' }),
      A('recheck', 'Repeat glucose after 15 minutes, then hourly; document the episode', 'Recurrent hypoglycaemia is the rule with sulfonylureas.', { cost: 10, tat: 8, factor: 0.9, msg: 'Repeat glucose 7.4 mmol/L and holding on the infusion.' }),
      A('sepsis', 'Look for and treat the precipitating illness (here a chest infection)', 'Infection and poor intake contribute to the hypoglycaemia.', { cost: 60, tat: 10, factor: 0.88, msg: 'Chest infection identified and treated; the precipitant is being addressed.' }),
      A('oral', 'Give oral glucose gel to an unresponsive patient', 'Aspiration risk with no gag reflex.', { cost: 8, tat: 4, factor: 1.6, harm: true, msg: 'Oral glucose in an unresponsive patient caused aspiration and coughing — the airway was unprotected.' }),
      A('discharge', 'Discharge once the patient wakes up and eats', 'Sulfonylurea hypoglycaemia recurs for up to 24 hours.', { cost: 0, tat: 5, factor: 1.8, harm: true, msg: 'Discharged after waking, the patient was readmitted four hours later with a glucose of 2.1 mmol/L.' }),
      A('withhold', 'Withhold dextrose and observe, since the glucose may rebound', 'Neuroglycopenia does not wait for a rebound.', { cost: 0, tat: 4, factor: 1.7, harm: true, msg: 'Observed instead of treated: the patient had a further decrease in conscious level and a seizure.' }),
      A('insulin', 'Give insulin to correct the reactive hyperglycaemia later', 'Insulin in sulfonylurea toxicity deepens the hypoglycaemia.', { cost: 30, tat: 6, factor: 1.5, harm: true, msg: 'Insulin given for a transient high reading caused a further profound hypoglycaemic episode.' })
    ],
    tests: [
      T('glucose', 'Capillary and laboratory glucose', 'Bedside', 10, 6, '**1.9 mmol/L (34 mg/dL)** — severe neuroglycopenia.', { flag: 'critical', factor: 0.8 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Na 132, K 3.4, urea 38 mg/dL, creatinine 1.0 mg/dL. Renal impairment prolongs sulfonylurea action — worth knowing for the next 24 hours.', { flag: 'abnormal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'WBC 13.2 with neutrophilia, Hb 12.2, platelets 240 — consistent with the chest infection.', { flag: 'abnormal' }),
      T('lft', 'Liver function tests', 'Bloods', 90, 40, 'Mildly deranged transaminases. Hepatic impairment prolongs sulfonylurea half-life.', { flag: 'abnormal' }),
      T('cortisol', 'Serum cortisol', 'Bloods', 140, 60, 'Normal at 480 nmol/L. Adrenal insufficiency is excluded as a cause of recurrent hypoglycaemia.', { flag: 'normal' }),
      T('tsh', 'Thyroid function and coeliac screen', 'Bloods', 150, 70, 'Normal. Hypothyroidism and malabsorption can both cause hypoglycaemia in the elderly.', { flag: 'normal' }),
      T('sulf', 'Sulfonylurea and insulin levels', 'Special', 200, 80, '**Gliclazide detected at a therapeutic concentration** with a suppressed C-peptide-appropriate insulin level — confirms sulfonylurea-induced hypoglycaemia rather than an insulinoma.', { flag: 'critical', factor: 0.9 }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Right lower lobe consolidation — the precipitating illness.', { flag: 'abnormal', factor: 0.95 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus rhythm with no ischaemic change. Hypoglycaemia can unmask ischaemia, so a baseline is useful.', { flag: 'normal' }),
      T('bloods', 'Blood alcohol and paracetamol levels', 'Bloods', 100, 50, 'Both undetectable. Worth excluding in any unexplained coma.', { flag: 'normal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 80, 'No haemorrhage, infarct or mass. The reduced conscious level is metabolic, not structural.', { flag: 'normal' }),
      T('insulin', 'Insulin and C-peptide ratio', 'Special', 220, 80, 'Low insulin with a low C-peptide — excludes exogenous insulin and makes an insulinoma very unlikely.', { flag: 'normal' })
    ],
    hints: [
      'A glucose of 1.9 mmol/L with a reduced conscious level is a medical emergency treated in seconds, not investigated.',
      'Sulfonylureas cause prolonged, recurrent hypoglycaemia: after the bolus, start an infusion, stop the drug and recheck.'
    ],
    dx: {
      label: 'Severe sulfonylurea-induced hypoglycaemia with neuroglycopenia',
      accept: ['hypoglycaemia', 'sulfonylurea induced hypoglycaemia', 'sulphonylurea induced hypoglycaemia', 'drug induced hypoglycaemia', 'hypoglycaemic coma', 'severe hypoglycaemia'],
      reject: [
        { m: ['insulinoma'], msg: 'Insulinoma causes fasting hypoglycaemia with inappropriately high insulin and C-peptide. Here gliclazide is detectable and she has been taking it throughout.' },
        { m: ['sepsis', 'septic'], msg: 'There is a chest infection, but it is the precipitant — the glucose is 1.9 mmol/L and the conscious level tracks the glucose.' },
        { m: ['stroke', 'cerebrovascular'], msg: 'There is no focal deficit and the CT is normal; the symptoms resolve with dextrose.' },
        { m: ['subdural'], msg: 'No head injury and the CT is normal.' },
        { m: ['adrenal'], msg: 'The cortisol is normal at 480 nmol/L.' },
        { m: ['meningoencephalitis', 'meningitis', 'encephalitis'], msg: 'No fever before today, no meningism, and the picture resolves immediately with glucose.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A sulfonylurea-treated diabetic who missed a meal, found with a glucose of 1.9 mmol/L and neuroglycopenia. Gliclazide has a long duration of action, so hypoglycaemia will recur without an infusion and without stopping the drug.'
    },
    differentials: ['Sulfonylurea-induced hypoglycaemia', 'Insulinoma', 'Alcohol intoxication', 'Acute stroke', 'Sepsis with encephalopathy', 'Adrenal insufficiency', 'Subdural haematoma', 'Meningoencephalitis', 'Diabetic ketoacidosis', 'Vasovagal syncope'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'dex', label: 'IV 10% dextrose bolus immediately, then a continuous dextrose infusion', correct: true, msg: 'The bolus restores consciousness; the infusion keeps it there.' },
        { id: 'stop', label: 'Stop the gliclazide and review all hypoglycaemic agents', correct: true, msg: 'Long-acting sulfonylureas keep stimulating insulin release for up to 24 hours.' },
        { id: 'monitor', label: 'Glucose every 15-30 minutes initially, then hourly, with a documented plan', correct: true, msg: 'Recurrent hypoglycaemia is the rule, not the exception.' },
        { id: 'octreo', label: 'Consider octreotide for refractory sulfonylurea hypoglycaemia', correct: true, msg: 'Reduces further insulin secretion and dextrose requirements.' },
        { id: 'thia', label: 'Give thiamine before or with the glucose', correct: true, msg: 'Prevents Wernicke encephalopathy.' },
        { id: 'treat', label: 'Identify and treat the precipitant (missed meals, infection, renal or hepatic impairment)', correct: true, msg: 'The cause of the episode, and the key to preventing the next one.' },
        { id: 'educate', label: 'Diabetes education, carer advice, and a review of targets in a frail elderly patient', correct: true, msg: 'Tight glycaemic targets are dangerous in frail older people on sulfonylureas.' },
        { id: 'oral2', label: 'Oral glucose gel or a sugary drink while unresponsive', correct: false, harm: true, msg: 'Aspiration risk with an unprotected airway and no gag reflex.' },
        { id: 'home2', label: 'Discharge once the patient is awake and has eaten', correct: false, harm: true, msg: 'Sulfonylurea hypoglycaemia recurs over 24 hours and needs observation and an infusion.' },
        { id: 'observe3', label: 'Observe without dextrose, expecting a rebound', correct: false, harm: true, msg: 'Prolonged neuroglycopenia causes permanent neurological injury.' },
        { id: 'ins2', label: 'Give insulin for the reactive hyperglycaemia', correct: false, harm: true, msg: 'Insulin on top of a sulfonylurea causes a second, deeper hypoglycaemic episode.' },
        { id: 'restrict', label: 'Restrict fluids because of the risk of cerebral oedema', correct: false, harm: true, msg: 'Nothing here suggests cerebral oedema; withholding dextrose is the real danger.' }
      ]
    },
    debrief: {
      key: ['Elderly diabetic on gliclazide who missed lunch while unwell with a chest infection.', 'Glucose 1.9 mmol/L with GCS 10, sweating and cool clammy skin.', 'Gliclazide detected on the drug screen with a low C-peptide: sulfonylurea-induced hypoglycaemia.'],
      pearls: ['Glucose is the first test in any patient with an altered conscious level — it takes seconds and reverses the cause.', 'Sulfonylureas cause prolonged hypoglycaemia: bolus, then infuse, then stop the drug and watch for 24 hours.', 'Frail elderly patients need relaxed glycaemic targets; tight control with a sulfonylurea causes admissions like this.'],
      pitfalls: ['Oral glucose in an unresponsive patient causes aspiration.', 'Discharging after the patient wakes up leads to a recurrence within hours.']
    }
  });

  /* =======================================================================
     CASE 22 — Testicular torsion
     ======================================================================= */
  window.CASES.push({
    id: 'torsion',
    title: 'Teenager woken by sudden severe testicular pain',
    category: 'Urology',
    difficulty: 'easy',
    blurb: 'Three hours of left testicular pain with vomiting; the testis sits high and horizontal.',
    timeLimitSec: 600,
    budget: 1000,
    who: 'Mr. A., 16-year-old student, woken from sleep three hours ago by sudden severe left testicular pain, followed by vomiting. There is no history of trauma, no urinary symptoms and no previous similar episode.',
    history: [
      'Sudden onset of severe left testicular pain at 2 am, waking him from sleep.',
      'Two episodes of vomiting; pain radiates to the left groin and lower abdomen.',
      'No trauma, no heavy lifting, no sexual activity, no dysuria or discharge.',
      'No previous episodes, no urinary tract infections, no undescended testis.',
      'No fever, no rash, no abdominal pain before the onset.'
    ],
    exam: [
      'Uncomfortable and pale, lying still with the legs drawn up. GCS 15.',
      'Pulse 108, BP 124/74, respiratory rate 20, SpO2 98%, temperature 37.2 C.',
      '**Left hemiscrotum swollen and exquisitely tender. The left testis is high-riding with a transverse lie and a thickened, tender cord.**',
      '**The left cremasteric reflex is absent**; the right testis is normal. Elevation of the scrotum does not relieve the pain (negative Prehn sign).',
      'Abdomen soft, no guarding, no palpable mass, no hernia. Urine clear.'
    ],
    base: { hr: 108, sbp: 124, dbp: 74, rr: 20, spo2: 98, temp: 37.2, gcs: 15 },
    drift: { hr: 0.4, sbp: -0.3, dbp: -0.2, rr: 0.15, spo2: -0.1, temp: 0.004, gcs: -0.02 },
    decay: 0.24,
    events: [
      { at: 150, need: ['action:refer'], loss: 14, msg: 'The urology or surgical team has not been called. Every minute after six hours of torsion reduces the chance of saving the testis.' },
      { at: 300, need: ['action:analgesia'], loss: 8, msg: 'The pain remains untreated. Severe pain drives tachycardia and delays the examination and consent process.' },
      { at: 430, need: ['test:doppler'], loss: 6, msg: 'No imaging has confirmed the diagnosis. In a clear-cut presentation surgery should already be underway, but you have no record of the findings.' }
    ],
    actions: [
      A('refer', 'Call urology or the general surgeon immediately and book the emergency theatre', 'The testis survives or dies on the clock.', { cost: 0, tat: 5, factor: 0.4, msg: 'Surgeon informed and theatre being prepared. The patient is on the emergency list.' }),
      A('analgesia', 'IV opioid analgesia titrated, with an antiemetic', 'Humane, and it makes examination and consent possible.', { cost: 25, tat: 6, factor: 0.72, msg: 'Pain reduced from 10/10 to 4/10 and the vomiting settled.' }),
      A('access', 'IV access, nil by mouth, baseline bloods, consent for scrotal exploration', 'Prepare the patient while waiting for theatre.', { cost: 20, tat: 8, factor: 0.88, msg: 'Access secured, consent taken for exploration and possible orchidopexy or orchidectomy.' }),
      A('detorse', 'Attempt manual detorsion by an experienced clinician (medial to lateral rotation)', 'Can restore perfusion while theatre is prepared.', { cost: 15, tat: 8, factor: 0.75, msg: 'Manual detorsion attempted: the testis rotated back with immediate partial relief of pain.' }),
      A('support', 'Support the scrotum and keep the patient comfortable; warm blankets', 'Comfort measures only — no delay to theatre.', { cost: 10, tat: 4, factor: 0.95, msg: 'Patient more comfortable while awaiting transfer.' }),
      A('delay', 'Antibiotics and analgesia with review in the morning', 'Treating epididymitis that the patient does not have.', { cost: 60, tat: 8, factor: 1.9, harm: true, msg: 'Empirical antibiotics for presumed epididymitis. At operation six hours later the testis was black and unsalvageable.' }),
      A('scanfirst', 'Wait for the ultrasound report before calling the surgeon', 'In a clear-cut torsion, imaging only adds delay.', { cost: 0, tat: 6, factor: 1.4, harm: true, msg: 'The report came back 70 minutes later confirming absent flow. The delay cost salvage probability that cannot be recovered.' }),
      A('ice', 'Apply ice and elevate the scrotum, then reassess', 'Elevation and cooling are for epididymitis.', { cost: 10, tat: 5, factor: 1.6, harm: true, msg: 'Ice and elevation brought no relief and delayed definitive treatment by an hour.' }),
      A('catheter', 'Catheterise to exclude a urinary cause', 'An unnecessary and painful distraction.', { cost: 20, tat: 8, factor: 1.3, harm: true, msg: 'Catheterisation was traumatic, revealed clear urine, and added nothing but delay and distress.' })
    ],
    tests: [
      T('doppler', 'Doppler ultrasound of the scrotum', 'Imaging', 260, 40, '**Absent or markedly reduced arterial flow in the left testis with a spiral twist of the cord and a homogeneous swollen testis.** The right testis is normal — but surgery must not wait for this report.', { flag: 'critical', factor: 0.8 }),
      T('dip', 'Urine dipstick and microscopy', 'Bedside', 12, 8, 'Clear with no blood, no nitrites, no leucocytes. Argues strongly against epididymitis and urinary infection.', { flag: 'normal', factor: 0.95 }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'WBC 11.4 with mild neutrophilia, Hb 14.6, platelets 280 — a stress response, not proof of infection.', { flag: 'abnormal' }),
      T('crp', 'CRP', 'Bloods', 50, 35, '18 mg/L — mildly raised. Infection and infarction both raise it; it does not separate them.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Normal — as a pre-operative baseline.', { flag: 'normal' }),
      T('markers', 'Tumour markers (beta-hCG, AFP, LDH)', 'Bloods', 260, 60, 'All normal. Testicular tumours present as a painless mass, not an acute painful swelling.', { flag: 'normal' }),
      T('group', 'Blood group and save', 'Bloods', 40, 35, 'O positive, antibody screen negative. Available if orchidectomy becomes necessary.', { flag: 'normal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 104 with no other abnormality — normal pre-operative baseline.', { flag: 'normal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Normal. Part of the pre-operative assessment in some centres.', { flag: 'normal' }),
      T('culture', 'Urine culture and sexually transmitted infection screen', 'Microbiology', 150, 90, 'No growth; chlamydia and gonorrhoea negative. Relevant follow-up but never a reason to delay surgery.', { flag: 'normal' }),
      T('ct', 'CT abdomen and pelvis', 'Imaging', 620, 90, 'Normal testes and cord but exposes a 16-year-old to a substantial radiation dose and delays theatre by over an hour.', { flag: 'abnormal' })
    ],
    hints: [
      'Sudden severe pain, a high-riding transversely lying testis and an absent cremasteric reflex is torsion: the surgeon comes before the scanner.',
      'Salvage falls steeply after six hours. Antibiotics for presumed epididymitis is the classic way to lose a testis.'
    ],
    dx: {
      label: 'Acute testicular torsion (left) with a non-viable risk window',
      accept: ['testicular torsion', 'torsion of the testis', 'torted testis', 'spermatic cord torsion', 'acute testicular torsion', 'torsion'],
      reject: [
        { m: ['epididymitis', 'epididymo orchitis', 'orchitis'], msg: 'Epididymitis is gradual, febrile, has a preserved cremasteric reflex and is relieved by elevation. Here the onset was sudden, the testis is high and transverse, and the reflex is absent.' },
        { m: ['appendicitis'], msg: 'Appendicitis causes migratory right iliac fossa pain; here the testis itself is swollen, tender and high-riding.' },
        { m: ['hernia'], msg: 'There is no palpable inguinal swelling or bowel sound in the scrotum.' },
        { m: ['renal colic', 'calculus', 'ureteric'], msg: 'The urine is clear with no blood, and the pain is scrotal rather than loin to groin.' },
        { m: ['urinary tract infection'], msg: 'The urine dipstick and microscopy are clear.' },
        { m: ['varicocele'], msg: 'A varicocele is a soft "bag of worms" above the testis, not an acutely tender high-riding testis.' },
        { m: ['hydrocele'], msg: 'A hydrocele transilluminates and is painless.' },
        { m: ['tumour', 'tumor', 'malignancy'], msg: 'A testicular tumour presents as a painless hard mass; the tumour markers are normal.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Sudden severe pain waking a teenager from sleep, with a high-riding transversely lying testis, an absent cremasteric reflex, vomiting and absent Doppler flow: testicular torsion, where salvage depends on minutes to theatre.'
    },
    differentials: ['Testicular torsion', 'Acute epididymo-orchitis', 'Strangulated inguinal hernia', 'Acute appendicitis', 'Renal colic', 'Testicular tumour', 'Varicocele', 'Hydrocele', 'Urinary tract infection', 'Idiopathic scrotal oedema'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'theatre', label: 'Immediate surgical referral for scrotal exploration, without waiting for imaging', correct: true, msg: 'Exploration is both diagnostic and therapeutic, and the clock is the outcome.' },
        { id: 'detorse2', label: 'Attempt manual detorsion while theatre is prepared', correct: true, msg: 'Can restore perfusion and buy time.' },
        { id: 'pain', label: 'IV opioid analgesia and an antiemetic', correct: true, msg: 'Humane, and it allows examination and consent.' },
        { id: 'prep', label: 'Nil by mouth, IV access, baseline bloods, consent for orchidopexy or orchidectomy', correct: true, msg: 'Prepares the patient so theatre time is not wasted.' },
        { id: 'fix', label: 'At surgery: detorse, assess viability, and fix both testes (bilateral orchidopexy)', correct: true, msg: 'The bell-clapper anomaly is usually bilateral, so both sides are fixed.' },
        { id: 'followup', label: 'Discuss testicular self-examination and future fertility concerns at follow-up', correct: true, msg: 'Important after any episode of torsion.' },
        { id: 'abx2', label: 'Empirical antibiotics for presumed epididymo-orchitis and review in the morning', correct: false, harm: true, msg: 'The classic way to lose a testis: antibiotics for a diagnosis the patient does not have.' },
        { id: 'wait', label: 'Wait for the ultrasound report before calling the surgeon', correct: false, harm: true, msg: 'Imaging must never delay exploration in a clinically clear-cut torsion.' },
        { id: 'ice2', label: 'Ice, elevation and scrotal support, then reassess', correct: false, harm: true, msg: 'Treatments for epididymitis that waste the salvage window.' },
        { id: 'catheter2', label: 'Catheterise to exclude a urinary cause', correct: false, harm: true, msg: 'Painful, unhelpful and time-consuming.' },
        { id: 'discharge2', label: 'Discharge with analgesia and outpatient urology follow-up', correct: false, harm: true, msg: 'Discharging a torsion guarantees a non-viable testis and risks the other side.' }
      ]
    },
    debrief: {
      key: ['Sudden severe testicular pain waking a 16-year-old from sleep, with vomiting.', 'A high-riding, transversely lying, exquisitely tender left testis with an absent cremasteric reflex.', 'Absent Doppler flow in the left testis with a clear urine dipstick.'],
      pearls: ['Testicular torsion is a clinical diagnosis and a surgical emergency: the surgeon comes before the sonographer.', 'Salvage rates fall steeply after six hours and are poor by twelve. Document the time of onset.', 'Fix both testes at exploration — the underlying bell-clapper anomaly is usually bilateral.'],
      pitfalls: ['Treating presumed epididymo-orchitis with antibiotics and review is the classic error.', 'A Doppler scan does not exclude torsion and must never delay exploration.']
    }
  });

})();
