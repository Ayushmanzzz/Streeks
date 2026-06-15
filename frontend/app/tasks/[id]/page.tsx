"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getTasks,
  updateTask,
  deleteTask,
} from "@/services/tasks";

type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  due_date: string | null;
  completed: boolean;
};

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [task, setTask] =
    useState<Task | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);
    
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  
  const [saved, setSaved] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  const [dueDate, setDueDate] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const { id } =
          await params;

        const tasks =
          await getTasks();

        const found =
          tasks.find(
            (t: Task) =>
              t.id === Number(id)
          );

        if (found) {
          setTask(found);

          setTitle(found.title);

          setDescription(
            found.description || ""
          );

          setPriority(
            found.priority
          );

          setDueDate(
            found.due_date || ""
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  async function saveChanges() {
    if (!task) return;
  
    try {
      setSaving(true);
  
      await updateTask(
        task.id,
        {
          title,
          description,
          priority,
          due_date:
            dueDate || null,
        }
      );
  
      setSaved(true);
  
      setTimeout(() => {
        setSaved(false);
      }, 2000);
  
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function toggleComplete() {
    if (!task) return;

    await updateTask(
      task.id,
      {
        completed:
          !task.completed,
      }
    );

    setTask({
      ...task,
      completed:
        !task.completed,
    });
  }

  async function removeTask() {
    if (!task) return;

    try {

        await deleteTask(
        task.id
        );

        window.location.href =
        "/tasks";

    } catch (error) {

        console.error(error);

    }
    }
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Task not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-10">

      <Link
        href="/tasks"
        className="text-zinc-500 hover:text-white"
      >
        ← Back to Tasks
      </Link>

      <div className="mt-10 max-w-3xl">

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          className="
            w-full
            bg-white/5
            border
            border-white/10
            rounded-xl
            p-4
            text-4xl
            font-bold
          "
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="
            mt-6
            w-full
            h-40
            bg-white/5
            border
            border-white/10
            rounded-xl
            p-4
          "
        />

        <div className="mt-6 grid md:grid-cols-2 gap-4">

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
            className="
              bg-white/5
              border
              border-white/10
              rounded-xl
              p-4
            "
          >
            <option>
              LOW
            </option>

            <option>
              MEDIUM
            </option>

            <option>
              HIGH
            </option>
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
              bg-white/5
              border
              border-white/10
              rounded-xl
              p-4
            "
          />

        </div>

        <div className="mt-8 flex gap-4">
        {saved && (
            <div className="text-[#00E676] font-medium">
                Changes Saved ✓
            </div>
            )}
          <button
            onClick={
              saveChanges
            }
            disabled={saving}
            className="
              rounded-xl
              bg-[#00E676]
              px-6
              py-3
              text-black
              font-semibold
            "
          >
            Save Changes
          </button>

          <button
            onClick={
              toggleComplete
            }
            className="
              rounded-xl
              border
              border-white/10
              px-6
              py-3
            "
          >
            {task.completed
              ? "Mark Pending"
              : "Mark Complete"}
          </button>

          <button
            onClick={() =>
                setShowDeleteModal(
                    true
                )
            }
            className="
              rounded-xl
              bg-red-500
              px-6
              py-3
            "
          >
            Delete
          </button>

        </div>

      </div>

      {showDeleteModal && (

        <div
        className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
        "
        >

        <div
            className="
            w-full
            max-w-md
            rounded-[32px]
            border
            border-white/10
            bg-[#111]
            p-8
            "
        >

            <h2 className="text-2xl font-bold">
            Delete Task?
            </h2>

            <p className="mt-4 text-zinc-400">
            This action cannot be
            undone.
            </p>

            <div className="mt-8 flex gap-3">

            <button
                onClick={() =>
                setShowDeleteModal(
                    false
                )
                }
                className="
                flex-1
                rounded-xl
                border
                border-white/10
                px-4
                py-3
                "
            >
                Cancel
            </button>

            <button
                onClick={
                removeTask
                }
                className="
                flex-1
                rounded-xl
                bg-red-500
                px-4
                py-3
                font-semibold
                "
            >
                Delete
            </button>

            </div>

        </div>

        </div>

        )}

    </main>
  );
}