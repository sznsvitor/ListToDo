import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { createApiTodo, updateApiTodo } from "../services/api";
import "../styles/TaskDetail.css";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask, user } = useApp();

  const isNew = id === "new";

  const task = tasks.find(t => String(t.id) === id);

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    completed: task?.completed || false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && !task) {
      navigate("/tasks");
    }
  }, [isNew, task, navigate]);

  const handleChange = ({ target }) => {
    setForm({
      ...form,
      [target.name]:
        target.type === "checkbox"
          ? target.checked
          : target.value,
    });

    setError("");
  };

  const validate = () => {
    if (form.title.trim().length < 3) {
      return "Título deve ter pelo menos 3 caracteres.";
    }

    return "";
  };

  const handleSave = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      if (isNew) {
        const { data } = await createApiTodo({
          title: form.title,
          completed: false,
          userId: user.id,
        });

        addTask({
          id: Date.now(),
          apiId: data.id,
          ...form,
          createdAt: new Date().toISOString(),
        });
      } else {
        if (task?.apiId) {
          await updateApiTodo(task.apiId, form).catch(() => {});
        }

        updateTask(task.id, form);
      }

      navigate("/tasks");
    } catch {
      setError("Erro ao salvar tarefa.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <button
        className="btn-back"
        onClick={() => navigate(-1)}
      >
        ← Voltar
      </button>

      <h1>
        {isNew ? "Nova Tarefa" : "Editar Tarefa"}
      </h1>

      <div className="detail-card">
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Descrição"
          rows="6"
          value={form.description}
          onChange={handleChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
          />
          Concluída
        </label>

        {error && (
          <p className="error-msg">
            {error}
          </p>
        )}
      </div>

      <div className="detail-actions">
        <button
          className="btn-secondary"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}