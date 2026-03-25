const { firebaseRequest } = require("../_firebase");

module.exports = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { key } = req.body || {};

    if (!key) {
      return res.status(400).json({ error: "Missing key" });
    }

    await firebaseRequest(`/reservations/${key}`, {
      method: "DELETE"
    });

    return res.status(200).json({ message: "Reservation deleted" });
  } catch (error) {
    console.error("Delete reservation error:", error);
    return res.status(500).json({ error: error.message });
  }
};