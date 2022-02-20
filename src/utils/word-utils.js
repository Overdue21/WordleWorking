import WordBank from '../utils/word-bank.json'

export default function checkGuess(guess, answer){
    guess = guess.toUpperCase();
    answer = answer.toUpperCase();
    let guessArray = guess.split('');
    let ansArray = answer.split('');
    let response = ['gray','gray','gray','gray','gray'];
    // set greens (prioritize)
    for(let i = 0; i < 5; i++ ){
        if(guessArray[i] === ansArray[i]) {
            response[i] = 'green';
            ansArray[i] = '-';
        }
    }
    // set yellows
    for(let i = 0; i < 5; i++ ){
        if(response[i]!== 'green' && ansArray.includes(guessArray[i])){
            response[i] = 'yellow';
            ansArray[ansArray.indexOf(guessArray[i])] = '-';
        }
    }
    
    return response;
}