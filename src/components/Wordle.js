import {useEffect, useState, useContext} from 'react'
import WordBank from '../utils/word-bank.json'
import WordRow from './WordRow'
import ScoreBoard from './ScoreBoard'
import WordInput from './WordInput'
import checkGuess from '../utils/word-utils'
import {SocketContext} from '../contexts/socket'
//import { set } from 'core-js/core/dict'

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
    const [guessing,setGuessing] = useState();
    const [isMaster, setIsMaster] = useState();
    const [tileColors,setTileColors] = useState([
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
    ])
    const [answer,setAnswer] = useState('');
    // handle a key press
    const onKeyDown = (e) => {
      if(!guessing || isMaster) return;
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
            setCurRow(curRow + 1);
            alert("You won")
            return
          }
          if(curRow === 5){
            socket.emit('submit-solution', -1)
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
    const reset = () => {
      console.log('reset')
      setGuessing(false)
      setIsMaster(false)
      setAnswer('')
      setGuesses([
        '',
        '',
        '',
        '',
        '',
        '',
      ])
      setCurRow(0)
      setTileColors([
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
        ['white','white','white','white','white'],
    ])
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
        console.log('room updated')
        console.log(data)  
        setScoreBoard(data)
      })
      socket.on('connect', () => {
        console.log(socket.id)
      })
      socket.on('you-are-master', () => {
        console.log('master set')
        setGuessing(true)
        setIsMaster(true)
      })
      socket.on('reset', () => {
        reset()
      })
      socket.on('share-secret', (secret) => {
        console.log('secret shared')
        setAnswer(secret)
        if(!isMaster) setGuessing(true)
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
        <ScoreBoard room = {scoreBoard}/>
          {console.log(!guessing)}
        <WordInput disabled={!guessing} setGuessing={setGuessing} />
    </div>
  )
}


export default Wordle