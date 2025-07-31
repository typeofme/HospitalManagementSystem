const { Model } = require('objection');

class ObjectionUser extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = ObjectionUser;
