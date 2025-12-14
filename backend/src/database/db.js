// import mongoose from "mongoose";

// export const connectDB = async (mongoUri) => {
//   if (!mongoUri) {
//     throw new Error("MONGO_URI is required");
//   }

//   await mongoose.connect(mongoUri);
// };

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("Missing MongoDB connection string. Set MONGO_URI in .env");
        }

        await mongoose.connect(mongoUri);
        console.log(`MongoDB connected!`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;