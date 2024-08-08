import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleBlogLikes, handleBlogDelete, user }) => {

  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleBlogLikes: PropTypes.func.isRequired,
    handleBlogDelete: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  return (
    <div className='blogStyle'>
      <div style={hideWhenVisible} className='title'>
      Title: {blog.title} {blog.author} <></>
        <button onClick={() => setVisible(true)}>view</button>
      </div>

      <div style={showWhenVisible}>
      Title: {blog.title} {blog.author} <></>
        <button onClick={() => setVisible(false)}>hide</button>
        <br></br>
        {blog.url}
        <br></br>
        likes {blog.likes} <button onClick={() => handleBlogLikes(blog)}>Like</button>
        <br></br>
        {blog.user.name}
        <br></br>
        {blog.user.name === user.name && <button onClick={() => handleBlogDelete(blog)}>Remove</button>}
      </div>
    </div>
  )
}
export default Blog