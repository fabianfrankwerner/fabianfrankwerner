const index = async (req, res) => {
  try {
    res.json({ message: "Hello, World!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { index };
