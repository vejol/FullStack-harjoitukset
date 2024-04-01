import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, isVisible } = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div>
      {isVisible && <div style={style}>
          {message}
        </div>
      }
    </div>
  )
}

export default Notification
