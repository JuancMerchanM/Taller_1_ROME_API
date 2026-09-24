import Skill from "../models/skills.mjs";

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate("prerequisite", "name category level");
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      "prerequisite",
      "name category level description"
    );
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }
    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    const populated = await skill.populate("prerequisite", "name category level");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Skill name already exists" });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid reference ID" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("prerequisite", "name category level");
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }
    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Skill name already exists" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const bulkCreateSkills = async (req, res) => {
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

    const created = await Skill.insertMany(docs);

    res.status(201).json({
      success: true,
      message: "Skills created successfully",
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
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  bulkCreateSkills,
};
