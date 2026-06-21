import { USER_ROLE } from "../enum/enum";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: USER_ROLE;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  role?: USER_ROLE;
}

export interface User extends SignupPayload {
  id: string;
  created_at: string;
}

export interface AuthState {
  isLoading: boolean;
  isError: string | null;
  isAuthenticate: boolean;
  user: User | null;
  role: USER_ROLE | null;
  signupUser: (payload: SignupPayload) => Promise<any>;
  loginUser: (payload: LoginPayload) => Promise<any>;
  logout: () => Promise<any>;
}
