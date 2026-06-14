import { apiFetch } from "./api";

export async function getNonNegotiables() {
  return apiFetch(
    "/non-negotiables"
  );
}

export async function createNonNegotiable(
  data: {
    title: string;
    description: string;
    target_value: number;
    unit: string;
  }
) {
  return apiFetch(
    "/non-negotiables",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function archiveNonNegotiable(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/archive`,
    {
      method: "PATCH",
    }
  );
}

export async function restoreNonNegotiable(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/restore`,
    {
      method: "PATCH",
    }
  );
}

export async function getArchivedNonNegotiables() {
  return apiFetch(
    "/non-negotiables/archived"
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

export async function getLogs(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/logs`
  );
}

export async function getHeatmap(
  id: number
) {
  return apiFetch(
    `/non-negotiables/${id}/heatmap`
  );
}

export async function updateNonNegotiable(
  id: number,
  data: {
    title: string;
    description: string;
    target_value: number;
    unit: string;
  }
) {
  return apiFetch(
    `/non-negotiables/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function logProgress(
  id: number,
  completed_value: number
) {
  return apiFetch(
    `/non-negotiables/${id}/log`,
    {
      method: "POST",
      body: JSON.stringify({
        completed_value,
      }),
    }
  );
}