import { LoginDTO } from '../dtos/auth.dto';
export interface AuthTokensDTO {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
}
declare class AuthService {
    private issueTokens;
    register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<AuthTokensDTO>;
    login(data: LoginDTO): Promise<AuthTokensDTO>;
    createUser(data: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<AuthTokensDTO>;
    loginWithOAuth(oauthUser: any): Promise<AuthTokensDTO>;
    forgotPassword(email: string): Promise<{
        resetToken: string;
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    refreshAccessToken(rawToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    getAllUsers(): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        oauthProvider: string | null;
    }[]>;
    deactivateUser(id: number): Promise<void>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map