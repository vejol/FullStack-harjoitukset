import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import storage from '../services/storage'
import { notify } from '../reducers/notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    resetUser(state, action) {
      return null
    },
  },
})

export const removeUser = () => {
  return async (dispatch) => {
    storage.removeUser()
    dispatch(resetUser())
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials)
      dispatch(setUser(user))
      storage.saveUser(user)
      dispatch(notify(`Welcome back, ${user.name}`))
    } catch (error) {
      dispatch(notify('Wrong credentials', 'error'))
    }
  }
}

export const { setUser, resetUser } = userSlice.actions
export default userSlice.reducer
