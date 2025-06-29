// Appointments Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const addAppointmentForm = document.getElementById('addAppointmentForm');
    
    // Load today's stats on page load
    loadTodayStats();
    
    // Setup event listeners for buttons
    setupEventListeners();
    
    if (addAppointmentForm) {
        addAppointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.patient_id) {
                showError('Please select a patient');
                return;
            }
            
            if (!data.doctor_id) {
                showError('Please select a doctor');
                return;
            }
            
            if (!data.appointment_date) {
                showError('Please select an appointment date and time');
                return;
            }
            
            try {
                console.log('Sending appointment data:', data); // Debug log
                
                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Response status:', response.status); // Debug log
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('Appointment created:', result); // Debug log
                    
                    // Close modal and reload page
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addAppointmentModal'));
                    if (modal) {
                        modal.hide();
                    }
                    
                    // Reset form for next use
                    addAppointmentForm.reset();
                    document.getElementById('patient_id').value = '';
                    document.getElementById('doctor_id').value = '';
                    document.getElementById('patientResults').innerHTML = '';
                    document.getElementById('doctorResults').innerHTML = '';
                    
                    // Show success message
                    showError('Appointment scheduled successfully!');
                    showSuccess('Operation completed successfully!'); location.reload();
                } else {
                    const error = await response.json();
                    console.error('Error response:', error); // Debug log
                    showError('Error creating appointment: ' + (error.error || error.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error creating appointment:', error);
                showError('Error creating appointment: ' + error.message);
            }
        });
    }
    
    // Event delegation for delete, patient selection, and doctor selection buttons
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.delete-appointment-btn')) {
            const button = e.target.closest('.delete-appointment-btn');
            const id = button.getAttribute('data-appointment-id');
            await deleteAppointment(id);
        } else if (e.target.closest('.select-patient-btn')) {
            const button = e.target.closest('.select-patient-btn');
            const patientId = button.getAttribute('data-patient-id');
            const patientName = button.getAttribute('data-patient-name');
            selectPatient(patientId, patientName);
        } else if (e.target.closest('.select-doctor-btn')) {
            const button = e.target.closest('.select-doctor-btn');
            const doctorId = button.getAttribute('data-doctor-id');
            const doctorName = button.getAttribute('data-doctor-name');
            selectDoctor(doctorId, doctorName);
        }
    });
});

// Setup event listeners for filter and search
function setupEventListeners() {
    // Search input handler
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchAppointments);
    }
    
    // Date filter handler
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', filterAppointments);
    }
    
    // Status filter handler
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAppointments);
    }
    
    // Clear filters button handler
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Patient search input handler
    const patientSearch = document.getElementById('patient_search');
    if (patientSearch) {
        patientSearch.addEventListener('keyup', searchPatients);
    }
    
    // Doctor search input handler
    const doctorSearch = document.getElementById('doctor_search');
    if (doctorSearch) {
        doctorSearch.addEventListener('keyup', searchDoctors);
    }
    
    // Reset form when modal is opened
    const addAppointmentModal = document.getElementById('addAppointmentModal');
    if (addAppointmentModal) {
        addAppointmentModal.addEventListener('show.bs.modal', function() {
            // Reset form
            const form = document.getElementById('addAppointmentForm');
            if (form) {
                form.reset();
                // Clear hidden fields and search results
                document.getElementById('patient_id').value = '';
                document.getElementById('doctor_id').value = '';
                document.getElementById('patientResults').innerHTML = '';
                document.getElementById('doctorResults').innerHTML = '';
            }
        });
    }
}

// Load today's appointment statistics
async function loadTodayStats() {
    try {
        const response = await fetch('/api/appointments/today');
        const appointments = await response.json();
        
        const stats = {
            total: appointments.length,
            scheduled: appointments.filter(a => a.status === 'scheduled').length,
            confirmed: appointments.filter(a => a.status === 'confirmed').length,
            inProgress: appointments.filter(a => a.status === 'in_progress').length,
            completed: appointments.filter(a => a.status === 'completed').length
        };
        
        const statsElement = document.getElementById('todayStats');
        if (statsElement) {
            statsElement.innerHTML = `
                <span class="badge bg-primary">Total: ${stats.total}</span>
                <span class="badge bg-info">Scheduled: ${stats.scheduled}</span>
                <span class="badge bg-success">Confirmed: ${stats.confirmed}</span>
                <span class="badge bg-warning">In Progress: ${stats.inProgress}</span>
                <span class="badge bg-secondary">Completed: ${stats.completed}</span>
            `;
        }
    } catch (error) {
        console.error('Error loading today stats:', error);
    }
}

// Status color mapping
function getStatusColor(status) {
    const colors = {
        'scheduled': 'primary',
        'confirmed': 'info',
        'in_progress': 'warning',
        'completed': 'success',
        'cancelled': 'danger',
        'no_show': 'secondary'
    };
    return colors[status] || 'secondary';
}

// Search functionality
let searchTimeout;
function searchAppointments() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const rows = document.querySelectorAll('#appointmentsTable tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }, 300);
}

// Filter functionality
function filterAppointments() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const rows = document.querySelectorAll('#appointmentsTable tbody tr');
    
    rows.forEach(row => {
        let show = true;
        
        if (statusFilter && row.dataset.status !== statusFilter) {
            show = false;
        }
        
        if (dateFilter) {
            const appointmentDate = new Date(row.cells[3].textContent.trim());
            const filterDate = new Date(dateFilter);
            if (appointmentDate.toDateString() !== filterDate.toDateString()) {
                show = false;
            }
        }
        
        row.style.display = show ? '' : 'none';
    });
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('searchInput').value = '';
    
    const rows = document.querySelectorAll('#appointmentsTable tbody tr');
    rows.forEach(row => row.style.display = '');
}

// Patient search
async function searchPatients() {
    const searchTerm = document.getElementById('patient_search').value;
    const resultsDiv = document.getElementById('patientResults');
    
    if (searchTerm.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    // Show loading state
    resultsDiv.innerHTML = '<div class="text-center p-2"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    
    try {
        const response = await fetch(`/api/patients/search?q=${encodeURIComponent(searchTerm)}`);
        const patientsData = await response.json();
        
        // Handle both array and object responses
        const patients = Array.isArray(patientsData) ? patientsData : (patientsData.patients || []);
        
        if (patients.length === 0) {
            resultsDiv.innerHTML = '<div class="text-center p-2 text-muted">No patients found</div>';
            return;
        }
        
        let html = '<div class="list-group">';
        patients.forEach(patient => {
            html += `
                <button type="button" class="list-group-item list-group-item-action select-patient-btn" data-patient-id="${patient.id}" data-patient-name="${patient.first_name} ${patient.last_name}">
                    <strong>${patient.first_name} ${patient.last_name}</strong><br>
                    <small>ID: ${patient.patient_id} | DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}</small>
                </button>
            `;
        });
        html += '</div>';
        
        resultsDiv.innerHTML = html;
    } catch (error) {
        console.error('Error searching patients:', error);
        resultsDiv.innerHTML = '<div class="text-center p-2 text-danger">Error searching patients</div>';
    }
}

// Doctor search
async function searchDoctors() {
    const searchTerm = document.getElementById('doctor_search').value;
    const resultsDiv = document.getElementById('doctorResults');
    
    if (searchTerm.length < 2) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    // Show loading state
    resultsDiv.innerHTML = '<div class="text-center p-2"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    
    try {
        const response = await fetch(`/api/doctors?search=${encodeURIComponent(searchTerm)}`);
        const doctorsData = await response.json();
        
        // Handle both array and object responses
        const doctors = Array.isArray(doctorsData) ? doctorsData : (doctorsData.doctors || []);
        
        const filtered = doctors.filter(doctor => 
            doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        if (filtered.length === 0) {
            resultsDiv.innerHTML = '<div class="text-center p-2 text-muted">No doctors found</div>';
            return;
        }
        
        let html = '<div class="list-group">';
        filtered.forEach(doctor => {
            html += `
                <button type="button" class="list-group-item list-group-item-action select-doctor-btn" data-doctor-id="${doctor.id}" data-doctor-name="Dr. ${doctor.first_name} ${doctor.last_name}">
                    <strong>Dr. ${doctor.first_name} ${doctor.last_name}</strong><br>
                    <small>${doctor.specialization || 'General'} | ${doctor.department_name || 'Department'}</small>
                </button>
            `;
        });
        html += '</div>';
        
        resultsDiv.innerHTML = html;
    } catch (error) {
        console.error('Error searching doctors:', error);
        resultsDiv.innerHTML = '<div class="text-center p-2 text-danger">Error searching doctors</div>';
    }
}

// Select patient
function selectPatient(id, name) {
    document.getElementById('patient_id').value = id;
    document.getElementById('patient_search').value = name;
    document.getElementById('patientResults').innerHTML = '';
}

// Select doctor
function selectDoctor(id, name) {
    document.getElementById('doctor_id').value = id;
    document.getElementById('doctor_search').value = name;
    document.getElementById('doctorResults').innerHTML = '';
}

// Edit Appointment Function
// Update appointment status (for main appointments page)
async function updateStatus(id, status) {
    const statusNames = {
        'scheduled': 'scheduled',
        'confirmed': 'confirmed',
        'in_progress': 'in progress',
        'completed': 'completed',
        'cancelled': 'cancelled',
        'no_show': 'no show'
    };
    
    const confirmMessage = `Are you sure you want to mark this appointment as ${statusNames[status] || status}?`;
    const confirmed = await confirmAction({
        title: 'Confirm Action',
        message: confirmMessage,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'warning'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                showSuccess('Operation completed successfully!'); location.reload();
            } else {
                const errorData = await response.json();
                showError('Error updating appointment: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error) {
            showError('Error updating appointment: ' + error.message);
        }
    }
}

// View appointment
function viewAppointment(id) {
    window.location.href = `/appointments/${id}`;
}

// Mark appointment in progress
function markInProgress(id) {
    updateStatus(id, 'in_progress');
}

// Mark appointment completed
function markCompleted(id) {
    updateStatus(id, 'completed');
}

// Cancel appointment
function cancelAppointment(id) {
    updateStatus(id, 'cancelled');
}

// Delete appointment
async function deleteAppointment(id) {
    const confirmed = await confirmAction({
        title: 'Delete Appointment',
        message: 'Are you sure you want to delete this appointment? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showSuccess('Operation completed successfully!'); location.reload();
            } else {
                const errorData = await response.json();
                showError('Error deleting appointment: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error) {
            showError('Error deleting appointment: ' + error.message);
        }
    }
}

// Load patients and doctors for select dropdowns
async function loadPatientsAndDoctors() {
    try {
        const [patientsResponse, doctorsResponse] = await Promise.all([
            fetch('/api/patients'),
            fetch('/api/doctors')
        ]);
        
        const patientsData = await patientsResponse.json();
        const patients = patientsData.patients || patientsData;
        const doctors = await doctorsResponse.json();
        
        // Populate patient selects
        const patientSelects = document.querySelectorAll('.patient-select');
        patientSelects.forEach(select => {
            select.innerHTML = '<option value="">Select Patient</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.first_name} ${patient.last_name}`;
                select.appendChild(option);
            });
        });
        
        // Populate doctor selects
        const doctorSelects = document.querySelectorAll('.doctor-select');
        doctorSelects.forEach(select => {
            select.innerHTML = '<option value="">Select Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name}`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading patients and doctors:', error);
    }
}

// Load data when modal is shown
document.addEventListener('DOMContentLoaded', function() {
    const addModal = document.getElementById('addAppointmentModal');
    if (addModal) {
        addModal.addEventListener('shown.bs.modal', loadPatientsAndDoctors);
    }
});
