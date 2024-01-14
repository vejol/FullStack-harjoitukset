const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0
  })

  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    ...request.body,
    likes: request.body.likes || 0
  }

  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter