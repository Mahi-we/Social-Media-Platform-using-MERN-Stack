const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const upload = require('../middleware/upload')
const { protect } = require('../middleware/auth')

// GET /api/users  — Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/suggested  — Suggested users
router.get('/suggested', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ verified: -1, followers: -1 })
      .limit(6)
      .select('name username avatar verified bio')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/:id  — Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'name username avatar')
      .populate('following', 'name username avatar')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/users/:id  — Update user profile (protected)
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Only allow users to update their own profile
      if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Not authorized to update this profile.' })
      }

      const updates = { ...req.body }
      if (req.files?.avatar) {
        updates.avatar = `http://localhost:5000/uploads/${req.files.avatar[0].filename}`
      }
      if (req.files?.coverImage) {
        updates.coverImage = `http://localhost:5000/uploads/${req.files.coverImage[0].filename}`
      }

      const user = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
)

// PUT /api/users/:id/settings  — Update settings (protected)
router.put('/:id/settings', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized.' })
    }

    const allowed = ['isPrivate', 'showOnlineStatus', 'allowMessages', 'pushNotifications', 'emailNotifications', 'soundEffects']
    const updates = {}
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    })

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/users/:id/credentials  — Update username/email/password (protected)
router.put('/:id/credentials', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized.' })
    }

    const { field, value, currentPassword } = req.body
    if (!field || !value) {
      return res.status(400).json({ message: 'field and value are required.' })
    }

    const user = await User.findById(req.params.id).select('+password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (field === 'username') {
      const exists = await User.findOne({ username: value.toLowerCase(), _id: { $ne: user._id } })
      if (exists) return res.status(409).json({ message: 'Username is already taken.' })
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
        return res.status(400).json({ message: 'Username must be 3-20 chars, letters/numbers/underscores only.' })
      }
      user.username = value.toLowerCase().trim()
    } else if (field === 'email') {
      const exists = await User.findOne({ email: value.toLowerCase(), _id: { $ne: user._id } })
      if (exists) return res.status(409).json({ message: 'Email is already in use.' })
      user.email = value.toLowerCase().trim()
    } else if (field === 'password') {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required.' })
      }
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' })
      }
      if (value.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' })
      }
      user.password = value
    } else {
      return res.status(400).json({ message: 'Invalid field.' })
    }

    await user.save()
    res.json({ message: `${field} updated successfully`, user })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST /api/users/:id/follow  — Follow/unfollow (protected)
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const followerId = req.user._id.toString()
    if (req.params.id === followerId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' })
    }

    const target = await User.findById(req.params.id)
    const follower = await User.findById(followerId)
    if (!target || !follower) return res.status(404).json({ message: 'User not found' })

    const alreadyFollowing = target.followers.map((f) => f.toString()).includes(followerId)
    if (alreadyFollowing) {
      target.followers.pull(followerId)
      follower.following.pull(req.params.id)
    } else {
      target.followers.push(followerId)
      follower.following.push(req.params.id)
    }

    await target.save()
    await follower.save()
    res.json({ followers: target.followers.length, following: follower.following.length, isFollowing: !alreadyFollowing })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/:id/posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name username avatar verified')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
