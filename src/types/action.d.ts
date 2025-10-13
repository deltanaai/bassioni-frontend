interface AuthCredentialsCo {
  email: string;
  password: string;
  rememberMe?: boolean;
}

type AuthActionResponse = ActionResponse<Session>