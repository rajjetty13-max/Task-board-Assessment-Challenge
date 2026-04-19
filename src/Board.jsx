import './Board.css'

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: '#6366f1' },
  { id: 'in_progress', label: 'In Progress',  color: '#f59e0b' },
  { id: 'in_review',   label: 'In Review',    color: '#8b5cf6' },
  { id: 'done',        label: 'Done',         color: '#10b981' },
]

const PRIORITY = {
  low:    'badge-low',
  normal: 'badge-normal',
  high:   'badge-high',
  urgent: 'badge-urgent',
}

function Card({ task }) {
  return (
    <div className="card">
      <div className="card-title">{task.title}</div>
      {task.description && (
        <div className="card-desc">{task.description}</div>
      )}
      <div className="card-meta">
        <span className={`badge ${PRIORITY[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </div>
  )
}

function Column({ col, tasks }) {
  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title">
          <div className="column-dot" style={{ background: col.color }} />
          <span style={{ color: col.color }}>{col.label}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="column-body">
        {tasks.map(task => (
          <Card key={task.id} task={task} />
        ))}
      </div>
      <button className="add-card-btn">＋ Add task</button>
    </div>
  )
}

function Board({ tasks }) {
  return (
    <div className="board-wrap">
      <div className="board">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            col={col}
            tasks={tasks.filter(t => t.status === col.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default Board