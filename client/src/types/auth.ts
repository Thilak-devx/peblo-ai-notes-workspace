export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  status: "success" | "ok";
  message?: string;
  user: AuthUser;
  token?: string;
};

export type AuthStatusResponse = {
  status: "success" | "ok";
  message?: string;
};
