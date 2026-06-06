const API_URL = "http://127.0.0.1:8000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    localStorage.getItem("token");
    console.log("TOKEN:", token);

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        Authorization: token
        ? `Bearer ${token}`
        : "",

        ...(options.headers || {}),
      },
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("token");
  
    window.location.href = "/login";
  
    throw new Error("Unauthorized");
  }
  
  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }

  return response.json();
}