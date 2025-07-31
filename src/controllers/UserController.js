const User = require('../models/User');
const logAction = require('../utils/logAction');

class UserController {
  // Get all users with pagination
  static async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const role = req.query.role;
      const is_active = req.query.is_active;
      
      const users = await User.findAll({ 
        limit, 
        offset, 
        role: role || undefined,
        is_active: is_active !== undefined ? is_active === 'true' : undefined
      });
      
      const totalCount = await User.count({ 
        role: role || undefined,
        is_active: is_active !== undefined ? is_active === 'true' : undefined
      });
      const totalPages = Math.ceil(totalCount / limit);
      
      res.json({
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get user by ID
  static async show(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Create new user
  static async store(req, res) {
    try {
      const { username, email, password, first_name, last_name, role, is_active } = req.body;
      
      // Validate required fields
      if (!username || !email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      // Check if username already exists
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      const user = await User.create({
        username,
        email,
        password,
        first_name,
        last_name,
        role: role || 'staff',
        is_active: is_active !== undefined ? is_active : true
      });
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        description: `Created user ${user.username}`
      });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Update user
  static async update(req, res) {
    try {
      const { username, email, first_name, last_name, role, is_active, password } = req.body;
      
      // Check if user exists
      const existingUser = await User.findById(req.params.id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if username is taken by another user
      if (username && username !== existingUser.username) {
        const usernameExists = await User.findByUsername(username);
        if (usernameExists) {
          return res.status(400).json({ error: 'Username already exists' });
        }
      }

      // Check if email is taken by another user
      if (email && email !== existingUser.email) {
        const emailExists = await User.findByEmail(email);
        if (emailExists) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }
      
      const updateData = {
        username: username || existingUser.username,
        email: email || existingUser.email,
        first_name: first_name || existingUser.first_name,
        last_name: last_name || existingUser.last_name,
        role: role || existingUser.role,
        is_active: is_active !== undefined ? is_active : existingUser.is_active
      };

      if (password) {
        updateData.password = password;
      }
      
      const user = await User.update(req.params.id, updateData);
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'UPDATE',
        entity: 'User',
        entityId: req.params.id,
        description: `Updated user ${user.username}`
      });
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Delete user
  static async destroy(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await User.delete(req.params.id);
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'DELETE',
        entity: 'User',
        entityId: req.params.id,
        description: `Deleted user with ID ${req.params.id}`
      });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Show users management page
  static async showUsersPage(req, res) {
    try {
      const users = await User.findAll({ limit: 50 });
      res.render('users', { 
        title: 'User Management',
        users
      });
    } catch (error) {
      console.error('Error loading users page:', error);
      res.status(500).render('error', { 
        error: 'Failed to load users page'
      });
    }
  }
}

module.exports = UserController;
