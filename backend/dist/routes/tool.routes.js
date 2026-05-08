"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tool_controller_1 = __importDefault(require("../controllers/tool.controller"));
const middleware_1 = require("../middleware");
const tool_validator_1 = require("../validators/tool.validator");
const router = (0, express_1.Router)();
router.use(middleware_1.authMiddleware);
router.get('/', tool_controller_1.default.getAllTools);
router.get('/:id', tool_controller_1.default.getToolById);
// Admin only routes
router.post('/', (0, middleware_1.roleMiddleware)('ADMIN'), (0, middleware_1.validate)(tool_validator_1.createToolSchema), tool_controller_1.default.createTool);
router.put('/:id', (0, middleware_1.roleMiddleware)('ADMIN'), (0, middleware_1.validate)(tool_validator_1.updateToolSchema), tool_controller_1.default.updateTool);
router.delete('/:id', (0, middleware_1.roleMiddleware)('ADMIN'), tool_controller_1.default.deleteTool);
exports.default = router;
//# sourceMappingURL=tool.routes.js.map