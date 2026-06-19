import { apiFetch } from "./api";

export async function login(
  email: string,
  password: string
) {
  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!data.access_token) {
    throw new Error("Login failed");
  }

  localStorage.setItem(
    "token",
    data.access_token
  );

  return data;
}

export async function signup(
  username: string,
  email: string,
  password: string
) {
  return apiFetch("/signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export async function getMe() {
  return apiFetch("/me");
}