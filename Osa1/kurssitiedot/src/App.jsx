//Name of the course
const Header = ({coursename}) => {
  return(
    <div>
      <p>Header: {coursename.name}</p>
    </div>
  )
}

//Component to print parts
const Part = ({name, exercises}) =>{
  return(
   <div>
    <p>{name} {exercises}</p>
   </div>
  )
}

//Parts of the course and the number of exercises
const Content = ({parts}) =>{
  return(
    <div>
    <Part name = {parts.parts[0].name} exercises = {parts.parts[0].exercises}/>
    <Part name = {parts.parts[1].name} exercises = {parts.parts[1].exercises}/>
    <Part name = {parts.parts[2].name} exercises = {parts.parts[2].exercises}/>
    </div>
   
  )
  
}

//Total number of exercises
const Total = ({coursecount}) =>{
  return(
    <div>
      <p>Total number of exercises: {coursecount.parts[0].exercises + coursecount.parts[1].exercises + coursecount.parts[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header coursename = {course} /> 
      <Content parts = {course}/>
      <Total coursecount = {course}/> 
    </div>
  )
}

export default App

