import { useState, useRef } from 'react'
import './Board.css'

const COLUMNS = [
  { id: 'todo',        label: 'To Do',      color: '#6366f1' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'in_review',   label: 'In Review',   color: '#8b5cf6' },
  { id: 'done',        label: 'Done',        color: '#10b981' },
]

const PRIORITY = {
  low:    'badge-low',
  normal: 'badge-normal',
  high:   'badge-high',
  urgent: 'badge-urgent',
}

function Card({ task, onDragStart, dragging, onDelete }) {
  return (
    <div
      className={`card ${dragging ? 'card-dragging' : ''}`}
      draggable
      onDragStart={e => onDragStart(e, task)}
    >
      <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="card-title">{task.title}</div>
        <div className="card-actions">
          <button className="card-btn delete" onClick={() => onDelete(task.id)}>✕</button>
        </div>
      </div>
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

function Column({ col, tasks, onDragStart, onDragOver, onDrop, draggingId, dragOverCol, onDelete, onAddTask }) {
  const isOver = dragOverCol === col.id
  return (
    <div
      className={`column ${isOver ? 'column-drag-over' : ''}`}
      onDragOver={e => onDragOver(e, col.id)}
      onDrop={e => onDrop(e, col.id)}
    >
      <div className="column-header">
        <div className="column-title">
          <div className="column-dot" style={{ background: col.color }} />
          <span style={{ color: col.color }}>{col.label}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="column-body">
        {tasks.length === 0 && (
          <div className="empty-state">Drop tasks here</div>
        )}
        {tasks.map(task => (
          <Card
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            dragging={task.id === draggingId}
            onDelete={onDelete}
          />
        ))}
      </div>
      <button className="add-card-btn" onClick={() => onAddTask(col.id)}>
        ＋ Add task
      </button>
    </div>
  )
}

function Board({ tasks, onMoveTask, onDeleteTask, onAddTask }) {
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)
  const dragTask = useRef(null)

  function onDragStart(e, task) {
    dragTask.current = task
    setDraggingId(task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e, colId) {
    e.preventDefault()
    setDragOverCol(colId)
  }

  function onDrop(e, colId) {
    e.preventDefault()
    setDragOverCol(null)
    setDraggingId(null)
    const task = dragTask.current
    if (!task || task.status === colId) return
    onMoveTask(task.id, colId)
    dragTask.current = null
  }

  function onDragEnd() {
    setDraggingId(null)
    setDragOverCol(null)
  }

  return (
    <div className="board-wrap">
      <div className="board" onDragEnd={onDragEnd}>
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            col={col}
            tasks={tasks.filter(t => t.status === col.id)}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            draggingId={draggingId}
            dragOverCol={dragOverCol}
            onDelete={onDeleteTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </div>
  )
}
export default Board 