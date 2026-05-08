"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const crypto_1 = __importDefault(require("crypto"));
// Short-lived access token (15 min)
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
};
exports.generateAccessToken = generateAccessToken;
// Long-lived refresh token (7 days) - stored in DB
const generateRefreshToken = () => {
    return crypto_1.default.randomBytes(64).toString('hex');
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
// Keep backward compat alias
exports.generateToken = exports.generateAccessToken;
exports.verifyToken = exports.verifyAccessToken;
//# sourceMappingURL=tokenUtils.js.map