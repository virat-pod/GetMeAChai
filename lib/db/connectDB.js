import mongoose from "mongoose";

let isConnected;

const connectDB = async ()=> {
    if (isConnected) return
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        isConnected = true;
    } catch (err) {
        alert(err)
    }
}

export default connectDB