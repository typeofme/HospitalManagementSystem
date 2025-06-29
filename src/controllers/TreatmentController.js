const db = require('../../database/connection');

class TreatmentController {
  // Get all treatments
  static async index(req, res) {
    try {
      const treatments = await db('treatments')
        .select('*')
        .orderBy('name');
      
      res.json(treatments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get treatment by ID
  static async show(req, res) {
    try {
      const treatment = await db('treatments')
        .where({ id: req.params.id })
        .first();
      
      if (!treatment) {
        return res.status(404).json({ error: 'Treatment not found' });
      }
      
      res.json(treatment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new treatment
  static async store(req, res) {
    try {
      const treatmentData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const [id] = await db('treatments').insert(treatmentData);
      const treatment = await db('treatments').where({ id }).first();
      
      res.status(201).json(treatment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update treatment
  static async update(req, res) {
    try {
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };
      
      const updated = await db('treatments')
        .where({ id: req.params.id })
        .update(updateData);
      
      if (!updated) {
        return res.status(404).json({ error: 'Treatment not found' });
      }
      
      const treatment = await db('treatments').where({ id: req.params.id }).first();
      res.json(treatment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete treatment
  static async destroy(req, res) {
    try {
      const deleted = await db('treatments').where({ id: req.params.id }).del();
      
      if (!deleted) {
        return res.status(404).json({ error: 'Treatment not found' });
      }
      
      res.json({ message: 'Treatment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get treatments by category
  static async getByCategory(req, res) {
    try {
      const treatments = await db('treatments')
        .where({ category: req.params.category })
        .orderBy('name');
      
      res.json(treatments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Search treatments
  static async search(req, res) {
    try {
      const { q: searchTerm } = req.query;
      
      if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
      }
      
      const treatments = await db('treatments')
        .where('name', 'like', `%${searchTerm}%`)
        .orWhere('description', 'like', `%${searchTerm}%`)
        .orWhere('category', 'like', `%${searchTerm}%`)
        .orderBy('name')
        .limit(20);
      
      res.json(treatments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get doctors for a treatment
  static async getDoctors(req, res) {
    try {
      const doctors = await db('doctor_specializations')
        .select(
          'doctors.*',
          'departments.name as department_name',
          'doctor_specializations.experience_years',
          'doctor_specializations.proficiency_level'
        )
        .leftJoin('doctors', 'doctor_specializations.doctor_id', 'doctors.id')
        .leftJoin('departments', 'doctors.department_id', 'departments.id')
        .where('doctor_specializations.treatment_id', req.params.id)
        .orderBy('doctor_specializations.proficiency_level', 'desc');
      
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get treatment statistics
  static async stats(req, res) {
    try {
      const stats = {
        total: await db('treatments').count('* as count').first(),
        categories: await db('treatments')
          .select('category')
          .count('* as count')
          .groupBy('category')
          .orderBy('count', 'desc'),
        mostPopular: await db('doctor_specializations')
          .select(
            'treatments.name',
            'treatments.category'
          )
          .count('doctor_specializations.id as doctor_count')
          .leftJoin('treatments', 'doctor_specializations.treatment_id', 'treatments.id')
          .groupBy('treatments.id', 'treatments.name', 'treatments.category')
          .orderBy('doctor_count', 'desc')
          .limit(10)
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TreatmentController;
