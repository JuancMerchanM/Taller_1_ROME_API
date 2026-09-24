import mongoose from "mongoose";

const GeneralSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        faction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faction",
            required: true
        },

        level: {
            type: Number,
            min: 1,
            max: 10,
            default: 1
        },

        experience: {
            type: Number,
            min: 0,
            default: 0
        },

        title: {
            type: String,
            trim: true,
            maxlength: 100
        },

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model("General", GeneralSchema);
