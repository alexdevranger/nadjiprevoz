import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hasCompany: false,
    company: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          hasCompany: form.hasCompany,
          company: form.hasCompany ? form.company : "",
          roles: ["customer"], // ili dodaj opciju za odabir u budućnosti
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Registration error:", data);
        setError(data.error || "Nešto nije u redu");
      } else {
        console.log("Uspešno registrovan");
        setMessage("Uspešno registrovan! Preusmeravamo na login...");
        setTimeout(() => {
          console.log("Preusmeravamo na login...");
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen mx-auto p-4 rounded pt-36 mainBgIMG">
      {/* <h2 className="text-xl font-bold mb-4">Registracija</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {message && <div className="text-green-600 mb-2">{message}</div>} */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Register
        </h2>

        {/* Ako imaš error state, možeš vratiti ovu sekciju i prilagoditi ime promenljive */}
        {/* {error && (
    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
      {error}
    </div>
  )} */}

        {message && (
          <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              name="hasCompany"
              checked={form.hasCompany}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Imam firmu</span>
          </label>

          {form.hasCompany && (
            <div className="transition-all duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company name
              </label>
              <input
                type="text"
                name="company"
                placeholder="Company name"
                value={form.company}
                onChange={handleChange}
                required={form.hasCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}
