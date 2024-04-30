import { useState, useRef } from 'react'
import { createBlog } from '../requests'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'
import { useReducer, useContext } from 'react'


const BlogForm = ({ createNewBlog, userToken }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  console.log('Blogform usertoken', userToken)
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const blogFormRef = useRef()


  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    // mutationFn: createBlog,
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      // const blogs = queryClient.getQueryData(['blogs'])
      // queryClient.setQueryData(['blogs'], [...blogs, newBlog])
      // queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      // const existingBlogs = queryClient.getQueryData(['blogs']);
      // queryClient.setQueryData(['blogs'], [...existingBlogs, newBlog]);
    }
  })

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = { title, author, url }
    console.log('addblog user token', userToken)
    createNewBlog(newBlog, userToken, 'THIS IS JOB')

    newBlogMutation.mutate(newBlog)
    notificationDispatch({ type: 'ADDBLOG', payload: { newBlog } })
    setTimeout(() => {
      notificationDispatch({ type: 'BLANK' })
    }, 2000)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
            title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            id='title-input'
            data-testid='title'
          />
        </div>
        <div>
            author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            id='author-input'
            data-testid='author'
          />
        </div>
        <div>
            url:
          <input
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            id='url-input'
            data-testid='url'
          />
        </div>
        <button type="submit">create</button>
      </form>

    </div>
  )
}

export default BlogForm