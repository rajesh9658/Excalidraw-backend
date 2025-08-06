"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class roomServices {
    static async create(data) {
        const room = await prisma.room.create({
            data: {
                slug: data.slug,
                adminId: data.userId,
            },
        });
        return room;
    }
    static async join(data) {
        const room = await prisma.room.findUnique({ where: { slug: data.slug } });
        if (!room) {
            throw new Error("Room not found");
        }
        return room;
    }
    static async getChats(data) {
        const roomDetails = await prisma.room.findFirst({
            where: { id: data.roomId },
        });
        if (!roomDetails) {
            return { msg: "Room not Found" };
        }
        const chats = await prisma.roomState.findFirst({
            where: { roomId: data.roomId },
        });
        return { chats: chats?.shapes, msg: "Shapes found" };
    }
    static async delete(data) {
        try {
            const roomData = await prisma.room.findFirst({
                where: { id: data.roomId },
            });
            if (!roomData) {
                throw new Error("Room not found");
            }
            const res = await prisma.room.update({
                where: {
                    id: roomData.id,
                    adminId: roomData.adminId,
                },
                data: {
                    isDeleted: true,
                },
            });
            if (!res) {
                throw new Error("Room not found");
            }
            return res;
        }
        catch (error) {
            if (error.code === "P2025") {
                return { msg: "Room not found " };
            }
            throw error;
        }
    }
}
exports.roomServices = roomServices;
