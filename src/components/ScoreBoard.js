import {useEffect,useState} from 'react'

function ScoreBoard({scoreboard}) {
    //const [score,setScore] = useState({
    //    player1: 0,
    //    player2: 0,
    //})
    return (
        <div className="scoreBoard">
            <h3> Score </h3>
            {
               scoreboard.map((s, idx) => {
                    console.log(s.name)
                    console.log(s.score)
                    return <div key ={`scoreboard ${idx}`}>{s.name} - {s.score} </div>
               })
            }
        </div>
    )
}

export default ScoreBoard