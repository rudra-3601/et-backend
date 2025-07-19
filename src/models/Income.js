import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  incomeName: {
    type: String,
    required: true,
  },
  incomeAmount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Income", incomeSchema);
