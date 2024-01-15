import { useState } from 'react'

const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
      {text}
    </button>
)

const StatisticsLine = ({text,value}) => {
  return(
    <tr>
      <td>
        {text}
      </td>
      <td>
        {value}
      </td>
    </tr>

    )
  }

const Statistics = ({good,bad,neutral,allClicks}) => {
  let average = ((good * 1 + neutral * 0 + bad * (-1)) / allClicks )
  //No feedback given
  if(allClicks === 0){
    return(
      <div>
        No feedback given
      </div>
    )
  }
    return(
      <table>
        <tbody>
        <StatisticsLine text = "good" value = {good}/>
        <StatisticsLine text = "neutral" value = {neutral}/>
        <StatisticsLine text = "bad" value = {bad}/>
        <StatisticsLine text = "all" value = {allClicks}/>
        <StatisticsLine text = "average" value ={average}/>
        <StatisticsLine text = "positive" value ={good/allClicks * 100 + " %"}/>
        </tbody>
      </table>
    )
}
 
  
const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const[allClicks, setAll] = useState(0)

  //func for updating number of good feedback and total sum of feedback
  const setValueG = () => {
    setGood(good + 1)
    setAll(allClicks + 1)
  }
  //func for updating number of neutral feedback and total sum of feedback
  const setValueN = () => {
    setNeutral(neutral + 1)
    setAll(allClicks + 1)
  }
  //func for updating number of bad feedback and total sum of feedback
  const setValueB = () => {
    setBad(bad + 1)
    setAll(allClicks + 1)
  }

  //Webpage print if feedback is given
  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick = {() => setValueG(good)} text = "Good"/>
      <Button handleClick = {() => setValueN(neutral)} text = "Neutral"/>
      <Button handleClick = {() => setValueB(bad)} text = "Bad"/>
      
      <h1>Statistics</h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad} allClicks={allClicks}/>
    </div>
  )
}
export default App

