import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaType: {
    type: String,
    enum: ["movie", "tv"],
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaTitle: {
    type: String,
    required: true
  },
  mediaPoster: {
    type: String,
    required: true
  },
  mediaRate: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can't favorite the same media twice
favoriteSchema.index({ user: 1, mediaId: 1, mediaType: 1 }, { unique: true });

const favoriteModel = mongoose.model("Favorite", favoriteSchema);

export default favoriteModel; 