const BASE_URL = 'http://localhost:5000/api'

// ─── Token Management ─────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('frameit_token') || null
}

export function setToken(token) {
  localStorage.setItem('frameit_token', token)
}

export function removeToken() {
  localStorage.removeItem('frameit_token')
  localStorage.removeItem('frameit_user_id')
}

export function getCurrentUserId() {
  return localStorage.getItem('frameit_user_id') || null
}

export function setCurrentUserId(id) {
  localStorage.setItem('frameit_user_id', id)
}

// Helper: build auth headers
function authHeaders(extraHeaders = {}) {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  }
}

function authFormHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register({ name, username, email, password }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Registration failed')
  return data // { token, user }
}

export async function login({ login, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  return data // { token, user }
}

export async function fetchMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function fetchPosts(search = '') {
  const url = search
    ? `${BASE_URL}/posts?search=${encodeURIComponent(search)}`
    : `${BASE_URL}/posts`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function createPost(formData) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: authFormHeaders(),
    body: formData,
  })
  if (!res.ok) throw new Error('Failed to create post')
  return res.json()
}

export async function likePost(postId, userId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) throw new Error('Failed to like post')
  return res.json()
}

export async function addComment(postId, userId, text) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId, text }),
  })
  if (!res.ok) throw new Error('Failed to add comment')
  return res.json()
}

export async function bookmarkPost(postId, userId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/bookmark`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) throw new Error('Failed to bookmark post')
  return res.json()
}

export async function deletePost(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete post')
  return res.json()
}

export async function fetchLikedPosts(userId) {
  const res = await fetch(`${BASE_URL}/posts/liked/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch liked posts')
  return res.json()
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function fetchUser(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export async function fetchSuggestedUsers() {
  const res = await fetch(`${BASE_URL}/users/suggested`)
  if (!res.ok) throw new Error('Failed to fetch suggested users')
  return res.json()
}

export async function fetchUserPosts(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}/posts`)
  if (!res.ok) throw new Error('Failed to fetch user posts')
  return res.json()
}

export async function updateUser(userId, formData) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: authFormHeaders(),
    body: formData,
  })
  if (!res.ok) throw new Error('Failed to update user')
  return res.json()
}

export async function updateSettings(userId, settings) {
  const res = await fetch(`${BASE_URL}/users/${userId}/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(settings),
  })
  if (!res.ok) throw new Error('Failed to update settings')
  return res.json()
}

export async function updateCredentials(userId, field, value, currentPassword = '') {
  const res = await fetch(`${BASE_URL}/users/${userId}/credentials`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ field, value, currentPassword }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update credentials')
  return data
}

export async function followUser(targetId, followerId) {
  const res = await fetch(`${BASE_URL}/users/${targetId}/follow`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ followerId }),
  })
  if (!res.ok) throw new Error('Failed to follow/unfollow user')
  return res.json()
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export async function fetchBookmarks(userId) {
  const res = await fetch(`${BASE_URL}/bookmarks/${userId}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to fetch bookmarks')
  return res.json()
}

export async function clearBookmarks(userId) {
  const res = await fetch(`${BASE_URL}/bookmarks/${userId}/all`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Failed to clear bookmarks')
  return res.json()
}

