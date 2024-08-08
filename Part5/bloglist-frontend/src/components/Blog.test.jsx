import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('The component showing blog only renders title and author', () => {
  const user = {
    username: 'tn',
    name: 'testiname'
  }

  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: 100,
    user: {
      username: 'tn',
      name: 'testiname'
    }
  }

  render(<Blog blog={blog} user={user}/>)

  screen.getByText('Title: testititle testiauthor')
})

test('Url and likes are shown when view button is clicked', async () => {
  const user = {
    username: 'tn',
    name: 'testiname'
  }
  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: 100,
    user: {
      username: 'tn',
      name: 'testiname'
    }
  }

  render(<Blog blog={blog} user={user}/>)

  const userE = userEvent.setup()
  const button = screen.getByText('view')

  await userE.click(button)
  const r = /Title: testititle\s*testiauthor\s*testiurl\s*likes\s*100\s*testiname/
  const e = screen.getByText(r)

  expect(e).toHaveStyle('display: block')

})

test('If like button is clicked twice, event handler of likes is called twice', async () => {
  const user = {
    username: 'tn',
    name: 'testiname'
  }
  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: 100,
    user: {
      username: 'tn',
      name: 'testiname'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} handleBlogLikes={mockHandler}/>)

  const userE = userEvent.setup()
  const button = screen.getByText('Like')

  await userE.click(button)
  await userE.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})
