import {useEffect, useState} from 'react'
import {supabase} from './supabaseClients'
import Board from './Board'
function App() 
{
  const [session, setSession] = useState(null)
  const [tasks, setTasks] = useState([])

  useEffect(() => 
  {
    supabase.auth.getSession().then(({ data: { session } }) => 
    {
      if (session) 
      {
        setSession(session)
      } else 
      {
        supabase.auth.signInAnonymously().then(({ data }) => 
        {
          setSession(data.session)
        })
      }
    })
  }, [])

  if (!session) 
  {
    return <p>Loading...</p>
  }

  return (
    <div>
      <header className="header">
        <span className="logo">⬡ Flowboard</span>
      </header>
      <Board tasks={tasks} />
    </div>
  )
}

export default App
