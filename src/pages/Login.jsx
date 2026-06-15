import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { fetchUsers } from "../services/api";
import "../styles/Login.css";

export default function Login() {
  const { login, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    setForm({
      ...form,
      [target.name]: target.value,
    });

    setError("");
  };

  const validate = () => {
    if (!form.email || !form.password)
      return "Preencha todos os campos.";

    if (!/\S+@\S+\.\S+/.test(form.email))
      return "Email inválido.";

    if (form.password.length < 4)
      return "A senha deve ter pelo menos 4 caracteres.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data } = await fetchUsers();

      const user = data.find(
        u => u.email.toLowerCase() === form.email.toLowerCase()
      );

      if (!user) {
        setError("Email não encontrado.");
        return;
      }

      login(user);
      navigate("/dashboard");

    } catch {
      setError("Erro ao conectar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <button
        className="theme-toggle floating"
        onClick={toggleDarkMode}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="login-container">
        <h1 className="brand-large">
          ListTo<span>Do</span>
        </h1>

        <p className="login-subtitle">
          Entre e organize suas tarefas
        </p>

        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
            />

            {error && (
              <p className="api-error">{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary full-width"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="login-hint">
  Use um email da API JSONPlaceholder
</p>
<a
  href="https://jsonplaceholder.typicode.com/users"
  target="_blank"
  rel="noreferrer"
  className="login-hint"
>
  Ver lista de emails
</a>
        </div>
      </div>
    </div>
  );
}