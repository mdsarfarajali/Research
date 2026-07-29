/** Supported user roles for role-based access control */
export enum UserRole {
  Admin = 'admin',
  Faculty = 'faculty',
  Student = 'student'
}

/** Base user interface for authentication and profile display */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Registration request payload */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
}

/** JWT authentication response */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

/** Decoded JWT token payload */
export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
