import Faction from "../models/faction.mjs";

const getFactions = async (req, res) => {
  try {
    const factions = await Faction.find();
    res.status(200).json({ success: true, data: factions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getFaction = async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.id);
    if (!faction) {
      return res.status(404).json({ success: false, error: "Faction not found" });
    }
    res.status(200).json({ success: true, data: faction });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createFaction = async (req, res) => {
  try {
    const faction = await Faction.create(req.body);
    res.status(201).json({ success: true, data: faction });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Faction name already exists" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const updateFaction = async (req, res) => {
  try {
    const faction = await Faction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faction) {
      return res.status(404).json({ success: false, error: "Faction not found" });
    }
    res.status(200).json({ success: true, data: faction });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Faction name already exists" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const deleteFaction = async (req, res) => {
  try {
    const faction = await Faction.findByIdAndDelete(req.params.id);
    if (!faction) {
      return res.status(404).json({ success: false, error: "Faction not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const bulkCreateFactions = async (req, res) => {
  try {
    const docs = req.body;

    if (!Array.isArray(docs)) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a JSON array",
      });
    }

    if (docs.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Array must not be empty",
      });
    }

    const created = await Faction.insertMany(docs);

    res.status(201).json({
      success: true,
      message: "Factions created successfully",
      count: created.length,
      data: created,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid reference ID" });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate value detected",
        note: "No documents were inserted",
      });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export {
  getFactions,
  getFaction,
  createFaction,
  updateFaction,
  deleteFaction,
  bulkCreateFactions,
};
