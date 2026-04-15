/**
 * seed.js — Populate MongoDB with demo data for FrameIt
 * Run: node seed.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Post = require('./models/Post')
const Story = require('./models/Story')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/frameit'

const usersData = [
  {
    name: 'You',
    username: 'myprofile',
    email: 'me@frameit.com',
    password: 'password123',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=300&fit=crop',
    bio: 'Frontend Dev | Tech Explorer | Music Lover',
    verified: true,
  },
  {
    name: 'Ananya',
    username: 'ananya',
    email: 'ananya@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Photography & travel enthusiast',
    verified: true,
  },
  {
    name: 'Rohan',
    username: 'rohan',
    email: 'rohan@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    bio: 'Fitness & wellness advocate',
    verified: false,
  },
  {
    name: 'Priya',
    username: 'priya',
    email: 'priya@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    bio: 'Sunset chaser & beach lover',
    verified: true,
  },
  {
    name: 'Vikram',
    username: 'vikram',
    email: 'vikram@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    bio: 'Full-stack developer & problem solver',
    verified: false,
  },
  {
    name: 'Arjun',
    username: 'arjun',
    email: 'arjun@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    bio: 'Open source contributor',
    verified: false,
  },
  {
    name: 'Sarah Tech',
    username: 'sarahtech',
    email: 'sarah@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Tech enthusiast & developer',
    verified: true,
  },
  {
    name: 'Design Master',
    username: 'designmaster',
    email: 'design@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    bio: 'UI/UX Designer',
    verified: true,
  },
  {
    name: 'TechWorld',
    username: 'techworld',
    email: 'techworld@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?w=100&h=100&fit=crop',
    bio: 'Latest in tech & AI',
    verified: true,
  },
  {
    name: 'DesignDaily',
    username: 'designdaily',
    email: 'designdaily@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=100&h=100&fit=crop',
    bio: 'Design inspiration every day',
    verified: true,
  },
  {
    name: 'CodeMaster',
    username: 'codemaster',
    email: 'codemaster@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    bio: 'Tutorial creator & developer',
    verified: false,
  },
  {
    name: 'TravelVibes',
    username: 'travelvibes',
    email: 'travelvibes@frameit.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    bio: 'Wanderlust and travel adventures',
    verified: true,
  },
]

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Post.deleteMany({})
    await Story.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Insert users
    const users = await User.insertMany(usersData)
    console.log(`👥 Created ${users.length} users`)

    const [me, ananya, rohan, priya, vikram, arjun, , , techworld, designdaily, codemaster, travelvibes] = users

    // Wire up followers/following for "me"
    me.following.push(ananya._id, rohan._id, priya._id, vikram._id)
    me.followers.push(ananya._id, priya._id, vikram._id)
    await me.save()

    // Create posts
    const postsData = [
      {
        author: ananya._id,
        content: 'This UI is amazing!',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        likes: [me._id, rohan._id, priya._id],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        author: rohan._id,
        content: 'Just finished my morning workout! Feeling energized and ready to take on the day. Who else loves starting their day with exercise?',
        image: null,
        likes: [me._id, ananya._id],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        author: priya._id,
        content: 'Beautiful sunset at the beach today! 🌅',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        likes: [me._id, ananya._id, rohan._id, vikram._id, arjun._id],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        author: vikram._id,
        content: 'Working on some exciting new projects. Stay tuned for updates! 🚀',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        likes: [me._id, ananya._id, priya._id],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        author: techworld._id,
        content: 'The future of AI is here! Check out these amazing developments in machine learning. 🤖',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        likes: [me._id, rohan._id, priya._id, vikram._id, arjun._id],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        author: designdaily._id,
        content: 'Minimal design inspiration for your next project. Less is more! ✨',
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=600&fit=crop',
        likes: [me._id, ananya._id],
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      {
        author: codemaster._id,
        content: 'Just published a new tutorial on React hooks. Link in bio!',
        image: null,
        likes: [me._id, vikram._id],
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      },
      {
        author: travelvibes._id,
        content: 'Wanderlust hitting different today. Who else wants to explore the world? 🌍',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        likes: [me._id, ananya._id, rohan._id, priya._id, vikram._id],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      // Me's own posts (for Profile page)
      {
        author: me._id,
        content: 'Just launched my new project! Check it out. 🎉',
        image: null,
        likes: [ananya._id, priya._id, vikram._id],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        author: me._id,
        content: 'Learning something new every day. The journey of a thousand miles begins with a single step. 💡',
        image: null,
        likes: [ananya._id, rohan._id],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ]

    const posts = await Post.insertMany(postsData)
    console.log(`📝 Created ${posts.length} posts`)

    // Bookmark some posts for "me"
    const bookmarkedPosts = [posts[4], posts[5], posts[6], posts[7]] 
    me.bookmarks = bookmarkedPosts.map((p) => p._id)
    await me.save()

    // Update bookmarkedBy on those posts
    for (const post of bookmarkedPosts) {
      post.bookmarkedBy.push(me._id)
      await post.save()
    }

    // Add comments to a couple of posts
    posts[0].comments.push({ user: me._id, text: 'Totally agree! 🔥' })
    posts[0].comments.push({ user: rohan._id, text: 'Love this!' })
    await posts[0].save()

    posts[2].comments.push({ user: me._id, text: 'Which beach is this?' })
    posts[2].comments.push({ user: vikram._id, text: 'Stunning view!' })
    await posts[2].save()

    // Create stories (from users who follow "me")
    const storiesData = [
      {
        user: rohan._id,
        media: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=400&h=700&fit=crop',
        mediaType: 'image',
        caption: 'Morning run done! 💪',
      },
      {
        user: ananya._id,
        media: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=700&fit=crop',
        mediaType: 'image',
        caption: '',
      },
      {
        user: vikram._id,
        media: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=700&fit=crop',
        mediaType: 'image',
        caption: 'Late night coding 🧑‍💻',
      },
      {
        user: priya._id,
        media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=700&fit=crop',
        mediaType: 'image',
        caption: 'The beach is calling 🌊',
      },
      {
        user: arjun._id,
        media: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=700&fit=crop',
        mediaType: 'image',
        caption: '',
      },
    ]

    const stories = await Story.insertMany(storiesData)
    console.log(`📖 Created ${stories.length} stories`)


    console.log('\n🎉 Seed complete! FrameIt database is ready.')
    console.log(`\n👤 Demo login credentials:`)
    console.log('   Email:    me@frameit.com')
    console.log('   Password: password123\n')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()
