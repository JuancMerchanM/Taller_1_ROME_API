import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        faction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faction",
            required: true
        },

        difficulty: {
            type: String,
            required: true,
            enum: [
                "EASY",
                "NORMAL",
                "HARD",
                "VERY_HARD",
                "LEGENDARY"
            ]
        },

        currentTurn: {
            type: Number,
            min: 1,
            default: 1
        },

        year: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "COMPLETED",
                "ABANDONED"
            ],
            default: "ACTIVE"
        },

        description: {
            type: String,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Campaign", CampaignSchema);
