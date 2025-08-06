"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createRoomSchema = zod_1.default.object({
    slug: zod_1.default.string().min(1, "Slug is required").max(50),
});
