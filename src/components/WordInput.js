import {React, useState, useEffect, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

function WordInput({disabled, setGuessing}) {
    const socket = useContext(SocketContext)
    const [value,setValue] = useState('')
    function isLetter(str) {
      for(let i = 0; i < str.length; i++){
        if(!str.charAt(i).match(/[a-z]/i)) return false
      }
      return true
    }
    const handleChange = (event) => {
      if(!isLetter(event.target.value)) return 
      setValue(event.target.value)
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if(value.length != 5) return
        socket.emit('submit-secret-word', value)
        setGuessing(false)
    }
    
    return (
        <div className="wordInput">
            <form onSubmit={handleSubmit}>
                <label>
                    <h3>Secret Word: <span>{value}</span></h3>
                    <input type="text" value={value} onChange={handleChange} disabled={disabled} maxLength={5} />
                </label>
                <input type="submit" value="Enter" disabled={disabled} className="submitButton" />
            </form>
        </div>
    )
}

export default WordInput