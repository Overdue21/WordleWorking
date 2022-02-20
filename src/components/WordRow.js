import React from 'react'

function WordRow({letters,letterState}) {
    while(letters.length < 5){
        letters += ' ';
    }
    let letterArray = letters.split('');
    letterState = letterState.map(color => {
        if(color === 'green') {
            return '#6aaa64'
        }
        if(color === 'yellow') {
            return '#c9b458'
        }
        return color;
    })
    return (
    <div className='word-row'>
        {
            letterArray.map((letter,idx) => (
                <div key={`${idx}tile`} style={{
                    backgroundColor: letterState[idx]
                }}>
                    {letter}
                </div>
            ))
        }
    </div>
    )
}

export default WordRow