import mongoose,{Schema} from "mongoose";

const transactionSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  type: {
    type: String,
    enum: ["INCREASE", "DECREASE"],
    required: true
  },
  quantity: { 
    type: Number, 
    required: true 
},
  timestamp: { 
    type: Date, 
    default: Date.now 
}
});

export const Transaction= mongoose.model("Transaction", transactionSchema);