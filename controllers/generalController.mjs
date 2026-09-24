import General from "../models/general.mjs";

const getGenerals = async (req, res) => {
  try {
    const generals = await General.find()
      .populate("faction", "name culture category")
      .populate("skills", "name category level");
    res.status(200).json({ success: true, data: generals });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getGeneral = async (req, res) => {
  try {
    const general = await General.findById(req.params.id)
      .populate("faction", "name culture category")
      .populate("skills", "name category level description effects");
    if (!general) {
      return res.status(404).json({ success: false, error: "General not found" });
    }
    res.status(200).json({ success: true, data: general });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createGeneral = async (req, res) => {
  try {
    const general = await General.create(req.body);
    const populated = await general.populate([
      { path: "faction", select: "name culture category" },
      { path: "skills", select: "name category level" },
    ]);
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid reference ID" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const updateGeneral = async (req, res) => {
  try {
    const general = await General.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("faction", "name culture category")
      .populate("skills", "name category level");
    if (!general) {
      return res.status(404).json({ success: false, error: "General not found" });
    }
    res.status(200).json({ success: true, data: general });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const deleteGeneral = async (req, res) => {
  try {
    const general = await General.findByIdAndDelete(req.params.id);
    if (!general) {
      return res.status(404).json({ success: false, error: "General not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { getGenerals, getGeneral, createGeneral, updateGeneral, deleteGeneral };
