import { useState, useEffect } from 'react'
import Entries from './components/Entries'
import SearchNames from './components/SearchNames'
import AddNew from './components/AddNew'
import phoneService from './services/phonebook'
import Notification from './components/Notifications'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [requestData, setRequestData] = useState(new Date());
  const [addMessage, setAddMessage] = useState({
    message: null,
    alert: false
  })
  
  useEffect(() => {
    phoneService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [requestData])
  console.log('render', persons.length, 'persons')

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage}/>
      <SearchNames names={persons} setpersons={setPersons}/>
      <h3>add a new</h3>
      <AddNew 
        names={persons} 
        setpersons={setPersons} 
        setAddMessage={setAddMessage} 
        setRequestData={setRequestData}/>
      <h3>Numbers</h3>
      <Entries entries={persons} setRequestData={setRequestData}/>
    </div>
  )
}

export default App
