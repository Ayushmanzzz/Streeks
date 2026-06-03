"use client";

import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/tasks";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  due_date: string;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  const [dueDate, setDueDate] =
    useState("");

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  async function handleCreate() {
    try {
      await createTask({
        title,
        description,
        priority,
        due_date: dueDate,
      });

      await loadTasks();

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(
    taskId: number
  ) {
    try {
      await deleteTask(taskId);

      await loadTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggle(
    task: Task
  ) {
    try {
      await updateTask(task.id, {
        completed: !task.completed,
      });

      await loadTasks();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        await loadTasks();
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-[1400px] px-10 py-20">
  
        <h1 className="text-5xl font-bold">
          Tasks
        </h1>
  
        {/* TASK LIST */}
  
        <div className="mt-10 space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="
                rounded-2xl
                border
                border-white/10
                p-6
              "
            >
              <h2 className="text-2xl font-bold">
                {task.title}
              </h2>
  
              <p className="mt-2 text-zinc-400">
                {task.description}
              </p>
  
              <p className="mt-4">
                Priority: {task.priority}
              </p>
  
              <p>
                Due: {task.due_date}
              </p>
  
              <p>
                Status:{" "}
                {task.completed
                  ? "Completed"
                  : "Pending"}
              </p>
  
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    handleToggle(task)
                  }
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2
                  "
                >
                  Toggle
                </button>
  
                <button
                  onClick={() =>
                    handleDelete(task.id)
                  }
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    px-4
                    py-2
                    text-red-400
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* CREATE TASK */}
  
        <div className="mt-10 rounded-[32px] border border-white/10 p-8">
  
          <input
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="mb-4 w-full rounded-xl bg-black p-4"
          />
  
          <input
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="mb-4 w-full rounded-xl bg-black p-4"
          />
  
          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
            className="mb-4 w-full rounded-xl bg-black p-4"
          >
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
  
          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
            className="mb-4 w-full rounded-xl bg-black p-4"
          />
  
          <button
            onClick={handleCreate}
            className="rounded-xl bg-[#00E676] px-6 py-3 text-black"
          >
            Create Task
          </button>
  
        </div>
  
      </div>
    </main>
  );
}