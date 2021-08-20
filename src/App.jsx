import React, { useEffect, useState } from 'react';
import axios from 'axios'


function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
     try {
      const item = localStorage.getItem(key);
       return item ? JSON.parse(item) : initialValue;
     } catch (error) {
       // If error also return initialValue
       console.log(error);
       return initialValue;
     }
   });

   const setValue = (value) => {
     try {
       const valueToStore =
         value instanceof Function ? value(storedValue) : value;
       // Save state
       setStoredValue(valueToStore);
       // Save to local storage
       localStorage.setItem(key, JSON.stringify(valueToStore));
     } catch (error) {
       // A more advanced implementation would handle the error case
       console.log(error);
     }
   };
   return [storedValue, setValue];
 }

function useNotes() {
  const [isLoaded, setisLoaded] = useState(false)
  const [Notes, setNotes] = useState([])
  const [NewNote, setNewNote] = useState({  "title": "",})
  const [localNotes, setLocalNotes] = useLocalStorage('Notes',[])
  const SERVER = "https://pacific-dawn-43625.herokuapp.com/notes"
  useEffect(async() => {
    FetchData()
    }, [])


    async function FetchData() {
      setisLoaded(false)
      setNotes(await axios(SERVER).then(result => {return result.data}))
      if (!Notes) {
        setNotes(await localNotes)
      }
      setLocalNotes(await Notes)
      setisLoaded(true)
    }

    function HandleChangeTitle(e) {
      setNewNote({ ...NewNote, "title": e.target.value })
    }

    async function HandleSubmit (e) {
      e.preventDefault();
        await axios.post(SERVER, NewNote)
        FetchData()
      }
  
      
  
      async function DeleteNote(id) {
        await  axios.delete(`${SERVER}/${id}`)
        FetchData()
      }
  

  return {HandleChangeTitle ,FetchData, Notes, isLoaded, DeleteNote, HandleSubmit}
}

 



function App() {
 const {HandleChangeTitle ,FetchData, Notes, isLoaded, DeleteNote, HandleSubmit}  = useNotes()
  
    return (
      <div className="App">
        <h1>Notes</h1>
        <ul>
          {!isLoaded ? <h2>Getting data</h2> : Notes.map(note => {return (<li key={note._id}>{note.title} <button onClick={() => {DeleteNote(note._id)}}>Delete</button></li>)})}
        </ul>
        <form onSubmit={HandleSubmit}>
          <input type="text" onChange={(e) => HandleChangeTitle(e)} name="Title" id="title" placeholder="Input your Title here" />
          <button>Submit</button>
        </form>
          <button onClick={FetchData}>Reload</button>
      </div>
    )
  }

  export default App
