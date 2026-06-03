import { apiFetch } from "./api";

export async function getTasks() {
    return apiFetch("/tasks");
    }

export async function createTask(data: {
    title: string;
    description: string;
    priority: string;
    due_date: string;
  }) {
    return apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

export async function updateTask(
    taskId: number,
    data: any
    ) {
    return apiFetch(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
    }

export async function deleteTask(
    taskId: number
    ) {
    return apiFetch(`/tasks/${taskId}`, {
        method: "DELETE",
    });
    }