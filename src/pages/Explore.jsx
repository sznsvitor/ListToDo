import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchApiTodos } from "../services/api";
import "../styles/Explore.css";

export default function Explore() {
  const { addTask, tasks } = useApp();

  const [apiTasks, setApiTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [importing, setImporting] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const { data } = await fetchApiTodos();
      setApiTasks(data);
    } catch {
      setError("Não foi possível carregar tarefas da API.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(task) {
    setImporting(task.id);

    await new Promise(resolve => setTimeout(resolve, 400));

    addTask({
      id: Date.now(),
      apiId: task.id,
      title: task.title,
      description: "Importado da API pública",
      completed: task.completed,
      createdAt: new Date().toISOString(),
    });

    setImporting(null);
  }

  const filteredTasks = apiTasks.filter(task => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "completed")
      return matchesSearch && task.completed;

    if (filter === "pending")
      return matchesSearch && !task.completed;

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Carregando da API...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Explorar Tarefas</h1>
        <span className="badge-info">API JSONPlaceholder</span>
      </div>

      <p className="page-subtitle">
        Navegue por tarefas públicas e importe as que quiser para a sua lista.
      </p>

      <div className="filters-bar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Buscar na API..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="filter-tabs">
          {[
            ["all", "Todas"],
            ["pending", "Pendentes"],
            ["completed", "Concluídas"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`filter-tab ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="api-error">{error}</p>}

      <div className="explore-grid">
        {filteredTasks.map(task => {
          const isImported = tasks.some(
            item => item.apiId === task.id
          );

          return (
            <div
              key={task.id}
              className={`explore-card ${
                task.completed ? "completed" : ""
              }`}
            >
              <div className="explore-card-id">#{task.id}</div>

              <p className="explore-card-title">
                {task.title}
              </p>

              <div className="explore-card-footer">
                <span
                  className={`badge ${
                    task.completed
                      ? "badge-done"
                      : "badge-pending"
                  }`}
                >
                  {task.completed
                    ? "✅ Concluída"
                    : "⏳ Pendente"}
                </span>

                <button
                  className={`btn-import ${
                    isImported ? "imported" : ""
                  }`}
                  disabled={
                    isImported || importing === task.id
                  }
                  onClick={() =>
                    !isImported && handleImport(task)
                  }
                >
                  {importing === task.id
                    ? "..."
                    : isImported
                    ? "✓ Importada"
                    : "+ Importar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}