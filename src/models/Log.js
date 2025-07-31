
const { Model } = require('objection');
const db = require('../../database/connection');
Model.knex(db);

class Log extends Model {
  static get tableName() {
    return 'logs';
  }
}

module.exports = Log;
