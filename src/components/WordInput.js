import {React, useState, useEffect, useContext} from 'react'
import {SocketContext} from '../contexts/socket'

function WordInput({disabled}) {
    const socket = useContext(SocketContext)
    const [value,setValue] = useState('');
    const[canSubmit,setCanSubmit] = useState(false)
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSubmit = (event) => {
        socket.emit('submit-secret-word', value)
        event.preventDefault();
       
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