// Medical Records JavaScript Functions

let medicalRecords = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    setupEventListeners();
    
    // Test doctors API directly
    testDoctorsAPI();
    
    // Don't load dropdowns initially since they're in a modal
    // They will be loaded when the modal is opened
    console.log('Initial setup complete. Dropdowns will load when modal opens.');
});

// Also try when window is fully loaded
window.addEventListener('load', function() {
    console.log('Window fully loaded.');
});

// Test function to debug doctors API
async function testDoctorsAPI() {
    try {
        console.log('Testing doctors API directly...');
        const response = await fetch('/api/doctors');
        console.log('Test API response status:', response.status);
        console.log('Test API response headers:', response.headers);
        
        const text = await response.text();
        console.log('Test API raw text response:', text);
        
        const data = JSON.parse(text);
        console.log('Test API parsed data:', data);
        console.log('Test API data type:', typeof data);
        console.log('Test API is array:', Array.isArray(data));
        
        // Test manual dropdown population
        const doctorSelect = document.getElementById('doctorId');
        if (doctorSelect) {
            console.log('Manual test: Found doctor select element');
            console.log('Current dropdown HTML:', doctorSelect.innerHTML);
        } else {
            console.log('Manual test: Doctor select element not found');
        }
        
    } catch (error) {
        console.error('Test API error:', error);
    }
}

// Manual test function to be called from console
window.testManualDoctorLoad = function() {
    console.log('Manual doctor load test...');
    loadDoctors();
};

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterRecords);
    }

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    if (statusFilter) statusFilter.addEventListener('change', filterRecords);
    if (typeFilter) typeFilter.addEventListener('change', filterRecords);

    // Form submission
    const addRecordForm = document.getElementById('addRecordForm');
    if (addRecordForm) {
        addRecordForm.addEventListener('submit', handleAddRecord);
    }
    
    const editRecordForm = document.getElementById('editRecordForm');
    if (editRecordForm) {
        editRecordForm.addEventListener('submit', handleEditRecord);
    }
    
    // Modal event listener to reload dropdowns
    const addRecordModal = document.getElementById('addRecordModal');
    if (addRecordModal) {
        console.log('Setting up modal event listener'); // Debug log
        
        // Primary event - when modal starts to show
        addRecordModal.addEventListener('show.bs.modal', function() {
            console.log('Modal is showing, loading dropdowns...'); // Debug log
            loadPatients();
            loadDoctors();
        });
        
        // Secondary event - when modal is fully shown (backup)
        addRecordModal.addEventListener('shown.bs.modal', function() {
            console.log('Modal is fully shown, ensuring dropdowns are loaded...'); // Debug log
            // Small delay to ensure DOM is fully ready
            setTimeout(() => {
                loadPatients();
                loadDoctors();
            }, 100);
        });
    } else {
        console.error('Add record modal not found'); // Debug log
    }
    
    // Setup edit modal event listeners
    const editRecordModal = document.getElementById('editRecordModal');
    if (editRecordModal) {
        console.log('Setting up edit modal event listener');
        
        // When edit modal starts to show
        editRecordModal.addEventListener('show.bs.modal', function() {
            console.log('Edit modal is showing, loading dropdowns...');
            loadEditDropdowns();
        });
        
        // When edit modal is fully shown (backup)
        editRecordModal.addEventListener('shown.bs.modal', function() {
            console.log('Edit modal is fully shown');
        });
    } else {
        console.error('Edit record modal not found');
    }
    
    // Event delegation for edit and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-record-btn')) {
            const button = e.target.closest('.edit-record-btn');
            const recordId = button.getAttribute('data-record-id');
            editRecord(recordId);
        } else if (e.target.closest('.delete-record-btn')) {
            const button = e.target.closest('.delete-record-btn');
            const recordId = button.getAttribute('data-record-id');
            deleteRecord(recordId);
        } else if (e.target.closest('.print-record-btn')) {
            const button = e.target.closest('.print-record-btn');
            const recordId = button.getAttribute('data-record-id');
            printRecord(recordId);
        }
    });
}

// Load patients for dropdown
async function loadPatients() {
    try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        const patientSelect = document.getElementById('patientId');
        
        if (patientSelect) {
            // Handle both object with patients property and direct array
            const patients = data.patients || data;
            
            patientSelect.innerHTML = '<option value="">Select Patient</option>';
            if (Array.isArray(patients)) {
                patients.forEach(patient => {
                    const option = document.createElement('option');
                    option.value = patient.id;
                    option.textContent = `${patient.first_name} ${patient.last_name} (ID: ${patient.patient_id || patient.id})`;
                    patientSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

// Load doctors for dropdown
async function loadDoctors() {
    try {
        console.log('Loading doctors...'); // Debug log
        const response = await fetch('/api/doctors');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Doctors API response:', data); // Debug log
        console.log('Data type:', typeof data); // Debug log
        console.log('Is array?', Array.isArray(data)); // Debug log
        
        const doctorSelect = document.getElementById('doctorId');
        console.log('Doctor select element:', doctorSelect); // Debug log
        
        if (!doctorSelect) {
            console.error('Doctor select element not found');
            // Wait a bit and try again in case the element isn't ready
            setTimeout(() => {
                console.log('Retrying loadDoctors after delay...');
                loadDoctors();
            }, 500);
            return;
        }
        
        // Clear existing options
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        
        // The API returns an array directly (confirmed from curl test)
        let doctors = data;
        
        console.log('Processing doctors:', doctors); // Debug log
        console.log('Doctor count:', doctors ? doctors.length : 'undefined'); // Debug log
        
        if (Array.isArray(doctors) && doctors.length > 0) {
            console.log('Adding doctors to dropdown...'); // Debug log
            doctors.forEach((doctor, index) => {
                console.log(`Processing doctor ${index}:`, {
                    id: doctor.id,
                    name: `${doctor.first_name} ${doctor.last_name}`,
                    specialization: doctor.specialization
                }); // Debug log
                
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name}`;
                if (doctor.specialization) {
                    option.textContent += ` (${doctor.specialization})`;
                }
                doctorSelect.appendChild(option);
                console.log(`Added option: ${option.textContent}`); // Debug log
            });
            console.log(`Successfully added ${doctors.length} doctors to dropdown`); // Debug log
            console.log('Final dropdown HTML:', doctorSelect.innerHTML); // Debug log
        } else {
            console.error('No doctors found or doctors is not an array:', doctors);
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No doctors available';
            option.disabled = true;
            doctorSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
        console.error('Error stack:', error.stack); // Debug log
        const doctorSelect = document.getElementById('doctorId');
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Error loading doctors</option>';
        }
    }
}

// Filter records based on search and filters
function filterRecords() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    
    const rows = document.querySelectorAll('#recordsTable tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const status = row.querySelector('.badge')?.textContent.toLowerCase() || '';
        const type = row.querySelector('.badge')?.textContent.toLowerCase() || '';
        
        const matchesSearch = text.includes(searchTerm);
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        const matchesType = !typeFilter || type.includes(typeFilter);
        
        if (matchesSearch && matchesStatus && matchesType) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update count
    const countBadge = document.getElementById('recordCount');
    if (countBadge) {
        countBadge.textContent = visibleCount;
    }
}

// Handle add record form submission
async function handleAddRecord(event) {
    event.preventDefault();
    
    const formData = {
        patient_id: document.getElementById('patientId').value,
        doctor_id: document.getElementById('doctorId').value,
        visit_date: document.getElementById('visitDate').value,
        chief_complaint: document.getElementById('chiefComplaint').value,
        history_of_present_illness: document.getElementById('historyOfPresentIllness').value,
        physical_examination: document.getElementById('physicalExamination').value,
        diagnosis: document.getElementById('diagnosis').value,
        treatment_plan: document.getElementById('treatmentPlan').value,
        medications_prescribed: document.getElementById('medicationsPrescribed').value,
        follow_up_instructions: document.getElementById('followUpInstructions').value
    };
    
    // Validate required fields
    if (!formData.patient_id) {
        showError('Please select a patient');
        return;
    }
    
    if (!formData.doctor_id) {
        showError('Please select a doctor');
        return;
    }
    
    if (!formData.visit_date) {
        showError('Please select a visit date');
        return;
    }
    
    if (!formData.chief_complaint) {
        showError('Please enter a chief complaint');
        return;
    }
    
    console.log('Submitting medical record data:', formData); // Debug log
    
    try {
        const response = await fetch('/api/medical-records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Close modal and reload page
            const modal = bootstrap.Modal.getInstance(document.getElementById('addRecordModal'));
            if (modal) {
                modal.hide();
            }
            showSuccess('Operation completed successfully!'); location.reload();
        } else {
            const error = await response.json();
            console.error('Error response:', error); // Debug log
            showError('Error creating medical record: ' + (error.error || error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating medical record:', error);
        showError('Error creating medical record: ' + error.message);
    }
}

// Handle edit record form submission
async function handleEditRecord(event) {
    event.preventDefault();
    
    const recordId = document.getElementById('edit_record_id').value;
    const formData = {
        patient_id: document.getElementById('edit_patientId').value,
        doctor_id: document.getElementById('edit_doctorId').value,
        visit_date: document.getElementById('edit_visitDate').value,
        chief_complaint: document.getElementById('edit_chiefComplaint').value,
        history_of_present_illness: document.getElementById('edit_historyOfPresentIllness').value,
        physical_examination: document.getElementById('edit_physicalExamination').value,
        diagnosis: document.getElementById('edit_diagnosis').value,
        treatment_plan: document.getElementById('edit_treatmentPlan').value,
        medications_prescribed: document.getElementById('edit_medicationsPrescribed').value,
        follow_up_instructions: document.getElementById('edit_followUpInstructions').value
    };
    
    // Validate required fields
    if (!formData.patient_id) {
        showError('Please select a patient');
        return;
    }
    
    if (!formData.doctor_id) {
        showError('Please select a doctor');
        return;
    }
    
    if (!formData.visit_date) {
        showError('Please select a visit date');
        return;
    }
    
    if (!formData.chief_complaint) {
        showError('Please enter a chief complaint');
        return;
    }
    
    console.log('Updating medical record data:', formData);
    
    try {
        const response = await fetch(`/api/medical-records/${recordId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Close modal and reload page
            const modal = bootstrap.Modal.getInstance(document.getElementById('editRecordModal'));
            if (modal) {
                modal.hide();
            }
            showSuccess('Medical record updated successfully!');
            location.reload();
        } else {
            const error = await response.json();
            console.error('Error response:', error);
            showError('Error updating medical record: ' + (error.error || error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating medical record:', error);
        showError('Error updating medical record: ' + error.message);
    }
}

// Edit record
async function editRecord(id) {
    try {
        // Fetch the medical record data
        const response = await fetch(`/api/medical-records/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch medical record');
        }
        
        const record = await response.json();
        console.log('Fetched record for editing:', record);
        
        // Load dropdowns for edit modal first
        await loadEditDropdowns();
        
        // Then populate the edit modal with data
        populateEditModal(record);
        
        // Show the edit modal
        const editModal = new bootstrap.Modal(document.getElementById('editRecordModal'));
        editModal.show();
        
    } catch (error) {
        console.error('Error fetching medical record:', error);
        showError('Error loading medical record: ' + error.message);
    }
}

// Populate edit modal with record data
function populateEditModal(record) {
    // Set the record ID
    document.getElementById('edit_record_id').value = record.id;
    
    // Set form fields
    document.getElementById('edit_patientId').value = record.patient_id || '';
    document.getElementById('edit_doctorId').value = record.doctor_id || '';
    
    // Format date for input field
    if (record.visit_date) {
        const date = new Date(record.visit_date);
        const formattedDate = date.getFullYear() + '-' + 
            String(date.getMonth() + 1).padStart(2, '0') + '-' + 
            String(date.getDate()).padStart(2, '0');
        document.getElementById('edit_visitDate').value = formattedDate;
    }
    
    document.getElementById('edit_chiefComplaint').value = record.chief_complaint || '';
    document.getElementById('edit_historyOfPresentIllness').value = record.history_of_present_illness || '';
    document.getElementById('edit_physicalExamination').value = record.physical_examination || '';
    document.getElementById('edit_diagnosis').value = record.diagnosis || '';
    document.getElementById('edit_treatmentPlan').value = record.treatment_plan || '';
    document.getElementById('edit_medicationsPrescribed').value = record.medications_prescribed || '';
    document.getElementById('edit_followUpInstructions').value = record.follow_up_instructions || '';
}

// Load dropdowns for edit modal
async function loadEditDropdowns() {
    try {
        // Load patients
        const patientsResponse = await fetch('/api/patients');
        const patientsData = await patientsResponse.json();
        const editPatientSelect = document.getElementById('edit_patientId');
        
        if (editPatientSelect) {
            const patients = patientsData.patients || patientsData;
            editPatientSelect.innerHTML = '<option value="">Select Patient</option>';
            if (Array.isArray(patients)) {
                patients.forEach(patient => {
                    const option = document.createElement('option');
                    option.value = patient.id;
                    option.textContent = `${patient.first_name} ${patient.last_name} (ID: ${patient.patient_id || patient.id})`;
                    editPatientSelect.appendChild(option);
                });
            }
        }
        
        // Load doctors
        const doctorsResponse = await fetch('/api/doctors');
        const doctorsData = await doctorsResponse.json();
        const editDoctorSelect = document.getElementById('edit_doctorId');
        
        if (editDoctorSelect) {
            editDoctorSelect.innerHTML = '<option value="">Select Doctor</option>';
            if (Array.isArray(doctorsData)) {
                doctorsData.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name}`;
                    if (doctor.specialization) {
                        option.textContent += ` (${doctor.specialization})`;
                    }
                    editDoctorSelect.appendChild(option);
                });
            }
        }
        
    } catch (error) {
        console.error('Error loading edit dropdowns:', error);
    }
}

// Delete record
async function deleteRecord(id) {
    const confirmed = await confirmAction({
        title: 'Confirm Action',
        message: 'Are you sure you want to delete this medical record? This action cannot be undone.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/medical-records/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showSuccess('Operation completed successfully!'); location.reload();
            } else {
                const error = await response.json();
                showError('Error deleting medical record: ' + error.message);
            }
        } catch (error) {
            showError('Error deleting medical record: ' + error.message);
        }
    }
}
