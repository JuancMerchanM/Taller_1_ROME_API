import Unit from "../models/unit.mjs";

const getUnits = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.faction) filter.faction = req.query.faction;

    const units = await Unit.find(filter).populate("faction", "name culture category");
    res.status(200).json({ success: true, data: units });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid filter value" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).populate(
      "faction",
      "name culture category"
    );
    if (!unit) {
      return res.status(404).json({ success: false, error: "Unit not found" });
    }
    res.status(200).json({ success: true, data: unit });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createUnit = async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    const populated = await unit.populate("faction", "name culture category");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Unit name already exists" });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid reference ID" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("faction", "name culture category");
    if (!unit) {
      return res.status(404).json({ success: false, error: "Unit not found" });
    }
    res.status(200).json({ success: true, data: unit });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Unit name already exists" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({ success: false, error: "Unit not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const bulkCreateUnits = async (req, res) => {
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

    const created = await Unit.insertMany(docs);

    res.status(201).json({
      success: true,
      message: "Units created successfully",
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
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  bulkCreateUnits,
};
