import mongoose from "mongoose";

const StrategySchema = new mongoose.Schema(
  {
      title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 150
      },

      author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
      },

      campaign: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Campaign"
      },

      faction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Faction",
          required: true
      },

      difficulty: {
          type: String,
          enum: [
              "BEGINNER",
              "INTERMEDIATE",
              "ADVANCED"
          ]
      },

      tags: [
          {
              type: String,
              trim: true,
              maxlength: 30
          }
      ],

      content: {
          type: String,
          required: true,
          minlength: 20,
          maxlength: 5000
      },

      recommendedUnits: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Unit"
          }
      ]
  },
  {
      timestamps: true
  }
);

export default mongoose.model("Strategy", StrategySchema);
