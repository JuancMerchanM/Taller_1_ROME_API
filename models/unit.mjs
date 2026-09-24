import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        faction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faction",
            required: true
        },

        type: {
            type: String,
            required: true,
            enum: [
                "INFANTRY",
                "SPEARMEN",
                "CAVALRY",
                "MISSILE",
                "ARTILLERY",
                "ELEPHANT"
            ]
        },

        attack: {
            type: Number,
            required: true,
            min: 0
        },

        defense: {
            type: Number,
            required: true,
            min: 0
        },

        armor: {
            type: Number,
            required: true,
            min: 0
        },

        morale: {
            type: Number,
            required: true,
            min: 0
        },

        recruitmentCost: {
            type: Number,
            required: true,
            min: 0
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

export default mongoose.model("Unit", UnitSchema);
