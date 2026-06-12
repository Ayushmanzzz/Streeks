"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Link from "next/link";

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

    const sortedTasks = [...data].sort(
      (a, b) =>
        Number(a.completed) -
        Number(b.completed)
    );

    setTasks(sortedTasks);
  }

  async function handleCreate() {

    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    
    if (!description.trim()) {
      alert("Description is required");
      return;
    }
  
    if (!dueDate) {
      alert("Due date is required");
      return;
    }

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

  const activeTasks = tasks.filter(
    (task) => !task.completed
  );
  
  const completedTasks = tasks.filter(
    (task) => task.completed
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">

      <Navbar />

      <div className="mx-auto max-w-[1600px] px-10 py-20">

        <div className="mb-8">

          <Link
            href="/"
            className="
              inline-flex
              items-center
              text-zinc-500
              transition
              hover:text-white
            "
          >
            ← Back to Dashboard
          </Link>

          </div>

          <h1 className="text-6xl font-bold">
          Tasks
          </h1>

        <div className="mt-4">
          <p className="text-zinc-500">
            Manage execution. Win the day.
          </p>

          <p className="mt-2 text-sm text-zinc-600">
          {activeTasks.length}{" "}
            Active Tasks
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {activeTasks.map((task) => {

            const overdue =
              !task.completed &&
              new Date(task.due_date) <
                new Date(
                  new Date()
                    .toISOString()
                    .split("T")[0]
                );

            return (

              <div
                key={task.id}
                className="
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-8
                "
              >

                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold">
                    {task.title}
                  </h2>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      ${
                        task.priority === "HIGH"
                          ? "bg-red-500/10 text-red-400"
                          : task.priority === "MEDIUM"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-[#00E676]/10 text-[#00E676]"
                      }
                    `}
                  >
                    {task.priority}
                  </span>

                </div>

                <p className="mt-4 text-zinc-400">
                  {task.description}
                </p>

                <div className="mt-8">

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Due Date
                  </p>

                  <p
                    className={`mt-2 text-lg ${
                      overdue
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    {task.due_date}
                  </p>

                </div>

                <div className="mt-8">

                  <span
                    className={
                      task.completed
                        ? "text-[#00E676]"
                        : overdue
                        ? "text-red-400"
                        : "text-zinc-400"
                    }
                  >
                    {task.completed
                      ? "Completed ✓"
                      : overdue
                      ? "Overdue"
                      : "Pending"}
                  </span>

                </div>

                <div className="mt-8 flex gap-3">

                  <button
                    onClick={() =>
                      handleToggle(task)
                    }
                    className="
                      rounded-xl
                      bg-[#00E676]
                      px-4
                      py-3
                      font-semibold
                      text-black
                    "
                  >
                    {task.completed
                      ? "Undo"
                      : "Complete"}
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
                      py-3
                      text-red-400
                    "
                  >
                    Delete
                  </button>

                </div>

              </div>

            );
          })}

        </div>

        {completedTasks.length > 0 && (
          <>
            <h2 className="mt-16 mb-6 text-2xl font-bold text-zinc-500">
              Completed Tasks
            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {completedTasks.map((task) => (

                <div
                  key={task.id}
                  className="
                    rounded-[32px]
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-8
                    opacity-60
                  "
                >

                  <h2 className="text-2xl font-bold">
                    {task.title}
                  </h2>

                  <p className="mt-4 text-zinc-500">
                    {task.description}
                  </p>

                  <p className="mt-6 text-[#00E676]">
                    Completed ✓
                  </p>

                  <button
                    onClick={() =>
                      handleToggle(task)
                    }
                    className="
                      mt-6
                      rounded-xl
                      border
                      border-white/10
                      px-4
                      py-3
                    "
                  >
                    Undo
                  </button>

                </div>

              ))}

            </div>
          </>
        )}

        <div
          className="
            mt-12
            rounded-[32px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
          "
        >

          <h2 className="mb-8 text-3xl font-bold">
            Create Task
          </h2>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="
              mb-4
              w-full
              rounded-xl
              bg-black
              p-4
            "
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="
              mb-4
              w-full
              rounded-xl
              bg-black
              p-4
            "
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
            className="
              mb-4
              w-full
              rounded-xl
              bg-black
              p-4
            "
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
            className="
              mb-6
              w-full
              rounded-xl
              bg-black
              p-4
            "
          />

          <button
            onClick={handleCreate}
            className="
              rounded-xl
              bg-[#00E676]
              px-6
              py-3
              font-semibold
              text-black
            "
          >
            Create Task
          </button>

        </div>

      </div>

    </main>
  );
}