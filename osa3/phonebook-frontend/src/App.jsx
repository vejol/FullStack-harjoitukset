import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNameField] = useState('')
  const [newNumber, setNumberField] = useState('')
  const [keyword, setNewKeyword] = useState('')

  const [notificationText, setNotificationText] = useState('')
  const [criticalStatus, setCriticalStatus] = useState(false)

  const handleNameChange = (event) => setNameField(event.target.value)
  const handleNumberChange = (event) => setNumberField(event.target.value)
  const handleKeywordChange = (event) => setNewKeyword(event.target.value)

  const notificate = (message, status) => {
    setNotificationText(message)
    setCriticalStatus(status)
    setTimeout(() => {
      setNotificationText(null)
    }, 5000)
  }
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => 
        setPersons(initialPersons))
    }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .updateNumber({...existingPerson, number: newNumber})
          .then(() => {
            personService
              .getAll()
              .then(initPersons => setPersons(initPersons))
            notificate(`Changed number for ${existingPerson.name}`, false)
          })
          .catch(error => {
            notificate(error.response.data.error, true)
            //setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .add(newPerson)
        .then(person => {
          setPersons(persons.concat(person))
          notificate(`Added ${newName}`, false)
        })
        .catch(error => {
          notificate(error.response.data.error, true)
        })
    }
    
    setNameField('')
    setNumberField('')
  }

  const remove = id => {
    const person = persons.find(p => id === p.id)
    if (confirm(`Delete ${person.name} ?`)) {
      personService
      .remove(id)
      .then(() => {
        personService
        .getAll()
        .then(initPersons => {
          setPersons(initPersons)
          notificate(`Deleted ${person.name}`, false)
        })
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationText} critical={criticalStatus}/>
      <Filter keyword={keyword} handleKeywordChange={handleKeywordChange} />
      <h2>Add a new</h2>
      <PersonForm handleAddPerson={addPerson} 
                  newName={newName} 
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons keyword={keyword} persons={persons} handleDelete={remove} />
    </div>
  )
}

const PersonForm = ({handleAddPerson, 
                    newName, 
                    handleNameChange, 
                    newNumber, 
                    handleNumberChange}) => (
  <form onSubmit={handleAddPerson}>
    <div>name: <input value={newName} onChange={handleNameChange}/></div>
    <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Filter = ({keyword, handleKeywordChange}) => 
  <div>filter shown with <input value={keyword} onChange={handleKeywordChange} /></div>


const Persons = ({ keyword, persons, handleDelete}) => {
  const matches = persons.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()))
  return matches.map(p => 
    <div key={p.name}>
      <p>{p.name} {p.number} 
        <button onClick={() => handleDelete(p.id)}>Delete</button> 
      </p>
    </div>
    )
}

const Notification = ({ message, critical }) => {
  const color = critical ? 'red' : 'green'
  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  
  if (message === null || message.length === 0) {
    return null
  }

  return <div style={notificationStyle}>{message}</div>
}


export default App