"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scan_controller_1 = __importDefault(require("../controllers/scan.controller"));
const middleware_1 = require("../middleware");
const scan_validator_1 = require("../validators/scan.validator");
const router = (0, express_1.Router)();
router.use(middleware_1.authMiddleware);
router.post('/scan', (0, middleware_1.validate)(scan_validator_1.scanSchema), scan_controller_1.default.performScan);
router.get('/history', scan_controller_1.default.getScanHistory);
exports.default = router;
//# sourceMappingURL=scan.routes.js.map