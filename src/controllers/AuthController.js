const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Show login page
  static async showLogin(req, res) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    res.render('auth/login', { 
      title: 'Login - Hospital Management System',
      error: null,
      layout: false
    });
  }

  // Handle login
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.render('auth/login', { 
          title: 'Login - Hospital Management System',
          error: 'Username and password are required',
          layout: false
        });
      }

      const user = await User.authenticate(username, password);
      
      if (!user) {
        return res.render('auth/login', { 
          title: 'Login - Hospital Management System',
          error: 'Invalid username or password',
          layout: false
        });
      }

      // Store user in session
      req.session.user = user;
      
      // Generate JWT token for API access
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      req.session.token = token;
      
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      res.render('auth/login', { 
        title: 'Login - Hospital Management System',
        error: 'An error occurred during login',
        layout: false
      });
    }
  }

  // Handle logout
  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.redirect('/login');
    });
  }

  // API login
  static async apiLogin(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await User.authenticate(username, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        user, 
        token,
        message: 'Login successful' 
      });
    } catch (error) {
      console.error('API login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
