import { useContext } from "react"
import { createContext, useReducer } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        message: action.payload,
        isVisible: true
      }
    case 'HIDE':
      return {
        ...state,
        isVisible: false
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

const initialState = {
  message: '',
  isVisible: false
}

export const NotificationContextProvider = (props) => {
  const [state, stateDispatch] = useReducer(notificationReducer, initialState)

  return (
    <NotificationContext.Provider value={[state, stateDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationMessage = () => {
  const [state, dispatch] = useContext(NotificationContext)
  return state.message
}

export const useNotificationVisibility = () => {
  const [state, dispatch] = useContext(NotificationContext)
  return state.isVisible 
}

export const useNotificationDispatch = () => {
  const [state, dispatch] = useContext(NotificationContext)
  return dispatch
}

export default NotificationContext
