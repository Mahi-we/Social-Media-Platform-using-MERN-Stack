const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')

// -----------------------------------------------------------
// GET /api/bookmarks/:userId  — Get all bookmarked posts for a user
// -----------------------------------------------------------
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'bookmarks',
      populate: {
        path: 'author',
        select: 'name username avatar verified',
      },
    })

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.bookmarks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// -----------------------------------------------------------
// DELETE /api/bookmarks/:userId/all  — Clear all bookmarks for a user
// -----------------------------------------------------------
router.delete('/:userId/all', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Also remove this user from all posts' bookmarkedBy
    await Post.updateMany(
      { _id: { $in: user.bookmarks } },
      { $pull: { bookmarkedBy: user._id } }
    )

    user.bookmarks = []
    await user.save()
    res.json({ message: 'All bookmarks cleared' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
