const { fal } = require("@fal-ai/client");
const multer = require("multer");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware to parse multipart form data
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    await runMiddleware(
      req,
      res,
      upload.fields([
        { name: "modelImage", maxCount: 1 },
        { name: "garmentImage", maxCount: 1 },
      ])
    );

    const modelImageUrl = req.body.modelImageUrl;
    const garmentImageUrl = req.body.garmentImageUrl;
    const category = req.body.category;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const input = {
      category: category,
      garment_photo_type: "auto",
      num_samples: 1,
    };

    // Handle model image
    if (req.files?.modelImage) {
      const modelFile = req.files.modelImage[0];
      const modelBase64 = `data:${
        modelFile.mimetype
      };base64,${modelFile.buffer.toString("base64")}`;
      input.model_image = modelBase64;
    } else if (modelImageUrl) {
      input.model_image = modelImageUrl;
    } else {
      return res.status(400).json({ error: "No model image provided" });
    }

    // Handle garment image
    if (req.files?.garmentImage) {
      const garmentFile = req.files.garmentImage[0];
      const garmentBase64 = `data:${
        garmentFile.mimetype
      };base64,${garmentFile.buffer.toString("base64")}`;
      input.garment_image = garmentBase64;
    } else if (garmentImageUrl) {
      input.garment_image = garmentImageUrl;
    } else {
      return res.status(400).json({ error: "No garment image provided" });
    }

    // Submit the request to FAL API
    const { request_id } = await fal.queue.submit("fashn/tryon", {
      input: input,
    });

    // Return the request ID immediately
    return res.status(200).json({ request_id });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process request",
    });
  }
};
