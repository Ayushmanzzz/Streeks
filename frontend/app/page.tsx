"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

import Hero from "@/components/dashboard/Hero";
import Metrics from "@/components/dashboard/Metrics";
import NonNegotiables from "@/components/dashboard/NonNegotiables";
import Tasks from "@/components/dashboard/Tasks";
import Momentum from "@/components/dashboard/Momentum";

import {
  getDashboard,
  getDailyWin,
  getDailyWinStreak,
  getWeeklySummary,
} from "@/services/dashboard";

export default function Home() {
  const [dashboard, setDashboard] =
    useState<any>(null);

  const [dailyWin, setDailyWin] =
    useState(false);

  const [streak, setStreak] =
    useState(0);

  const [summary, setSummary] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          dashboardData,
          dailyWinData,
          streakData,
          summaryData,
        ] = await Promise.all([
          getDashboard(),
          getDailyWin(),
          getDailyWinStreak(),
          getWeeklySummary(),
        ]);

        setDashboard(dashboardData);

        setDailyWin(
          dailyWinData.daily_win
        );

        setStreak(
          streakData.daily_win_streak
        );

        setSummary(summaryData);

        console.log(
          "DASHBOARD:",
          dashboardData
        );

        console.log(
          "DAILY WIN:",
          dailyWinData
        );

        console.log(
          "STREAK:",
          streakData
        );

        console.log(
          "SUMMARY:",
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
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-10">
        <Hero streak={streak} />

        <Metrics
          dailyWin={dailyWin}
          activeSystems={
            dashboard?.non_negotiables
              ?.length || 0
          }
          weeklyRate={
            summary?.weekly_win_rate || 0
          }
        />

        <NonNegotiables
          habits={
            dashboard?.non_negotiables || []
          }
        />

        <Tasks
          tasks={
            dashboard?.tasks || []
          }
        />

        <Momentum
          streak={streak}
          weeklyRate={
            summary?.weekly_win_rate || 0
          }
        />
      </div>
    </main>
  );
}