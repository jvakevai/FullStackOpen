import { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))
  //Setting a new state of anecdotes length storing it to voteCount
  const [voteCount, setVoteCount] = useState(new Array(anecdotes.length).fill(0))

  //Setting a new state to get random number to be able to get anecdotes by random
  const setRand = () =>{
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  //Updating the array by copying it into an another array, to keep track of the anecdotes' votes
  const copyOfVotes = [...voteCount]
  const setVote = () => {
    copyOfVotes[selected] += 1
    setVoteCount(copyOfVotes)
  }

  console.log(copyOfVotes)
  //Index of most voted anecdote
  const mostVoted = () => {
    let index = 0
    for(let i = 0; i < copyOfVotes.length; i++){
      if(copyOfVotes[i] > copyOfVotes[index]){
        index = i
        //console.log(copyOfVotes.length, "lenght")
        //console.log(i, "i")
        //console.log(copyOfVotes[i], "cov")
        //console.log(index, "index")
      }   
    }
    return index
  }
  
  //console.log(mostVoted())

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>This anecdote has {voteCount[selected]} votes</p>
      <Button handleClick = {() => setVote(voteCount)} text = "Vote"/>
      <Button handleClick = {() => setRand(selected)} text = "Next anecdote"/>
      <h1>Anecdote with the most votes</h1>
      <p>{anecdotes[mostVoted()]}</p>
    </div>
  )
}

export default App
