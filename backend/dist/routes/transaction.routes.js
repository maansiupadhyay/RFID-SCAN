"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const middleware_1 = require("../middleware");
const transaction_validator_1 = require("../validators/transaction.validator");
const router = (0, express_1.Router)();
router.use(middleware_1.authMiddleware);
router.post('/issue', (0, middleware_1.validate)(transaction_validator_1.issueToolSchema), transaction_controller_1.default.issueTool);
router.post('/return', (0, middleware_1.validate)(transaction_validator_1.returnToolSchema), transaction_controller_1.default.returnTool);
router.get('/history', transaction_controller_1.default.getTransactionHistory);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map