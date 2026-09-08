import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/newsletter`, { email });
      if (response.status === 201) {
        setStatus({ type: "success", message: "Köszönjük a feliratkozást!" });
        setEmail("");
      } else {
        setStatus({ type: "success", message: response.data.message });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setStatus({ type: "error", message: "Érvénytelen email cím." });
      } else {
        setStatus({ type: "error", message: "Hiba történt, próbáld újra." });
      }
    }
  };

  return (
    <section id="hirlevel" className="bg-secondary py-16 px-4">
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-semibold mb-4">Iratkozz fel a hírlevélre!</h2>
        <p className="text-gray-800 mb-6">
          Legyél az elsők között, aki értesül az új kurzusokról és időpontokról.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email címed"
            className="flex-1 sm:flex-none sm:w-80 px-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-primary font-semibold hover:opacity-90 transition"
          >
            Feliratkozom
          </button>
        </form>
        {status && (
          <p className={`mt-4 font-medium ${status.type === "error" ? "text-red-700" : "text-green-800"}`}>
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
