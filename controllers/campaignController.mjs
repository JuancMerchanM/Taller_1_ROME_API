import Campaign from "../models/campaign.mjs";

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("user", "username email")
      .populate("faction", "name culture category");
    res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("user", "username email")
      .populate("faction", "name culture category");
    if (!campaign) {
      return res.status(404).json({ success: false, error: "Campaign not found" });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaignData = {
      name: req.body.name,
      faction: req.body.faction,
      difficulty: req.body.difficulty,
      year: req.body.year,
      description: req.body.description,
      user: req.user.userId,
    };

    const campaign = await Campaign.create(campaignData);
    const populated = await campaign.populate([
      { path: "user", select: "username email" },
      { path: "faction", select: "name culture category" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: "Campaign not found" });
    }

    if (campaign.user.toString() !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this campaign",
      });
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "username email")
      .populate("faction", "name culture category");

    res.status(200).json({ success: true, data: updated });
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

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: "Campaign not found" });
    }

    if (campaign.user.toString() !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this campaign",
      });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { getCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign };
