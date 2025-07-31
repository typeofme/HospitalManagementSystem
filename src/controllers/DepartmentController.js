const db = require('../../database/connection');
const logAction = require('../utils/logAction');

class DepartmentController {
  // Get all departments
  static async index(req, res) {
    try {
      const departments = await db('departments').select('*').orderBy('name');
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get department by ID
  static async show(req, res) {
    try {
      const department = await db('departments').where({ id: req.params.id }).first();
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.json(department);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new department
  static async store(req, res) {
    try {
      const { name, description, head_doctor_name, location, phone, is_active } = req.body;
      
      const [id] = await db('departments').insert({
        name,
        description,
        head_doctor_name,
        location,
        phone,
        is_active: is_active !== undefined ? is_active : true
      });
      const department = await db('departments').where({ id }).first();
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'CREATE',
        entity: 'Department',
        entityId: id,
        description: `Created department ${name}`
      });
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update department
  static async update(req, res) {
    try {
      const { name, description, head_doctor_name, location, phone, is_active } = req.body;
      
      await db('departments').where({ id: req.params.id }).update({
        name,
        description,
        head_doctor_name,
        location,
        phone,
        is_active
      });
      const department = await db('departments').where({ id: req.params.id }).first();
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'UPDATE',
        entity: 'Department',
        entityId: req.params.id,
        description: `Updated department ${name}`
      });
      res.json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete department
  static async destroy(req, res) {
    try {
      const deleted = await db('departments').where({ id: req.params.id }).del();
      if (!deleted) {
        return res.status(404).json({ error: 'Department not found' });
      }
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'DELETE',
        entity: 'Department',
        entityId: req.params.id,
        description: `Deleted department ID ${req.params.id}`
      });
      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get department statistics
  static async stats(req, res) {
    try {
      const stats = {
        total: await db('departments').count('* as count').first(),
        active: await db('departments').where('status', 'active').count('* as count').first(),
        inactive: await db('departments').where('status', 'inactive').count('* as count').first()
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get doctors by department
  static async getDoctors(req, res) {
    try {
      const doctors = await db('doctors')
        .where({ department_id: req.params.id })
        .select('*')
        .orderBy('first_name');
      
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DepartmentController;
