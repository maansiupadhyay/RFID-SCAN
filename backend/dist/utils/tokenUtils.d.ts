export interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}
export declare const generateAccessToken: (payload: TokenPayload) => string;
export declare const generateRefreshToken: () => string;
export declare const verifyAccessToken: (token: string) => TokenPayload;
export declare const generateToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=tokenUtils.d.ts.map