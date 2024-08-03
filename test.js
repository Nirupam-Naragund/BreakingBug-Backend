const mongoose = require('mongoose');
const dotenv = require("dotenv")

dotenv.config();

const connectDB=async ()=>{
    try {
        const uri = process.env.MONGO_URL
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}


module.exports = connectDB;