import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
  },
})

export const notify = (message, type = 'success') => {
  return async (dispatch) => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(setNotification(null))
    }, 5000)
  }
}

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer
