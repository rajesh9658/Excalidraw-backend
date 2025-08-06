"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class UserService {
    static async signup(data) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                return { success: false, message: "User already exists" };
            }
            const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            const newUser = await prisma.user.create({
                data: { name: data.name, email: data.email, password: hashedPassword },
            });
            return {
                success: true,
                message: "Signup successful",
                data: { id: newUser.id, name: newUser.name, email: newUser.email },
            };
        }
        catch (error) {
            const err = error;
            return { success: false, message: "Signup error", error: err.message };
        }
    }
    static async login(data) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user)
                return {
                    success: false,
                    message: "User does not exists.Sign Up first.",
                };
            const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
            if (!isPasswordValid)
                return { success: false, message: "Invalid email or password" };
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.USER_JWT_SECRET, { expiresIn: "24h" });
            return {
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: { id: user.id, name: user.name, email: user.email },
                },
            };
        }
        catch (error) {
            const err = error;
            return { success: false, message: "Login error", error: err.message };
        }
    }
    static async getRooms(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    rooms: {
                        where: { isDeleted: false },
                        omit: { isDeleted: true, adminId: true },
                    },
                },
            });
            if (!user)
                return { success: false, message: "User not found" };
            return {
                success: true,
                message: "Rooms fetched successfully",
                data: { rooms: user.rooms },
            };
        }
        catch (error) {
            const err = error;
            return {
                success: false,
                message: "Error fetching rooms",
                error: err.message,
            };
        }
    }
}
exports.UserService = UserService;
