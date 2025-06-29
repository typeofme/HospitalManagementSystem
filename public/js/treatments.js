// Treatments JavaScript Functions

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterTreatments);
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTreatments);
    }

    // Form submission
    const addTreatmentForm = document.getElementById('addTreatmentForm');
    if (addTreatmentForm) {
        addTreatmentForm.addEventListener('submit', handleAddTreatment);
    }
    
    const editTreatmentForm = document.getElementById('editTreatmentForm');
    if (editTreatmentForm) {
        editTreatmentForm.addEventListener('submit', handleEditTreatment);
    }
    
    // Event delegation for edit and delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-treatment-btn')) {
            const button = e.target.closest('.edit-treatment-btn');
            const treatmentId = button.getAttribute('data-treatment-id');
            editTreatment(treatmentId);
        } else if (e.target.closest('.delete-treatment-btn')) {
            const button = e.target.closest('.delete-treatment-btn');
            const treatmentId = button.getAttribute('data-treatment-id');
            deleteTreatment(treatmentId);
        }
    });
}

// Filter treatments based on search and category
function filterTreatments() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
    const treatmentCards = document.querySelectorAll('.treatment-card');
    let visibleCount = 0;
    
    treatmentCards.forEach(card => {
        const name = card.dataset.name || '';
        const category = card.dataset.category || '';
        
        const matchesSearch = name.includes(searchTerm) || 
                            card.textContent.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || category === categoryFilter;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const noResultsDiv = document.querySelector('.col-12 .text-center');
    if (noResultsDiv && visibleCount === 0 && treatmentCards.length > 0) {
        noResultsDiv.style.display = 'block';
    } else if (noResultsDiv) {
        noResultsDiv.style.display = 'none';
    }
}

// Handle add treatment form submission
async function handleAddTreatment(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('treatmentName').value,
        treatment_code: document.getElementById('treatmentCode').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        duration_minutes: document.getElementById('durationMinutes').value ? parseInt(document.getElementById('durationMinutes').value) : null,
        cost: document.getElementById('cost').value ? parseFloat(document.getElementById('cost').value) : null,
        equipment_required: document.getElementById('equipmentRequired').value,
        precautions: document.getElementById('precautions').value,
        is_active: document.getElementById('isActive').value === '1'
    };
    
    try {
        const response = await fetch('/api/treatments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showSuccess('Operation completed successfully!'); 
            location.reload();
        } else {
            const error = await response.json();
            showError('Error creating treatment: ' + error.message);
        }
    } catch (error) {
        showError('Error creating treatment: ' + error.message);
    }
}

// Edit treatment
async function editTreatment(id) {
    try {
        // Fetch the treatment data
        const response = await fetch(`/api/treatments/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch treatment');
        }
        
        const treatment = await response.json();
        console.log('Fetched treatment for editing:', treatment);
        
        // Populate the edit modal
        populateEditModal(treatment);
        
        // Show the edit modal
        const editModal = new bootstrap.Modal(document.getElementById('editTreatmentModal'));
        editModal.show();
        
    } catch (error) {
        console.error('Error fetching treatment:', error);
        showError('Error loading treatment: ' + error.message);
    }
}

// Populate edit modal with treatment data
function populateEditModal(treatment) {
    // Set the treatment ID
    document.getElementById('edit_treatment_id').value = treatment.id;
    
    // Set form fields
    document.getElementById('edit_treatmentName').value = treatment.name || '';
    document.getElementById('edit_treatmentCode').value = treatment.treatment_code || '';
    document.getElementById('edit_category').value = treatment.category || '';
    document.getElementById('edit_durationMinutes').value = treatment.duration_minutes || '';
    document.getElementById('edit_cost').value = treatment.cost || '';
    document.getElementById('edit_isActive').value = treatment.is_active ? '1' : '0';
    document.getElementById('edit_description').value = treatment.description || '';
    document.getElementById('edit_equipmentRequired').value = treatment.equipment_required || '';
    document.getElementById('edit_precautions').value = treatment.precautions || '';
}

// Handle edit treatment form submission
async function handleEditTreatment(event) {
    event.preventDefault();
    
    const treatmentId = document.getElementById('edit_treatment_id').value;
    const formData = {
        name: document.getElementById('edit_treatmentName').value,
        treatment_code: document.getElementById('edit_treatmentCode').value,
        category: document.getElementById('edit_category').value,
        duration_minutes: document.getElementById('edit_durationMinutes').value ? parseInt(document.getElementById('edit_durationMinutes').value) : null,
        cost: document.getElementById('edit_cost').value ? parseFloat(document.getElementById('edit_cost').value) : null,
        is_active: document.getElementById('edit_isActive').value === '1',
        description: document.getElementById('edit_description').value,
        equipment_required: document.getElementById('edit_equipmentRequired').value,
        precautions: document.getElementById('edit_precautions').value
    };
    
    // Validate required fields
    if (!formData.name) {
        showError('Please enter a treatment name');
        return;
    }
    
    console.log('Updating treatment data:', formData);
    
    try {
        const response = await fetch(`/api/treatments/${treatmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Close modal and reload page
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTreatmentModal'));
            if (modal) {
                modal.hide();
            }
            showSuccess('Treatment updated successfully!');
            location.reload();
        } else {
            const error = await response.json();
            console.error('Error response:', error);
            showError('Error updating treatment: ' + (error.error || error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating treatment:', error);
        showError('Error updating treatment: ' + error.message);
    }
}

// Delete treatment
async function deleteTreatment(id) {
    const confirmed = await confirmAction({
        title: 'Delete Treatment',
        message: 'Are you sure you want to delete this treatment? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (confirmed) {
        try {
            const response = await fetch(`/api/treatments/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showSuccess('Operation completed successfully!'); location.reload();
            } else {
                const error = await response.json();
                showError('Error deleting treatment: ' + error.message);
            }
        } catch (error) {
            showError('Error deleting treatment: ' + error.message);
        }
    }
}
