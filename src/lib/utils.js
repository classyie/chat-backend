import jwt from "jsonwebtoken";
export const generateToken = (userId, res)=>{

    // Generate a JWT token here
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set the token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true,
        sameSite: "strict", //
        secure: process.env.NODE_ENV !== "development", // Only set cookies over HTTPS in production
    });
    return token;
}