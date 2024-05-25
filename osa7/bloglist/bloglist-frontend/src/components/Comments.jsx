import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { modifyBlog } from '../reducers/blogReducer'

const Comments = () => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  const id = useParams().id
  const blog = useSelector((state) => state.blogs).find((b) => b.id === id)
  const user = useSelector((store) => store.user)

  if (!user || !blog) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (comment) {
      const modifiedBlog = {
        ...blog,
        user: blog.user.id,
        comments: blog.comments.concat(comment),
      }
      dispatch(modifyBlog(modifiedBlog))
    }
    setComment('')
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  return (
    <div>
      <br></br>
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" value={comment} onChange={handleCommentChange} />
        <button type="submit">add comment</button>
      </form>
      <br></br>
      <ul>
        {blog.comments.map((comment) => (
          <li key={uuidv4()}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Comments
