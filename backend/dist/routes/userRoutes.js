"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userController_1 = require("../controllers/userController");
const validateInput_1 = require("../middlewares/validateInput");
const userSchema_1 = require("./../schema/userSchema");
const router = (0, express_1.Router)();
router.post("/signup", (0, validateInput_1.validateInput)(userSchema_1.userSignupSchema), userController_1.UserController.signup);
router.post("/login", (0, validateInput_1.validateInput)(userSchema_1.userLoginSchema), userController_1.UserController.login);
router.get("/rooms", authMiddleware_1.default, userController_1.UserController.getRooms);
exports.default = router;
