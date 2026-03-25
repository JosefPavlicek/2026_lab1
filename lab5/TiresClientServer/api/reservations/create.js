const { firebaseRequest } = require("../_firebase");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { key, data } = req.body || {};

    if (!key || !data || !data.time || !data.name || !data.car || !data.phone) {
      return res.status(400).json({ error: "Missing required data" });
    }

    await firebaseRequest(`/reservations/${key}`, {
      method: "PUT",
      body: data
    });

    return res.status(200).json({ message: "Reservation created" });
  } catch (error) {
    console.error("Create reservation error:", error);
    return res.status(500).json({ error: error.message });
  }
};