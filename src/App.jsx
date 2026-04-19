import { useEffect, useState } from 'react'
import { supabase } from './supabaseClients'
import Board from './Board'
import Modal from './Modal'

function App() {
  const [session, setSession] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
      } else {
        supabase.auth.signInAnonymously().then(({ data }) => {
          setSession(data.session)
        })
      }
    })
  }, [])

  useEffect(() => {
    if (!session) return
    fetchTasks()
  }, [session])

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) console.error('Failed to fetch tasks:', error)
    else setTasks(data)
    setLoading(false)
  }
  useEffect(() => {
  if (!session) return

  const channel = supabase
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${session.user.id}`,
      },
      payload => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => {
            const exists = prev.find(t => t.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new]
          })
        }
        if (payload.eventType === 'UPDATE') {
          setTasks(prev =>
            prev.map(t => t.id === payload.new.id ? payload.new : t)
          )
        }
        if (payload.eventType === 'DELETE') {
          setTasks(prev =>
            prev.filter(t => t.id !== payload.old.id)
          )
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [session])

  async function handleCreateTask(form) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: form.title,
        description: form.description,
        priority: form.priority,
        due_date: form.due_date || null,
        status: form.status,
        user_id: session.user.id,
      })
      .select()
      .single()
    if (error) console.error('Failed to create task:', error)
    else setTasks(prev => [...prev, data])
    setModal(null)
  }

  async function handleMoveTask(taskId, newStatus) {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ))
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
    if (error) console.error('Failed to move task:', error)
  }

  async function handleDeleteTask(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
    if (error) console.error('Failed to delete task:', error)
  }

  if (!session || loading) {
    return <p style={{ padding: 24, color: '#9090a8' }}>Loading...</p>
  }

  return (
    <div>
      <header className="header">
        <span className="logo">⬡ Flowboard</span>
        <button className="btn-confirm" style={{ width: 'auto', padding: '7px 14px' }}
          onClick={() => setModal({ status: 'todo' })}>
          ＋ New task
        </button>
      </header>
      <Board
        tasks={tasks}
        onMoveTask={handleMoveTask}
        onDeleteTask={handleDeleteTask}
        onAddTask={status => setModal({ status })}
      />
      {modal && (
        <Modal
          defaultStatus={modal.status}
          onSave={handleCreateTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default App