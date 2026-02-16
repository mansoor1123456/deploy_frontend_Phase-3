import { setAuthToken } from "./auth-utils";
import { apiClient } from "./api-client";

interface UserCredentials {
  email: string;
  password: string;
}

interface UserRegistration {
  email: string;
  password: string;
  name: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  async register(userData: UserRegistration): Promise<any> {
    return await apiClient.post("/auth/register", userData);
  },

  async login(credentials: UserCredentials): Promise<LoginResponse> {
    const response: any = await apiClient.post("/auth/login", credentials);

    if (response && response.access_token) {
      setAuthToken(response.access_token);
    }

    return response as LoginResponse;
  },

  async logout(): Promise<any> {
    return await apiClient.post("/auth/logout");
  },
};
