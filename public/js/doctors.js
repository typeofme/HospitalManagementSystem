// Doctors Management JavaScript

document.addEventListener("DOMContentLoaded", function () {
  const addDoctorForm = document.getElementById("addDoctorForm");
  const editDoctorForm = document.getElementById("editDoctorForm");
  const departmentFilter = document.getElementById("departmentFilter");
  const assignDoctorForm = document.getElementById("assignDoctorForm");

  // Administrative Actions Functions
  window.archiveInactiveDoctors = async function () {
    if (
      !confirm(
        "Are you sure you want to archive all inactive doctors who have been inactive for more than 6 months?"
      )
    ) {
      return;
    }

    const btn = document.getElementById("archiveInactiveDoctorsBtn");
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing...';

    try {
      const response = await fetch(
        "/api/database/procedures/archive-inactive-doctors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showActionResult(
          "success",
          `Successfully archived ${data.archived_count} inactive doctors.`
        );
        // Refresh the page after 2 seconds to show updated data
        setTimeout(() => location.reload(), 2000);
      } else {
        showActionResult(
          "error",
          data.error || "Failed to archive inactive doctors"
        );
      }
    } catch (error) {
      showActionResult("error", "Error: " + error.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML =
        '<i class="fas fa-archive me-1"></i>Archive Inactive Doctors';
    }
  };

  // Assign Doctor to Department Form Handler
  if (assignDoctorForm) {
    assignDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch(
          "/api/database/procedures/assign-doctor-department",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          showActionResult("success", result.message);
          // Close modal
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("assignDoctorModal")
          );
          modal.hide();
          // Reset form
          assignDoctorForm.reset();
          // Refresh page after 2 seconds
          setTimeout(() => location.reload(), 2000);
        } else {
          showActionResult(
            "error",
            result.error || "Failed to assign doctor to department"
          );
        }
      } catch (error) {
        showActionResult("error", "Error: " + error.message);
      }
    });
  }

  function showActionResult(type, message) {
    const resultsDiv = document.getElementById("actionResults");
    const contentDiv = document.getElementById("actionResultsContent");

    resultsDiv.style.display = "block";
    resultsDiv.className = `alert alert-${
      type === "success" ? "success" : "danger"
    }`;
    contentDiv.innerHTML = `
      <i class="fas fa-${
        type === "success" ? "check-circle" : "exclamation-triangle"
      } me-2"></i>
      ${message}
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      resultsDiv.style.display = "none";
    }, 5000);
  }

  // Department filter functionality
  if (departmentFilter) {
    departmentFilter.addEventListener("change", async (e) => {
      const departmentId = e.target.value;

      if (departmentId) {
        // First, filter visible doctors in the table (immediate visual feedback)
        filterDoctorsByDepartment(departmentId);

        try {
          // Then, get accurate count from database function (for verification)
          const response = await fetch(
            `/api/database/doctors-by-department/${departmentId}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log(
              `Database count: ${data.count}, Visual count: ${
                document.getElementById("filteredDoctorsCount").textContent
              }`
            );
            // Optionally update with database count for accuracy
            // document.getElementById("filteredDoctorsCount").textContent = data.count;
          }
        } catch (error) {
          console.error("Error fetching department statistics:", error);
        }
      } else {
        // Show all doctors
        const totalDoctors = document.querySelectorAll("tbody tr").length;
        document.getElementById("filteredDoctorsCount").textContent =
          totalDoctors;
        showAllDoctors();
      }
    });
  }

  function filterDoctorsByDepartment(departmentId) {
    const rows = document.querySelectorAll("tbody tr");
    let visibleCount = 0;

    rows.forEach((row) => {
      const departmentCell = row.cells[2]; // Department column
      const departmentName = departmentCell.textContent.trim().toLowerCase();

      // Get department name from the select option
      const selectedOption = departmentFilter.querySelector(
        `option[value="${departmentId}"]`
      );
      const targetDepartmentName = selectedOption
        ? selectedOption.textContent.trim().toLowerCase()
        : "";

      console.log(
        `Comparing: "${departmentName}" === "${targetDepartmentName}"`
      ); // Debug log

      if (departmentName === targetDepartmentName) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    // Update the filtered count display (use visual count instead of database count for immediate feedback)
    document.getElementById("filteredDoctorsCount").textContent = visibleCount;
  }

  function showAllDoctors() {
    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.style.display = "";
    });
  }

  if (addDoctorForm) {
    addDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch("/api/doctors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          showSuccess("Doctor added successfully!");
          showSuccess("Operation completed successfully!");
          location.reload();
        } else {
          const error = await response.json();
          showError("Error: " + error.message);
        }
      } catch (error) {
        showError("Error: " + error.message);
      }
    });
  }

  if (editDoctorForm) {
    editDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const id = data.id;
      delete data.id;

      try {
        const response = await fetch(`/api/doctors/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          showSuccess("Doctor updated successfully!");
          showSuccess("Operation completed successfully!");
          location.reload();
        } else {
          const error = await response.json();
          showError("Error: " + error.message);
        }
      } catch (error) {
        showError("Error: " + error.message);
      }
    });
  }

  // Event delegation for edit and delete buttons
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".edit-doctor-btn")) {
      const button = e.target.closest(".edit-doctor-btn");
      const id = button.getAttribute("data-doctor-id");
      await editDoctor(id);
    } else if (e.target.closest(".delete-doctor-btn")) {
      const button = e.target.closest(".delete-doctor-btn");
      const id = button.getAttribute("data-doctor-id");
      await deleteDoctor(id);
    }
  });

  // Search functionality
  const searchInput = document.getElementById("doctorSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const doctorRows = document.querySelectorAll(".doctor-row");

      doctorRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }
});

// Edit Doctor Function
async function editDoctor(id) {
  try {
    const response = await fetch(`/api/doctors/${id}`);
    const doctor = await response.json();

    document.getElementById("edit_id").value = doctor.id;
    document.getElementById("edit_employee_id").value =
      doctor.employee_id || "";
    document.getElementById("edit_first_name").value = doctor.first_name;
    document.getElementById("edit_last_name").value = doctor.last_name;
    document.getElementById("edit_email").value = doctor.email || "";
    document.getElementById("edit_phone").value = doctor.phone || "";
    document.getElementById("edit_specialization").value =
      doctor.specialization || "";
    document.getElementById("edit_department_id").value =
      doctor.department_id || "";
    document.getElementById("edit_license_number").value =
      doctor.license_number || "";
    document.getElementById("edit_address").value = doctor.address || "";
    document.getElementById("edit_status").value = doctor.status || "active";

    new bootstrap.Modal(document.getElementById("editDoctorModal")).show();
  } catch (error) {
    showError("Error loading doctor: " + error.message);
  }
}

// Delete Doctor Function
async function deleteDoctor(id) {
  const confirmed = await confirmAction({
    title: "Delete Doctor",
    message: "Are you sure you want to delete this doctor?",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });

  if (confirmed) {
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess("Doctor deleted successfully!");
        showSuccess("Operation completed successfully!");
        location.reload();
      } else {
        const error = await response.json();
        showError("Error: " + error.message);
      }
    } catch (error) {
      showError("Error: " + error.message);
    }
  }
}
