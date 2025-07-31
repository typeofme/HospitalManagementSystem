const Log = require('../models/Log');
const User = require('../models/User');

module.exports = {
  async index(req, res) {
    try {
      const { search, action, from, to } = req.query;
      let query = Log.query()
        .select('logs.*', 'users.first_name', 'users.last_name')
        .leftJoin('users', 'logs.user_id', 'users.id');
      if (search) {
        query = query.where('description', 'like', `%${search}%`);
      }
      if (action) {
        query = query.where('action', action);
      }
      if (from) {
        query = query.where('created_at', '>=', from);
      }
      if (to) {
        query = query.where('created_at', '<=', to);
      }
      query = query.orderBy('created_at', 'desc');
      const logs = await query;
      res.render('logs', { title: 'Activity Logs', logs });
    } catch (err) {
      console.error('LogController.index error:', err);
      res.status(500).render('error', { title: 'Error', error: err.message, details: err });
    }
  },

  async show(req, res) {
    try {
      const log = await Log.query()
        .select('logs.*', 'users.first_name', 'users.last_name')
        .leftJoin('users', 'logs.user_id', 'users.id')
        .findById(req.params.id);
      if (!log) return res.status(404).render('error', { title: 'Error', error: 'Log not found' });
      res.render('log-details', { title: 'Log Details', log });
    } catch (err) {
      console.error('LogController.show error:', err);
      res.status(500).render('error', { title: 'Error', error: err.message, details: err });
    }
  },
};
