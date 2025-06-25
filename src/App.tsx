import { useState, useEffect } from 'react'
import supabase from './utils/supabase'

function App() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    supabase.from('courses').select('*').then(({ data, error }) => {
      if (error) {
        console.error(error)
      } else {
        setCourses(data)
      }
    })
  }, [])

  return (
    courses.map((course: any) => (
      <div key={course.id}>
        <h1>{course.name}</h1>
        <img src={course.picture_url} width={100} height={100} alt={course.name} />
      </div>
    ))
  )
}

export default App
