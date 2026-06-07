export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: "CREATOR" | "EVENTEE";
}

export interface LoginDTO {
  email: string;
  password: string;
}