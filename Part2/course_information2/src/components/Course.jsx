const Course = ({course}) =>  {
    return(
    <div>
      <Header name = {course.name}/>
      <Content course = {course.parts}/> 
      <Total total= {course.parts}/>
    </div>
    )
  }
  
  const Header = ({ name }) => {
    return(
      <h2>{name}</h2>
    )
  }
  
    const Total = ({ total }) => {
    //Mapping to get the number of exercises separately
    const partsMap = total.map(part => (part.exercises))
  
    //Adding up the exercises using reduce
    const sum = partsMap.reduce((a,c) => a+c, 0)
    return(
    <p><th>Total of {sum} exercises </th></p>
    )
  } 
  
  const Part = ({part}) => {
    return(
    <p>{part.name} {part.exercises}</p>
    )
  }
  
   const Content = ({course}) => {
    console.log(course, "Content")
    return(
    <div>
        {course.map(part => 
           <Part key = {part.id} part={part}/>
        )}
    </div>
    )
  } 

  export default Course