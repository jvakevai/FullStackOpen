import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleBlogCreate = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return(
    <div>
      <form onSubmit={handleBlogCreate}>
        <div>
          <h2>Create new blog</h2>
            title:
          <input
            data-testid="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
            author:
          <input
            data-testid="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
            url:
          <input
            data-testid="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default BlogForm