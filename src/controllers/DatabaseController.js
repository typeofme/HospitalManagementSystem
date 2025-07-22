const db = require("../../database/connection");

class DatabaseController {
  // Database Functions Implementation
  static async getCurrentPatientsCount(req, res) {
    try {
      const result = await db.raw(
        "SELECT GetCurrentPatientsCount() as patient_count"
      );
      res.json({
        success: true,
        patient_count: result[0][0].patient_count,
        message: "Current active patients count retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async calculatePatientAge(req, res) {
    try {
      const { patient_id, calculation_date } = req.body;

      if (!patient_id) {
        return res.status(400).json({
          success: false,
          error: "Patient ID is required",
        });
      }

      const date = calculation_date || new Date().toISOString().split("T")[0];
      const result = await db.raw(
        "SELECT CalculatePatientAge(?, ?) as patient_age",
        [patient_id, date]
      );

      res.json({
        success: true,
        patient_id: patient_id,
        calculation_date: date,
        patient_age: result[0][0].patient_age,
        message: "Patient age calculated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getTotalDoctors(req, res) {
    try {
      const result = await db.raw(
        "SELECT get_total_doctors() as total_doctors"
      );
      res.json({
        success: true,
        total_doctors: result[0][0].total_doctors,
        message: "Total doctors count retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getDoctorsByDepartment(req, res) {
    try {
      const { departmentId } = req.params;

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          error: "Department ID is required",
        });
      }

      const result = await db.raw(
        "SELECT get_doctors_by_department(?) as count",
        [departmentId]
      );

      res.json({
        success: true,
        department_id: departmentId,
        count: result[0][0].count,
        message: "Doctors count by department retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async archiveInactiveDoctors(req, res) {
    try {
      const result = await db.raw("CALL ArchiveInactiveDoctors()");
      const archiveResult = result[0][0][0]; // MySQL returns nested arrays for stored procedure results

      res.json({
        success: true,
        archived_count: archiveResult.archived_count,
        message: archiveResult.message,
        archived_at: archiveResult.archived_at,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async assignDoctorToDepartment(req, res) {
    try {
      const { doctorId, departmentId } = req.body;

      if (!doctorId || !departmentId) {
        return res.status(400).json({
          success: false,
          error: "Doctor ID and Department ID are required",
        });
      }

      const result = await db.raw("CALL AssignDoctorToDepartment(?, ?)", [
        doctorId,
        departmentId,
      ]);
      const assignResult = result[0][0][0]; // MySQL returns nested arrays for stored procedure results

      if (assignResult.status === "ERROR") {
        return res.status(400).json({
          success: false,
          error: assignResult.message,
        });
      }

      res.json({
        success: true,
        status: assignResult.status,
        message: assignResult.message,
        doctor_id: assignResult.doctor_id,
        new_department_id: assignResult.new_department_id,
        department_name: assignResult.department_name,
        updated_at: assignResult.updated_at,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Database Procedures Implementation
  static async generateHospitalStats(req, res) {
    try {
      const result = await db.raw("CALL GenerateHospitalStats()");
      const stats = result[0][0][0]; // MySQL returns nested arrays for stored procedure results

      res.json({
        success: true,
        statistics: {
          total_patients: stats["Total Patients"],
          total_doctors: stats["Total Doctors"],
          total_appointments: stats["Total Appointments"],
          average_patient_age: parseFloat(stats["Average Patient Age"]),
        },
        message: "Hospital statistics generated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async bookAppointmentWithValidation(req, res) {
    try {
      const { patient_id, doctor_id, appointment_date } = req.body;

      if (!patient_id || !doctor_id || !appointment_date) {
        return res.status(400).json({
          success: false,
          error: "Patient ID, Doctor ID, and appointment date are required",
        });
      }

      // Call the stored procedure with OUT parameters
      const result = await db.raw(
        `
        CALL BookAppointment(?, ?, ?, @appointment_id, @result_message);
        SELECT @appointment_id as appointment_id, @result_message as result_message;
      `,
        [patient_id, doctor_id, appointment_date]
      );

      const procedureResult = result[0][1][0]; // Get the SELECT result
      const appointmentId = procedureResult.appointment_id;
      const message = procedureResult.result_message;

      if (appointmentId > 0) {
        res.status(201).json({
          success: true,
          appointment_id: appointmentId,
          message: message,
        });
      } else {
        res.status(400).json({
          success: false,
          error: message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Database Views Implementation
  static async getPatientSummaryView(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const patients = await db
        .select("*")
        .from("patient_summary_view")
        .limit(limit)
        .offset(offset)
        .orderBy("registration_date", "desc");

      const totalCount = await db("patient_summary_view").count("* as count");
      const totalPages = Math.ceil(totalCount[0].count / limit);

      res.json({
        success: true,
        data: patients,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalCount[0].count,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Patient summary retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getDoctorScheduleView(req, res) {
    try {
      const doctors = await db
        .select("*")
        .from("doctor_schedule_view")
        .orderBy("doctor_name");

      res.json({
        success: true,
        data: doctors,
        message: "Doctor schedule retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getAppointmentDetailsView(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      let query = db.select("*").from("appointment_details_view");

      // Add filters if provided
      if (req.query.status) {
        query = query.where("status", req.query.status);
      }
      if (req.query.doctor_id) {
        query = query.where("doctor_id", req.query.doctor_id);
      }
      if (req.query.patient_id) {
        query = query.where("patient_id", req.query.patient_id);
      }
      if (req.query.date) {
        query = query.whereRaw("DATE(appointment_date) = ?", [req.query.date]);
      }

      const appointments = await query
        .limit(limit)
        .offset(offset)
        .orderBy("appointment_date", "desc");

      const totalCount = await db("appointment_details_view").count(
        "* as count"
      );
      const totalPages = Math.ceil(totalCount[0].count / limit);

      res.json({
        success: true,
        data: appointments,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalCount[0].count,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Appointment details retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getActiveAppointmentsView(req, res) {
    try {
      const appointments = await db
        .select("*")
        .from("active_appointments_view")
        .orderBy("appointment_date");

      res.json({
        success: true,
        data: appointments,
        message: "Active appointments retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getTodayAppointmentsView(req, res) {
    try {
      const appointments = await db
        .select("*")
        .from("today_appointments_view")
        .orderBy("appointment_date");

      res.json({
        success: true,
        data: appointments,
        message: "Today's appointments retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Audit Log (Trigger Results) Implementation
  static async getAuditLog(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      let query = db.select("*").from("audit_log");

      // Add filters if provided
      if (req.query.table_name) {
        query = query.where("table_name", req.query.table_name);
      }
      if (req.query.operation) {
        query = query.where("operation", req.query.operation);
      }
      if (req.query.user) {
        query = query.where("user", req.query.user);
      }

      const logs = await query
        .limit(limit)
        .offset(offset)
        .orderBy("timestamp", "desc");

      const totalCount = await db("audit_log").count("* as count");
      const totalPages = Math.ceil(totalCount[0].count / limit);

      res.json({
        success: true,
        data: logs,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalCount[0].count,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        message: "Audit log retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Test Database Features
  static async testTriggers(req, res) {
    try {
      const testResults = [];

      // Test 1: Update a patient to trigger audit log
      try {
        await db("patients")
          .where("id", 1)
          .update({ phone: "123-456-7890-UPDATED" });
        testResults.push({ test: "Patient Update Trigger", status: "SUCCESS" });
      } catch (error) {
        testResults.push({
          test: "Patient Update Trigger",
          status: "FAILED",
          error: error.message,
        });
      }

      // Test 2: Try to insert appointment with past date (should fail)
      try {
        await db("appointments").insert({
          appointment_number: "TEST_PAST",
          patient_id: 1,
          doctor_id: 1,
          appointment_date: "2020-01-01 10:00:00",
          status: "scheduled",
          type: "consultation",
        });
        testResults.push({
          test: "Past Date Trigger",
          status: "FAILED - Should have been blocked",
        });
      } catch (error) {
        testResults.push({
          test: "Past Date Trigger",
          status: "SUCCESS - Correctly blocked past date",
        });
      }

      res.json({
        success: true,
        test_results: testResults,
        message: "Trigger tests completed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = DatabaseController;
