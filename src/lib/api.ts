import { API_URL } from "@/constants";
import { fetchHandler } from "./handlers/fetch";

// API_URL in development is http://127.0.0.1:8000/api/
export const api = {
  company: {
    auth: {
      login: (credentials: AuthCredentialsCo) =>
        fetchHandler(`${API_URL}company/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
        }),
    },
  },
};
