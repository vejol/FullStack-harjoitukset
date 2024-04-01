import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 }, {
      onSuccess: () => {
        const message = `anecdote ${content} created`
        notificationDispatch({
          type: 'SHOW', 
          payload: message
        })
    
        setTimeout(() => {
          notificationDispatch({ type: 'HIDE' })
        }, 5000)
      },
      onError: () => {
        notificationDispatch({
          type: 'SHOW', 
          payload: 'too short anecdote, must have length 5 or more'
        })
    
        setTimeout(() => {
          notificationDispatch({ type: 'HIDE' })
        }, 5000)
      }
    })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
