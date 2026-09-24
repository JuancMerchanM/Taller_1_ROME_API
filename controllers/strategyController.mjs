import Strategy from "../models/strategy.mjs";

const getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find()
      .populate("author", "username")
      .populate("faction", "name culture category")
      .populate("campaign", "name difficulty")
      .populate("recommendedUnits", "name type");
    res.status(200).json({ success: true, data: strategies });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id)
      .populate("author", "username")
      .populate("faction", "name culture category")
      .populate("campaign", "name difficulty")
      .populate("recommendedUnits", "name type attack defense");
    if (!strategy) {
      return res.status(404).json({ success: false, error: "Strategy not found" });
    }
    res.status(200).json({ success: true, data: strategy });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createStrategy = async (req, res) => {
  try {
    const strategyData = {
      title: req.body.title,
      faction: req.body.faction,
      content: req.body.content,
      difficulty: req.body.difficulty,
      tags: req.body.tags,
      recommendedUnits: req.body.recommendedUnits,
      campaign: req.body.campaign,
      author: req.user.userId,
    };

    const strategy = await Strategy.create(strategyData);
    const populated = await strategy.populate([
      { path: "author", select: "username" },
      { path: "faction", select: "name culture category" },
      { path: "recommendedUnits", select: "name type" },
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

const updateStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);
    if (!strategy) {
      return res.status(404).json({ success: false, error: "Strategy not found" });
    }

    if (strategy.author.toString() !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this strategy",
      });
    }

    const updated = await Strategy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("author", "username")
      .populate("faction", "name culture category")
      .populate("recommendedUnits", "name type");

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

const deleteStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id);
    if (!strategy) {
      return res.status(404).json({ success: false, error: "Strategy not found" });
    }

    if (strategy.author.toString() !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this strategy",
      });
    }

    await Strategy.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { getStrategies, getStrategy, createStrategy, updateStrategy, deleteStrategy };
