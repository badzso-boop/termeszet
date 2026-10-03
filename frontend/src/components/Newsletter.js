import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import apiMessage from "../i18n/apiMessage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/newsletter`, { email });
      if (response.status === 201) {
        setEmail("");
      }
      setStatus({ type: "success", messageKey: response.data.message });
    } catch (error) {
      setStatus({ type: "error", messageKey: error.response?.data?.error });
    }
  };

  return (
    <section id="hirlevel" className="bg-secondary py-20 px-4">
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-semibold mb-4">{t("newsletter.title")}</h2>
        <div className="divider-gold mb-6" />
        <p className="text-ink/80 mb-8">
          {t("newsletter.text")}
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
            placeholder={t("newsletter.placeholder")}
            aria-label={t("newsletter.placeholder")}
            className="flex-1 sm:flex-none sm:w-80 px-4 py-2 rounded-md border border-ink/20 focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <button type="submit" className="btn-brand">
            {t("newsletter.submit")}
          </button>
        </form>
        {status && (
          <p className={`mt-4 font-medium ${status.type === "error" ? "text-red-700" : "text-ink"}`}>
            {apiMessage(status.messageKey)}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
