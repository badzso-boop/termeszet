import i18n from "./index";

// A backend `{ message }` / `{ error }` mezőben i18n-kulcsot küld (lásd locales/*/api.json).
// apiMessage(error.response?.data?.error) -> lefordított szöveg; ismeretlen vagy hiányzó
// kulcsnál az általános hibaüzenet.
const apiMessage = (key, fallbackKey = "generic.error") =>
  i18n.t(key || fallbackKey, { ns: "api", defaultValue: i18n.t(fallbackKey, { ns: "api" }) });

export default apiMessage;
