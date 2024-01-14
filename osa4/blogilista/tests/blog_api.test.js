const mongoose = require('mongoose')
const supertest = require('supertest')
const { initialBlogs, blogsInDb } = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


test('get method returns correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('get all responses with status code 200', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returned blogs has field id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  expect(blog.id).toBeDefined()
})

test('post method adds a new blog as expected', async () => {
  const newBlog = {
    'author': 'Paavo Palvola',
    'title': 'When things go right',
    'url': 'http://rightthings.fi',
    'likes': 2
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('When things go right')
})

test('default value for likes field of new post is 0', async () => {
  const blogWithoutLikesField = {
    'author': 'Paavo Palvola',
    'title': 'When things go right',
    'url': 'http://rightthings.fi'
  }

  await api.post('/api/blogs')
    .send(blogWithoutLikesField)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const addedBlog = response.body.find(blog => blog.title === 'When things go right')
  expect(addedBlog.likes).toBe(0)
})

test('missing title or url field causes response 400 Bad Request', async () => {
  const blogWithoutTitle = {
    'author': 'Paavo Palvola',
    'url': 'http://rightthings.fi',
    'likes': 2
  }

  const blogWithoutUrl = {
    'author': 'Paavo Palvola',
    'title': 'When things go right',
    'likes': 2
  }

  for (let blog of [blogWithoutTitle, blogWithoutUrl]) {
    await api.post('/api/blogs')
      .send(blog)
      .expect(400)
  }
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('modification of a blog', () => {
  test('works as expected and blog content is changed', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToChange = blogsAtStart[0]
    const oldTitle = blogToChange.title
    const newTitle = 'Modified blog'

    blogToChange.title = newTitle

    const response = await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toBe(blogToChange.title)

    const blogs = await blogsInDb()
    const titles = blogs.map(blog => blog.title)

    expect(titles).toContain(newTitle)
    expect(titles).not.toContain(oldTitle)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})