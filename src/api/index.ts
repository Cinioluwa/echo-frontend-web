/**
 * Echo API Services
 * Centralized export for all API services
 */

// Services
export { default as authService } from "./services/auth.service";
export { default as userService } from "./services/user.service";
export { default as pingService } from "./services/ping.service";
export { default as waveService } from "./services/wave.service";
export { default as commentService } from "./services/comment.service";
export { default as surgeService } from "./services/surge.service";
export { default as categoryService } from "./services/category.service";
export { default as announcementService } from "./services/announcement.service";
export { default as publicService } from "./services/public.service";
export { default as adminService } from "./services/admin.service";
export { default as analyticsService } from "./services/analytics.service";
export { default as representativeService } from "./services/representative.service";
export { default as healthService } from "./services/health.service";

// Types
export * from "./types/index";
export * from "./types/admin.types";

// Axios config
export { default as api } from "./axios.config";
