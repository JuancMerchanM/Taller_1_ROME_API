import Army from "../models/army.mjs";
import Campaign from "../models/campaign.mjs";

const getArmies = async (req, res) => {
  try {
    const armies = await Army.find()
      .populate("campaign", "name difficulty status")
      .populate("general", "name level title");
    res.status(200).json({ success: true, data: armies });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getArmy = async (req, res) => {
  try {
    const army = await Army.findById(req.params.id)
      .populate("campaign", "name difficulty status")
      .populate("general", "name level title faction");
    if (!army) {
      return res.status(404).json({ success: false, error: "Army not found" });
    }
    res.status(200).json({ success: true, data: army });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getArmiesByCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, error: "Campaign not found" });
    }

    const armies = await Army.find({ campaign: req.params.campaignId })
      .populate("general", "name level title");
    res.status(200).json({ success: true, data: armies });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createArmy = async (req, res) => {
  try {
    const army = await Army.create(req.body);
    const populated = await army.populate([
      { path: "campaign", select: "name difficulty status" },
      { path: "general", select: "name level title" },
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

const updateArmy = async (req, res) => {
  try {
    const army = await Army.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("campaign", "name difficulty status")
      .populate("general", "name level title");
    if (!army) {
      return res.status(404).json({ success: false, error: "Army not found" });
    }
    res.status(200).json({ success: true, data: army });
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

const deleteArmy = async (req, res) => {
  try {
    const army = await Army.findByIdAndDelete(req.params.id);
    if (!army) {
      return res.status(404).json({ success: false, error: "Army not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { getArmies, getArmy, getArmiesByCampaign, createArmy, updateArmy, deleteArmy };
