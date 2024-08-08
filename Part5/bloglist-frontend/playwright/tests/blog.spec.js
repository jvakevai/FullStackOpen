const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { getByTestId } = require('@testing-library/react')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'John Doe',
        username: 'jdoe',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const loginText = await page.getByText('Log in')
    const userNLabel = await page.getByTestId('username')
    const pwLabel = await page.getByTestId('password')
    const loginButton = await page.getByRole('button', { name: 'login' })

    await expect(loginText).toBeVisible()
    await expect(userNLabel).toBeVisible()
    await expect(pwLabel).toBeVisible()
    await expect(loginButton).toBeVisible()

  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'jdoe', 'salainen')
      await expect(page.getByText('John Doe logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jdoe', 'vaarasalasana')

      const errorDiv = await page.locator('.errorMessage')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('John Doe logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'jdoe', 'salainen')
      await expect(page.getByText('John Doe logged in')).toBeVisible()

      await createBlog(page, 'playwright default blog', 'defaultauthor', 'defaulturl')
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'playwright test blog', 'testauthor', 'testurl')
      await expect(page.getByText('Title: playwright test blog testauthor view')).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })
    test('blog creator can delete a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        if(dialog.type() === 'confirm'){
          await dialog.accept()
        }
      })

      await page.getByRole('button', { name: 'Remove' }).click()
      await expect(page.getByText('Title: playwright test blog playwright testauthor view')).not.toBeVisible()
    })

    test('remove button is only shown for the user who created the blog', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Mark Doe',
          username: 'mdoe',
          password: 'salainen'
        }
      })

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'mdoe', 'salainen')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
    })

    test('blogs are sorted by likes in descending order', async ({ page }) => {
      await createBlog(page, 'top likes', 'testauthor', 'testurl')
      await createBlog(page, 'no likes', 'testauthor', 'testurl')

      await page
        .getByText('top likes')
        .getByRole('button', { name: 'view' }).click()
      for(let i = 0; i < 5; i++){
        await page.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
      }
      await expect(page.getByText('likes 5')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      await page
        .getByText('playwright default blog')
        .getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      const blogs = await page.locator('.title').allTextContents()

      const expectedOrder = ['Title: top likes testauthor view',
        'Title: playwright default blog defaultauthor view', 'Title: no likes testauthor view']

      await expect(blogs).toEqual(expectedOrder)

    })
  })
})


