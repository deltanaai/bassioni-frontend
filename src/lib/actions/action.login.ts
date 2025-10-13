import { apiFetch } from "@/lib/api";
import { LoginSchema } from "@/schemas/login";
import Cookies from "js-cookie";

export const login = async (data: LoginSchema) => {
  try {
    
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await apiFetch("/company/login", options);

    const { token, data: user } = response;
    Cookies.set("auth_token", token, {
      expires: 7, 
      secure: true,
      sameSite: "strict",
    });

    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
