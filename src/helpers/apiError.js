// Hiba i18n-kulccsal (lásd frontend/src/i18n/locales/*/api.json). Middleware-ekből
// (pl. multer fileFilter) dobható; az app.js hibakezelője a `messageKey`-t küldi vissza
// `{ error: <kulcs> }` formában, ugyanúgy, mint a controllerek.
function apiError(messageKey, status = 400) {
  const err = new Error(messageKey);
  err.messageKey = messageKey;
  err.status = status;
  return err;
}

module.exports = apiError;
