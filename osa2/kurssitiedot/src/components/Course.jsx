const Course = ({course}) => 
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((sum, x) => sum + x.exercises, 0)} />
      </div>

  
const Header = ({ name }) => <h1>{name}</h1>

const Content = ({parts}) =>
    parts.map(x => <Part key={x.id} name={x.name} exercises={x.exercises} />)

const Part = ({name, exercises}) => <p>{name} {exercises}</p>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p> 

export default Course