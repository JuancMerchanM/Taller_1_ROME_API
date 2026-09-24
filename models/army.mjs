import mongoose from "mongoose";

const ArmySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true
        },

        general: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "General",
            required: true
        },

        region: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        movementPoints: {
            type: Number,
            min: 0,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "DESTROYED",
                "DISBANDED"
            ],
            default: "ACTIVE"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Army", ArmySchema);
