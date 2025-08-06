"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = void 0;
const validateInput = (schema, source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.error.errors[0]?.message,
                errors: result.error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
            return;
        }
        next();
    };
};
exports.validateInput = validateInput;
