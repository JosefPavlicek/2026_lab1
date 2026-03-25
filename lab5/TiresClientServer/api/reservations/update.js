const { firebaseRequest } = require("../_firebase");

module.exports = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { key, data } = req.body || {};

    if (!key || !data) {
      return res.status(400).json({ error: "Missing key or data" });
    }

    await firebaseRequest(`/reservations/${key}`, {
      method: "PATCH",
      body: data
    });

    return res.status(200).json({ message: "Reservation updated" });
  } catch (error) {
    console.error("Update reservation error:", error);
    return res.status(500).json({ error: error.message });
  }
};