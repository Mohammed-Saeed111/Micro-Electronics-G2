const bcrypt = require('bcrypt');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Missing Data" });
        }

        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ msg: "Account Already Exit" });

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashPassword, role });

        res.status(201).json({ msg: "Done", data: user });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const login = async (req, res) => {
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

        res.status(200).json({ msg: "Login Successful", data: authCode });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports =  {
    register,

    login

}
