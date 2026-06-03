import { apiFetch } from "./api";

export async function logProgress(
  nonNegotiableId: number,
  completedValue: number
) {
  return apiFetch(
    `/non-negotiables/${nonNegotiableId}/log`,
    {
      method: "POST",
      body: JSON.stringify({
        completed_value: completedValue,
      }),
    }
  );
}