// Utility to log actions to the logs table
const Log = require('../models/Log');

async function logAction({ userId, action, entity, entityId, description }) {
  await Log.query().insert({
    user_id: userId,
    action,
    entity,
    entity_id: entityId,
    description,
  });
}

module.exports = logAction;
