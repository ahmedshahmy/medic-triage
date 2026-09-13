/* =========================================================================
   DocSim — case library (part 12): obstetrics and paediatrics
   A woman bleeding after delivery, and a baby whose gut has telescoped.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 37 — Postpartum haemorrhage
     ======================================================================= */
  window.CASES.push({
    id: 'pph',
    title: 'Heavy bleeding twenty minutes after a normal delivery',
    category: 'Obstetrics',
    difficulty: 'moderate',
    blurb: 'A boggy uterus, an estimated 1200 mL lost, and a pulse of 132 with a blood pressure of 88/54.',
    timeLimitSec: 600,
    budget: 1300,
    who: 'Ms. M., 31-year-old primigravida who delivered a healthy 3.4 kg boy by spontaneous vaginal delivery twenty minutes ago after an uncomplicated labour. The placenta delivered complete, but she has continued to bleed heavily and the estimated loss is now 1200 mL.',
    history: [
      'Normal pregnancy and an uncomplicated spontaneous vaginal delivery twenty minutes ago.',
      'Complete placenta delivered; the uterus feels soft despite initial massage.',
      'No episiotomy, no perineal tear noted, no instrumental delivery.',
      'No previous bleeding disorder, no anticoagulants, no hypertension or pre-eclampsia, no fibroids.',
      'No blood products given; group and save was taken in labour.'
    ],
    exam: [
      'Pale, anxious and increasingly drowsy, GCS 14, with cool clammy peripheries and visible continued vaginal bleeding.',
      '**Pulse 132 thready, BP 88/54**, respiratory rate 24, SpO2 97%, temperature 37.0 C.',
      '**Uterus soft, boggy and above the umbilicus on abdominal palpation** — a uterus that will not contract.',
      '**Tachycardia with a raised JVP and no oedema**; chest clear. Bladder palpable and full.',
      'No perineal or vaginal tear identified on inspection; no retained placental fragments seen.'
    ],
    base: { hr: 132, sbp: 88, dbp: 54, rr: 24, spo2: 97, temp: 37.0, gcs: 14 },
    drift: { hr: 0.6, sbp: -0.8, dbp: -0.42, rr: 0.3, spo2: -0.2, temp: 0.005, gcs: -0.05 },
    decay: 0.31,
    events: [
      { at: 100, need: ['action:oxytocin'], loss: 14, msg: 'No uterotonic has been given. The uterus remains atonic and the bleeding continues — this is the commonest cause of maternal death worldwide and it is treated in minutes.' },
      { at: 230, need: ['action:access'], loss: 14, msg: 'No large-bore access and no crossmatch. Blood loss of this volume needs blood, not crystalloid, and you cannot give it without access.' },
      { at: 350, need: ['action:catheter'], loss: 10, msg: 'The bladder has not been catheterised. A full bladder prevents the uterus from contracting and is an easily missed, easily corrected cause of continued bleeding.' }
    ],
    actions: [
      A('massage', 'Uterine massage and bimanual compression while drugs are drawn up', 'Immediate mechanical control of an atonic uterus.', { cost: 0, tat: 5, factor: 0.5, msg: 'Bimanual compression applied: the uterus is firmer and the bleeding has slowed dramatically.' }),
      A('oxytocin', 'IV oxytocin 5 units slowly, followed by an infusion of 40 units in 500 mL', 'First-line uterotonic for atonic postpartum haemorrhage.', { cost: 80, tat: 6, factor: 0.45, msg: 'Oxytocin given: the uterus is contracting firmly and the bleeding has markedly reduced.' }),
      A('txa', 'Tranexamic acid 1 g IV within three hours of delivery', 'Reduces death from bleeding; it is cheap and it works.', { cost: 40, tat: 6, factor: 0.6, msg: 'Tranexamic acid given within the window — this single cheap drug reduces mortality from postpartum haemorrhage.' }),
      A('access', 'Two large-bore IV lines, full bloods and crossmatch, and activate the massive haemorrhage protocol', 'You need volume, blood and products, fast.', { cost: 25, tat: 8, factor: 0.5, msg: 'Two 14G lines sited, bloods sent and the massive haemorrhage protocol activated.' }),
      A('blood', 'Transfuse blood and blood products, guided by the protocol rather than by the haemoglobin', 'Do not wait for a laboratory number in acute haemorrhage.', { cost: 300, tat: 12, factor: 0.5, msg: 'O-negative blood running while crossmatched units are prepared. The blood pressure is responding.' }),
      A('catheter', 'Catheterise the bladder and empty it', 'A full bladder prevents uterine contraction.', { cost: 20, tat: 8, factor: 0.6, msg: 'Bladder emptied: the uterus is now contracting more effectively and the fundus is descending.' }),
      A('ergometrine', 'Ergometrine or carboprost if oxytocin is insufficient (avoid ergometrine in hypertension)', 'Second-line uterotonics for a uterus that will not contract.', { cost: 90, tat: 8, factor: 0.7, msg: 'Carboprost given: the uterus is now firm and the bleeding has essentially stopped.' }),
      A('theatre', 'Call the senior obstetrician, anaesthetist and theatre for examination under anaesthesia', 'Retained placenta, tears or uterine inversion need theatre.', { cost: 150, tat: 12, factor: 0.8, msg: 'Senior team at the bedside; theatre prepared for examination under anaesthesia if bleeding continues.' }),
      A('wait', 'Observe and reassess in thirty minutes', 'Postpartum haemorrhage kills within the hour.', { cost: 0, tat: 5, factor: 1.8, harm: true, msg: 'Observed rather than treated: the estimated loss reached 2500 mL with a systolic pressure of 70 mmHg and the patient became unresponsive.' }),
      A('crystalloid', 'Two litres of crystalloid instead of blood products', 'Dilutes clotting factors and does not carry oxygen.', { cost: 40, tat: 10, factor: 1.4, harm: true, msg: 'Two litres of crystalloid caused dilutional coagulopathy with ongoing bleeding and no improvement in oxygen delivery.' }),
      A('bolus', 'IV oxytocin 10 units as a rapid undiluted bolus', 'Rapid oxytocin causes profound hypotension and arrhythmia.', { cost: 80, tat: 5, factor: 1.3, harm: true, msg: 'The rapid oxytocin bolus caused profound hypotension and a tachyarrhythmia on top of the haemorrhage.' }),
      A('waithb', 'Wait for the haemoglobin result before deciding about transfusion', 'The haemoglobin lags behind acute loss.', { cost: 0, tat: 6, factor: 1.5, harm: true, msg: 'Waiting for the haemoglobin: the patient deteriorated into decompensated shock while the laboratory processed a sample that underestimated the loss.' })
    ],
    tests: [
      T('fbc', 'Full blood count and crossmatch', 'Bloods', 90, 30, '**Hb 7.2 g/dL** (already low 20 minutes after delivery), platelets 120, WBC 14.0. **Two units of O positive blood are available immediately.** In acute haemorrhage the haemoglobin underestimates the loss.', { flag: 'critical', factor: 0.72 }),
      T('coag', 'Coagulation screen and fibrinogen', 'Bloods', 90, 35, 'PT 15 s, APTT 45 s, **fibrinogen 1.2 g/L** with a raised D-dimer — **a fibrinogen below 2 g/L predicts severe postpartum haemorrhage and the need for blood products.**', { flag: 'critical', factor: 0.72 }),
      T('abg', 'Arterial or venous blood gas with lactate', 'Bloods', 95, 20, 'pH 7.26, Hb 6.9, **lactate 4.4 mmol/L**, base excess -7 — class II to III haemorrhagic shock with a lactic acidosis.', { flag: 'critical', factor: 0.75 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 34 mg/dL, creatinine 1.1 mg/dL, Na 134, K 3.4 — pre-renal, and a baseline before transfusion.', { flag: 'abnormal' }),
      T('uss', 'Pelvic ultrasound', 'Imaging', 260, 45, '**A bulky uterus containing echogenic material suggestive of retained placental tissue**, with no free fluid in the abdomen. Retained tissue prevents contraction and is a common cause of continued bleeding.', { flag: 'abnormal', factor: 0.85 }),
      T('group', 'Blood group and antibody screen, and a full clotting screen', 'Bloods', 40, 30, 'O positive with a negative antibody screen. **The group and save taken in labour has saved twenty minutes.**', { flag: 'abnormal', factor: 0.9 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 130 with no ischaemic change. Useful as a baseline before any uterotonic with cardiovascular effects.', { flag: 'normal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Normal heart size with clear lung fields. A useful baseline if large volumes of fluid and blood are given.', { flag: 'normal' })
    ],
    hints: [
      'Four Ts of postpartum haemorrhage: Tone, Trauma, Tissue, Thrombin. Here the uterus is boggy, so tone is the problem — massage, oxytocin, tranexamic acid and blood.',
      'Do not wait for a haemoglobin result in acute haemorrhage, and do not try to replace blood with crystalloid.'
    ],
    dx: {
      label: 'Primary postpartum haemorrhage from uterine atony with haemorrhagic shock',
      accept: ['postpartum haemorrhage', 'primary postpartum haemorrhage', 'uterine atony', 'atonic postpartum haemorrhage', 'post partum haemorrhage with shock'],
      reject: [
        { m: ['placenta praevia'], msg: 'Placenta praevia causes bleeding before delivery or at caesarean section, not after a normal vaginal delivery with a complete placenta.' },
        { m: ['abruption'], msg: 'Placental abruption bleeds before delivery with a painful, woody uterus and fetal compromise — the baby here is delivered and well.' },
        { m: ['uterine rupture'], msg: 'Uterine rupture occurs in labour, typically with a previous caesarean or obstructed labour, with severe pain and fetal compromise; this was an uncomplicated delivery.' },
        { m: ['disseminated intravascular'], msg: 'Coagulopathy is a consequence of massive haemorrhage, not the primary cause — the fibrinogen of 1.2 reflects consumption from bleeding, and the uterus is boggy.' },
        { m: ['retained placenta'], msg: 'There may be retained tissue, but the immediate problem is an atonic uterus that will not contract. Treat the tone first and examine for retained tissue once bleeding is controlled.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Twenty minutes after an uncomplicated delivery with an estimated 1200 mL loss, a boggy uterus above the umbilicus, a pulse of 132, a blood pressure of 88/54 and a lactate of 4.4: primary postpartum haemorrhage from uterine atony.'
    },
    differentials: ['Primary postpartum haemorrhage from uterine atony', 'Placenta praevia with bleeding', 'Placental abruption', 'Uterine rupture', 'Disseminated intravascular coagulation', 'Retained placental tissue', 'Genital tract tear', 'Uterine inversion', 'Coagulopathy from pre-eclampsia', 'Vaginal laceration'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'mass2', label: 'Uterine massage with bimanual compression', correct: true, msg: 'Immediate mechanical control while drugs take effect.' },
        { id: 'oxy2', label: 'IV oxytocin 5 units slowly then an infusion, with ergometrine or carboprost as second-line', correct: true, msg: 'Uterotonics are the definitive medical treatment for atony.' },
        { id: 'txa2', label: 'Tranexamic acid 1 g IV within three hours of delivery', correct: true, msg: 'Cheap, safe and reduces death from bleeding.' },
        { id: 'transfuse', label: 'Two large-bore lines, crossmatch and blood products guided by a massive haemorrhage protocol', correct: true, msg: 'Blood, not crystalloid, and do not wait for the haemoglobin.' },
        { id: 'empty', label: 'Catheterise and empty the bladder', correct: true, msg: 'A full bladder prevents contraction and is easy to miss.' },
        { id: 'theatre2', label: 'Escalate to the senior obstetrician and theatre for examination under anaesthesia, and consider balloon tamponade, uterine artery embolisation or hysterectomy', correct: true, msg: 'A stepwise escalation plan for bleeding that does not stop.' },
        { id: 'mon5', label: 'Monitor pulse, blood pressure, urine output, coagulation and blood gases throughout', correct: true, msg: 'Coagulopathy develops quickly and should be tracked, not assumed.' },
        { id: 'observe3', label: 'Observe and reassess in thirty minutes', correct: false, harm: true, msg: 'Postpartum haemorrhage kills within the hour; observation is not a treatment.' },
        { id: 'cryst', label: 'Two litres of crystalloid instead of blood products', correct: false, harm: true, msg: 'Crystalloid dilutes clotting factors, worsens coagulopathy and does not carry oxygen.' },
        { id: 'push', label: 'IV oxytocin 10 units as a rapid bolus', correct: false, harm: true, msg: 'Rapid oxytocin causes profound hypotension and arrhythmia in a patient who is already shocked.' },
        { id: 'waithb2', label: 'Wait for the haemoglobin result before transfusing', correct: false, harm: true, msg: 'The haemoglobin lags behind acute blood loss and underestimates it badly.' },
        { id: 'ergot', label: 'Ergometrine as the first-line drug in a patient with pre-eclampsia', correct: false, harm: true, msg: 'Ergometrine causes hypertension and is contraindicated in pre-eclampsia — check the blood pressure before choosing it.' }
      ]
    },
    debrief: {
      key: ['Twenty minutes after an uncomplicated vaginal delivery with a complete placenta, an estimated 1200 mL of blood lost.', 'A boggy uterus above the umbilicus with a pulse of 132 and a blood pressure of 88/54.', 'Hb 7.2 g/dL with a fibrinogen of 1.2 g/L and a lactate of 4.4; ultrasound shows retained echogenic tissue.'],
      pearls: ['Work through the four Ts in order: Tone, Trauma, Tissue, Thrombin — atony is by far the commonest.', 'Tranexamic acid within three hours, oxytocin as the first uterotonic, and blood rather than crystalloid.', 'A full bladder prevents the uterus from contracting: catheterise early.'],
      pitfalls: ['Waiting for a haemoglobin result or replacing blood with crystalloid both worsen the outcome.', 'Ergometrine is contraindicated in pre-eclampsia, and a rapid oxytocin bolus causes profound hypotension.']
    }
  });

  /* =======================================================================
     CASE 38 — Intussusception in an infant
     ======================================================================= */
  window.CASES.push({
    id: 'intussusception',
    title: 'A nine-month-old with screaming episodes and redcurrant-jelly stool',
    category: 'Paediatrics',
    difficulty: 'moderate',
    blurb: 'Twelve hours of intermittent inconsolable crying with leg drawing-up, now lethargic with a sausage-shaped mass.',
    timeLimitSec: 600,
    budget: 1100,
    who: 'Baby O., a nine-month-old boy brought in by his mother. Twelve hours ago he began having episodes of inconsolable screaming every twenty minutes, drawing his legs up to his abdomen, and he has vomited several times. He has become increasingly lethargic, and his mother noticed a dark red, jelly-like stool in his nappy an hour ago.',
    history: [
      'Twelve hours of intermittent, severe, colicky pain with drawing up of the legs, every 20 minutes.',
      'Repeated non-bilious vomiting that has become bile-stained in the last two hours.',
      '**A single episode of redcurrant-jelly stool an hour ago.**',
      'No diarrhoea, no fever initially, no rash, no cough or coryza, no contact with illness.',
      'Born at term, no previous surgery, no chronic illness, immunisations up to date, feeding normally until today.'
    ],
    exam: [
      'Lethargic and pale, **GCS 13**, whimpering, with cool peripheries and a capillary refill of 4 seconds.',
      '**Heart rate 178, blood pressure 84/50, respiratory rate 42**, SpO2 97%, temperature 37.6 C.',
      '**A firm, sausage-shaped mass palpable in the right upper quadrant with an empty right iliac fossa (Dance sign).**',
      'Abdomen distended and tender with guarding but no rigidity, and no hepatosplenomegaly. Bowel sounds high-pitched and tinkling.',
      '**A blood-stained nappy with jelly-like stool.** No rash, no petechiae, no neck stiffness, fontanelle flat.'
    ],
    base: { hr: 178, sbp: 84, dbp: 50, rr: 42, spo2: 97, temp: 37.6, gcs: 13 },
    drift: { hr: 0.5, sbp: -0.6, dbp: -0.35, rr: 0.3, spo2: -0.25, temp: 0.008, gcs: -0.06 },
    decay: 0.3,
    events: [
      { at: 110, need: ['action:fluids'], loss: 14, msg: 'No fluid resuscitation. This infant is shocked from vomiting, third-space loss and bowel ischaemia — a 20 mL/kg bolus is needed before any procedure.' },
      { at: 240, need: ['action:refer'], loss: 14, msg: 'The surgical team has not been called. The bowel is ischaemic with every hour of delay, and reduction is far safer than resection.' },
      { at: 360, need: ['test:uss'], loss: 8, msg: 'No ultrasound. The target sign confirms the diagnosis and excludes the mimics, and it takes five minutes at the bedside.' }
    ],
    actions: [
      A('fluids', 'IV or intraosseous access with a 20 mL/kg isotonic bolus for shock, then reassess', 'The infant is shocked and needs volume before any intervention.', { cost: 20, tat: 8, factor: 0.5, msg: 'A 20 mL/kg bolus given: the heart rate has fallen to 150 and the perfusion is improving.' }),
      A('refer', 'Call the paediatric surgical team and prepare for pneumatic or hydrostatic reduction', 'Non-operative reduction is first-line when the bowel is viable.', { cost: 0, tat: 6, factor: 0.5, msg: 'Surgical team informed and the radiology suite alerted for a contrast or air enema.' }),
      A('ngtube', 'Nasogastric tube on free drainage and keep the infant nil by mouth', 'Decompresses the obstructed bowel and reduces vomiting.', { cost: 20, tat: 8, factor: 0.7, msg: 'Nasogastric tube on free drainage with bilious aspirate; the distension is easing.' }),
      A('analgesia', 'IV opioid analgesia titrated to comfort', 'Humane, and it permits examination and transport.', { cost: 15, tat: 6, factor: 0.75, msg: 'Pain controlled with titrated opioid and the infant is settled between episodes.' }),
      A('monitor', 'Paediatric monitoring, keep warm, check and maintain glucose, hourly urine output', 'Infants decompensate fast and hypoglycaemia is common.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring in place, glucose 4.6 mmol/L, infant kept warm.' }),
      A('surgery', 'Prepare for laparotomy if reduction fails, there is perforation or peritonitis is present', 'Around one in ten needs surgery.', { cost: 0, tat: 10, factor: 0.6, msg: 'Theatre prepared and consent discussed in the event that reduction fails or the bowel is not viable.' }),
      A('oral', 'Oral rehydration and observation with a repeat examination in four hours', 'Untreated intussusception leads to ischaemia and perforation.', { cost: 0, tat: 6, factor: 1.6, harm: true, msg: 'Oral fluids given to an obstructed infant: vomiting and aspiration followed, and the obstruction progressed.' }),
      A('abx', 'Antibiotics for presumed gastroenteritis and review on the ward', 'The classic misdiagnosis of intussusception.', { cost: 60, tat: 8, factor: 1.7, harm: true, msg: 'Treated as gastroenteritis: by the next review the infant had peritonitis and required bowel resection for necrotic intestine.' }),
      A('waitmorning', 'Wait for the radiology department to open in the morning', 'Delay converts a reducible intussusception into a resection.', { cost: 0, tat: 6, factor: 1.6, harm: true, msg: 'Waiting overnight: the infant developed a fever, rigidity and free air — perforation of ischaemic bowel.' }),
      A('enemaonly', 'Contrast enema without any resuscitation first', 'Reduction in a shocked infant is dangerous.', { cost: 200, tat: 12, factor: 1.3, harm: true, msg: 'Reduction attempted before resuscitation: the infant became more tachycardic and hypotensive during the procedure, which had to be abandoned.' })
    ],
    tests: [
      T('uss', 'Abdominal ultrasound', 'Imaging', 260, 30, '**A target (doughnut) sign with a pseudokidney appearance in the right upper quadrant — a classic ileocolic intussusception** measuring 3.5 cm. No free fluid and no free air.', { flag: 'critical', factor: 0.7 }),
      T('enema', 'Air or contrast enema (diagnostic and therapeutic)', 'Imaging', 400, 40, '**Intussusception at the hepatic flexure, successfully reduced hydrostatically with free reflux of contrast into the terminal ileum.** Reduction is first-line when the bowel is viable and there is no perforation or peritonitis.', { flag: 'critical', factor: 0.6 }),
      T('axr', 'Abdominal X-ray (erect and supine)', 'Imaging', 90, 25, '**Paucity of gas in the right iliac fossa with a soft tissue mass and a target sign; no free air under the diaphragm and no dilated loops of bowel.** Excludes perforation, which would contraindicate enema reduction.', { flag: 'abnormal', factor: 0.85 }),
      T('abg', 'Blood gas and lactate', 'Bloods', 95, 20, 'pH 7.30, **lactate 3.2 mmol/L**, base excess -5, glucose 4.6 mmol/L — a metabolic acidosis from hypoperfusion and bowel ischaemia.', { flag: 'critical', factor: 0.82 }),
      T('fbc', 'Full blood count', 'Bloods', 45, 25, '**Hb 9.8 g/dL** (low for a nine-month-old), WBC 16.4 with neutrophilia, platelets 380 — a stress response and possible early ischaemia.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 30, 'Na 132, K 3.4, urea 28 mg/dL, creatinine 0.4 mg/dL, bicarbonate 17 — dehydration and vomiting losses with a mild acidosis.', { flag: 'abnormal' }),
      T('group', 'Blood group and save', 'Bloods', 40, 30, 'O positive, antibody screen negative. Taken because surgery is a possibility.', { flag: 'normal' }),
      T('crp', 'CRP', 'Bloods', 50, 30, '22 mg/L — mildly raised. Does not distinguish between an early ischaemic bowel and gastroenteritis.', { flag: 'abnormal' }),
      T('dip', 'Urine dipstick and microscopy', 'Bedside', 12, 8, 'No nitrites, no leucocytes, no blood. Excludes a urinary infection as a cause of the pain and vomiting.', { flag: 'normal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. Taken because a septic infant can present with lethargy, but the diagnosis here is mechanical.', { flag: 'normal' })
    ],
    hints: [
      'Colicky pain with leg drawing-up, bilious vomiting, a sausage-shaped mass and redcurrant-jelly stool is intussusception: resuscitate, then reduce.',
      'Resuscitate before any enema, and never treat it as gastroenteritis — delay means ischaemic bowel and resection.'
    ],
    dx: {
      label: 'Ileocolic intussusception in an infant with dehydration and shock',
      accept: ['intussusception', 'ileocolic intussusception', 'intussusception with shock', 'bowel intussusception'],
      reject: [
        { m: ['gastroenteritis'], msg: 'Gastroenteritis causes diarrhoea, not intermittent screaming with a sausage-shaped mass, an empty right iliac fossa and redcurrant-jelly stool.' },
        { m: ['pyloric stenosis'], msg: 'Pyloric stenosis presents at three to six weeks with projectile non-bilious vomiting and a palpable olive; this infant is nine months old with bilious vomiting and a right upper quadrant mass.' },
        { m: ['appendicitis'], msg: 'Appendicitis in an infant is rare and does not cause episodic screaming with a sausage-shaped mass and jelly stool.' },
        { m: ['malrotation', 'volvulus'], msg: 'Malrotation with volvulus causes bilious vomiting and shock but usually in the first weeks of life, without a sausage-shaped mass or redcurrant-jelly stool.' },
        { m: ['hirschsprung'], msg: 'Hirschsprung disease presents with delayed passage of meconium and chronic constipation from birth, not acute episodic pain with a mass at nine months.' },
        { m: ['inguinal hernia'], msg: 'There is no inguinal or scrotal swelling; the mass is intra-abdominal in the right upper quadrant.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'A nine-month-old with 12 hours of episodic colicky pain, bilious vomiting, lethargy, a sausage-shaped right upper quadrant mass, an empty right iliac fossa and redcurrant-jelly stool, confirmed on ultrasound and reduced hydrostatically.'
    },
    differentials: ['Ileocolic intussusception', 'Acute gastroenteritis', 'Pyloric stenosis', 'Acute appendicitis', 'Malrotation with volvulus', 'Hirschsprung disease with obstruction', 'Strangulated inguinal hernia', 'Urinary tract infection', 'Testicular torsion', 'Henoch-Schonlein purpura with intussusception'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'resus', label: 'IV or intraosseous access with 20 mL/kg isotonic fluid for shock, then reassess', correct: true, msg: 'The infant must be resuscitated before any procedure.' },
        { id: 'redu', label: 'Non-operative reduction by air or contrast enema once stable, if there is no perforation or peritonitis', correct: true, msg: 'Successful in most cases, and it avoids laparotomy.' },
        { id: 'surg2', label: 'Surgical referral with preparation for laparotomy if reduction fails or the bowel is non-viable', correct: true, msg: 'Around one in ten needs surgery.' },
        { id: 'ng2', label: 'Nasogastric decompression and nil by mouth', correct: true, msg: 'Relieves the obstruction and reduces aspiration risk.' },
        { id: 'pain', label: 'Adequate analgesia with titrated opioid', correct: true, msg: 'Humane, and it allows a proper examination.' },
        { id: 'mon2', label: 'Paediatric monitoring: temperature, glucose, urine output and careful fluid balance', correct: true, msg: 'Infants decompensate quickly and hypoglycaemia is common.' },
        { id: 'watch', label: 'Observe for recurrence over the next 24 hours after successful reduction', correct: true, msg: 'Recurrence occurs in around one in ten, usually within 24 hours.' },
        { id: 'po', label: 'Oral rehydration and observation with a repeat examination in four hours', correct: false, harm: true, msg: 'Feeding an obstructed infant causes vomiting, aspiration and progressive ischaemia.' },
        { id: 'abx2', label: 'Antibiotics for presumed gastroenteritis with review on the ward', correct: false, harm: true, msg: 'The classic misdiagnosis: delay leads to necrotic bowel and resection.' },
        { id: 'wait2', label: 'Wait until the morning for the radiology department', correct: false, harm: true, msg: 'Hours of delay convert a reducible intussusception into a perforation.' },
        { id: 'enema2', label: 'Attempt enema reduction before any resuscitation', correct: false, harm: true, msg: 'Reduction in a shocked infant risks cardiovascular collapse and perforation.' },
        { id: 'ster3', label: 'Corticosteroids for the suspected Henoch-Schonlein purpura', correct: false, harm: true, msg: 'There is no purpuric rash, and steroids delay the reduction that this infant needs.' }
      ]
    },
    debrief: {
      key: ['Nine-month-old with 12 hours of episodic screaming with leg drawing-up, bilious vomiting and a single redcurrant-jelly stool.', 'Lethargic and shocked with a pulse of 178, plus a sausage-shaped right upper quadrant mass and an empty right iliac fossa.', 'Ultrasound shows a target sign; lactate 3.2 and a mild acidosis from bowel ischaemia.'],
      pearls: ['The triad of colicky pain, a sausage-shaped mass and redcurrant-jelly stool is classic — but all three are present in fewer than half of cases.', 'Resuscitate before reducing: shocked infants tolerate the enema badly.', 'Air or contrast enema reduction is first-line and successful in most infants; surgery is for failure, perforation or non-viable bowel.'],
      pitfalls: ['Treating it as gastroenteritis is the classic error and leads to bowel resection.', 'Delay overnight converts a reducible intussusception into a perforation.']
    }
  });

})();
