import mongoose from "mongoose";

const FactionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        culture: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },

        category: {
            type: String,
            required: true,
            enum: [
                "ROME",
                "GREEK",
                "BARBARIAN",
                "EASTERN",
                "NORTH_AFRICAN"
            ]
        },

        startingRegion: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
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

export default mongoose.model("Faction", FactionSchema);
