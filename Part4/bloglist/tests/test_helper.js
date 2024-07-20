const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [ 
    {
      title : 'b',
      author: 't',
      url: 'bt.com',
      likes: 1
    },
  
    {
      title : 'b1',
      author: 't1',
      url: 'bt1.com',
      likes: 2
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
  
  module.exports = {
    initialBlogs, blogsInDb, usersInDb
  }