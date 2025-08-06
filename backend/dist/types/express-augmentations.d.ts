declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
            };
        }
    }
}
export {};
//# sourceMappingURL=express-augmentations.d.ts.map