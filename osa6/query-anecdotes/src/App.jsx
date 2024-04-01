import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const handleVote = (anecdote) => {
    const newAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    newAnecdoteMutation.mutate(newAnecdote)

    const message = `anecdote ${anecdote.content} voted`
    notificationDispatch({
      type: 'SHOW', 
      payload: message
    })

    setTimeout(() => {
      notificationDispatch({ type: 'HIDE' })
    }, 5000)

  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  
  if ( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  } 
  
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
