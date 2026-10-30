import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isReg = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isReg && !form.name.trim()) return setError("Please enter your name");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email");
    if (isReg && (form.password.length < 6 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))) {
      return setError("Password needs 6+ characters with a letter and a number");
    }
    if (!form.password) return setError("Please enter your password");

    try {
      setLoading(true);
      if (isReg) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || "Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2>{isReg ? "Create account" : "Welcome back"}</h2>
        <p className="sub">{isReg ? "Join Aurelle to order and track your fragrances." : "Login to continue."}</p>
        {error && <div className="error">{error}</div>}
        {isReg && (
          <div className="field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={change} />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={change} />
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={change} />
        </div>
        <button className="btn" disabled={loading}>
          {loading ? "Please wait..." : isReg ? "Register" : "Login"}
        </button>
        <p className="switch">
          {isReg ? "Already have an account? " : "New here? "}
          <Link to={isReg ? "/login" : "/register"}>{isReg ? "Login" : "Create account"}</Link>
        </p>
      </form>
    </div>
  );
}
