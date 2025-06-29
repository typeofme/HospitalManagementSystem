/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('departments').del();
  
  // Inserts seed entries
  await knex('departments').insert([
    {
      id: 1,
      name: 'Cardiology',
      description: 'Diagnosis and treatment of heart and cardiovascular diseases',
      head_doctor_name: 'Dr. Sarah Johnson',
      location: 'Building A, Floor 3',
      phone: '+1-555-0101',
      capacity: 50,
      is_active: true
    },
    {
      id: 2,
      name: 'Emergency Medicine',
      description: 'Emergency and urgent medical care',
      head_doctor_name: 'Dr. Michael Brown',
      location: 'Building A, Floor 1',
      phone: '+1-555-0102',
      capacity: 30,
      is_active: true
    },
    {
      id: 3,
      name: 'Pediatrics',
      description: 'Medical care for infants, children, and adolescents',
      head_doctor_name: 'Dr. Emily Davis',
      location: 'Building B, Floor 2',
      phone: '+1-555-0103',
      capacity: 40,
      is_active: true
    },
    {
      id: 4,
      name: 'Orthopedics',
      description: 'Treatment of musculoskeletal system disorders',
      head_doctor_name: 'Dr. James Wilson',
      location: 'Building C, Floor 1',
      phone: '+1-555-0104',
      capacity: 35,
      is_active: true
    },
    {
      id: 5,
      name: 'Neurology',
      description: 'Diagnosis and treatment of nervous system disorders',
      head_doctor_name: 'Dr. Lisa Martinez',
      location: 'Building A, Floor 4',
      phone: '+1-555-0105',
      capacity: 25,
      is_active: true
    },
    {
      id: 6,
      name: 'Oncology',
      description: 'Cancer diagnosis and treatment',
      head_doctor_name: 'Dr. Robert Garcia',
      location: 'Building D, Floor 2',
      phone: '+1-555-0106',
      capacity: 20,
      is_active: true
    },
    {
      id: 7,
      name: 'Dermatology',
      description: 'Skin, hair, and nail disorders treatment',
      head_doctor_name: 'Dr. Amanda White',
      location: 'Building B, Floor 3',
      phone: '+1-555-0107',
      capacity: 15,
      is_active: true
    },
    {
      id: 8,
      name: 'Psychiatry',
      description: 'Mental health and psychiatric care',
      head_doctor_name: 'Dr. David Lee',
      location: 'Building E, Floor 1',
      phone: '+1-555-0108',
      capacity: 30,
      is_active: true
    }
  ]);
};
