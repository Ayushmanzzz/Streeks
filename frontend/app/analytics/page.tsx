"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  getDailyWin,
  getDailyWinStreak,
  getWeeklySummary,
} from "@/services/analytics";

export default function AnalyticsPage() {

  const [dailyWin, setDailyWin] =
    useState(false);

  const [dailyWinStreak,
    setDailyWinStreak] =
    useState(0);

  const [weeklySummary,
    setWeeklySummary] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const dailyWinData =
          await getDailyWin();

        const streakData =
          await getDailyWinStreak();

        const summaryData =
          await getWeeklySummary();

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
    <main className="min-h-screen bg-[#0A0A0A] text-white p-10">

      <Link
        href="/"
        className="
          mb-8
          inline-flex
          items-center
          text-zinc-500
          transition
          hover:text-white
        "
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-6xl font-bold">
        Analytics
      </h1>

      <div className="mt-12 grid gap-6 md:grid-cols-3">

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-zinc-500">
            Daily Win
          </p>

          <h2
            className={`mt-3 text-5xl font-bold ${
              dailyWin
                ? "text-[#00E676]"
                : "text-red-400"
            }`}
          >
            {dailyWin
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
            {
              weeklySummary
                ?.weekly_win_rate
            }%
          </h2>
        </div>

      </div>

      <div
        className="
          mt-10
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          p-8
        "
      >
        <h2 className="text-3xl font-bold">
          Weekly Summary
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-zinc-500">
              Tasks Completed
            </p>

            <h3 className="mt-2 text-4xl font-bold">
              {
                weeklySummary
                  ?.tasks_completed_this_week
              }
            </h3>
          </div>

          <div>
            <p className="text-zinc-500">
              Non-Negotiables Completed
            </p>

            <h3 className="mt-2 text-4xl font-bold">
              {
                weeklySummary
                  ?.non_negotiables_completed_this_week
              }
            </h3>
          </div>

        </div>
      </div>

    </main>
  );
}