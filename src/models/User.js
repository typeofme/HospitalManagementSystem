const db = require('../../database/connection');
const bcrypt = require('bcrypt');

class User {
  static async findAll(options = {}) {
    const { limit = 50, offset = 0, role, is_active } = options;
    
    let query = db('users')
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'last_login', 'avatar_url', 'created_at')
      .orderBy('created_at', 'desc');
    
    if (role) {
      query = query.where('role', role);
    }
    
    if (is_active !== undefined) {
      query = query.where('is_active', is_active);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    return await query;
  }

  static async findById(id) {
    return await db('users')
      .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'last_login', 'avatar_url', 'created_at')
      .where('id', id)
      .first();
  }

  static async findByUsername(username) {
    return await db('users')
      .where('username', username)
      .first();
  }

  static async findByEmail(email) {
    return await db('users')
      .where('email', email)
      .first();
  }

  static async create(data) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);
    
    const userData = {
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role || 'staff',
      is_active: data.is_active !== undefined ? data.is_active : true,
      avatar_url: data.avatar_url || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const [id] = await db('users').insert(userData);
    return await this.findById(id);
  }

  static async update(id, data) {
    const updateData = {
      updated_at: new Date()
    };

    // Only update fields that are provided
    if (data.username !== undefined) updateData.username = data.username;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.first_name !== undefined) updateData.first_name = data.first_name;
    if (data.last_name !== undefined) updateData.last_name = data.last_name;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;

    // Only hash password if it's being changed
    if (data.password) {
      const saltRounds = 12;
      updateData.password_hash = await bcrypt.hash(data.password, saltRounds);
    }
    
    await db('users').where('id', id).update(updateData);
    return await this.findById(id);
  }

  static async delete(id) {
    return await db('users').where('id', id).del();
  }

  static async authenticate(username, password) {
    const user = await db('users')
      .where('username', username)
      .orWhere('email', username)
      .first();
    
    if (!user || !user.is_active) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }
    
    // Update last login
    await db('users').where('id', user.id).update({ last_login: new Date() });
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async count(options = {}) {
    const { role, is_active } = options;
    
    let query = db('users');
    
    if (role) {
      query = query.where('role', role);
    }
    
    if (is_active !== undefined) {
      query = query.where('is_active', is_active);
    }
    
    const result = await query.count('* as count').first();
    return result.count;
  }
}

module.exports = User;
