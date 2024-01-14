const Blog = require('../models/blog')

const initialBlogs = [
  {
    'author': 'Kimmo Kimpele',
    'title': 'Leivotaan rukiista',
    'url': 'http://kimmoleipoo.fi',
    'likes': 10
  },
  {
    'author': 'Silja Silvonen',
    'title': 'Maastopyörällä Mäntsälään',
    'url': 'http://www.bikemanstala.com',
    'likes': 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb
}