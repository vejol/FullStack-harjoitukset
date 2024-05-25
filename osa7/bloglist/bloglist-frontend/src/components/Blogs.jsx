import { useEffect, createRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Togglable from './Togglable'
import NewBlog from './NewBlog'
import { initializeBlogs } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'
import { createBlog } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'
import { Table } from 'react-bootstrap'

const Blogs = () => {
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const blogFormRef = createRef()

  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)

  const handleCreate = async (blog) => {
    dispatch(createBlog(blog))
    dispatch(notify(`Blog created: ${blog.title}, ${blog.author}`))
    blogFormRef.current.toggleVisibility()
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      <Table striped>
        <tbody>
          {[...blogs].sort(byLikes).map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>by {blog.author}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Blogs
