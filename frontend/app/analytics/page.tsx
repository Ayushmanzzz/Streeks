"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Link from "next/link";

import {
  getDailyWin,
  getDailyWinStreak,
  getWeeklySummary,
} from "@/services/analytics";

export default function AnalyticsPage() {
  const [dailyWin, setDailyWin] =
    useState<boolean | null>(null);

  const [dailyWinStreak,
    setDailyWinStreak] =
    useState(0);

  const [weeklySummary,
    setWeeklySummary] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function load() {

      try {

        const [
          dailyWinData,
          streakData,
          summaryData,
        ] = await Promise.all([
          getDailyWin(),
          getDailyWinStreak(),
          getWeeklySummary(),
        ]);

        setDailyWin(
          dailyWinData.daily_win
        );

        setDailyWinStreak(
          streakData.daily_win_streak
        );

        setWeeklySummary(
          summaryData
        );

      } catch (error) {

        console.error(error);

        setError(
          "Failed to load analytics"
        );

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

  if (error) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-red-400 flex items-center justify-center">
        {error}
      </main>
    );
  }

  const consistencyScore =
    Math.round(
      (
        (weeklySummary?.weekly_win_rate || 0)
        +
        Math.min(
          dailyWinStreak * 5,
          100
        )
      ) / 2
    );

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">

      <Navbar />

      <div className="mx-auto max-w-[1600px] px-10 py-20">

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

        <h1 className="text-6xl font-bold">
          Analytics
        </h1>

        <p className="mt-4 text-zinc-500">
          Track consistency. Measure execution.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Daily Win
            </p>

            <h2
              className={`mt-3 text-5xl font-bold ${
                dailyWin === null
                  ? "text-zinc-500"
                  : dailyWin
                  ? "text-[#00E676]"
                  : "text-red-400"
              }`}
            >
              {dailyWin === null
                ? "-"
                : dailyWin
                ? "YES"
                : "NO"}
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Daily Win Streak
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              {dailyWinStreak}
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Weekly Win Rate
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              {weeklySummary?.weekly_win_rate}%
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Tasks Completed
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              {
                weeklySummary
                  ?.tasks_completed_this_week
              }
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Non-Negotiables Completed
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              {
                weeklySummary
                  ?.non_negotiables_completed_this_week
              }
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-zinc-500">
              Active Tasks
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              {
                weeklySummary
                  ?.active_tasks
              }
            </h2>
          </div>

        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

            <p className="text-zinc-500">
              Overdue Tasks
            </p>

            <h2
              className={`mt-3 text-5xl font-bold ${
                weeklySummary?.overdue_tasks > 0
                  ? "text-red-400"
                  : "text-[#00E676]"
              }`}
            >
              {
                weeklySummary
                  ?.overdue_tasks
              }
            </h2>

          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

            <p className="text-zinc-500">
              Consistency Score
            </p>

            <h2 className="mt-3 text-5xl font-bold text-[#00E676]">
              {consistencyScore}
            </h2>

            <p className="mt-3 text-zinc-500">
              Based on streak and weekly win rate
            </p>

          </div>

        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

          <p className="text-zinc-500 uppercase tracking-[0.2em] text-xs">
            Performance Summary
          </p>

          <div className="mt-8 space-y-4">

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Daily Win Status
              </span>

              <span
                className={
                  dailyWin === null
                    ? "text-zinc-500"
                    : dailyWin
                    ? "text-[#00E676]"
                    : "text-red-400"
                }
              >
                {dailyWin === null
                  ? "-"
                  : dailyWin
                  ? "Winning"
                  : "At Risk"}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Weekly Execution
              </span>

              <span>
                {
                  weeklySummary
                    ?.weekly_win_rate
                }%
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Current Streak
              </span>

              <span>
                {dailyWinStreak}
                {" "}
                Days
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Active Workload
              </span>

              <span>
                {
                  weeklySummary
                    ?.active_tasks
                }
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Tasks Completed
              </span>

              <span>
                {
                  weeklySummary
                    ?.tasks_completed_this_week
                }
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-zinc-400">
                Systems Completed
              </span>

              <span>
                {
                  weeklySummary
                    ?.non_negotiables_completed_this_week
                }
              </span>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}