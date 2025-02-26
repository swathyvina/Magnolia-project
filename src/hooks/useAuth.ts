import { useState } from "react";

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ORG_ID = process.env.REACT_APP_ORG_ID;

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      if (!API_BASE_URL) throw new Error("API Base URL is not defined");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          OrgId: ORG_ID || "",
        },
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json(); 

      console.log("Parsed API Response:", res);

      if (!response.ok) {
        throw new Error(res.error || "Invalid email or password"); 
      }

     

      localStorage.setItem("authToken", res.data.LoginResponse.token); 
      localStorage.setItem("orgId", ORG_ID || "");

      return { success: true, token: res.token };
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("orgId");
  };

  return { login, logout, loading, error };
};

