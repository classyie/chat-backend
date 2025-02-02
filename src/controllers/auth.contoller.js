import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        //hashPassword
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" })
        }
        //Create user in database
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ fullName, email, password: hashedPassword });
        if (newUser) {
            //Generate JWT Token
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                // token: generateToken(newUser._id, res)
                profilePicture: newUser.profilePicture,
            });
        }
        else {
            res.status(400).json({ message: "Invalid User data" })
        }
    } catch (error) {
        console.log("Error in Singin up", error.message);
        res.status(500).json({ error: "Server Error" });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        //Generate JWT Token
        generateToken(user._id, res)
        res.json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture
        });

    } catch (error) {
        console.log("Error in Login", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const logout = (req, res) => {
    // res.send("LogOut ROuter");
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        console.log("Error in Logging Out", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.user._id;
        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true });
        res.status(200).json({updatedUser});
    } catch (error) {
        console.log("Error in Updating Profile", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in Check Auth Compiler", error.message);
        res.status(500).json({ error: "InternalServer Error"});
    }
}