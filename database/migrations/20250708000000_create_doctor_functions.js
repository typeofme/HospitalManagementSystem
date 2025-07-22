exports.up = async function (knex) {
  // Drop functions if they exist
  await knex.raw("DROP FUNCTION IF EXISTS get_total_doctors");
  await knex.raw("DROP FUNCTION IF EXISTS get_doctors_by_department");

  // Create get_total_doctors function
  await knex.raw(`
    CREATE FUNCTION get_total_doctors()
    RETURNS INT
    DETERMINISTIC
    READS SQL DATA
    BEGIN
      DECLARE total INT;
      SELECT COUNT(*) INTO total FROM doctors;
      RETURN total;
    END
  `);

  // Create get_doctors_by_department function
  await knex.raw(`
    CREATE FUNCTION get_doctors_by_department(dept_id INT)
    RETURNS INT
    DETERMINISTIC
    READS SQL DATA
    BEGIN
      DECLARE total INT;
      SELECT COUNT(*) INTO total FROM doctors WHERE department_id = dept_id;
      RETURN total;
    END
  `);
};

exports.down = async function (knex) {
  await knex.raw("DROP FUNCTION IF EXISTS get_total_doctors");
  await knex.raw("DROP FUNCTION IF EXISTS get_doctors_by_department");
};
