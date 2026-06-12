import { apiFetch } from "./api";

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(
    "http://127.0.0.1:8000/login",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (!data.access_token) {
    throw new Error(
      "Login failed"
    );
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
  const response = await fetch(
    "http://127.0.0.1:8000/signup",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );

  const data =
    await response.json();

  return data;
}

export async function getMe() {
  return apiFetch("/me");
}