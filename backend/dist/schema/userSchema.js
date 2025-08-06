"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userSignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSignupSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required").max(50),
    email: zod_1.default.string().email("Invalid email format").max(255),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255),
});
exports.userLoginSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required").max(50).optional(),
    email: zod_1.default.string().email("Invalid email format").max(255),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255),
});
