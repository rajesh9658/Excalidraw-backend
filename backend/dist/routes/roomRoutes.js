"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const roomController_1 = require("../controllers/roomController");
const roomSchema_1 = require("./../schema/roomSchema");
const validateInput_1 = require("../middlewares/validateInput");
const router = (0, express_1.Router)();
router.post("/create/:slug", (0, validateInput_1.validateInput)(roomSchema_1.createRoomSchema, "params"), authMiddleware_1.default, roomController_1.roomControler.create);
router.post("/join/:slug", authMiddleware_1.default, roomController_1.roomControler.join);
router.get("/:roomId", authMiddleware_1.default, roomController_1.roomControler.getChats);
router.delete("/:roomId", authMiddleware_1.default, roomController_1.roomControler.delete);
exports.default = router;
