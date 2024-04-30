import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useReducer, useContext } from 'react'
import NotificationContext from './NotificationContext'
import { getBlogs, createBlog } from './requests'

const App = () => {
  const blogFormRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const newBlogMutation = useMutation({ mutationFn: createBlog })

  const blankBlog = {
    url: 'Blank url',
    title: 'Blank title',
    author: 'Blank author',
    user: {
      username: 'blank username',
      password: 'blank password'
    }
  }

  const { isLoading, data: blogs } = useQuery({
    queryKey: ['blogs'],
    // queryFn: () => axios.get('http://localhost:5173/api/blogs/').then(response => response.data)
    queryFn: getBlogs,
    // queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  });

  // useEffect(() => {
  //   blogService.getAll()
  //     .then(blogs => setBlogs( blogs ))
  // }, [blogs.length])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (isLoading) {
    return <div>loading data...</div>;
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      console.log('THIS IS USER TOKEN', user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notificationDispatch({ type: 'LOGIN', payload: { user } })
      setTimeout(() => {
        notificationDispatch({ type: 'BLANK' })
      }, 2000)
    } catch (exception) {
      notificationDispatch({ type: 'INCORRECTLOGIN' })
      setTimeout(() => {
        notificationDispatch({ type: 'BLANK' })
      }, 2000)
    }
  }

  const addBlog = (blogObject) => {
    // blogFormRef.current.toggleVisibility()

    // blogService
    //   .create(blogObject)
    //   .then(returnedBlog => {
    //     // setBlogs(blogs.concat(returnedBlog))
    //     console.log('adding blog', returnedBlog)
    //     notificationDispatch({ type: 'ADDBLOG', payload: { returnedBlog } })
    //     // setErrorMessage({
    //     //   message: `a blog ${blogObject.title} by ${blogObject.author} added`,
    //     //   alert: false
    //     // })
    //     setTimeout(() => {
    //       notificationDispatch({ type: 'BLANK' })
    //     }, 5000)
    //   })
  }

  // useEffect(() => {
  //   blogService.getAll()
  //     // .then(blogs => setBlogs( blogs ))
  // }, [blogs.length])

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON)
  //     setUser(user)
  //     blogService.setToken(user.token)
  //   }
  // }, [])

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef} hideButton="cancel" buttonTop="false">
      <BlogForm createNewBlog={addBlog} userToken={user.token}/>
    </Togglable>
  )

  const blogList = () => {
    const compareLikes = (b, a) => {
      return a.likes - b.likes
    }
    console.log('this is blogs', blogs)
    return (
      <div data-testid='parent'>
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={logOut} type="submit">logout</button>
        </p>
        {blogForm()}
        {blogs
          .filter(blog => blog.user.username === user.username)
          .sort(compareLikes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
      </div>
    )
  }

  const logOut = () => {
    setUser(null)
    window.localStorage.clear()
  }


  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <div>
        <Notification message={notification.message} alert={notification.alert}/>
        {user === null ? loginForm() : blogList()}
      </div>
    </NotificationContext.Provider>
  )
}

export default App