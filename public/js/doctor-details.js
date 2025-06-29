// Doctor Details JavaScript Functions

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Event delegation for edit and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-doctor-btn')) {
            const button = e.target.closest('.edit-doctor-btn');
            const doctorId = button.getAttribute('data-doctor-id');
            editDoctor(doctorId);
        } else if (e.target.closest('.delete-doctor-btn')) {
            const button = e.target.closest('.delete-doctor-btn');
            const doctorId = button.getAttribute('data-doctor-id');
            deleteDoctor(doctorId);
        }
    });
}

// Edit doctor
function editDoctor(id) {
    // Redirect to doctors page with edit mode
    window.location.href = `/doctors?edit=${id}`;
}

// Delete doctor
async function deleteDoctor(id) {
    const confirmed = await confirmAction({
        title: 'Delete Doctor',
        message: 'Are you sure you want to delete this doctor? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/doctors/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                window.location.href = '/doctors';
            } else {
                const error = await response.json();
                showError('Error deleting doctor: ' + error.message);
            }
        } catch (error) {
            showError('Error deleting doctor: ' + error.message);
        }
    }
}
