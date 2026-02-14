require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());








async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log ("The database is connected to mongoDB");
    }catch (error){
        console.log("ERROR connecting to MongoDB: ", error.message);
        process.exit(1);

    }
}

connectDB();

const PORT =  process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server is running on port is: ${PORT}`);
});