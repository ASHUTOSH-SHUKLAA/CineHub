import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    required: true,
    enum: ["movie", "tv"]
  },
  mediaTitle: {
    type: String,
    required: true
  },
  mediaPoster: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only review a specific media once
reviewSchema.index({ user: 1, mediaId: 1, mediaType: 1 }, { unique: true });

// Virtual for review URL
reviewSchema.virtual("url").get(function() {
  return `/reviews/${this._id}`;
});

// Method to get review details
reviewSchema.methods.getReviewDetails = function() {
  return {
    id: this._id,
    user: this.user,
    mediaId: this.mediaId,
    mediaType: this.mediaType,
    mediaTitle: this.mediaTitle,
    mediaPoster: this.mediaPoster,
    content: this.content,
    rating: this.rating,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel; 