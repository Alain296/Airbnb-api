import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {}
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("Validation errors:", JSON.stringify(error.errors, null, 2));
        const errors = error.errors?.map((err) => ({
          path: err.path?.join(".") || "unknown",
          message: err.message || "Validation error",
          received: err.received
        })) || [];
        res.status(400).json({
          message: "Validation failed",
          errors
        });
        return;
      }
      console.error("Validation middleware error:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
};
