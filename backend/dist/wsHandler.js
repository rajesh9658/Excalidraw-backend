"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = void 0;
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN_AUTH_TIMEOUT = 5000;
function checkUser(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.USER_JWT_SECRET);
        return decoded?.userId ?? null;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error(`JWT Error: ${error.message}`); // Log the error message
        }
        else {
            console.error("JWT verification failed:", error);
        }
        return null;
    }
}
function getToken(url) {
    try {
        const queryParams = new URLSearchParams(url.split("?")[1]);
        return queryParams.get("token") ?? undefined;
    }
    catch (error) {
        console.error("Failed to parse token from URL:", error);
        return undefined;
    }
}
function joinRoom(socket, userId, roomId) {
    try {
        const existingUsers = roomMap.get(roomId) || [];
        if (existingUsers.some((user) => user.userId === userId && user.socket === socket)) {
            socket.send(JSON.stringify({ msg: `You are already in room ${roomId}` }));
            return false;
        }
        // Join the room
        const roomUsers = roomMap.get(roomId) || [];
        roomUsers.push({ userId, socket });
        roomMap.set(roomId, roomUsers);
        // Update the user map
        const userSockets = userMap.get(userId) || new Set();
        userSockets.add(socket); // Add the current socket to the user's set
        userMap.set(userId, userSockets);
        socket.send(JSON.stringify({ msg: `Joined room ${roomId} successfully.` }));
        return true;
    }
    catch (error) {
        console.error("Error in joinRoom:", error);
        socket.send(JSON.stringify({ msg: "Error while joining room." }));
        return false;
    }
}
function leaveRoom(socket, userId, roomId) {
    try {
        const roomUsers = roomMap.get(roomId) || [];
        const updatedRoomUsers = roomUsers.filter((user) => user.socket !== socket);
        if (updatedRoomUsers.length === roomUsers.length) {
            socket.send(JSON.stringify({ msg: `You are not in room ${roomId}` }));
            return false;
        }
        roomMap.set(roomId, updatedRoomUsers);
        // Update the user map
        const userSockets = userMap.get(userId);
        if (userSockets) {
            userSockets.delete(socket);
            if (userSockets.size === 0) {
                userMap.delete(userId);
            }
            else {
                userMap.set(userId, userSockets);
            }
        }
        socket.send(JSON.stringify({ msg: `Left room ${roomId} successfully.` }));
        return true;
    }
    catch (error) {
        console.error("Error in leaveRoom:", error);
        socket.send(JSON.stringify({ msg: "Error while leaving room." }));
        return false;
    }
}
async function sendMessageToRoom(roomId, userId, message, socket) {
    try {
        const roomUsers = roomMap.get(roomId);
        roomUsers?.forEach((user) => {
            if (user.socket != socket) {
                const data = { message: message };
                user.socket.send(JSON.stringify(data));
            }
        });
    }
    catch (error) {
        console.error("Error in sendMessageToRoom:", error);
    }
}
async function sendStateToDB(roomId, message) {
    try {
        const roomstate = [];
        const data = JSON.parse(message);
        data.forEach((s) => {
            roomstate.push(JSON.stringify(s));
        });
        const res = await prisma.roomState.upsert({
            where: { roomId: roomId },
            create: { shapes: roomstate, roomId: roomId },
            update: { shapes: roomstate },
        });
    }
    catch (e) {
        console.error(e);
    }
}
// Map for rooms to their users (roomId -> [{email, socket}, ...])
const roomMap = new Map();
// Map for users to the sockets they are connected from (email -> Set<WebSocket>)
const userMap = new Map();
const initWebSocket = (server) => {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (socket, req) => {
        let isAuthenticated = false;
        let userId = null;
        let currentRoomId = null;
        const authTimeout = setTimeout(() => {
            if (!isAuthenticated) {
                socket.send(JSON.stringify({ error: "Authentication timeout" }));
                socket.close();
            }
        }, TOKEN_AUTH_TIMEOUT);
        socket.once("message", (message) => {
            try {
                const authData = JSON.parse(message.toString());
                if (authData.type !== "auth" || !authData.token) {
                    socket.send(JSON.stringify({ error: "Invalid authentication message" }));
                    return socket.close();
                }
                const userId = checkUser(authData.token);
                if (!userId) {
                    socket.send(JSON.stringify({ error: "Invalid or expired token" }));
                    return socket.close();
                }
                isAuthenticated = true;
                clearTimeout(authTimeout);
                socket.send(JSON.stringify({ msg: "Authenticated successfully", userId }));
                socket.on("message", (msg) => {
                    try {
                        const data = JSON.parse(msg.toString());
                        if (data.type === "join_room" && data.roomId) {
                            const success = joinRoom(socket, userId, data.roomId);
                            if (success) {
                                currentRoomId = data.roomId;
                            }
                        }
                        else if (data.type === "leave_room") {
                            if (currentRoomId !== null) {
                                leaveRoom(socket, userId, currentRoomId);
                                currentRoomId = null; // Reset current room
                            }
                            else {
                                socket.send(JSON.stringify({ msg: "You are not in any room." }));
                            }
                        }
                        else if (data.type === "message") {
                            if (currentRoomId === null ||
                                !userMap.get(userId)?.has(socket)) {
                                socket.send(JSON.stringify({ msg: "Room not joined." }));
                                return;
                            }
                            sendMessageToRoom(currentRoomId, userId, data.message || "", socket);
                            if (data.db === true) {
                                sendStateToDB(currentRoomId, data.message || "");
                            }
                        }
                        else {
                            socket.send(JSON.stringify({ msg: "Invalid message type." }));
                        }
                    }
                    catch (error) {
                        console.error("Error while parsing message:", error);
                        socket.send(JSON.stringify({ msg: "Error while processing the message." }));
                    }
                });
            }
            catch (error) {
                console.error("Error processing authentication message:", error);
                socket.send(JSON.stringify({ error: "Error processing authentication" }));
                return socket.close();
            }
        });
        socket.on("close", () => {
            try {
                if (currentRoomId !== null && userId != null) {
                    leaveRoom(socket, userId, currentRoomId);
                }
            }
            catch (error) {
                console.error("Error during socket close:", error);
            }
        });
        socket.on("error", (err) => {
            console.error("Socket error:", err);
            try {
                if (currentRoomId !== null && userId != null) {
                    leaveRoom(socket, userId, currentRoomId);
                }
            }
            catch (error) {
                console.error("Error during socket error handling:", error);
            }
        });
    });
    const shutdown = () => {
        console.log("Shutting down WebSocket server...");
        wss.close(() => {
            console.log("WebSocket server closed");
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
};
exports.initWebSocket = initWebSocket;
