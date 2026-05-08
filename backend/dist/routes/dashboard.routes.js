"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.use(middleware_1.authMiddleware);
router.get('/stats', dashboard_controller_1.default.getStats);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map