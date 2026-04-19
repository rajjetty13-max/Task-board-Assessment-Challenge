import { useState } from 'react'

function Modal({ onSave, onClose, defaultStatus }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'normal',
    due_date: '',
    status: defaultStatus || 'todo',
  })

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={e => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">New task</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label className="field-label">Title *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="What needs to be done?"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="field">
            <label className="field-label">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Add more detail..."
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label">Priority</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Due date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => set('due_date', e.target.value)}
              />
            </div>
          </div>
          <div className="field-row">
            <button className="btn-confirm" onClick={handleSave}>
              Create task
            </button>
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal