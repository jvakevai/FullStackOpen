const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('Blogs in database, exercises 4.8 and 4.9', () => {
  test('blogs are returned as json', async () => {
     await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('correct number of blogs returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
      assert.strictEqual(response.body.length, 2)
  })

  test('id is the identifyting field of the blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogs = response.body
  
    for (const blog of blogs) {
      assert.strictEqual(blog.id !== undefined, true)
    }
  })
})

describe('Addition of blogs, exercises 4.9-4.12', () => {
  test('a blog can be added to the bloglist',  async () => {
      const newBlog = {
        title : 'myBlog',
        author: 'blogger',
        url: 'myBlog123.com',
        likes: 1
      }  

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const contents = blogsAtEnd.map(r => r.url)
      assert(contents.includes('myBlog123.com'))
  })

  test('Value of likes is set to 0 if it has no value given', async () => {
    const newBlog = {
      title : 'myBlog',
      author: 'blogger',
      url: 'myBlog123.com',
      likes: undefined
    } 

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()

    for (const blog of blogs) {
      if(blog.title === 'myBlog'){
        assert.strictEqual(blog['likes'], 0)
      }
    }
  })    

  test('fails with status code 400 if title or url is missing', async () => {
    const noTitleBlog = {
      author: 'blogger',
      url: 'myBlog123.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400)

    const noUrlBlog = {
      title : 'myBlog',
      author: 'blogger',
      likes: 15
    } 
 
    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)
  
  })
})

describe('deleting and updating blogs, exercises 4.13 and 4.14', () => {
  test('a single blog is deleted', async () => {
    const blogs = await helper.blogsInDb()
  
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)

    const contents = blogsAtEnd.map(r => r.url)
    assert(!contents.includes(blogs[0].url))

  })
  test('a single blog is updated', async () => {
    const updatedBlog = {
        title : 'b1',
        author: 't1',
        url: 'bt1.com',
        likes: 3 
    }
    const blogs = await helper.blogsInDb()

    await api
      .put(`/api/blogs/${blogs[1].id}`)
      .send(updatedBlog)
      .expect(200)

    assert(updatedBlog.likes !== blogs[1].likes)
  })
})
//4.14 tehty

/****************************************************************************/
describe('User creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testi',
      name: 'Testi Testaaja',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('Creating user with non-unique username fails', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      username: 'testi',
      name: 'Testi Testaaja',
      password: 'salainen',
    }
    const newUser2 = {
      username: 'testi',
      name: 'Ankka',
      password: 'Akuankka',
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/)  

    const usersAtEnd = await helper.usersInDb()
  
    assert(response.text.includes('{"error":"expected `username` to be unique"}'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  })
  test('Creating users with a username of incorrect form fails', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const testInvalidUsername1 = {
      username: '',
      name: 'Marc',
      password: 'secret'
    }

    const testInvalidUsername2 = {
      username: 'ab',
      name: 'Marc',
      password: 'secret'
    }

    const response1 = await api
      .post('/api/users')
      .send(testInvalidUsername1)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response2 = await api
      .post('/api/users')
      .send(testInvalidUsername2)
      .expect(400)
      .expect('Content-Type', /application\/json/)  

    const usersAtEnd = await helper.usersInDb()
    
    assert(response1.text.includes(
      '{"error":"User validation failed: username: Path `username` is required."}'))
    assert(response2.text.includes(
      '{"error":"User validation failed: username: Path `username` (`ab`) is shorter than the minimum allowed length (3)."}'))
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('Creating users with a password of incorrect form fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const testInvalidPassword1 = {
      username: 'Marco12',
      name: 'Marc',
      password: ''
    }
  
    const testInvalidPassword2 = {
      username: 'Marco123',
      name: 'Marc',
      password: '12'
    }
  
    const response1 = await api
      .post('/api/users')
      .send(testInvalidPassword1)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    const response2 = await api
      .post('/api/users')
      .send(testInvalidPassword2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(response1.text.includes('password must be given when creating user'))
    assert(response2.text.includes('The minimum lenght for passoword is (3) characters'))
    
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

})
  
after(async () => {
  await mongoose.connection.close()
}) 

//4.19 tehty