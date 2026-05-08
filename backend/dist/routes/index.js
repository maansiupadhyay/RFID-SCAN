"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const tool_routes_1 = __importDefault(require("./tool.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const scan_routes_1 = __importDefault(require("./scan.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/tools', tool_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/scans', scan_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map