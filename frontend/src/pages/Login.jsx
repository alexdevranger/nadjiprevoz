import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setGlobalState } from "../helper/globalState";
import "../App.css";
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isBanned, setIsBanned] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      // 👉 Provera da li je korisnik banovan
      if (data.user?.banned) {
        setError(
          "Vaš nalog je banovan. Pokušajte ponovo da se ulogujete za 7 dana."
        );
        setIsBanned(true);
        // ukloni token i user ako backend ipak vrati
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }
      // Sačuvaj token u localStorage ili context (po potrebi)
      localStorage.setItem("token", data.token);
      setGlobalState("token", data.token);

      // Poruka uspeha
      setMessage(data.message || "Uspešno ste se ulogovali!");

      // Možeš sačuvati korisnika u globalni state ako želiš
      localStorage.setItem("user", JSON.stringify(data.user));
      setGlobalState("user", data.user);

      // Preusmeravanje nakon 2 sekunde
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div className="h-[100vh] flex items-center justify-center mainBgIMG">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto -mt-32 bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Prijava
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Lozinka"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {!isBanned && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Zaboravljena lozinka?
              </a>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isBanned}
          className={`w-full py-2 px-4 font-medium rounded-lg shadow transition-all duration-200
            ${
              isBanned
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            }`}
        >
          Uloguj se
        </button>
        {message && (
          <div className="p-3 text-sm text-blue-600 border border-blue-300 rounded-md text-center">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
