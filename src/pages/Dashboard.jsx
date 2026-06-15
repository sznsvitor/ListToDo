import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const { tasks } = useApp();
  const navigate = useNavigate();

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-number">{tasks.length}</p>
          <p className="stat-label">Tarefas</p>
        </div>

        <div className="stat-card">
          <p className="stat-number">{completed}</p>
          <p className="stat-label">Concluídas</p>
        </div>

        <div className="stat-card">
          <p className="stat-number">{pending}</p>
          <p className="stat-label">Pendentes</p>
        </div>
      </div>

      {/* Estado vazio */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <span>📝</span>

          <h2>Nenhuma tarefa cadastrada</h2>

          <p>
            Você ainda não possui tarefas.
            Crie sua primeira tarefa para começar a se organizar.
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate('/tasks/new')}
          >
            + Nova Tarefa
          </button>

          <button
            className="btn-text"
            onClick={() => navigate('/explore')}
          >
            ou importe tarefas da API
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.slice(0, 4).map(task => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </div>
      )}
    </div>
  );
}