import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/TaskCard.css';

export default function TaskCard({ task, onDelete, showEdit = true }) {
  const navigate = useNavigate();
  const { updateTask } = useApp();

  const handleToggle = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="task-checkbox"
          aria-label="Marcar como concluída"
        />
        <h3 className="task-title">{task.title || 'Sem título'}</h3>
        {showEdit && (
          <button
            className="btn-icon"
            onClick={() => navigate(`/tasks/${task.id}`)}
            title="Editar tarefa"
            aria-label="Editar tarefa"
          >
            ✏️
          </button>
        )}
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-card-footer">
        <span className={`badge ${task.completed ? 'badge-done' : 'badge-pending'}`}>
          {task.completed ? '✅ Concluída' : '⏳ Pendente'}
        </span>
        {onDelete && (
          <button
            className="btn-delete"
            onClick={() => onDelete(task.id)}
            title="Excluir tarefa"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
