/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('treatments').del();
  
  // Inserts seed entries
  await knex('treatments').insert([
    {
      id: 1,
      treatment_code: 'CARD001',
      name: 'Echocardiogram',
      description: 'Ultrasound imaging of the heart',
      cost: 250.00,
      duration_minutes: 45,
      category: 'Diagnostic',
      equipment_required: 'Ultrasound machine, ECG leads',
      precautions: 'Patient should avoid caffeine 4 hours before test',
      is_active: true
    },
    {
      id: 2,
      treatment_code: 'CARD002',
      name: 'Cardiac Catheterization',
      description: 'Invasive procedure to examine heart function',
      cost: 2500.00,
      duration_minutes: 120,
      category: 'Procedure',
      equipment_required: 'Catheterization lab, contrast dye',
      precautions: 'NPO 12 hours before procedure, allergy check',
      is_active: true
    },
    {
      id: 3,
      treatment_code: 'ORTH001',
      name: 'Knee Arthroscopy',
      description: 'Minimally invasive knee joint surgery',
      cost: 3500.00,
      duration_minutes: 90,
      category: 'Surgery',
      equipment_required: 'Arthroscope, surgical instruments',
      precautions: 'Pre-operative fasting required',
      is_active: true
    },
    {
      id: 4,
      treatment_code: 'PED001',
      name: 'Child Wellness Checkup',
      description: 'Routine pediatric examination',
      cost: 150.00,
      duration_minutes: 30,
      category: 'Consultation',
      equipment_required: 'Growth charts, vaccination records',
      precautions: 'Parent/guardian must be present',
      is_active: true
    },
    {
      id: 5,
      treatment_code: 'NEUR001',
      name: 'EEG',
      description: 'Electroencephalogram brain wave test',
      cost: 400.00,
      duration_minutes: 60,
      category: 'Diagnostic',
      equipment_required: 'EEG machine, electrodes',
      precautions: 'Hair should be clean and dry',
      is_active: true
    },
    {
      id: 6,
      treatment_code: 'ONCO001',
      name: 'Chemotherapy Session',
      description: 'Cancer treatment with chemotherapy drugs',
      cost: 1500.00,
      duration_minutes: 180,
      category: 'Treatment',
      equipment_required: 'IV pump, chemotherapy drugs',
      precautions: 'Pre-medication for nausea, blood count check',
      is_active: true
    },
    {
      id: 7,
      treatment_code: 'DERM001',
      name: 'Skin Biopsy',
      description: 'Tissue sample collection for diagnosis',
      cost: 300.00,
      duration_minutes: 20,
      category: 'Procedure',
      equipment_required: 'Biopsy punch, local anesthetic',
      precautions: 'Area should be clean, no blood thinners',
      is_active: true
    },
    {
      id: 8,
      treatment_code: 'PSYC001',
      name: 'Psychiatric Evaluation',
      description: 'Comprehensive mental health assessment',
      cost: 200.00,
      duration_minutes: 60,
      category: 'Consultation',
      equipment_required: 'Assessment forms, private room',
      precautions: 'Patient should be in stable condition',
      is_active: true
    },
    {
      id: 9,
      treatment_code: 'EM001',
      name: 'Emergency Triage',
      description: 'Initial assessment in emergency department',
      cost: 100.00,
      duration_minutes: 15,
      category: 'Emergency',
      equipment_required: 'Vital signs monitor, triage forms',
      precautions: 'Immediate assessment required',
      is_active: true
    },
    {
      id: 10,
      treatment_code: 'GEN001',
      name: 'Blood Test Panel',
      description: 'Comprehensive blood work analysis',
      cost: 80.00,
      duration_minutes: 10,
      category: 'Diagnostic',
      equipment_required: 'Blood collection tubes, needles',
      precautions: 'Fasting may be required for some tests',
      is_active: true
    }
  ]);
};
