// Users Management JavaScript

let users = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
    updateStats();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }

    // Add user form submission
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }

    // Edit user form submission
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', handleEditUser);
    }

    // Event delegation for action buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-user-btn')) {
            const button = e.target.closest('.edit-user-btn');
            const userId = button.getAttribute('data-user-id');
            editUser(userId);
        } else if (e.target.closest('.delete-user-btn')) {
            const button = e.target.closest('.delete-user-btn');
            const userId = button.getAttribute('data-user-id');
            const userName = button.getAttribute('data-user-name');
            deleteUser(userId, userName);
        } else if (e.target.closest('.toggle-status-btn')) {
            const button = e.target.closest('.toggle-status-btn');
            const userId = button.getAttribute('data-user-id');
            const currentStatus = button.getAttribute('data-current-status') === 'true';
            toggleUserStatus(userId, currentStatus);
        }
    });
}

// Load users from API
async function loadUsers() {
    try {
        showLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        users = data.users || data;
        
        renderUsers(users);
        updateStats();
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Error loading users: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Render users table
function renderUsers(usersToRender) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (!usersToRender || usersToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No users found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usersToRender.map(user => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar me-3">
                        ${getInitials(user.first_name, user.last_name)}
                    </div>
                    <div>
                        <div class="fw-bold">${user.first_name} ${user.last_name}</div>
                        <small class="text-muted">@${user.username}</small>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge role-${user.role}">${user.role}</span>
            </td>
            <td>
                <span class="status-badge status-${user.is_active ? 'active' : 'inactive'}">
                    ${user.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                ${user.last_login ? formatDate(user.last_login) : '<span class="text-muted">Never</span>'}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm-modern btn-success-modern edit-user-btn" 
                            data-user-id="${user.id}" 
                            title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm-modern ${user.is_active ? 'btn-warning' : 'btn-success'} toggle-status-btn" 
                            data-user-id="${user.id}" 
                            data-current-status="${user.is_active}"
                            title="${user.is_active ? 'Deactivate' : 'Activate'} User">
                        <i class="fas fa-${user.is_active ? 'user-slash' : 'user-check'}"></i>
                    </button>
                    <button class="btn btn-sm-modern btn-danger-modern delete-user-btn" 
                            data-user-id="${user.id}" 
                            data-user-name="${user.first_name} ${user.last_name}"
                            title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filter users based on search
function filterUsers() {
    const searchTerm = document.getElementById('searchUsers')?.value.toLowerCase() || '';
    
    if (!searchTerm) {
        renderUsers(users);
        return;
    }
    
    const filteredUsers = users.filter(user => {
        return (
            user.first_name.toLowerCase().includes(searchTerm) ||
            user.last_name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm)
        );
    });
    
    renderUsers(filteredUsers);
}

// Handle add user form submission
async function handleAddUser(event) {
    event.preventDefault();
    
    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        is_active: document.getElementById('isActive').checked
    };
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.username || 
        !formData.email || !formData.password || !formData.role) {
        showError('Please fill in all required fields');
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('User created successfully!');
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            document.getElementById('addUserForm').reset();
            loadUsers(); // Reload users
        } else {
            showError(result.error || 'Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        showError('Error creating user: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Edit user
async function editUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        
        const user = await response.json();
        
        // Populate edit form
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editFirstName').value = user.first_name;
        document.getElementById('editLastName').value = user.last_name;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editIsActive').checked = user.is_active;
        document.getElementById('editPassword').value = ''; // Clear password field
        
        // Show modal
        new bootstrap.Modal(document.getElementById('editUserModal')).show();
    } catch (error) {
        console.error('Error fetching user details:', error);
        showError('Error loading user details: ' + error.message);
    }
}

// Handle edit user form submission
async function handleEditUser(event) {
    event.preventDefault();
    
    const userId = document.getElementById('editUserId').value;
    const formData = {
        first_name: document.getElementById('editFirstName').value,
        last_name: document.getElementById('editLastName').value,
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        role: document.getElementById('editRole').value,
        is_active: document.getElementById('editIsActive').checked
    };
    
    // Only include password if it was changed
    const password = document.getElementById('editPassword').value;
    if (password) {
        formData.password = password;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('User updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
            loadUsers(); // Reload users
        } else {
            showError(result.error || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showError('Error updating user: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Toggle user status
async function toggleUserStatus(userId, currentStatus) {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    
    const confirmed = await confirmAction({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
        message: `Are you sure you want to ${action} this user?`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancel',
        type: newStatus ? 'success' : 'danger'
    });
    
    if (!confirmed) {
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: newStatus })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess(`User ${action}d successfully!`);
            loadUsers(); // Reload users
        } else {
            showError(result.error || `Failed to ${action} user`);
        }
    } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        showError(`Error ${action}ing user: ` + error.message);
    } finally {
        showLoading(false);
    }
}

// Delete user
async function deleteUser(userId, userName) {
    const confirmed = await confirmAction({
        title: 'Delete User',
        message: `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
    });
    
    if (!confirmed) {
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess('User deleted successfully!');
            loadUsers(); // Reload users
        } else {
            showError(result.error || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showError('Error deleting user: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Update statistics
function updateStats() {
    if (!users || users.length === 0) return;
    
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const inactiveUsers = totalUsers - activeUsers;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('inactiveUsers').textContent = inactiveUsers;
    document.getElementById('adminUsers').textContent = adminUsers;
}

// Utility functions
function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}
