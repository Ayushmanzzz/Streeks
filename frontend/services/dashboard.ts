import { apiFetch } from "./api";

export async function getDashboard() {
  return apiFetch("/dashboard");
}

export async function getDailyWin() {
  return apiFetch("/daily-win");
}

export async function getDailyWinStreak() {
  return apiFetch(
    "/daily-win-streak"
  );
}

export async function getWeeklySummary() {
  return apiFetch(
    "/weekly-summary"
  );
}