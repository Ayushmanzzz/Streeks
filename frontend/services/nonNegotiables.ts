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

export async function getStreak(
    nonNegotiableId: number
  ) {
    return apiFetch(
      `/non-negotiables/${nonNegotiableId}/streak`
    );
  }
  
  export async function getLongestStreak(
    nonNegotiableId: number
  ) {
    return apiFetch(
      `/non-negotiables/${nonNegotiableId}/longest-streak`
    );
  }
  
  export async function getCompletionRate(
    nonNegotiableId: number
  ) {
    return apiFetch(
      `/non-negotiables/${nonNegotiableId}/completion-rate`
    );
  }
  
  export async function getHeatmap(
    nonNegotiableId: number
  ) {
    return apiFetch(
      `/non-negotiables/${nonNegotiableId}/heatmap`
    );
  }