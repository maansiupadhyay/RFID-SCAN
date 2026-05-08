export declare class RefreshTokenRepository {
    create(userId: number, token: string, expiresAt: Date): Promise<{
        id: number;
        userId: number;
        token: string;
        expiresAt: Date;
    }>;
    findByToken(token: string): Promise<{
        id: number;
        token: string;
        userId: number;
        expiresAt: Date;
        createdAt: Date;
        user: {
            id: number;
            name: string;
            email: string;
            password: string | null;
            role: string;
            isActive: boolean;
            oauthProvider: string | null;
            oauthId: string | null;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } | null>;
    deleteByToken(token: string): Promise<void>;
    deleteAllForUser(userId: number): Promise<void>;
    deleteExpired(): Promise<void>;
}
declare const _default: RefreshTokenRepository;
export default _default;
//# sourceMappingURL=refreshToken.repository.d.ts.map