import User from "../models/User.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: 'ok', users });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ message: 'error', cause: error.message });
    }
};
export const userSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existinguser = await User.findOne({ email });
        if (existinguser)
            return res.status(401).send("user already registered");
        const hashpassword = await hash(password, 10);
        const user = new User({ name, email, password: hashpassword });
        await user.save();
        res.clearCookie(COOKIE_NAME, { path: '/', domain: 'localhost', httpOnly: true, signed: true });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: 'localhost', expires, httpOnly: true, signed: true });
        return res.status(201).json({ message: 'ok', name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ message: 'error', cause: error.message });
    }
};
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('user not registered');
        }
        const ispasswordcorrect = await compare(password, user.password);
        if (!ispasswordcorrect) {
            return res.status(403).send("incorrect password");
        }
        res.clearCookie(COOKIE_NAME, { path: '/', domain: 'localhost', httpOnly: true, signed: true });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: 'localhost', expires, httpOnly: true, signed: true });
        return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ message: 'error', cause: error.message });
    }
};
export const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send('user not registered or token malfunctioned');
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send('permissions did not match');
        }
        return res.status(200).json({ message: 'ok', name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ message: 'error', cause: error.message });
    }
};
//# sourceMappingURL=user-controller.js.map