import { useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { notify } from './reducers/notificationReducer'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { createBlog, initializeBlogs } from './reducers/blogReducer'
import { setUser, loginUser, removeUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      dispatch(setUser(user))
    }
  }, [])

  const blogFormRef = createRef()

  const handleLogin = async (credentials) => {
    dispatch(loginUser(credentials))
  }

  const handleCreate = async (blog) => {
    dispatch(createBlog(blog))
    dispatch(notify(`Blog created: ${blog.title}, ${blog.author}`))
    blogFormRef.current.toggleVisibility()
  }

  const handleLogout = () => {
    dispatch(removeUser())
    dispatch(notify(`Bye, ${user.name}!`))
  }

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {[...blogs].sort(byLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
