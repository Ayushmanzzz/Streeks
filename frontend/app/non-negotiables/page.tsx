"use client";

import { useEffect, useState } from "react";

import {
  getNonNegotiables,
  createNonNegotiable,
  archiveNonNegotiable
} from "@/services/nonNegotiables";

import {
    logProgress,
  } from "@/services/nonNegotiableLogs";

  type NonNegotiable = {
    id: number;
    title: string;
    description: string;
    target_value: number;
    unit: string;
    is_active: boolean;
  
    current_streak?: number;
    longest_streak?: number;
    completion_rate?: number;
  
    today_completed?: boolean;
    today_progress?: number;
  };

export default function NonNegotiablesPage() {
  const [habits, setHabits] =
    useState<NonNegotiable[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [targetValue, setTargetValue] =
    useState(1);

  const [unit, setUnit] =
    useState("");

  async function handleCreate() {
    try {
      await createNonNegotiable({
        title,
        description,
        target_value: targetValue,
        unit,
      });

      const updated =
        await getNonNegotiables();

      setHabits(updated);

      setTitle("");
      setDescription("");
      setTargetValue(1);
      setUnit("");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleArchive(
    id: number
  ) {
    try {
      await archiveNonNegotiable(id);
  
      const updated =
        await getNonNegotiables();
  
      setHabits(updated);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleComplete(
    habitId: number
  ) {
    try {
        const result =
        await logProgress(
          habitId,
          1
        );
      
      console.log(
        "LOG CREATED:",
        result
      );

      const updated =
        await getNonNegotiables();

      setHabits(updated);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getNonNegotiables();

        setHabits(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-[1400px] px-10 py-20">

        <div className="mb-12">
          <h1 className="text-5xl font-bold">
            Non-Negotiables
          </h1>

          <p className="mt-3 text-zinc-500">
            Manage your systems.
          </p>
        </div>

        {/* HABITS */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {habits.map((habit) => (
            <div
              key={habit.id}
              className="
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.03]
                p-8
                backdrop-blur-xl
              "
            >
              <h2 className="text-3xl font-bold">
                {habit.title}
              </h2>

              <p className="mt-4 text-zinc-400">
                {habit.description}
              </p>

              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  Target
                </p>

                <p className="mt-2 text-xl">
                  {habit.target_value}{" "}
                  {habit.unit}
                </p>
              </div>

              <div className="mt-8">
                <span
                  className={`
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    ${
                      habit.is_active
                        ? "bg-[#00E676]/10 text-[#00E676]"
                        : "bg-red-500/10 text-red-400"
                    }
                  `}
                >
                  {habit.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="mt-10 flex gap-3">

                <button
                  onClick={() =>
                    handleComplete(
                      habit.id
                    )
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
                  Complete Today
                </button>

                <button
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-3
                    transition
                    hover:border-white/20
                  "
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    try {
                      await archiveNonNegotiable(habit.id);

                      const updated =
                        await getNonNegotiables();

                      setHabits(updated);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    px-4
                    py-3
                    text-red-400
                    transition
                    hover:bg-red-500/10
                  "
                >
                  Archive
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* CREATE FORM */}

        <div
          className="
            mt-16
            rounded-[32px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
            backdrop-blur-xl
          "
        >
          <h2 className="text-3xl font-bold">
            Create New System
          </h2>

          <div className="mt-8 space-y-4">

            <input
              placeholder="Title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="
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
                w-full
                rounded-xl
                bg-black
                p-4
              "
            />

            <input
              type="number"
              placeholder="Target Value"
              value={targetValue}
              onChange={(e) =>
                setTargetValue(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
                w-full
                rounded-xl
                bg-black
                p-4
              "
            />

            <input
              placeholder="Unit"
              value={unit}
              onChange={(e) =>
                setUnit(
                  e.target.value
                )
              }
              className="
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
              Create System
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}