const { fal } = require("@fal-ai/client");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { request_id } = req.query;
    if (!request_id) {
      return res.status(400).json({ error: "request_id is required" });
    }

    const result = await fal.queue.result("fashn/tryon", {
      requestId: request_id,
    });

    return res.status(200).json({ images: result.data.images });
  } catch (error) {
    if (error.message.includes("not_found")) {
      return res.status(202).json({ status: "processing" });
    }
    console.error("API Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch result",
    });
  }
};
