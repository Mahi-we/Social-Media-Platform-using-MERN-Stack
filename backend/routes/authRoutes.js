const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')


const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })


const sendAuthResponse = (res, statusCode, user, token) => {
  
  const userObj = user.toObject ? user.toObject() : user
  delete userObj.password

  res.status(statusCode).json({
    token,
    user: userObj,
  })
}


// POST /api/register

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    // Check uniqueness
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingEmail) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase().trim() })
    if (existingUsername) {
      return res.status(409).json({ message: 'This username is already taken.' })
    }

    //  username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({
        message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores.',
      })
    }

    const user = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    })

    const token = signToken(user._id)
    sendAuthResponse(res, 201, user, token)
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]
      return res.status(409).json({ message: `${field} is already in use.` })
    }
    res.status(400).json({ message: err.message })
  }
})


// POST /api/auth/login

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body 

    if (!login || !password) {
      return res.status(400).json({ message: 'Email/username and password are required.' })
    }

    
    const isEmail = login.includes('@')
    const user = await User.findOne(
      isEmail
        ? { email: login.toLowerCase().trim() }
        : { username: login.toLowerCase().trim() }
    ).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const token = signToken(user._id)
    sendAuthResponse(res, 200, user, token)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get current logged in user from token

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// POST /api/auth/logout  — Client-side logout (clear token hint)

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' })
})

module.exports = router
