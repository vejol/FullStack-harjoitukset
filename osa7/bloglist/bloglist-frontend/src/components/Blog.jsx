import storage from '../services/storage'
import { useDispatch, useSelector } from 'react-redux'
import { removeBlog, addVote } from '../reducers/blogReducer'
import { notify } from '../reducers/notificationReducer'
import { useParams, useNavigate } from 'react-router-dom'
import Comments from './Comments'

const Blog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const id = useParams().id
  const blog = useSelector((state) => state.blogs).find((b) => b.id === id)
  const user = useSelector((store) => store.user)

  if (!user || !blog) {
    return null
  }

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog))
      dispatch(notify(`Blog ${blog.title}, by ${blog.author} removed`))
      navigate('/')
    }
  }

  const handleVote = async (blog) => {
    dispatch(addVote(blog))
    dispatch(notify(`You liked ${blog.title} by ${blog.author}`))
  }

  const canRemove = blog.user ? blog.user.username === storage.me() : true

  return (
    <div className="blog">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}
        <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
          like
        </button>
      </div>
      <div>Added by {nameOfUser}</div>
      {canRemove && <button onClick={() => handleDelete(blog)}>remove</button>}
      <Comments />
    </div>
  )
}

export default Blog
