export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'OPERATOR';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}
