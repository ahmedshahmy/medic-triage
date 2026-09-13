/* =========================================================================
   DocSim — case library (part 8): neurology and neurotoxicity
   Fever with a changing brain, a blocked vessel, and too much serotonin.
   ========================================================================= */
window.CASES = window.CASES || [];

(function () {
  'use strict';

  const A = (id, label, sub, o) => Object.assign(
    { id, label, sub, cost: 0, tat: 6, factor: 1, harm: false, msg: '' }, o || {});
  const T = (id, name, cat, cost, tat, result, o) => Object.assign(
    { id, name, cat, cost, tat, result, flag: '', factor: 1, harm: '' }, o || {});

  /* =======================================================================
     CASE 26 — Herpes simplex encephalitis
     ======================================================================= */
  window.CASES.push({
    id: 'hse',
    title: 'Fever, strange smells and a personality change',
    category: 'Neurology / Infectious disease',
    difficulty: 'moderate',
    blurb: 'Three days of fever and headache, now smelling burning rubber, behaving oddly and having focal seizures.',
    timeLimitSec: 600,
    budget: 2200,
    who: 'Mr. K., 41-year-old accountant. Three days of fever, severe headache and malaise. His wife says he has become irritable and has been speaking nonsense; yesterday he complained repeatedly of the smell of burning rubber that nobody else could detect, and this morning he had a seizure affecting the right arm.',
    history: [
      'Three days of fever, headache and malaise, initially attributed to flu.',
      'Progressive behavioural change: irritability, confusion, inappropriate speech and disorientation.',
      '**Olfactory hallucinations — the smell of burning rubber — and a distorted sense of taste.**',
      'A focal motor seizure of the right arm this morning lasting two minutes, with a second episode in the ambulance.',
      'No recent travel, no rash, no ear infection, no immunosuppression, no cold sores noted.'
    ],
    exam: [
      'Drowsy and disorientated, GCS 13, with fluent but nonsensical speech and **a mild right-sided weakness** with an upgoing right plantar.',
      '**Temperature 38.9 C**, pulse 104, BP 132/78, respiratory rate 20, SpO2 96%.',
      'Mild neck stiffness but no photophobia and no rash. Fundi normal, no papilloedema.',
      'No focal cranial nerve palsy, no lymphadenopathy, no splenomegaly.',
      'No needle marks, no rash, no meningococcal purpura.'
    ],
    base: { hr: 104, sbp: 132, dbp: 78, rr: 20, spo2: 96, temp: 38.9, gcs: 13 },
    drift: { hr: 0.4, sbp: -0.4, dbp: -0.25, rr: 0.2, spo2: -0.2, temp: 0.012, gcs: -0.06 },
    decay: 0.27,
    events: [
      { at: 120, need: ['action:aciclovir'], loss: 16, msg: 'Aciclovir has not been started. Untreated herpes simplex encephalitis has a mortality above 70%, and the benefit falls with every hour of delay.' },
      { at: 260, need: ['action:seizure'], loss: 10, msg: 'No anticonvulsant cover. The patient has had a further focal seizure with secondary generalisation.' },
      { at: 400, need: ['test:lp'], loss: 8, msg: 'No cerebrospinal fluid has been obtained. The diagnosis and the decision to continue 14 days of treatment rest on the CSF.' }
    ],
    actions: [
      A('aciclovir', 'IV aciclovir 10 mg/kg eight-hourly, started immediately — do not wait for imaging or the lumbar puncture', 'The single intervention that changes survival.', { cost: 300, tat: 8, factor: 0.38, msg: 'Aciclovir running within 25 minutes of arrival. Viral replication is being halted while the investigations catch up.' }),
      A('seizure', 'IV lorazepam for ongoing seizures, with airway protection and oxygen', 'Focal seizures are common and drive cerebral injury.', { cost: 20, tat: 6, factor: 0.65, msg: 'Seizure terminated with lorazepam; the airway is protected and the saturations are maintained.' }),
      A('fluids', 'IV fluids — use isotonic saline and avoid hypotonic fluids', 'Hyponatraemia from SIADH is common and worsens cerebral oedema.', { cost: 20, tat: 8, factor: 0.85, msg: 'Careful isotonic fluids running with electrolytes monitored.' }),
      A('monitor', 'Continuous monitoring with hourly neurological observations and an escalation plan', 'The conscious level is the best monitor of cerebral inflammation.', { cost: 20, tat: 8, factor: 0.85, msg: 'Neuro-observations charted with a clear escalation threshold.' }),
      A('nopressor', 'Avoid sedatives and hypotonic fluids; nurse the head up at 30 degrees', 'Prevents avoidable rises in intracranial pressure.', { cost: 0, tat: 6, factor: 0.9, msg: 'Nursed head-up and no sedating drugs given.' }),
      A('delay', 'Wait for the MRI and lumbar puncture results before starting aciclovir', 'Imaging must never delay aciclovir in suspected HSV encephalitis.', { cost: 0, tat: 6, factor: 1.8, harm: true, msg: 'Aciclovir withheld for the scan: the patient deteriorated to GCS 10 with further seizures during the wait.' }),
      A('steroidonly', 'IV dexamethasone as the main treatment', 'Steroids are not recommended in HSV encephalitis.', { cost: 25, tat: 6, factor: 1.35, harm: true, msg: 'Steroid given: immunosuppression during uncontrolled viral replication, without an evidence base in HSV encephalitis.' }),
      A('abxonly', 'IV ceftriaxone alone for presumed bacterial meningitis', 'Covers the wrong organism entirely.', { cost: 60, tat: 6, factor: 1.5, harm: true, msg: 'Bacterial cover without aciclovir: the herpes virus continues to destroy the temporal lobes.' }),
      A('lpnow', 'Perform a lumbar puncture immediately in a patient with focal signs and a falling conscious level', 'Focal deficit plus reduced GCS means image first.', { cost: 180, tat: 10, factor: 1.4, harm: true, msg: 'Lumbar puncture performed before imaging in a patient with focal signs and reduced consciousness — a herniation risk with a deteriorating conscious level afterwards.' }),
      A('discharge', 'Discharge with analgesia and migraine treatment', 'A lethal misdiagnosis in a febrile encephalopathic patient.', { cost: 0, tat: 5, factor: 1.9, harm: true, msg: 'Discharged as a migraine, the patient returned obtunded 12 hours later with a fixed deficit.' })
    ],
    tests: [
      T('mri', 'MRI brain with contrast', 'Imaging', 900, 80, '**Bilateral asymmetric temporal and inferior frontal T2/FLAIR hyperintensity with contrast enhancement and mild swelling, sparing the basal ganglia.** This is the radiological signature of herpes simplex encephalitis.', { flag: 'critical', factor: 0.72 }),
      T('lp', 'Lumbar puncture and CSF analysis (including HSV PCR)', 'Bedside', 250, 60, 'Opening pressure raised. **CSF: WBC 140/mm3 (95% lymphocytes), RBC 400/mm3, protein 90 mg/dL, glucose 3.6 mmol/L (CSF:blood 0.65), Gram stain and bacterial culture negative, HSV-1 PCR POSITIVE.**', { flag: 'critical', factor: 0.72 }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 60, 'Mild temporal lobe hypodensity with loss of grey-white differentiation; no haemorrhage, no mass effect, no hydrocephalus. Often normal early, and its main job is to exclude a contraindication to lumbar puncture.', { flag: 'abnormal', factor: 0.9 }),
      T('glucose2', 'Capillary and laboratory glucose', 'Bedside', 10, 6, '5.8 mmol/L — normal. Hypoglycaemia is excluded as a cause of the encephalopathy.', { flag: 'normal' }),
      T('eeg', 'Electroencephalogram', 'Special', 400, 90, 'Generalised slowing with **periodic lateralised epileptiform discharges over the left temporal region** — a strongly supportive, though not diagnostic, finding.', { flag: 'abnormal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'WBC 12.6 with lymphocytosis, Hb 13.8, platelets 250.', { flag: 'abnormal' }),
      T('crp', 'CRP', 'Bloods', 50, 35, '62 mg/L — mildly raised. The CRP is typically lower in viral encephalitis than in bacterial meningitis of similar severity.', { flag: 'abnormal' }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 40, 'Na 129, K 3.8, urea 28 mg/dL, creatinine 0.9 mg/dL — **mild hyponatraemia from SIADH**, which can worsen seizures and cerebral oedema.', { flag: 'abnormal' }),
      T('hiv', 'HIV test with consent', 'Bloods', 60, 60, 'Negative. Reasonable in any patient with an unusual CNS infection.', { flag: 'normal' }),
      T('bc', 'Blood cultures', 'Microbiology', 120, 120, 'No growth. Excludes bacteraemia and supports the diagnosis of a primarily CNS viral infection.', { flag: 'normal' }),
      T('tox', 'Toxicology screen', 'Microbiology', 130, 90, 'Negative for alcohol, stimulants, opioids, cannabinoids and tricyclics. Excludes a toxic cause for the encephalopathy.', { flag: 'normal' }),
      T('autoimmune', 'Autoimmune encephalitis antibody panel', 'Special', 400, 120, 'Negative. Anti-NMDA receptor encephalitis is a genuine mimic, but the HSV PCR is positive and the imaging is typical.', { flag: 'normal' })
    ],
    hints: [
      'Fever, personality change, olfactory hallucinations, focal seizures and temporal lobe imaging — start aciclovir now, not after the scan.',
      'Focal signs with a reduced conscious level mean image before you perform a lumbar puncture.'
    ],
    dx: {
      label: 'Herpes simplex encephalitis with temporal lobe involvement',
      accept: ['herpes simplex encephalitis', 'hsv encephalitis', 'viral encephalitis', 'herpes encephalitis', 'encephalitis due to herpes simplex virus'],
      reject: [
        { m: ['bacterial meningitis', 'meningococcal', 'pneumococcal'], msg: 'The CSF is lymphocytic with red cells and a normal glucose, Gram stain and culture are negative, and the MRI shows temporal lobe change: this is viral encephalitis, not bacterial meningitis.' },
        { m: ['migraine'], msg: 'Migraine does not cause fever, focal seizures, a lymphocytic CSF and temporal lobe imaging change.' },
        { m: ['tuberculous', 'tuberculosis'], msg: 'Tuberculous meningitis is a subacute illness over weeks with a low CSF glucose and a lymphocytic picture; here the PCR is positive for HSV-1.' },
        { m: ['autoimmune'], msg: 'Anti-NMDA receptor encephalitis is a real mimic, but it does not give red cells in the CSF with a positive HSV PCR and classic temporal lobe imaging.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Fever, headache and behavioural change with olfactory hallucinations, focal seizures, a mild hemiparesis, lymphocytic CSF with red cells and a positive HSV-1 PCR, and bilateral temporal lobe change on MRI.'
    },
    differentials: ['Herpes simplex encephalitis', 'Bacterial meningitis', 'Tuberculous meningitis', 'Autoimmune (anti-NMDA receptor) encephalitis', 'Acute ischaemic stroke', 'Migraine with aura', 'Brain abscess', 'Subarachnoid haemorrhage', 'Metabolic encephalopathy', 'Status epilepticus of other cause'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'aci', label: 'IV aciclovir 10 mg/kg eight-hourly for 14-21 days, started immediately', correct: true, msg: 'Mortality falls from over 70% to around 20% with early treatment.' },
        { id: 'seiz2', label: 'Treat seizures with benzodiazepines and consider anticonvulsant cover', correct: true, msg: 'Seizures are common and worsen cerebral injury.' },
        { id: 'icu', label: 'High-dependency or intensive care with neurological observations and a cerebral oedema plan', correct: true, msg: 'Conscious level, seizures and sodium all need close watching.' },
        { id: 'sodium', label: 'Monitor and treat the hyponatraemia carefully with isotonic fluids', correct: true, msg: 'SIADH is common and hyponatraemia worsens seizures and oedema.' },
        { id: 'headup', label: 'Nurse head-up, avoid hypotonic fluids and avoid sedation where possible', correct: true, msg: 'Reduces avoidable intracranial pressure.' },
        { id: 'lp2', label: 'Obtain CSF after imaging, with bacterial cover until the CSF results return', correct: true, msg: 'Bacterial meningitis and HSV encephalitis overlap clinically, so cover both until the results are back.' },
        { id: 'rehab', label: 'Plan neurorehabilitation and neuropsychology follow-up', correct: true, msg: 'Survivors commonly have memory and behavioural sequelae.' },
        { id: 'wait3', label: 'Withhold aciclovir until the PCR result is available', correct: false, harm: true, msg: 'The PCR takes hours to days. Treatment must start on suspicion — delay costs lives and function.' },
        { id: 'ster', label: 'High-dose corticosteroids as the primary treatment', correct: false, harm: true, msg: 'Not recommended in HSV encephalitis, and immunosuppression during viral replication may worsen the outcome.' },
        { id: 'cef', label: 'Ceftriaxone alone for presumed bacterial meningitis', correct: false, harm: true, msg: 'Leaves the actual organism untreated.' },
        { id: 'lp3', label: 'Immediate lumbar puncture before imaging despite focal signs and a reduced conscious level', correct: false, harm: true, msg: 'Focal deficit plus reduced GCS means image first: herniation is a real risk.' },
        { id: 'home', label: 'Discharge with a diagnosis of viral illness and review in a week', correct: false, harm: true, msg: 'Discharging a febrile encephalopathic patient is a fatal error.' }
      ]
    },
    debrief: {
      key: ['Fever and headache with personality change and olfactory hallucinations.', 'A focal motor seizure with a mild right hemiparesis and GCS 13.', 'CSF: 140 lymphocytes with 400 red cells, normal glucose, HSV-1 PCR positive; MRI shows bilateral temporal lobe change.'],
      pearls: ['Suspected HSV encephalitis gets aciclovir immediately — the decision is clinical, not radiological or virological.', 'Olfactory hallucinations, bizarre behaviour and focal seizures point at the temporal lobe.', 'Insertional red cells with a lymphocytic pleocytosis and a normal glucose is the classic CSF signature.'],
      pitfalls: ['Waiting for imaging or PCR before starting aciclovir is the classic fatal delay.', 'Lumbar puncture before imaging in a patient with focal signs and a reduced conscious level risks herniation.']
    }
  });

  /* =======================================================================
     CASE 27 — Acute ischaemic stroke in the thrombolysis window
     ======================================================================= */
  window.CASES.push({
    id: 'stroke',
    title: 'Sudden weakness and loss of speech ninety minutes ago',
    category: 'Neurology',
    difficulty: 'moderate',
    blurb: 'Right arm and leg heavy, speech lost, in atrial fibrillation and not anticoagulated — still inside the window.',
    timeLimitSec: 600,
    budget: 2400,
    who: 'Mr. H., 71-year-old retired joiner with permanent atrial fibrillation, not anticoagulated because of a previous duodenal ulcer bleed. Ninety minutes ago he suddenly developed right-sided weakness and was unable to speak. His wife called an ambulance immediately and he arrives with a pre-alert.',
    history: [
      'Sudden onset of right arm and leg weakness and loss of speech 90 minutes before arrival, while watching television.',
      'No headache, no vomiting, no seizure, no head injury and no loss of consciousness.',
      'Known atrial fibrillation for eight years, no anticoagulation after a previous gastrointestinal bleed. Also on ramipril and atorvastatin.',
      'No previous stroke or transient ischaemic attack, no recent surgery or bleeding, no active ulcer symptoms.',
      'Lives independently, drives, and his wife confirms he was completely well yesterday.'
    ],
    exam: [
      'Alert but **globally dysphasic with a dense right-sided hemiparesis affecting face, arm and leg**, and a right homonymous hemianopia. GCS 14 (E4 V2 M6).',
      'Pulse 96 irregularly irregular, **BP 176/92**, respiratory rate 18, SpO2 96%, temperature 36.8 C.',
      'NIHSS estimated at 16. Capillary glucose 6.4 mmol/L.',
      'No neck stiffness, no rash, no carotid bruit, heart sounds irregular with no murmur.',
      'No evidence of trauma, no external marks, no anticoagulant medication in his bag.'
    ],
    base: { hr: 96, sbp: 176, dbp: 92, rr: 18, spo2: 96, temp: 36.8, gcs: 14 },
    drift: { hr: 0.3, sbp: -0.5, dbp: -0.3, rr: 0.2, spo2: -0.2, temp: 0.008, gcs: -0.05 },
    decay: 0.26,
    events: [
      { at: 110, need: ['action:pathway'], loss: 14, msg: 'The stroke thrombolysis pathway has not been activated. Every minute of untreated large-vessel occlusion costs nearly two million neurons.' },
      { at: 240, need: ['test:ct'], loss: 12, msg: 'No CT head has been done. You cannot thrombolyse without excluding haemorrhage, and the treatment window is closing.' },
      { at: 380, need: ['action:thrombolysis'], loss: 14, msg: 'Thrombolysis has not been given and the window is nearly closed. This patient has a disabling deficit with a normal CT.' }
    ],
    actions: [
      A('pathway', 'Activate the stroke thrombolysis pathway and pre-alert the stroke team and radiology', 'Time is brain: the pathway compresses every step.', { cost: 0, tat: 5, factor: 0.5, msg: 'Stroke team activated, CT slot cleared and the thrombolysis checklist started.' }),
      A('thrombolysis', 'IV alteplase 0.9 mg/kg (10% bolus, remainder over an hour) once haemorrhage is excluded', 'The treatment for a disabling deficit within 4.5 hours.', { cost: 900, tat: 12, factor: 0.35, msg: 'Alteplase given 2 hours 5 minutes after onset. Within 40 minutes the right arm is moving against gravity and he is saying single words.' }),
      A('bp', 'Keep blood pressure below 185/110 before thrombolysis, then below 180/105', 'Above these thresholds, thrombolysis is withheld and outcomes worsen.', { cost: 20, tat: 6, factor: 0.8, msg: 'Blood pressure brought to 172/88 with a small dose of labetalol — within the thrombolysis threshold.' }),
      A('glucose', 'Check and treat glucose: correct below 4 mmol/L and avoid hyperglycaemia', 'Both hypo- and hyperglycaemia worsen stroke outcome.', { cost: 15, tat: 5, factor: 0.9, msg: 'Glucose 6.4 mmol/L — no correction needed, and documented.' }),
      A('oxygen2', 'Oxygen only if saturations fall below 94%; nurse at 30 degrees with the head neutral', 'Routine oxygen does not help and hyperoxia may harm.', { cost: 15, tat: 5, factor: 0.92, msg: 'Positioned with the head up and neutral; saturations 97% on air.' }),
      A('thrombectomy', 'Refer for consideration of mechanical thrombectomy if there is a large vessel occlusion', 'Thrombectomy extends the window to 24 hours in selected patients and is highly effective.', { cost: 0, tat: 10, factor: 0.6, msg: 'Neurosciences centre contacted; the CT angiogram shows a proximal M1 occlusion and the patient is accepted for transfer.' }),
      A('nbm', 'Nil by mouth until a swallow screen, with aspiration precautions', 'Dysphagia after stroke causes aspiration pneumonia.', { cost: 0, tat: 6, factor: 0.9, msg: 'Nil by mouth with a documented swallow screen plan.' }),
      A('avoidbp', 'Avoid aggressive blood pressure lowering in the acute phase', 'Lowering pressure acutely reduces perfusion to the penumbra.', { cost: 0, tat: 5, factor: 0.9, msg: 'No further antihypertensives given; the pressure is being kept within the permitted range only.' }),
      A('aspirin', 'Aspirin 300 mg before the CT scan, to save time', 'Aspirin before imaging risks catastrophic bleeding.', { cost: 5, tat: 4, factor: 1.6, harm: true, msg: 'Aspirin given before imaging: the CT showed a small haemorrhage, and the antiplatelet load worsened the bleed.' }),
      A('heparin', 'Start therapeutic heparin immediately for the atrial fibrillation', 'Early heparin increases haemorrhagic transformation.', { cost: 60, tat: 6, factor: 1.5, harm: true, msg: 'Immediate therapeutic heparin before imaging: bleeding into the infarct with rapid deterioration.' }),
      A('lowerfast', 'Lower the blood pressure rapidly to 120 mmHg systolic', 'The penumbra depends on that pressure.', { cost: 20, tat: 6, factor: 1.5, harm: true, msg: 'Rapid blood pressure reduction: the deficit extended within minutes as perfusion to the penumbra collapsed.' }),
      A('wait', 'Admit for observation and reassess in the morning', 'The window is measured in minutes.', { cost: 0, tat: 5, factor: 1.7, harm: true, msg: 'Observed rather than treated: by the morning the deficit was fixed and the thrombolysis window long closed.' })
    ],
    tests: [
      T('ct', 'CT head (non-contrast) — immediate', 'Imaging', 420, 25, '**No haemorrhage. Subtle loss of grey-white differentiation and insular ribbon effacement in the left middle cerebral artery territory with a hyperdense left MCA sign.** ASPECTS 8. This is the scan that permits thrombolysis.', { flag: 'critical', factor: 0.7 }),
      T('cta', 'CT angiography and perfusion imaging', 'Imaging', 480, 35, '**Proximal left M1 middle cerebral artery occlusion** with a small established core and a large penumbra — a thrombectomy candidate.', { flag: 'critical', factor: 0.65 }),
      T('glucose', 'Capillary glucose', 'Bedside', 10, 6, '6.4 mmol/L — normal. Hypoglycaemia is the commonest mimic of stroke and is excluded in seconds.', { flag: 'critical', factor: 0.85 }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, '**Atrial fibrillation at 96**, no acute ischaemic change — the likely embolic source.', { flag: 'abnormal', factor: 0.95 }),
      T('coag', 'Full blood count and coagulation screen', 'Bloods', 135, 30, 'Hb 13.6, platelets 240, **INR 1.0, APTT 30 s** — no coagulopathy, so thrombolysis is not contraindicated.', { flag: 'normal', factor: 0.9 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Na 138, K 4.1, urea 34 mg/dL, creatinine 1.1 mg/dL — normal, which matters because renal failure alters thrombolysis decisions.', { flag: 'normal' }),
      T('carotid', 'Carotid Doppler ultrasound', 'Imaging', 180, 50, 'Moderate left internal carotid stenosis without a tight lesion. Relevant to secondary prevention, not to the next hour.', { flag: 'abnormal' }),
      T('echo', 'Transthoracic echocardiogram', 'Imaging', 200, 60, 'Moderate left atrial dilatation with normal valve function and an LVEF of 52%. No thrombus seen, no vegetation.', { flag: 'abnormal' }),
      T('lipids', 'Lipid profile and HbA1c', 'Bloods', 120, 50, 'LDL 3.1 mmol/L, HbA1c 5.7%. Useful for secondary prevention.', { flag: 'abnormal' }),
      T('cxr', 'Chest X-ray', 'Imaging', 90, 30, 'Normal. Excludes aspiration and other cardiorespiratory pathology.', { flag: 'normal' }),
      T('mri', 'MRI brain with diffusion-weighted imaging', 'Imaging', 900, 120, 'Confirms acute infarction but cannot be obtained fast enough to change the thrombolysis decision. Excellent for later characterisation.', { flag: 'abnormal' }),
      T('toxicology', 'Toxicology screen', 'Bloods', 130, 60, 'Negative. Sympathomimetic drugs are a cause of stroke in the young, not in a 71-year-old with atrial fibrillation.', { flag: 'normal' })
    ],
    hints: [
      'Sudden focal deficit with a normal glucose and a normal CT inside 4.5 hours is thrombolysis — and a proximal occlusion may need thrombectomy.',
      'Do not give aspirin or heparin before the CT, and do not drop the blood pressure: the penumbra depends on it.'
    ],
    dx: {
      label: 'Acute ischaemic stroke (left MCA occlusion, cardioembolic from atrial fibrillation)',
      accept: ['acute ischaemic stroke', 'ischemic stroke', 'acute stroke', 'middle cerebral artery stroke', 'cerebral infarction', 'cardioembolic stroke', 'left mca stroke', 'ischaemic stroke'],
      reject: [
        { m: ['haemorrhagic', 'hemorrhagic', 'intracerebral haemorrhage', 'subarachnoid'], msg: 'The CT shows no blood: the hyperdense MCA sign and the territorial hypodensity are those of infarction, and the onset was abrupt without headache or vomiting.' },
        { m: ['hypoglycaemia', 'hypoglycemic'], msg: 'The glucose is 6.4 mmol/L — hypoglycaemia is excluded.' },
        { m: ['todd', 'post ictal', 'seizure'], msg: 'No seizure was witnessed and there is no history of epilepsy; a dense dysphasia with hemiparesis in a patient with atrial fibrillation is embolic until proven otherwise.' },
        { m: ['migraine'], msg: 'Migraine aura evolves over minutes and resolves; this deficit was sudden, dense and persistent with a matching arterial occlusion on angiography.' },
        { m: ['bell'], msg: 'Bell palsy is a peripheral facial weakness sparing the limb and the arm; this patient has a dense hemiparesis with dysphasia and a hemianopia.' },
        { m: ['functional'], msg: 'A functional weakness does not produce a hyperdense MCA or a matching occlusion on CT angiography.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Sudden dense right hemiparesis with global dysphasia in a patient with untreated atrial fibrillation, presenting 90 minutes after onset: an acute ischaemic stroke in the thrombolysis window, with a proximal M1 occlusion on CT angiography.'
    },
    differentials: ['Acute ischaemic stroke', 'Intracerebral haemorrhage', 'Hypoglycaemia', 'Post-ictal (Todd) paresis', 'Migraine with aura', 'Bell palsy', 'Functional weakness', 'Brain tumour with haemorrhage', 'Subdural haematoma', 'Cerebral venous sinus thrombosis'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'ctfirst', label: 'Immediate non-contrast CT head to exclude haemorrhage before any treatment', correct: true, msg: 'The gateway to every reperfusion decision.' },
        { id: 'lyse', label: 'IV thrombolysis within 4.5 hours of onset for a disabling deficit, if there is no contraindication', correct: true, msg: 'Number needed to treat for a good outcome is around seven when given early.' },
        { id: 'thromb', label: 'Refer for mechanical thrombectomy if CT angiography shows a large vessel occlusion', correct: true, msg: 'Highly effective in proximal occlusions, and the window extends to 24 hours in selected patients.' },
        { id: 'bp2', label: 'Keep blood pressure below 185/110 for thrombolysis and avoid aggressive lowering otherwise', correct: true, msg: 'Perfusion of the penumbra depends on that pressure.' },
        { id: 'nurse', label: 'Nil by mouth with a swallow screen, head up at 30 degrees, oxygen only if hypoxic', correct: true, msg: 'Prevents aspiration and avoids unnecessary hyperoxia.' },
        { id: 'glu', label: 'Correct hypoglycaemia and treat marked hyperglycaemia', correct: true, msg: 'Both extremes worsen outcome.' },
        { id: 'secondary', label: 'Plan secondary prevention: anticoagulation after the acute phase, statin, blood pressure control and cessation advice', correct: true, msg: 'The stroke was cardioembolic; the next one is preventable.' },
        { id: 'asa', label: 'Aspirin 300 mg immediately, before imaging, to save time', correct: false, harm: true, msg: 'Antiplatelet therapy before imaging risks catastrophic bleeding if the scan shows haemorrhage.' },
        { id: 'hep', label: 'Immediate therapeutic heparin for the atrial fibrillation', correct: false, harm: true, msg: 'Early heparin increases haemorrhagic transformation of the infarct.' },
        { id: 'bprush', label: 'Lower the blood pressure rapidly to 120 mmHg systolic', correct: false, harm: true, msg: 'Collapses perfusion to the ischaemic penumbra and extends the infarct.' },
        { id: 'observe2', label: 'Admit for observation and reassess in the morning', correct: false, harm: true, msg: 'The thrombolysis window closes within hours; observation alone leaves the deficit fixed.' },
        { id: 'mannitol', label: 'Mannitol for cerebral oedema in the first hours', correct: false, harm: true, msg: 'Cytotoxic oedema in the first hours does not respond to mannitol, which causes dehydration and electrolyte disturbance.' }
      ]
    },
    debrief: {
      key: ['Sudden dense right hemiparesis with global dysphasia 90 minutes before arrival in a patient with untreated atrial fibrillation.', 'BP 176/92 with an irregular pulse, a normal glucose of 6.4 and an NIHSS of about 16.', 'CT shows a hyperdense left MCA with no haemorrhage; CT angiography shows a proximal M1 occlusion with a large penumbra.'],
      pearls: ['Time is brain: pre-hospital alert, immediate CT and thrombolysis within 4.5 hours change independence at six months.', 'Proximal occlusions need thrombectomy referral, and the window is longer than for thrombolysis.', 'Blood pressure must be below 185/110 for thrombolysis — but lowering it further than that harms the penumbra.'],
      pitfalls: ['Aspirin or heparin before the CT can convert an infarct into a fatal haemorrhage.', 'Dropping the blood pressure rapidly is a common and damaging reflex.']
    }
  });

  /* =======================================================================
     CASE 28 — Serotonin syndrome
     ======================================================================= */
  window.CASES.push({
    id: 'serotonin',
    title: 'Agitated, sweating and shaking after a new antidepressant and tramadol',
    category: 'Toxicology',
    difficulty: 'hard',
    blurb: 'Started sertraline two weeks ago, took tramadol for back pain yesterday; now febrile, clonic and rigid only in the legs.',
    timeLimitSec: 600,
    budget: 1500,
    who: 'Mr. F., 28-year-old warehouse worker. Started sertraline two weeks ago for depression and took tramadol for a back injury yesterday and again this morning. He has become progressively agitated, sweaty and shaky, and his girlfriend says his legs are "jumping on their own".',
    history: [
      'Sertraline 50 mg daily started two weeks ago for depression; the dose was increased to 100 mg three days ago.',
      'Tramadol 50 mg four times daily for back pain for the last 36 hours.',
      'Progressive agitation, sweating, shivering and muscle twitching over 12 hours.',
      'No fever or infective symptoms before today, no vomiting or diarrhoea, no alcohol or recreational drugs.',
      'No previous similar episode, no antipsychotic medication, no anaesthetic exposure, no family history of malignant hyperthermia.'
    ],
    exam: [
      'Agitated, tremulous and sweating profusely, GCS 14, with **dilated reactive pupils** and dry flushed skin.',
      '**Temperature 39.8 C**, pulse 128, BP 158/88, respiratory rate 24, SpO2 96%.',
      '**Marked hyperreflexia with spontaneous and inducible clonus, most pronounced in the lower limbs**, and inducible ankle clonus. Mild rigidity only in the legs.',
      'No lead-pipe rigidity, no tremor of the classic parkinsonian type, no rash, no needle marks.',
      'Chest clear, abdomen soft, no meningism, no focal neurology.'
    ],
    base: { hr: 128, sbp: 158, dbp: 88, rr: 24, spo2: 96, temp: 39.8, gcs: 14 },
    drift: { hr: 0.45, sbp: -0.4, dbp: -0.25, rr: 0.3, spo2: -0.25, temp: 0.014, gcs: -0.05 },
    decay: 0.28,
    events: [
      { at: 120, need: ['action:stopdrugs'], loss: 12, msg: 'The serotonergic drugs have not been stopped. Every further dose increases the toxicity.' },
      { at: 250, need: ['action:cooling'], loss: 12, msg: 'No active cooling. The temperature is 40.4 C and at this level the risk of rhabdomyolysis, disseminated intravascular coagulation and multi-organ failure rises steeply.' },
      { at: 380, need: ['action:benzo'], loss: 8, msg: 'No benzodiazepine has been given. The agitation and clonus are driving the hyperthermia and the rising creatine kinase.' }
    ],
    actions: [
      A('stopdrugs', 'Stop all serotonergic drugs immediately (sertraline, tramadol and any others)', 'Remove the cause before treating the effect.', { cost: 0, tat: 5, factor: 0.5, msg: 'Sertraline and tramadol stopped and the chart annotated; no further serotonergic agent will be given.' }),
      A('benzo', 'IV diazepam for agitation, clonus and to reduce muscular heat generation', 'Benzodiazepines are first-line symptomatic treatment.', { cost: 15, tat: 6, factor: 0.6, msg: 'Diazepam given: the clonus is much reduced, the agitation is settling and the temperature is starting to fall.' }),
      A('cooling', 'Active cooling: tepid sponging, fans, cool IV fluids and paracetamol', 'Hyperthermia above 40 C drives organ failure.', { cost: 25, tat: 8, factor: 0.7, msg: 'Temperature falling from 39.8 C with active cooling.' }),
      A('fluids', 'IV crystalloid for insensible losses and to protect the kidneys', 'Sweating, hyperthermia and rhabdomyolysis all threaten the kidney.', { cost: 20, tat: 8, factor: 0.8, msg: 'Fluids running; the heart rate is settling and urine output is improving.' }),
      A('cypro', 'Cyproheptadine 12 mg orally or via nasogastric tube (a 5-HT2A antagonist)', 'The antidote for moderate to severe serotonin toxicity.', { cost: 80, tat: 10, factor: 0.5, msg: 'Cyproheptadine given: the clonus has almost resolved and the temperature is normalising.' }),
      A('icu', 'Critical care referral for severe serotonin toxicity with hyperthermia', 'Temperature above 41 C and rigidity are life-threatening.', { cost: 20, tat: 10, factor: 0.7, msg: 'Intensive care review arranged with a plan for paralysis and ventilation if the temperature climbs further.' }),
      A('monitor', 'Continuous monitoring with serial creatine kinase, renal function and coagulation', 'Complications appear over hours.', { cost: 20, tat: 8, factor: 0.85, msg: 'Monitoring established with repeat bloods planned.' }),
      A('haloperidol', 'IV haloperidol for the agitation', 'Antipsychotics worsen serotonin toxicity and lower the seizure threshold.', { cost: 30, tat: 6, factor: 1.6, harm: true, msg: 'Haloperidol increased the rigidity and hyperthermia: dopamine antagonism worsens serotonin syndrome, and it also prolongs the QT interval.' }),
      A('restraint', 'Physical restraint alone to control the agitation', 'Restraint against violent muscle activity causes rhabdomyolysis.', { cost: 0, tat: 6, factor: 1.4, harm: true, msg: 'Struggling against restraints drove the creatine kinase above 20,000 U/L with a metabolic acidosis and a further temperature rise.' }),
      A('moredrug', 'Give another dose of tramadol for the back pain', 'Adding serotonergic substrate to serotonin toxicity.', { cost: 15, tat: 5, factor: 1.8, harm: true, msg: 'A further dose of tramadol caused a dramatic deterioration with generalised rigidity and a temperature of 41 C.' }),
      A('dantrolene', 'Dantrolene as the first-line treatment', 'Dantrolene is for malignant hyperthermia and neuroleptic malignant syndrome.', { cost: 120, tat: 10, factor: 1.25, harm: true, msg: 'Dantrolene given first: it does not reverse serotonin toxicity, and it delayed the benzodiazepine and cyproheptadine that actually work.' }),
      A('discharge', 'Sedate and observe, and discharge once settled', 'Serotonin toxicity recurs and can be fatal.', { cost: 0, tat: 5, factor: 1.7, harm: true, msg: 'Sedation without stopping the drugs and without observation led to a rebound with a temperature of 41.2 C.' })
    ],
    tests: [
      T('abg', 'Arterial blood gas', 'Bloods', 95, 20, 'pH 7.28, pO2 88 mmHg, HCO3 18, **lactate 3.1 mmol/L**, base excess -6 — a metabolic acidosis from muscle hyperactivity.', { flag: 'critical', factor: 0.82 }),
      T('ck', 'Creatine kinase', 'Bloods', 60, 35, '**4200 U/L** — rhabdomyolysis from continuous muscular activity. It rises further with agitation and restraint.', { flag: 'critical', factor: 0.82 }),
      T('ue', 'Urea, creatinine and electrolytes', 'Bloods', 70, 35, 'Urea 46 mg/dL, creatinine 1.4 mg/dL (rising), Na 141, K 4.6, bicarbonate 18 — early acute kidney injury from rhabdomyolysis.', { flag: 'abnormal' }),
      T('coag', 'Coagulation screen', 'Bloods', 90, 40, 'INR 1.3 with a mildly reduced fibrinogen — early activation of coagulation from hyperthermia and muscle breakdown.', { flag: 'abnormal' }),
      T('fbc', 'Full blood count', 'Bloods', 45, 30, 'WBC 16.2 with neutrophilia, Hb 15.8 (haemoconcentrated), platelets 240.', { flag: 'abnormal' }),
      T('tox', 'Urine toxicology screen', 'Microbiology', 130, 80, 'Positive for tramadol and its metabolites; negative for cocaine, amphetamines, MDMA, cannabis and opioids. Confirms the serotonergic combination.', { flag: 'critical', factor: 0.9 }),
      T('levels', 'Paracetamol and salicylate levels', 'Bloods', 100, 50, 'Both undetectable, excluding two common co-ingestants with their own antidotes.', { flag: 'normal' }),
      T('ecg', '12-lead ECG', 'Bedside', 40, 8, 'Sinus tachycardia 128 with **a QTc of 470 ms**. Antipsychotics would prolong this further.', { flag: 'abnormal', factor: 0.95 }),
      T('glucose', 'Capillary glucose', 'Bedside', 10, 6, '6.2 mmol/L — normal.', { flag: 'normal' }),
      T('cthead', 'CT head (non-contrast)', 'Imaging', 420, 80, 'Normal. Excludes structural causes of agitation and fever, and would be more important if there were focal signs or a reduced conscious level.', { flag: 'normal' }),
      T('lp', 'Lumbar puncture', 'Bedside', 180, 60, 'Clear CSF with 2 cells/mm3, normal protein and glucose, negative cultures and viral PCR. Meningoencephalitis is a genuine mimic of fever with altered behaviour, and this excludes it.', { flag: 'normal' }),
      T('tsh', 'Thyroid function tests', 'Bloods', 110, 70, 'Normal. Thyrotoxicosis causes hyperthermia, tachycardia and agitation and must be excluded in every case like this.', { flag: 'normal' })
    ],
    hints: [
      'Clonus with hyperreflexia and dilated pupils after two serotonergic drugs is serotonin toxicity: stop the drugs, give a benzodiazepine, cool the patient and consider cyproheptadine.',
      'Haloperidol and physical restraint both make serotonin syndrome worse; dantrolene is not the antidote.'
    ],
    dx: {
      label: 'Serotonin syndrome from sertraline and tramadol',
      accept: ['serotonin syndrome', 'serotonergic syndrome', 'serotonin toxicity', 'serotonin syndrome due to sertraline and tramadol'],
      reject: [
        { m: ['neuroleptic malignant', 'nms'], msg: 'Neuroleptic malignant syndrome follows dopamine antagonists, develops over days with lead-pipe rigidity and bradyreflexia. Here the onset was rapid after two serotonergic drugs with clonus and hyperreflexia.' },
        { m: ['malignant hyperthermia'], msg: 'Malignant hyperthermia follows anaesthetic exposure and causes masseter spasm and rigidity; there has been no anaesthetic and the clonus is characteristic of serotonin toxicity.' },
        { m: ['anticholinergic'], msg: 'Anticholinergic toxicity causes dry skin and urinary retention with normal reflexes; this patient is sweating profusely with clonus and hyperreflexia.' },
        { m: ['meningitis', 'encephalitis'], msg: 'The CSF is acellular with normal protein and glucose, and there is no meningism — the fever and agitation are drug-induced.' },
        { m: ['thyroid storm', 'thyrotoxic'], msg: 'Thyroid function is normal, and there is no goitre, lid lag or exophthalmos.' },
        { m: ['alcohol withdrawal', 'delirium tremens'], msg: 'There is no alcohol history; the toxicology screen shows tramadol and the clonus is not typical of withdrawal.' },
        { m: ['heat stroke'], msg: 'There is no hot environment or exertion; the hyperthermia followed the drug combination with a creatine kinase of 4200.' }
      ],
      penaltySec: 45,
      penaltyStab: 6,
      why: 'Two serotonergic drugs combined, with rapid onset of agitation, diaphoresis, hyperthermia of 39.8 C, dilated pupils, hyperreflexia and clonus, and a creatine kinase of 4200 U/L: serotonin toxicity satisfying the Hunter criteria.'
    },
    differentials: ['Serotonin syndrome', 'Neuroleptic malignant syndrome', 'Malignant hyperthermia', 'Anticholinergic toxicity', 'Meningoencephalitis', 'Thyroid storm', 'Alcohol withdrawal with delirium', 'Heat stroke', 'Acute dystonic reaction', 'Sepsis with agitation'],
    mgmt: {
      timeSec: 30,
      options: [
        { id: 'stop', label: 'Stop all serotonergic agents immediately', correct: true, msg: 'The single most important step — the toxicity is drug-driven.' },
        { id: 'bz', label: 'Benzodiazepines for agitation, clonus and to reduce heat generation', correct: true, msg: 'First-line symptomatic treatment.' },
        { id: 'cool', label: 'Active cooling, paracetamol and cool intravenous fluids', correct: true, msg: 'Prevents progression to multi-organ failure.' },
        { id: 'cyp', label: 'Cyproheptadine (5-HT2A antagonist) for moderate to severe toxicity', correct: true, msg: 'The specific antidote, given orally or by nasogastric tube.' },
        { id: 'icu2', label: 'Critical care referral for hyperthermia above 41 C or rigidity for paralysis and ventilation', correct: true, msg: 'The escalation path when cooling and drugs are not enough.' },
        { id: 'obs2', label: 'Monitor creatine kinase, renal function and coagulation, and maintain urine output', correct: true, msg: 'Rhabdomyolysis and acute kidney injury are the main complications.' },
        { id: 'review', label: 'Review the antidepressant combination with the prescribing team and warn about tramadol, triptans, linezolid and MDMA', correct: true, msg: 'Prevents recurrence, which is common.' },
        { id: 'halo', label: 'IV haloperidol for the agitation', correct: false, harm: true, msg: 'Dopamine antagonists worsen serotonin toxicity and prolong the QT interval.' },
        { id: 'tie', label: 'Physical restraint to control the agitation', correct: false, harm: true, msg: 'Struggling against restraints causes rhabdomyolysis and worsens hyperthermia.' },
        { id: 'tram', label: 'Continue tramadol for the back pain', correct: false, harm: true, msg: 'More serotonergic substrate in a patient with serotonin toxicity.' },
        { id: 'dant', label: 'Dantrolene as the first-line treatment', correct: false, harm: true, msg: 'Dantrolene treats malignant hyperthermia and neuroleptic malignant syndrome, not serotonin toxicity, and it delays effective treatment.' },
        { id: 'send', label: 'Discharge once sedated and settled', correct: false, harm: true, msg: 'Serotonin toxicity rebounds as long as the drugs remain on board.' }
      ]
    },
    debrief: {
      key: ['Sertraline increased and tramadol added 36 hours ago, with rapid onset of agitation, sweating and shivering.', 'Temperature 39.8 C with hyperreflexia, spontaneous clonus and dilated pupils.', 'Lactate 3.1, creatine kinase 4200 and a positive tramadol screen with a normal CSF.'],
      pearls: ['Clonus and hyperreflexia distinguish serotonin toxicity from neuroleptic malignant syndrome, which is rigid and bradyreflexic.', 'Treatment is to stop the drugs, sedate with benzodiazepines, cool aggressively and give cyproheptadine in moderate to severe cases.', 'Tramadol is a serotonergic drug — combining it with an SSRI is a common and entirely avoidable trigger.'],
      pitfalls: ['Haloperidol and physical restraint both worsen serotonin syndrome.', 'Dantrolene is not the antidote to serotonin toxicity, however febrile the patient looks.']
    }
  });

})();
