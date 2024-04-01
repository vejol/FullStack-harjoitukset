import { useNotificationMessage, useNotificationVisibility } from "../NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const message = useNotificationMessage()
  const isVisible = useNotificationVisibility()

  return (
    <div>
      {isVisible && <div style={style}>
        {message}
      </div>}
    </div>
  )
}

export default Notification
