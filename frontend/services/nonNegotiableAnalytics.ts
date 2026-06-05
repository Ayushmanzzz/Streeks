import { apiFetch } from "./api";

export async function getLogs(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/logs`
  );
}

export async function getStreak(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/streak`
  );
}

export async function getLongestStreak(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/longest-streak`
  );
}

export async function getCompletionRate(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/completion-rate`
  );
}

export async function getSummary(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/summary`
  );
}

export async function getHeatmap(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/heatmap`
  );
}