import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
export declare const validateInput: (schema: ZodSchema, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validateInput.d.ts.map