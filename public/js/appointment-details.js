// Appointment Details JavaScript Functions

let currentAppointmentId = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get appointment ID from the page
    const editButton = document.querySelector('[data-appointment-id]');
    if (editButton) {
        currentAppointmentId = editButton.dataset.appointmentId;
    }
    
    // Setup edit form handler
    const editForm = document.getElementById('editAppointmentForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
    
    // Setup event listeners for buttons
    setupEventListeners();
});

function setupEventListeners() {
    // Edit appointment buttons
    document.querySelectorAll('.edit-appointment-btn').forEach(button => {
        button.addEventListener('click', function() {
            editAppointment(this.dataset.appointmentId);
        });
    });
    
    // Update status buttons
    document.querySelectorAll('.update-status-btn').forEach(button => {
        button.addEventListener('click', function() {
            updateStatus(this.dataset.appointmentId, this.dataset.status);
        });
    });
    
    // Delete appointment buttons
    document.querySelectorAll('.delete-appointment-btn').forEach(button => {
        button.addEventListener('click', function() {
            deleteAppointment(this.dataset.appointmentId);
        });
    });
}

// Status color mapping function
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

// Update appointment status
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

// Edit appointment - show modal with current data
async function editAppointment(id) {
    try {
        // Fetch current appointment data
        const response = await fetch(`/api/appointments/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch appointment data');
        }
        
        const appointment = await response.json();
        
        // Populate the edit form
        const appointmentDate = new Date(appointment.appointment_date);
        document.getElementById('editAppointmentDate').value = appointmentDate.toISOString().split('T')[0];
        document.getElementById('editAppointmentTime').value = appointmentDate.toTimeString().slice(0, 5); // HH:MM format
        document.getElementById('editStatus').value = appointment.status || 'scheduled';
        document.getElementById('editReason').value = appointment.reason || '';
        document.getElementById('editNotes').value = appointment.notes || '';
        
        // Store the ID for saving
        currentAppointmentId = id;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
        modal.show();
        
    } catch (error) {
        showError('Error loading appointment data: ' + error.message);
    }
}

// Handle edit form submission
async function handleEditSubmit(event) {
    event.preventDefault();
    
    if (!currentAppointmentId) {
        showError('No appointment selected for editing');
        return;
    }
    
    const appointmentDate = document.getElementById('editAppointmentDate').value;
    const appointmentTime = document.getElementById('editAppointmentTime').value;
    
    // Combine date and time into a single datetime string
    const appointmentDateTime = appointmentTime ? `${appointmentDate} ${appointmentTime}:00` : `${appointmentDate} 09:00:00`;
    
    const formData = {
        appointment_date: appointmentDateTime,
        status: document.getElementById('editStatus').value,
        reason: document.getElementById('editReason').value,
        notes: document.getElementById('editNotes').value
    };
    
    try {
        const response = await fetch(`/api/appointments/${currentAppointmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Hide modal and reload page
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal'));
            modal.hide();
            showSuccess('Operation completed successfully!'); location.reload();
        } else {
            const errorData = await response.json();
            showError('Error updating appointment: ' + (errorData.error || 'Unknown error'));
        }
    } catch (error) {
        showError('Error updating appointment: ' + error.message);
    }
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
                window.location.href = '/appointments';
            } else {
                const errorData = await response.json();
                showError('Error deleting appointment: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error) {
            showError('Error deleting appointment: ' + error.message);
        }
    }
}
