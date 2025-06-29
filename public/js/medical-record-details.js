// Medical Record Details JavaScript Functions

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Event delegation for edit, delete, and print buttons
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

// Edit record
function editRecord(id) {
    // Redirect to medical records page with edit mode
    window.location.href = `/medical-records?edit=${id}`;
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
                window.location.href = '/medical-records';
            } else {
                const error = await response.json();
                showError('Error deleting medical record: ' + error.message);
            }
        } catch (error) {
            showError('Error deleting medical record: ' + error.message);
        }
    }
}

// Print record
function printRecord(id) {
    // Create a print-friendly version
    window.print();
}
