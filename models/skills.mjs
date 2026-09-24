import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
      name: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          minlength: 3,
          maxlength: 100
      },

      category: {
          type: String,
          required: true,
          enum: [
              "COMMAND",
              "AUTHORITY",
              "STRATEGY",
              "LOGISTICS"
          ]
      },

      level: {
          type: Number,
          required: true,
          min: 1,
          max: 5
      },

      description: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 500
      },

      effects: {
          morale: {
              type: Number,
              default: 0
          },

          meleeAttack: {
              type: Number,
              default: 0
          },

          meleeDefense: {
              type: Number,
              default: 0
          },

          movement: {
              type: Number,
              default: 0
          }
      },

      prerequisite: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          default: null
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("Skill", SkillSchema);
