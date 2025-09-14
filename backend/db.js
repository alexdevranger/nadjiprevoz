import mongoose from "mongoose";

const connectDB = async (mongodb_uri) => {
  try {
    const conn = await mongoose.connect(mongodb_uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
