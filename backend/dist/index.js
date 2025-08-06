"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./types/express-augmentations");
const node_cron_1 = __importDefault(require("node-cron"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const wsHandler_1 = require("./wsHandler");
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = require("express-rate-limit");
const axios_1 = __importDefault(require("axios"));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
const rfs = require("rotating-file-stream");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
//logs
const logDir = path_1.default.join(__dirname, "logs");
const logStream = rfs.createStream("requestLogs.log", {
    interval: "1d",
    path: logDir,
});
//cors
const allowedOrigins = [
    "https://excali-sketch-main-excali-sketch.vercel.app",
    "https://excali-sketch-main-excali-sketch.vercel.app",
    "https://excali-sketch-main-exca-git-e48f03-rajesh-kumar-padhis-projects.vercel.app",
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(limiter);
app.use((0, morgan_1.default)("common", { stream: logStream }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({ msg: "hello there" });
});
app.use("/user", userRoutes_1.default);
app.use("/room", roomRoutes_1.default);
const PORT = parseInt(process.env.PORT ?? "5000", 10);
const server = (0, http_1.createServer)(app);
// Initialize the WebSocket logic on the shared HTTP server
(0, wsHandler_1.initWebSocket)(server);
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
node_cron_1.default.schedule("*/14 * * * *", async () => {
    try {
        const res = await axios_1.default.get(`http://localhost:10000`);
        console.log(res.data);
    }
    catch (e) {
        console.error(e);
    }
});
