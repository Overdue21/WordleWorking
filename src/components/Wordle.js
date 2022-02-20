import {useEffect, useState, useContext} from 'react'
import WordBank from '../utils/word-bank.json'
import WordRow from './WordRow'
import ScoreBoard from './ScoreBoard'
import WordInput from './WordInput'
import checkGuess from '../utils/word-utils'
import {SocketContext} from '../contexts/socket'

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function checkWin(colorArray){
    for(let color of colorArray){
        if(color != 'green') return false;
    }
    return true;
}
function Wordle() {
    const socket = useContext(SocketContext);
    const [scoreBoard, setScoreBoard] = useState([]);
    const [guess,setGuess] = useState('');
    const [guesses,setGuesses] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);
    const [curRow,setCurRow] = useState(0);
    const [guessing,setGuessing] = useState(true);
    const [tileColors,setTileColors] = useState([
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
    ])
    const [answer,setAnswer] = useState('crane');
    // handle a key press
    const onKeyDown = (e) => {
      if(!guessing) return;
      const letter = e.key;
      // submitted guess
      if(guess.length === 5 && letter === 'Enter') {
          const clues = checkGuess(guess,answer);
          setGuesses(prevGuesses => {
              prevGuesses[curRow] = guess;
              return prevGuesses;
          });
          setGuess('');
          setTileColors(prevTileColors => {
              prevTileColors[curRow] = clues;
              return prevTileColors;
          });
          // check for win
          if(checkWin(clues)){
            socket.emit('submit-solution', 1)
          }
          if(curRow === 5){
            alert('Game Over');
            return;
          }
          setCurRow(curRow + 1);
      }
      setGuess(curGuess => {
        if(letter === 'Backspace' && curGuess.length != 0){
            return curGuess.slice(0,-1);
        }
        if(curGuess.length === 5 || !isLetter(letter)) return curGuess;
        
        return curGuess + letter;
        
      });
      console.log(guess);
    }

    // register keypress event listener
    useEffect(() => {
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('keydown',onKeyDown);
      }
    });
    
    useEffect(() => {
      socket.on('update-room', (data) => {
        console.log(data)  
        setScoreBoard(data)
      })
    }, [socket])
    return (
    <div>
        <h1>Wordle</h1>
        {
            guesses.map((g,idx) => {
                if(idx == curRow){
                    return <WordRow key={`${idx}wordrow`}  letters={guess} letterState={tileColors[idx]}/>
                }
                return <WordRow key={`${idx}wordrow`} letters={g} letterState={tileColors[idx]}/>
            })
        }
        <ScoreBoard scoreboard = {scoreBoard}/>
        <WordInput disabled={guessing} />
    </div>
  )
}


export default Wordle