"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ error: "Access denied ,No token provided." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.USER_JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ error: "Access denied, Invalid jwt token." });
        }
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};
exports.default = authMiddleware;
