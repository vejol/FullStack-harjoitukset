import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => 
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async (anecdote) => {
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

export const updateAnecdote = async (newAnecdote) => {
  const res = await axios.put(`${baseUrl}/${newAnecdote.id}`, newAnecdote)
  return res.data
}
