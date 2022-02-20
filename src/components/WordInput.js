import {React, useState, useEffect} from 'react'

function WordInput({disabled}) {
    const [value,setValue] = useState('');
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleSubmit = (event) => {
        alert(value);
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