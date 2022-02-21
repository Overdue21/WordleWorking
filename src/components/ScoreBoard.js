import {useEffect,useState} from 'react'

function ScoreBoard({room}) {
    //const [score,setScore] = useState({
    //    player1: 0,
    //    player2: 0,
    //})
    return (
        <div className="scoreBoard">
            <h3> Score </h3>
            {
               room.map((s, idx) => {
                    if(s.isMaster){
                        return <div key ={`scoreboard ${idx}`}>{s.name} : {s.score} Master </div>
                    }else if(s.done){
                        <div key ={`scoreboard ${idx}`}>{s.name} : {s.score} Done </div>
                    }
                    return <div key ={`scoreboard ${idx}`}>{s.name} : {s.score} </div>
               })
            }
        </div>
    )
}

export default ScoreBoard