const { firebaseRequest } = require("../_firebase");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await firebaseRequest("/reservations", {
      method: "GET"
    });

    return res.status(200).json(data || {});
  } catch (error) {
    console.error("List reservations error:", error);
    return res.status(500).json({ error: error.message });
  }
};