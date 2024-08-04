const { Schema, model } = require("mongoose");

const PayloadSchema = new Schema({
    duration: { type: String },
    full_duration: { type: String },
    permalink_url: { type: String },
    playback_count: { type: String },
    release_date: { type: Date },
    'publisher_metadata.artist': { type: String },
    'publisher_metadata.publisher': { type: String },
    'publisher_metadata.image': { type: String },
    'publisher_metadata.cover': { type: String },
    'publisher_metadata.description': { type: String },
    'publisher_metadata.release_title': { type: String },
},
    {
        timestamps: true,
    },
);

module.exports = PayloadModel = model("Payload", PayloadSchema);