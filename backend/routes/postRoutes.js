const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const upload = require('../middleware/upload')
const { protect } = require('../middleware/auth')


//  Get all posts 

router.get('/', async (req, res) => {
  try {
    const { search } = req.query
    const query = search
      ? { content: { $regex: search, $options: 'i' } }
      : {}

    const posts = await Post.find(query)
      .populate('author', 'name username avatar verified')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


//  Create a new post

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { authorId, content } = req.body
    if (!authorId) return res.status(400).json({ message: 'authorId is required' })
    if (!content?.trim() && !req.file)
      return res.status(400).json({ message: 'Post must have content or an image' })

    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null

    const post = await Post.create({
      author: authorId,
      content: content || '',
      image: imageUrl,
    })

    const populated = await post.populate('author', 'name username avatar verified')
    res.status(201).json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


// Get all posts liked by a user

router.get('/liked/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ likes: req.params.userId })
      .populate('author', 'name username avatar verified')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//  Get single post

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username avatar verified')
      .populate('comments.user', 'name username avatar')
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Delete a post

router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


//  Like / Unlike a post

router.post('/:id/like', protect, async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ message: 'userId is required' })

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const isLiked = post.likes.map(id => id.toString()).includes(userId)
    if (isLiked) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()
    res.json({ likes: post.likes.length, liked: !isLiked })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


//  Add a comment

router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { userId, text } = req.body
    if (!userId || !text) return res.status(400).json({ message: 'userId and text are required' })

    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    post.comments.push({ user: userId, text })
    await post.save()

    const updated = await Post.findById(req.params.id).populate(
      'comments.user',
      'name username avatar'
    )
    res.status(201).json(updated.comments)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Bookmark / Unbookmark a post

router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ message: 'userId is required' })

    const post = await Post.findById(req.params.id)
    const user = await User.findById(userId)
    if (!post || !user) return res.status(404).json({ message: 'Post or User not found' })

    const isBookmarked = user.bookmarks.includes(req.params.id)
    if (isBookmarked) {
      user.bookmarks.pull(req.params.id)
      post.bookmarkedBy.pull(userId)
    } else {
      user.bookmarks.push(req.params.id)
      post.bookmarkedBy.push(userId)
    }

    await user.save()
    await post.save()
    res.json({ bookmarked: !isBookmarked, totalBookmarks: post.bookmarkedBy.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
