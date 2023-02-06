import { useEffect, useState } from 'react';
import './App.css';
import Confetti from './Confetti';
import Dice from './Die';

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [gameWinStatus, setGameWinStatus] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [currentBest, setCurrentBestTime] = useState( ()=>parseFloat(localStorage.getItem('bestTime')) || -1);
  
  const diceElement = dice.map((item, index)=>
  <Dice 
    key={index}
    id={index}
    value={item.value} 
    frozenStatus={item.isHeld}
    freezeDice={()=>freezeDice(index)}
  />);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  function allNewDice() {
    var randomArr = [];
    for(let i = 0; i<10; i++){
        randomArr.push({
          value: getRandomInt(1,6),
          isHeld: false
        })  
    }
    return randomArr;
  }

  function updateDice(){
    const newDice = dice.map((item, index)=>!item.isHeld ? {...item, value: getRandomInt(1,6)} : item)
    return newDice;
  }

  function freezeDice(id){
    setDice(oldDiceEle => {
      const newDice = oldDiceEle.map((item, index)=> index === id ? {...item, isHeld: !item.isHeld} : item)
      return newDice;
    })
    
  }
  function rollDice(){
    if(gameWinStatus){
      setStartGame(false)
      setGameWinStatus(false)
      setDice(allNewDice())
    } else {
      setDice(updateDice())
    }
  }

  function createNewGame(){
    setStartGame(false)
    setGameWinStatus(false)
    setDice(allNewDice())
  }

  function allEqual(arr){
    return arr.every( v => v === arr[0] )
  }

  function allHeld(arr){
    return arr.every( v => v === true)
  }

  function playGame(){
    setStartTime(new Date());
    setStartGame(true)
  }

  function endTimer(){
    const stopTime = new Date();
    const timeElapsed = ((stopTime-startTime)/1000);
    //Compare current time with localStorage Time to find best time
    if((timeElapsed<currentBest) || currentBest === -1){
      localStorage.setItem("bestTime", timeElapsed)
      setCurrentBestTime(timeElapsed)
    }

  }

  useEffect(()=>{
    const dieValues = dice.map((item)=>item.value);
    const allStatus = dice.map((item)=>item.isHeld);

    if(allEqual(dieValues) && allHeld(allStatus)) {
      setGameWinStatus(true);
      endTimer();
    } 
  },[dice])

  return (
    <main className={`${gameWinStatus && 'game-fin'}`}>
      {gameWinStatus && <Confetti />}
      <div className="container">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        {startGame ? (
          <div className='die-container'>
          {...diceElement}
        </div>
        ): 
          (
          <button 
            className='btn start'
            onClick={playGame}>
            Start Playing!
          </button>
          )
        }
        <button className={`btn ${!startGame && 'inactive'}`} onClick={rollDice} disabled={!startGame}>
          { gameWinStatus ? 'Reset' : 'Roll'}
        </button>
        <p className='timer'><b>Best Time: </b>{currentBest >= 0? currentBest.toFixed(2): '0.00'} s</p>
        <button 
          className='btn restart'
          onClick={createNewGame}>
            Start Again!
        </button>
      </div>
    </main>
  )
}

export default App
