import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import { deleteApiTodo } from '../services/api';

export default function Tasks() {
  const { tasks, deleteTask } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | pending | completed
  const [deleting, setDeleting] = useState(null);

  const filtered = tasks.filter(t => {
    const matchText = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === 'all' ||
      (filter === 'completed' && t.completed) ||
      (filter === 'pending' && !t.completed);
    return matchText && matchStatus;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta tarefa?')) return;
    setDeleting(id);
    try {
      const task = tasks.find(t => t.id === id);
      if (task?.apiId) await deleteApiTodo(task.apiId).catch(() => {});
      deleteTask(id);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Minhas Tarefas</h1>
        <button className="btn-primary" onClick={() => navigate('/tasks/new')}>
          + Nova tarefa
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Buscar tarefas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'pending', label: 'Pendentes' },
            { key: 'completed', label: 'Concluídas' },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="results-count">{filtered.length} tarefa{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>🔍</span>
          <p>{search ? 'Nenhuma tarefa encontrada com esse filtro.' : 'Nenhuma tarefa aqui ainda.'}</p>
          <button className="btn-primary" onClick={() => navigate('/tasks/new')}>Criar nova tarefa</button>
        </div>
      ) : (
        <div className="tasks-grid">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleting === task.id ? null : handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
