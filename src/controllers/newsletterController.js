const NewsletterSubscriber = require("../models/newsletterModel.js");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Érvénytelen email cím." });
  }

  try {
    const existing = await NewsletterSubscriber.findOne({ where: { email } });
    if (existing) {
      return res.status(200).json({ message: "Ez az email cím már fel van iratkozva." });
    }

    await NewsletterSubscriber.create({ email });

    return res.status(201).json({ message: "Sikeres feliratkozás." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Szerverhiba történt." });
  }
};
