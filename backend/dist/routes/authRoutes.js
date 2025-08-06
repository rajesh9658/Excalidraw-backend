"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.get("/me", authMiddleware_1.default, (req, res) => {
    res.json({ user: req.user });
});
router.post("/logout", (req, res) => {
    res.cookie("token", null, { httpOnly: true, sameSite: "none" });
    res.json({ message: "Logged out successfully" });
});
exports.default = router;
