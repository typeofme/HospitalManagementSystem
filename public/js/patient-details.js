// Patient Details JavaScript Functions

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Event delegation for edit and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-patient-btn')) {
            const button = e.target.closest('.edit-patient-btn');
            const patientId = button.getAttribute('data-patient-id');
            editPatient(patientId);
        } else if (e.target.closest('.delete-patient-btn')) {
            const button = e.target.closest('.delete-patient-btn');
            const patientId = button.getAttribute('data-patient-id');
            deletePatient(patientId);
        }
    });
}

// Edit patient
function editPatient(id) {
    // Redirect to patients page with edit mode
    window.location.href = `/patients?edit=${id}`;
}

// Delete patient
async function deletePatient(id) {
    const confirmed = await confirmAction({
        title: 'Delete Patient',
        message: 'Are you sure you want to delete this patient? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/patients/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                window.location.href = '/patients';
            } else {
                const error = await response.json();
                showError('Error deleting patient: ' + error.message);
            }
        } catch (error) {
            showError('Error deleting patient: ' + error.message);
        }
    }
}
