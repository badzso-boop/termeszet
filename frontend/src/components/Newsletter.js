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
    <section id="hirlevel" className="bg-secondary py-20 px-4">
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-semibold mb-4">Iratkozz fel a hírlevélre!</h2>
        <div className="divider-gold mb-6" />
        <p className="text-ink/80 mb-8">
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
            className="flex-1 sm:flex-none sm:w-80 px-4 py-2 rounded-md border border-ink/20 focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button type="submit" className="btn-brand">
            Feliratkozom
          </button>
        </form>
        {status && (
          <p className={`mt-4 font-medium ${status.type === "error" ? "text-red-700" : "text-ink"}`}>
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
