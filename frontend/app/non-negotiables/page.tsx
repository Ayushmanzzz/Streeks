"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

import Link from "next/link";
import {
  getNonNegotiables,
  createNonNegotiable,
  archiveNonNegotiable,
  updateNonNegotiable
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

  const [editingHabit, setEditingHabit] =
  useState<NonNegotiable | null>(null);

  const [archiveTarget, setArchiveTarget] =
    useState<NonNegotiable | null>(null);

  const [showArchiveModal, setShowArchiveModal] =
    useState(false);

  async function handleCreate() {
    try {
      if (!title.trim()) {
        alert("Title is required");
        return;
      }
  
      if (!unit.trim()) {
        alert("Unit is required");
        return;
      }
  
      if (editingHabit) {
  
        await updateNonNegotiable(
          editingHabit.id,
          {
            title,
            description,
            target_value:
              targetValue,
            unit,
          }
        );
  
      } else {
  
        await createNonNegotiable({
          title,
          description,
          target_value:
            targetValue,
          unit,
        });
  
      }
  
      const updated =
        await getNonNegotiables();
  
      setHabits(updated);
  
      setEditingHabit(
        null
      );
  
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
    habit: NonNegotiable
  ) {
    try {
  
      console.log(
        "TARGET:",
        habit.target_value
      );
  
      const result =
        await logProgress(
          habit.id,
          1
        );
  
      console.log(
        "RESULT:",
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
      
      <Navbar />
      
      <div className="mx-auto max-w-[1400px] px-10 py-20">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          text-zinc-500
          transition
          hover:text-white
          mb-8
        "
      >
        ← Back to Dashboard
      </Link>

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
          <Link
            href={`/non-negotiables/${habit.id}`}
            key={habit.id}
          >
            <div
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

              <div className="mt-6 space-y-3">

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Current Streak
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {habit.current_streak ?? 0} Days
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Longest Streak
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {habit.longest_streak ?? 0} Days
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Completion Rate
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {habit.completion_rate ?? 0}%
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Today
                  </p>

                  <p
                    className={`mt-1 text-lg ${
                      habit.today_completed
                        ? "text-[#00E676]"
                        : "text-zinc-400"
                    }`}
                  >
                    {habit.today_completed
                      ? "Completed ✓"
                      : `${habit.today_progress ?? 0}/${habit.target_value}`}
                  </p>
                </div>

              </div>

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
                disabled={
                  habit.today_completed
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  handleComplete(
                    habit
                  );
                }}
                className="
                  rounded-xl
                  bg-[#00E676]
                  px-4
                  py-3
                  font-semibold
                  text-black
                  disabled:opacity-50
                "
              >
                {habit.today_completed
                  ? "Completed ✓"
                  : "Complete Today"}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setEditingHabit(
                    habit
                  );

                  setTitle(
                    habit.title
                  );

                  setDescription(
                    habit.description
                  );

                  setTargetValue(
                    habit.target_value
                  );

                  setUnit(
                    habit.unit
                  );
                }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setArchiveTarget(habit);
                    setShowArchiveModal(true);
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
            </Link>
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
              {
                editingHabit
                  ? "Update System"
                  : "Create System"
              }
            </button>

          </div>
        </div>

      </div>

      {showArchiveModal && archiveTarget && (

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
            Archive System?
          </h2>

          <p className="mt-4 text-zinc-400">
            Are you sure you want to archive
            {" "}
            <span className="text-white">
              {archiveTarget.title}
            </span>
            ?
          </p>

          <div className="mt-8 flex gap-3">

            <button
              onClick={() => {
                setShowArchiveModal(false);
                setArchiveTarget(null);
              }}
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
              onClick={async () => {

                await handleArchive(
                  archiveTarget.id
                );

                setShowArchiveModal(false);

                setArchiveTarget(null);

              }}
              className="
                flex-1
                rounded-xl
                bg-red-500
                px-4
                py-3
                font-semibold
                text-white
              "
            >
              Archive
            </button>

          </div>

        </div>

      </div>

      )}

    </main>
  );
}