import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: {
      type: String,
      enum: [
        "spam",
        "fraud",
        "duplicate",
        "wrong category",
        "offensive content",
        "other",
      ],
      required: true,
    },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
