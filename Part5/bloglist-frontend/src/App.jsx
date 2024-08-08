import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, messageType }) => {
  if(message === null){
    return null
  }
  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const createFormRef = useRef()

  useEffect(() => {
    const loggedBloglistUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedBloglistUserJSON) {
      const user = JSON.parse(loggedBloglistUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (expection) {
      setMessageType('errorMessage')
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleBlogCreate = async (newBlog) => {
    createFormRef.current.toggleVisibility()
    try {
      const blog = await blogService.create(newBlog)
      const updatedBloglist = blogs.concat(blog)
      setBlogs(updatedBloglist)
      setMessageType('successMessage')
      setMessage(`${blog.title} was added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    }catch (exception) {
      setMessageType('errorMessage')
      setMessage('Something went wrong when adding a new blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

  }

  const handleBlogLikes = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const likedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : likedBlog))
  }

  const handleBlogDelete = async (blog) => {
    const id = blog.id
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setMessageType('successMessage')
      setMessage(`${blog.title} was deleted`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    else{
      setMessageType('errorMessage')
      setMessage(`Deleting ${blog.title} was cancelled`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setBlogs(blogs)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType={messageType}/>
        <h2>Log in</h2>
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <Notification message={message} messageType={messageType} />
      <h2>Blogs</h2>
      <p>{user.name} logged in <></>
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='Create new blog' ref={createFormRef}>
        <BlogForm
          createBlog={handleBlogCreate}
        />
      </Togglable>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleBlogLikes={handleBlogLikes} handleBlogDelete={handleBlogDelete} user = {user}/>
      )}

    </div>
  )
}

export default App