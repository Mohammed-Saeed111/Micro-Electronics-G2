require('dotenv').config();
const bcrypt = require("bcrypt")

const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("The database is connected to MongoDB");
    } catch (error) {
        console.log("ERROR connecting to MongoDB: ", error.message);
        process.exit(1);
    }
}

connectDB();

// Required Models
const User = require("./models/User");
//post register
app.post("/api/register", async (req, res) => {
    try {
        //get data
        const { username, email, password, role } = req.body;
       // validated data
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Missing Data" });
        }

        const existUser = await User.findOne({email});
        if(existUser) return res.status(400).json({msg: "Account Already Exit"})
        //Create user
    const hashPassword = await  bcrypt.hash(password, 10)

    const  user = await User.create({
        username,
        email,
        password: hashPassword,
        role
    });
        //Respons
        res.status(201).json({
            msg: "Done",
            data: user
        })


    } catch (error) {
        console.log(error);
    

    }
});

//post login
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Missing Data" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Email or Password" });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ msg: "Invalid Email or Password" });
        }
        const authCode = Buffer.from(user._id.toString()).toString("base64");


        res.status(200).json({
            msg: "Login Successful",
            data: authCode
           
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
