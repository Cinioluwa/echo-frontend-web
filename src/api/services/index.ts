/**
 * API Services Index
 * Central export point for all API services
 */

export { default as authService } from "./auth.service";
export { default as userService } from "./user.service";
export { default as waveService } from "./wave.service";
export { default as pingService } from "./ping.service";
export { default as commentService } from "./comment.service";
export { default as surgeService } from "./surge.service";
export { default as publicService } from "./public.service";
export { default as categoryService } from "./category.service";

// Re-export types for convenience
export type * from "../types/index";
