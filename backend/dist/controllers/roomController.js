"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomControler = void 0;
const roomService_1 = require("../services/roomService");
class roomControler {
    static async create(req, res) {
        const slug = req.params.slug;
        if (!slug) {
            throw new Error("Invalid room Id");
        }
        try {
            if (!req.user?.userId) {
                throw new Error("Invalid user Id");
            }
            const data = { slug: slug, userId: req.user?.userId };
            const room = await roomService_1.roomServices.create(data);
            res
                .status(200)
                .json({ msg: `Room created sucessfully ${room.id}`, room: room });
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    }
    static async join(req, res) {
        const slug = req.params.slug;
        if (!slug) {
            throw new Error("Invalid room Id");
        }
        try {
            const data = { slug: slug };
            const room = await roomService_1.roomServices.join(data);
            res.status(200).json({
                msg: `Room joined sucessfully ${room.id}`,
                room: { id: room.id, slug: room.slug },
            });
        }
        catch (e) {
            if (e instanceof Error) {
                res.status(400).json({ error: e.message });
            }
            else {
                res.status(400).json({ error: "An unknown error occurred" });
            }
        }
    }
    static async getChats(req, res) {
        try {
            const roomId = req.params.roomId;
            if (!roomId || !isParsableNumber(roomId)) {
                res.status(400).json({ error: "Invalid room Id" });
                return;
            }
            const data = { roomId: parseInt(roomId) };
            const chats = (await roomService_1.roomServices.getChats(data));
            if (chats.msg === "Room not Found") {
                res.status(404).json({ error: "Room not Found" });
                return;
            }
            res.status(200).json(chats.chats);
        }
        catch (e) {
            console.error(e);
        }
    }
    static async delete(req, res) {
        const roomId = req.params.roomId;
        if (!roomId) {
            throw new Error("Invalid RoomId");
        }
        const data = {
            roomId: parseInt(roomId),
            admin: req.user?.userId,
        };
        const response = (await roomService_1.roomServices.delete(data));
        if (response.msg === "Room not found ") {
            res.status(404).json(response);
            return;
        }
        res.status(200).json(response);
    }
}
exports.roomControler = roomControler;
function isParsableNumber(str) {
    return !isNaN(Number(str)) && str.trim() !== "";
}
