export interface User {
  id?: number;
  username: string;
  fullName: string;
  role: string;
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  id?: number;
  username?: string;
  fullName?: string;
  role?: string;
}
