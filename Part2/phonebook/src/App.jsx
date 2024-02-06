import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

 const Persons = ({persons, filter, delPersonButton}) => {
  return(
    <div> 
      {persons
        .filter(({name, number}) => 
          name.toLowerCase().includes(filter.toLowerCase())|| 
          number.toLowerCase().includes(filter.toLowerCase()))
        .map(person => (
    
      <div key={person.id}>
        {person.name} {person.number} 
         <button onClick = {() => delPersonButton(person.id)}>Delete</button>
      </div>
      ))}
    </div>
  )
}

const AddPerson = ({newName, numbers, addPerson, handleNameChange, handleNumberChange}) => {
  return(
    <form onSubmit={addPerson}>
      <div> name: <input value={newName} onChange={handleNameChange}/></div> 
      <div> number: <input value={numbers} onChange={handleNumberChange}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Filter = ({filter, handleFilter}) => {
  return(
    <div>filter shown with:
      <input value = {filter} onChange={handleFilter}/> 
    </div>
  )
}
 const Notification = ({notificationType, message}) =>{
    const successfulNotification = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }

    const errorMessage = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }

    if(message === null){
      return null
    }

    //return errorMessage if number is tried to be modified after the person is deleted (red)
    //else return message for successful action (green)
    if(notificationType === 'unsuccessful'){
      return(
        <div style = {errorMessage}> {message} </div>
      )
    }
    else{
      return(
        <div style = {successfulNotification}> {message} </div>
      )
    }
} 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('') 
  const[numbers, setNumber] = useState('')
  const[filter, setFilter] = useState('')
  const[notification, setNotification] = useState(null)
  const[notificationType, setNotificationType] = useState('good')

  useEffect(() => {
    personService
      .getAll()
      .then(initPersons => {
        setPersons(initPersons)
      })
  }, [])
  
  //Adding a person
  const addPerson = (event) => {
    event.preventDefault()
    if(persons.some(({name}) => name === newName)) {  
      const personToUpdate = persons.find(person => person.name === newName) 
      const updatedPerson = {...personToUpdate, number: numbers}
      const text = "is already added to phonebook, replace the old number with a new one?"
      if(window.confirm(`${newName} ${text}`)){
        personService
          .update(personToUpdate.id, updatedPerson)
          .then(updatedPerson =>{
            setPersons(persons.map(person => person.id !== personToUpdate.id ? person : updatedPerson))
            setNotificationType('successful')
            setNotification(`${personToUpdate.name} was updated`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setNewName('')
            setNumber('')
          })
          .catch(error => {
            setNotificationType('unsuccessful')
            setNotification(`${personToUpdate.name} was already deleted from the server`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== personToUpdate.id))
            setNewName('')
            setNumber('')
          })
      }
      else{
        console.log("Updating person number was cancelled")
      }
      
    }
    else{
      const personObject = {
        name: newName,
        number: numbers
      }
      personService
      .addNew(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationType('successful')
        setNotification(`${newName} was added`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNewName('')
        setNumber('')
      })
    }
  }

  const delPerson = id => {
    const deletedPerson = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${deletedPerson.name}?`)){
      personService
        .delPerson(id)
        .then( () => {  
          setPersons(persons.filter(person => person.id !== id))
          setNotificationType('successful')
          setNotification(`${deletedPerson.name} was Deleted`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setNotificationType('unsuccessful')
          setNotification(`${deletedPerson.name} was already deleted from the server`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
          setNewName('')
          setNumber('')
        })
    } 
    else{
      console.log("Deleting person was cancelled")
    }       
  }

  //Handlers
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)

  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notificationType={notificationType} message={notification}/>

      <Filter filter={filter} handleFilter={handleFilter} />

      <h3>add a new</h3>
      <AddPerson 
        addPerson={addPerson}
        newName={newName}
        numbers={numbers}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} delPersonButton={delPerson}/>
    </div>
  )

}

export default App

