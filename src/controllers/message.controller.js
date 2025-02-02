import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";
export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserID = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserID } }).select("-password");
        res.status(200).json({ users: filteredUsers });
    } catch (error) {
        Console.log("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myID = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myID, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myID },
            ],
        })
        res.status(200).json( messages);
    } catch (error) {
        console.log("Error in getMessages Contoller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl = "";
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        //todo: section for Socket.io
        res.status(201).json( newMessage );
    }
    catch (error) {
        console.log("Error in sendMessage Contoller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}