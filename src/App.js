import React, { useEffect } from 'react';
import './App.css';
import Wordle from './components/Wordle';
import {SocketContext, socket} from './contexts/socket'





function App() {
  useEffect( () => {
    let userName = prompt("enter your username")
    socket.emit('join-room', userName, 'blueprint is the best!')

  },[])
  return (
    // pass socket context to the rest of the component heirarchy
    <SocketContext.Provider value={socket}>
        <div className="App">
          <Wordle/>
        </div>
    </SocketContext.Provider>
  );
}


export default App;
