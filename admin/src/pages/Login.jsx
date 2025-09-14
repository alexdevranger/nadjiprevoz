import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../helper/globalState";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in with", { email, password });
      const res = await axios.post("/api/auth/login", { email, password });
      const data = await res.data;
      console.log("Login response:", data);
      //   if (!res.ok) {
      //     setError(data.error || "Login failed");
      //     return;
      //   }
      // Sačuvaj token u localStorage ili context (po potrebi)
      localStorage.setItem("token", data.token);
      setGlobalState("token", data.token);

      // Možeš sačuvati korisnika u globalni state ako želiš
      localStorage.setItem("user", JSON.stringify(data.user));
      setGlobalState("user", data.user);

      // Preusmeravanje nakon 2 sekunde
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Greška prilikom logina!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Uloguj se
        </button>
      </form>
    </div>
  );
}
