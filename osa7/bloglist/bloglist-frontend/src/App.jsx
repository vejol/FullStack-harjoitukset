import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { notify } from './reducers/notificationReducer'
import storage from './services/storage'
import Login from './components/Login'
import Notification from './components/Notification'
import User from './components/User'
import Users from './components/Users'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import { setUser, loginUser, removeUser } from './reducers/userReducer'
import { Nav, Navbar } from 'react-bootstrap'

const App = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      dispatch(setUser(user))
    }
  }, [])

  const handleLogin = async (credentials) => {
    dispatch(loginUser(credentials))
  }

  const handleLogout = () => {
    dispatch(removeUser())
    dispatch(notify(`Bye, ${user.name}!`))
    navigate('/')
  }

  if (!user) {
    return (
      <div className="container">
        <h2>Blog app</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="container">
      <Navbar expand="lg" style={{ backgroundColor: 'lightgrey' }}>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link to="/">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user && (
                <>
                  {user.name} logged in
                  <button onClick={handleLogout}>logout</button>
                </>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <h2>Blog app</h2>
      <br />
      <Notification />
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  )
}

export default App
